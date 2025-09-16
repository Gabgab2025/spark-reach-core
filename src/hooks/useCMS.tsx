import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  author_id?: string;
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
    getDashboardStats
  };
};