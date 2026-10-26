---
layout: page
title: Forecasts
permalink: /wrf.html
eyebrow: NWU-WRF forecast
tagline: Our own forecast for the next three days, updated twice a day.
description: >-
  Three-day forecast maps, impact and farm dashboards from the North-West
  University's in-house WRF weather model, updated twice a day.
---

{%- assign wrf = site.data.wrf -%}
{%- assign base = site.data_host | append: site.data_paths.wrf_prefix -%}

## Official warnings

<ul class="btn-row">
  <li><a class="btn btn--primary btn--lg" href="{{ base }}{{ wrf.warnings.map_page }}" target="_blank" rel="noopener">SAWS warnings map &nearr;</a></li>
</ul>

## Weather overview

<ul class="btn-row">
  <li><a class="btn btn--ghost btn--lg" href="{{ base }}{{ wrf.overview.page }}" target="_blank" rel="noopener">South Africa &nearr;</a></li>
  <li><a class="btn btn--ghost btn--lg" href="{{ base }}{{ wrf.gfs_overview.page }}" target="_blank" rel="noopener">Wider region &nearr;</a></li>
</ul>

## Impact dashboards

<ul class="btn-row">
  {%- for d in wrf.dashboards %}
  <li><a class="btn btn--ghost btn--lg" href="{{ base }}{{ d.page }}" target="_blank" rel="noopener">{{ d.short }} &nearr;</a></li>
  {%- endfor %}
</ul>

## Agri forecast

<ul class="btn-row">
  <li><a class="btn btn--primary btn--lg" href="{{ base }}{{ wrf.agri.dashboard.page }}" target="_blank" rel="noopener">Farm dashboard: 31 towns &nearr;</a></li>
</ul>

<ul class="btn-row">
  {%- for m in wrf.agri.maps %}
  <li><a class="btn btn--ghost btn--sm" href="{{ base }}{{ m.page | replace: '.html', '_map.html' }}" target="_blank" rel="noopener" title="{{ m.title }}">{{ m.short }}</a></li>
  {%- endfor %}
</ul>

<p class="tech">Maize Trust Early Warning for Farmers project.</p>

## Forecast maps

<p class="lead-line">
  Zoom in and play through the next three days, for all of South Africa or a closer look at
  North West and Gauteng.
</p>

<ul class="mapgrid">
  {%- for f in wrf.fields %}
  {%- assign interactive = f.page | replace: '.html', '_map.html' %}
  <li>
    <div class="mapcard">
      <h3 class="mapcard__name">{{ f.name }}<span class="mapcard__term">{{ f.title }}</span></h3>
      <p class="mapcard__actions">
        <a class="btn btn--ghost btn--sm" href="{{ base }}{{ interactive }}" target="_blank" rel="noopener"
           aria-label="{{ f.name }}, South Africa map">South Africa</a>
        <a class="btn btn--ghost btn--sm" href="{{ base }}nwgp_{{ interactive }}" target="_blank" rel="noopener"
           aria-label="{{ f.name }}, North West and Gauteng map">NW &amp; Gauteng</a>
      </p>
    </div>
  </li>
  {%- endfor %}
  <li>
    <div class="mapcard">
      <h3 class="mapcard__name">{{ wrf.severe.name }}<span class="mapcard__term">SCEP &middot; experimental, not a warning</span></h3>
      <p class="mapcard__actions">
        <a class="btn btn--ghost btn--sm" href="{{ base }}{{ wrf.severe.map_page }}" target="_blank" rel="noopener"
           aria-label="Severe storm potential map">Map</a>
        <a class="btn btn--ghost btn--sm" href="{{ base }}{{ wrf.severe.radar_map_page }}" target="_blank" rel="noopener"
           aria-label="Severe storm potential with simulated rain">With rain</a>
      </p>
    </div>
  </li>
</ul>

<p>
  Want the atmosphere above a town? See the <a href="{{ '/wrfskewt.html' | relative_url }}">soundings</a>.
</p>

<details class="fold">
  <summary>About the forecast model</summary>
  <div class="fold__body">
    <p>
      An in-house {{ wrf.version }} configuration, run twice a day from the
      {{ wrf.cycles | join: ' and ' }} NCEP GFS cycles, {{ wrf.length }} ahead. It is a research
      forecast: only the SA Weather Service issues official warnings. Model documentation is kept by the
      <a href="https://www2.mmm.ucar.edu/wrf/users/">WRF user community</a>; custom forecasts on
      request from <a href="mailto:{{ site.contact_email }}">{{ site.contact_name }}</a>.
    </p>

    <h3>Domains</h3>
    <div class="table-scroll">
      <table>
        <thead><tr><th>Domain</th><th>Resolution</th><th>Grid</th><th>Extent</th><th>Coverage</th></tr></thead>
        <tbody>
          {%- for d in wrf.domains %}
          <tr>
            <td><strong>{{ d.id }}</strong><br><span class="cell-note">{{ d.label }}</span></td>
            <td>{{ d.resolution }}</td><td>{{ d.grid }}</td><td>{{ d.extent }}</td>
            <td>{{ d.coverage }}{% if d.note %}<br><span class="cell-note">{{ d.note }}</span>{% endif %}</td>
          </tr>
          {%- endfor %}
        </tbody>
      </table>
    </div>

    <h3>Configuration</h3>
    <div class="table-scroll">
      <table class="spec">
        <tbody>
          {%- for p in wrf.physics %}
          <tr><th scope="row">{{ p.name }}</th><td>{{ p.value }}</td></tr>
          {%- endfor %}
          <tr><th scope="row">Forecast length</th><td>{{ wrf.length }}</td></tr>
          <tr><th scope="row">Cycles</th><td>Twice daily, from the {{ wrf.cycles | join: ' and ' }} GFS cycles</td></tr>
        </tbody>
      </table>
    </div>

    <h3>Good to know</h3>
    <ul>
      <li>Initialised from public GFS analyses, so GFS starting errors carry into the forecast.</li>
      <li>Discard the first hour of each run for spin-up.</li>
      <li>Verify against observed profiles in the
          <a href="https://weather.uwyo.edu/upperair/sounding.shtml">University of Wyoming upper-air database</a>.</li>
    </ul>

    <p>
      <a href="{{ site.data_host }}{{ site.data_paths.wrf_portal }}" target="_blank" rel="noopener">Full forecast portal &nearr;</a>
      &middot; Plain images without the zoomable map:
      <a href="{{ base }}{{ wrf.static_maps }}" target="_blank" rel="noopener">forecast fields</a>,
      <a href="{{ base }}{{ wrf.severe.page }}" target="_blank" rel="noopener">SCEP</a>,
      <a href="{{ base }}{{ wrf.warnings.page }}" target="_blank" rel="noopener">SAWS warnings list</a>.
    </p>
  </div>
</details>
