-- APC survey reporting queries (run in Supabase SQL Editor)
-- Requires table from schema.sql

-- Total submissions
select count(*) as total_responses
from public.survey_responses;

-- Submissions per day
select
  date_trunc('day', created_at at time zone 'utc')::date as day,
  count(*) as responses
from public.survey_responses
group by 1
order by 1 desc;

-- By current status
select status_id, status_label, count(*) as n
from public.survey_responses
group by 1, 2
order by n desc;

-- By target region
select continent_id, continent_label, count(*) as n
from public.survey_responses
group by 1, 2
order by n desc;

-- By target job
select job_id, job_label, count(*) as n
from public.survey_responses
group by 1, 2
order by n desc;

-- Top countries (free text)
select country_text, count(*) as n
from public.survey_responses
group by 1
order by n desc
limit 30;

-- Export all rows (CSV: use Table Editor → survey_responses → Export, or copy result)
select *
from public.survey_responses_reporting
order by created_at desc;
