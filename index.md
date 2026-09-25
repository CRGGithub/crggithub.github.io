---
layout: page
title: Home
eyebrow: North-West University &middot; Potchefstroom
tagline: C-band Doppler radar, convection-permitting WRF and EUMETSAT imagery, operated as a teaching and research facility.
description: >-
  Live C-band weather radar, two-domain WRF forecasts down to 3 km and current
  EUMETSAT satellite imagery for Southern Africa, from the NWU Climatology
  Research Group in Potchefstroom.
scripts:
  - /assets/js/wms.js
  - /assets/js/home-sat.js
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

{%- include radar-state.html -%}
{%- comment -%}
  Live products first. The radar leads when it is running and drops to the end
  of the grid when it is not, rather than opening the site on a dead product.
{%- endcomment -%}
{%- capture radar_card -%}
  <li>
    <a class="card" href="{{ '/radar.html' | relative_url }}">
      <p class="card__eyebrow">Observed &middot;
        {%- if radar_status == 'offline' %} offline since {{ radar_last_scan | date: "%-d %B %Y" }}
        {%- else %} every few minutes{% endif -%}
      </p>
      <h3 class="card__title">Lekwena Radar</h3>
      <p class="card__body">
        Dual-polarised C-band Doppler radar at Potchefstroom. Reflectivity imagery, an
        interactive maximum-dBZ map and automatically tracked storm cells.
      </p>
      <span class="card__foot">Open the radar &rarr;</span>
    </a>
  </li>
{%- endcapture %}

<ul class="card-grid card-grid--thirds">
  {%- unless radar_status == 'offline' %}{{ radar_card }}{% endunless %}
  <li>
    <a class="card" href="{{ '/wrf.html' | relative_url }}">
      <p class="card__eyebrow">Forecast &middot; 72 hours</p>
      <h3 class="card__title">NWU-WRF</h3>
      <p class="card__body">
        Operational WRF-ARW at 9 and 3 km, run daily to 72 hours. Gridded fields and
        sector impact dashboards.
      </p>
      <span class="card__foot">Open the forecasts &rarr;</span>
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
  <li>
    <a class="card" href="{{ '/stations.html' | relative_url }}">
      <p class="card__eyebrow">Observed &middot; hourly</p>
      <h3 class="card__title">Weather stations</h3>
      <p class="card__body">
        Hourly observations from the NWU automatic weather station network, with
        year-to-date records and a soil moisture profile.
      </p>
      <span class="card__foot">Open the stations &rarr;</span>
    </a>
  </li>
  <li>
    <a class="card" href="{{ '/radar.html#lightning' | relative_url }}">
      <p class="card__eyebrow">Observed &middot; near-real time</p>
      <h3 class="card__title">Lightning</h3>
      <p class="card__body">
        Live total-lightning detections over Southern Africa from the volunteer-operated
        Blitzortung network, independent of the radar.
      </p>
      <span class="card__foot">Open the lightning map &rarr;</span>
    </a>
  </li>
  <li>
    <a class="card" href="{{ '/wrfskewt.html' | relative_url }}">
      <p class="card__eyebrow">Forecast &middot; vertical profiles</p>
      <h3 class="card__title">Model soundings</h3>
      <p class="card__body">
        Forecast Skew-T / log-p profiles for 34 locations, from the 3 km Highveld nest out
        to the 9 km outer domain.
      </p>
      <span class="card__foot">Open the soundings &rarr;</span>
    </a>
  </li>
  {%- if radar_status == 'offline' %}{{ radar_card }}{% endif %}
</ul>

{%- unless radar_status == 'offline' %}

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
{%- endunless %}

## Current satellite image

{%- assign sat = site.data.satellite -%}
{%- assign sat_product = sat.products | where: "default", true | first -%}
{%- assign sat_product = sat_product | default: sat.products[0] -%}
{%- assign sat_view = sat.views[0] %}

<figure class="panel satstill" data-satstill>
  <div class="panel__head">
    <h3 class="panel__title">{{ sat_product.title }} &middot; {{ sat_view.title }}</h3>
    <p class="panel__meta" data-satstill-stamp>loading&hellip;</p>
  </div>
  <div class="satview__stage is-loading" data-satstill-stage
       style="aspect-ratio: {{ sat_view.width }} / {{ sat_view.height }}">
    <img class="satview__img" data-satstill-base alt="" decoding="async">
    <img class="satview__layer" data-satstill-overlay alt="" aria-hidden="true" decoding="async" hidden>
    <div class="satview__layer-set" data-satstill-bounds aria-hidden="true"></div>
    <div class="satview__spinner" aria-hidden="true"></div>
  </div>
  <figcaption class="panel__foot">
    <p>
      The newest {{ sat_product.satellite }} frame EUMETSAT has published, updated as new
      ones arrive. <a href="{{ '/satellite.html' | relative_url }}">Animate it, or switch to
      nine other products, in the satellite viewer</a>. Imagery &copy; EUMETSAT.
    </p>
  </figcaption>
</figure>

<noscript>
  <p><a href="{{ '/satellite.html' | relative_url }}">Open the satellite viewer</a>.</p>
</noscript>

<script type="application/json" id="satstill-config">
{
  "wms": {{ site.eumetsat.wms | jsonify }},
  "view": {
    "title": {{ sat_view.title | jsonify }},
    "crs": {{ sat_view.crs | jsonify }},
    "bbox": {{ sat_view.bbox | jsonify }},
    "width": {{ sat_view.width }},
    "height": {{ sat_view.height }}
  },
  "product": {
    "title": {{ sat_product.title | jsonify }},
    "base": {{ sat_product.base | jsonify }},
    "overlay": {{ sat_product.overlay | default: nil | jsonify }},
    "overlay_cadence": {{ sat_product.overlay_cadence | default: sat_product.cadence }},
    "cadence": {{ sat_product.cadence }},
    "lag": {{ sat_product.lag }}
  },
  "boundaries": [
    {%- for b in sat.boundaries %}
    { "layer": {{ b.layer | jsonify }} }{% unless forloop.last %},{% endunless %}
    {%- endfor %}
  ]
}
</script>

## Disclaimer

{% include disclaimer.html %}
