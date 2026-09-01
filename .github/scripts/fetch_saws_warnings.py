#!/usr/bin/env python3
"""Fetch the South African Weather Service severe-weather warning feed and
write it into _data/saws_warnings.yml for Jekyll to render.

Why this exists as a build step rather than a fetch in the browser: the SAWS
feed at caps.weathersa.co.za sends no Access-Control-Allow-Origin header, so a
fetch() from https://www.lekwenaradar.co.za is blocked by the same-origin
policy. Nothing on the page can read it. Fetching here, committing the result
and letting GitHub Pages rebuild is the only route that does not depend on a
third-party CORS proxy.

The RSS feed is a rolling archive going back well over a year and carries only
a hazard name and an impact paragraph per item. The per-item CAP 1.2 document
is where the useful fields live - severity, warning level, onset, expiry and
the affected municipalities - so recent items are followed through to their CAP
document. Anything already expired is dropped.

Only stdlib is used, so the workflow needs no pip install.
"""

import html
import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from xml.etree import ElementTree

RSS_URL = "https://caps.weathersa.co.za/Home/RssFeed"
SAWS_HOME = "https://www.weathersa.co.za/"

# How far back in the rolling feed to look, and a hard ceiling on CAP fetches so
# a bad day at SAWS cannot turn this into a hundred-request job.
LOOKBACK_DAYS = 14
MAX_CAP_FETCHES = 60

# Warnings that have already lapsed are still worth showing - South Africa goes
# quiet for weeks at a time and a page that is blank more often than not reads
# as broken. Keep this many of the most recent expired ones as context.
KEEP_EXPIRED = 12

# The "generated" stamp changes on every run even when nothing else does, so
# writing it unconditionally would mean a commit and a site rebuild every half
# hour forever. Instead the file is left alone when the warnings are unchanged
# and the existing stamp is still fresh, which keeps quiet weeks out of the
# history while capping how stale the "last checked" line on the page can get.
STALE_STAMP_HOURS = 6

TIMEOUT = 30
UA = "lekwenaradar.co.za warning mirror (+https://www.lekwenaradar.co.za/warnings.html)"

CAP_NS = {"cap": "urn:oasis:names:tc:emergency:cap:1.2"}

# The CAP files are named <REGION>_CAP_<Event>_<date>_<time>.xml. The region
# code is a province, or one of the marine/national offices.
REGIONS = {
    "EC": "Eastern Cape",
    "FS": "Free State",
    "GP": "Gauteng",
    "KZN": "KwaZulu-Natal",
    "LP": "Limpopo",
    "MP": "Mpumalanga",
    "NC": "Northern Cape",
    "NW": "North West",
    "WC": "Western Cape",
    "SA": "National",
    "NAT": "National",
    "MAR": "Marine",
    "MARINE": "Marine",
}


