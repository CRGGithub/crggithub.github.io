---
layout: page
tagline: A Living Weather Laboratory
---
<meta http-equiv="refresh" content="120" >

## New Developments: [The NWU-WRF: Online and Operational](http://www.lekwenaradar.co.za/143.160.8.22/wrf/wrf.html)

The Weather Research and Forecasting Model (WRF) is an advanced, community
driven, and open source weather model that can be used for both operational
forecasting and meteorological research at a variety of scales. Along with The
NWU-Lekwena Radar, The NWU-WRF puts the North-West University Potchefstroom at
the forefront of numerical weather prediction research in Africa, as the only
university running an *in-house*, student driven operational weather radar and
an operational numerical weather prediction model. Read more about WRF on the
[official user page](https://www2.mmm.ucar.edu/wrf/users/).

## Radar Status: **ONLINE**

To learn more about the radar and how to interpret the image [click here](http://www.lekwenaradar.co.za/about)

<html>
<head>
<script>
function startTime() {
  var today = new Date();
  var h = today.getUTCHours();
  var m = today.getUTCMinutes();
  var s = today.getUTCSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('txt').innerHTML =
  h + ":" + m + ":" + s;
  var t = setTimeout(startTime, 500);
}
function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}
</script>
</head>

<body onload="startTime()">
The current UTC time is:
<div id="txt"></div>
</body>
</html>

---
# Maximum dBZ

Click on "layer" to open radar overlay or refresh your browser if the map box is missing

<iframe style='height: 500pt; width: 100%;' frameborder="0" scrolling="no" id="iframe" src="http://143.160.8.22/leaflet.html"></iframe>

<p align="center">
<img src="/assets/images/radar/radardbz.png" alt="viridis" align="middle"> 
</p> 

---
# Detailed storm characteristics

Detailed storm characteristics is availible by clicking on the red polygon, or the black storm track. It is usefull to examine the static image below to see where interference is wrongly identified, and tracked, as a storm by the algorithm.  Refresh your browser if the map box is missing.

<iframe style='height: 500pt; width: 100%;' frameborder="0" scrolling="no" id="iframe" src="http://143.160.8.22/shpmap.html"></iframe>

---
# Static Image

![radar_image](http://143.160.8.22/latest.gif)

# Disclaimer
The NWU-Lekwena Radar and The NWU-WRF is a test bed for students to learn and
develop creative solutions related to weather forecasting and now-casting. This
means that the radar and model can be switched off for maintenance or it could
be broken on purpose in the name of learning. The radar and model should not be
used as a tool to make any severe weather alerts as the South-African Weather
Service is the only credible institution to do this. The products created here
should only be viewed as a tool for the development of young scientists and
something interesting to look at.
