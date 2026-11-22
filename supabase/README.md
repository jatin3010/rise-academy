# Connecting the admin CRM (one-time, about 5 minutes)

The CRM lives at `/admin` on the website. Student data is stored in Supabase, behind a login.

1. **Create a project.** Sign up free at https://supabase.com and create a new project. Pick the **Mumbai** region.
2. **Create the tables.** In the project, open **SQL Editor**, paste all of `supabase/schema.sql`, and press **Run**.
3. **Create your login.**
   - **Authentication → Sign In / Providers:** turn **off** "Allow new users to sign up".
   - **Authentication → Users → Add user:** enter your email and a strong password, and tick "Auto confirm".
4. **Make that login an admin.** In **SQL Editor**, run this with your email:
   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';
   ```
   Repeat for each staff member who should use the CRM.
5. **Connect the website.** In **Project Settings → API Keys**, copy the **Project URL** and the **Publishable key**. Then either:
   - send both to whoever maintains the site, or
   - add them in GitHub under **Settings → Secrets and variables → Actions → Variables** as `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`, then re-run the deploy.

   For local development, put them in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_KEY=...
   ```

These two values are meant to be public. Only logins listed in step 4 can read or change student data. Never share the
**secret** key or the database password.

**Consent:** before messaging students on WhatsApp, get their consent, or a parent's consent for anyone under 18. This
is what India's data protection law (DPDP Act) expects.
