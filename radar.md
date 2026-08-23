---
layout: page
title: Radar
permalink: /radar.html
eyebrow: Observed
tagline: The NWU Lekwena dual-polarised C-band Doppler radar, Potchefstroom.
description: >-
  Live reflectivity, interactive maximum-dBZ maps and automatically tracked
  storm cells from the North-West University Lekwena C-band weather radar.
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

<p>
  Compare the time stamp burnt into the image below with the UTC clock above. If they are
  more than roughly ten minutes apart, the radar or the link back to campus is down and you
  are looking at a stale scan. That check is always worth doing &mdash; the status badge
  above is set by hand, so it can lag reality.
</p>

## Latest reflectivity

{% include live-embed.html
   path=site.data_paths.radar_gif
   kind="image"
   title="Maximum reflectivity, dBZ"
   alt="Latest reflectivity image from the NWU Lekwena radar"
   refresh=120
   note="Refreshes automatically every two minutes. Colour scale, place markers and interference patterns are explained on the about page." %}

## Maximum dBZ map

<p>
  Pan and zoom the reflectivity field over a basemap. Use the layer control in the corner of
  the map to switch the radar overlay on and off. Refresh the page if the map does not appear.
</p>

{% include live-embed.html
   path=site.data_paths.radar_dbz
   kind="frame"
   title="Interactive maximum dBZ"
   height="32rem" %}

<figure>
  <img src="{{ '/assets/images/radar/radardbz.png' | relative_url }}"
       alt="Colour scale mapping reflectivity in dBZ onto the viridis colour map"
       loading="lazy" decoding="async">
  <figcaption>Reflectivity scale used by the map above. Higher dBZ means larger particles &mdash;
  heavy rain, hail or ice aloft.</figcaption>
</figure>

## Storm characteristics

<p>
  Storm cells are identified and tracked automatically. Click a red polygon or a black track
  to read that cell's characteristics. It is worth checking the static image above at the same
  time: interference is sometimes picked up and tracked as though it were a storm.
</p>

{% include live-embed.html
   path=site.data_paths.radar_storms
   kind="frame"
   title="Tracked storm cells"
   height="32rem" %}

## Disclaimer

{% include disclaimer.html %}
