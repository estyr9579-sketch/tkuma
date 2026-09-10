-- =====================================================================
--  מתאם טיפול אישי – Database schema
--  Run this once in Supabase: SQL Editor -> New query -> paste -> Run
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------- Enums ----------
do $$ begin
  create type user_role as enum ('user', 'writer', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type article_kind as enum ('site', 'expert');
exception when duplicate_object then null; end $$;

do $$ begin
  create type article_status as enum ('draft', 'pending', 'needs_changes', 'rejected', 'approved', 'published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_status as enum ('new', 'in_progress', 'contacted', 'closed');
exception when duplicate_object then null; end $$;

-- ---------- Profiles (1:1 with auth.users) ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null default '',
  phone       text not null default '',
  email       text not null default '',
  role        user_role not null default 'writer',
  is_blocked  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists profiles_phone_idx on public.profiles(phone);

-- Auto-create a profile row when a user signs up (metadata comes from the signup form)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- Categories ----------
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  slug       text not null unique,
  sort_order int  not null default 0
);

-- ---------- Articles ----------
create table if not exists public.articles (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text not null unique,
  title                 text not null,
  excerpt               text not null default '',
  content               text not null default '',        -- sanitized HTML
  cover_image_url       text,
  category_id           uuid references public.categories(id) on delete set null,
  kind                  article_kind   not null default 'site',
  status                article_status not null default 'draft',
  created_by            uuid references public.profiles(id) on delete set null,  -- who created it in the system
  display_author_name   text not null default '',                                -- author shown on the site
  display_author_bio    text not null default '',
  display_author_image  text,
  display_author_link   text,
  admin_note            text not null default '',                                -- feedback to the writer
  published_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists articles_status_idx on public.articles(status);
create index if not exists articles_kind_idx on public.articles(kind);
create index if not exists articles_created_by_idx on public.articles(created_by);
create index if not exists articles_published_at_idx on public.articles(published_at desc);

-- ---------- Leads ----------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  phone       text not null,
  message     text not null default '',
  status      lead_status not null default 'new',
  admin_note  text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_created_at_idx on public.leads(created_at desc);

-- ---------- Site content (editable texts, key/value) ----------
create table if not exists public.site_content (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

-- ---------- updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
drop trigger if exists articles_updated_at on public.articles;
create trigger articles_updated_at before update on public.articles for each row execute procedure public.set_updated_at();
drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at before update on public.leads for each row execute procedure public.set_updated_at();
drop trigger if exists site_content_updated_at on public.site_content;
create trigger site_content_updated_at before update on public.site_content for each row execute procedure public.set_updated_at();

-- ---------- Row Level Security ----------
-- All application access goes through the server (service role) with explicit
-- authorization checks in code. The anon/authenticated keys get read-only access
-- to public data and nothing else.
alter table public.profiles     enable row level security;
alter table public.categories   enable row level security;
alter table public.articles     enable row level security;
alter table public.leads        enable row level security;
alter table public.site_content enable row level security;

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);

drop policy if exists "public read published articles" on public.articles;
create policy "public read published articles" on public.articles for select using (status = 'published');

drop policy if exists "public read site content" on public.site_content;
create policy "public read site content" on public.site_content for select using (true);

drop policy if exists "own profile read" on public.profiles;
create policy "own profile read" on public.profiles for select using (auth.uid() = id);

-- ---------- Storage bucket for images ----------
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists "public read images" on storage.objects;
create policy "public read images" on storage.objects for select using (bucket_id = 'images');

-- ---------- Seed: categories ----------
insert into public.categories (name, slug, sort_order) values
  ('עולם הטיפול הרגשי', 'emotional-therapy-world', 1),
  ('סוגי טיפולים', 'therapy-types', 2),
  ('איך לבחור מטפל', 'choosing-a-therapist', 3),
  ('החלפת מטפל', 'changing-therapist', 4),
  ('ויסות רגשי', 'emotional-regulation', 5),
  ('טיפולים משלימים', 'complementary-therapies', 6),
  ('התמודדות עם תקופות קשות', 'hard-times', 7),
  ('שאלות נפוצות', 'faq', 8)
on conflict (slug) do nothing;