def fetch(url, *, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        raw = r.read()
    return raw if binary else raw.decode("utf-8", "replace")


def text(node, path):
    found = node.find(path, CAP_NS)
    if found is None or found.text is None:
        return ""
    return " ".join(found.text.split()) if "\n" not in found.text else found.text.strip()


def parse_iso(value):
    if not value:
        return None
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None


def level_from(alert_type, severity):
    """SAWS publishes 'Warning Level N' (1-10) or 'Advisory' in the CAP
    alertType parameter. Levels 1-4 are yellow, 5-8 orange, 9-10 red."""
    m = re.search(r"(\d+)", alert_type or "")
    num = int(m.group(1)) if m else 0
    if not alert_type:
        alert_type = severity or "Warning"
    if "advisor" in alert_type.lower():
        colour = "advisory"
    elif num >= 9:
        colour = "red"
    elif num >= 5:
        colour = "orange"
    elif num >= 1:
        colour = "yellow"
    else:
        colour = "advisory"
    return num, colour, alert_type


def yaml_scalar(value):
    return json.dumps("" if value is None else str(value), ensure_ascii=False)


def yaml_block(value, indent):
    """Emit a multi-line string as a literal block, which survives newlines and
    needs no escaping of anything except a stray tab."""
    lines = [ln.rstrip() for ln in str(value).replace("\t", "  ").splitlines()]
    while lines and not lines[0]:
        lines.pop(0)
    while lines and not lines[-1]:
        lines.pop()
    if not lines:
        return " " + yaml_scalar("")
    pad = " " * indent
    out = ["|-"]
    out += [(pad + ln).rstrip() for ln in lines]
    return "\n".join(out[:1]) + "\n" + "\n".join(out[1:])


def collect():
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(days=LOOKBACK_DAYS)

    rss = fetch(RSS_URL)
    root = ElementTree.fromstring(rss)

    candidates = []
    for item in root.iterfind("./channel/item"):
        link = (item.findtext("link") or item.findtext("guid") or "").strip()
        if not link.lower().endswith(".xml"):
            continue
        published = None
        raw_date = item.findtext("pubDate")
        if raw_date:
            try:
                published = parsedate_to_datetime(raw_date.strip())
            except (TypeError, ValueError):
                published = None
        if published is None or published.tzinfo is None:
            continue
        if published < cutoff:
            continue
        # The feed links over http; the same file serves fine over https and
        # this page is https, so ask for the secure one.
        candidates.append((published, re.sub(r"^http://", "https://", link)))

    candidates.sort(key=lambda pair: pair[0], reverse=True)
    candidates = candidates[:MAX_CAP_FETCHES]

    warnings = []
    seen = set()
    for published, link in candidates:
        slug = link.rsplit("/", 1)[-1][:-4]
        if slug in seen:
            continue
        seen.add(slug)
        try:
            cap = ElementTree.fromstring(fetch(link))
        except (urllib.error.URLError, ElementTree.ParseError, OSError) as exc:
            print(f"  skip {slug}: {exc}", file=sys.stderr)
            continue

        info = cap.find("cap:info", CAP_NS)
        if info is None:
            continue
        if (cap.findtext("cap:status", default="", namespaces=CAP_NS) or "").strip() not in ("Actual", ""):
            continue

        expires = parse_iso(text(info, "cap:expires"))
        if expires is None or expires.tzinfo is None:
            continue
        active = expires > now

        alert_type = ""
        for param in info.iterfind("cap:parameter", CAP_NS):
            if (param.findtext("cap:valueName", default="", namespaces=CAP_NS) or "").strip() == "alertType":
                alert_type = (param.findtext("cap:value", default="", namespaces=CAP_NS) or "").strip()
        severity = text(info, "cap:severity")
        level_num, colour, level_label = level_from(alert_type, severity)

        region_code = slug.split("_", 1)[0].upper()
        areas = []
        for area in info.iterfind("cap:area", CAP_NS):
            desc = (area.findtext("cap:areaDesc", default="", namespaces=CAP_NS) or "").strip()
            if desc:
                # SAWS prefixes municipality names with a district letter, e.g.
                # "M_Ethekwini / M3 Durban". Keep the human half.
                desc = re.sub(r"^[A-Z]{1,3}_", "", desc).strip()
                if desc not in areas:
                    areas.append(desc)

        warnings.append(
            {
                "id": slug,
                "event": text(info, "cap:event") or text(info, "cap:headline") or "Weather warning",
                "headline": text(info, "cap:headline"),
                "level": level_label,
                "level_num": level_num,
                "colour": colour,
                "severity": severity,
                "urgency": text(info, "cap:urgency"),
                "certainty": text(info, "cap:certainty"),
                "region": region_code,
                "region_name": REGIONS.get(region_code, region_code),
                "office": text(info, "cap:senderName"),
                "sent": text(cap, "cap:sent"),
                "onset": text(info, "cap:onset"),
                "expires": text(info, "cap:expires"),
                "active": active,
                "areas": areas,
                "description": html.unescape(text(info, "cap:description")),
                "instruction": html.unescape(text(info, "cap:instruction")),
                "link": link,
            }
        )

    order = {"red": 0, "orange": 1, "yellow": 2, "advisory": 3}
    # In force first, worst first; then the lapsed ones newest first as context.
    live = sorted((w for w in warnings if w["active"]),
                  key=lambda w: (order.get(w["colour"], 9), -w["level_num"], w["expires"]))
    lapsed = sorted((w for w in warnings if not w["active"]),
                    key=lambda w: w["expires"], reverse=True)[:KEEP_EXPIRED]
    return now, live + lapsed


def render(now, warnings, ok):
    out = [
        "# GENERATED FILE - do not edit by hand.",
        "#",
        "# Written by .github/scripts/fetch_saws_warnings.py, run on a schedule by",
        "# .github/workflows/saws-warnings.yml. Every push to this file rebuilds the",
        "# site, which is how the warnings page stays current.",
        "#",
        "# Source: South African Weather Service CAP feed, " + RSS_URL,
        "# SAWS is the only body mandated to issue weather warnings in South Africa;",
        "# this is a verbatim mirror of what they published, not our interpretation.",
        "",
        "source: " + yaml_scalar(RSS_URL),
        "source_page: " + yaml_scalar(SAWS_HOME),
        "generated: " + yaml_scalar(now.strftime("%Y-%m-%dT%H:%M:%SZ")),
        "fetch_ok: " + ("true" if ok else "false"),
        "count: " + str(len(warnings)),
        "active_count: " + str(sum(1 for w in warnings if w["active"])),
        "",
        "warnings:" if warnings else "warnings: []",
    ]
    for w in warnings:
        out.append("  - id: " + yaml_scalar(w["id"]))
        for key in ("event", "headline", "level", "colour", "severity", "urgency",
                    "certainty", "region", "region_name", "office", "sent",
                    "onset", "expires", "link"):
            out.append("    %s: %s" % (key, yaml_scalar(w[key])))
        out.append("    level_num: %d" % w["level_num"])
        out.append("    active: %s" % ("true" if w["active"] else "false"))
        if w["areas"]:
            out.append("    areas:")
            out += ["      - " + yaml_scalar(a) for a in w["areas"]]
        else:
            out.append("    areas: []")
        for key in ("description", "instruction"):
            out.append("    %s: %s" % (key, yaml_block(w[key], 6)))
    return "\n".join(out) + "\n"


def strip_stamp(text_body):
    return "\n".join(
        ln for ln in text_body.splitlines() if not ln.startswith("generated:")
    )


def stamp_age_hours(text_body, now):
    for line in text_body.splitlines():
        if line.startswith("generated:"):
            when = parse_iso(line.split(":", 1)[1].strip().strip('"').replace("Z", "+00:00"))
            if when is not None:
                return (now - when).total_seconds() / 3600.0
    return None


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else os.path.join("_data", "saws_warnings.yml")
    try:
        now, warnings = collect()
        ok = True
    except (urllib.error.URLError, ElementTree.ParseError, OSError) as exc:
        # A SAWS outage must not blank the page. Keep whatever is on disk and
        # leave the exit code non-zero so the workflow run is visibly amber.
        print(f"SAWS feed unavailable: {exc}", file=sys.stderr)
        return 1

    fresh = render(now, warnings, ok)
    try:
        with open(target, encoding="utf-8") as fh:
            existing = fh.read()
    except OSError:
        existing = None

    if existing is not None and strip_stamp(existing) == strip_stamp(fresh):
        age = stamp_age_hours(existing, now)
        if age is not None and age < STALE_STAMP_HOURS:
            print(f"unchanged and stamp is {age:.1f} h old - leaving {target} alone")
            return 0

    with open(target, "w", encoding="utf-8") as fh:
        fh.write(fresh)
    print(f"wrote {target}: {len(warnings)} warning(s), "
          f"{sum(1 for w in warnings if w['active'])} in force")
    return 0


if __name__ == "__main__":
    sys.exit(main())
