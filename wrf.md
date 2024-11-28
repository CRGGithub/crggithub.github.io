---
layout: page
title: NWU-WRF
tagline: North-West University Operational WRF
permalink: /wrf.html
---

## Forecasts 
<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
    <button onclick="window.open('http://143.160.8.22/wrf/wrfrainfall.html', '_blank')" 
            style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer;">
        Precipitation
    </button>
    <button onclick="window.open('http://143.160.8.22/wrf/wrfradar.html', '_blank')" 
            style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer;">
        Radar
    </button>
    <button onclick="window.open('http://143.160.8.22/wrf/wrfwindspeed.html', '_blank')" 
            style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer;">
        Maximum Wind Gust
    </button>
    <button onclick="window.open('http://143.160.8.22/wrf/wrfcape.html', '_blank')" 
            style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer;">
        CAPE
    </button>
    <button onclick="window.open('http://143.160.8.22/wrf/wrflfc.html', '_blank')" 
            style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer;">
        LFC
    </button>
    <button onclick="window.open('http://143.160.8.22/wrf/wrfcf.html', '_blank')" 
            style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer;">
        Cloud Fraction
    </button>
    <button onclick="window.open('http://143.160.8.22/wrf/wrftemp.html', '_blank')" 
            style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer;">
        Temperature
    </button>
    <button onclick="window.open('http://143.160.8.22/wrf/wrfhi.html', '_blank')" 
            style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer;">
        Heat Index
    </button>
</div>

---

<script>
    // Utility to toggle content visibility
    function toggleContent(buttonId, contentId) {
        document.getElementById(buttonId).addEventListener("click", function() {
            var content = document.getElementById(contentId);
            content.style.display = content.style.display === "none" || content.style.display === "" ? "block" : "none";
        });
    }

    // Attach toggle events for all buttons
    toggleContent("precipitationButton", "precipitationContent");
    toggleContent("radarButton", "radarContent");
    toggleContent("windGustButton", "windGustContent");
    toggleContent("capeButton", "capeContent");
    toggleContent("lfcButton", "lfcContent");
    toggleContent("cloudFractionButton", "cloudFractionContent");
    toggleContent("temperatureButton", "temperatureContent");
    toggleContent("heatIndexButton", "heatIndexContent");
</script>

The Weather Research and Forecasting Model (WRF) is an advanced, community
driven, and open source weather model that can be used for both operational
forecasting and meteorological research at a variety of scales. Along with The
NWU-Lekwena Radar, The NWU-WRF puts the North-West University Potchefstroom at
the forefront of numerical weather prediction research in Africa, as the only
university running an *in-house*, student driven operational weather radar and
an operational numerical weather prediction model. Read more about WRF on the
[official user page](https://www2.mmm.ucar.edu/wrf/users/).

**The Weather Research and Forecasting Model Version (WRFV) 4.6.1**,
Microphysics=New Thompson, *et.al* (8),
Longwave Radiation=RRTMG scheme (4),
Shortwave Radiation=RRTMG scheme (4),
Land Surface=Noah Land Surface Model (2),
Planetary Boundary layer=Yonsei University scheme (1),
Cumulus Parameterization=Grell-Freitas (3),
Model Vertical Levels=34

#### Initialization Strategy
![forecast_strat]({{ "/assets/images/wrf_forecast.png" | absolute_url }})

---

#### Practical considerations and limitations
+ The model is initialized using publicly available GFS data. The GFS forecasts are also viewable [here](http://www.lekwenaradar.co.za/forecast.html)
+ The model requires *spin-up* time to become numerically stable, the first hour of the forecast should be discarded
+ For observed Skew-T diagrams please visit the [University of Wyoming Upper-Air Database](http://weather.uwyo.edu/upperair/sounding.html)
+ Customized forecast products is available on request
+ Please note that SAWS is the only entity in South-Africa which can issue weather related warnings
