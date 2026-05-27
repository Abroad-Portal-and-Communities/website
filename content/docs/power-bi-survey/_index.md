---
title: Power BI & survey data
type: docs
sidebar:
  open: false
weight: 100
---

Survey responses are stored in Supabase. You can build Power BI reports by connecting to the project’s **PostgreSQL** database.

## Quick steps

1. Supabase → **Settings → Database** → note host, database `postgres`, user, password (SSL required).
2. Optional: run `supabase/views-powerbi.sql` in the SQL Editor.
3. Power BI Desktop → **Get data → PostgreSQL** → connect → select `survey_responses` or `survey_responses_reporting`.
4. Publish to Power BI Service and set **scheduled refresh** if needed.

Use a **read-only** database user for BI—not the website Publishable key.

Full guide (connection string, `looking_for` JSON, security): see [power-bi-survey.md](https://github.com/Abroad-Portal-and-Communities/website/blob/main/docs/power-bi-survey.md) in the repository.
