---
layout: page
title: Stations
permalink: /stations.html
eyebrow: Observed
tagline: What NWU's weather stations around Potchefstroom are measuring.
description: >-
  Live readings and this year's records from the NWU automatic weather stations
  and soil moisture probe around Potchefstroom.
scripts:
  - /assets/js/stations.js
---

{%- assign st = site.data.stations -%}
{%- assign live = site.data_host | append: st.live_page -%}

## Right now

{% include live-embed.html
   path=st.live_page
   kind="frame"
   title="Live readings"
   height="34rem"
   note="Updated hourly; times are SAST. Raw readings, not quality-checked." %}

<p class="tech"><a href="{{ live }}" target="_blank" rel="noopener">Open the full station report &nearr;</a></p>

## This year

<div data-stations>
  <ul class="chips" data-station-chips data-hide-when-blocked role="group" aria-label="Station">
    {%- for s in st.stations %}
    <li>
      <button type="button" class="chip" data-station="{{ s.id }}"
              aria-pressed="{% if s.default %}true{% else %}false{% endif %}">{{ s.name }}</button>
    </li>
    {%- endfor %}
  </ul>

  {%- assign fallback = st.stations | where: "default", true | first -%}
  {%- assign fallback = fallback | default: st.stations[0] -%}

  <div class="chart-grid"
       data-live-embed
       data-kind="frame"
       data-url="{{ live }}"
       data-label="the station charts">
    {%- for c in st.charts %}
    <figure class="panel">
      <div class="panel__head">
        <h3 class="panel__title">{{ c.title }}</h3>
      </div>
      <img class="panel__media" loading="lazy" decoding="async" referrerpolicy="no-referrer"
           data-chart="{{ c.suffix }}"
           src="{{ site.data_host }}{{ st.img_prefix }}{{ fallback.id }}_{{ c.suffix }}.png"
           alt="{{ c.title }} for {{ fallback.name }}, year to date">
    </figure>
    {%- endfor %}
  </div>
</div>

<script type="application/json" id="stations-config">
{
  "imgBase": {{ site.data_host | append: st.img_prefix | jsonify }},
  "stations": [
    {%- for s in st.stations %}
    { "id": {{ s.id | jsonify }},
      "name": {{ s.name | jsonify }},
      "blurb": {{ s.blurb | strip_newlines | strip | jsonify }} }{% unless forloop.last %},{% endunless %}
    {%- endfor %}
  ]
}
</script>

## Soil moisture

<p class="lead-line">Moisture and temperature at six depths under Potchefstroom, with the day's rain.</p>

<div class="chart-grid"
     data-live-embed
     data-kind="frame"
     data-url="{{ live }}"
     data-label="the soil moisture charts">
  {%- for c in st.soil.charts %}
  <figure class="panel">
    <div class="panel__head">
      <h3 class="panel__title">{{ c.title }}</h3>
      <span class="badge">{{ c.period }}</span>
    </div>
    <img class="panel__media" loading="lazy" decoding="async" referrerpolicy="no-referrer"
         src="{{ site.data_host }}{{ st.img_prefix }}soil_{{ c.suffix }}.png"
         alt="{{ c.title }}, {{ c.period | downcase }}, at {{ st.soil.site }}">
  </figure>
  {%- endfor %}
</div>

<p class="tech">
  Soil moisture is a relative index (0 = air, 100 = water), not a percentage of water in the soil.
</p>

<details class="fold">
  <summary>About the stations</summary>
  <div class="fold__body">
    <p>
      Raw station telemetry, neither quality-controlled nor homogenised, so sensor faults and
      communication gaps show up as data. Please make contact before using it in published work.
      The soil readings come from a single {{ st.soil.probe }}, in Scaled Frequency (SF): it
      tracks wetting and drying well but needs site calibration before it means water content.
    </p>

    <h3>The network</h3>
    <div class="table-scroll">
      <table>
        <thead><tr><th>Station</th><th>Type</th><th>Notes</th></tr></thead>
        <tbody>
          {%- for s in st.stations %}
          <tr><td><strong>{{ s.name }}</strong></td><td>{{ s.kind }}</td><td>{{ s.blurb | strip_newlines | strip }}</td></tr>
          {%- endfor %}
        </tbody>
      </table>
    </div>

    <h3>What is measured</h3>
    <div class="table-scroll">
      <table>
        <thead><tr><th>Variable</th><th>Unit</th><th>Notes</th></tr></thead>
        <tbody>
          {%- for v in st.variables %}
          <tr><td><strong>{{ v.name }}</strong></td><td>{{ v.unit }}</td><td>{{ v.note }}</td></tr>
          {%- endfor %}
        </tbody>
      </table>
    </div>

    <p>
      Station data for research or teaching is available on request:
      <a href="mailto:{{ site.contact_email }}">{{ site.contact_name }}</a>.
    </p>
  </div>
</details>
