-- Create pages table for managing editable page content
CREATE TABLE public.pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  meta_title text,
  meta_description text,
  is_published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_pages_slug ON public.pages(slug);
CREATE INDEX idx_pages_published ON public.pages(is_published);

-- Enable Row Level Security
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Create policies - Allow public read access to published pages
CREATE POLICY "Allow public read access to published pages" 
ON public.pages 
FOR SELECT 
USING (is_published = true);

-- Create policies for admin management (assuming admin role exists)
CREATE POLICY "Allow admin full access to pages" 
ON public.pages 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_pages_updated_at();

-- Insert default page content for Home, About, and Contact pages
INSERT INTO public.pages (slug, title, content, meta_title, meta_description) VALUES
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
}', 'CallCenter Pro - Professional Solutions', 'Leading call center services for financial institutions with expert customer service and collections solutions.'),

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
}', 'About CallCenter Pro - Our Story', 'Learn about CallCenter Pro leadership, mission, values and our journey in transforming call center operations since 2010.'),

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
}', 'Contact CallCenter Pro - Get In Touch', 'Contact CallCenter Pro for expert call center solutions. Multiple ways to reach our team including phone, email and office locations.');