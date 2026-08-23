/* ---------------------------------------------------------------------------
 * Weather station chart switcher
 *
 * The data server publishes the same six year-to-date plots for every station,
 * named <station>_<variable>.png. Rather than stacking all thirty on the page,
 * swap the src of six <img> elements when a station chip is picked.
 * ------------------------------------------------------------------------- */
(function () {
  'use strict';

  var root = document.querySelector('[data-stations]');
  if (!root) { return; }

  var cfgNode = document.getElementById('stations-config');
  if (!cfgNode) { return; }

  var cfg;
  try {
    cfg = JSON.parse(cfgNode.textContent);
  } catch (e) {
    return;
  }

  var chips = Array.prototype.slice.call(root.querySelectorAll('[data-station]'));
  var charts = Array.prototype.slice.call(root.querySelectorAll('[data-chart]'));
  var blurb = root.querySelector('[data-station-blurb]');

  // The mixed-content guard in site.js may have torn the gallery out and
  // replaced it with a click-through card. Nothing left to switch.
  if (!charts.length) { return; }

  function byId(id) {
    for (var i = 0; i < cfg.stations.length; i++) {
      if (cfg.stations[i].id === id) { return cfg.stations[i]; }
    }
    return cfg.stations[0];
  }

  function select(id) {
    var station = byId(id);

    charts.forEach(function (img) {
      var variable = img.getAttribute('data-chart');
      img.src = cfg.imgBase + station.id + '_' + variable + '.png';
      var title = img.closest('.panel').querySelector('.panel__title');
      img.alt = (title ? title.textContent : variable) +
        ' for ' + station.name + ', year to date';
    });

    if (blurb) { blurb.textContent = station.blurb; }

    chips.forEach(function (c) {
      c.setAttribute('aria-pressed', String(c.getAttribute('data-station') === station.id));
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      select(chip.getAttribute('data-station'));
    });
  });
})();
