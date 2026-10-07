/* ---------------------------------------------------------------------------
 * Current satellite frame on the home page
 *
 * A single, non-interactive frame of the satellite viewer's default product
 * and region, stacked exactly as the viewer stacks it: the base image, its
 * overlay, and the boundary layers, each as its own WMS request. The time
 * logic and URL building are shared with satellite.js through wms.js.
 *
 * It exists because EUMETSAT serves over https, so unlike anything from the
 * campus data server it renders for every visitor.
 * ------------------------------------------------------------------------- */
(function () {
  'use strict';

  var root = document.querySelector('[data-satstill]');
  var cfgNode = document.getElementById('satstill-config');
  if (!root || !cfgNode || !window.LekwenaWMS) { return; }

  var cfg;
  try { cfg = JSON.parse(cfgNode.textContent); } catch (e) { return; }

  var W = window.LekwenaWMS;
  var product = cfg.product;
  var view = cfg.view;

  var stage = root.querySelector('[data-satstill-stage]');
  var base = root.querySelector('[data-satstill-base]');
  var overlay = root.querySelector('[data-satstill-overlay]');
  var bounds = root.querySelector('[data-satstill-bounds]');
  var stamp = root.querySelector('[data-satstill-stamp]');

  // Boundaries carry no time dimension, so they are requested once.
  cfg.boundaries.forEach(function (b) {
    var img = document.createElement('img');
    img.className = 'satview__layer';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.decoding = 'async';
    bounds.appendChild(img);
    W.loadLayer(img, W.buildUrl(cfg.wms, b.layer, view, null, null, false));
  });

  var shown = null;

  /* Load off-screen and swap in only once the base has arrived, so a slow
   * request never leaves a blank frame. The newest slot occasionally is not
   * ingested yet despite the lag allowance; step back a slot and try again
   * rather than showing nothing. */
  function load(stepsBack) {
    var step = product.cadence * W.MINUTE;
    var when = new Date(W.latestSlot(product.cadence, product.lag).getTime() - stepsBack * step);
    if (shown && when.getTime() === shown.getTime()) { return; }

    var probe = new Image();
    probe.decoding = 'async';
    probe.onload = function () {
      shown = when;
      base.src = probe.src;
      base.alt = product.title + ' over ' + view.title + ', ' +
        W.isoZ(when).replace('T', ' ').replace(':00Z', ' UTC');
      stamp.textContent = W.isoZ(when).slice(11, 16) + ' UTC · ' + W.sast(when) + ' SAST';
      stage.classList.remove('is-loading');

      if (product.overlay) {
        var oWhen = W.alignTo(when, product.overlay_cadence || product.cadence);
        W.loadLayer(overlay, W.buildUrl(cfg.wms, product.overlay, view, oWhen, null, false));
      }
    };
    probe.onerror = function () {
      if (stepsBack < 3) { load(stepsBack + 1); return; }
      stage.classList.remove('is-loading');
      stamp.textContent = 'unavailable';
    };
    probe.src = W.buildUrl(cfg.wms, product.base, view, when, null, true);
  }

  load(0);

  // Keep a page left open current, without polling a background tab.
  setInterval(function () {
    if (!document.hidden) { load(0); }
  }, product.cadence * W.MINUTE);
})();
