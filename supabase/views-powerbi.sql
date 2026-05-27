-- Optional view for Power BI / reporting tools (read-only user should query this).
-- Run AFTER schema.sql (or migration-upgrade-to-v2.sql if the table is old).
-- Grant SELECT to your Power BI database user.

create or replace view public.survey_responses_reporting as
select
  id,
  created_at at time zone 'utc' as created_at_utc,
  status_id,
  status_label,
  status_detail_text,
  continent_id,
  continent_label,
  country_text,
  job_id,
  job_label,
  job_other_text,
  looking_for,
  looking_for::text as looking_for_json,
  page_path
from public.survey_responses;

comment on view public.survey_responses_reporting is 'Flattened survey data for Power BI and other BI tools';
