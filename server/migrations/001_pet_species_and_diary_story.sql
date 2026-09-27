alter table pets
  add column if not exists species text not null default 'Dogs';

alter table diary_entries
  add column if not exists story text;