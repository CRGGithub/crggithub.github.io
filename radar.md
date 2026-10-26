---
layout: page
title: Radar
permalink: /radar.html
eyebrow: Observed
tagline: Rain and storms around Potchefstroom, live.
description: >-
  The live, interference-filtered NWU Lekwena C-band radar: animated
  reflectivity and echo tops with TITAN storm tracks and short-range forecasts.
---

<div class="timebar">
  <span class="timebar__item">
    <span class="timebar__label">UTC</span>
    <span class="clock"><span class="clock__time" data-clock="utc">--:--:--</span></span>
  </span>
  <span class="timebar__item">
    <span class="timebar__label">SAST</span>
    <span class="clock"><span class="clock__time" data-clock="sast">--:--:--</span></span>
  </span>
  <span class="timebar__item">
    <span class="timebar__label">Status</span>
    {% include radar-status.html %}
  </span>
  <span class="timebar__item">
    <span class="timebar__label">Range</span>
    <span>200 km</span>
  </span>
</div>

{% include radar-notice.html %}

{% include live-embed.html
   path=site.data_paths.radar_live
   kind="frame"
   title="Lekwena radar live"
   note="Press play to animate the last few hours. Tick Storm tracks to see where storms are heading in the next 30 minutes - a straight-line estimate, so storms can still grow, fade or turn. Click the map for the history at a point. Times are UTC." %}

<details class="fold">
  <summary>Simple radar image</summary>
  <div class="fold__body">
    <p>
      A single, lighter image of the latest scan. Its time is printed on the image; if that is
      more than about ten minutes behind the clock above, the radar is probably down.
    </p>
{% include live-embed.html
   path=site.data_paths.radar_gif
   kind="image"
   title="Latest scan"
   alt="Latest reflectivity image from the NWU Lekwena radar"
   refresh=120 %}
    <p>How to read it: <a href="{{ '/about.html' | relative_url }}">colours, place markers and interference</a>.</p>
  </div>
</details>

<details class="fold">
  <summary>About this radar</summary>
  <div class="fold__body">
    <p>
      A dual-polarised C-band Doppler radar outside Potchefstroom with a 200&nbsp;km range. The
      live view shows composite (column-maximum) reflectivity and echo tops, filtered for
      radio interference. Storms of 30&nbsp;dBZ and above are tracked with TITAN.
    </p>
    <p>
      The status badge is updated automatically and marks the radar offline after two hours
      without a new scan.
    </p>
{% include disclaimer.html %}
  </div>
</details>
