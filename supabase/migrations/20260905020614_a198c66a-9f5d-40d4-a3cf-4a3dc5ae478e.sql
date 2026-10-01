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