/* ---------------------------------------------------------------------------
 * EUMETSAT WMS viewer
 *
 * Builds GetMap requests against view.eumetsat.int for one product, one
 * geographic view and one time slot at a time, and lets the visitor scrub or
 * animate through the most recent slots.
 *
 * Timing is the fiddly part. Each instrument has a fixed repeat cycle
 * (`cadence`, minutes) and the archive needs a while to ingest a slot
 * (`lag`, minutes). Asking for "now" reliably returns a blank image, and
 * asking for no time at all makes GeoServer stitch together whatever chunks
 * happen to be present, which shows up as visible seams across the disc. So
 * every request pins an explicit slot: round down to the cadence grid, then
 * step back far enough that the data is certainly there.
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

  var el = {
    stage:    root.querySelector('[data-sat-stage]'),
    img:      root.querySelector('[data-sat-img]'),
    error:    root.querySelector('[data-sat-error]'),
    products: root.querySelector('[data-sat-products]'),
    views:    root.querySelector('[data-sat-views]'),
    slider:   root.querySelector('[data-sat-slider]'),
    stamp:    root.querySelector('[data-sat-stamp]'),
    prev:     root.querySelector('[data-sat-prev]'),
    next:     root.querySelector('[data-sat-next]'),
    play:     root.querySelector('[data-sat-play]'),
    caption:  root.querySelector('[data-sat-caption]'),
    download: root.querySelector('[data-sat-download]')
  };

  var state = {
    product: cfg.products.find(function (p) { return p.default; }) || cfg.products[0],
    view: cfg.views[0],
    // 0 = oldest frame in the window, FRAMES - 1 = most recent
    frame: FRAMES - 1,
    playing: false,
    timer: null
  };

  /* -- Time helpers ------------------------------------------------------- */

  /* The newest slot we are willing to ask for, as a Date. */
  function latestSlot(product) {
    var step = product.cadence * MINUTE;
    var target = Date.now() - product.lag * MINUTE;
    return new Date(Math.floor(target / step) * step);
  }

  function slotForFrame(product, frame) {
    var back = (FRAMES - 1 - frame) * product.cadence * MINUTE;
    return new Date(latestSlot(product).getTime() - back);
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

  function humanStamp(d) {
    return isoZ(d).replace('T', ' ').replace(':00Z', 'Z') + '  (' + sast(d) + ' SAST)';
  }

  /* -- Request building --------------------------------------------------- */

  function buildUrl(product, view, when, width) {
    var w = width || view.width;
    var h = Math.round(w * (view.height / view.width));

    var params = [
      'service=WMS',
      'version=1.3.0',
      'request=GetMap',
      'styles=',
      'format=image/jpeg',
      'bgcolor=0x000000',
      'transparent=false',
      // WMS 1.3.0 renamed SRS to CRS, but the AUTO projections are still
      // addressed the old way by this GeoServer instance.
      (view.crs.indexOf('AUTO') === 0 ? 'srs=' : 'crs=') + encodeURIComponent(view.crs),
      'bbox=' + encodeURIComponent(view.bbox),
      'width=' + w,
      'height=' + h,
      'layers=' + encodeURIComponent(product.layers + ',' + cfg.overlay),
      'time=' + encodeURIComponent(isoZ(when))
    ];
    return cfg.wms + '?' + params.join('&');
  }

  /* -- Rendering ---------------------------------------------------------- */

  var pending = 0;

  function show(url) {
    var token = ++pending;
    el.stage.classList.add('is-loading');
    el.error.hidden = true;

    var probe = new Image();
    probe.decoding = 'async';
    probe.onload = function () {
      if (token !== pending) { return; }        // a newer request won
      el.img.src = probe.src;
      el.stage.classList.remove('is-loading');
    };
    probe.onerror = function () {
      if (token !== pending) { return; }
      el.stage.classList.remove('is-loading');
      el.error.hidden = false;
      el.error.textContent =
        'EUMETSAT did not return an image for this slot. Try an earlier frame.';
    };
    probe.src = url;
  }

  function render() {
    var when = slotForFrame(state.product, state.frame);
    var url = buildUrl(state.product, state.view, when);

    show(url);
    el.stamp.textContent = humanStamp(when);
    el.img.alt = state.product.title + ' over ' + state.view.title +
      ', ' + isoZ(when);

    if (el.download) {
      // A bigger render of the same scene, for printing or a slide.
      el.download.href = buildUrl(state.product, state.view, when, 2400);
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
      var img = new Image();
      img.src = buildUrl(state.product, state.view, slotForFrame(state.product, f));
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
      state.frame = FRAMES - 1;           // cadences differ, so restart at latest
      goto(state.frame);
    });

  buildChips(el.views, cfg.views,
    function (v) { return v === state.view; },
    function (v) { state.view = v; render(); });

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
      // Hold a beat on the newest frame before wrapping round.
      var next = state.frame >= FRAMES - 1 ? 0 : state.frame + 1;
      goto(next);
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
