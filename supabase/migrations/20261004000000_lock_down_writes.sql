-- Visitors can read what is published and add new rows. They can never change or remove anything.
-- These privileges were never granted, so this is a safety net in case a future migration adds them by mistake.
REVOKE UPDATE, DELETE, TRUNCATE ON public.site_events FROM anon, authenticated;
REVOKE UPDATE, DELETE, TRUNCATE ON public.reviews FROM anon, authenticated;
REVOKE UPDATE, DELETE, TRUNCATE ON public.site_visitor_totals FROM anon, authenticated;
REVOKE ALL ON public.site_visitor_sessions FROM anon, authenticated;
