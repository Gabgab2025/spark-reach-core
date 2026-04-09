/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DOMPurify from 'dompurify';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Edit, Trash2, Plus, Eye, Calendar, Globe, Star, MapPin,
  Users, Briefcase, MessageSquare, Building, Target, FileText, Layout, Mail, Settings,
  ChevronLeft, ChevronRight, UserPlus, Search
} from 'lucide-react';
import { useCMS, CMSPage, CMSService, CMSBlogPost, CMSJobListing, CMSTestimonial, CMSTeamMember, CMSGalleryItem } from '@/hooks/useCMS';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SettingsManager from './SettingsManager';
import ImageUpload from './ImageUpload';
import { useNavigate } from 'react-router-dom';

interface CMSContentManagerProps {
  contentType: 'pages' | 'services' | 'blog' | 'careers' | 'testimonials' | 'team' | 'gallery' | 'settings';
}

/** Generic CMS item — union of all content types with common fields */
type CMSItem = (CMSPage | CMSService | CMSBlogPost | CMSJobListing | CMSTestimonial | CMSTeamMember | CMSGalleryItem) & Record<string, unknown>;

const ADMIN_ITEMS_PER_PAGE = 10;

const CMSContentManager = ({ contentType }: CMSContentManagerProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [tablePage, setTablePage] = useState(1);
  const [userPickerOpen, setUserPickerOpen] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  const cms = useCMS();

  const contentConfig = {
    pages: {
      title: 'Pages',
      description: 'Manage website pages and content blocks',
      icon: Layout,
      fields: ['title', 'slug', 'status', 'meta_title', 'meta_description', 'page_blocks', 'content'],
      fetchFn: cms.getPages,
      createFn: cms.createPage,
      updateFn: cms.updatePage,
      deleteFn: cms.deletePage
    },
    settings: {
      title: 'Settings',
      description: 'Configure website settings and API keys',
      icon: Settings,
      fields: [],
      fetchFn: () => cms.getSettings(),
      createFn: () => Promise.resolve(),
      updateFn: (id: string, data: any) => cms.updateSettings(data),
      deleteFn: () => Promise.resolve()
    },
    services: {
      title: 'Services',
      description: 'Call center and collections services',
      icon: Target,
      fields: ['title', 'slug', 'category', 'description', 'features', 'pricing_info', 'icon', 'image_url', 'is_featured', 'sort_order'],
      fetchFn: cms.getServices,
      createFn: cms.createService,
      updateFn: cms.updateService,
      deleteFn: cms.deleteService
    },
    blog: {
      title: 'Blog Posts',
      description: 'News and industry insights',
      icon: MessageSquare,
      fields: ['title', 'slug', 'excerpt', 'status', 'tags', 'featured_image', 'meta_title', 'meta_description', 'content'],
      fetchFn: cms.getBlogPosts,
      createFn: cms.createBlogPost,
      updateFn: cms.updateBlogPost,
      deleteFn: cms.deleteBlogPost
    },
    careers: {
      title: 'Job Listings',
      description: 'Open positions and hiring',
      icon: Building,
      fields: ['title', 'department', 'location', 'address', 'employment_type', 'status', 'salary_type', 'salary_range', 'requirements', 'benefits', 'expires_at', 'description'],
      fetchFn: cms.getJobListings,
      createFn: cms.createJobListing,
      updateFn: cms.updateJobListing,
      deleteFn: cms.deleteJobListing
    },
    testimonials: {
      title: 'Testimonials',
      description: 'Client feedback and reviews',
      icon: Star,
      fields: ['client_name', 'company_name', 'client_title', 'content', 'rating', 'avatar_url', 'is_featured', 'sort_order'],
      fetchFn: cms.getTestimonials,
      createFn: cms.createTestimonial,
      updateFn: cms.updateTestimonial,
      deleteFn: cms.deleteTestimonial
    },
    team: {
      title: 'Team Members',
      description: 'Leadership and staff profiles',
      icon: Users,
      fields: ['name', 'title', 'role', 'tagline', 'bio', 'quote', 'expertise', 'achievements', 'email', 'phone', 'avatar_url', 'cover_image_url', 'linkedin_url', 'website_url', 'github_url', 'twitter_url', 'is_leadership', 'sort_order'],
      fetchFn: cms.getTeamMembers,
      createFn: cms.createTeamMember,
      updateFn: cms.updateTeamMember,
      deleteFn: cms.deleteTeamMember
    },
    gallery: {
      title: 'Gallery',
      description: 'Manage gallery images and photos',
      icon: Globe,
      fields: ['title', 'image_url', 'alt_text', 'caption', 'category', 'status', 'is_featured', 'sort_order'],
      fetchFn: cms.getGalleryItems,
      createFn: cms.createGalleryItem,
      updateFn: cms.updateGalleryItem,
      deleteFn: cms.deleteGalleryItem
    }
  };

  const pageBlocks = [
    { id: 'header', name: 'Header', description: 'Site navigation and branding' },
    { id: 'hero', name: 'Hero Section', description: 'Main banner with call-to-action' },
    { id: 'services', name: 'Featured Services', description: 'Showcase key services' },
    { id: 'testimonials', name: 'Testimonials', description: 'Client reviews and feedback' },
    { id: 'team', name: 'Team Section', description: 'Leadership and staff profiles' },
    { id: 'contact', name: 'Contact Form', description: 'Contact information and form' },
    { id: 'footer', name: 'Footer', description: 'Site links and information' }
  ];

  const config = contentConfig[contentType] ?? contentConfig['pages'];

  // Use React Query for data fetching with caching — hooks MUST be unconditional
  const { data = [], isLoading } = useQuery({
    queryKey: ['cms', contentType],
    queryFn: config.fetchFn as () => Promise<unknown[]>,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    enabled: contentType !== 'settings',
  });

  // Fetch system users for "Create from User" (team only)
  const { data: systemUsers = [] } = useQuery({
    queryKey: ['admin', 'users-for-team'],
    queryFn: async (): Promise<any[]> => {
      const { data, error } = await api.get('/admin/users');
      if (error) return [];
      return (data as any[]) ?? [];
    },
    staleTime: 5 * 60 * 1000,
    enabled: contentType === 'team',
  });

  // Reset to page 1 when content type changes
  useEffect(() => { setTablePage(1); }, [contentType]);

  // Pagination for admin table
  const totalTablePages = Math.max(1, Math.ceil((data as CMSItem[]).length / ADMIN_ITEMS_PER_PAGE));
  const paginatedData = useMemo(
    () => (data as CMSItem[]).slice((tablePage - 1) * ADMIN_ITEMS_PER_PAGE, tablePage * ADMIN_ITEMS_PER_PAGE),
    [data, tablePage]
  );

  // Mutation for creating items
  const createMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (data: any) => config.createFn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', contentType] });
      queryClient.invalidateQueries({ queryKey: ['cms', 'dashboard-stats'] });
      setDialogOpen(false);
      toast({ title: "Success", description: `${config.title.slice(0, -1)} created successfully` });
    },
    onError: (error) => {
      console.error('Error creating:', error);
      toast({ title: "Error", description: "Failed to create item", variant: "destructive" });
    }
  });

  // Mutation for updating items
  const updateMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ id, data }: { id: string; data: any }) => config.updateFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', contentType] });
      setDialogOpen(false);
      toast({ title: "Success", description: `${config.title.slice(0, -1)} updated successfully` });
    },
    onError: (error) => {
      console.error('Error updating:', error);
      toast({ title: "Error", description: "Failed to update item", variant: "destructive" });
    }
  });

  // Mutation for deleting items
  const deleteMutation = useMutation({
    mutationFn: config.deleteFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', contentType] });
      queryClient.invalidateQueries({ queryKey: ['cms', 'dashboard-stats'] });
      toast({ title: "Success", description: `${config.title.slice(0, -1)} deleted successfully` });
    },
    onError: (error) => {
      console.error('Error deleting:', error);
      toast({ title: "Error", description: "Failed to delete item", variant: "destructive" });
    }
  });

  // Special handling for settings — AFTER all hooks
  if (contentType === 'settings') {
    return <SettingsManager />;
  }

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({});
    setSelectedBlocks([]);
    setDialogOpen(true);
  };

  const handleCreateFromUser = (user: any) => {
    setEditingItem(null);
    setFormData({
      name: user.full_name || '',
      email: user.email || '',
      avatar_url: user.avatar_url || '',
      role: user.role === 'admin' ? 'admin' : 'agent',
      title: user.role === 'admin' ? 'Administrator' : '',
    });
    setSelectedBlocks([]);
    setUserPickerOpen(false);
    setUserSearch('');
    setDialogOpen(true);
  };

  // Filter system users for picker (exclude those already team members)
  const existingTeamEmails = new Set((data as CMSItem[]).map(m => (m as any).email?.toLowerCase()).filter(Boolean));
  const filteredSystemUsers = (systemUsers as any[])
    .filter((u: any) => {
      const q = userSearch.toLowerCase();
      const matchesSearch = !q || (u.full_name ?? '').toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const notAlreadyTeamMember = !existingTeamEmails.has(u.email?.toLowerCase());
      return matchesSearch && notAlreadyTeamMember;
    });

  const handleEdit = (item: CMSItem) => {
    setEditingItem(item);
    setFormData(item);
    setSelectedBlocks((item.page_blocks as string[]) || []);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const dataToSave = {
      ...formData,
      ...(contentType === 'pages' && { page_blocks: selectedBlocks })
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: dataToSave });
    } else {
      createMutation.mutate(dataToSave);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteMutation.mutate(id);
    }
  };

  const handlePreview = (item: CMSItem) => {
    // For published content, redirect to actual page
    if (item.status === 'published' || item.status === 'open' || contentType === 'services') {
      let targetUrl = '';

      switch (contentType) {
        case 'pages':
          targetUrl = `/${item.slug}`;
          break;
        case 'blog':
          targetUrl = `/blog/${item.slug}`;
          break;
        case 'services':
          targetUrl = `/service/${item.slug}`;
          break;
        case 'careers':
          targetUrl = `/job/${item.id}`;
          break;
        case 'testimonials':
          targetUrl = `/about`;
          break;
        case 'team': {
          const teamSlug = item.slug || (item.name ? String(item.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : item.id);
          targetUrl = `/team/${teamSlug}`;
          break;
        }
        case 'gallery':
          targetUrl = '/gallery';
          break;
        default:
          targetUrl = '/';
      }

      // Navigate within the SPA to avoid full reload/auth-bridge
      console.debug('[CMS] Preview navigating to:', targetUrl, 'for type:', contentType, 'item:', item?.slug || item?.id);
      navigate(targetUrl);
      return;
    }

    // For draft content, show preview modal
    let previewContent = '';

    switch (contentType as 'pages' | 'services' | 'blog' | 'careers' | 'testimonials' | 'team') {
      case 'pages':
        previewContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview: ${item.title}</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
              h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
              .meta { color: #666; margin-bottom: 20px; background: #f8f9fa; padding: 15px; border-radius: 5px; }
              .content { background: white; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px; }
              .draft-notice { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="draft-notice">
              <strong>⚠️ Draft Preview</strong> - This content is not published yet.
            </div>
            <h1>${item.title}</h1>
            <div class="meta">
              <strong>Slug:</strong> /${item.slug} | <strong>Status:</strong> ${item.status}
              ${item.meta_description ? `<br><strong>Meta Description:</strong> ${item.meta_description}` : ''}
            </div>
            <div class="content">${item.content || 'No content available'}</div>
          </body>
          </html>
        `;
        break;
      case 'blog':
        previewContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview: ${item.title}</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
              h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
              .meta { color: #666; margin-bottom: 20px; background: #f8f9fa; padding: 15px; border-radius: 5px; }
              .excerpt { font-size: 18px; color: #555; font-style: italic; background: #e9ecef; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
              .content { background: white; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px; }
              .draft-notice { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="draft-notice">
              <strong>⚠️ Draft Preview</strong> - This blog post is not published yet.
            </div>
            <h1>${item.title}</h1>
            <div class="meta">
              <strong>Status:</strong> ${item.status} | <strong>Tags:</strong> ${Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || 'None'}
            </div>
            ${item.excerpt ? `<div class="excerpt">${item.excerpt}</div>` : ''}
            <div class="content">${item.content || 'No content available'}</div>
          </body>
          </html>
        `;
        break;
      case 'services':
        previewContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview: ${item.title}</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
              h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
              .meta { color: #666; margin-bottom: 20px; background: #f8f9fa; padding: 15px; border-radius: 5px; }
              .features { background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }
              .features ul { margin: 10px 0; padding-left: 20px; }
              .pricing { background: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745; }
            </style>
          </head>
          <body>
            <h1>${item.title}</h1>
            <div class="meta">
              <strong>Category:</strong> ${item.category} ${item.is_featured ? '| ⭐ Featured' : ''}
              ${item.sort_order ? `| <strong>Sort Order:</strong> ${item.sort_order}` : ''}
            </div>
            <div>${item.description || 'No description available'}</div>
            ${item.features && Array.isArray(item.features) && item.features.length > 0 ?
            `<div class="features">
                <h3>Features:</h3>
                <ul>
                  ${item.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
              </div>` : ''}
            ${item.pricing_info ? `<div class="pricing"><strong>Pricing:</strong> ${item.pricing_info}</div>` : ''}
            ${item.icon ? `<div style="color: #666; margin-top: 15px;"><strong>Icon:</strong> ${item.icon}</div>` : ''}
          </body>
          </html>
        `;
        break;
      case 'careers':
        previewContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview: ${item.title}</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
              h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
              .meta { color: #666; margin-bottom: 20px; background: #f8f9fa; padding: 15px; border-radius: 5px; }
              .salary { font-size: 18px; color: #28a745; margin: 20px 0; font-weight: bold; }
              .section { background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }
              .section ul { margin: 10px 0; padding-left: 20px; }
              .closed-notice { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            ${item.status === 'closed' ? '<div class="closed-notice"><strong>🚫 Position Closed</strong> - This job listing is no longer accepting applications.</div>' : ''}
            <h1>${item.title}</h1>
            <div class="meta">
              <strong>Department:</strong> ${item.department || 'N/A'} | 
              <strong>Location:</strong> ${item.location || 'N/A'} | 
              <strong>Type:</strong> ${item.employment_type || 'N/A'} |
              <strong>Status:</strong> ${item.status || 'N/A'}
            </div>
            ${item.salary_range ? `<div class="salary">Salary: ${item.salary_range}${item.salary_type === 'commission_based' ? ' (Commission Based)' : item.salary_type === 'fixed_monthly' ? ' (Fixed Monthly)' : ''}</div>` : ''}
            <div>${item.description || 'No description available'}</div>
            ${item.requirements && Array.isArray(item.requirements) && item.requirements.length > 0 ?
            `<div class="section">
                <h3>Requirements:</h3>
                <ul>
                  ${item.requirements.map(req => `<li>${req}</li>`).join('')}
                </ul>
              </div>` : ''}
            ${item.benefits && Array.isArray(item.benefits) && item.benefits.length > 0 ?
            `<div class="section">
                <h3>Benefits:</h3>
                <ul>
                  ${item.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
              </div>` : ''}
          </body>
          </html>
        `;
        break;
      case 'testimonials':
        previewContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview: Testimonial from ${item.client_name}</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; line-height: 1.6; }
              .testimonial { font-size: 24px; color: #374151; margin: 40px 0; line-height: 1.5; font-style: italic; }
              .author { border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; }
              .name { margin: 0; color: #1f2937; font-size: 20px; font-weight: bold; }
              .title { margin: 5px 0 0 0; color: #6b7280; }
              .company { margin: 5px 0 0 0; color: #6b7280; font-weight: 600; }
              .rating { margin-top: 10px; color: #fbbf24; font-size: 18px; }
            </style>
          </head>
          <body>
            <div class="testimonial">"${item.content}"</div>
            <div class="author">
              <h3 class="name">${item.client_name}</h3>
              ${item.client_title ? `<p class="title">${item.client_title}</p>` : ''}
              ${item.company_name ? `<p class="company">${item.company_name}</p>` : ''}
              ${item.rating ? `<div class="rating">${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}</div>` : ''}
            </div>
          </body>
          </html>
        `;
        break;
      case 'team':
        previewContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview: ${item.name}</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; line-height: 1.6; }
              h1 { color: #333; margin-bottom: 5px; }
              .role { color: #28a745; font-weight: 600; margin: 10px 0 20px 0; text-transform: uppercase; }
              .title { color: #6b7280; margin: 0 0 20px 0; font-size: 18px; }
              .bio { text-align: left; margin: 20px 0; background: #f8f9fa; padding: 20px; border-radius: 5px; }
              .contact { border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 20px; }
              .contact a { color: #007bff; text-decoration: none; margin: 0 10px; }
            </style>
          </head>
          <body>
            <h1>${item.name}</h1>
            ${item.title ? `<p class="title">${item.title}</p>` : ''}
            <div class="role">${item.role}</div>
            ${item.bio ? `<div class="bio">${item.bio}</div>` : ''}
            <div class="contact">
              ${item.email ? `<a href="mailto:${item.email}">Email</a>` : ''}
              ${item.phone ? `<a href="tel:${item.phone}">Phone</a>` : ''}
              ${item.linkedin_url ? `<a href="${item.linkedin_url}" target="_blank">LinkedIn</a>` : ''}
            </div>
          </body>
          </html>
        `;
        break;
      default:
        previewContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview</title>
          </head>
          <body>
            <h1>No preview available</h1>
            <p>Preview is not available for this content type.</p>
          </body>
          </html>
        `;
    }

    // Open preview in a new tab with sanitized content (no document.write XSS)
    try {
      const sanitizedPreview = DOMPurify.sanitize(previewContent, {
        WHOLE_DOCUMENT: true,
        ADD_TAGS: ['style', 'link', 'meta', 'title', 'head', 'body', 'html', 'noscript'],
        ADD_ATTR: ['charset', 'http-equiv', 'content', 'property', 'lang'],
      });

      const blob = new Blob([sanitizedPreview], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const previewWindow = window.open(url, '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes');

      if (!previewWindow) {
        alert('Please allow popups to preview content, or check your browser settings.');
      }

      // Clean up blob URL after it's loaded
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (error) {
      console.error('Preview error:', error);
      alert('Unable to open preview. Please check your browser settings.');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      published: 'default',
      draft: 'secondary',
      archived: 'outline',
      open: 'default',
      closed: 'destructive',
      on_hold: 'secondary'
    };
    const displayText = status === 'on_hold' ? 'On Hold' : status.charAt(0).toUpperCase() + status.slice(1);
    return <Badge variant={variants[status] || 'secondary'}>{displayText}</Badge>;
  };

  const renderFormField = (field: string) => {
    switch (field) {
      case 'tags':
      case 'features':
      case 'requirements':
      case 'benefits':
        return (
          <Input
            placeholder={`Enter ${field} (comma separated)`}
            value={Array.isArray(formData[field]) ? formData[field].join(', ') : formData[field] || ''}
            onChange={(e) => {
              const items = e.target.value.split(',').map(item => item.trim()).filter(item => item);
              setFormData({ ...formData, [field]: items });
            }}
          />
        );

      case 'expires_at':
        return (
          <Input
            type="datetime-local"
            value={formData[field] ? new Date(formData[field]).toISOString().slice(0, 16) : ''}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value ? new Date(e.target.value).toISOString() : null })}
          />
        );

      case 'content':
      case 'description':
      case 'bio':
      case 'excerpt':
        return (
          <div className="space-y-2">
            <CKEditor
              editor={ClassicEditor}
              data={formData[field] || ''}
              onChange={(event, editor) => {
                const data = editor.getData();
                setFormData({ ...formData, [field]: data });
              }}
              config={{
                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'outdent', 'indent', '|', 'blockQuote', 'insertTable', 'undo', 'redo']
              }}
            />
          </div>
        );

      case 'page_blocks':
        return (
          <div className="space-y-4">
            <Label>Page Blocks</Label>
            <div className="grid grid-cols-2 gap-3">
              {pageBlocks.map((block) => (
                <div key={block.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={block.id}
                    checked={selectedBlocks.includes(block.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedBlocks([...selectedBlocks, block.id]);
                      } else {
                        setSelectedBlocks(selectedBlocks.filter(id => id !== block.id));
                      }
                    }}
                  />
                  <div className="flex-1">
                    <Label htmlFor={block.id} className="text-sm font-medium cursor-pointer">
                      {block.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">{block.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );


      case 'status': {
        const statusOptions = contentType === 'careers'
          ? ['open', 'closed', 'on_hold']
          : ['draft', 'published', 'archived'];
        return (
          <Select value={formData[field] || ''} onValueChange={(value) => setFormData({ ...formData, [field]: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {option === 'on_hold' ? 'On Hold' : option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }


      case 'category':
        return contentType === 'gallery' ? (
          <Select value={formData[field] || ''} onValueChange={(value) => setFormData({ ...formData, [field]: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="events">Events</SelectItem>
              <SelectItem value="team">Team</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="projects">Projects</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Select value={formData[field] || ''} onValueChange={(value) => setFormData({ ...formData, [field]: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call_center">Call Center</SelectItem>
              <SelectItem value="bank_collections">Bank Collections</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
            </SelectContent>
          </Select>
        );

      case 'role':
        return (
          <Select value={formData[field] || ''} onValueChange={(value) => setFormData({ ...formData, [field]: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ceo">CEO</SelectItem>
              <SelectItem value="cto">CTO</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="supervisor">Supervisor</SelectItem>
              <SelectItem value="agent">Agent</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        );

      case 'employment_type':
        return (
          <Select value={formData[field] || ''} onValueChange={(value) => setFormData({ ...formData, [field]: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full Time</SelectItem>
              <SelectItem value="part-time">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
            </SelectContent>
          </Select>
        );

      case 'salary_type':
        return (
          <Select value={formData[field] || ''} onValueChange={(value) => setFormData({ ...formData, [field]: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select salary type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed_monthly">Fixed Monthly</SelectItem>
              <SelectItem value="commission_based">Commission Based</SelectItem>
            </SelectContent>
          </Select>
        );

      case 'rating':
      case 'sort_order':
        return (
          <Input
            type="number"
            placeholder={field === 'rating' ? "Enter rating (1-5)" : "Enter sort order"}
            min={field === 'rating' ? "1" : "0"}
            max={field === 'rating' ? "5" : undefined}
            value={formData[field] || ''}
            onChange={(e) => setFormData({ ...formData, [field]: parseInt(e.target.value) || 0 })}
          />
        );

      case 'icon':
        return (
          <Input
            placeholder="Enter icon name (e.g., phone, users, trending-up)"
            value={formData[field] || ''}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          />
        );

      case 'image_url':
      case 'avatar_url':
      case 'featured_image':
      case 'cover_image_url':
        return (
          <div className="space-y-4">
            <ImageUpload
              label="Upload Image"
              currentImageUrl={formData[field]}
              onImageSelect={(url) => setFormData({ ...formData, [field]: url })}
              folder={field === 'avatar_url' ? 'avatars' : field === 'cover_image_url' ? 'covers' : 'content'}
              aspectRatio={field === 'avatar_url' ? 'aspect-square' : 'aspect-video'}
            />
            {/* Fallback text input for manual URL entry if needed */}
            <div className="flex items-center space-x-2">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">Or URL:</Label>
              <Input
                type="url"
                className="h-8 text-xs"
                placeholder="https://..."
                value={formData[field] || ''}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              />
            </div>
          </div>
        );

      case 'expertise':
      case 'achievements':
        return (
          <div className="space-y-2">
            <Textarea
              placeholder={`Enter ${field === 'expertise' ? 'areas of expertise' : 'key achievements'} — one per line`}
              rows={5}
              value={Array.isArray(formData[field]) ? formData[field].join('\n') : formData[field] || ''}
              onChange={(e) => {
                const items = e.target.value.split('\n').filter(item => item.trim());
                setFormData({ ...formData, [field]: items });
              }}
            />
            <p className="text-xs text-muted-foreground">Enter one item per line</p>
          </div>
        );

      case 'quote':
      case 'tagline':
        return (
          <Textarea
            placeholder={field === 'quote' ? 'Enter a personal or inspirational quote' : 'Enter a short tagline (one-liner description)'}
            rows={field === 'quote' ? 3 : 2}
            value={formData[field] || ''}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          />
        );

      case 'website_url':
      case 'github_url':
      case 'twitter_url':
        return (
          <Input
            type="url"
            placeholder={`Enter ${field.replace('_url', '').replace('_', ' ')} URL`}
            value={formData[field] || ''}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          />
        );

      case 'is_featured':
      case 'is_leadership':
        return (
          <Select value={formData[field]?.toString() || 'false'} onValueChange={(value) => setFormData({ ...formData, [field]: value === 'true' })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Input
            placeholder={`Enter ${field}`}
            value={formData[field] || ''}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          />
        );
    }
  };

  const renderTableCell = (item: CMSItem, field: string) => {
    switch (field) {
      case 'status':
        return getStatusBadge(item[field]);
      case 'is_featured':
      case 'is_leadership':
        return item[field] ? <Badge>Yes</Badge> : <Badge variant="outline">No</Badge>;
      case 'rating':
        return item[field] ? `${item[field]} ⭐` : 'No rating';
      case 'created_at':
        return format(new Date(item[field]), 'MMM dd, yyyy');
      case 'features':
        return Array.isArray(item[field]) ? item[field].join(', ') : item[field];
      case 'sort_order':
        return item[field] || '0';
      case 'icon':
        return item[field] || '-';
      case 'image_url':
      case 'avatar_url':
      case 'featured_image':
      case 'cover_image_url':
        return item[field] ? (
          <div className="flex items-center">
            <img src={item[field]} alt="Preview" className="w-8 h-8 rounded object-cover mr-2" />
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
              {item[field].split('/').pop()}
            </span>
          </div>
        ) : '-';
      case 'expertise':
      case 'achievements':
        return Array.isArray(item[field]) && item[field].length > 0
          ? `${item[field].length} items`
          : '-';
      case 'quote':
      case 'tagline':
        return item[field] ? (
          <div className="max-w-xs truncate" title={item[field]}>
            {item[field]}
          </div>
        ) : '-';
      case 'content':
      case 'description':
      case 'bio':
      case 'excerpt':
        return item[field] ? (
          <div className="max-w-xs truncate" title={item[field]}>
            {item[field]}
          </div>
        ) : '-';
      case 'email':
        return item[field] ? (
          <a href={`mailto:${item[field]}`} className="text-primary hover:underline">
            {item[field]}
          </a>
        ) : '-';
      case 'phone':
        return item[field] ? (
          <a href={`tel:${item[field]}`} className="text-primary hover:underline">
            {item[field]}
          </a>
        ) : '-';
      default:
        return item[field] || '-';
    }
  };

  return (
    <Card className="glass border-slate-200/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <config.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900 dark:text-white">{config.title}</CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {contentType === 'team' && (
              <Button
                variant="outline"
                onClick={() => setUserPickerOpen(true)}
                className="border-primary/30 text-primary hover:bg-primary/5"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create from User
              </Button>
            )}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? `Edit ${config.title.slice(0, -1)}` : `Add New ${config.title.slice(0, -1)}`}
                </DialogTitle>
                <DialogDescription>
                  {editingItem ? 'Update the information below' : 'Fill in the information below'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {config.fields.map(field => (
                  <div key={field} className="grid gap-2">
                    <Label htmlFor={field} className="capitalize">
                      {field.replace('_', ' ')}
                    </Label>
                    {renderFormField(field)}
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingItem ? 'Updating...' : 'Creating...'}
                    </div>
                  ) : (
                    editingItem ? 'Update' : 'Create'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>
      </CardHeader>

      {/* System User Picker Dialog (team only) */}
      {contentType === 'team' && (
        <Dialog open={userPickerOpen} onOpenChange={(v) => { setUserPickerOpen(v); if (!v) setUserSearch(''); }}>
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Create Team Member from System User
              </DialogTitle>
              <DialogDescription>
                Select a system user to pre-fill their profile as a team member.
              </DialogDescription>
            </DialogHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                className="pl-9"
                placeholder="Search by name or email…"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="overflow-y-auto -mx-2 px-2 flex-1 min-h-0">
              {filteredSystemUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <Users className="w-10 h-10 opacity-30 mb-2" />
                  <p className="text-sm">{userSearch ? 'No matching users found.' : 'All users are already team members.'}</p>
                </div>
              ) : (
                <div className="space-y-1 py-2">
                  {filteredSystemUsers.map((u: any) => (
                    <button
                      key={u.id}
                      onClick={() => handleCreateFromUser(u)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      {u.avatar_url ? (
                        <img
                          src={u.avatar_url}
                          alt={u.full_name || u.email}
                          className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-slate-200 dark:ring-slate-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                          {(u.full_name || u.email).charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">
                          {u.full_name || <span className="italic text-muted-foreground">No name</span>}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-xs capitalize">{u.role || 'user'}</Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Loading {config.title.toLowerCase()}...</p>
          </div>
        ) : (
          (data as any[]).length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <config.icon className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No {config.title.toLowerCase()} yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                Get started by creating your first {config.title.toLowerCase().slice(0, -1)}
              </p>
              <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Create {config.title.slice(0, -1)}
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {config.fields.map(field => (
                    <TableHead key={field} className="capitalize">
                      {field.replace('_', ' ')}
                    </TableHead>
                  ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item: CMSItem) => (
                  <TableRow key={item.id}>
                    {config.fields.map(field => (
                      <TableCell key={field}>
                        {renderTableCell(item, field)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex space-x-2">
                        {/* Preview button for public/published content */}
                        {(item.status === 'published' || item.status === 'open' || item.is_featured ||
                          (contentType === 'testimonials' && item.is_featured) ||
                          (contentType === 'team' && item.is_leadership) ||
                          contentType === 'services' || contentType === 'gallery') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePreview(item)}
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                        <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        )}

        {/* Admin Table Pagination */}
        {!isLoading && (data as CMSItem[]).length > 0 && totalTablePages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-sm text-muted-foreground">
              Showing {(tablePage - 1) * ADMIN_ITEMS_PER_PAGE + 1}–{Math.min(tablePage * ADMIN_ITEMS_PER_PAGE, (data as CMSItem[]).length)} of {(data as CMSItem[]).length}
            </span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" disabled={tablePage === 1} onClick={() => setTablePage((p) => p - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalTablePages }, (_, i) => i + 1).map((page) => (
                <Button key={page} variant={page === tablePage ? 'default' : 'outline'} size="icon" onClick={() => setTablePage(page)}>
                  {page}
                </Button>
              ))}
              <Button variant="outline" size="icon" disabled={tablePage === totalTablePages} onClick={() => setTablePage((p) => p + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CMSContentManager;
