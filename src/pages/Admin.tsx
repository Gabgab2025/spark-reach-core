import { useState, useEffect } from 'react';
import { useRoles, UserRole } from '@/hooks/useRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, Users, UserCheck, Crown, BarChart3, FileText, Briefcase,
  MessageSquare, Settings, Globe, TrendingUp, Calendar, Phone,
  Edit, Trash2, Plus, Eye, Upload, Star, Target, Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserWithRole {
  id: string;
  email: string;
  full_name?: string;
  role?: UserRole;
}

const Admin = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isAdmin, getAllUsersWithRoles, updateUserRole } = useRoles();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await getAllUsersWithRoles();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin, getAllUsersWithRoles, navigate]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole(userId, newRole);
      const usersData = await getAllUsersWithRoles();
      setUsers(usersData);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    return role === 'admin' ? 'destructive' : 'secondary';
  };

  const getRoleIcon = (role: UserRole) => {
    return role === 'admin' ? <Crown className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />;
  };

  // Mock data for CMS sections
  const dashboardStats = [
    { title: 'Total Users', value: users.length, icon: Users, trend: '+12%' },
    { title: 'Active Projects', value: 24, icon: Briefcase, trend: '+8%' },
    { title: 'Monthly Calls', value: '15.2K', icon: Phone, trend: '+15%' },
    { title: 'Client Satisfaction', value: '98%', icon: Star, trend: '+2%' }
  ];

  const contentSections = [
    { id: 'pages', title: 'Pages', description: 'Manage website pages and content', icon: FileText, count: 8 },
    { id: 'services', title: 'Services', description: 'Call center and collections services', icon: Target, count: 6 },
    { id: 'blog', title: 'Blog Posts', description: 'News and industry insights', icon: MessageSquare, count: 15 },
    { id: 'careers', title: 'Job Listings', description: 'Open positions and hiring', icon: Building, count: 4 },
    { id: 'testimonials', title: 'Testimonials', description: 'Client feedback and reviews', icon: Star, count: 12 },
    { id: 'team', title: 'Team Members', description: 'Leadership and staff profiles', icon: Users, count: 18 }
  ];

  if (!isAdmin()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <div className="border-b border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
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

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="glass border border-slate-200/50 p-1 w-fit">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, index) => (
                <Card key={index} className="glass border-slate-200/50 hover-lift">
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
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentSections.map((section) => (
                <Card key={section.id} className="glass border-slate-200/50 hover-lift group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <section.icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800">
                        {section.count}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {section.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {section.description}
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-200">
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Management Tab */}
          <TabsContent value="users" className="space-y-8">
            <Card className="glass border-slate-200/50">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions for your CallCenter Pro system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
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
                  <CardTitle className="text-slate-900 dark:text-white">Website Traffic</CardTitle>
                  <CardDescription>Monthly visitor analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                    <p className="text-slate-600 dark:text-slate-400">Chart placeholder - Integration ready</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-slate-200/50">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white">Lead Generation</CardTitle>
                  <CardDescription>Contact form submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg">
                    <p className="text-slate-600 dark:text-slate-400">Chart placeholder - Integration ready</p>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;