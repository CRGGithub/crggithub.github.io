---
layout: page
title: Soundings
permalink: /wrfskewt.html
eyebrow: Forecast
tagline: Forecast Skew-T / log-p diagrams for 48 locations across Southern Africa.
description: >-
  WRF forecast Skew-T / log-p soundings for 48 Southern African locations,
  from a 3 km convection-permitting nest out to the 18 km synoptic domain.
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

## Where the stations are

<p>
  18 km and 9 km stations only; the 3 km Highveld sites are too closely spaced to label at
  this scale.
</p>

<figure class="hotspot-map">
  <div class="hotspot-map__frame"
       style="aspect-ratio: {{ snd.map_image.width }} / {{ snd.map_image.height }}">
    <img src="{{ snd.map_image.src | relative_url }}"
         width="{{ snd.map_image.width }}" height="{{ snd.map_image.height }}"
         alt="Map of Southern Africa showing the forecast sounding locations"
         loading="lazy" decoding="async">
    {%- for a in snd.map_image.areas %}
    <a class="hotspot" href="{{ base }}{{ a.page }}" target="_blank" rel="noopener"
       title="{{ a.title }} sounding"
       style="left:{{ a.left }}%;top:{{ a.top }}%;width:{{ a.width }}%;height:{{ a.height }}%">
      <span class="visually-hidden">{{ a.title }} sounding</span>
    </a>
    {%- endfor %}
  </div>
  <figcaption>Click a station to open its forecast profile.</figcaption>
</figure>

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
