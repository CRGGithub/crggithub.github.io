---
layout: page
title: Warnings
permalink: /warnings.html
eyebrow: Official &middot; South African Weather Service
tagline: Every severe-weather warning currently in force in South Africa, mirrored from the SAWS alert feed.
description: >-
  Live mirror of South African Weather Service severe-weather warnings - hazard,
  warning level, affected municipalities, expected impacts and validity period.
scripts:
  - /assets/js/warnings.js
---

{%- assign feed = site.data.saws_warnings -%}

<aside class="callout callout--warn" role="note">
  <div class="callout__body">
    <p class="callout__title">These warnings are not ours</p>
    <p>
      The <a href="{{ feed.source_page }}">South African Weather Service</a> is the only
      institution mandated to issue weather warnings in South Africa. Everything on this
      page is reproduced from the official SAWS Common Alerting Protocol feed, unaltered.
      Nothing published elsewhere on this site is a warning. In an emergency, act on SAWS
      and on your local disaster management centre &mdash; not on a university research
      page.
    </p>
  </div>
</aside>

{% include warnings-list.html %}

## How to read a SAWS warning

<p>
  SAWS grades severe weather on a ten-point impact-based scale rather than on the weather
  alone. The level combines how likely the event is with how much damage it is expected to
  do, so a moderate rainfall event over a dense settlement can outrank a heavier one over
  open veld.
</p>

<div class="table-scroll">
  <table>
    <thead>
      <tr><th>Level</th><th>Colour</th><th>What it means</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Advisory</strong></td>
        <td><span class="warnkey warnkey--advisory">Advisory</span></td>
        <td>Conditions worth knowing about, below warning threshold. Plan around it.</td>
      </tr>
      <tr>
        <td><strong>1&ndash;4</strong></td>
        <td><span class="warnkey warnkey--yellow">Yellow</span></td>
        <td>Localised impacts. Some disruption to travel and outdoor activity.</td>
      </tr>
      <tr>
        <td><strong>5&ndash;8</strong></td>
        <td><span class="warnkey warnkey--orange">Orange</span></td>
        <td>Widespread or significant impacts. Damage, injuries and interrupted services likely.</td>
      </tr>
      <tr>
        <td><strong>9&ndash;10</strong></td>
        <td><span class="warnkey warnkey--red">Red</span></td>
        <td>Severe, widespread impacts on people, property and infrastructure. Act now.</td>
      </tr>
    </tbody>
  </table>
</div>

<p>
  The <strong>affected areas</strong> on each card are the municipalities SAWS listed in the
  alert polygon. <strong>Certainty</strong> and <strong>urgency</strong> are the forecaster's
  own CAP fields: <em>Observed</em> means the weather is already happening, <em>Likely</em>
  that it is expected, and <em>Immediate</em> that responsive action should be taken now.
</p>

## Why this page exists, and what it is not

<p>
  A radar image and a model forecast tell you what the atmosphere is doing. They do not tell
  you what has been officially declared, which is the thing that actually triggers a response
  from a municipality, a farm or a school. Putting the official warnings next to our own
  observations and forecasts makes the difference between the two explicit &mdash; and makes
  it obvious which one carries authority.
</p>

<p>
  This mirror is rebuilt on a schedule, so it lags the SAWS feed by up to half an hour, and
  it can go stale entirely if the SAWS servers are unreachable when the site is built. The
  page always shows when it was last checked. It is not a substitute for the
  <a href="{{ feed.source_page }}">SAWS website</a>, the SAWS mobile app, or the
  <a href="{{ feed.source }}">alert feed itself</a>.
</p>

{% include disclaimer.html %}
