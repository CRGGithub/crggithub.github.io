/* Scrubbable WRF forecast loop.
 *
 * The frame list is rendered into data-frames by _includes/wrf-loop.html, so
 * this never has to know the model server's address or its output range.
 *
 * Two things drive the design:
 *
 *   - The frames are ~650 KB each and there are 21 of them. Loading all of them
 *     up front is 14 MB on a page most readers will scroll straight past, so
 *     frames load on demand and only the immediate neighbours are prefetched.
 *   - Playing a loop whose frames are not in cache yet produces a stutter that
 *     looks like a broken page. Play therefore waits for the next frame to
 *     decode before advancing, so a slow link makes the loop slower rather than
 *     making it flicker.
 *
 * With JavaScript off the markup still shows the first frame; the stylesheet
 * hides the controls, which would otherwise be inert.
 */
(function () {
  'use strict';

  var FRAME_MS = 500;

  var reduced = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

  function setup(root) {
    var frames;
    try {
      frames = JSON.parse(root.getAttribute('data-frames') || '[]');
    } catch (e) {
      return;
    }
    if (!frames.length) { return; }

    var img = root.querySelector('.loop__img');
    var range = root.querySelector('[data-loop-range]');
    var stamp = root.querySelector('[data-loop-stamp]');
    var play = root.querySelector('[data-loop-play]');
    var iconPlay = root.querySelector('[data-loop-icon-play]');
    var iconPause = root.querySelector('[data-loop-icon-pause]');
    if (!img || !range) { return; }

    var idx = 0;
    var timer = null;
    var cache = {};

    range.max = String(frames.length - 1);

    function prefetch(i) {
      if (i < 0 || i >= frames.length || cache[i]) { return; }
      var pre = new Image();
      pre.decoding = 'async';
      pre.src = frames[i].src;
      cache[i] = pre;
    }

    function show(i) {
      idx = Math.max(0, Math.min(frames.length - 1, i));
      img.src = frames[idx].src;
      range.value = String(idx);
      if (stamp) { stamp.textContent = 'T+' + frames[idx].h + ' h'; }
      // Both neighbours, so scrubbing backwards is as smooth as forwards.
      prefetch(idx + 1);
      prefetch(idx - 1);
    }

    function advance() {
      var next = (idx + 1) % frames.length;
      show(next);
      // Wait for the frame to actually be on screen before scheduling the
      // next one; decode() rejects if the src changed underneath us, which is
      // exactly the case where the timer should be dropped anyway.
      var settled = false;
      var go = function () {
        if (settled || timer === null) { return; }
        settled = true;
        timer = window.setTimeout(advance, FRAME_MS);
      };
      if (img.decode) {
        img.decode().then(go, go);
      } else {
        go();
      }
    }

    function stop() {
      if (timer !== null) { window.clearTimeout(timer); timer = null; }
      if (play) { play.setAttribute('aria-label', 'Play the loop'); }
      if (iconPlay) { iconPlay.hidden = false; }
      if (iconPause) { iconPause.hidden = true; }
    }

    function start() {
      if (timer !== null) { return; }
      timer = window.setTimeout(advance, FRAME_MS);
      if (play) { play.setAttribute('aria-label', 'Pause the loop'); }
      if (iconPlay) { iconPlay.hidden = true; }
      if (iconPause) { iconPause.hidden = false; }
    }

    range.addEventListener('input', function () {
      stop();
      show(parseInt(this.value, 10) || 0);
    });

    // Wrap, so stepping past either end continues rather than dead-ends. The
    // buttons and the arrow keys go through here so they cannot drift apart.
    function step(by) {
      stop();
      show((idx + by + frames.length) % frames.length);
    }

    Array.prototype.forEach.call(
      root.querySelectorAll('[data-loop-step]'),
      function (btn) {
        btn.addEventListener('click', function () {
          step(parseInt(btn.getAttribute('data-loop-step'), 10) || 0);
        });
      }
    );

    if (play) {
      play.addEventListener('click', function () {
        if (timer === null) { start(); } else { stop(); }
      });
    }

    root.addEventListener('keydown', function (e) {
      // The range input handles its own arrow keys; intercepting them here
      // would move the frame twice for one press.
      if (e.target === range) { return; }
      if (e.key === 'ArrowLeft') { step(-1); }
      else if (e.key === 'ArrowRight') { step(1); }
      else { return; }
      e.preventDefault();
    });

    // A loop animating in a background tab is pure waste.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); }
    });

    if (reduced && reduced.addEventListener) {
      reduced.addEventListener('change', function (e) { if (e.matches) { stop(); } });
    }

    show(0);
  }

  Array.prototype.forEach.call(
    document.querySelectorAll('[data-wrf-loop]'),
    setup
  );
})();
