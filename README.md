# lekwenaradar.co.za

Public site for the **NWU Lekwena Radar** and the **NWU-WRF** operational forecast,
run by the Climatology Research Group at North-West University, Potchefstroom.

Live at <https://www.lekwenaradar.co.za>. Built with Jekyll and published by GitHub Pages
from the `master` branch.

## Pages

| Path             | Source          | What it is |
|------------------|-----------------|------------|
| `/`              | `index.md`      | Landing page: live radar image, clocks, product index |
| `/warnings.html` | `warnings.md`   | Official SAWS severe-weather warnings, mirrored from the CAP feed |
| `/radar.html`    | `radar.md`      | Reflectivity image, interactive dBZ map, tracked storm cells |
| `/stations.html` | `stations.md`   | Live automatic weather station readings and year-to-date records |
| `/wrf.html`      | `wrf.md`        | WRF impact dashboards, gridded fields, model configuration |
| `/wrfskewt.html` | `wrfskewt.md`   | Forecast Skew-T soundings for 48 locations |
| `/satellite.html`| `satellite.md`  | EUMETSAT imagery viewer |
| `/about.html`    | `about.md`      | How to read the radar, project background, press |
| `/404.html`      | `404.md`        | Not-found page |

## Changing where the live data comes from

Radar images, WRF products and maps all live on the on-campus server. **Its address is
written in exactly one place**, `data_host` in `_config.yml`:

```yaml
data_host: "http://fpt-unx.puk.ac.za"
```

Every page builds its links and embeds from that value through
`_includes/live-embed.html` and `_includes/data-link.html`, so the server address never
appears in page source. To repoint the whole site, change that one line.

To publish a friendlier name, add a DNS A record for something like
`wrf.lekwenaradar.co.za` pointing at the server and set `data_host` to match.

### The HTTPS caveat

The data server currently answers on **http only**. This site answers on both http and
https. A browser on `https://www.lekwenaradar.co.za` blocks any `http://` image or
iframe on the page as mixed content, so the radar image and the map frames would come up
blank.

`assets/js/site.js` handles that: when the page is https and `data_host` is http, each
embed is replaced with a card that explains the problem and links out to the product in
its own tab.

The real fix is a TLS certificate on the data server. Once it has one:

1. change `data_host` to `https://...`
2. set `data_host_secure: true` in `_config.yml`
3. turn on **Enforce HTTPS** in the repository's GitHub Pages settings

## Content that lives in `_data`

Product lists are data, not markup, so adding a field or a sounding station does not mean
editing HTML:

- `_data/stations.yml` — the weather station network, its charts and variables
- `_data/wrf.yml` — domains, physics, dashboards, gridded fields, and the GFS
  cycle each run initialises from (`cycle:`)
- `_data/soundings.yml` — sounding stations by domain, plus the clickable location map
- `_data/satellite.yml` — EUMETSAT products, layer stacks, cadence and regions
- `_data/saws_warnings.yml` — **generated**, never edit by hand; see below

Adding a WRF field, for example, is one entry in `_data/wrf.yml`; the page renders the
9 km and 3 km links itself (the 3 km page name is the 9 km one with an `nwgp_` prefix).
Likewise a new weather station is one entry in `_data/stations.yml`, provided the server
publishes its charts under the usual `<station>_<variable>.png` naming.

The `blurb` fields in `_data/stations.yml` are deliberately minimal — only what the
station report itself states. Add siting details (coordinates, elevation, instruments,
commissioning date) there as you have them.

## The WRF cycle and model status

`cycle:` in `_data/wrf.yml` is the GFS cycle each daily run is initialised from. It feeds
the home-page badge, the WRF stat tile and the configuration table, so changing the
operational cycle is one line.

The model server publishes the authoritative values at `{data_host}/wrf/status.json`:

```json
{"cycle":"06z","init":"2026-08-23T06:00:00Z","forecast_hours":72,
 "generated":"...","radar_last_scan":"2026-03-10T02:42:01Z"}
```

**The site does not read it, by choice.** It could not do so from the browser even if it
wanted to: the endpoint is plain http with no CORS headers, and a `fetch()` from the https
site is blocked as *active* mixed content before CORS is consulted. Fetching it in CI at
build time would work today, but was considered and deliberately not adopted.

So `cycle:` and `radar.status` are both hand-maintained. When either changes, check
`status.json` for the real value and edit to match.

Two things would let the site show all of this live, in this order:

1. **TLS on the data server.** A `fetch()` to plain http from the https site is blocked
   outright, so nothing else can work until this lands. Needs root:
   `certbot --apache -d fpt-unx.puk.ac.za`.
2. **`Access-Control-Allow-Origin: *`** on the data server. Also needs root — `mod_headers`
   is not loaded (`a2enmod headers`) and `/var/www` is `AllowOverride None`, so the header
   has to go in the vhost, not a `.htaccess`.

With both in place, `radar.status` can be replaced by a live read of `radar_last_scan` and
`cycle` by a live read of `cycle`, and neither needs a human again.

## SAWS severe-weather warnings

`/warnings.html` mirrors the official South African Weather Service alert feed. SAWS is the
only body mandated to issue weather warnings in South Africa; nothing else on this site is
a warning, and the page says so at the top.

