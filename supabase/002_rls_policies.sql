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
