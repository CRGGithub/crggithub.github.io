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
  if (!root) { return; }

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
    timer: null
  };

  /* -- Time --------------------------------------------------------------- */

  function latestSlot(cadence, lag) {
    var step = cadence * MINUTE;
    return new Date(Math.floor((Date.now() - lag * MINUTE) / step) * step);
  }

  function slotForFrame(product, frame) {
    var back = (FRAMES - 1 - frame) * product.cadence * MINUTE;
    return new Date(latestSlot(product.cadence, product.lag).getTime() - back);
  }

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function isoZ(d) {
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) +
      'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':00Z';
  }

  /* SAST is UTC+2 with no daylight saving, so a flat offset is exact. */
  function sast(d) {
    var t = new Date(d.getTime() + 2 * 60 * MINUTE);
    return pad(t.getUTCHours()) + ':' + pad(t.getUTCMinutes());
  }

  /* Round a base slot onto an overlay's own, usually finer, cadence grid. */
  function alignTo(when, cadence) {
    var step = cadence * MINUTE;
    return new Date(Math.floor(when.getTime() / step) * step);
  }

  /* -- Request building --------------------------------------------------- */

  function buildUrl(layer, view, when, width, opaque) {
    var w = width || view.width;
    var h = Math.round(w * (view.height / view.width));

    var params = [
      'service=WMS',
      'version=1.3.0',
      'request=GetMap',
      'styles=',
      'format=' + (opaque ? 'image/jpeg' : 'image/png'),
      'transparent=' + (opaque ? 'false' : 'true'),
      // WMS 1.3.0 renamed SRS to CRS, but this GeoServer still addresses the
      // AUTO projections the old way.
      (view.crs.indexOf('AUTO') === 0 ? 'srs=' : 'crs=') + encodeURIComponent(view.crs),
      'bbox=' + encodeURIComponent(view.bbox),
      'width=' + w,
      'height=' + h,
      'layers=' + encodeURIComponent(layer)
    ];
    if (opaque) { params.push('bgcolor=0x000000'); }
    if (when) { params.push('time=' + encodeURIComponent(isoZ(when))); }
    return cfg.wms + '?' + params.join('&');
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
      img.src = buildUrl(b.layer, state.view, null, null, false);
      el.bounds.appendChild(img);
    });
  }

  /* -- Rendering ---------------------------------------------------------- */

  var pending = 0;

  /* Load the base and its overlay off-screen, then swap both at once so a
   * half-updated frame is never on screen. */
  function show(baseUrl, overlayUrl) {
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
      if (token === pending && !settled) { el.stage.classList.remove('is-loading'); }
    }, 30000);

    function done() {
      if (token !== pending) { return; }           // a newer request won
      settled = true;
      clearTimeout(guard);
      el.stage.classList.remove('is-loading');

      if (failed) {
        el.error.hidden = false;
        el.error.textContent =
          'EUMETSAT did not return an image for this slot. Try an earlier frame.';
        return;
      }
      el.base.src = loaded.base;
      if (overlayUrl) {
        el.overlay.src = loaded.overlay;
        el.overlay.hidden = false;
      } else {
        el.overlay.removeAttribute('src');
        el.overlay.hidden = true;
      }
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

  function render() {
    var u = urlsForFrame(state.product, state.view, state.frame);

    show(u.base, u.overlay);
    renderBoundaries();

    el.stamp.textContent =
      isoZ(u.when).replace('T', ' ').replace(':00Z', 'Z') + '  (' + sast(u.when) + ' SAST)';
    el.base.alt = state.product.title + ' over ' + state.view.title + ', ' + isoZ(u.when);

    if (el.download) {
      el.download.href = urlsForFrame(state.product, state.view, state.frame, 2400).base;
    }

    var parts = ['<p><strong>' + state.product.title + '</strong> &mdash; ' +
      state.product.satellite + ', ' + state.product.cadence + ' minute repeat cycle. ' +
      state.product.blurb + '</p>'];
    if (state.product.daylight_only) {
      parts.push('<p><em>Daylight product &mdash; frames after sunset are black.</em></p>');
    }
    el.caption.innerHTML = parts.join('');

    el.slider.value = String(state.frame);
    el.prev.disabled = state.frame === 0;
    el.next.disabled = state.frame === FRAMES - 1;
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
    if (!state.playing && state.frame === FRAMES - 1) { render(); }
  }, 5 * MINUTE);

  render();
  prefetch();
})();
