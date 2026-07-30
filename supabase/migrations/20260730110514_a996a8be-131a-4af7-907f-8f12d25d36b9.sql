CREATE VIEW public.school_directory
WITH (security_invoker = false) AS
SELECT id, code, name, level, ownership, state, county, payam, latitude, longitude, accredited
FROM public.schools
WHERE status = 'Active';

GRANT SELECT ON public.school_directory TO anon, authenticated;