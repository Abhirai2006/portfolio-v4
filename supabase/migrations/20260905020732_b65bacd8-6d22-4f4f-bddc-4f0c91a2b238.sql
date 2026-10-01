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