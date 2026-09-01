# lekwenaradar.co.za

Public site for the **NWU Lekwena Radar** and the **NWU-WRF** operational forecast,
run by the Climatology Research Group at North-West University, Potchefstroom.

Live at <https://www.lekwenaradar.co.za>. Built with Jekyll and published by GitHub Pages
from the `master` branch.

## Pages

| Path             | Source          | What it is |
|------------------|-----------------|------------|
| `/`              | `index.md`      | Landing page: live radar image, clocks, product index |
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
- `_data/wrf.yml` — domains, physics, dashboards, gridded fields, the synoptic
  overview, the SAWS warning mirror, and the GFS cycle each run initialises
  from (`cycle:`)
- `_data/soundings.yml` — sounding stations by domain, plus the clickable location map
- `_data/satellite.yml` — EUMETSAT products, layer stacks, cadence and regions

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

### Dependabot alerts

The same version gap means `Gemfile.lock` never runs in production &mdash; Pages builds
with its own gems, and there is no Actions workflow. So a Dependabot alert here is about
a developer's local `jekyll serve`, not about the published site, and the exposure is a
static-site generator processing this repository's own content.

Keep it patched anyway; it is cheap. To bump only the flagged gems without churning the
rest of the tree:

```bash
bundle lock --update=<gem> --conservative
```

Check what is actually outstanding against the locked versions with the GitHub advisory
API, which takes a `name@version` and returns only advisories that version is subject to:

```bash
curl -s "https://api.github.com/advisories?ecosystem=rubygems&affects=rexml@3.4.4"
```

## Contact

Product requests and collaboration: Dr Henno Havenga, <henno.havenga@nwu.ac.za>.
