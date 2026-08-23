/* ---------------------------------------------------------------------------
 * NWU Lekwena Radar - shared site behaviour
 *
 * Four small jobs, none of which need a framework:
 *   1. the mobile navigation drawer
 *   2. the light/dark theme toggle
 *   3. live UTC/SAST clocks
 *   4. keeping embeds of the http:// data server from silently breaking when
 *      the visitor is on https://, and refreshing live images in place
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

  /* The data server has no TLS yet. Rather than let the browser blank the
   * frame with a console-only mixed-content error, show what happened and
   * hand the visitor a working link. Remove nothing here - flip
   * data_host_secure in _config.yml once the server has a certificate. */
  var replaceWithFallback = function (host, url, label) {
    var box = doc.createElement('div');
    box.className = 'embed-fallback';

    var p = doc.createElement('p');
    p.textContent =
      'This live view is served over an unencrypted connection while the page you are ' +
      'reading is encrypted, so your browser blocks it. Open it in its own tab instead:';

    var a = doc.createElement('a');
    a.className = 'btn btn--primary';
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = 'Open ' + label + ' ' + iconExternal;

    var alt = doc.createElement('p');
    var altLink = doc.createElement('a');
    altLink.href = window.location.href.replace(/^https:/, 'http:');
    altLink.textContent = 'view this whole page over http instead';
    alt.appendChild(doc.createTextNode('Or '));
    alt.appendChild(altLink);
    alt.appendChild(doc.createTextNode(', which lets the embeds load inline.'));

    box.appendChild(p);
    box.appendChild(a);
    box.appendChild(alt);

    host.replaceChildren(box);
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
      stamp.textContent = 'updated ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    };

    img.addEventListener('load', markUpdated);

    setInterval(function () {
      // Skip work while the tab is in the background; the next foreground
      // tick picks the newest frame up anyway.
      if (doc.hidden) { return; }
      img.src = bust(url);
    }, every * 1000);
  });
})();
