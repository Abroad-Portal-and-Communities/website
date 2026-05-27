-- Run in Supabase: SQL Editor → New query → paste → Run
-- APC community survey (v2)

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status_id text not null,
  status_label text not null,
  status_detail_text text not null,
  continent_id text not null,
  continent_label text not null,
  country_text text not null,
  job_id text not null,
  job_label text not null,
  job_other_text text,
  looking_for jsonb not null default '[]'::jsonb,
  page_path text
);

comment on table public.survey_responses is 'APC website community survey submissions';

alter table public.survey_responses enable row level security;

drop policy if exists "survey_anon_insert" on public.survey_responses;
create policy "survey_anon_insert"
  on public.survey_responses
  for insert
  to anon
  with check (true);
