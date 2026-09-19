# Supabase Auth setup — Phase 1

## Project settings

1. Create a Supabase project and enable Email under **Authentication → Sign In / Providers**.
2. In **Authentication → URL Configuration**, set the local Site URL to `http://localhost:3000` and add `http://localhost:3000/auth/confirm` as a redirect URL. Add the exact HTTPS production callback before deployment.
3. Decide whether **Confirm email** should be enabled. When enabled, registration shows a confirmation message; when disabled, registration immediately opens the dashboard.

## Environment

Copy `.env.example` to `.env.local`. From **Project Settings → API**, add the Project URL and publishable key:

```text
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

The legacy anon key can be used as the value if the project does not yet expose a publishable key. Never add a service-role or secret key to a `NEXT_PUBLIC_` variable.

## Database

Run the files in `supabase/migrations/` in filename order in the Supabase SQL Editor. The first creates the profile table, trigger, role constraint, grants, and RLS policies. The Google metadata migration updates the trusted trigger and safely backfills any existing Auth user who has no profile. Test a registration after running them; a failing auth trigger can block signup.

## Google OAuth

1. In Google Auth Platform, create or select a Google Cloud project and configure the OAuth consent screen.
2. Create an OAuth Client ID with application type **Web application**.
3. Add the website origins under **Authorized JavaScript origins**, including `http://localhost:3000` for local development and the HTTPS production origin.
4. Under **Authorized redirect URIs**, add the callback shown on **Supabase Dashboard → Authentication → Providers → Google**. For a hosted project it normally has this form:

   `https://<project-ref>.supabase.co/auth/v1/callback`

   Do not put the application `/auth/confirm` URL in Google’s redirect URI field. Google returns to Supabase first; Supabase then returns to the application callback.
5. Copy the Google OAuth Client ID and Client Secret into the Google provider settings in Supabase and enable the provider. Do not place the Google Client Secret in this application or in any `NEXT_PUBLIC_` variable.
6. Add these application callbacks to **Supabase Authentication → URL Configuration → Redirect URLs**:

   - Local: `http://localhost:3000/auth/confirm`
   - Production: `https://your-production-domain.example/auth/confirm`

Use HTTPS and the exact production domain. If using a local Supabase CLI stack rather than a hosted project, Google’s authorized redirect URI is normally `http://127.0.0.1:54321/auth/v1/callback`; configure the provider in `supabase/config.toml` and keep its secret in a non-public environment variable.

## First admin later

Create the person through normal Supabase Auth first. Then, while signed in to the Supabase Dashboard as a trusted project owner, update that specific profile by UUID in the SQL Editor:

```sql
update public.profiles set role = 'admin' where id = 'verified-auth-user-uuid';
```

Never expose this operation through the public client. Phase 1 does not include an admin dashboard.

## Local testing

1. Add `.env.local` and run the SQL migration.
2. Run `npm run dev`.
3. Register at `/register` with email/password or choose **Continue with Google**. If email confirmation is enabled for password registration, use the confirmation link before login.
4. Login at `/login`, verify `/student/dashboard`, then logout.
5. In a private browser window, verify `/student/dashboard` redirects to `/login`.

## Study Materials phase

Run `supabase/migrations/202608150001_study_materials.sql` in the Supabase SQL Editor after the profile migrations. It creates the catalogue table, private `study-materials` Storage bucket, admin helper, database RLS policies, and Storage policies.

No additional environment variables or service-role key are required. The application continues to use the project URL and publishable key. After applying the migration:

1. Confirm **Storage → study-materials** shows **Public bucket: Off**, a 25 MB limit, and only PDF/DOCX MIME types.
2. Confirm the intended administrator has `role = 'admin'` in `public.profiles`; never expose that role update through the public application.
3. Sign in as that administrator and open `/admin/study-materials` to upload the first real document.
4. Publish it, then verify a student can see it at `/student/materials`; unpublish it and verify it disappears for the student.

The bucket does not need to be created manually when the migration succeeds. If project permissions prevent the SQL Editor from inserting into `storage.buckets`, create a private bucket named exactly `study-materials` with the same MIME and size limits, then rerun only after confirming the included Storage policies were created. Never make this bucket public.

## Final Student Portal

Run `supabase/migrations/202608200001_complete_student_portal.sql` after the profile and Study Materials migrations. It creates `student_enrollments`, `announcements`, and `events`, including their indexes, updated-at triggers, grants, and RLS policies.

This migration inserts no sample data. Enrollments and published notices/events must be created through trusted administrator/database operations. Students cannot self-enroll or mutate published content.

Do not rerun the older non-idempotent creation migrations on a project where their tables already exist. In particular, do not rerun `202608130001_create_profiles.sql` or `202608150001_study_materials.sql` against the current manually aligned remote schema. Apply the later corrective migrations only if their corresponding correction has not already been executed.
