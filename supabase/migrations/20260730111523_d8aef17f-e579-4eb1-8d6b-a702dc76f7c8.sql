-- EXAMINATIONS
CREATE TABLE public.exam_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_number TEXT NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  exam_series TEXT NOT NULL DEFAULT 'Primary Leaving Examination',
  exam_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  centre TEXT,
  subject TEXT,
  score NUMERIC NOT NULL DEFAULT 0,
  grade TEXT,
  status TEXT NOT NULL DEFAULT 'Registered',
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exam_registrations TO authenticated;
GRANT ALL ON public.exam_registrations TO service_role;
ALTER TABLE public.exam_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY exam_read ON public.exam_registrations FOR SELECT TO authenticated USING (true);
CREATE POLICY exam_write ON public.exam_registrations FOR ALL TO authenticated USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));
CREATE TRIGGER exam_touch BEFORE UPDATE ON public.exam_registrations FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- HUMAN RESOURCES
CREATE TABLE public.staff_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT NOT NULL,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL DEFAULT 'Posting',
  from_school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  to_school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'Pending',
  details TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff_actions TO authenticated;
GRANT ALL ON public.staff_actions TO service_role;
ALTER TABLE public.staff_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY hr_read ON public.staff_actions FOR SELECT TO authenticated USING (true);
CREATE POLICY hr_write ON public.staff_actions FOR ALL TO authenticated USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));
CREATE TRIGGER hr_touch BEFORE UPDATE ON public.staff_actions FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- FINANCE
CREATE TABLE public.budget_lines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  fiscal_year TEXT NOT NULL DEFAULT '2026/2027',
  category TEXT NOT NULL DEFAULT 'Capitation grant',
  funding_source TEXT NOT NULL DEFAULT 'Government of South Sudan',
  state TEXT,
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  allocated NUMERIC NOT NULL DEFAULT 0,
  spent NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Approved',
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.budget_lines TO authenticated;
GRANT ALL ON public.budget_lines TO service_role;
ALTER TABLE public.budget_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY fin_read ON public.budget_lines FOR SELECT TO authenticated USING (true);
CREATE POLICY fin_write ON public.budget_lines FOR ALL TO authenticated USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));
CREATE TRIGGER fin_touch BEFORE UPDATE ON public.budget_lines FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- DOCUMENTS
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Circular',
  directorate TEXT,
  issued_on DATE NOT NULL DEFAULT CURRENT_DATE,
  link TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  summary TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY doc_read ON public.documents FOR SELECT TO authenticated USING (true);
CREATE POLICY doc_write ON public.documents FOR ALL TO authenticated USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));
CREATE TRIGGER doc_touch BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- INSPECTIONS
CREATE TABLE public.inspections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT NOT NULL,
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  inspection_type TEXT NOT NULL DEFAULT 'Routine',
  inspector TEXT,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  score NUMERIC NOT NULL DEFAULT 0,
  rating TEXT NOT NULL DEFAULT 'Satisfactory',
  status TEXT NOT NULL DEFAULT 'Scheduled',
  findings TEXT,
  actions TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inspections TO authenticated;
GRANT ALL ON public.inspections TO service_role;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
CREATE POLICY insp_read ON public.inspections FOR SELECT TO authenticated USING (true);
CREATE POLICY insp_write ON public.inspections FOR ALL TO authenticated USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));
CREATE TRIGGER insp_touch BEFORE UPDATE ON public.inspections FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- CURRICULUM
CREATE TABLE public.curriculum_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  item_type TEXT NOT NULL DEFAULT 'Syllabus',
  subject TEXT NOT NULL DEFAULT 'English',
  class_level TEXT NOT NULL DEFAULT 'P1',
  edition_year INTEGER,
  publisher TEXT,
  copies_distributed INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Approved',
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.curriculum_items TO authenticated;
GRANT ALL ON public.curriculum_items TO service_role;
ALTER TABLE public.curriculum_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY curr_read ON public.curriculum_items FOR SELECT TO authenticated USING (true);
CREATE POLICY curr_write ON public.curriculum_items FOR ALL TO authenticated USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));
CREATE TRIGGER curr_touch BEFORE UPDATE ON public.curriculum_items FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- E-LEARNING
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT 'English',
  class_level TEXT NOT NULL DEFAULT 'P1',
  medium TEXT NOT NULL DEFAULT 'Radio',
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  language TEXT NOT NULL DEFAULT 'English',
  link TEXT,
  broadcast_date DATE,
  status TEXT NOT NULL DEFAULT 'Published',
  description TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO authenticated;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY lesson_read ON public.lessons FOR SELECT TO authenticated USING (true);
CREATE POLICY lesson_write ON public.lessons FOR ALL TO authenticated USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));
CREATE TRIGGER lesson_touch BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- INTEGRATIONS
CREATE TABLE public.integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  partner TEXT,
  purpose TEXT,
  direction TEXT NOT NULL DEFAULT 'Outbound',
  data_scope TEXT,
  endpoint TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  last_sync DATE,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.integrations TO authenticated;
GRANT ALL ON public.integrations TO service_role;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY integ_read ON public.integrations FOR SELECT TO authenticated USING (true);
CREATE POLICY integ_write ON public.integrations FOR ALL TO authenticated USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));
CREATE TRIGGER integ_touch BEFORE UPDATE ON public.integrations FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- FIELD REPORTS (MOBILE)
CREATE TABLE public.field_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT NOT NULL,
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  officer_name TEXT,
  state TEXT,
  report_type TEXT NOT NULL DEFAULT 'School visit',
  learners_present INTEGER NOT NULL DEFAULT 0,
  teachers_present INTEGER NOT NULL DEFAULT 0,
  reported_on DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Submitted',
  observations TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.field_reports TO authenticated;
GRANT ALL ON public.field_reports TO service_role;
ALTER TABLE public.field_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY field_read ON public.field_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY field_write ON public.field_reports FOR ALL TO authenticated USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));
CREATE TRIGGER field_touch BEFORE UPDATE ON public.field_reports FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- AUDIT LOG
CREATE TABLE public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID,
  actor_email TEXT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_read_admin ON public.audit_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY audit_insert ON public.audit_log FOR INSERT TO authenticated WITH CHECK (auth.uid() = actor_id);