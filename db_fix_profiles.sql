-- Fix profiles: colonnes manquantes, policy INSERT et trigger d'auto-création
-- Aligne la table profiles avec types.ts et crée automatiquement le profil à l'inscription.

alter table profiles add column if not exists department text;
alter table profiles add column if not exists level text;

drop policy if exists "Users can insert own profile" on profiles;
create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, department, level, role)
  values (new.id,
          new.raw_user_meta_data->>'full_name',
          new.raw_user_meta_data->>'department',
          new.raw_user_meta_data->>'level',
          'user')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
