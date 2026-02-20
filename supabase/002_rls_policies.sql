-- Enable RLS on all tables
alter table public.subjects enable row level security;
alter table public.papers enable row level security;
alter table public.users enable row level security;

-- subjects: public read
create policy "Anyone can read subjects"
  on public.subjects for select
  using (true);

-- papers: public read
-- Note: answer gating for logged-out users is handled in app logic, not at DB level
create policy "Anyone can read papers"
  on public.papers for select
  using (true);

-- users: own row only
create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- check_email_exists
-- Used by POST /api/auth/check-email (admin/service_role client) to distinguish
-- "no account" from "wrong password" — Supabase returns the same error for both.
-- SECURITY DEFINER so it can read auth.users, which PostgREST does not expose directly.
create or replace function public.check_email_exists(lookup_email text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from auth.users
    where lower(email) = lower(lookup_email)
  );
$$;

-- Only the service_role (used by the API route) should be able to call this.
revoke execute on function public.check_email_exists(text) from public, anon, authenticated;
grant execute on function public.check_email_exists(text) to service_role;
