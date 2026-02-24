/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
import { useRoles } from '@/hooks/useRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { useTheme } from 'next-themes';
import CMSContentManager from '@/components/admin/CMSContentManager';
import SettingsManager from '@/components/admin/SettingsManager';
import UserManagement from '@/components/admin/UserManagement';
import UserProfile from '@/components/admin/UserProfile';
import PageEditor from '@/components/admin/PageEditor';
import BlockManager from '@/components/admin/BlockManager';
import {
  Shield, Users, BarChart3, FileText,
  MessageSquare, Settings, Globe, TrendingUp, Phone,
  Edit, Plus, Eye, Upload, Star, Target, Building, Activity
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AdminDataProvider, useAdminData } from '@/contexts/AdminDataContext';
import { useQuery } from '@tanstack/react-query';

// ─────────────────────────────────────────────────────────────────────────────

const AdminContent = () => {
  const { theme, setTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const contentSubTab = searchParams.get('subtab') || 'pages';

  /* ── Separate dark-mode: swap to admin preference on mount, restore site preference on unmount ── */
  useEffect(() => {
    // Backup current site theme
    const siteTheme = localStorage.getItem('theme') || 'light';
    localStorage.setItem('site-theme-backup', siteTheme);

    // Apply admin preference
    const adminTheme = localStorage.getItem('admin-theme') || 'light';
    setTheme(adminTheme);

    return () => {
      // Restore site theme on leave
      const backup = localStorage.getItem('site-theme-backup') || 'light';
      setTheme(backup);
      localStorage.setItem('theme', backup);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateParams = (updates: { tab?: string; subtab?: string }) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (updates.tab) next.set('tab', updates.tab);
      if (updates.subtab) next.set('subtab', updates.subtab);
      return next;
    });
  };

  const setActiveTab = (tab: string) => updateParams({ tab });
  const setContentSubTab = (subtab: string) => updateParams({ subtab, tab: 'content' });

  const { isAdmin, loading: rolesLoading } = useRoles();
  const { dashboardStats, analyticsData } = useAdminData();
  const navigate = useNavigate();

  useEffect(() => {
    if (rolesLoading) return;
    if (!isAdmin()) navigate('/');
  }, [rolesLoading, isAdmin, navigate]);

  // ── Dashboard stats ──────────────────────────────────────────────────────
  const realDashboardStats = useMemo(() => {
    const websiteVisitors = analyticsData.find(i => i.metric_name === 'website_visitors')?.metric_value ?? 0;
    const totalCalls = analyticsData.find(i => i.metric_name === 'total_calls')?.metric_value ?? 0;
    const satisfaction = analyticsData.find(i => i.metric_name === 'customer_satisfaction')?.metric_value ?? 0;
    return [
      { title: 'Website Pages', value: dashboardStats?.pages ?? 0, icon: FileText, trend: '+8%', color: 'from-teal-500 to-cyan-500' },
      { title: 'Website Visitors', value: websiteVisitors ? websiteVisitors.toLocaleString() : '—', icon: Globe, trend: '+12%', color: 'from-amber-400 to-orange-500' },
      { title: 'Monthly Calls', value: totalCalls ? totalCalls.toLocaleString() : '15.2K', icon: Phone, trend: '+15%', color: 'from-purple-500 to-pink-500' },
      { title: 'Client Satisfaction', value: satisfaction ? `${satisfaction}%` : '98%', icon: Star, trend: '+2%', color: 'from-orange-500 to-red-500' },
    ];
  }, [dashboardStats, analyticsData]);

  const contentSections = [
    { id: 'pages', title: 'Pages', icon: FileText, count: dashboardStats?.pages ?? 0 },
    { id: 'services', title: 'Services', icon: Target, count: dashboardStats?.services ?? 0 },
    { id: 'blog', title: 'Blog Posts', icon: MessageSquare, count: dashboardStats?.blogPosts ?? 0 },
    { id: 'careers', title: 'Job Listings', icon: Building, count: dashboardStats?.jobListings ?? 0 },
    { id: 'testimonials', title: 'Testimonials', icon: Star, count: dashboardStats?.testimonials ?? 0 },
    { id: 'team', title: 'Team Members', icon: Users, count: dashboardStats?.teamMembers ?? 0 },
    { id: 'gallery', title: 'Gallery', icon: Globe, count: dashboardStats?.galleryItems ?? 0 },
    { id: 'contact', title: 'Contact Us', icon: Phone, count: 0 },
  ];

  if (rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin()) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 dark:from-slate-900 dark:via-amber-950 dark:to-orange-950">

        {/* Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          contentSubTab={contentSubTab}
          onContentSubTabChange={setContentSubTab}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Sticky header */}
          <div className="border-b border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 sticky top-0 z-40">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger className="lg:hidden" />
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                        Admin Dashboard
                      </h1>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Content Management System</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm" className="glass border-slate-200/50" onClick={() => window.open('/', '_blank')}>
                    <Globe className="w-4 h-4 mr-2" /> View Site
                  </Button>
                  <Button variant="outline" size="sm" className="glass border-slate-200/50" onClick={() => setActiveTab('settings')}>
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tab content area */}
          <div className="flex-1 p-6 overflow-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">

              {/* ── Dashboard ─────────────────────────────────────────── */}
              <TabsContent value="dashboard" className="space-y-8">
                {/* Stats grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {realDashboardStats.map((stat, i) => (
                    <Card key={i} className="glass border-slate-200/50 hover-lift group">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                            <p className="text-sm text-emerald-600 font-medium">{stat.trend} from last month</p>
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
                      <Button className="h-16 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white"
                        onClick={() => updateParams({ subtab: 'pages', tab: 'content' })}>
                        <Plus className="w-5 h-5 mr-2" /> Add New Page
                      </Button>
                      <Button className="h-16 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
                        onClick={() => updateParams({ subtab: 'blog', tab: 'content' })}>
                        <FileText className="w-5 h-5 mr-2" /> Create Blog Post
                      </Button>
                      <Button className="h-16 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                        onClick={() => setActiveTab('users')}>
                        <Users className="w-5 h-5 mr-2" /> Manage Users
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
                        { action: 'Updated service pricing', user: 'Manager', time: '2 days ago', icon: Target },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <item.icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{item.action}</p>
                            <p className="text-xs text-slate-500">by {item.user} • {item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Users ─────────────────────────────────────────────── */}
              <TabsContent value="users" className="space-y-6">
                <UserManagement />
              </TabsContent>

              {/* ── Content ───────────────────────────────────────────── */}
              <TabsContent value="content" className="space-y-8">
                {contentSubTab === 'pages' && <PageEditor />}
                {contentSubTab === 'services' && <CMSContentManager contentType="services" />}
                {contentSubTab === 'blog' && <CMSContentManager contentType="blog" />}
                {contentSubTab === 'careers' && <CMSContentManager contentType="careers" />}
                {contentSubTab === 'testimonials' && <CMSContentManager contentType="testimonials" />}
                {contentSubTab === 'team' && <CMSContentManager contentType="team" />}
                {contentSubTab === 'gallery' && <CMSContentManager contentType="gallery" />}
                {contentSubTab === 'blocks' && <BlockManager />}
                {contentSubTab === 'contact' && (
                  <Card className="glass border-slate-200/50">
                    <CardHeader>
                      <CardTitle className="text-lg text-slate-900 dark:text-white flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-primary" /> Contact Form Management
                      </CardTitle>
                      <CardDescription>
                        Contact form submissions are sent directly via email. Manage the Contact page through the Pages section.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button variant="outline" className="glass border-slate-200/50" onClick={() => setContentSubTab('pages')}>
                          <FileText className="w-4 h-4 mr-2" /> Edit Contact Page
                        </Button>
                        <Button variant="outline" className="glass border-slate-200/50" onClick={() => window.open('/contact', '_blank')}>
                          <Eye className="w-4 h-4 mr-2" /> Preview Contact Page
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* ── Analytics ─────────────────────────────────────────── */}
              <TabsContent value="analytics" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="glass border-slate-200/50">
                    <CardHeader>
                      <CardTitle className="text-slate-900 dark:text-white flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-primary" /> Real-time Analytics
                      </CardTitle>
                      <CardDescription>Current performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analyticsData.slice(0, 5).map((metric, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white capitalize">{metric.metric_name.replace('_', ' ')}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">{metric.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                {typeof metric.metric_value === 'number' ? metric.metric_value.toLocaleString() : metric.metric_value}
                              </p>
                              <p className="text-xs text-slate-500">{new Date(metric.metric_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                        {analyticsData.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-8">No analytics data available.</p>
                        )}
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
                        {contentSections.map((section, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <section.icon className="w-4 h-4 text-primary" />
                              </div>
                              <p className="font-medium text-slate-900 dark:text-white">{section.title}</p>
                            </div>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">{section.count}</Badge>
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
                        { label: 'Resolution Rate', value: '94.2%', color: 'from-amber-400 to-orange-500' },
                        { label: 'Client Retention', value: '98.7%', color: 'from-purple-500 to-pink-500' },
                        { label: 'Revenue Growth', value: '+23%', color: 'from-orange-500 to-red-500' },
                      ].map((m, i) => (
                        <div key={i} className="text-center p-4 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                          <div className={`text-2xl font-bold bg-gradient-to-r ${m.color} bg-clip-text text-transparent`}>{m.value}</div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{m.label}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Profile ──────────────────────────────────────────── */}
              <TabsContent value="profile" className="space-y-8">
                <UserProfile />
              </TabsContent>

              {/* ── Settings ──────────────────────────────────────────── */}
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

// ─────────────────────────────────────────────────────────────────────────────

const Admin = () => (
  <AdminDataProvider>
    <AdminContent />
  </AdminDataProvider>
);

export default Admin;
