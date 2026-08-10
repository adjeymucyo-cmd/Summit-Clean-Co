# Summit Clean Co. MVP

This project is a production-ready Next.js MVP for Summit Clean Co. with Supabase-backed content, public pages, and an admin area.

## Features

- Public marketing pages for home, services, about, service areas, contact, and quote requests
- Supabase-powered services, service areas, testimonials, quote requests, and contact messages
- Admin dashboard with protected routes and Supabase Auth
- Responsive UI with Tailwind CSS and shadcn-inspired components

## Getting started

1. Install dependencies
   ```bash
   npm install
   ```
2. Create a Supabase project and configure the database using the SQL migration in the repository.
3. Copy `.env.example` to `.env.local` and replace the placeholder values with your Supabase project URL and keys from the Supabase dashboard.
4. Run the app
   ```bash
   npm run dev
   ```

## Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

You can find these values in Supabase under Project Settings → API.

## Database setup

Create the following tables in Supabase with RLS enabled:

- profiles
- services
- service_areas
- testimonials
- quote_requests
- contact_messages
- site_settings
- admin_notes

Use the schema and policies from the specification as a guide.
