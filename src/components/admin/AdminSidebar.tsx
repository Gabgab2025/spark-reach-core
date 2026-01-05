import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar
} from '@/components/ui/sidebar';
import { 
  BarChart3, FileText, Users, TrendingUp, Settings, Globe, ChevronLeft, ChevronRight, LogOut, User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const { state, toggleSidebar } = useSidebar();
  const { user, signOut } = useAuth();
  const collapsed = state === 'collapsed';

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  const isActive = (itemId: string) => activeTab === itemId;

  return (
    <Sidebar collapsible="icon">
      <SidebarRail />
      <SidebarContent>
        {/* Header with Minimize Button */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "px-2 py-3" : "px-4 py-3"}>
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
              {!collapsed && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Admin CMS</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">JDGK Business Solutions</p>
                  </div>
                </div>
              )}
              
              {/* Minimize/Expand Button - Always visible */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="w-8 h-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex-shrink-0"
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? (
                  <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                )}
              </Button>
            </div>
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Navigation */}
        <SidebarGroup className="flex-1">
          {!collapsed && <SidebarGroupLabel>Navigation</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
               {navigationItems.map((item) => (
                 <SidebarMenuItem key={item.id}>
                   <SidebarMenuButton 
                     onClick={() => onTabChange(item.id)}
                     className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'} ${
                       isActive(item.id) 
                         ? 'bg-blue-600 text-white hover:bg-blue-700' 
                         : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                     }`}
                     title={collapsed ? item.label : undefined}
                   >
                     <item.icon className="w-4 h-4" />
                     {!collapsed && <span className="ml-3">{item.label}</span>}
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions - At bottom */}
        <SidebarGroup className="mt-auto">
          {!collapsed && <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'}`} title={collapsed ? "User Profile" : undefined}>
                  <User className="w-4 h-4" />
                  {!collapsed && <span className="ml-3">User Profile</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => onTabChange('settings')}
                  className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'}`} 
                  title={collapsed ? "Settings" : undefined}
                >
                  <Settings className="w-4 h-4" />
                  {!collapsed && <span className="ml-3">Settings</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'}`} title={collapsed ? "View Site" : undefined}>
                  <Globe className="w-4 h-4" />
                  {!collapsed && <span className="ml-3">View Site</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={signOut}
                  className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'} text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950`} 
                  title={collapsed ? "Logout" : undefined}
                >
                  <LogOut className="w-4 h-4" />
                  {!collapsed && <span className="ml-3">Logout</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;