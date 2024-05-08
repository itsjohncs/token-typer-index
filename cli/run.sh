#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(
    cd "$(dirname "${BASH_SOURCE[0]}")"
    pwd -P
)"

set -x
npx tsx "$SCRIPT_DIR/main.ts" "$@"
