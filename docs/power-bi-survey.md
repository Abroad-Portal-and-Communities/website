# Connect survey data to Power BI

Survey responses live in **Supabase (PostgreSQL)**. Power BI can read them with the **PostgreSQL** connector—no custom export job required.

## Prerequisites

1. Survey table exists (`supabase/schema.sql`).
2. If you see **`column "status_id" does not exist`**, run `supabase/migration-upgrade-to-v2.sql` first (or `migration-v2.sql` + `schema.sql` to start fresh).
3. Optional: run `supabase/views-powerbi.sql` for a reporting view.
3. A **database password** from Supabase (not the Publishable API key).

## 1. Get PostgreSQL connection details

In Supabase: **Project Settings → Database**

| Field | Where to find it |
|--------|------------------|
| Host | Connection string → `Host` (e.g. `db.xxxxx.supabase.co`) |
| Port | `5432` (direct) or `6543` (connection pooler) |
| Database | `postgres` |
| User | `postgres` (default) or a dedicated read-only user |
| Password | Database password you set when creating the project |

Use **SSL**: required (`sslmode=require`).

For production BI, create a **read-only** user instead of using `postgres`:

```sql
create user powerbi_reader with password 'your-strong-password';
grant usage on schema public to powerbi_reader;
grant select on public.survey_responses to powerbi_reader;
grant select on public.survey_responses_reporting to powerbi_reader;
```

## 2. Power BI Desktop

1. **Get data** → **PostgreSQL database**
2. Server: `db.xxxxx.supabase.co`
3. Database: `postgres`
4. Data connectivity mode: **Import** (simplest) or **DirectQuery** (live; needs stable connection)
5. Advanced options → add if needed: `sslmode=require`
6. Sign in with database user + password
7. Select **`survey_responses`** or **`survey_responses_reporting`**
8. **Load** → build reports

### `looking_for` (JSON)

The `looking_for` column is JSON (array of topics). In Power Query:

- Load `looking_for_json` as text, or
- Use **Transform → Parse → JSON** on `looking_for`, then expand the list

Or count topics in SQL before BI:

```sql
select *, jsonb_array_length(looking_for) as topics_count
from public.survey_responses_reporting;
```

## 3. Refresh schedule (Power BI Service)

After publishing to Power BI Service:

1. **Dataset → Settings → Scheduled refresh**
2. Enable refresh (Supabase free tier allows connections; keep frequency reasonable)
3. Store PostgreSQL credentials in the gateway if your org uses an on-premises data gateway

## Alternatives

| Method | When to use |
|--------|-------------|
| **PostgreSQL connector** | Best for dashboards and scheduled refresh |
| **CSV export** | Supabase **Table Editor → Export CSV** → Power BI **Text/CSV** (manual, quick check) |
| **REST API** | Possible with Web connector + service role; not recommended vs SQL |

## Security

- Do **not** use the site **Publishable** key in Power BI (RLS blocks reads).
- Use a **read-only** database user with `SELECT` only on survey tables/views.
- Do not commit database passwords to GitHub.

## Troubleshooting

| Issue | Fix |
|--------|-----|
| SSL error | Enable SSL / `sslmode=require` |
| Connection timeout | Try port `6543` (pooler) or allow your IP in Supabase **Database → Network** |
| Empty table | Submit test surveys on the live site with Supabase configured |
| Cannot read rows | Use DB user with `SELECT`, not the anon/Publishable API key |
