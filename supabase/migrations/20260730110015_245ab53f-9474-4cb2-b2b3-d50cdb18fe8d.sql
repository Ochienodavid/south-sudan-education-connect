-- ROLES ------------------------------------------------------------
CREATE TYPE public.app_role AS ENUM ('admin', 'officer', 'viewer');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  job_title TEXT,
  duty_station TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_read" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.can_write(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','officer'))
$$;

CREATE POLICY "roles_read" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "roles_admin_manage" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- new user handler ---------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE first_user BOOLEAN;
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''), NEW.email);

  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles) INTO first_user;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN first_user THEN 'admin'::public.app_role ELSE 'officer'::public.app_role END);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- SCHOOLS -----------------------------------------------------------
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  ownership TEXT NOT NULL DEFAULT 'Public',
  level TEXT NOT NULL DEFAULT 'Primary',
  state TEXT NOT NULL DEFAULT '',
  county TEXT,
  payam TEXT,
  head_teacher TEXT,
  phone TEXT,
  email TEXT,
  capacity INTEGER NOT NULL DEFAULT 0,
  latitude NUMERIC,
  longitude NUMERIC,
  accredited BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'Active',
  established_year INTEGER,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.schools TO authenticated;
GRANT ALL ON public.schools TO service_role;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "schools_read" ON public.schools FOR SELECT TO authenticated USING (true);
CREATE POLICY "schools_write" ON public.schools FOR ALL TO authenticated
  USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));
CREATE TRIGGER schools_touch BEFORE UPDATE ON public.schools FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- TEACHERS ----------------------------------------------------------
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT NOT NULL DEFAULT 'Male',
  date_of_birth DATE,
  national_id TEXT,
  phone TEXT,
  email TEXT,
  qualification TEXT NOT NULL DEFAULT 'Certificate',
  main_subject TEXT,
  employment_status TEXT NOT NULL DEFAULT 'Permanent',
  licence_number TEXT,
  licence_expiry DATE,
  grade_level TEXT,
  monthly_salary NUMERIC NOT NULL DEFAULT 0,
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  hire_date DATE,
  status TEXT NOT NULL DEFAULT 'Active',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teachers TO authenticated;
GRANT ALL ON public.teachers TO service_role;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "teachers_read" ON public.teachers FOR SELECT TO authenticated USING (true);
CREATE POLICY "teachers_write" ON public.teachers FOR ALL TO authenticated
  USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));
CREATE TRIGGER teachers_touch BEFORE UPDATE ON public.teachers FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- STUDENTS ----------------------------------------------------------
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT NOT NULL DEFAULT 'Male',
  date_of_birth DATE,
  class_level TEXT NOT NULL DEFAULT 'P1',
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  guardian_name TEXT,
  guardian_phone TEXT,
  county_of_origin TEXT,
  disability TEXT NOT NULL DEFAULT 'None',
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Enrolled',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "students_read" ON public.students FOR SELECT TO authenticated USING (true);
CREATE POLICY "students_write" ON public.students FOR ALL TO authenticated
  USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));
CREATE TRIGGER students_touch BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX idx_students_school ON public.students(school_id);
CREATE INDEX idx_teachers_school ON public.teachers(school_id);
