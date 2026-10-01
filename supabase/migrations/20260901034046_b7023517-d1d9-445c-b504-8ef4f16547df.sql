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