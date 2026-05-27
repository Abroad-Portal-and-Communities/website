# Survey database (Supabase)

Survey answers can be stored in a **Supabase** (PostgreSQL) database. The site still works without it (browser `localStorage` only).

## Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run [`supabase/schema.sql`](../supabase/schema.sql).
3. Copy **Project URL** and the **Publishable** key from **Settings → API** (labeled as safe for browsers with RLS).
4. Local dev:
   ```bash
   cp config/development/hugo.yaml.example config/development/hugo.yaml
   # Edit config/development/hugo.yaml with Project URL + Publishable key
   hugo server --disableFastRender -p 1313
   ```
   View page source and confirm `__APC_SURVEY_CONFIG` contains your URL (not empty).
5. Production (GitHub Actions): add repository secrets:
   - `SUPABASE_URL` — project URL
   - `SUPABASE_ANON_KEY` — your **Publishable** key (do not use the Secret key)

## Viewing responses

Supabase **Table Editor → `survey_responses`**. Main columns: `status_*`, `continent_*`, `country_text`, `job_*`, `job_other_text`, `looking_for` (JSON), `page_path`, `created_at`.

## Power BI

Connect Power BI to Supabase PostgreSQL and query `survey_responses` (or the `survey_responses_reporting` view). See [power-bi-survey.md](power-bi-survey.md).

If you used an older table schema, run `supabase/migration-v2.sql` then `supabase/schema.sql`.

Anonymous users can **insert only** (Row Level Security). They cannot read other people’s rows from the browser.

## Troubleshooting saves

| Error | Fix |
|--------|-----|
| **Load failed** | Browser never reached Supabase (not RLS). Use **Project URL** `https://YOUR_REF.supabase.co` from **Settings → API**. Restart `hugo server` after editing `config/development/hugo.yaml`. Disable ad blockers. |
| **Invalid Project URL** | Must match `https://letters.supabase.co` only. |
| **400 / column …** | Run `supabase/migration-upgrade-to-v2.sql`. |
| **401 / 403** | Wrong Publishable key or missing RLS — re-run `schema.sql`. |
| **Database not configured** | Local: create `config/development/hugo.yaml` and restart `hugo server`. Production: add GitHub secrets and redeploy. |
| Empty table, no error | View source → `__APC_SURVEY_CONFIG` must show your Supabase URL. |

## Security notes

- Never commit the **service role** key or put it in the site.
- The **Publishable** key is safe in the built site when RLS only allows `INSERT`.
- Rotate keys in Supabase if they leak.
