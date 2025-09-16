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
import { 
  Edit, Trash2, Plus, Eye, Calendar, Globe, Star, MapPin,
  Users, Briefcase, MessageSquare, Building, Target, FileText
} from 'lucide-react';
import { useCMS, CMSPage, CMSService, CMSBlogPost, CMSJobListing, CMSTestimonial, CMSTeamMember } from '@/hooks/useCMS';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface CMSContentManagerProps {
  contentType: 'pages' | 'services' | 'blog' | 'careers' | 'testimonials' | 'team';
}

const CMSContentManager = ({ contentType }: CMSContentManagerProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const cms = useCMS();

  const contentConfig = {
    pages: {
      title: 'Pages',
      description: 'Manage website pages and content',
      icon: FileText,
      fields: ['title', 'slug', 'status', 'meta_title', 'meta_description', 'content'],
      fetchFn: cms.getPages,
      createFn: cms.createPage,
      updateFn: cms.updatePage,
      deleteFn: cms.deletePage
    },
    services: {
      title: 'Services',
      description: 'Call center and collections services',
      icon: Target,
      fields: ['title', 'slug', 'category', 'description', 'pricing_info', 'is_featured'],
      fetchFn: cms.getServices,
      createFn: cms.createService,
      updateFn: cms.updateService,
      deleteFn: cms.deleteService
    },
    blog: {
      title: 'Blog Posts',
      description: 'News and industry insights',
      icon: MessageSquare,
      fields: ['title', 'slug', 'excerpt', 'status', 'tags', 'content'],
      fetchFn: cms.getBlogPosts,
      createFn: cms.createBlogPost,
      updateFn: cms.updateBlogPost,
      deleteFn: cms.deleteBlogPost
    },
    careers: {
      title: 'Job Listings',
      description: 'Open positions and hiring',
      icon: Building,
      fields: ['title', 'department', 'location', 'employment_type', 'status', 'salary_range', 'description'],
      fetchFn: cms.getJobListings,
      createFn: cms.createJobListing,
      updateFn: cms.updateJobListing,
      deleteFn: cms.deleteJobListing
    },
    testimonials: {
      title: 'Testimonials',
      description: 'Client feedback and reviews',
      icon: Star,
      fields: ['client_name', 'company_name', 'client_title', 'content', 'rating', 'is_featured'],
      fetchFn: cms.getTestimonials,
      createFn: cms.createTestimonial,
      updateFn: cms.updateTestimonial,
      deleteFn: cms.deleteTestimonial
    },
    team: {
      title: 'Team Members',
      description: 'Leadership and staff profiles',
      icon: Users,
      fields: ['name', 'title', 'role', 'bio', 'email', 'phone', 'is_leadership'],
      fetchFn: cms.getTeamMembers,
      createFn: cms.createTeamMember,
      updateFn: cms.updateTeamMember,
      deleteFn: cms.deleteTeamMember
    }
  };

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
    setDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
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
            </div>
            <div style="line-height: 1.6; margin-bottom: 20px;">${item.description || 'No description available'}</div>
            ${item.pricing_info ? `<div style="background: #f3f4f6; padding: 15px; border-radius: 8px;"><strong>Pricing:</strong> ${item.pricing_info}</div>` : ''}
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

    // Open preview in a new tab
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Preview: ${item.title || item.name || item.client_name}</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="margin: 0; background: #f9fafb;">
          ${previewContent}
        </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      published: 'default',
      draft: 'secondary',
      open: 'default',
      closed: 'destructive',
      archived: 'outline'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const renderFormField = (field: string) => {
    switch (field) {
      case 'tags':
        return (
          <Input
            placeholder="Enter tags (comma separated)"
            value={Array.isArray(formData[field]) ? formData[field].join(', ') : formData[field] || ''}
            onChange={(e) => {
              const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
              setFormData({ ...formData, [field]: tags });
            }}
          />
        );
        
      case 'content':
      case 'description':
      case 'bio':
      case 'excerpt':
        return (
          <Textarea
            placeholder={`Enter ${field}`}
            value={formData[field] || ''}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            rows={4}
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
                  {option.charAt(0).toUpperCase() + option.slice(1)}
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
        return (
          <Select value={formData[field]?.toString() || ''} onValueChange={(value) => setFormData({ ...formData, [field]: parseInt(value) })}>
            <SelectTrigger>
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map(rating => (
                <SelectItem key={rating} value={rating.toString()}>
                  {rating} Star{rating > 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
      case 'tags':
        return Array.isArray(item[field]) ? item[field].join(', ') : item[field];
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
            <DialogContent className="max-w-2xl">
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