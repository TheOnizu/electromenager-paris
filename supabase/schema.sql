-- Réparation Électroménager Paris — Schéma Supabase

-- Réservations clients
create table bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  address text not null,
  date date not null,
  status text not null default 'pending', -- pending | completed | cancelled
  completed_at timestamptz,
  review_requested boolean not null default false,
  created_at timestamptz not null default now()
);

-- Disponibilités
create table availability (
  date date primary key,
  is_available boolean not null default true
);

-- Marques
create table brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  created_at timestamptz not null default now()
);

-- Prestations
create table services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  icon text not null default 'wrench',
  created_at timestamptz not null default now()
);

-- Avis clients
create table reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  status text not null default 'pending', -- pending | published | rejected
  booking_id uuid references bookings(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Paramètres globaux
create table settings (
  key text primary key,
  value text not null
);

-- Valeurs par défaut des paramètres
insert into settings (key, value) values
  ('cgv_text', 'En acceptant ces conditions, vous reconnaissez avoir pris connaissance des conditions générales de vente et les acceptez sans réserve.'),
  ('review_delay_days', '3'),
  ('review_channel', 'both'); -- email | sms | both

-- Données de démo : quelques prestations
insert into services (name, description, icon) values
  ('Lave-linge', 'Réparation de tous types de pannes : moteur, pompe, résistance, programmateur.', 'washing-machine'),
  ('Réfrigérateur', 'Diagnostic et réparation : compresseur, thermostat, fuite de gaz, joint.', 'refrigerator'),
  ('Lave-vaisselle', 'Réparation pompe de vidange, résistance, bras de lavage, électrovanne.', 'dishwasher'),
  ('Four / Micro-ondes', 'Réparation résistance, thermostat, magnetron, porte.', 'microwave'),
  ('Sèche-linge', 'Réparation résistance, thermostat, courroie, condenseur.', 'wind'),
  ('Hotte aspirante', 'Remplacement moteur, filtre, éclairage, télécommande.', 'fan');
