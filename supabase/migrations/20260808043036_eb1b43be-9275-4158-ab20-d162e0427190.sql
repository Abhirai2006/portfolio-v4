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