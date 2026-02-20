-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- subjects table
create table public.subjects (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  name text not null,
  short_name text not null,
  regulation text not null,
  semester int not null,
  department text not null,
  college text not null,
  exam_pattern jsonb not null default '{}',
  created_at timestamptz default now()
);

-- papers table
create table public.papers (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  title text not null,
  type text not null check (type in ('end_sem', 'mid_sem_1', 'mid_sem_2', 'practice')),
  year text not null,
  questions jsonb not null default '{}',
  answers jsonb not null default '{}',
  metadata jsonb not null default '{}',
  created_at timestamptz default now(),
  unique(subject_id, title)
);

-- users table (mirrors auth.users)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  college text,
  semester int,
  active_device_token text,
  created_at timestamptz default now()
);

-- Indexes
create index on public.papers(subject_id);
