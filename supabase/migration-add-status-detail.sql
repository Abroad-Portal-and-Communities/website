-- Add status detail if table already exists without this column
alter table public.survey_responses
  add column if not exists status_detail_text text;

-- Backfill existing rows then enforce NOT NULL (skip if table is empty)
-- update public.survey_responses set status_detail_text = '' where status_detail_text is null;
-- alter table public.survey_responses alter column status_detail_text set not null;
