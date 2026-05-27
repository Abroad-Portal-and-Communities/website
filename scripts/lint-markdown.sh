#!/usr/bin/env sh
# Run the same Markdown lint as CI (requires Docker).
set -e
cd "$(dirname "$0")/.."
docker run --rm -v "$(pwd):/work" -w /work node:22-alpine \
  sh -c 'npx --yes markdownlint-cli2 "content/**/*.md" "README.md" --config .markdownlint.yaml'
