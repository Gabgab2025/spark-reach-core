import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PageContent {
  id: string;
  slug: string;
  title: string;
  content: any;
  meta_title?: string;
  meta_description?: string;
  status: 'draft' | 'published' | 'archived';
  page_type?: string;
  created_at: string;
  updated_at: string;
}

export const usePageContent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all pages (for admin)
  const { data: pages, isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PageContent[];
    },
  });

  // Fetch single page by slug (for public)
  const fetchPageBySlug = async (slug: string): Promise<PageContent | null> => {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) {
      console.error('Error fetching page:', error);
      return null;
    }
    return data;
  };

  // Create page mutation
  const createMutation = useMutation({
    mutationFn: async (pageData: Omit<PageContent, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('pages')
        .insert([pageData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      toast({
        title: "Success",
        description: "Page created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create page",
        variant: "destructive",
      });
    },
  });

  // Update page mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...pageData }: Partial<PageContent> & { id: string }) => {
      const { data, error } = await supabase
        .from('pages')
        .update(pageData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      toast({
        title: "Success",
        description: "Page updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update page",
        variant: "destructive",
      });
    },
  });

  // Delete page mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      toast({
        title: "Success",
        description: "Page deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete page",
        variant: "destructive",
      });
    },
  });

  return {
    pages,
    isLoading,
    fetchPageBySlug,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};