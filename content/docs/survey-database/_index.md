---
title: Survey database setup
type: docs
sidebar:
  open: false
weight: 99
---

Survey answers can be stored in a **Supabase** (PostgreSQL) database. The site still works without it (browser `localStorage` only).

## Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the SQL in `supabase/schema.sql` in this repository.
3. Copy **Project URL** and the **Publishable** key from **Settings → API** (safe for browsers with RLS).
4. Local dev:

   ```bash
   cp hugo.local.yaml.example hugo.local.yaml
   # Edit hugo.local.yaml: URL + Publishable key (paste into anonKey)
   hugo server --disableFastRender -p 1313
   ```

5. Production (GitHub Actions): add repository secrets:
   - `SUPABASE_URL` — project URL
   - `SUPABASE_ANON_KEY` — your **Publishable** key (not the Secret key)

## Viewing responses

Supabase **Table Editor → `survey_responses`**. Main columns: `status_*`, `continent_*`, `country_text`, `job_*`, `job_other_text`, `looking_for` (JSON), `page_path`, `created_at`.

If you used an older table schema, run `supabase/migration-v2.sql` then `supabase/schema.sql`.

Anonymous users can **insert only** (Row Level Security). They cannot read other people’s rows from the browser.

## Power BI

See [Power BI & survey data](/docs/power-bi-survey/) or the repo guide `docs/power-bi-survey.md`.

## Security notes

- Never commit the **service role** key or put it in the site.
- The **Publishable** key is safe in the built site when RLS only allows `INSERT`.
- Rotate keys in Supabase if they leak.
