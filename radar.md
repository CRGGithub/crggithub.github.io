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
  The scan time is burnt into the image. If it differs from the UTC clock by more than about
  ten minutes, the radar or its link to campus is down; the status badge above is set manually
  and may lag.
</p>

## Latest reflectivity

{% include live-embed.html
   path=site.data_paths.radar_gif
   kind="image"
   title="Maximum reflectivity, dBZ"
   alt="Latest reflectivity image from the NWU Lekwena radar"
   refresh=120
   note="Refreshes every two minutes. Colour scale, place markers and interference are documented on the about page." %}

## Maximum dBZ map

<p>
  Reflectivity over a basemap; the layer control toggles the radar overlay.
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
  <figcaption>Reflectivity scale used by the map above.</figcaption>
</figure>

## Storm characteristics

<p>
  Cells are identified and tracked automatically; click a polygon or track for its
  characteristics. Radio-frequency interference is occasionally tracked as a cell, so
  cross-check against the reflectivity image above.
</p>

{% include live-embed.html
   path=site.data_paths.radar_storms
   kind="frame"
   title="Tracked storm cells"
   height="32rem" %}

## Lightning

<p>
  Total-lightning detections from the volunteer-operated
  <a href="https://www.blitzortung.org/">Blitzortung</a> network, in near-real time and
  independent of the radar. Useful for locating active convection while the radar is out.
</p>

{% include lightning-map.html
   title="Live lightning strikes"
   note="Strike locations are triangulated from a volunteer detector network, so coverage and accuracy vary with detector density." %}

## Disclaimer

{% include disclaimer.html %}
