---
layout: page
title: NWU-WRF SkewT's
tagline: North-West University Operational WRF
permalink: /wrfskewt.html
---

### Soundings by Country
Click on the city buttons below to view the corresponding Skew-T diagram.

<div id="iframeContainer" style="margin-top: 20px; border: 1px solid #ccc; padding: 10px; border-radius: 5px; display: none;">
    <iframe id="skewtIframe" src="" style="width: 80%; height: 700px; border: none;"></iframe>
</div>

<script>
    /**
     * Updates the iframe content and makes the container visible.
     * @param {string} url - The URL to load in the iframe.
     */
    function updateIframe(url) {
        var iframeContainer = document.getElementById('iframeContainer');
        var iframe = document.getElementById('skewtIframe');

        if (url) {
            iframe.src = url; // Update the iframe's source
            iframeContainer.style.display = 'block'; // Show the iframe container
        }
    }
</script>

<style>
    button {
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 14px;
        cursor: pointer;
        border-radius: 5px;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: #45a049;
    }
</style>


#### South Africa
<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_alexandria.html')">Alexandria</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_bethlehem.html')">Bethlehem</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_bloemfontein.html')">Bloemfontein</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_cpt.html')">Cape Town</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_deaar.html')">De-Aar</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_durban.html')">Durban</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_irene.html')">Irene</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_upington.html')">Upington</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_mafikeng.html')">Mafikeng</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_polokwane.html')">Polokwane</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_gqeberha.html')">Gqeberha</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_springbok.html')">Springbok</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_sutherland.html')">Sutherland</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_mata.html')">Mata-Mata</button>
</div>

---

#### Namibia
<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_windhoek.html')">Windhoek</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_rundu.html')">Rundu</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_luderitz.html')">Luderitz</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_gobabeb.html')">Gobabeb</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_sesfontein.html')">Sesfontein</button>
</div>

---

#### Botswana
<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_gaberone.html')">Gaberone</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_ghanzi.html')">Ghanzi</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_francistown.html')">Francistown</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_maun.html')">Maun</button>
</div>

---

#### Zimbabwe
<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_harare.html')">Harare</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_bulawayo.html')">Bulawayo</button>
</div>

---

#### Mozambique
<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_maputu.html')">Maputu</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_beira.html')">Beira</button>
</div>

---

#### Zambia
<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_lusaka.html')">Lusaka</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_livingstone.html')">Livingstone</button>
</div>

---

#### Lesotho, Swaziland, and Madagascar
<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_maseru.html')">Maseru</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_mbabane.html')">Mbabane</button>
    <button onclick="updateIframe('http://143.160.8.22/wrf/wrfskwt_anatnanarivo.html')">Antananarivo</button>
</div>

---

### Map of locations 

