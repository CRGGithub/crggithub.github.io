/* ---------------------------------------------------------------------------
 * NWU Lekwena Radar - shared site behaviour
 *
 * Five small jobs, none of which need a framework:
 *   1. the mobile navigation drawer
 *   2. the light/dark theme toggle
 *   3. live UTC/SAST clocks
 *   4. keeping embeds of the http:// data server from silently breaking when
 *      the visitor is on https://, and refreshing live images in place
 *   5. retiring time-limited items, such as event forecasts, when they lapse
 * ------------------------------------------------------------------------- */
(function () {
  'use strict';

  var doc = document;

  /* -- 1. Navigation ------------------------------------------------------ */

  var navToggle = doc.querySelector('[data-nav-toggle]');
  var nav = doc.getElementById('primary-nav');

  // Open/closed is expressed only through aria-expanded; the stylesheet turns
  // that into display, so there is nothing to keep in sync across breakpoints.
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });

    // A tap outside the open drawer should close it.
    doc.addEventListener('click', function (e) {
      if (navToggle.getAttribute('aria-expanded') !== 'true') { return; }
      if (nav.contains(e.target) || navToggle.contains(e.target)) { return; }
      navToggle.setAttribute('aria-expanded', 'false');
    });
  }

  /* -- 2. Theme ----------------------------------------------------------- */

  var themeToggle = doc.querySelector('[data-theme-toggle]');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var root = doc.documentElement;
      var explicit = root.getAttribute('data-theme');
      var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var currentlyDark = explicit ? explicit === 'dark' : systemDark;
      var next = currentlyDark ? 'light' : 'dark';

      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('lekwena-theme', next);
      } catch (e) { /* private mode - the choice just will not persist */ }
    });
  }

  /* -- 3. Clocks ---------------------------------------------------------- */

  var clocks = Array.prototype.slice.call(doc.querySelectorAll('[data-clock]'));

  var pad = function (n) { return n < 10 ? '0' + n : String(n); };

  var tickClocks = function () {
    var now = new Date();
    clocks.forEach(function (el) {
      var utc = el.getAttribute('data-clock') === 'utc';
      // SAST is UTC+2 year round - South Africa observes no daylight saving,
      // so a fixed offset off the UTC parts is exact rather than a shortcut.
      var h = utc ? now.getUTCHours() : (now.getUTCHours() + 2) % 24;
      el.textContent = pad(h) + ':' + pad(now.getUTCMinutes()) + ':' + pad(now.getUTCSeconds());
    });
  };

  if (clocks.length) {
    tickClocks();
    setInterval(tickClocks, 1000);
  }

  /* -- 4. Live embeds ----------------------------------------------------- */

  var pageIsSecure = window.location.protocol === 'https:';

  var iconExternal =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M15 3h6v6"></path><path d="M10 14 21 3"></path>' +
    '<path d="M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"></path></svg>';

  /* The data server has no TLS yet, and a browser on https will not load
   * http content into the page - not even when the visitor follows an http://
   * link, because current Chrome and Safari silently upgrade that navigation
   * straight back to https. So each blocked view becomes a single row with a
   * link that opens it in its own tab, and the reason is given once per page
   * rather than repeated in every panel.
   *
   * None of this runs once data_host in _config.yml is https:// - the check
   * below is on the URL's scheme, so that one line is the whole switch. */
  var blocked = [];

  var replaceWithFallback = function (host, url, label) {
    var box = doc.createElement('div');
    box.className = 'embed-fallback';

    var p = doc.createElement('p');
    p.textContent = 'Published on the NWU data server.';

    var a = doc.createElement('a');
    a.className = 'btn btn--ghost btn--sm';
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', 'Open ' + label + ' in a new tab');
    a.innerHTML = 'Open in a new tab ' + iconExternal;

    box.appendChild(p);
    box.appendChild(a);
    host.replaceChildren(box);
    host.classList.add('is-fallback');

    // A "last updated" stamp for an image that will never load is noise.
    var panel = host.closest ? host.closest('.panel') : null;
    var stamp = panel ? panel.querySelector('[data-refresh-stamp]') : null;
    if (stamp) { stamp.hidden = true; }

    blocked.push(panel || host);
  };

  var explainBlocked = function () {
    if (!blocked.length) { return; }
    var note = doc.createElement('aside');
    note.className = 'callout callout--info blocked-notice';
    note.setAttribute('role', 'note');
    note.innerHTML =
      '<div class="callout__body">' +
      '<p class="callout__title">Some views on this page open in a new tab</p>' +
      '<p>They are published on the NWU data server, which does not yet support ' +
      'secure connections, and browsers will not show insecure content inside a ' +
      'secure page.</p></div>';
    blocked[0].parentNode.insertBefore(note, blocked[0]);
  };

  var bust = function (url) {
    return url + (url.indexOf('?') === -1 ? '?' : '&') + '_=' + Date.now();
  };

  Array.prototype.forEach.call(doc.querySelectorAll('[data-live-embed]'), function (host) {
    var url = host.getAttribute('data-url') || '';
    var label = host.getAttribute('data-label') || 'this product';

    if (pageIsSecure && url.indexOf('http:') === 0) {
      replaceWithFallback(host, url, label);
      return;
    }

    var every = parseInt(host.getAttribute('data-refresh'), 10);
    if (!every || host.getAttribute('data-kind') !== 'image') { return; }

    var img = host.querySelector('img');
    if (!img) { return; }

    var panel = host.closest ? host.closest('.panel') : null;
    var stamp = panel ? panel.querySelector('[data-refresh-stamp]') : null;

    var markUpdated = function () {
      if (!stamp) { return; }
      var d = new Date();
      stamp.textContent = 'updated ' + pad((d.getUTCHours() + 2) % 24) + ':' +
        pad(d.getUTCMinutes()) + ' SAST';
    };

    img.addEventListener('load', markUpdated);

    setInterval(function () {
      // Skip work while the tab is in the background; the next foreground
      // tick picks the newest frame up anyway.
      if (doc.hidden) { return; }
      img.src = bust(url);
    }, every * 1000);
  });

  explainBlocked();

  /* -- 5. Time-limited items ---------------------------------------------- */

  /* The build already leaves out anything past its date, but the site is
   * only rebuilt when something is committed, so an item can lapse between
   * builds. data-until holds an ISO time with its offset; a group marked
   * data-until-group goes too once everything in it has. */
  var now = Date.now();
  Array.prototype.forEach.call(doc.querySelectorAll('[data-until]'), function (el) {
    var until = Date.parse(el.getAttribute('data-until'));
    if (!isNaN(until) && until <= now) { el.hidden = true; }
  });
  Array.prototype.forEach.call(doc.querySelectorAll('[data-until-group]'), function (group) {
    var items = group.querySelectorAll('[data-until]');
    var live = Array.prototype.filter.call(items, function (el) { return !el.hidden; });
    if (items.length && !live.length) { group.hidden = true; }
  });
})();
