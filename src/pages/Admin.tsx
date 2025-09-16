import { useState, useEffect } from 'react';
import { useRoles, UserRole } from '@/hooks/useRoles';
import { useCMS } from '@/hooks/useCMS';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import CMSContentManager from '@/components/admin/CMSContentManager';
import SettingsManager from '@/components/admin/SettingsManager';
import PageEditor from '@/components/admin/PageEditor';
import { 
  Shield, Users, UserCheck, Crown, BarChart3, FileText, Briefcase,
  MessageSquare, Settings, Globe, TrendingUp, Calendar, Phone,
  Edit, Trash2, Plus, Eye, Upload, Star, Target, Building, Activity
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useNavigate } from 'react-router-dom';
import { AdminDataProvider, useAdminData } from '@/contexts/AdminDataContext';
import { useQuery } from '@tanstack/react-query';

interface UserWithRole {
  id: string;
  email: string;
  full_name?: string;
  role?: UserRole;
}

const AdminContent = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserFullName, setNewUserFullName] = useState('');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const { isAdmin, getAllUsersWithRoles, updateUserRole, loading: rolesLoading } = useRoles();
  const { dashboardStats, analyticsData, isLoading: dataLoading } = useAdminData();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Cache users data with React Query
  const { data: usersData = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: getAllUsersWithRoles,
    enabled: !!isAdmin(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setUsers(usersData);
  }, [usersData]);

  useEffect(() => {
    if (rolesLoading) return;
    if (!isAdmin()) {
      navigate('/');
      return;
    }
  }, [rolesLoading, isAdmin, navigate]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole(userId, newRole);
      // Refresh users data
      const usersData = await getAllUsersWithRoles();
      setUsers(usersData);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleCreateAdminUser = async () => {
    if (!newUserEmail || !newUserPassword || !newUserFullName) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingUser(true);
    try {
      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.admin.createUser({
        email: newUserEmail,
        password: newUserPassword,
        user_metadata: {
          full_name: newUserFullName
        },
        email_confirm: true
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Assign admin role
        await updateUserRole(data.user.id, 'admin');
        
        // Refresh users list
        const usersData = await getAllUsersWithRoles();
        setUsers(usersData);
        
        toast({
          title: "Success",
          description: "Admin user created successfully"
        });
        
        // Reset form and close dialog
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserFullName('');
        setIsAddUserDialogOpen(false);
      }
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create admin user",
        variant: "destructive"
      });
    } finally {
      setIsCreatingUser(false);
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    return role === 'admin' ? 'destructive' : 'secondary';
  };

  const getRoleIcon = (role: UserRole) => {
    return role === 'admin' ? <Crown className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />;
  };

  // Real-time dashboard statistics
  const getRealDashboardStats = () => {
    if (!dashboardStats || !analyticsData.length) {
      return [
        { title: 'Total Users', value: users.length, icon: Users, trend: '+12%', color: 'from-blue-500 to-indigo-500' },
        { title: 'Website Pages', value: dashboardStats?.pages || 0, icon: FileText, trend: '+8%', color: 'from-teal-500 to-cyan-500' },
        { title: 'Monthly Calls', value: '15.2K', icon: Phone, trend: '+15%', color: 'from-purple-500 to-pink-500' },
        { title: 'Client Satisfaction', value: '98%', icon: Star, trend: '+2%', color: 'from-orange-500 to-red-500' }
      ];
    }

    const websiteVisitors = analyticsData.find(item => item.metric_name === 'website_visitors')?.metric_value || 0;
    const totalCalls = analyticsData.find(item => item.metric_name === 'total_calls')?.metric_value || 0;
    const satisfaction = analyticsData.find(item => item.metric_name === 'customer_satisfaction')?.metric_value || 0;

    return [
      { title: 'Total Users', value: users.length, icon: Users, trend: '+12%', color: 'from-blue-500 to-indigo-500' },
      { title: 'Website Visitors', value: websiteVisitors.toLocaleString(), icon: Globe, trend: '+8%', color: 'from-teal-500 to-cyan-500' },
      { title: 'Monthly Calls', value: totalCalls.toLocaleString(), icon: Phone, trend: '+15%', color: 'from-purple-500 to-pink-500' },
      { title: 'Client Satisfaction', value: `${satisfaction}%`, icon: Star, trend: '+2%', color: 'from-orange-500 to-red-500' }
    ];
  };

  const realDashboardStats = getRealDashboardStats();

  const contentSections = [
    { 
      id: 'pages', 
      title: 'Pages', 
      description: 'Manage website pages and content', 
      icon: FileText, 
      count: dashboardStats?.pages || 0,
      published: dashboardStats?.publishedPages || 0
    },
    { 
      id: 'services', 
      title: 'Services', 
      description: 'Call center and collections services', 
      icon: Target, 
      count: dashboardStats?.services || 0,
      featured: dashboardStats?.featuredServices || 0
    },
    { 
      id: 'blog', 
      title: 'Blog Posts', 
      description: 'News and industry insights', 
      icon: MessageSquare, 
      count: dashboardStats?.blogPosts || 0,
      draft: dashboardStats?.draftPages || 0
    },
    { 
      id: 'careers', 
      title: 'Job Listings', 
      description: 'Open positions and hiring', 
      icon: Building, 
      count: dashboardStats?.jobListings || 0,
      open: dashboardStats?.jobListings || 0
    },
    { 
      id: 'testimonials', 
      title: 'Testimonials', 
      description: 'Client feedback and reviews', 
      icon: Star, 
      count: dashboardStats?.testimonials || 0,
      featured: 3
    },
    { 
      id: 'team', 
      title: 'Team Members', 
      description: 'Leadership and staff profiles', 
      icon: Users, 
      count: dashboardStats?.teamMembers || 0,
      leadership: 3
    }
  ];

  if (rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin()) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
        {/* Sidebar */}
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="border-b border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 sticky top-0 z-40">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger className="lg:hidden" />
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Admin Dashboard
                      </h1>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Content Management System
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm" className="glass border-slate-200/50">
                    <Globe className="w-4 h-4 mr-2" />
                    View Site
                  </Button>
                  <Button variant="outline" size="sm" className="glass border-slate-200/50">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {realDashboardStats.map((stat, index) => (
                    <Card key={index} className="glass border-slate-200/50 hover-lift group">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                              {stat.title}
                            </p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">
                              {stat.value}
                            </p>
                            <p className="text-sm text-emerald-600 font-medium">
                              {stat.trend} from last month
                            </p>
                          </div>
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Quick Actions */}
                <Card className="glass border-slate-200/50">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">Quick Actions</CardTitle>
                    <CardDescription>Common CMS tasks and shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button className="h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Page
                      </Button>
                      <Button className="h-16 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white">
                        <FileText className="w-5 h-5 mr-2" />
                        Create Blog Post
                      </Button>
                      <Button className="h-16 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                        <Upload className="w-5 h-5 mr-2" />
                        Media Library
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="glass border-slate-200/50">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">Recent Activity</CardTitle>
                    <CardDescription>Latest changes and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { action: 'Updated "About Us" page', user: 'Admin', time: '2 hours ago', icon: Edit },
                        { action: 'Published new blog post', user: 'Editor', time: '4 hours ago', icon: FileText },
                        { action: 'Added new team member', user: 'Admin', time: '1 day ago', icon: Users },
                        { action: 'Updated service pricing', user: 'Manager', time: '2 days ago', icon: Target }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <activity.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {activity.action}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              by {activity.user} • {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Management Tab */}
              <TabsContent value="content" className="space-y-8">
                <Tabs defaultValue="pages" className="space-y-6">
                  <TabsList className="glass border border-slate-200/50 p-1 w-fit">
                    {contentSections.map((section) => (
                      <TabsTrigger 
                        key={section.id} 
                        value={section.id}
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                      >
                        <section.icon className="w-4 h-4 mr-2" />
                        {section.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Content sections */}
                  <TabsContent value="pages">
                    <PageEditor />
                  </TabsContent>
                  
                  <TabsContent value="services">
                    <CMSContentManager contentType="services" />
                  </TabsContent>
                  
                  <TabsContent value="blog">
                    <CMSContentManager contentType="blog" />
                  </TabsContent>
                  
                  <TabsContent value="careers">
                    <CMSContentManager contentType="careers" />
                  </TabsContent>
                  
                  <TabsContent value="testimonials">
                    <CMSContentManager contentType="testimonials" />
                  </TabsContent>
                  
                  <TabsContent value="team">
                    <CMSContentManager contentType="team" />
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* Users Management Tab */}
              <TabsContent value="users" className="space-y-8">
                <Card className="glass border-slate-200/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-slate-900 dark:text-white">User Management</CardTitle>
                        <CardDescription>
                          Manage user accounts and permissions for your CallCenter Pro system.
                        </CardDescription>
                      </div>
                      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Admin User
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Create New Admin User</DialogTitle>
                            <DialogDescription>
                              Add a new administrator account with full system access.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="fullName">Full Name</Label>
                              <Input
                                id="fullName"
                                value={newUserFullName}
                                onChange={(e) => setNewUserFullName(e.target.value)}
                                placeholder="Enter full name"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                placeholder="Enter email address"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="password">Password</Label>
                              <Input
                                id="password"
                                type="password"
                                value={newUserPassword}
                                onChange={(e) => setNewUserPassword(e.target.value)}
                                placeholder="Enter secure password"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              onClick={() => setIsAddUserDialogOpen(false)}
                              disabled={isCreatingUser}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleCreateAdminUser}
                              disabled={isCreatingUser}
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                            >
                              {isCreatingUser ? 'Creating...' : 'Create Admin'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {usersLoading ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Loading users...</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Current Role</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="font-medium text-slate-900 dark:text-white">
                                  {user.full_name || 'No name'}
                                </div>
                              </TableCell>
                              <TableCell className="text-slate-600 dark:text-slate-400">
                                {user.email}
                              </TableCell>
                              <TableCell>
                                <Badge variant={getRoleBadgeVariant(user.role || 'user')} className="flex items-center space-x-1 w-fit">
                                  {getRoleIcon(user.role || 'user')}
                                  <span className="capitalize">{user.role || 'user'}</span>
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={user.role || 'user'}
                                  onValueChange={(newRole: UserRole) => handleRoleChange(user.id, newRole)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="glass border-slate-200/50">
                    <CardHeader>
                      <CardTitle className="text-slate-900 dark:text-white flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-blue-600" />
                        Real-time Analytics
                      </CardTitle>
                      <CardDescription>Current performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analyticsData.slice(0, 5).map((metric, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white capitalize">
                                {metric.metric_name.replace('_', ' ')}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                                {metric.category}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-blue-600">
                                {typeof metric.metric_value === 'number' 
                                  ? metric.metric_value.toLocaleString() 
                                  : metric.metric_value}
                              </p>
                              <p className="text-xs text-slate-500">
                                {new Date(metric.metric_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass border-slate-200/50">
                    <CardHeader>
                      <CardTitle className="text-slate-900 dark:text-white">Content Statistics</CardTitle>
                      <CardDescription>CMS content overview</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {contentSections.map((section, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <section.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <p className="font-medium text-slate-900 dark:text-white">
                                {section.title}
                              </p>
                            </div>
                            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                              {section.count}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="glass border-slate-200/50">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">Performance Metrics</CardTitle>
                    <CardDescription>Key performance indicators for your call center operations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Avg Response Time', value: '< 2 min', color: 'from-green-500 to-emerald-500' },
                        { label: 'Resolution Rate', value: '94.2%', color: 'from-blue-500 to-indigo-500' },
                        { label: 'Client Retention', value: '98.7%', color: 'from-purple-500 to-pink-500' },
                        { label: 'Revenue Growth', value: '+23%', color: 'from-orange-500 to-red-500' }
                      ].map((metric, index) => (
                        <div key={index} className="text-center p-4 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                          <div className={`text-2xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                            {metric.value}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {metric.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-8">
                <SettingsManager />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

const Admin = () => {
  return (
    <AdminDataProvider>
      <AdminContent />
    </AdminDataProvider>
  );
};

export default Admin;