---
layout: page
title: About
permalink: /about.html
eyebrow: Background
tagline: What the Lekwena radar is, how to read it, and who built it.
description: >-
  How to interpret the NWU Lekwena radar imagery, the background to the project,
  its partners, and press coverage of the radar since its 2018 launch.
---

## Reading the radar image

### Time

Every product is stamped in **Coordinated Universal Time (UTC)**, not South African
Standard Time. Add two hours to get SAST &mdash; 12:04 UTC is 14:04 SAST. Use this as
your first health check: if the stamp on the image is not within about ten minutes of
the real time, the radar or the webserver is down and you are looking at an old scan.

<figure>
  <img src="{{ '/assets/images/radar/RadarTime.png' | relative_url }}"
       alt="Close-up of the radar image showing where the UTC timestamp appears"
       loading="lazy" decoding="async">
</figure>

<div class="timebar">
  <span class="timebar__item">
    <span class="timebar__label">Now, UTC</span>
    <span class="clock"><span class="clock__time" data-clock="utc">--:--:--</span></span>
  </span>
  <span class="timebar__item">
    <span class="timebar__label">Now, SAST</span>
    <span class="clock"><span class="clock__time" data-clock="sast">--:--:--</span></span>
  </span>
</div>

### Reflectivity (dBZ)

A radar works by sending out a high-frequency pulse and listening for the echo that comes
back when the pulse hits something large enough to scatter it &mdash; raindrops, hail,
ice. The strength of that echo is reported as *decibels relative to Z*, or dBZ. Strong
dBZ means large particles are sending back a strong echo: heavy rain, hail, or ice
particles high in a storm.

<figure>
  <img src="{{ '/assets/images/radar/RadarDBZ.png' | relative_url }}"
       alt="Radar image annotated with the dBZ reflectivity scale"
       loading="lazy" decoding="async">
</figure>

### Interference

The Lekwena radar is licensed to operate at 5.62 GHz. Any WiFi or communication network
running between 5.55 and 5.67 GHz interferes with it and degrades the data, which is why
those spikes and streaks appear across otherwise clear scans.

The public around Potchefstroom is asked to avoid these bands. The NWU Climatology
Research Group is happy to advise on installing Dynamic Frequency Selection (DFS)
equipment, and your service provider can tell you what frequency your own devices use.

<figure>
  <img src="{{ '/assets/images/radar/RadarInterf.png' | relative_url }}"
       alt="Radar image showing streaks of radio-frequency interference"
       loading="lazy" decoding="async">
</figure>

### Place markers

Towns are labelled with abbreviations, regional airports in Gauteng carry an aeroplane
symbol, and the small cloud marks the SAWS Irene weather station. The concentric rings
show distance from the radar site. The outermost is 200 km, which is about as far as the
beam is useful before the curvature of the earth and other effects take over.

<figure>
  <img src="{{ '/assets/images/radar/RadarAirports.png' | relative_url }}"
       alt="Radar image showing town abbreviations, airport symbols and range rings"
       loading="lazy" decoding="async">
</figure>

## Live image

{% include live-embed.html
   path=site.data_paths.radar_gif
   kind="image"
   title="Lekwena C-band reflectivity"
   alt="Latest reflectivity image from the NWU Lekwena radar"
   refresh=120
   note="The full radar page has the interactive dBZ map and tracked storm cells." %}

## Background

Weather and climate touch every part of society, from a slow drive home to loss of life
and damage to property. Weather radar is the essential tool for watching thunderstorms in
real time and acting on what you see. South Africa has a long history in radar science and
runs a world-class national network operated by the South African Weather Service, which is
part of the country's national infrastructure.

### Aims

This project exists to support SAWS and national government in sustaining that resource
and getting more out of it. It does that by giving students from several disciplines
hands-on experience with the technology, building awareness of what weather radar can do,
and carrying out applied research that can turn into products and services for the
national network.

### Partners

The North-West University and the Water Research Commission funded the acquisition,
installation and upgrade of the radar just outside Potchefstroom. Lekwena Wildlife Estate
provided the site along with access control and security, and Aon Benfield funded the
communication link that makes real-time access possible.

## Disclaimer

{% include disclaimer.html %}

## Further reading

<ul class="linklist">
  <li><a href="https://www.weather.gov/jetstream/refl"><span class="linklist__name">Radar images: reflectivity</span><span class="linklist__note">NOAA JetStream</span></a></li>
  <li><a href="https://www.wunderground.com/prepare/understanding-radar"><span class="linklist__name">Understanding weather radar</span><span class="linklist__note">Weather Underground</span></a></li>
  <li><a href="https://www.weather.gov/iwx/wsr_88d"><span class="linklist__name">Everything about the NWS WSR-88D</span><span class="linklist__note">National Weather Service</span></a></li>
  <li><a href="http://www.wxonline.info/topics/radar_nonmet.html"><span class="linklist__name">Radar basics for the non-meteorologist</span><span class="linklist__note">wxonline.info</span></a></li>
</ul>

## Media coverage

### Video

<div class="video-grid">
  <figure>
    <div class="video">
      <iframe src="https://www.youtube-nocookie.com/embed/rxR76pKYzEY" title="John Deere promotional video featuring the NWU Lekwena radar"
              loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    <figcaption>John Deere promotional video.</figcaption>
  </figure>
  <figure>
    <div class="video">
      <iframe src="https://www.youtube-nocookie.com/embed/Qx6tBsroYp4" title="NWU Lekwena radar launch video"
              loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>
    </div>
    <figcaption>Radar launch.</figcaption>
  </figure>
  <figure>
    <div class="video">
      <iframe src="https://www.youtube-nocookie.com/embed/_24UmPmp7Nw" title="eNCA news segment on the NWU Lekwena radar"
              loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>
    </div>
    <figcaption>eNCA segment.</figcaption>
  </figure>
  <figure>
    <div class="video">
      <iframe src="https://www.youtube-nocookie.com/embed/MHTK52bovg8" title="Second eNCA news segment on the NWU Lekwena radar"
              loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>
    </div>
    <figcaption>eNCA segment.</figcaption>
  </figure>
</div>

### Press

**Department of Environmental Affairs.** The Minister of Environmental Affairs,
Dr Edna Molewa, officially launched the state-of-the-art North-West University Lekwena
weather radar in Potchefstroom on Thursday 22 March 2018, the day before World
Meteorological Day. That year's theme was "weather-ready, climate-smart."
*Media release, Department of Environmental Affairs, 22 March 2018 &mdash; no longer online.*

**North-West University.** The radar is the result of a three-year study commissioned by
the Water Research Commission to develop a rainfall estimation algorithm using data from
the new dual-polarised Doppler radar, validated against a dense rain gauge network.
[Read the release](https://news.nwu.ac.za/nwu-launches-lekwena-weather-radar)

**SABC News.** Minister Molewa welcomed the Climatology Research Unit's work revamping
weather radars built in the 1970s and 1980s.
[Read the article](https://www.sabcnews.com/sabcnews/minister-applauds-north-west-universitys-innovation/)

**Traveller24.** South Africa's meteorological science field got a big new shiny weather
radar, launched by the Environmental Affairs Minister and SAWS in Potchefstroom, just in
time for World Meteorological Day.
[Read the archived article](https://web.archive.org/web/20180826090118/https://www.traveller24.com/News/WeatherUpdate/worldmeteorologicalday-sa-university-launches-new-weather-radar-to-monitor-storms-20180322)
