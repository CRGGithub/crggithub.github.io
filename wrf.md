---
layout: page
title: NWU-WRF
permalink: /wrf.html
eyebrow: Forecast
tagline: A three-domain operational WRF-ARW forecast, run in house every day.
description: >-
  The North-West University operational WRF forecast - 18, 9 and 3 km domains
  over Southern Africa, with gridded fields and sector impact dashboards.
scripts:
  - /assets/js/wrf-loop.js
---

{%- assign wrf = site.data.wrf -%}
{%- assign portal = site.data_host | append: site.data_paths.wrf_portal -%}
{%- assign base = site.data_host | append: site.data_paths.wrf_prefix -%}

<ul class="stats">
  <li class="stat"><span class="stat__value">{{ wrf.version | remove: 'WRF-ARW ' }}</span><span class="stat__label">WRF-ARW version</span></li>
  <li class="stat"><span class="stat__value">3 km</span><span class="stat__label">Finest nest</span></li>
  <li class="stat"><span class="stat__value">{{ wrf.length }}</span><span class="stat__label">Forecast length</span></li>
  <li class="stat"><span class="stat__value">{{ wrf.cycle }}</span><span class="stat__label">Daily GFS cycle</span></li>
</ul>

<p>
  The Weather Research and Forecasting model is an open, community-built weather model used
  for both operational forecasting and research. Running it in house alongside the Lekwena
  radar puts NWU Potchefstroom at the front of numerical weather prediction research in
  Africa &mdash; it is the only university on the continent operating a student-driven
  weather radar and an operational NWP model side by side. The model background is documented
  on the <a href="https://www2.mmm.ucar.edu/wrf/users/">official WRF user page</a>.
</p>

<p>
  <a class="btn btn--primary" href="{{ portal }}" target="_blank" rel="noopener">
    Open the full WRF portal
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/></svg>
  </a>
</p>

## Synoptic overview

<p>
  Before looking at any single field, look at the situation.
  {{ wrf.overview.blurb | strip_newlines | strip }}
  It is drawn on the <strong>{{ wrf.overview.scale }}</strong> outer domain, so it covers
  {{ wrf.overview.coverage }} rather than just South Africa. Run time, valid time and the
  full legend are in the plot itself; the slider labels the forecast hour.
</p>

{% include wrf-loop.html
   frames=wrf.overview.frames
   page=wrf.overview.page
   title="WRF Synoptic Overview &middot; 18 km"
   label="the synoptic overview"
   alt="WRF synoptic overview - surface analysis above, 500 and 850 hPa below"
   note="Frames run T+12 h to T+72 h, three-hourly." %}

## Impact dashboards

<p>
  The dashboards translate raw model output into decisions. Rather than reading a CAPE field
  and a wind field separately, each location is scored for the things that actually cost
  money and time.
</p>

<ul class="card-grid card-grid--wide">
  {%- for d in wrf.dashboards %}
  <li>
    <a class="card" href="{{ base }}{{ d.page }}" target="_blank" rel="noopener">
      <p class="card__eyebrow">{{ d.scale }} domain</p>
      <h3 class="card__title">{{ d.title }}</h3>
      <p class="card__body">{{ d.blurb | strip_newlines | strip }}</p>
      <span class="card__foot">Open dashboard &nearr;</span>
    </a>
  </li>
  {%- endfor %}
</ul>

## Gridded fields

<p>
  Every field below is published at both resolutions. The <strong>9 km</strong> domain covers
  South Africa, Lesotho and Eswatini and is the one to use for synoptic and next-day planning.
  The <strong>3 km</strong> nest covers North West and Gauteng, resolves convection explicitly
  rather than parameterising it, and is the better guide to thunderstorm timing, placement
  and mode over the Highveld.
</p>

<ul class="card-grid">
  {%- for f in wrf.fields %}
  <li>
    <div class="card">
      <h3 class="card__title">{{ f.title }}</h3>
      <p class="card__body">{{ f.blurb }}</p>
      <p class="card__actions">
        <a class="btn btn--ghost btn--sm" href="{{ base }}{{ f.page }}" target="_blank" rel="noopener">9 km</a>
        <a class="btn btn--ghost btn--sm" href="{{ base }}nwgp_{{ f.page }}" target="_blank" rel="noopener">3 km</a>
      </p>
    </div>
  </li>
  {%- endfor %}
</ul>

<p>
  Vertical profiles for 48 locations are on the
  <a href="{{ '/wrfskewt.html' | relative_url }}">soundings page</a>.
</p>

## Model domains

<div class="table-scroll">
  <table>
    <thead>
      <tr>
        <th>Domain</th><th>Resolution</th><th>Grid</th><th>Extent</th><th>Coverage</th>
      </tr>
    </thead>
    <tbody>
      {%- for d in wrf.domains %}
      <tr>
        <td><strong>{{ d.id }}</strong><br><span class="cell-note">{{ d.label }}</span></td>
        <td>{{ d.resolution }}</td>
        <td>{{ d.grid }}</td>
        <td>{{ d.extent }}</td>
        <td>{{ d.coverage }}{% if d.note %}<br><span class="cell-note">{{ d.note }}</span>{% endif %}</td>
      </tr>
      {%- endfor %}
    </tbody>
  </table>
</div>

<p>
  The domains are two-way nested: the 3 km nest sits inside the 9 km domain, which sits inside
  the 18 km domain, and each nest feeds its solution back to its parent. The outer domain
  exists to supply lateral boundary conditions and its gridded fields are not published.
</p>

## Configuration

<div class="table-scroll">
  <table class="spec">
    <tbody>
      {%- for p in wrf.physics %}
      <tr><th scope="row">{{ p.name }}</th><td>{{ p.value }}</td></tr>
      {%- endfor %}
      <tr><th scope="row">Forecast length</th><td>{{ wrf.length }}</td></tr>
      <tr><th scope="row">Cycle</th><td>Daily, from the {{ wrf.cycle }} GFS cycle</td></tr>
    </tbody>
  </table>
</div>

## Practical limits

<aside class="callout callout--info" role="note">
  <div class="callout__body">
    <ul class="plain-list">
      <li>Initialisation comes from publicly available GFS data, so the forecast inherits
          whatever errors GFS starts with.</li>
      <li>The model needs spin-up time to become numerically stable. Discard the first hour
          of every run.</li>
      <li>Observed soundings for verification are in the
          <a href="https://weather.uwyo.edu/upperair/sounding.shtml">University of Wyoming
          upper-air database</a>.</li>
      <li>Customised forecast products can be produced on request &mdash; contact
          <a href="mailto:{{ site.contact_email }}">{{ site.contact_name }}</a>.</li>
      <li>SAWS is the only entity in South Africa that may issue weather warnings.</li>
    </ul>
  </div>
</aside>
