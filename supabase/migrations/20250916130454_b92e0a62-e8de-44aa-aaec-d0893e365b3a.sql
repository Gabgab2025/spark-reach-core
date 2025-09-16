-- Create enum types for content management
CREATE TYPE page_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE service_category AS ENUM ('call_center', 'bank_collections', 'consulting');
CREATE TYPE team_role AS ENUM ('ceo', 'cto', 'manager', 'supervisor', 'agent', 'admin');
CREATE TYPE job_status AS ENUM ('open', 'closed', 'on_hold');

-- Pages table for website content management
CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  featured_image TEXT,
  status page_status NOT NULL DEFAULT 'draft',
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Services table for call center and bank collection services
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category service_category NOT NULL,
  features TEXT[], -- Array of service features
  pricing_info TEXT,
  icon TEXT, -- Icon name from lucide-react
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Blog posts table for SEO content
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[],
  status page_status NOT NULL DEFAULT 'draft',
  author_id UUID REFERENCES auth.users(id),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Job listings table for careers
CREATE TABLE public.job_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  employment_type TEXT, -- full-time, part-time, contract
  description TEXT,
  requirements TEXT[],
  benefits TEXT[],
  salary_range TEXT,
  status job_status NOT NULL DEFAULT 'open',
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Testimonials table for client feedback
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_title TEXT,
  company_name TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Team members table for staff profiles
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role team_role NOT NULL,
  title TEXT, -- Job title like "Senior Call Center Manager"
  bio TEXT,
  avatar_url TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_leadership BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Media library table for asset management
CREATE TABLE public.media_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  file_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Analytics data table for metrics tracking
CREATE TABLE public.analytics_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT, -- 'website', 'calls', 'leads', 'revenue'
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public content (readable by everyone)
CREATE POLICY "Public can view published pages" ON public.pages
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view services" ON public.services
  FOR SELECT USING (true);

CREATE POLICY "Public can view published blog posts" ON public.blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view open job listings" ON public.job_listings
  FOR SELECT USING (status = 'open');

CREATE POLICY "Public can view testimonials" ON public.testimonials
  FOR SELECT USING (true);

CREATE POLICY "Public can view team members" ON public.team_members
  FOR SELECT USING (true);

CREATE POLICY "Public can view media" ON public.media_library
  FOR SELECT USING (true);

-- Admin policies for full CRUD operations
CREATE POLICY "Admins can manage pages" ON public.pages
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage blog posts" ON public.blog_posts
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage job listings" ON public.job_listings
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage testimonials" ON public.testimonials
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage team members" ON public.team_members
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage media" ON public.media_library
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view analytics" ON public.analytics_data
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at timestamps
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_listings_updated_at
  BEFORE UPDATE ON public.job_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.services (title, slug, description, category, features, icon, is_featured) VALUES
('Inbound Call Center', 'inbound-call-center', 'Professional inbound call handling services for customer support and sales.', 'call_center', ARRAY['24/7 Support', 'Multilingual Agents', 'CRM Integration', 'Quality Monitoring'], 'Phone', true),
('Outbound Collections', 'outbound-collections', 'Specialized debt collection services for banks and financial institutions.', 'bank_collections', ARRAY['Regulatory Compliance', 'Automated Dialing', 'Payment Processing', 'Detailed Reporting'], 'CreditCard', true),
('Customer Service', 'customer-service', 'Comprehensive customer service solutions across multiple channels.', 'call_center', ARRAY['Omnichannel Support', 'Live Chat', 'Email Support', 'Social Media'], 'Headphones', false);

INSERT INTO public.testimonials (client_name, client_title, company_name, content, rating, is_featured) VALUES
('Sarah Johnson', 'Operations Director', 'Metro Bank', 'CallCenter Pro transformed our customer service operations. Response times improved by 60% and customer satisfaction is at an all-time high.', 5, true),
('Michael Chen', 'VP Collections', 'First National Credit', 'Their collections expertise helped us recover 40% more outstanding debt while maintaining compliance standards.', 5, true),
('Lisa Rodriguez', 'Customer Experience Manager', 'TechCorp Solutions', 'Professional, reliable, and results-driven. Our partnership with CallCenter Pro has been exceptional.', 5, false);

INSERT INTO public.team_members (name, role, title, bio, is_leadership) VALUES
('David Thompson', 'ceo', 'Chief Executive Officer', 'With over 15 years in call center operations, David leads our strategic vision and growth initiatives.', true),
('Maria Garcia', 'cto', 'Chief Technology Officer', 'Technology innovator focused on implementing cutting-edge solutions for optimal client outcomes.', true),
('James Wilson', 'manager', 'Operations Manager', 'Experienced operations professional ensuring quality service delivery across all client accounts.', true);

INSERT INTO public.blog_posts (title, slug, excerpt, content, status, meta_title, meta_description, tags, published_at) VALUES
('Best Practices for Call Center Management', 'call-center-best-practices', 'Essential strategies for optimizing call center performance and customer satisfaction.', 'Comprehensive guide covering agent training, technology integration, and performance metrics...', 'published', 'Call Center Management Best Practices | CallCenter Pro', 'Learn proven strategies for call center success including agent training, technology, and KPIs.', ARRAY['call center', 'management', 'best practices'], now()),
('Debt Collection Compliance Guidelines', 'debt-collection-compliance', 'Understanding regulatory requirements for professional debt collection services.', 'Detailed overview of FDCPA, state regulations, and compliance best practices...', 'published', 'Debt Collection Compliance Guide | CallCenter Pro', 'Essential compliance guidelines for professional debt collection services and regulations.', ARRAY['debt collection', 'compliance', 'regulations'], now());

INSERT INTO public.job_listings (title, department, location, employment_type, description, requirements, benefits, salary_range, status) VALUES
('Senior Call Center Agent', 'Operations', 'Remote/Hybrid', 'full-time', 'Join our team as a Senior Call Center Agent and help deliver exceptional customer service.', ARRAY['3+ years call center experience', 'Excellent communication skills', 'CRM software proficiency'], ARRAY['Health insurance', 'Dental coverage', 'Retirement plan', 'Professional development'], '$35,000 - $45,000', 'open'),
('Collections Specialist', 'Collections', 'New York, NY', 'full-time', 'Experienced collections professional to join our specialized debt recovery team.', ARRAY['Collections experience required', 'Knowledge of FDCPA regulations', 'Strong negotiation skills'], ARRAY['Competitive salary', 'Performance bonuses', 'Health benefits', 'Career advancement'], '$40,000 - $55,000', 'open');

-- Insert analytics sample data
INSERT INTO public.analytics_data (metric_name, metric_value, category, metadata) VALUES
('website_visitors', 12580, 'website', '{"source": "google_analytics"}'),
('total_calls', 45620, 'calls', '{"period": "monthly"}'),
('customer_satisfaction', 98.5, 'calls', '{"scale": "percentage"}'),
('lead_conversion', 23.8, 'leads', '{"conversion_rate": "percentage"}'),
('revenue_growth', 15.2, 'revenue', '{"period": "quarterly", "currency": "USD"}');