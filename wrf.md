---
layout: page
title: NWU-WRF
permalink: /wrf.html
eyebrow: Forecast
tagline: A three-domain operational WRF-ARW forecast, run in house every day.
description: >-
  The North-West University operational WRF forecast - 18, 9 and 3 km domains
  over Southern Africa, with gridded fields and sector impact dashboards.
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
  An operational WRF-ARW configuration run in house each day and co-located with the Lekwena
  radar and the NWU station network for verification. Model documentation is maintained by the
  <a href="https://www2.mmm.ucar.edu/wrf/users/">WRF user community</a>.
</p>

<p>
  <a class="btn btn--primary" href="{{ portal }}" target="_blank" rel="noopener">
    Open the full WRF portal
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/></svg>
  </a>
</p>

## Synoptic overview

<p>
  Surface analysis with the two upper-air levels that drive it, on the {{ wrf.overview.coverage }}
  domain. Stepped three-hourly from T+12 h to T+72 h.
</p>

<ul class="card-grid card-grid--wide">
  <li>
    <a class="card" href="{{ base }}{{ wrf.overview.page }}" target="_blank" rel="noopener">
      <p class="card__eyebrow">{{ wrf.overview.scale }} domain</p>
      <h3 class="card__title">{{ wrf.overview.title }}</h3>
      <p class="card__body">{{ wrf.overview.blurb | strip_newlines | strip }}</p>
      <span class="card__foot">Open the overview &nearr;</span>
    </a>
  </li>
</ul>

## Official warnings

<p>
  Issued by the <a href="https://www.weathersa.co.za/">South African Weather Service</a>.
</p>

<ul class="card-grid card-grid--wide">
  <li>
    <a class="card" href="{{ base }}{{ wrf.warnings.page }}" target="_blank" rel="noopener">
      <p class="card__eyebrow">Official &middot; SAWS</p>
      <h3 class="card__title">{{ wrf.warnings.title }}</h3>
      <p class="card__body">{{ wrf.warnings.blurb | strip_newlines | strip }}</p>
      <span class="card__foot">Open the warnings &nearr;</span>
    </a>
  </li>
</ul>

## Impact dashboards

<p>
  Model output scored per location against storm, heat, frost, fire and agricultural
  decision thresholds.
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

## Severe convective environment

<p>
  {{ wrf.severe.blurb | strip_newlines | strip }}
</p>

<ul class="card-grid card-grid--wide">
  <li>
    <a class="card" href="{{ base }}{{ wrf.severe.page }}" target="_blank" rel="noopener">
      <p class="card__eyebrow">{{ wrf.severe.scale }} domain</p>
      <h3 class="card__title">{{ wrf.severe.title }}</h3>
      <p class="card__body">{{ wrf.severe.note | strip_newlines | strip }}</p>
      <span class="card__foot">Open the forecast &nearr;</span>
    </a>
  </li>
</ul>

## Gridded fields

<p>
  Each field is published at both resolutions. The 3 km nest resolves convection explicitly
  and is the better guide to thunderstorm timing, placement and mode over the Highveld.
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

### Interactive maps

<p>
  Three of the fields above on an OpenStreetMap basemap, with a frame slider and an
  opacity control. 9 km only.
</p>

<ul class="chips">
  {%- for m in wrf.maps %}
  <li>
    <a class="chip" href="{{ base }}{{ m.page }}" target="_blank" rel="noopener">
      {{ m.title }}
      <svg class="chip__ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M9 7h8v8"/></svg>
    </a>
  </li>
  {%- endfor %}
</ul>

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
  The domains are two-way nested. The outer domain supplies lateral boundary conditions only;
  its gridded fields are not published.
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
      <li>Initialised from public GFS analyses, so GFS initial-condition error propagates
          into the forecast.</li>
      <li>Discard the first hour of each run for spin-up.</li>
      <li>Verify against observed profiles in the
          <a href="https://weather.uwyo.edu/upperair/sounding.shtml">University of Wyoming
          upper-air database</a>.</li>
      <li>Customised products on request:
          <a href="mailto:{{ site.contact_email }}">{{ site.contact_name }}</a>.</li>
      <li>SAWS is the only entity in South Africa mandated to issue weather warnings.</li>
    </ul>
  </div>
</aside>
