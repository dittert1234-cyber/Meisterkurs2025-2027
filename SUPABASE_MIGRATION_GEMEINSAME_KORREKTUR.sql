-- Migration für die gemeinsame Stundenkorrektur
-- Einmal im Supabase SQL Editor des aktuell verwendeten Projekts ausführen.
create table if not exists public.course_settings (
  setting_key text primary key,
  setting_value numeric not null default 0,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.course_settings enable row level security;

drop policy if exists "Approved users can read course settings" on public.course_settings;
create policy "Approved users can read course settings"
  on public.course_settings for select to authenticated
  using (exists (
    select 1 from public.app_profiles p
    where p.user_id = auth.uid() and p.approved = true
  ));

drop policy if exists "Approved users can insert course settings" on public.course_settings;
create policy "Approved users can insert course settings"
  on public.course_settings for insert to authenticated
  with check (exists (
    select 1 from public.app_profiles p
    where p.user_id = auth.uid() and p.approved = true
  ));

drop policy if exists "Approved users can update course settings" on public.course_settings;
create policy "Approved users can update course settings"
  on public.course_settings for update to authenticated
  using (exists (
    select 1 from public.app_profiles p
    where p.user_id = auth.uid() and p.approved = true
  ))
  with check (exists (
    select 1 from public.app_profiles p
    where p.user_id = auth.uid() and p.approved = true
  ));

grant select, insert, update on public.course_settings to authenticated;
