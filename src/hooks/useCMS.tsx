import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
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
  // Company Information
  company_overview_paragraph1?: string;
  company_overview_paragraph2?: string;
  company_founders_intro?: string;
  company_founders?: string[]; // Array of founder names
  
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
    const { data, error } = await api.get<CMSPage[]>('/pages');
    
    if (error) throw error;
    return data || [];
  };

  const createPage = async (pageData: Partial<CMSPage>): Promise<void> => {
    const { error } = await api.post('/pages', pageData);
    
    if (error) throw error;
    toast({ title: "Success", description: "Page created successfully" });
  };

  const updatePage = async (id: string, pageData: Partial<CMSPage>): Promise<void> => {
    const { error } = await api.put(`/pages/${id}`, pageData);
    
    if (error) throw error;
    toast({ title: "Success", description: "Page updated successfully" });
  };

  const deletePage = async (id: string): Promise<void> => {
    const { error } = await api.delete(`/pages/${id}`);
    
    if (error) throw error;
    toast({ title: "Success", description: "Page deleted successfully" });
  };

  // Services Management
  const getServices = async (): Promise<CMSService[]> => {
    const { data, error } = await api.get<CMSService[]>('/services');
    
    if (error) throw error;
    return data || [];
  };

  const createService = async (serviceData: Partial<CMSService>): Promise<void> => {
    const { error } = await api.post('/services', serviceData);
    
    if (error) throw error;
    toast({ title: "Success", description: "Service created successfully" });
  };

  const updateService = async (id: string, serviceData: Partial<CMSService>): Promise<void> => {
    const { error } = await api.put(`/services/${id}`, serviceData);
    
    if (error) throw error;
    toast({ title: "Success", description: "Service updated successfully" });
  };

  const deleteService = async (id: string): Promise<void> => {
    const { error } = await api.delete(`/services/${id}`);
    
    if (error) throw error;
    toast({ title: "Success", description: "Service deleted successfully" });
  };

  // Blog Posts Management
  const getBlogPosts = async (): Promise<CMSBlogPost[]> => {
    const { data, error } = await api.get<CMSBlogPost[]>('/blog_posts');
    
    if (error) throw error;
    return data || [];
  };

  const createBlogPost = async (postData: Partial<CMSBlogPost>): Promise<void> => {
    const { error } = await api.post('/blog_posts', postData);
    
    if (error) throw error;
    toast({ title: "Success", description: "Blog post created successfully" });
  };

  const updateBlogPost = async (id: string, postData: Partial<CMSBlogPost>): Promise<void> => {
    const { error } = await api.put(`/blog_posts/${id}`, postData);
    
    if (error) throw error;
    toast({ title: "Success", description: "Blog post updated successfully" });
  };

  const deleteBlogPost = async (id: string): Promise<void> => {
    const { error } = await api.delete(`/blog_posts/${id}`);
    
    if (error) throw error;
    toast({ title: "Success", description: "Blog post deleted successfully" });
  };

  // Job Listings Management
  const getJobListings = async (): Promise<CMSJobListing[]> => {
    const { data, error } = await api.get<CMSJobListing[]>('/job_listings');
    
    if (error) throw error;
    return data || [];
  };

  const createJobListing = async (jobData: Partial<CMSJobListing>): Promise<void> => {
    const { error } = await api.post('/job_listings', jobData);
    
    if (error) throw error;
    toast({ title: "Success", description: "Job listing created successfully" });
  };

  const updateJobListing = async (id: string, jobData: Partial<CMSJobListing>): Promise<void> => {
    const { error } = await api.put(`/job_listings/${id}`, jobData);
    
    if (error) throw error;
    toast({ title: "Success", description: "Job listing updated successfully" });
  };

  const deleteJobListing = async (id: string): Promise<void> => {
    const { error } = await api.delete(`/job_listings/${id}`);
    
    if (error) throw error;
    toast({ title: "Success", description: "Job listing deleted successfully" });
  };

  // Testimonials Management
  const getTestimonials = async (): Promise<CMSTestimonial[]> => {
    const { data, error } = await api.get<CMSTestimonial[]>('/testimonials');
    
    if (error) throw error;
    return data || [];
  };

  const createTestimonial = async (testimonialData: Partial<CMSTestimonial>): Promise<void> => {
    const { error } = await api.post('/testimonials', testimonialData);
    
    if (error) throw error;
    toast({ title: "Success", description: "Testimonial created successfully" });
  };

  const updateTestimonial = async (id: string, testimonialData: Partial<CMSTestimonial>): Promise<void> => {
    const { error } = await api.put(`/testimonials/${id}`, testimonialData);
    
    if (error) throw error;
    toast({ title: "Success", description: "Testimonial updated successfully" });
  };

  const deleteTestimonial = async (id: string): Promise<void> => {
    const { error } = await api.delete(`/testimonials/${id}`);
    
    if (error) throw error;
    toast({ title: "Success", description: "Testimonial deleted successfully" });
  };

  // Team Members Management
  const getTeamMembers = async (): Promise<CMSTeamMember[]> => {
    const { data, error } = await api.get<CMSTeamMember[]>('/team_members');
    
    if (error) throw error;
    return data || [];
  };

  const createTeamMember = async (memberData: Partial<CMSTeamMember>): Promise<void> => {
    const { error } = await api.post('/team_members', memberData);
    
    if (error) throw error;
    toast({ title: "Success", description: "Team member added successfully" });
  };

  const updateTeamMember = async (id: string, memberData: Partial<CMSTeamMember>): Promise<void> => {
    const { error } = await api.put(`/team_members/${id}`, memberData);
    
    if (error) throw error;
    toast({ title: "Success", description: "Team member updated successfully" });
  };

  const deleteTeamMember = async (id: string): Promise<void> => {
    const { error } = await api.delete(`/team_members/${id}`);
    
    if (error) throw error;
    toast({ title: "Success", description: "Team member removed successfully" });
  };

  // Analytics Data
  const getAnalyticsData = async (): Promise<AnalyticsData[]> => {
    const { data, error } = await api.get<AnalyticsData[]>('/analytics_data');
    
    if (error) throw error;
    return data || [];
  };

  const getAnalyticsByCategory = async (category: string): Promise<AnalyticsData[]> => {
    const { data, error } = await api.get<AnalyticsData[]>(`/analytics_data?category=${category}`);
    
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
        const { data, error } = await api.get<any[]>('/settings');
        
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
        // Note: This logic might need to be handled by the backend in a transaction
        const { error: updateError } = await api.post('/settings/bulk_update', { settings: settingsArray });
        
        if (updateError) throw updateError;
        
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