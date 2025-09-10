#!/usr/bin/env bash
set -euo pipefail

if ! command -v npx >/dev/null 2>&1; then
  echo "npx is required (Node.js/npm)." >&2
  exit 1
fi

mkdir -p reports
ts=$(date +%Y%m%d-%H%M%S)

echo "[1/4] Smoke test"
npx artillery@^2 run smoke.yml -o reports/smoke-$ts.json
npx artillery@^2 report reports/smoke-$ts.json -o reports/smoke-$ts.html || true

echo "[2/4] Ramp test"
npx artillery@^2 run ramp.yml -o reports/ramp-$ts.json
npx artillery@^2 report reports/ramp-$ts.json -o reports/ramp-$ts.html || true

echo "[3/4] Spike test"
npx artillery@^2 run spike.yml -o reports/spike-$ts.json
npx artillery@^2 report reports/spike-$ts.json -o reports/spike-$ts.html || true

echo "[4/4] Soak test"
npx artillery@^2 run soak.yml -o reports/soak-$ts.json
npx artillery@^2 report reports/soak-$ts.json -o reports/soak-$ts.html || true

echo "Done. Reports in tests/reports/*.html"


