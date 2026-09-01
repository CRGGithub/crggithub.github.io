---
layout: page
title: Home
eyebrow: North-West University &middot; Potchefstroom
tagline: C-band Doppler radar, convection-permitting WRF and EUMETSAT imagery, operated as a teaching and research facility.
description: >-
  Live C-band weather radar, three-domain WRF forecasts down to 3 km and current
  EUMETSAT satellite imagery for Southern Africa, from the NWU Climatology
  Research Group in Potchefstroom.
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
    <span class="timebar__label">Radar</span>
    {% include radar-status.html %}
  </span>
  <span class="timebar__item">
    <span class="timebar__label">WRF</span>
    <span class="badge badge--accent">Daily {{ site.data.wrf.cycle }} &middot; {{ site.data.wrf.length }}</span>
  </span>
</div>

{% include radar-notice.html %}

<p>All products are timestamped in <strong>UTC</strong>; SAST is UTC+2 year-round.</p>

## Start here

<ul class="card-grid card-grid--wide">
  <li>
    <a class="card" href="{{ '/radar.html' | relative_url }}">
      <p class="card__eyebrow">Observed &middot; every few minutes</p>
      <h3 class="card__title">Lekwena Radar</h3>
      <p class="card__body">
        Dual-polarised C-band Doppler radar at Potchefstroom. Reflectivity imagery, an
        interactive maximum-dBZ map and automatically tracked storm cells.
      </p>
      <span class="card__foot">Open the radar &rarr;</span>
    </a>
  </li>
  <li>
    <a class="card" href="{{ '/stations.html' | relative_url }}">
      <p class="card__eyebrow">Observed &middot; hourly</p>
      <h3 class="card__title">Weather stations</h3>
      <p class="card__body">
        Hourly observations from the NWU automatic weather station network, with
        year-to-date records for each site.
      </p>
      <span class="card__foot">Open the stations &rarr;</span>
    </a>
  </li>
  <li>
    <a class="card" href="{{ '/wrf.html' | relative_url }}">
      <p class="card__eyebrow">Forecast &middot; 72 hours</p>
      <h3 class="card__title">NWU-WRF</h3>
      <p class="card__body">
        Operational WRF-ARW at 18, 9 and 3 km, run daily to 72 hours. Gridded fields and
        sector impact dashboards.
      </p>
      <span class="card__foot">Open the forecasts &rarr;</span>
    </a>
  </li>
  <li>
    <a class="card" href="{{ '/wrfskewt.html' | relative_url }}">
      <p class="card__eyebrow">Forecast &middot; vertical profiles</p>
      <h3 class="card__title">Model soundings</h3>
      <p class="card__body">
        Forecast Skew-T / log-p profiles for 48 locations, from the 3 km Highveld nest out
        to the 18 km synoptic domain.
      </p>
      <span class="card__foot">Open the soundings &rarr;</span>
    </a>
  </li>
  <li>
    <a class="card" href="{{ '/satellite.html' | relative_url }}">
      <p class="card__eyebrow">Observed &middot; every 10 minutes</p>
      <h3 class="card__title">Satellite</h3>
      <p class="card__body">
        Meteosat Third Generation and MSG imagery from EUMETSAT: GeoColour with lightning,
        Convection RGB, water vapour, airmass and instability, with a scrubbable loop.
      </p>
      <span class="card__foot">Open the imagery &rarr;</span>
    </a>
  </li>
</ul>

## Latest radar image

{% include live-embed.html
   path=site.data_paths.radar_gif
   kind="image"
   title="Lekwena C-band reflectivity"
   alt="Latest reflectivity image from the NWU Lekwena radar"
   refresh=120
   note="Reflectivity in dBZ, timestamped UTC, refreshed every two minutes. A stamp more than about ten minutes behind the clock above indicates the radar or its link is down." %}

<p>
  The <a href="{{ '/about.html' | relative_url }}">about page</a> documents the timestamp
  convention, the dBZ scale, place markers and radio-frequency interference.
</p>

## Disclaimer

{% include disclaimer.html %}
