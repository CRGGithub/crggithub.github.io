---
layout: page
title: Soundings
permalink: /wrfskewt.html
eyebrow: Forecast
tagline: Forecast temperature, moisture and wind above 34 towns, from the ground up.
description: >-
  WRF forecast Skew-T / log-p soundings for 34 locations, from a 3 km
  convection-permitting nest over the Highveld out to the 9 km outer domain.
---

{%- assign snd = site.data.soundings -%}
{%- assign base = site.data_host | append: site.data_paths.wrf_prefix -%}

{%- for g in snd.groups %}
## {{ g.title }}

<ul class="chips">
  {%- for s in g.stations %}
  <li>
    <a class="chip" href="{{ base }}{{ s.page }}" target="_blank" rel="noopener">
      {{ s.name }}
      <svg class="chip__ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M9 7h8v8"/></svg>
    </a>
  </li>
  {%- endfor %}
</ul>
{%- endfor %}

<details class="fold">
  <summary>About soundings</summary>
  <div class="fold__body">
    <p>
      Each page is a forecast Skew-T / log-p diagram stepped through the run. These are
      <strong>model</strong> soundings, not observations; for observed profiles use the
      <a href="https://weather.uwyo.edu/upperair/sounding.shtml">University of Wyoming upper-air database</a>.
    </p>
    <ul>
      {%- for g in snd.groups %}
      <li><strong>{{ g.title }}</strong> ({{ g.domain }}, {{ g.resolution }}): {{ g.blurb | strip_newlines | strip }}</li>
      {%- endfor %}
      <li>Initialised from public GFS analyses; discard the first hour of each run for spin-up.</li>
      <li>Only the SA Weather Service issues official warnings.</li>
    </ul>
  </div>
</details>
