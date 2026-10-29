-- Run this in the existing project's SQL Editor. No paid service is required.
-- Supabase manages RLS on storage.objects; these policies scope this bucket only.
begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('journal-images', 'journal-images', false, 5242880,
        array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists journal_images_read on storage.objects;
create policy journal_images_read on storage.objects
for select to authenticated
using (bucket_id = 'journal-images'
       and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists journal_images_upload on storage.objects;
create policy journal_images_upload on storage.objects
for insert to authenticated
with check (bucket_id = 'journal-images'
            and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists journal_images_delete on storage.objects;
create policy journal_images_delete on storage.objects
for delete to authenticated
using (bucket_id = 'journal-images'
       and (storage.foldername(name))[1] = (select auth.uid())::text);

commit;
