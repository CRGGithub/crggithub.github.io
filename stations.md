---
layout: page
title: Stations
permalink: /stations.html
eyebrow: Observed
tagline: Live conditions and year-to-date records from NWU's automatic weather stations.
description: >-
  Hourly observations and year-to-date climate records from the automatic
  weather stations operated by the NWU Climatology Research Group around
  Potchefstroom.
scripts:
  - /assets/js/stations.js
---

{%- assign st = site.data.stations -%}
{%- assign live = site.data_host | append: st.live_page -%}

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
    <span class="timebar__label">Feed</span>
    <span class="badge badge--accent">Hourly</span>
  </span>
</div>

<p>
  These are <strong>measurements</strong>, not forecasts. Where the
  <a href="{{ '/wrf.html' | relative_url }}">WRF pages</a> show what the model expects,
  this page shows what the instruments actually recorded. Station readings are also the
  yardstick the model gets verified against.
</p>

<aside class="callout callout--warn" role="note">
  <div class="callout__body">
    <p class="callout__title">Raw telemetry</p>
    <p>
      These values come straight off station telemetry. They are
      <strong>not quality-controlled or homogenised</strong>, so a failed sensor, a blocked
      rain gauge or a communications gap shows up here as data rather than as a gap. Treat
      them accordingly, and get in touch before using them in published work.
    </p>
  </div>
</aside>

## Current conditions

{% include live-embed.html
   path=st.live_page
   kind="frame"
   title="Live station readings"
   height="34rem"
   note="Refreshed hourly on the data server. Times shown in the panel are SAST." %}

<p>
  <a class="btn btn--ghost" href="{{ live }}" target="_blank" rel="noopener">
    Open the full station report
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/></svg>
  </a>
</p>

## Year-to-date trends

<p>
  Every station carries the same six records for the current calendar year. Pick a station
  to switch the whole set.
</p>

<div data-stations>
  <ul class="chips" data-station-chips role="group" aria-label="Station">
    {%- for s in st.stations %}
    <li>
      <button type="button" class="chip" data-station="{{ s.id }}"
              aria-pressed="{% if s.default %}true{% else %}false{% endif %}">{{ s.name }}</button>
    </li>
    {%- endfor %}
  </ul>

  {%- assign fallback = st.stations | where: "default", true | first -%}
  {%- assign fallback = fallback | default: st.stations[0] -%}

  <p data-station-blurb class="card__body">{{ fallback.blurb | strip_newlines | strip }}</p>

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
      <figcaption class="panel__foot"><p>{{ c.note }}</p></figcaption>
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

## The network

<div class="table-scroll">
  <table>
    <thead><tr><th>Station</th><th>Type</th><th>Notes</th></tr></thead>
    <tbody>
      {%- for s in st.stations %}
      <tr>
        <td><strong>{{ s.name }}</strong></td>
        <td>{{ s.kind }}</td>
        <td>{{ s.blurb | strip_newlines | strip }}</td>
      </tr>
      {%- endfor %}
    </tbody>
  </table>
</div>

## What is measured

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

<aside class="callout callout--info" role="note">
  <div class="callout__body">
    <p>
      Station data for research, teaching or a specific site is available on request &mdash;
      contact <a href="mailto:{{ site.contact_email }}">{{ site.contact_name }}</a>.
    </p>
  </div>
</aside>
