-- NOTE: Remember to configure the password reset email redirect URL in Supabase Dashboard
-- → Auth → URL Configuration → Add `http://localhost:3000/auth/reset-password` to Redirect URLs.
-- For production, also add your production domain, e.g. `https://yourdomain.com/auth/reset-password`.

-- Trigger: auto-create public.users row when auth.users row is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
