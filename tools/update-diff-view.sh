#!/usr/bin/env bash
set -euo pipefail

OWNER="alkoleft"
REPO="diff-view"
ASSET="index-standalone.html"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="${SCRIPT_DIR}/../exts/rat/src/DataProcessors/РатИщейка/Templates/РатСравнениеСервий/Template.txt"

api="https://api.github.com/repos/${OWNER}/${REPO}/releases/latest"
echo "Fetching latest release metadata: $api"
metadata="$(curl -fsSL "$api")" || {
  echo "Failed to load release metadata from GitHub API" >&2
  exit 1
}
url="$(
  printf '%s\n' "$metadata" \
    | grep -Eo '"browser_download_url"[[:space:]]*:[[:space:]]*"[^"]*"' \
    | grep "$ASSET" \
    | head -n 1 \
    | cut -d '"' -f 4 \
    || true
)"

if [[ -z "$url" ]]; then
  echo "Asset not found in latest release: $ASSET" >&2
  exit 1
fi

mkdir -p "$(dirname "$OUT")"
curl -fL "$url" -o "$OUT"
echo "Downloaded to $OUT"
