#!/usr/bin/env bash
# Export all survey_responses from Supabase as JSON (maintainers only).
# Requires service role key — never commit or embed in the Hugo site.
#
# Usage:
#   export SUPABASE_URL="https://YOUR_REF.supabase.co"
#   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
#   ./scripts/export-survey-responses.sh > survey-export.json
#
# Get keys: Supabase → Settings → API (use service_role, not anon/publishable).

set -euo pipefail

url="${SUPABASE_URL%/}"
key="${SUPABASE_SERVICE_ROLE_KEY:-}"

if [[ -z "$url" || -z "$key" ]]; then
  echo "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY" >&2
  exit 1
fi

curl -sS "${url}/rest/v1/survey_responses?select=*&order=created_at.desc" \
  -H "apikey: ${key}" \
  -H "Authorization: Bearer ${key}" \
  -H "Accept: application/json"
