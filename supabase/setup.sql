-- Full schema for the portfolio (visitor counter, analytics events, reviews).
-- Paste into Supabase Dashboard -> SQL Editor and run once on a new project.

-- ==== 20260808043036_eb1b43be-9275-4158-ab20-d162e0427190.sql ====
CREATE TABLE public.site_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  label text NOT NULL,
  session_id text,
  path text,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.site_events TO anon;
GRANT INSERT ON public.site_events TO authenticated;
GRANT ALL ON public.site_events TO service_role;

ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record an anonymous event"
ON public.site_events FOR INSERT TO anon, authenticated
WITH CHECK (
  length(name) <= 40 AND length(label) <= 120
  AND (session_id IS NULL OR length(session_id) <= 64)
  AND (path IS NULL OR length(path) <= 200)
  AND (referrer IS NULL OR length(referrer) <= 200)
);

CREATE INDEX site_events_created_at_idx ON public.site_events (created_at DESC);
-- ==== 20260901034046_b7023517-d1d9-445c-b504-8ef4f16547df.sql ====
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text,
  role text,
  rating smallint NOT NULL,
  message text NOT NULL,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reviews_rating_range CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT reviews_display_name_length CHECK (display_name IS NULL OR length(display_name) BETWEEN 1 AND 80),
  CONSTRAINT reviews_role_length CHECK (role IS NULL OR length(role) <= 100),
  CONSTRAINT reviews_message_length CHECK (length(message) BETWEEN 10 AND 1000)
);

GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT SELECT, INSERT ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published reviews"
ON public.reviews FOR SELECT TO anon, authenticated
USING (published = true);

CREATE POLICY "Anyone can submit a review"
ON public.reviews FOR INSERT TO anon, authenticated
WITH CHECK (
  rating BETWEEN 1 AND 5
  AND (display_name IS NULL OR length(display_name) BETWEEN 1 AND 80)
  AND (role IS NULL OR length(role) <= 100)
  AND length(message) BETWEEN 10 AND 1000
  AND published = true
);
-- ==== 20260905020614_a198c66a-9f5d-40d4-a3cf-4a3dc5ae478e.sql ====
CREATE OR REPLACE FUNCTION public.record_site_visit(p_session_id text)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  visitor_total bigint;
BEGIN
  IF p_session_id IS NULL OR length(trim(p_session_id)) < 8 OR length(p_session_id) > 64 THEN
    RAISE EXCEPTION 'Invalid visitor session';
  END IF;

  INSERT INTO public.site_events (name, label, session_id, path)
  SELECT 'page_view', 'home', p_session_id, '/'
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.site_events
    WHERE name = 'page_view'
      AND label = 'home'
      AND path = '/'
      AND session_id = p_session_id
  );

  SELECT count(DISTINCT session_id)
  INTO visitor_total
  FROM public.site_events
  WHERE name = 'page_view'
    AND label = 'home'
    AND path = '/'
    AND session_id IS NOT NULL;

  RETURN visitor_total;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_site_visit(text) TO anon, authenticated, service_role;
-- ==== 20260905020656_0f3db6bb-08c3-41fd-8ca3-5c553e9ddb13.sql ====
CREATE OR REPLACE VIEW public.site_visitor_total AS
SELECT count(DISTINCT session_id)::bigint AS total
FROM public.site_events
WHERE name = 'page_view'
  AND label = 'home'
  AND path = '/'
  AND session_id IS NOT NULL;

GRANT SELECT ON public.site_visitor_total TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.record_site_visit(p_session_id text)
RETURNS bigint
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  visitor_total bigint;
BEGIN
  IF p_session_id IS NULL OR length(trim(p_session_id)) < 8 OR length(p_session_id) > 64 THEN
    RAISE EXCEPTION 'Invalid visitor session';
  END IF;

  INSERT INTO public.site_events (name, label, session_id, path)
  SELECT 'page_view', 'home', p_session_id, '/'
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.site_events
    WHERE name = 'page_view'
      AND label = 'home'
      AND path = '/'
      AND session_id = p_session_id
  );

  SELECT total INTO visitor_total
  FROM public.site_visitor_total;

  RETURN visitor_total;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_site_visit(text) TO anon, authenticated, service_role;
