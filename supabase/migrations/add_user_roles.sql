create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('fundador', 'administrador', 'socio', 'no_socio')),
  assigned_by uuid references auth.users(id),
  assigned_at timestamptz not null default now(),
  unique(user_id)
);

alter table public.user_roles enable row level security;

-- Users can read their own role
create policy "Users can read own role"
  on public.user_roles for select
  using (user_id = auth.uid());

-- Admins and founders can read all roles
create policy "Admins can read all roles"
  on public.user_roles for select
  using (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid()
      and ur.role in ('administrador', 'fundador')
    )
  );
