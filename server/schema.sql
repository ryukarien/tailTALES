-- tailTALES schema
-- Ownership lives on `pets` (owner_uid = Firebase Auth uid). Diary entries and
-- vet records belong to a pet, never directly to a user, so ownership is always
-- checked by following pet_id -> pets.owner_uid. This is the check that was
-- missing client-side and let one user's diary show up for everyone.

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

create table pets (
  id                    uuid primary key default gen_random_uuid(),
  owner_uid             text not null,
  name                  text not null,
  breed                 text not null,
  birthday              date,
  photo_url             text,
  is_rehoming           boolean not null default false,
  rehoming_description  text,
  rehoming_contact      text,
  created_at            timestamptz not null default now()
);

create index pets_owner_uid_idx on pets (owner_uid);
create index pets_is_rehoming_idx on pets (is_rehoming) where is_rehoming;

create table diary_entries (
  id          uuid primary key default gen_random_uuid(),
  pet_id      uuid not null references pets(id) on delete cascade,
  entry_date  date not null,
  caption     text,
  photo_url   text,
  created_at  timestamptz not null default now()
);

create index diary_entries_pet_id_idx on diary_entries (pet_id);

create table vet_records (
  id          uuid primary key default gen_random_uuid(),
  pet_id      uuid not null references pets(id) on delete cascade,
  entry_date  date not null,
  vaccine     text not null,
  notes       text,
  created_at  timestamptz not null default now()
);

create index vet_records_pet_id_idx on vet_records (pet_id);