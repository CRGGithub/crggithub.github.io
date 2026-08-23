---
layout: page
title: Home
eyebrow: North-West University &middot; Potchefstroom
tagline: A living weather laboratory — C-band radar, convection-permitting WRF and EUMETSAT imagery, run by students.
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
    <span class="badge badge--accent">Daily 06Z &middot; 72 h</span>
  </span>
</div>

{% include radar-notice.html %}

<p>
  All model and radar products are timestamped in <strong>UTC</strong>. South African
  Standard Time is two hours ahead, year round.
</p>

## Start here

<ul class="card-grid card-grid--wide">
  <li>
    <a class="card" href="{{ '/radar.html' | relative_url }}">
      <p class="card__eyebrow">Observed &middot; every few minutes</p>
      <h3 class="card__title">Lekwena Radar</h3>
      <p class="card__body">
        The university's dual-polarised C-band Doppler radar outside Potchefstroom.
        Latest reflectivity image, an interactive maximum-dBZ map and automatically
        tracked storm cells with their characteristics.
      </p>
      <span class="card__foot">Open the radar &rarr;</span>
    </a>
  </li>
  <li>
    <a class="card" href="{{ '/stations.html' | relative_url }}">
      <p class="card__eyebrow">Observed &middot; hourly</p>
      <h3 class="card__title">Weather stations</h3>
      <p class="card__body">
        Live readings from the NWU automatic weather stations around Potchefstroom &mdash;
        temperature, rain, wind, solar radiation and reference evapotranspiration &mdash;
        plus year-to-date records for every site.
      </p>
      <span class="card__foot">Open the stations &rarr;</span>
    </a>
  </li>
  <li>
    <a class="card" href="{{ '/wrf.html' | relative_url }}">
      <p class="card__eyebrow">Forecast &middot; 72 hours</p>
      <h3 class="card__title">NWU-WRF</h3>
      <p class="card__body">
        A three-domain WRF-ARW forecast run in house every day, down to a 3 km
        convection-permitting nest over North West and Gauteng. Gridded fields plus
        impact dashboards for storms, heat, frost, fire and irrigation.
      </p>
      <span class="card__foot">Open the forecasts &rarr;</span>
    </a>
  </li>
  <li>
    <a class="card" href="{{ '/wrfskewt.html' | relative_url }}">
      <p class="card__eyebrow">Forecast &middot; vertical profiles</p>
      <h3 class="card__title">Model soundings</h3>
      <p class="card__body">
        Skew-T / log-p diagrams for 48 locations across Southern Africa, from
        16 convection-permitting sites on the Highveld out to synoptic stations
        in Zambia, Mozambique and Madagascar.
      </p>
      <span class="card__foot">Open the soundings &rarr;</span>
    </a>
  </li>
  <li>
    <a class="card" href="{{ '/satellite.html' | relative_url }}">
      <p class="card__eyebrow">Observed &middot; every 10 minutes</p>
      <h3 class="card__title">Satellite</h3>
      <p class="card__body">
        Meteosat Third Generation and MSG imagery straight from EUMETSAT -
        GeoColour with live lightning, Convection RGB, water vapour, airmass,
        instability and detected thunderstorm cells, with a scrubbable loop.
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
   note="Reflectivity in dBZ, timestamped UTC. Refreshes automatically every two minutes. If the timestamp on the image is more than about ten minutes behind the clock above, the radar or its link is down." %}

<p>
  New to radar imagery? The <a href="{{ '/about.html' | relative_url }}">about page</a>
  walks through how to read the time stamp, the dBZ scale, the place markers and the
  interference that a busy 5.6 GHz band puts into the picture.
</p>

## Disclaimer

{% include disclaimer.html %}
