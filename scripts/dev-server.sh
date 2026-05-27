#!/usr/bin/env sh
set -e
cd "$(dirname "$0")/.."

if [ -f config/development/hugo.yaml ]; then
  exec hugo server -e development --disableFastRender -p 1313 "$@"
fi

if [ -f hugo.local.yaml ]; then
  exec hugo server --config config/_default/hugo.yaml,hugo.local.yaml --disableFastRender -p 1313 "$@"
fi

echo "Supabase local config missing."
echo "  cp config/development/hugo.yaml.example config/development/hugo.yaml"
echo "  # then add your Project URL and Publishable key"
exit 1
