#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(
    cd "$(dirname "${BASH_SOURCE[0]}")"
    pwd -P
)"

set -x
OUT_DIR="$SCRIPT_DIR/build/token-typer-foundry-search-module"
if [[ -e $OUT_DIR ]]; then
    rm -r "$OUT_DIR"
fi
mkdir -p "$OUT_DIR" "$OUT_DIR/scripts"
cp "$SCRIPT_DIR/module.json" "$OUT_DIR/module.json"
cp "$SCRIPT_DIR/build/rollup/bundle.js" "$OUT_DIR/scripts/bundle.js"
