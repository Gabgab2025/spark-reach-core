/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export interface ContentBlock {
  id: string;
  name: string;
  label: string;
  block_type: string;
  content: Record<string, any> | null;
  status: 'draft' | 'published' | 'archived';
  sort_order: number;
  page_assignments: string[] | null;
  created_at: string;
  updated_at: string | null;
}

export const BLOCK_TYPES = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'text', label: 'Text / Rich Content' },
  { value: 'gallery', label: 'Image Gallery' },
  { value: 'cta', label: 'Call to Action' },
  { value: 'form', label: 'Form Section' },
  { value: 'stats', label: 'Statistics / Metrics' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'cards', label: 'Cards Grid' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'team', label: 'Team Members' },
  { value: 'faq', label: 'FAQ / Accordion' },
  { value: 'navigation', label: 'Navigation / Links' },
  { value: 'custom', label: 'Custom Block' },
] as const;

export const ASSIGNABLE_PAGES = [
  { slug: 'home', label: 'Home' },
  { slug: 'about', label: 'About' },
  { slug: 'services', label: 'Services' },
  { slug: 'blog', label: 'Blog' },
  { slug: 'careers', label: 'Careers' },
  { slug: 'gallery', label: 'Gallery' },
  { slug: 'contact', label: 'Contact' },
  { slug: 'header', label: 'Header' },
  { slug: 'footer', label: 'Footer' },
] as const;

export const useContentBlocks = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: blocks, isLoading } = useQuery({
    queryKey: ['content_blocks'],
    queryFn: async () => {
      const { data, error } = await api.get('/content_blocks');
      if (error) throw error;
      return data as ContentBlock[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (blockData: Omit<ContentBlock, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await api.post('/content_blocks', blockData);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content_blocks'] });
      toast({ title: 'Success', description: 'Block created successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to create block', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...blockData }: Partial<ContentBlock> & { id: string }) => {
      const { data, error } = await api.put(`/content_blocks/${id}`, blockData);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content_blocks'] });
      toast({ title: 'Success', description: 'Block updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to update block', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await api.delete(`/content_blocks/${id}`);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content_blocks'] });
      toast({ title: 'Success', description: 'Block deleted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to delete block', variant: 'destructive' });
    },
  });

  return {
    blocks,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};

/** Fetch published blocks assigned to a specific page/scope (e.g. 'header', 'footer'). */
export const useBlocksByPage = (pageSlug: string) => {
  const { data: blocks, isLoading } = useQuery({
    queryKey: ['content_blocks', 'page', pageSlug],
    queryFn: async () => {
      const { data, error } = await api.get('/content_blocks', {
        params: { page_slug: pageSlug, status: 'published' },
      });
      if (error) throw error;
      return data as ContentBlock[];
    },
    staleTime: 5 * 60 * 1000,
  });

  /** Helper: get the content of a block by its name (slug). */
  const getBlock = (name: string) =>
    blocks?.find((b) => b.name === name)?.content ?? null;

  return { blocks, isLoading, getBlock };
};
