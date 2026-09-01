/* South African Weather Service warning mirror - client-side freshness.
 *
 * The page is built by a scheduled workflow, so every "In force" label on it is
 * as true as the last run and no truer. A warning that lapsed twenty minutes
 * ago would otherwise keep claiming to be active until the next build. On a
 * severe-weather page that is the one error worth spending script on, so each
 * card carries its CAP expiry and this re-checks it against the reader's clock.
 *
 * Everything here is progressive: with JavaScript off the page still shows the
 * warnings and their expiry times, just as they stood at build time.
 */
(function () {
  'use strict';

  var HOUR = 3600000;

  function parse(el) {
    var raw = el.getAttribute('data-expires');
    if (!raw) { return null; }
    var t = Date.parse(raw);
    return isNaN(t) ? null : t;
  }

  function until(ms) {
    if (ms <= 0) { return 'Lapsed'; }
    if (ms < HOUR) { return 'Ends in ' + Math.max(1, Math.round(ms / 60000)) + ' min'; }
    if (ms < 48 * HOUR) { return 'Ends in ' + Math.round(ms / HOUR) + ' h'; }
    return 'Ends in ' + Math.round(ms / (24 * HOUR)) + ' days';
  }

  function refresh() {
    var now = Date.now();
    var cards = document.querySelectorAll('[data-warning]');
    var live = 0;
    var i;

    for (i = 0; i < cards.length; i++) {
      var card = cards[i];
      var expires = parse(card);
      var lapsed = expires === null ? card.classList.contains('is-lapsed') : expires <= now;

      card.classList.toggle('is-lapsed', lapsed);
      if (!lapsed) { live++; }

      var state = card.querySelector('[data-warn-state]');
      if (state) {
        state.textContent = expires === null
          ? (lapsed ? 'Lapsed' : 'In force')
          : until(expires - now);
      }
    }

    var summary = document.querySelector('[data-warn-summary] .badge');
    if (summary) {
      summary.textContent = live > 0
        ? live + ' warning' + (live === 1 ? '' : 's') + ' in force'
        : 'No warnings in force';
      summary.className = 'badge ' + (live > 0 ? 'badge--bad' : 'badge--ok');
    }

    // A banner whose every warning has lapsed is worse than no banner.
    var banner = document.querySelector('[data-warn-banner]');
    if (banner) {
      var items = banner.querySelectorAll('[data-warning]');
      var any = false;
      for (i = 0; i < items.length; i++) {
        if (!items[i].classList.contains('is-lapsed')) { any = true; }
        else { items[i].hidden = true; }
      }
      banner.hidden = !any;
    }
  }

  refresh();
  // Cheap enough to keep honest while a tab sits open through an expiry.
  setInterval(refresh, 60000);
})();
