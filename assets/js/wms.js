/* ---------------------------------------------------------------------------
 * EUMETSAT WMS helpers, shared by the satellite viewer and the home page frame
 *
 * The rules they encode were learned the hard way against view.eumetsat.int;
 * the header of satellite.js explains them. In short: every request pins an
 * explicit TIME slot (rounded down to the instrument's repeat cycle and
 * stepped back by its ingest lag), and every layer is its own request.
 * ------------------------------------------------------------------------- */
(function () {
  'use strict';

  var MINUTE = 60 * 1000;

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  /* Newest slot certainly in the archive for a product with this repeat
   * cycle and ingest lag, both in minutes. */
  function latestSlot(cadence, lag) {
    var step = cadence * MINUTE;
    return new Date(Math.floor((Date.now() - lag * MINUTE) / step) * step);
  }

  /* Round a slot onto another cadence grid - an overlay's is usually finer. */
  function alignTo(when, cadence) {
    var step = cadence * MINUTE;
    return new Date(Math.floor(when.getTime() / step) * step);
  }

  function isoZ(d) {
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) +
      'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':00Z';
  }

  /* SAST is UTC+2 with no daylight saving, so a flat offset is exact. */
  function sast(d) {
    var t = new Date(d.getTime() + 2 * 60 * MINUTE);
    return pad(t.getUTCHours()) + ':' + pad(t.getUTCMinutes());
  }

  function buildUrl(wms, layer, view, when, width, opaque) {
    var w = width || view.width;
    var h = Math.round(w * (view.height / view.width));

    var params = [
      'service=WMS',
      'version=1.3.0',
      'request=GetMap',
      'styles=',
      'format=' + (opaque ? 'image/jpeg' : 'image/png'),
      'transparent=' + (opaque ? 'false' : 'true'),
      // WMS 1.3.0 renamed SRS to CRS, but this GeoServer still addresses the
      // AUTO projections the old way.
      (view.crs.indexOf('AUTO') === 0 ? 'srs=' : 'crs=') + encodeURIComponent(view.crs),
      'bbox=' + encodeURIComponent(view.bbox),
      'width=' + w,
      'height=' + h,
      'layers=' + encodeURIComponent(layer)
    ];
    if (opaque) { params.push('bgcolor=0x000000'); }
    if (when) { params.push('time=' + encodeURIComponent(isoZ(when))); }
    return wms + '?' + params.join('&');
  }

  window.LekwenaWMS = {
    MINUTE: MINUTE,
    latestSlot: latestSlot,
    alignTo: alignTo,
    isoZ: isoZ,
    sast: sast,
    buildUrl: buildUrl
  };
})();
