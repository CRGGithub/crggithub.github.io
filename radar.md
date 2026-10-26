---
layout: page
title: Radar
permalink: /radar.html
eyebrow: Observed
tagline: The NWU Lekwena dual-polarised C-band Doppler radar, Potchefstroom.
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

## Live radar

<p>
  Composite (column-maximum) reflectivity and echo tops, filtered for radio-frequency
  interference and animated over up to four hours. Storms of 30&nbsp;dBZ and above are tracked
  with TITAN, with cones for where each may be in 15 and 30&nbsp;minutes. Click the map for the
  history at a point; times are UTC.
</p>

{% include live-embed.html
   path=site.data_paths.radar_live
   kind="frame"
   title="Lekwena radar live"
   note="Track forecasts are linear extrapolations: storms can grow, decay, split or turn." %}

## Latest reflectivity image

<p>
  The scan time is burnt into the image. If it differs from the UTC clock by more than about
  ten minutes, the radar or its link to campus is probably down. The status badge above is set
  automatically, but only marks the radar offline after two hours without a new scan, so check
  the time stamp first.
</p>

{% include live-embed.html
   path=site.data_paths.radar_gif
   kind="image"
   title="Maximum reflectivity, dBZ"
   alt="Latest reflectivity image from the NWU Lekwena radar"
   refresh=120
   note="Refreshes every two minutes. Colour scale, place markers and interference are documented on the about page." %}

## Lightning

<p>
  Total-lightning detections from the volunteer-operated
  <a href="https://www.blitzortung.org/">Blitzortung</a> network, in near-real time and
  independent of the radar, so it still shows active convection whenever the radar is out.
</p>

{% include lightning-map.html
   title="Live lightning strikes"
   note="Opens on Southern Africa; pan and zoom from there. Scroll-zoom is off, so use the zoom buttons or open the map full screen. Strike locations are triangulated from a volunteer detector network, so coverage and accuracy vary with detector density." %}

## Disclaimer

{% include disclaimer.html %}
