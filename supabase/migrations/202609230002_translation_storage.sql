insert into storage.buckets (id, name, public)
values ('translation-pdfs', 'translation-pdfs', false)
on conflict (id) do nothing;
