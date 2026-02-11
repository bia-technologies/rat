#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
src_html="$root_dir/index.html"
dist_html="$root_dir/dist/index.html"
css_file="$root_dir/style.css"
js_file="$root_dir/app.js"

require_file() {
  local path="$1"
  if [[ ! -f "$path" ]]; then
    printf 'ERROR: missing file %s\n' "$path" >&2
    exit 1
  fi
}

require_file "$src_html"
require_file "$css_file"
require_file "$js_file"

if ! grep -q '<link rel="stylesheet" href="style\.css" />' "$src_html"; then
  printf 'ERROR: <link rel="stylesheet" href="style.css" /> not found in %s\n' "$src_html" >&2
  exit 1
fi

if ! grep -q '<script src="app\.js"></script>' "$src_html"; then
  printf 'ERROR: <script src="app.js"></script> not found in %s\n' "$src_html" >&2
  exit 1
fi

mkdir -p "$root_dir/dist"

awk -v CSS_FILE="$css_file" -v JS_FILE="$js_file" '
  BEGIN {
    while ((getline line < CSS_FILE) > 0) {
      css = css line "\n";
    }
    close(CSS_FILE);
    while ((getline line < JS_FILE) > 0) {
      js = js line "\n";
    }
    close(JS_FILE);
  }
  /<link rel="stylesheet" href="style\.css" \/>/ {
    print "<style>";
    print css;
    print "</style>";
    next;
  }
  /<script src="app\.js"><\/script>/ {
    print "<script>";
    print js;
    print "</script>";
    next;
  }
  { print }
' "$src_html" > "$dist_html"

printf 'Built %s\n' "$dist_html"
