#!/bin/bash
# Smoke test: the two Internet Archive endpoints Séance depends on.
set -e
echo "== availability API =="
curl -s -m 20 "https://archive.org/wayback/available?url=geocities.com" | head -c 300
echo; echo "== CDX API (one capture per year) =="
curl -s -m 20 "https://web.archive.org/cdx/search/cdx?url=geocities.com&output=json&fl=timestamp&collapse=timestamp:4&limit=5" | head -c 300
echo; echo "OK — Archive APIs reachable."
