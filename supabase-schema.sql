create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  role text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  short_description text,
  description text,
  image_url text,
  display_order int4 default 99,
  is_active bool default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists service_areas (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  is_active bool default true,
  display_order int4 default 99,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists testimonials (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  location text,
  review text not null,
  rating int4 check (rating between 1 and 5),
  is_published bool default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists quote_requests (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null,
  phone text,
  service_id uuid references services(id),
  property_type text,
  preferred_date date,
  preferred_contact text,
  address text,
  property_size text,
  frequency text,
  details text,
  status text default 'new',
  admin_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text default 'new' check (status in ('new', 'opened', 'replied')),
  reply_text text,
  replied_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists site_settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

create table if not exists admin_notes (
  id uuid primary key default uuid_generate_v4(),
  quote_id uuid not null,
  author_id uuid,
  note text not null,
  created_at timestamptz default now()
);

create index if not exists quote_requests_status_idx on quote_requests(status);
create index if not exists quote_requests_created_at_idx on quote_requests(created_at);
create index if not exists services_is_active_idx on services(is_active);
create index if not exists service_areas_is_active_idx on service_areas(is_active);
create index if not exists testimonials_is_published_idx on testimonials(is_published);

alter table services enable row level security;
alter table service_areas enable row level security;
alter table testimonials enable row level security;
alter table quote_requests enable row level security;
alter table contact_messages enable row level security;
alter table site_settings enable row level security;
alter table admin_notes enable row level security;

drop policy if exists services_public_read on services;
create policy services_public_read on services for select using (is_active);

drop policy if exists areas_public_read on service_areas;
create policy areas_public_read on service_areas for select using (is_active);

drop policy if exists testimonials_public_read on testimonials;
create policy testimonials_public_read on testimonials for select using (is_published);

drop policy if exists quotes_public_insert on quote_requests;
create policy quotes_public_insert on quote_requests for insert with check (true);

drop policy if exists contact_public_insert on contact_messages;
create policy contact_public_insert on contact_messages for insert with check (true);

drop policy if exists contact_authenticated_read on contact_messages;
create policy contact_authenticated_read on contact_messages for select using (auth.role() = 'authenticated');

drop policy if exists contact_authenticated_update on contact_messages;
create policy contact_authenticated_update on contact_messages for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists settings_public_read on site_settings;
create policy settings_public_read on site_settings for select using (true);

insert into services (name, slug, short_description, description, image_url, display_order, is_active) values
('Residential Cleaning', 'residential-cleaning', 'Consistent, detail-focused home cleaning for busy households.', 'From weekly upkeep to seasonal refreshes, our residential service keeps homes feeling comfortable and cared for.', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80', 1, true),
('Commercial Cleaning', 'commercial-cleaning', 'Reliable janitorial care for offices, storefronts, and shared spaces.', 'Help your workplace stay welcoming, safe, and polished with professional commercial cleaning.', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80', 2, true),
('Office Cleaning', 'office-cleaning', 'Increased hygiene and polished presentation for daily office needs.', 'Our teams maintain clean shared spaces and polished desks for busy professionals.', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80', 3, true),
('Deep Cleaning', 'deep-cleaning', 'For spaces that need a more thorough reset.', 'Ideal for seasonal refreshes, move outs, or full-home detailing.', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80', 4, true),
('Move-In Cleaning', 'move-in-cleaning', 'A fresh, ready-to-enjoy start for your next home.', 'Ensure your new home is spotless before the boxes arrive.', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80', 5, true),
('Move-Out Cleaning', 'move-out-cleaning', 'Secure your deposit and leave the property sparkling.', 'Move-out cleaning is designed for landlords, tenants, and property managers.', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80', 6, true),
('Interior Cleaning', 'interior-cleaning', 'Clean interiors that feel fresh, bright, and comfortable.', 'From cabinets to baseboards, we help interiors feel truly cared for.', 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80', 7, true),
('Custom Cleaning Services', 'custom-cleaning-services', 'Flexible options for unique homes and business needs.', 'Tell us what you need and we will tailor a plan around your priorities.', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80', 8, true)
on conflict (slug) do nothing;

insert into service_areas (name, slug, description, display_order, is_active) values
('Abbotsford', 'abbotsford', 'Serving homeowners and businesses across Abbotsford with dependable cleaning support.', 1, true),
('Fraser Valley', 'fraser-valley', 'Flexible service coverage across the broader Fraser Valley region.', 2, true),
('Surrounding Communities', 'surrounding-communities', 'Additional local service coverage for nearby communities and neighborhoods.', 3, true)
on conflict (slug) do nothing;

insert into testimonials (customer_name, location, review, rating, is_published) values
('Demo Customer', 'Abbotsford', 'Demo content only. Replace with real testimonials in Supabase.', 5, false)
on conflict do nothing;

insert into site_settings (key, value) values
('business_name', 'Summit Clean Co.'),
('phone', '778-548-3365'),
('email', 'mahordesire767@gmail.com'),
('tagline', 'Clean Spaces. Better Places.'),
('hero_heading', 'Clean Spaces. Better Places.'),
('hero_description', 'Professional cleaning for homes and businesses across Abbotsford and the Fraser Valley.'),
('service_area', 'Abbotsford & surrounding Fraser Valley areas')
on conflict (key) do nothing;

-- Create storage bucket for about page videos
insert into storage.buckets (id, name, public)
values ('about-videos', 'about-videos', true)
on conflict (id) do nothing;

-- Ensure contact_messages has reply_text column
alter table contact_messages add column if not exists reply_text text;


