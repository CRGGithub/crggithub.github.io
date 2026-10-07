/* ---------------------------------------------------------------------------
 * EUMETSAT WMS viewer
 *
 * Two things drive the design here.
 *
 * 1. This GeoServer renders only the FIRST layer of a multi-layer GetMap
 *    request. Asking for "satellite,lightning,coastline,borders" silently
 *    returns just the satellite image - no error, no warning. So each layer is
 *    fetched as its own image and the browser stacks them.
 *
 * 2. Timing. Each instrument has a fixed repeat cycle (`cadence`, minutes) and
 *    the archive needs a while to ingest a slot (`lag`, minutes). Asking for
 *    "now" reliably returns a blank image, and asking for no time at all makes
 *    GeoServer stitch together whatever chunks are present, which shows up as
 *    visible seams. So every request pins an explicit slot: round down to the
 *    cadence grid, then step back far enough that the data is certainly there.
 *
 * The boundary layers are vector and carry no time dimension, so they are
 * fetched once per region and reused across every frame and product.
 * ------------------------------------------------------------------------- */
(function () {
  'use strict';

  var root = document.querySelector('[data-satview]');
  if (!root || !window.LekwenaWMS) { return; }

  var cfgNode = document.getElementById('satview-config');
  if (!cfgNode) { return; }

  var cfg;
  try {
    cfg = JSON.parse(cfgNode.textContent);
  } catch (e) {
    return;
  }

  var FRAMES = 12;
  var MINUTE = 60 * 1000;
  var STORE_KEY = 'lekwena-sat-boundaries';

  var el = {
    stage:     root.querySelector('[data-sat-stage]'),
    base:      root.querySelector('[data-sat-base]'),
    overlay:   root.querySelector('[data-sat-overlay]'),
    bounds:    root.querySelector('[data-sat-bounds]'),
    error:     root.querySelector('[data-sat-error]'),
    products:  root.querySelector('[data-sat-products]'),
    views:     root.querySelector('[data-sat-views]'),
    boundsBtn: root.querySelector('[data-sat-bounds-toggle]'),
    slider:    root.querySelector('[data-sat-slider]'),
    stamp:     root.querySelector('[data-sat-stamp]'),
    prev:      root.querySelector('[data-sat-prev]'),
    next:      root.querySelector('[data-sat-next]'),
    play:      root.querySelector('[data-sat-play]'),
    caption:   root.querySelector('[data-sat-caption]'),
    download:  root.querySelector('[data-sat-download]')
  };

  function storedBoundaries() {
    try {
      var v = localStorage.getItem(STORE_KEY);
      if (v === 'off') { return false; }
    } catch (e) { /* private mode - fall through to the default */ }
    return true;
  }

  var state = {
    product: cfg.products.filter(function (p) { return p['default']; })[0] || cfg.products[0],
    view: cfg.views[0],
    frame: FRAMES - 1,          // 0 = oldest in the window, FRAMES-1 = newest
    boundaries: storedBoundaries(),
    playing: false,
    timer: null,
    // Newest slot of the loop. Fixed while the visitor scrubs or plays, so a
    // frame keeps meaning the same time however long the page stays open; it
    // moves only on load, on a product change, and when the page rolls forward
    // while parked on the newest frame.
    anchor: null,
    // What is actually on screen, which can lag what was asked for.
    shown: null
  };

  /* -- Time and request building ----------------------------------------
   * The pure helpers live in wms.js, shared with the home page frame. */

  var W = window.LekwenaWMS;
  var latestSlot = W.latestSlot;
  var alignTo = W.alignTo;
  var isoZ = W.isoZ;
  var sast = W.sast;

  function refreshAnchor() {
    state.anchor = latestSlot(state.product.cadence, state.product.lag);
  }

  function slotForFrame(product, frame) {
    var back = (FRAMES - 1 - frame) * product.cadence * MINUTE;
    return new Date(state.anchor.getTime() - back);
  }

  function stampText(when) {
    return isoZ(when).replace('T', ' ').replace(':00Z', 'Z') + '  (' + sast(when) + ' SAST)';
  }

  function buildUrl(layer, view, when, width, opaque) {
    return W.buildUrl(cfg.wms, layer, view, when, width, opaque);
  }

  /* -- Boundary layers ---------------------------------------------------- */

  var boundsForView = null;

  function renderBoundaries() {
    el.bounds.hidden = !state.boundaries;
    el.boundsBtn.setAttribute('aria-pressed', String(state.boundaries));

    if (!state.boundaries || boundsForView === state.view.id) { return; }
    boundsForView = state.view.id;

    el.bounds.replaceChildren();
    cfg.boundaries.forEach(function (b) {
      var img = document.createElement('img');
      img.className = 'satview__layer';
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      img.decoding = 'async';
      el.bounds.appendChild(img);
      W.loadLayer(img, buildUrl(b.layer, state.view, null, null, false));
    });
  }

  /* -- Rendering ---------------------------------------------------------- */

  var pending = 0;

  /* Load the base and its overlay off-screen, then swap both - and the labels
   * that describe them - at once, so a half-updated frame is never on screen
   * and the time stamp always belongs to the image under it. `commit` runs only
   * when the base image has arrived; on failure the previous frame and its
   * labels stay, and the error names the frame that could not be shown. */
  function show(baseUrl, overlayUrl, requested, commit, retry) {
    var token = ++pending;
    var waiting = overlayUrl ? 2 : 1;
    var failed = false;
    var loaded = {};
    var settled = false;

    el.stage.classList.add('is-loading');
    el.error.hidden = true;

    // A request that neither loads nor errors - a stalled connection, a proxy
    // holding it open - would otherwise leave the stage dimmed for good.
    var guard = setTimeout(function () {
      if (token !== pending || settled) { return; }
      el.stage.classList.remove('is-loading');
      el.error.hidden = false;
      el.error.textContent = 'Still waiting for EUMETSAT to return ' + stampText(requested) +
        (state.shown ? '; showing ' + stampText(state.shown) + ' meanwhile.' : '.');
    }, 30000);

    function done() {
      if (token !== pending) { return; }           // a newer request won
      settled = true;
      clearTimeout(guard);
      el.stage.classList.remove('is-loading');

      if (failed) {
        if (retry && retry()) { return; }       // handled by stepping back a slot
        if (!state.shown) { el.stamp.textContent = 'unavailable'; }
        el.error.hidden = false;
        el.error.textContent = 'EUMETSAT did not return ' + stampText(requested) +
          (state.shown ? '; still showing ' + stampText(state.shown) + '.' : '.') +
          ' Try an earlier frame.';
        return;
      }
      el.error.hidden = true;
      el.base.src = loaded.base;
      // Only show an overlay that actually loaded. A failed one would otherwise
      // be assigned an undefined src and drawn as a broken image over the frame.
      var overlayOk = !!(overlayUrl && loaded.overlay);
      if (overlayOk) {
        W.loadLayer(el.overlay, loaded.overlay);
        el.overlay.hidden = false;
      } else {
        el.overlay.removeAttribute('src');
        el.overlay.hidden = true;
      }
      state.shown = requested;
      commit(overlayUrl && !overlayOk);
    }

    function load(url, key, required) {
      var probe = new Image();
      probe.decoding = 'async';
      probe.onload = function () {
        loaded[key] = probe.src;
        if (--waiting === 0) { done(); }
      };
      probe.onerror = function () {
        // A missing overlay is normal - no lightning, no fires, no tracked
        // cells. Only a missing base image is an actual failure.
        if (required) { failed = true; }
        if (--waiting === 0) { done(); }
      };
      probe.src = url;
    }

    load(baseUrl, 'base', true);
    if (overlayUrl) { load(overlayUrl, 'overlay', false); }
  }

  function urlsForFrame(product, view, frame, width) {
    var when = slotForFrame(product, frame);
    var out = {
      when: when,
      base: buildUrl(product.base, view, when, width, true),
      overlay: null
    };
    if (product.overlay) {
      var oWhen = alignTo(when, product.overlay_cadence || product.cadence);
      out.overlay = buildUrl(product.overlay, view, oWhen, width, false);
    }
    return out;
  }

  function render(attempt, startAnchor) {
    attempt = attempt || 0;
    startAnchor = startAnchor || state.anchor;
    var product = state.product;
    var view = state.view;
    var u = urlsForFrame(product, view, state.frame);

    // Boundaries carry no time, so on first paint they go up straight away -
    // a slow or failed first frame must not leave the map without them. After
    // that they wait for the image, so a region switch never pairs the new
    // region's borders with the old region's picture.
    if (!state.shown) { renderBoundaries(); }
    var download = el.download ? urlsForFrame(product, view, state.frame, 2400).base : null;

    // The control reflects the selection immediately...
    el.slider.value = String(state.frame);
    el.slider.setAttribute('aria-valuetext', stampText(u.when));
    el.prev.disabled = state.frame === 0;
    el.next.disabled = state.frame === FRAMES - 1;

    // ...but everything that describes the picture waits for the picture.
    show(u.base, u.overlay, u.when, function (overlayMissing) {
      renderBoundaries();
      el.stamp.textContent = stampText(u.when);
      el.base.alt = product.title + ' over ' + view.title + ', ' + isoZ(u.when);
      if (el.download) { el.download.href = download; }

      var parts = ['<p><strong>' + product.title + '</strong> &mdash; ' +
        product.satellite + ', ' + product.cadence + ' minute repeat cycle. ' +
        product.blurb + '</p>'];
      if (product.daylight_only) {
        parts.push('<p><em>Daylight product &mdash; frames after sunset are black.</em></p>');
      }
      if (overlayMissing) {
        parts.push('<p><em>The overlay layer is unavailable for this slot, so it is not drawn. ' +
          'That is missing data, not an absence of activity.</em></p>');
      }
      el.caption.innerHTML = parts.join('');
    }, function () {
      // The newest slot is sometimes not ingested yet despite the lag allowance,
      // or a request just fails. On the newest frame, step the window back one
      // slot and try again rather than opening the viewer on an error. A frame
      // the visitor scrubbed to is left to report its own failure.
      if (state.frame !== FRAMES - 1) { return false; }
      if (attempt >= 3) {
        state.anchor = startAnchor;            // give up without shifting the window
        return false;
      }
      state.anchor = new Date(state.anchor.getTime() - product.cadence * MINUTE);
      render(attempt + 1, startAnchor);
      return true;
    });
  }

  /* Warm the neighbouring frames so scrubbing does not stall. */
  function prefetch() {
    [state.frame - 1, state.frame + 1].forEach(function (f) {
      if (f < 0 || f > FRAMES - 1) { return; }
      var u = urlsForFrame(state.product, state.view, f);
      new Image().src = u.base;
      if (u.overlay) { new Image().src = u.overlay; }
    });
  }

  function goto(frame) {
    state.frame = Math.min(FRAMES - 1, Math.max(0, frame));
    render();
    prefetch();
  }

  /* -- Chips -------------------------------------------------------------- */

  function buildChips(host, items, isSelected, onPick) {
    host.replaceChildren();
    items.forEach(function (item) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = item.title;
      b.setAttribute('aria-pressed', String(isSelected(item)));
      b.addEventListener('click', function () {
        onPick(item);
        Array.prototype.forEach.call(host.children, function (c) {
          c.setAttribute('aria-pressed', String(c === b));
        });
      });
      host.appendChild(b);
    });
  }

  buildChips(el.products, cfg.products,
    function (p) { return p === state.product; },
    function (p) {
      state.product = p;
      state.frame = FRAMES - 1;          // cadences differ, so restart at latest
      refreshAnchor();
      goto(state.frame);
    });

  buildChips(el.views, cfg.views,
    function (v) { return v === state.view; },
    function (v) { state.view = v; render(); });

  el.boundsBtn.addEventListener('click', function () {
    state.boundaries = !state.boundaries;
    try {
      localStorage.setItem(STORE_KEY, state.boundaries ? 'on' : 'off');
    } catch (e) { /* private mode - the choice just will not persist */ }
    renderBoundaries();
  });

  /* -- Scrubbing and playback --------------------------------------------- */

  el.slider.max = String(FRAMES - 1);
  el.slider.addEventListener('input', function () {
    stop();
    goto(parseInt(el.slider.value, 10));
  });

  el.prev.addEventListener('click', function () { stop(); goto(state.frame - 1); });
  el.next.addEventListener('click', function () { stop(); goto(state.frame + 1); });

  function stop() {
    state.playing = false;
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
    el.play.setAttribute('aria-pressed', 'false');
    el.play.setAttribute('aria-label', 'Play the loop');
    el.play.querySelector('[data-play-icon]').hidden = false;
    el.play.querySelector('[data-pause-icon]').hidden = true;
  }

  function start() {
    state.playing = true;
    el.play.setAttribute('aria-pressed', 'true');
    el.play.setAttribute('aria-label', 'Pause the loop');
    el.play.querySelector('[data-play-icon]').hidden = true;
    el.play.querySelector('[data-pause-icon]').hidden = false;

    state.timer = setInterval(function () {
      goto(state.frame >= FRAMES - 1 ? 0 : state.frame + 1);
    }, 700);
  }

  el.play.addEventListener('click', function () {
    if (state.playing) { stop(); } else { start(); }
  });

  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { stop(); goto(state.frame - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { stop(); goto(state.frame + 1); e.preventDefault(); }
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden && state.playing) { stop(); }
  });

  /* Roll the window forward as new slots appear, but only while parked on the
   * newest frame, so a visitor who has scrubbed back is left alone. */
  setInterval(function () {
    if (!state.playing && state.frame === FRAMES - 1) { refreshAnchor(); render(); }
  }, 5 * MINUTE);

  refreshAnchor();
  render();
  prefetch();
})();
