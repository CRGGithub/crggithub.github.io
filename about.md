---
layout: page
title: About
permalink: /about.html
eyebrow: Background
tagline: Interpreting the Lekwena radar imagery, and the background to the facility.
description: >-
  How to interpret the NWU Lekwena radar imagery, the background to the project,
  its partners, and press coverage of the radar since its 2018 launch.
---

## Reading the radar image

### Time

Products are stamped in **Coordinated Universal Time (UTC)**; SAST is UTC+2. A stamp
more than about ten minutes behind real time indicates that the radar or the webserver
is down.

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

Echo strength is reported in dBZ. High values indicate large scatterers &mdash; heavy
rain, hail, or ice aloft.

<figure>
  <img src="{{ '/assets/images/radar/RadarDBZ.png' | relative_url }}"
       alt="Radar image annotated with the dBZ reflectivity scale"
       loading="lazy" decoding="async">
</figure>

### Interference

The radar is licensed at 5.62 GHz. Transmissions between 5.55 and 5.67 GHz degrade the
data, producing the radial spikes and streaks visible on otherwise clear scans.

Operators in the Potchefstroom area are asked to avoid these bands. The Climatology
Research Group can advise on Dynamic Frequency Selection (DFS) configuration.

<figure>
  <img src="{{ '/assets/images/radar/RadarInterf.png' | relative_url }}"
       alt="Radar image showing streaks of radio-frequency interference"
       loading="lazy" decoding="async">
</figure>

### Place markers

Towns are abbreviated, Gauteng regional airports carry an aircraft symbol, and the cloud
marks the SAWS Irene station. Range rings are centred on the radar; the outermost is
200 km, beyond which beam height and earth curvature limit usefulness.

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
   note="The radar page carries the interactive dBZ map and tracked storm cells." %}

## Background

Weather radar is the primary instrument for real-time convective monitoring. South Africa
has a long record in radar meteorology and operates a national network under the South
African Weather Service.

### Aims

The facility supports that network by training students across disciplines on operational
radar systems, and by conducting applied research intended to yield products and services
for national use.

### Partners

The North-West University and the Water Research Commission funded the acquisition,
installation and upgrade of the radar. Lekwena Wildlife Estate provides the site, access
control and security; Aon Benfield funded the communication link that makes real-time
access possible.

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
Dr Edna Molewa, launched the NWU Lekwena weather radar in Potchefstroom on 22 March 2018,
the day before World Meteorological Day.
*Media release, 22 March 2018 &mdash; no longer online.*

**North-West University.** The radar is the result of a three-year study commissioned by
the Water Research Commission to develop a rainfall estimation algorithm using data from
the new dual-polarised Doppler radar, validated against a dense rain gauge network.
[Read the release](https://news.nwu.ac.za/nwu-launches-lekwena-weather-radar)

**SABC News.** Minister Molewa welcomed the Climatology Research Unit's work revamping
weather radars built in the 1970s and 1980s.
[Read the article](https://www.sabcnews.com/sabcnews/minister-applauds-north-west-universitys-innovation/)

**Traveller24.** Coverage of the launch by the Minister of Environmental Affairs and SAWS
in Potchefstroom, timed for World Meteorological Day.
[Read the archived article](https://web.archive.org/web/20180826090118/https://www.traveller24.com/News/WeatherUpdate/worldmeteorologicalday-sa-university-launches-new-weather-radar-to-monitor-storms-20180322)
