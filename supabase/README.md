# Supabase setup — Akteynt-mangauz

## 1. Create a Supabase project

Create a project in the Supabase dashboard and keep its database password private.

## 2. Apply the initial schema

Open **SQL Editor** in the Supabase dashboard, create a new query, paste the contents of:

`migrations/202609200001_initial_schema.sql`

Run it and confirm that the tables and policies were created successfully.

## 3. Configure authentication

In **Authentication → URL Configuration**, set the site URL to your deployed site and add your local development URL (for example, `http://localhost:3000`) to the allowed redirect URLs.

## 4. Environment variables

The Next.js application will need the Supabase project URL and the publishable/anon key. Store them in local `.env.local` and in Vercel's project environment settings. Never expose the `service_role` key in browser code or commit secrets to Git.

Expected variable names for the upcoming client integration:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

## 5. Security notes

- Row Level Security is enabled by the migration.
- New registrations receive the `user` role.
- Do not let clients write privileged roles. Assign moderators/admins only through a trusted server-side process.
- Manga image files should be stored in object storage (such as Supabase Storage or Cloudflare R2); keep only their URLs in `pages.image_url`.

## Current status

This migration defines the database foundation. It does not yet connect the existing demo UI to Supabase or migrate the sample manga data. Those are separate follow-up steps, and the SQL must be applied to the Supabase project before the database is available to the app.
