import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Edit, Trash2, Plus, Eye, Calendar, Globe, Star, MapPin,
  Users, Briefcase, MessageSquare, Building, Target, FileText, Layout, Mail
} from 'lucide-react';
import { useCMS, CMSPage, CMSService, CMSBlogPost, CMSJobListing, CMSTestimonial, CMSTeamMember } from '@/hooks/useCMS';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CMSContentManagerProps {
  contentType: 'pages' | 'services' | 'blog' | 'careers' | 'testimonials' | 'team';
}

const CMSContentManager = ({ contentType }: CMSContentManagerProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
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
      fields: ['title', 'department', 'location', 'employment_type', 'status', 'salary_range', 'requirements', 'benefits', 'expires_at', 'description'],
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
      fields: ['name', 'title', 'role', 'bio', 'email', 'phone', 'avatar_url', 'linkedin_url', 'is_leadership', 'sort_order'],
      fetchFn: cms.getTeamMembers,
      createFn: cms.createTeamMember,
      updateFn: cms.updateTeamMember,
      deleteFn: cms.deleteTeamMember
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

  const config = contentConfig[contentType];

  // Use React Query for data fetching with caching
  const { data = [], isLoading } = useQuery({
    queryKey: ['cms', contentType],
    queryFn: config.fetchFn as () => Promise<any[]>,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
  });

  // Mutation for creating items
  const createMutation = useMutation({
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

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({});
    setSelectedBlocks([]);
    setDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setSelectedBlocks(item.page_blocks || []);
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

  const handlePreview = (item: any) => {
    // Create a modal or new tab to preview the content
    let previewContent = '';
    
    switch (contentType) {
      case 'pages':
        previewContent = `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <h1>${item.title}</h1>
            <div style="color: #666; margin-bottom: 20px;">
              <strong>Slug:</strong> /${item.slug} | <strong>Status:</strong> ${item.status}
            </div>
            ${item.meta_description ? `<p style="font-style: italic; color: #555;">${item.meta_description}</p>` : ''}
            <div style="line-height: 1.6;">${item.content || 'No content available'}</div>
          </div>
        `;
        break;
      case 'blog':
        previewContent = `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <h1>${item.title}</h1>
            <div style="color: #666; margin-bottom: 20px;">
              <strong>Status:</strong> ${item.status} | <strong>Tags:</strong> ${Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || 'None'}
            </div>
            ${item.excerpt ? `<p style="font-size: 18px; color: #555; font-style: italic;">${item.excerpt}</p>` : ''}
            <div style="line-height: 1.6;">${item.content || 'No content available'}</div>
          </div>
        `;
        break;
      case 'services':
        previewContent = `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <h1>${item.title}</h1>
            <div style="color: #666; margin-bottom: 20px;">
              <strong>Category:</strong> ${item.category} ${item.is_featured ? '| <span style="color: #d97706;">★ Featured</span>' : ''}
              ${item.sort_order ? `| <strong>Sort Order:</strong> ${item.sort_order}` : ''}
            </div>
            <div style="line-height: 1.6; margin-bottom: 20px;">${item.description || 'No description available'}</div>
            ${item.features && Array.isArray(item.features) && item.features.length > 0 ? 
              `<div style="margin-bottom: 20px;">
                <h3>Features:</h3>
                <ul style="line-height: 1.6;">
                  ${item.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
              </div>` : ''}
            ${item.pricing_info ? `<div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;"><strong>Pricing:</strong> ${item.pricing_info}</div>` : ''}
            ${item.icon ? `<div style="color: #666;"><strong>Icon:</strong> ${item.icon}</div>` : ''}
          </div>
        `;
        break;
      case 'careers':
        previewContent = `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <h1>${item.title}</h1>
            <div style="color: #666; margin-bottom: 20px;">
              <strong>Department:</strong> ${item.department || 'N/A'} | 
              <strong>Location:</strong> ${item.location || 'N/A'} | 
              <strong>Type:</strong> ${item.employment_type || 'N/A'}
            </div>
            ${item.salary_range ? `<div style="font-size: 18px; color: #059669; margin-bottom: 20px;"><strong>Salary:</strong> ${item.salary_range}</div>` : ''}
            <div style="line-height: 1.6;">${item.description || 'No description available'}</div>
          </div>
        `;
        break;
      case 'testimonials':
        previewContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
            <div style="font-size: 24px; color: #374151; margin-bottom: 20px; line-height: 1.5;">"${item.content}"</div>
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
              <h3 style="margin: 0; color: #1f2937;">${item.client_name}</h3>
              ${item.client_title ? `<p style="margin: 5px 0 0 0; color: #6b7280;">${item.client_title}</p>` : ''}
              ${item.company_name ? `<p style="margin: 5px 0 0 0; color: #6b7280; font-weight: 600;">${item.company_name}</p>` : ''}
              ${item.rating ? `<div style="margin-top: 10px; color: #fbbf24;">${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}</div>` : ''}
            </div>
          </div>
        `;
        break;
      case 'team':
        previewContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
            <h1>${item.name}</h1>
            ${item.title ? `<h2 style="color: #6b7280; margin-top: 0;">${item.title}</h2>` : ''}
            <div style="color: #059669; font-weight: 600; margin-bottom: 20px;">${item.role.toUpperCase()}</div>
            ${item.bio ? `<div style="line-height: 1.6; text-align: left; margin-bottom: 20px;">${item.bio}</div>` : ''}
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
              ${item.email ? `<div><a href="mailto:${item.email}" style="color: #3b82f6;">${item.email}</a></div>` : ''}
              ${item.phone ? `<div style="margin-top: 5px;"><a href="tel:${item.phone}" style="color: #3b82f6;">${item.phone}</a></div>` : ''}
            </div>
          </div>
        `;
        break;
      default:
        previewContent = '<div style="padding: 20px; text-align: center;">Preview not available for this content type</div>';
    }

    // Open preview in a new tab with better error handling
    try {
      const previewWindow = window.open('', '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes');
      if (previewWindow) {
        previewWindow.document.open();
        previewWindow.document.write(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <title>Preview: ${(item.title || item.name || item.client_name || 'Content').replace(/"/g, '&quot;')}</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { margin: 0; padding: 0; background: #f8f9fa; }
            </style>
          </head>
          <body>
            ${previewContent}
          </body>
          </html>
        `);
        previewWindow.document.close();
      } else {
        // Fallback: create blob URL if popup is blocked
        const blob = new Blob([`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <title>Preview</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body style="margin: 0; background: #f9fafb;">
            ${previewContent}
          </body>
          </html>
        `], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = window.open(url, '_blank');
        
        if (!link) {
          alert('Please allow popups to preview content, or check your browser settings.');
        }
        
        // Clean up the blob URL after a delay
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
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
      case 'features':
        return (
          <Input
            placeholder={field === 'features' ? "Enter features (comma separated)" : "Enter tags (comma separated)"}
            value={Array.isArray(formData[field]) ? formData[field].join(', ') : formData[field] || ''}
            onChange={(e) => {
              const items = e.target.value.split(',').map(item => item.trim()).filter(item => item);
              setFormData({ ...formData, [field]: items });
            }}
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
      
      case 'requirements':
      case 'benefits':
        return (
          <div className="space-y-2">
            <Input
              placeholder={`Enter ${field} (comma separated)`}
              value={Array.isArray(formData[field]) ? formData[field].join(', ') : formData[field] || ''}
              onChange={(e) => {
                const items = e.target.value.split(',').map(item => item.trim()).filter(item => item);
                setFormData({ ...formData, [field]: items });
              }}
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple {field} with commas
            </p>
          </div>
        );
      
      case 'expires_at':
        return (
          <Input
            type="datetime-local"
            value={formData[field] ? new Date(formData[field]).toISOString().slice(0, 16) : ''}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value ? new Date(e.target.value).toISOString() : null })}
          />
        );
      
      case 'status':
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
      
      case 'category':
        return (
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
        return (
          <Input
            type="url"
            placeholder="Enter image URL"
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

  const renderTableCell = (item: any, field: string) => {
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
        return item[field] ? (
          <div className="flex items-center">
            <img src={item[field]} alt="Preview" className="w-8 h-8 rounded object-cover mr-2" />
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
              {item[field].split('/').pop()}
            </span>
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
          <a href={`mailto:${item[field]}`} className="text-blue-600 hover:underline">
            {item[field]}
          </a>
        ) : '-';
      case 'phone':
        return item[field] ? (
          <a href={`tel:${item[field]}`} className="text-blue-600 hover:underline">
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <config.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900 dark:text-white">{config.title}</CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white">
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
                  className="bg-blue-600 hover:bg-blue-700 text-white"
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
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white">
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
                {(data as any[]).map((item: any) => (
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
                           contentType === 'services') && (
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
      </CardContent>
    </Card>
  );
};

export default CMSContentManager;