### Why it is a build step and not a fetch

The obvious implementation — fetch the feed from the browser — does not work.
`https://caps.weathersa.co.za/Home/RssFeed` sends no `Access-Control-Allow-Origin` header,
so the same-origin policy blocks a `fetch()` from `lekwenaradar.co.za` outright. Checked
against a live request; the response carries no CORS headers at all.

GitHub Pages builds this branch with its own Jekyll, so there is no build hook of ours to
fetch it in either. What is left is a scheduled job that fetches the feed, commits the
result, and lets the resulting push trigger the normal Pages rebuild:

| File | Role |
|------|------|
| `.github/workflows/saws-warnings.yml` | Runs every 30 minutes and on demand |
| `.github/scripts/fetch_saws_warnings.py` | Fetches and parses; stdlib only, nothing to install |
| `_data/saws_warnings.yml` | The generated result. **Never edit by hand — the next run overwrites it.** |
| `_includes/warnings-list.html` | The warning cards |
| `_includes/warning-banner.html` | Landing-page banner; renders nothing when nothing is in force |
| `assets/js/warnings.js` | Re-checks expiry against the reader's clock |

### What the script does

The RSS feed is a rolling archive going back more than a year and carries only a hazard
name and an impact paragraph. The real detail — severity, warning level, onset, expiry and
the affected municipalities — is in the per-item CAP 1.2 document, so recent items are
followed through to their CAP file. It keeps every warning still in force plus the twelve
most recently lapsed, because South Africa goes quiet for weeks at a time and a page that
is blank more often than not reads as broken.

Two details worth knowing before changing it:

- **It does not commit on every run.** The `generated:` stamp changes every time, so
  committing unconditionally would mean a rebuild every half hour forever. The script
  rewrites the file only when the warnings themselves changed, or when the existing stamp
  is more than `STALE_STAMP_HOURS` (6) old.
- **A SAWS outage leaves the data alone** and exits non-zero, so the run shows up as failed
  and the page keeps showing its last good state with an honest "checked at" time.

### Freshness

The page is therefore up to half an hour behind the SAWS feed, and GitHub's scheduled runs
can be delayed further under load. Two things keep that honest rather than dangerous: the
page always shows when it was last checked, and `assets/js/warnings.js` re-checks each
card's CAP expiry against the reader's own clock every minute, so a warning that lapsed
since the last build is re-labelled and the landing-page banner hides itself. With
JavaScript off the page still works — it just shows the state as of the last build.

## Satellite imagery

`assets/js/satellite.js` builds WMS `GetMap` requests against
`view.eumetsat.int/geoserver/wms`. Two quirks of that server shape the code:

- **It renders only the first layer of a multi-layer request.** Ask for
  `satellite,lightning,coastline,borders` and you get the satellite image back on its
  own — no error, no warning, and the request looks perfectly valid. So every layer is
  fetched separately and the browser stacks them. That is why a product in
  `_data/satellite.yml` has one `base` and at most one `overlay` rather than a
  comma-separated list. If you ever add a layer, check it actually appears.
- **An unpinned request is stitched from whatever granules are present**, which shows up
  as visible seams across the disc. So each request names an explicit `time` slot,
  rounded down to the instrument's repeat cycle and stepped back by that product's `lag`
  so the archive has certainly finished ingesting it.

The boundary layers (coastline, national borders, provinces) are vector and carry no
time dimension, so they are fetched once per region and reused across every frame.

## Local development

```bash
bundle install
bundle exec jekyll serve
```

Then open <http://localhost:4000>.

### Mind the version gap

There is no Actions workflow in this repository, so GitHub Pages builds it with the
classic pipeline: **Jekyll 3.10 and Ruby Sass 3.7**, not the Jekyll 4 pinned in the
`Gemfile`. Ruby Sass is the older, stricter compiler, and the difference is not
cosmetic &mdash; a stylesheet that fails to compile does not fall back to something
plainer, it produces no CSS at all and the site deploys unstyled.

Two things in particular are fine in Jekyll 4 and fatal on GitHub Pages:

- **CSS math functions.** Ruby Sass evaluates arithmetic inside any function's
  arguments, so `clamp(1.9rem, 1.3rem + 2.2vw, 2.6rem)` dies with *Incompatible units:
  'vw' and 'rem'*. Use the `fluid()` helper in `_sass/_tokens.scss`, which passes the
  preferred term through as a string. `min()` and `max()` are Sass built-ins that only
  accept plain numbers, so avoid them in CSS values entirely.
- **A bare `/` in a shorthand** (`background: … 50% / 22px 22px`) is read as division.
  Use the longhand properties instead.

If you change the stylesheet, compile it once with Ruby Sass before pushing:

```bash
gem install sass -v 3.7.4
tail -n +4 assets/css/style.scss > /tmp/entry.scss
sass --scss --load-path _sass /tmp/entry.scss /tmp/out.css
```

Switching the `Gemfile` to the `github-pages` gem would remove this trap by making
local builds match production.

## Contact

Product requests and collaboration: Dr Henno Havenga, <henno.havenga@nwu.ac.za>.
