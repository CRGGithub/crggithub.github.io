---
layout: page
title: Radar
tagline: North-West University Lekwena C-Band Radar
permalink: /radar.html
---
<meta http-equiv="refresh" content="950" >

---
<meta http-equiv="refresh" content="120" >

## Radar Status: **ONLINE: ONLY STATIC IMAGE AVAILABLE**
### Recommended to view products on Firefox

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
# Static Image

![radar_image](http://143.160.8.22/latest.gif)
---
# Detailed storm characteristics

Detailed storm characteristics is availible by clicking on the red polygon, or the black storm track. It is usefull to examine the static image below to see where interference is wrongly identified, and tracked, as a storm by the algorithm.  Refresh your browser if the map box is missing.

<iframe style='height: 500pt; width: 100%;' frameborder="0" scrolling="no" id="iframe" src="http://143.160.8.22/shpmap.html"></iframe>

---
# Maximum dBZ

Click on "layer" to open radar overlay or refresh your browser if the map box is missing

<iframe style='height: 500pt; width: 100%;' frameborder="0" scrolling="no" id="iframe" src="http://143.160.8.22/leaflet.html"></iframe>

<p align="center">
<img src="/assets/images/radar/radardbz.png" alt="viridis" align="middle"> 
</p> 

# Disclaimer
The NWU-Lekwena Radar and The NWU-WRF is a test bed for students to learn and
develop creative solutions related to weather forecasting and now-casting. This
means that the radar and model can be switched off for maintenance or it could
be broken on purpose in the name of learning. The radar and model should not be
used as a tool to make any severe weather alerts as the South-African Weather
Service is the only credible institution to do this. The products created here
should only be viewed as a tool for the development of young scientists and
something interesting to look at.
