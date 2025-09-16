-- Update the pages table to support JSON content for editable pages
-- First, let's modify the content column to be JSONB for structured content
ALTER TABLE public.pages ALTER COLUMN content TYPE jsonb USING 
  CASE 
    WHEN content IS NULL OR content = '' THEN '{}'::jsonb
    ELSE json_build_object('content', content)::jsonb
  END;

-- Update existing content to structured format if any exists
UPDATE public.pages 
SET content = jsonb_build_object('content', content->>'content')
WHERE content IS NOT NULL AND content != '{}'::jsonb;

-- Add a new column for the page type to distinguish between regular pages and editable system pages
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS page_type text DEFAULT 'custom';

-- Update the table to mark system pages
UPDATE public.pages SET page_type = 'system' WHERE slug IN ('home', 'about', 'contact');

-- Insert or update the system pages with default content
INSERT INTO public.pages (slug, title, content, meta_title, meta_description, status, page_type) VALUES
('home', 'Home Page', '{
  "hero": {
    "title": "Professional Call Center Solutions",
    "subtitle": "Excellence in Service",
    "description": "Transforming customer service and collections for financial institutions with cutting-edge technology and expert human touch.",
    "cta_text": "Get Started Today",
    "cta_link": "/contact"
  },
  "services_title": "Our Services",
  "services_description": "Comprehensive call center solutions tailored for financial institutions"
}', 'CallCenter Pro - Professional Solutions', 'Leading call center services for financial institutions with expert customer service and collections solutions.', 'published', 'system')
ON CONFLICT (slug) DO UPDATE SET
  content = EXCLUDED.content,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  page_type = EXCLUDED.page_type;

INSERT INTO public.pages (slug, title, content, meta_title, meta_description, status, page_type) VALUES
('about', 'About Us', '{
  "hero": {
    "title": "About CallCenter Pro",
    "description": "Since 2010, we have been transforming customer service and collections for financial institutions with innovative technology and exceptional expertise."
  },
  "mission": {
    "title": "Empowering Financial Success",
    "description": "To empower financial institutions with world-class call center and collections services that enhance customer relationships while maximizing recovery rates through innovative technology and expert human touch."
  },
  "vision": {
    "title": "Leading the Future", 
    "description": "To be the global leader in AI-powered customer service and collections solutions, setting industry standards for efficiency, compliance, and customer satisfaction."
  },
  "values": [
    {
      "title": "Integrity",
      "description": "Unwavering commitment to ethical practices and transparency"
    },
    {
      "title": "Excellence", 
      "description": "Delivering superior results through continuous improvement"
    },
    {
      "title": "Partnership",
      "description": "Building lasting relationships with clients and team members"
    },
    {
      "title": "Innovation",
      "description": "Embracing cutting-edge technology and forward-thinking solutions"
    }
  ]
}', 'About CallCenter Pro - Our Story', 'Learn about CallCenter Pro leadership, mission, values and our journey in transforming call center operations since 2010.', 'published', 'system')
ON CONFLICT (slug) DO UPDATE SET
  content = EXCLUDED.content,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  page_type = EXCLUDED.page_type;

INSERT INTO public.pages (slug, title, content, meta_title, meta_description, status, page_type) VALUES
('contact', 'Contact Us', '{
  "hero": {
    "title": "Contact Us",
    "description": "Ready to transform your call center operations? Get in touch with our experts and discover how we can help drive your business forward."
  },
  "contact_info": {
    "phone": {
      "main": "1-800-CALL-PRO",
      "sales": "1-800-555-0123",
      "support": "1-800-555-0124"
    },
    "email": {
      "general": "info@callcenterpro.com",
      "sales": "sales@callcenterpro.com", 
      "support": "support@callcenterpro.com"
    },
    "address": {
      "street": "123 Business Center Drive",
      "city": "New York, NY 10001",
      "hours": "Mon-Fri: 8:00 AM - 6:00 PM EST"
    }
  },
  "form": {
    "title": "Send Us a Message",
    "description": "Fill out the form below and our team will get back to you within 24 hours."
  }
}', 'Contact CallCenter Pro - Get In Touch', 'Contact CallCenter Pro for expert call center solutions. Multiple ways to reach our team including phone, email and office locations.', 'published', 'system')
ON CONFLICT (slug) DO UPDATE SET
  content = EXCLUDED.content,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  page_type = EXCLUDED.page_type;