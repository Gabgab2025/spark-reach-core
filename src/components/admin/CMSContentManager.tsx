import { useState, useEffect } from 'react';
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

interface CMSContentManagerProps {
  contentType: 'pages' | 'services' | 'blog' | 'careers' | 'testimonials' | 'team';
}

const CMSContentManager = ({ contentType }: CMSContentManagerProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  
  const cms = useCMS();

  const contentConfig = {
    pages: {
      title: 'Pages',
      description: 'Manage website pages and content',
      icon: FileText,
      fields: ['title', 'slug', 'status', 'meta_title', 'content'],
      fetchFn: cms.getPages,
      createFn: cms.createPage,
      updateFn: cms.updatePage,
      deleteFn: cms.deletePage
    },
    services: {
      title: 'Services',
      description: 'Call center and collections services',
      icon: Target,
      fields: ['title', 'category', 'description', 'is_featured'],
      fetchFn: cms.getServices,
      createFn: cms.createService,
      updateFn: cms.updateService,
      deleteFn: cms.deleteService
    },
    blog: {
      title: 'Blog Posts',
      description: 'News and industry insights',
      icon: MessageSquare,
      fields: ['title', 'slug', 'excerpt', 'status', 'tags'],
      fetchFn: cms.getBlogPosts,
      createFn: cms.createBlogPost,
      updateFn: cms.updateBlogPost,
      deleteFn: cms.deleteBlogPost
    },
    careers: {
      title: 'Job Listings',
      description: 'Open positions and hiring',
      icon: Building,
      fields: ['title', 'department', 'location', 'employment_type', 'status'],
      fetchFn: cms.getJobListings,
      createFn: cms.createJobListing,
      updateFn: cms.updateJobListing,
      deleteFn: cms.deleteJobListing
    },
    testimonials: {
      title: 'Testimonials',
      description: 'Client feedback and reviews',
      icon: Star,
      fields: ['client_name', 'company_name', 'content', 'rating', 'is_featured'],
      fetchFn: cms.getTestimonials,
      createFn: cms.createTestimonial,
      updateFn: cms.updateTestimonial,
      deleteFn: cms.deleteTestimonial
    },
    team: {
      title: 'Team Members',
      description: 'Leadership and staff profiles',
      icon: Users,
      fields: ['name', 'role', 'title', 'bio', 'is_leadership'],
      fetchFn: cms.getTeamMembers,
      createFn: cms.createTeamMember,
      updateFn: cms.updateTeamMember,
      deleteFn: cms.deleteTeamMember
    }
  };

  const config = contentConfig[contentType];

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await config.fetchFn();
      setData(result);
    } catch (error) {
      console.error(`Error fetching ${contentType}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [contentType]);

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
    try {
      if (editingItem) {
        await config.updateFn(editingItem.id, formData);
      } else {
        await config.createFn(formData);
      }
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await config.deleteFn(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting:', error);
      }
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
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {editingItem ? 'Update' : 'Create'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Loading {config.title.toLowerCase()}...</p>
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
              {data.map((item) => (
                <TableRow key={item.id}>
                  {config.fields.map(field => (
                    <TableCell key={field}>
                      {renderTableCell(item, field)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex space-x-2">
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
        )}
      </CardContent>
    </Card>
  );
};

export default CMSContentManager;