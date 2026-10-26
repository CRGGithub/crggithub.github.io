---
layout: page
title: Home
eyebrow: North-West University &middot; Potchefstroom
tagline: Live radar, forecasts and satellite images for South Africa.
description: >-
  Live weather radar, three-day forecast maps, satellite images and weather
  station readings from the NWU Climatology Research Group in Potchefstroom.
scripts:
  - /assets/js/wms.js
  - /assets/js/home-sat.js
# The home page's big buttons. `external` ones open a page on the data server.
tiles:
  - title: Live radar
    sub: Rain and storms right now
    url: /radar.html
    icon: radar
    radar: true
  - title: Forecast maps
    sub: Hour by hour, three days ahead
    url: /wrf.html#forecast-maps
    icon: map
  - title: Satellite
    sub: Clouds and lightning from space
    url: /satellite.html
    icon: satellite
  - title: Weather stations
    sub: Measured on the ground
    url: /stations.html
    icon: station
  - title: Impact dashboard
    sub: Storms, heat, frost and fire, town by town
    path: /wrf/impact_dashboard.html
    icon: dashboard
  - title: Agri forecast
    sub: Spraying, planting rain and frost
    path: /wrf/agri_dashboard.html
    icon: agri
  - title: Warnings
    sub: Official SA Weather Service warnings
    path: /wrf/wrfwarnings_map.html
    icon: warning
  - title: Soundings
    sub: The atmosphere above a town
    url: /wrfskewt.html
    icon: sounding
---

{%- include radar-state.html -%}

<div class="timebar">
  <span class="timebar__item">
    <span class="timebar__label">SAST</span>
    <span class="clock"><span class="clock__time" data-clock="sast">--:--:--</span></span>
  </span>
  <span class="timebar__item">
    <span class="timebar__label">UTC</span>
    <span class="clock"><span class="clock__time" data-clock="utc">--:--:--</span></span>
  </span>
  <span class="timebar__item">
    <span class="timebar__label">Radar</span>
    {% include radar-status.html %}
  </span>
</div>

{% include radar-notice.html %}

<ul class="tiles">
  {%- for t in page.tiles %}
  {%- if t.path %}{% assign href = site.data_host | append: t.path %}{% else %}{% assign href = t.url | relative_url %}{% endif %}
  <li>
    <a class="tile" href="{{ href }}"{% if t.path %} target="_blank" rel="noopener"{% endif %}>
      <span class="tile__icon">{% include icon.html name=t.icon %}</span>
      <span class="tile__title">{{ t.title }}{% if t.path %} &nearr;{% endif %}</span>
      <span class="tile__sub">{{ t.sub }}</span>
      {%- if t.radar and radar_status == 'offline' %}
      <span class="tile__badge badge badge--bad">Offline</span>
      {%- endif %}
    </a>
  </li>
  {%- endfor %}
</ul>

{%- unless radar_status == 'offline' %}

## Live radar

{% include live-embed.html
   path=site.data_paths.radar_live
   kind="frame"
   title="Lekwena radar live"
   note="Press play to animate, or tick Storm tracks to see where storms are heading." %}
{%- endunless %}

## Satellite now

{%- assign sat = site.data.satellite -%}
{%- assign sat_product = sat.products | where: "default", true | first -%}
{%- assign sat_product = sat_product | default: sat.products[0] -%}
{%- assign sat_view = sat.views[0] %}

<figure class="panel satstill" data-satstill>
  <div class="panel__head">
    <h3 class="panel__title">{{ sat_view.title }}</h3>
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
      The latest satellite image, with lightning in yellow.
      <a href="{{ '/satellite.html' | relative_url }}">Animate it, or see other views</a>. Imagery &copy; EUMETSAT.
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
