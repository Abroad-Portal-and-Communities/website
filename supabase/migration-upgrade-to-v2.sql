-- Upgrade an OLD survey_responses table (job + location only) to the current v2 schema.
-- Run this BEFORE views-powerbi.sql if you see "column status_id does not exist".
-- Backup/export old rows first if you need them.

-- New v2 columns
alter table public.survey_responses add column if not exists status_id text;
alter table public.survey_responses add column if not exists status_label text;
alter table public.survey_responses add column if not exists status_detail_text text;
alter table public.survey_responses add column if not exists continent_id text;
alter table public.survey_responses add column if not exists continent_label text;
alter table public.survey_responses add column if not exists country_text text;
alter table public.survey_responses add column if not exists job_other_text text;
alter table public.survey_responses add column if not exists looking_for jsonb default '[]'::jsonb;

-- Map old location_* columns into continent_* (if they still exist)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'survey_responses' and column_name = 'location_id'
  ) then
    update public.survey_responses
    set
      continent_id = coalesce(continent_id, location_id),
      continent_label = coalesce(continent_label, location_label)
    where continent_id is null and location_id is not null;
  end if;
end $$;

-- Defaults for rows missing new required fields
update public.survey_responses
set
  status_id = coalesce(status_id, 'unknown'),
  status_label = coalesce(status_label, 'Unknown'),
  status_detail_text = coalesce(status_detail_text, ''),
  continent_id = coalesce(continent_id, 'unknown'),
  continent_label = coalesce(continent_label, 'Unknown'),
  country_text = coalesce(country_text, ''),
  looking_for = coalesce(looking_for, '[]'::jsonb)
where
  status_id is null
  or status_label is null
  or status_detail_text is null
  or continent_id is null
  or continent_label is null
  or country_text is null
  or looking_for is null;

-- Remove obsolete v1 columns
alter table public.survey_responses drop column if exists location_id;
alter table public.survey_responses drop column if exists location_label;

-- Optional: enforce NOT NULL on new installs (skip if you still have incomplete rows)
-- alter table public.survey_responses alter column status_id set not null;
-- alter table public.survey_responses alter column status_label set not null;
-- alter table public.survey_responses alter column status_detail_text set not null;
-- alter table public.survey_responses alter column continent_id set not null;
-- alter table public.survey_responses alter column continent_label set not null;
-- alter table public.survey_responses alter column country_text set not null;
-- alter table public.survey_responses alter column looking_for set not null;
