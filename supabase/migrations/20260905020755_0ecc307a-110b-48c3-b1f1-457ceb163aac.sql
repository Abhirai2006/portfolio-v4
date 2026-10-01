CREATE POLICY "Backend can maintain visitor sessions"
ON public.site_visitor_sessions FOR ALL TO service_role
USING (true)
WITH CHECK (true);