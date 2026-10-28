-- 03-lock-down-rls.sql
-- Run this in the Supabase SQL editor.
--
-- WHY: scripts/01 created policies "FOR SELECT USING (true)" and "FOR UPDATE USING (true)"
-- on `registrations`. Those apply to the PUBLIC anon key (which ships in the browser bundle),
-- so anyone could read every student's name/phone/email, or flip their own payment_status
-- to 'full', by calling the Supabase REST API directly.
--
-- The application only touches `registrations` through server routes that use the
-- service-role key, which bypasses RLS. So the table needs NO policies for anon/authenticated.

-- 1) registrations: remove every policy; with RLS enabled and no policies, anon/authenticated are denied.
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'registrations'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON registrations', p.policyname);
  END LOOP;
END $$;

REVOKE ALL ON registrations FROM anon, authenticated;

-- 2) gallery: the public site only READS it (training-gallery page uses the anon key).
--    Keep a read-only policy and drop anything that allows writes.
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'gallery' AND cmd <> 'SELECT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON gallery', p.policyname);
  END LOOP;
END $$;

REVOKE INSERT, UPDATE, DELETE ON gallery FROM anon, authenticated;

DROP POLICY IF EXISTS "Public can read gallery" ON gallery;
CREATE POLICY "Public can read gallery" ON gallery FOR SELECT USING (true);

-- 3) courses (if present) is public catalog data: read-only for everyone.
DO $$
BEGIN
  IF to_regclass('public.courses') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE courses ENABLE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE INSERT, UPDATE, DELETE ON courses FROM anon, authenticated';
    EXECUTE 'DROP POLICY IF EXISTS "Public can read courses" ON courses';
    EXECUTE 'CREATE POLICY "Public can read courses" ON courses FOR SELECT USING (true)';
  END IF;
END $$;

-- 4) Storage: the `gallery` bucket should be publicly readable but writable only via the service role.
--    In Dashboard > Storage > Policies, make sure there are NO INSERT/UPDATE/DELETE policies
--    for the anon/authenticated roles on storage.objects for this bucket.
--    This lists any that exist:
--      SELECT policyname, cmd, roles FROM pg_policies WHERE schemaname='storage' AND tablename='objects';
