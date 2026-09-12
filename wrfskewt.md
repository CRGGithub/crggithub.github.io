---
layout: page
title: Soundings
permalink: /wrfskewt.html
eyebrow: Forecast
tagline: Forecast Skew-T / log-p diagrams for 34 locations across South Africa and its neighbours.
description: >-
  WRF forecast Skew-T / log-p soundings for 34 locations, from a 3 km
  convection-permitting nest over the Highveld out to the 9 km outer domain.
---

{%- assign snd = site.data.soundings -%}
{%- assign base = site.data_host | append: site.data_paths.wrf_prefix -%}

<p>
  Forecast profiles stepped through the run, grouped by the domain that produces them.
</p>

<aside class="callout callout--info" role="note">
  <div class="callout__body">
    <p>
      These are <strong>model</strong> soundings, not observations. For observed profiles to
      verify against, use the
      <a href="https://weather.uwyo.edu/upperair/sounding.shtml">University of Wyoming
      upper-air database</a>.
    </p>
  </div>
</aside>

{%- for g in snd.groups %}
## {{ g.title }}

<p>
  <span class="badge badge--accent">{{ g.domain }} &middot; {{ g.resolution }}</span>
</p>

<p>{{ g.blurb | strip_newlines | strip }}</p>

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

## Practical limits

<aside class="callout callout--info" role="note">
  <div class="callout__body">
    <ul class="plain-list">
      <li>Initialised from public GFS analyses.</li>
      <li>Discard the first hour of each run for spin-up.</li>
      <li>Customised products on request:
          <a href="mailto:{{ site.contact_email }}">{{ site.contact_name }}</a>.</li>
      <li>SAWS is the only entity in South Africa mandated to issue weather warnings.</li>
    </ul>
  </div>
</aside>