-- ==== 20260905020732_b65bacd8-6d22-4f4f-bddc-4f0c91a2b238.sql ====
DROP VIEW IF EXISTS public.site_visitor_total;

CREATE TABLE public.site_visitor_totals (
  id smallint PRIMARY KEY,
  total bigint NOT NULL DEFAULT 0 CHECK (total >= 0)
);

GRANT SELECT ON public.site_visitor_totals TO anon, authenticated;
GRANT ALL ON public.site_visitor_totals TO service_role;

ALTER TABLE public.site_visitor_totals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read the visitor total"
ON public.site_visitor_totals FOR SELECT TO anon, authenticated
USING (true);

INSERT INTO public.site_visitor_totals (id, total)
SELECT 1, count(DISTINCT session_id)
FROM public.site_events
WHERE name = 'page_view'
  AND label = 'home'
  AND path = '/'
  AND session_id IS NOT NULL;

CREATE TABLE public.site_visitor_sessions (
  session_id text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.site_visitor_sessions TO service_role;

ALTER TABLE public.site_visitor_sessions ENABLE ROW LEVEL SECURITY;

INSERT INTO public.site_visitor_sessions (session_id)
SELECT DISTINCT session_id
FROM public.site_events
WHERE name = 'page_view'
  AND label = 'home'
  AND path = '/'
  AND session_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.count_unique_site_visitor()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.name = 'page_view'
     AND NEW.label = 'home'
     AND NEW.path = '/'
     AND NEW.session_id IS NOT NULL
     AND length(NEW.session_id) BETWEEN 8 AND 64 THEN
    INSERT INTO public.site_visitor_sessions (session_id)
    VALUES (NEW.session_id)
    ON CONFLICT (session_id) DO NOTHING;

    IF FOUND THEN
      UPDATE public.site_visitor_totals
      SET total = total + 1
      WHERE id = 1;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.count_unique_site_visitor() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER site_events_count_unique_visitor
AFTER INSERT ON public.site_events
FOR EACH ROW
EXECUTE FUNCTION public.count_unique_site_visitor();

CREATE OR REPLACE FUNCTION public.record_site_visit(p_session_id text)
RETURNS bigint
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  visitor_total bigint;
BEGIN
  IF p_session_id IS NULL OR length(trim(p_session_id)) < 8 OR length(p_session_id) > 64 THEN
    RAISE EXCEPTION 'Invalid visitor session';
  END IF;

  INSERT INTO public.site_events (name, label, session_id, path)
  SELECT 'page_view', 'home', p_session_id, '/'
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.site_events
    WHERE name = 'page_view'
      AND label = 'home'
      AND path = '/'
      AND session_id = p_session_id
  );

  SELECT total INTO visitor_total
  FROM public.site_visitor_totals
  WHERE id = 1;

  RETURN COALESCE(visitor_total, 0);
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_site_visit(text) TO anon, authenticated, service_role;
-- ==== 20260905020755_0ecc307a-110b-48c3-b1f1-457ceb163aac.sql ====
CREATE POLICY "Backend can maintain visitor sessions"
ON public.site_visitor_sessions FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- ==== 20261004000000_lock_down_writes.sql ====
-- Visitors can read what is published and add new rows. They can never change or remove anything.
-- These privileges were never granted, so this is a safety net in case a future migration adds them by mistake.
REVOKE UPDATE, DELETE, TRUNCATE ON public.site_events FROM anon, authenticated;
REVOKE UPDATE, DELETE, TRUNCATE ON public.reviews FROM anon, authenticated;
REVOKE UPDATE, DELETE, TRUNCATE ON public.site_visitor_totals FROM anon, authenticated;
REVOKE ALL ON public.site_visitor_sessions FROM anon, authenticated;