<img src="/assets/images/sounding_locations_2.png" alt="" usemap="#map" />
<map name="map">
    <area shape="rect" coords="397, 278, 450, 292" href="http://143.160.8.22/wrf/wrfskwt_mafikeng.html" alt="mafikeng" title="Mafikeng" />
    <area shape="rect" coords="410, 247, 468, 260" href="http://143.160.8.22/wrf/wrfskwt_gaberone.html" alt="gaberone" title="Gaberone" />
    <area shape="rect" coords="496, 225, 556, 241" href="http://143.160.8.22/wrf/wrfskwt_polokwane.html" alt="polokwane" title="Polokwane" />
    <area shape="rect" coords="624, 122, 661, 139" href="http://143.160.8.22/wrf/wrfskwt_beira.html" alt="beira" title="Beira" />
    <area shape="rect" coords="469, 13, 514, 28"   href="http://143.160.8.22/wrf/wrfskwt_lusaka.html" alt="lusaka" title="Lusaka" />
    <area shape="rect" coords="532, 72, 576, 88"   href="http://143.160.8.22/wrf/wrfskwt_harare.html" alt="harare" title="Harare" />
    <area shape="rect" coords="476, 130, 532, 145" href="http://143.160.8.22/wrf/wrfskwt_bulawayo.html" alt="bulawayo" title="Bulawayo" />
    <area shape="rect" coords="577, 280, 621, 296" href="http://143.160.8.22/wrf/wrfskwt_maputu.html" alt="maputu" title="Maputu" />
    <area shape="rect" coords="537, 290, 568, 307" href="http://143.160.8.22/wrf/wrfskwt_mbabane.html" alt="mbabane" title="Mbabane" />
    <area shape="rect" coords="459, 277, 514, 303" href="http://143.160.8.22/wrf/wrfskwt_irene.html" alt="irene" title="Irene" />
    <area shape="rect" coords="466, 342, 532, 358" href="http://143.160.8.22/wrf/wrfskwt_bethlehem.html" alt="bethlehem" title="Bethlehem" />
    <area shape="rect" coords="459, 373, 490, 388" href="http://143.160.8.22/wrf/wrfskwt_maseru.html" alt="maseru" title="Maseru" />
    <area shape="rect" coords="419, 365, 445, 381" href="http://143.160.8.22/wrf/wrfskwt_bloemfontein.html" alt="bloemfontein" title="Bloemfontein" />
    <area shape="rect" coords="297, 347, 352, 361" href="http://143.160.8.22/wrf/wrfskwt_upington.html" alt="upington" title="Upington" />
    <area shape="rect" coords="536, 379, 581, 394" href="http://143.160.8.22/wrf/wrfskwt_durban.html" alt="durban" title="Durban" />
    <area shape="rect" coords="364, 409, 411, 426" href="http://143.160.8.22/wrf/wrfskwt_deaar.html" alt="deaar" title="De-Aar" />
    <area shape="rect" coords="404, 502, 480, 518" href="http://143.160.8.22/wrf/wrfskwt_gqeberha.html" alt="gqeberha" title="Gqeberha" />
    <area shape="rect" coords="235, 502, 298, 518" href="http://143.160.8.22/wrf/wrfskwt_cpt.html" alt="capetown" title="Cape-Town" />
    <area shape="rect" coords="217, 382, 276, 396" href="http://143.160.8.22/wrf/wrfskwt_springbok.html" alt="springbok" title="Springbok" />
    <area shape="rect" coords="184, 351, 245, 367" href="http://143.160.8.22/wrf/wrfskwt_alexander.html" alt="alexander" title="Alexander" />
    <area shape="rect" coords="306, 170, 352, 186" href="http://143.160.8.22/wrf/wrfskwt_ghanzi.html" alt="ghanzi" title="Ghanzi" />
    <area shape="rect" coords="151, 298, 200, 315" href="http://143.160.8.22/wrf/wrfskwt_luderitz.html" alt="luderitz" title="Luderitz" />
    <area shape="rect" coords="148, 218, 199, 235" href="http://143.160.8.22/wrf/wrfskwt_gobabeb.html" alt="gobabeb" title="Gobabeb" />
    <area shape="rect" coords="195, 192, 257, 207" href="http://143.160.8.22/wrf/wrfskwt_windhoek.html" alt="windhoek" title="Windhoek" />
    <area shape="rect" coords="258, 72, 309, 89"   href="http://143.160.8.22/wrf/wrfskwt_rundu.html" alt="rundu" title="Rundu" />
    <area shape="rect" coords="281, 454, 348, 475" href="http://143.160.8.22/wrf/wrfskwt_sutherland.html" alt="sutherland" title="Sutherland" />
    <area shape="rect" coords="264, 271, 331, 296" href="http://143.160.8.22/wrf/wrfskwt_mata.html" alt="matamata" title="Mata-Mata" />
    <area shape="rect" coords="444, 153, 517, 174" href="http://143.160.8.22/wrf/wrfskwt_francistown.html" alt="francistown" title="Francistown" />
    <area shape="rect" coords="347, 123, 390, 145" href="http://143.160.8.22/wrf/wrfskwt_maun.html" alt="maun" title="Maun" />
    <area shape="rect" coords="402, 68, 476, 90"   href="http://143.160.8.22/wrf/wrfskwt_livingstone.html" alt="livingstone" title="Livingstone" />
    <area shape="rect" coords="112, 100, 178, 121" href="http://143.160.8.22/wrf/wrfskwt_sesfontein.html" alt="sesfontein" title="Sesfontein" />
</map>



#### Practical considerations and limitations
+ The model is initialized using publicly available GFS data. The GFS forecasts are also viewable [here](http://www.lekwenaradar.co.za/forecast.html)
+ The model requires *spin-up* time to become numerically stable, the first hour of the forecast should be discarded
+ For observed Skew-T diagrams please visit the [University of Wyoming Upper-Air Database](http://weather.uwyo.edu/upperair/sounding.html)
+ Customized forecast products is available on request
+ Please note that SAWS is the only entity in South-Africa which can issue weather related warnings
