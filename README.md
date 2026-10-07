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
| `/wrfskewt.html` | `wrfskewt.md`   | Forecast Skew-T soundings for 34 locations |
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
`_includes/live-embed.html` and `_includes/data-link.html`, so the raw IP address never
appears in the templates or the built pages, and repointing the whole site is one line.
Be clear about what that buys: rendered pages do contain the hostname, and the hostname
resolves publicly to the IP. It keeps the address tidy and in one place, not secret.

To publish a friendlier name, add a DNS A record for something like
`wrf.lekwenaradar.co.za` pointing at the server and set `data_host` to match.

### The HTTPS caveat

The data server currently answers on **http only**. This site answers on both http and
https. A browser on `https://www.lekwenaradar.co.za` blocks any `http://` image or
iframe on the page as mixed content, so the radar image and the map frames would come up
blank.

`assets/js/site.js` handles that: when the page is https and `data_host` is http, each
embed collapses to a single row with a link that opens it in its own tab, and a note above
the first of them explains why, once per page. Controls that could only act on blocked
embeds, such as the station switcher, are hidden before first paint.

Note that offering visitors an `http://` link to this site does not help: current Chrome
and Safari silently upgrade that navigation straight back to `https://`. Tested against the
live site — requesting the http URL in Chrome still lands on https, with every embed
blocked.

The real fix is a TLS certificate on the data server. Once it has one:

1. change `data_host` to `https://...` — that is the whole switch; `site.js` keys off
   the scheme, and every embed loads inline again
2. turn on **Enforce HTTPS** in the repository's GitHub Pages settings

## Content that lives in `_data`

Product lists are data, not markup, so adding a field or a sounding station does not mean
editing HTML:

- `_data/stations.yml` — the weather station network, its charts and variables, plus
  the `soil` block for the soil probe (a single profile, not a per-station product)
- `_data/wrf.yml` — domains, physics, dashboards, gridded fields, the synoptic
  overview, the SAWS warning mirror, the agri forecast, and the GFS cycles the
  model runs from (`cycles:`). Products are linked by their interactive `_map.html`
  versions; the static ones sit behind one footnote link on the WRF page
- `_data/soundings.yml` — sounding stations by domain
- `_data/satellite.yml` — EUMETSAT products, layer stacks, cadence and regions

Adding a WRF field, for example, is one entry in `_data/wrf.yml`; the page renders the
9 km and 3 km links itself (the 3 km page name is the 9 km one with an `nwgp_` prefix).
Likewise a new weather station is one entry in `_data/stations.yml`, provided the server
publishes its charts under the usual `<station>_<variable>.png` naming.

The `blurb` fields in `_data/stations.yml` are deliberately minimal — only what the
station report itself states. Add siting details (coordinates, elevation, instruments,
commissioning date) there as you have them.

## The WRF cycle and model status

`cycles:` in `_data/wrf.yml` lists the GFS cycles the model is initialised from each day
— currently `00Z` and `12Z`, twice daily. It feeds the home-page badge, the WRF stat tile and
the configuration table, so changing the schedule is one line.

The model server publishes the authoritative values at `{data_host}/wrf/status.json`:

```json
{"cycle":"06z","init":"2026-08-23T06:00:00Z","forecast_hours":72,
 "generated":"...","radar_last_scan":"2026-03-10T02:42:01Z"}
```

**The site does not read it, by choice.** It could not do so from the browser even if it
wanted to: the endpoint is plain http with no CORS headers, and a `fetch()` from the https
site is blocked as *active* mixed content before CORS is consulted. Fetching it in CI at
build time would work today, but was considered and deliberately not adopted.

So `cycles:` is hand-maintained. Note that `status.json` reports only the cycle of the
*latest* run, so it cannot describe a twice-daily schedule on its own; when the schedule
changes, edit the list. The radar status is not - see below; it no longer
depends on `radar_last_scan`, which has been `null` since early September.

Two things would let the site show all of this live, in this order:

1. **TLS on the data server.** A `fetch()` to plain http from the https site is blocked
   outright, so nothing else can work until this lands. Needs root:
   `certbot --apache -d fpt-unx.puk.ac.za`.
2. **`Access-Control-Allow-Origin: *`** on the data server. Also needs root — `mod_headers`
   is not loaded (`a2enmod headers`) and `/var/www` is `AllowOverride None`, so the header
   has to go in the vhost, not a `.htaccess`.

With both in place, the site could show the latest run's time live from `status.json`.

## Radar status

The site follows the radar on and off by itself. `.github/workflows/radar-status.yml` runs
every half hour and reads the `Last-Modified` header of the radar image on the data server
— the one reliable signal available, since the scan time is otherwise only burnt into the
GIF's pixels. It records `online` or `offline` in `_data/radar_status.yml`, and everything
that mentions the radar reads that file through `_includes/radar-state.html`: the status
badges, the offline notice (which gives the date of the last scan), the home page's hero
buttons and card order, and whether the home page shows the radar image at all.

- **Commits only when something visible changes:** the status flips, or a scan happens while
  the radar is recorded as offline (so the banner's last-scan date stays true even if the
  radar ran briefly between two checks). The day the radar comes back, the site follows
  within about half an hour.
- **Hysteresis.** Online means a scan within 30 minutes, offline means nothing for two hours,
  and in between the last state holds, so one late upload does not flap the site.
- **Unreachable is not offline.** If GitHub cannot reach the data server, gets no usable
  `Last-Modified`, or gets one dated in the future (a wrong server clock, not a scan from the
  future), the run fails visibly and the recorded state is left alone.
- **The rebuild must succeed.** A push made with the workflow token is not guaranteed to start
  a Pages build, so the workflow requests one explicitly, retries, and fails the run if it
  cannot - a recorded status the site never shows is the failure this job exists to prevent.
- **Monthly keepalive.** GitHub disables scheduled workflows in a public repository after 60
  days without a commit, and the radar can be off for longer than that. So the file is also
  refreshed at least every 30 days, which keeps the schedule alive - including while the data
  server is unreachable, so an outage cannot quietly switch the job off.
- **Manual override.** `radar.status` in `_config.yml` is normally `auto`. Set it to
  `online`, `limited` or `offline` to force a state, and `radar.note` to replace the
  automatic banner text.

The workflow needs Actions enabled with write access, and `pages: write` to request a
rebuild; both are declared in the workflow file. Run it by hand from the Actions tab
(**Radar status → Run workflow**) to check it can reach the data server from GitHub.

## Lightning map

The radar page embeds the Blitzortung.org live lightning map. Everything about it is in the
`lightning` block in `_config.yml` — the URL, the map hash (`#zoom/lat/lon`) and every query
parameter, each commented.

Three things there are deliberate and easy to undo by accident:

- **The URL points at `/en/`, not the site root.** The root is a JavaScript language
  redirector that picks the UI language from `navigator.language`, which would put a German
  or French menu inside an English page.
- **`LinksChecked: 0`.** The vendor's own example embed sets this to `1`. It is not the
  lightning layer — it is "Detector lines", which draws a line from every strike to each
  station that received it. The strike layer is `LightningChecked`.
- **The iframe is `loading="lazy"`.** Their terms ask that the websocket servers not be hit
  from high-traffic pages, so a visitor who never scrolls to the map never opens a
  connection.

Their terms also require attribution (in the panel caption) and forbid showing live data on
commercial sites. A non-commercial university page is within that.

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

No Actions workflow builds this site (the one workflow here only records the radar's
status), so GitHub Pages builds it with the
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
with its own gems, and no workflow builds the site. So a Dependabot alert here is about
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
