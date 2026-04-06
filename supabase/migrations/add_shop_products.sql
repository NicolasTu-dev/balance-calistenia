-- Shop products table
create table if not exists public.shop_products (
  id            uuid        primary key default gen_random_uuid(),
  name          text        not null,
  description   text        not null default '',
  price         integer     not null,                          -- ARS pesos
  original_price integer,                                      -- for discount badge
  badge         text,                                          -- e.g. "Más vendida"
  colors        jsonb       not null default '[]',             -- [{label: string, image: string}]
  sizes         text[]      not null default '{}',             -- ["S","M","L","XL","XXL"]
  extra_images  text[]      not null default '{}',             -- additional product images
  active        boolean     not null default true,
  sort_order    integer     not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.shop_products enable row level security;

-- Anyone can read active products (public store)
create policy "Public can read active products"
  on public.shop_products for select
  using (active = true);

-- Admins read all (including inactive) via service role — no RLS needed for service role
