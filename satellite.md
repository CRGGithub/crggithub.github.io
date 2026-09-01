---
layout: page
title: Satellite
permalink: /satellite.html
eyebrow: Observed
tagline: Meteosat imagery over Southern Africa, straight from EUMETSAT.
description: >-
  Current Meteosat Third Generation and MSG imagery over Southern Africa -
  GeoColour with lightning, Convection RGB, water vapour, airmass, instability
  and detected thunderstorm cells, with a scrubbable loop.
scripts:
  - /assets/js/satellite.js
---

{%- assign sat = site.data.satellite -%}

<p>
  Imagery is requested live from the <a href="https://www.eumetsat.int/">EUMETSAT</a> map
  service and is not cached here. Select a product and region, then scrub or animate the
  last two hours.
</p>

<div class="satview" data-satview tabindex="-1">
  <div class="satview__toolbar">
    <div class="satview__group satview__group--grow">
      <span class="satview__legend" id="satview-product-label">Product</span>
      <div class="satview__chips" data-sat-products role="group"
           aria-labelledby="satview-product-label"></div>
    </div>
    <div class="satview__group">
      <span class="satview__legend" id="satview-view-label">Region</span>
      <div class="satview__chips" data-sat-views role="group"
           aria-labelledby="satview-view-label"></div>
    </div>
    <div class="satview__group">
      <span class="satview__legend">Overlay</span>
      <div class="satview__chips">
        <button type="button" class="chip" data-sat-bounds-toggle aria-pressed="true">
          Boundaries
        </button>
      </div>
    </div>
  </div>

  <div class="satview__stage" data-sat-stage>
    <img class="satview__img" data-sat-base alt="" decoding="async">
    <img class="satview__layer" data-sat-overlay alt="" aria-hidden="true" decoding="async" hidden>
    <div class="satview__layer-set" data-sat-bounds aria-hidden="true"></div>
    <div class="satview__spinner" aria-hidden="true"></div>
    <p class="satview__error" data-sat-error role="status" hidden></p>
  </div>

  <div class="satview__scrub">
    <button class="satview__step" type="button" data-sat-play
            aria-pressed="false" aria-label="Play the loop">
      <svg data-play-icon viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
      <svg data-pause-icon viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" hidden><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>
    </button>
    <button class="satview__step" type="button" data-sat-prev aria-label="Previous frame">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
    </button>
    <input class="satview__slider" type="range" min="0" max="11" step="1" value="11"
           data-sat-slider aria-label="Frame time">
    <button class="satview__step" type="button" data-sat-next aria-label="Next frame">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
    </button>
    <span class="satview__stamp" data-sat-stamp>loading&hellip;</span>
  </div>

  <div class="satview__caption" data-sat-caption></div>

  <div class="panel__foot">
    <p>
      <a data-sat-download href="{{ site.eumetsat.wms }}" target="_blank" rel="noopener">Open this frame at full resolution</a> (base image, without the overlays)
      &middot; imagery copyright EUMETSAT, reproduced under their
      <a href="https://www.eumetsat.int/eumetsat-data-licensing">data licence</a>.
    </p>
  </div>
</div>

<noscript>
  <div class="callout callout--warn">
    <div class="callout__body">
      <p class="callout__title">The viewer requires JavaScript</p>
      <p>
        Frames are addressed by timestamp, which is computed in the browser. With scripting
        disabled, use <a href="{{ site.eumetsat.viewer }}">EUMETSAT View</a> directly.
      </p>
    </div>
  </div>
</noscript>

## Reading the products

<div class="table-scroll">
  <table>
    <thead>
      <tr><th>Product</th><th>Instrument</th><th>Cycle</th><th>What it shows</th></tr>
    </thead>
    <tbody>
      {%- for p in sat.products %}
      <tr>
        <td><strong>{{ p.title }}</strong></td>
        <td>{{ p.satellite }}</td>
        <td>{{ p.cadence }} min</td>
        <td>{{ p.blurb | strip_newlines | strip }}</td>
      </tr>
      {%- endfor %}
    </tbody>
  </table>
</div>

<aside class="callout callout--info" role="note">
  <div class="callout__body">
    <p class="callout__title">Why the newest frame lags the clock</p>
    <p>
      Full-disc repeat cycles are 10 or 15 minutes depending on instrument, and EUMETSAT
      requires further time to process and publish each slot. Requests are therefore stepped
      back far enough to fall inside the archive; scrub right for the most recent frame.
    </p>
  </div>
</aside>

## Related

<ul class="linklist">
  <li>
    <a href="{{ site.eumetsat.viewer }}" target="_blank" rel="noopener">
      <span class="linklist__name">EUMETSAT View</span>
      <span class="linklist__note">Full product catalogue and archive</span>
    </a>
  </li>
  <li>
    <a href="{{ '/radar.html' | relative_url }}">
      <span class="linklist__name">Lekwena radar</span>
      <span class="linklist__note">Ground-based reflectivity</span>
    </a>
  </li>
  <li>
    <a href="{{ '/wrf.html' | relative_url }}">
      <span class="linklist__name">NWU-WRF simulated radar and CAPE</span>
      <span class="linklist__note">Forecast reflectivity and instability</span>
    </a>
  </li>
</ul>

<script type="application/json" id="satview-config">
{
  "wms": {{ site.eumetsat.wms | jsonify }},
  "boundaries": [
    {%- for b in sat.boundaries %}
    { "id": {{ b.id | jsonify }}, "layer": {{ b.layer | jsonify }} }{% unless forloop.last %},{% endunless %}
    {%- endfor %}
  ],
  "views": [
    {%- for v in sat.views %}
    {
      "id": {{ v.id | jsonify }},
      "title": {{ v.title | jsonify }},
      "crs": {{ v.crs | jsonify }},
      "bbox": {{ v.bbox | jsonify }},
      "width": {{ v.width }},
      "height": {{ v.height }}
    }{% unless forloop.last %},{% endunless %}
    {%- endfor %}
  ],
  "products": [
    {%- for p in sat.products %}
    {
      "id": {{ p.id | jsonify }},
      "title": {{ p.title | jsonify }},
      "satellite": {{ p.satellite | jsonify }},
      "base": {{ p.base | jsonify }},
      "overlay": {{ p.overlay | default: nil | jsonify }},
      "overlay_cadence": {{ p.overlay_cadence | default: p.cadence }},
      "cadence": {{ p.cadence }},
      "lag": {{ p.lag }},
      "default": {{ p.default | default: false }},
      "daylight_only": {{ p.daylight_only | default: false }},
      "blurb": {{ p.blurb | strip_newlines | strip | jsonify }}
    }{% unless forloop.last %},{% endunless %}
    {%- endfor %}
  ]
}
</script>
