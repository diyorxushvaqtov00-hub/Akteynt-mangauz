-- Akteynt-mangauz: initial Supabase schema
-- Apply this migration in the Supabase SQL Editor or through Supabase CLI.
-- Never allow clients to set their own role; promote trusted accounts server-side only.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'moderator', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mangas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  alternative_titles text[] not null default '{}',
  description text,
  cover_url text,
  banner_url text,
  author text,
  artist text,
  status text not null default 'ongoing' check (status in ('ongoing', 'completed', 'hiatus', 'cancelled')),
  content_type text not null default 'manga' check (content_type in ('manga', 'manhwa', 'manhua', 'webtoon', 'other')),
  genres text[] not null default '{}',
  release_year integer,
  is_published boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  manga_id uuid not null references public.mangas(id) on delete cascade,
  chapter_number numeric(10,2) not null,
  title text,
  slug text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (manga_id, chapter_number)
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  page_number integer not null check (page_number > 0),
  image_url text not null,
  width integer,
  height integer,
  created_at timestamptz not null default now(),
  unique (chapter_id, page_number)
);

create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  manga_id uuid not null references public.mangas(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, manga_id)
);

create table if not exists public.reading_history (
  user_id uuid not null references public.profiles(id) on delete cascade,
  manga_id uuid not null references public.mangas(id) on delete cascade,
  chapter_id uuid references public.chapters(id) on delete set null,
  last_page integer not null default 1 check (last_page > 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, manga_id)
);

create table if not exists public.translations (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  target_language text not null default 'uz',
  status text not null default 'queued' check (status in ('queued', 'processing', 'completed', 'failed')),
  provider text,
  result jsonb,
  error_message text,
  requested_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (chapter_id, target_language)
);

create index if not exists mangas_published_updated_idx on public.mangas (is_published, updated_at desc);
create index if not exists chapters_manga_number_idx on public.chapters (manga_id, chapter_number desc);
create index if not exists pages_chapter_page_idx on public.pages (chapter_id, page_number);
create index if not exists reading_history_user_updated_idx on public.reading_history (user_id, updated_at desc);
create index if not exists translations_status_created_idx on public.translations (status, created_at);

-- Keep updated_at current when rows are modified.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger mangas_set_updated_at before update on public.mangas
for each row execute function public.set_updated_at();
create trigger chapters_set_updated_at before update on public.chapters
for each row execute function public.set_updated_at();
create trigger translations_set_updated_at before update on public.translations
for each row execute function public.set_updated_at();

-- Create a profile for each newly registered user. Role is always assigned as 'user'.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url, role)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'username', ''),
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', ''),
    'user'
  ) on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- RLS: users manage only their own profile (role cannot be changed through this policy).
alter table public.profiles enable row level security;
alter table public.mangas enable row level security;
alter table public.chapters enable row level security;
alter table public.pages enable row level security;
alter table public.favorites enable row level security;
alter table public.reading_history enable row level security;
alter table public.translations enable row level security;

create policy "Profiles are viewable by everyone" on public.profiles
for select using (true);
create policy "Users can insert their own profile" on public.profiles
for insert with check (auth.uid() = id and role = 'user');
create policy "Users can update their own profile without changing role" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id and role = 'user');

create policy "Published mangas are publicly readable" on public.mangas
for select using (is_published = true or exists (
  select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'moderator')
));
create policy "Moderators and admins manage mangas" on public.mangas
for all using (exists (
  select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'moderator')
)) with check (exists (
  select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'moderator')
));

create policy "Published chapters are publicly readable" on public.chapters
for select using (
  is_published = true and exists (select 1 from public.mangas m where m.id = manga_id and m.is_published = true)
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'moderator'))
);
create policy "Moderators and admins manage chapters" on public.chapters
for all using (exists (
  select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'moderator')
)) with check (exists (
  select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'moderator')
));

create policy "Pages of published chapters are publicly readable" on public.pages
for select using (exists (
  select 1 from public.chapters c join public.mangas m on m.id = c.manga_id
  where c.id = chapter_id and c.is_published = true and m.is_published = true
) or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'moderator')));
create policy "Moderators and admins manage pages" on public.pages
for all using (exists (
  select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'moderator')
)) with check (exists (
  select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'moderator')
));

create policy "Users manage their own favorites" on public.favorites
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their own reading history" on public.reading_history
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can view their own translation requests" on public.translations
for select using (auth.uid() = requested_by or exists (
  select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'moderator')
));
create policy "Authenticated users can request translations" on public.translations
for insert to authenticated with check (auth.uid() = requested_by and status = 'queued');
create policy "Moderators and admins manage translations" on public.translations
for update using (exists (
  select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'moderator')
)) with check (exists (
  select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'moderator')
));
