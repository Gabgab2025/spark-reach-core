import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content?: any; // Changed to any to support JSONB content
  meta_title?: string;
  meta_description?: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  author_id?: string;
  page_type?: string; // Added page_type field
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface CMSService {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category: 'call_center' | 'bank_collections' | 'consulting';
  features?: string[];
  pricing_info?: string;
  icon?: string;
  image_url?: string;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CMSBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  author_id?: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface CMSJobListing {
  id: string;
  title: string;
  department?: string;
  location?: string;
  employment_type?: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  salary_range?: string;
  status: 'open' | 'closed' | 'on_hold';
  applications_count: number;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface CMSTestimonial {
  id: string;
  client_name: string;
  client_title?: string;
  company_name?: string;
  content: string;
  rating?: number;
  avatar_url?: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CMSTeamMember {
  id: string;
  name: string;
  role: 'ceo' | 'cto' | 'manager' | 'supervisor' | 'agent' | 'admin';
  title?: string;
  bio?: string;
  avatar_url?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  sort_order: number;
  is_leadership: boolean;
  created_at: string;
  updated_at: string;
}

export interface CMSSettings {
  // Maps
  google_maps_api_key?: string;
  
  // Security
  email_otp_enabled?: boolean;
  recaptcha_site_key?: string;
  recaptcha_secret_key?: string;
  logging_enabled?: boolean;
  audit_logging_enabled?: boolean;
  
  // SEO
  google_analytics_code?: string;
  google_tag_manager_code?: string;
  google_search_console_code?: string;
  bing_webmaster_code?: string;
  sitemap_enabled?: boolean;
  robots_txt_content?: string;
  meta_pixel_code?: string;
  
  // Code Embedding
  chat_widget_code?: string;
  custom_head_code?: string;
  custom_body_code?: string;
  third_party_integrations?: string;
}

export interface AnalyticsData {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_date: string;
  category?: string;
  metadata?: any;
  created_at: string;
}

export const useCMS = () => {
  const { toast } = useToast();

  // Pages Management
  const getPages = async (): Promise<CMSPage[]> => {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  };

  const createPage = async (pageData: Partial<CMSPage>): Promise<void> => {
    const { error } = await supabase
      .from('pages')
      .insert(pageData as any);
    
    if (error) throw error;
    toast({ title: "Success", description: "Page created successfully" });
  };

  const updatePage = async (id: string, pageData: Partial<CMSPage>): Promise<void> => {
    const { error } = await supabase
      .from('pages')
      .update(pageData as any)
      .eq('id', id);
    
    if (error) throw error;
    toast({ title: "Success", description: "Page updated successfully" });
  };

  const deletePage = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast({ title: "Success", description: "Page deleted successfully" });
  };

  // Services Management
  const getServices = async (): Promise<CMSService[]> => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  };

  const createService = async (serviceData: Partial<CMSService>): Promise<void> => {
    const { error } = await supabase
      .from('services')
      .insert(serviceData as any);
    
    if (error) throw error;
    toast({ title: "Success", description: "Service created successfully" });
  };

  const updateService = async (id: string, serviceData: Partial<CMSService>): Promise<void> => {
    const { error } = await supabase
      .from('services')
      .update(serviceData as any)
      .eq('id', id);
    
    if (error) throw error;
    toast({ title: "Success", description: "Service updated successfully" });
  };

  const deleteService = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast({ title: "Success", description: "Service deleted successfully" });
  };

  // Blog Posts Management
  const getBlogPosts = async (): Promise<CMSBlogPost[]> => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  };

  const createBlogPost = async (postData: Partial<CMSBlogPost>): Promise<void> => {
    const { error } = await supabase
      .from('blog_posts')
      .insert(postData as any);
    
    if (error) throw error;
    toast({ title: "Success", description: "Blog post created successfully" });
  };

  const updateBlogPost = async (id: string, postData: Partial<CMSBlogPost>): Promise<void> => {
    const { error } = await supabase
      .from('blog_posts')
      .update(postData as any)
      .eq('id', id);
    
    if (error) throw error;
    toast({ title: "Success", description: "Blog post updated successfully" });
  };

  const deleteBlogPost = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast({ title: "Success", description: "Blog post deleted successfully" });
  };

  // Job Listings Management
  const getJobListings = async (): Promise<CMSJobListing[]> => {
    const { data, error } = await supabase
      .from('job_listings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  };

  const createJobListing = async (jobData: Partial<CMSJobListing>): Promise<void> => {
    const { error } = await supabase
      .from('job_listings')
      .insert(jobData as any);
    
    if (error) throw error;
    toast({ title: "Success", description: "Job listing created successfully" });
  };

  const updateJobListing = async (id: string, jobData: Partial<CMSJobListing>): Promise<void> => {
    const { error } = await supabase
      .from('job_listings')
      .update(jobData as any)
      .eq('id', id);
    
    if (error) throw error;
    toast({ title: "Success", description: "Job listing updated successfully" });
  };

  const deleteJobListing = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('job_listings')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast({ title: "Success", description: "Job listing deleted successfully" });
  };

  // Testimonials Management
  const getTestimonials = async (): Promise<CMSTestimonial[]> => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  };

  const createTestimonial = async (testimonialData: Partial<CMSTestimonial>): Promise<void> => {
    const { error } = await supabase
      .from('testimonials')
      .insert(testimonialData as any);
    
    if (error) throw error;
    toast({ title: "Success", description: "Testimonial created successfully" });
  };

  const updateTestimonial = async (id: string, testimonialData: Partial<CMSTestimonial>): Promise<void> => {
    const { error } = await supabase
      .from('testimonials')
      .update(testimonialData as any)
      .eq('id', id);
    
    if (error) throw error;
    toast({ title: "Success", description: "Testimonial updated successfully" });
  };

  const deleteTestimonial = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast({ title: "Success", description: "Testimonial deleted successfully" });
  };

  // Team Members Management
  const getTeamMembers = async (): Promise<CMSTeamMember[]> => {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  };

  const createTeamMember = async (memberData: Partial<CMSTeamMember>): Promise<void> => {
    const { error } = await supabase
      .from('team_members')
      .insert(memberData as any);
    
    if (error) throw error;
    toast({ title: "Success", description: "Team member added successfully" });
  };

  const updateTeamMember = async (id: string, memberData: Partial<CMSTeamMember>): Promise<void> => {
    const { error } = await supabase
      .from('team_members')
      .update(memberData as any)
      .eq('id', id);
    
    if (error) throw error;
    toast({ title: "Success", description: "Team member updated successfully" });
  };

  const deleteTeamMember = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast({ title: "Success", description: "Team member removed successfully" });
  };

  // Analytics Data
  const getAnalyticsData = async (): Promise<AnalyticsData[]> => {
    const { data, error } = await supabase
      .from('analytics_data')
      .select('*')
      .order('metric_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  };

  const getAnalyticsByCategory = async (category: string): Promise<AnalyticsData[]> => {
    const { data, error } = await supabase
      .from('analytics_data')
      .select('*')
      .eq('category', category)
      .order('metric_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  };

  // Dashboard Statistics
  const getDashboardStats = async () => {
    try {
      const [pages, services, blogPosts, jobListings, testimonials, teamMembers] = await Promise.all([
        getPages(),
        getServices(),
        getBlogPosts(),
        getJobListings(),
        getTestimonials(),
        getTeamMembers()
      ]);

      return {
        pages: pages.length,
        services: services.length,
        blogPosts: blogPosts.length,
        jobListings: jobListings.filter(job => job.status === 'open').length,
        testimonials: testimonials.length,
        teamMembers: teamMembers.length,
        publishedPages: pages.filter(page => page.status === 'published').length,
        draftPages: pages.filter(page => page.status === 'draft').length,
        featuredServices: services.filter(service => service.is_featured).length
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  };

  return {
    // Pages
    getPages,
    createPage,
    updatePage,
    deletePage,
    
    // Services
    getServices,
    createService,
    updateService,
    deleteService,
    
    // Blog Posts
    getBlogPosts,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    
    // Job Listings
    getJobListings,
    createJobListing,
    updateJobListing,
    deleteJobListing,
    
    // Testimonials
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    
    // Team Members
    getTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    
    // Analytics
    getAnalyticsData,
    getAnalyticsByCategory,
    
    // Dashboard
    getDashboardStats,
    
    // Settings
    getSettings: async (): Promise<CMSSettings> => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*');
        
        if (error) throw error;
        
        // Convert array of key-value pairs to object
        const settingsObject: any = {};
        data?.forEach(setting => {
          if (setting.key && setting.value) {
            try {
              // Try to parse JSON values
              settingsObject[setting.key] = JSON.parse(setting.value);
            } catch {
              // If not JSON, store as string
              settingsObject[setting.key] = setting.value;
            }
          }
        });
        
        return settingsObject;
      } catch (error) {
        console.error('Error fetching settings:', error);
        return {};
      }
    },
    
    updateSettings: async (settings: CMSSettings): Promise<void> => {
      try {
        // Convert settings object to key-value pairs for database storage
        const settingsArray = Object.entries(settings).map(([key, value]) => ({
          key,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value || '')
        }));
        
        // Delete existing settings and insert new ones
        const { error: deleteError } = await supabase
          .from('settings')
          .delete()
          .gte('created_at', '1900-01-01'); // Delete all existing settings
        
        if (deleteError) throw deleteError;
        
        // Insert new settings
        if (settingsArray.length > 0) {
          const { error: insertError } = await supabase
            .from('settings')
            .insert(settingsArray);
          
          if (insertError) throw insertError;
        }
        
        toast({
          title: "Settings Updated",
          description: "All settings have been saved successfully",
        });
      } catch (error) {
        console.error('Error updating settings:', error);
        toast({
          title: "Error",
          description: "Failed to update settings",
          variant: "destructive",
        });
        throw error;
      }
    }
  };
};