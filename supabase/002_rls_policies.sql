-- Enable RLS on all tables
alter table public.subjects enable row level security;
alter table public.papers enable row level security;
alter table public.users enable row level security;
alter table public.purchases enable row level security;

-- subjects: public read
create policy "Anyone can read subjects"
  on public.subjects for select
  using (true);

-- papers: public read for questions column
-- Note: answers column gated separately via app logic + the policy below
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

-- purchases: users see only their own
create policy "Users can read own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);

-- purchases: only service role can insert/update (done via API routes)
-- No insert/update policy needed for authenticated users
-- The API routes use the service role key which bypasses RLS

-- Helper function: check if current user has purchased a paper
create or replace function public.has_purchased(paper_uuid uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.purchases
    where user_id = auth.uid()
      and paper_id = paper_uuid
      and status = 'paid'
  );
$$;
