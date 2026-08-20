#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

PNPM_VERSION="10.18.1"
PNPM_BIN="$(command -v pnpm || true)"

if ! command -v mise >/dev/null 2>&1; then
  echo "error: mise is required to select Node.js 22" >&2
  exit 1
fi

if [[ -z "${PNPM_BIN}" ]]; then
  echo "error: pnpm is required" >&2
  exit 1
fi

if ! NODE_VERSION="$(MISE_CONFIG_FILE=/dev/null mise exec node@22 -- node --version)"; then
  echo "error: Node.js 22 is not installed and mise could not download it." >&2
  echo "Install Node.js 22 with mise, then retry: mise install node@22" >&2
  exit 1
fi

echo "Using Node.js: ${NODE_VERSION}"
echo "Using pnpm: ${PNPM_VERSION}"

MISE_CONFIG_FILE=/dev/null mise exec node@22 -- "${PNPM_BIN}" install --frozen-lockfile
MISE_CONFIG_FILE=/dev/null mise exec node@22 -- "${PNPM_BIN}" run "$@"
