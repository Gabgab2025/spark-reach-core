import { Button } from '@/components/ui/button';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar
} from '@/components/ui/sidebar';
import {
  BarChart3, FileText, Users, TrendingUp, Settings, Globe, ChevronLeft, ChevronRight,
  LogOut, User, Target, MessageSquare, Building, Star, Layers, Sun, Moon, Image, ClipboardList
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  contentSubTab?: string;
  onContentSubTabChange?: (subTab: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
];

const CONTENT_ITEMS = [
  { id: 'pages', label: 'Pages', icon: FileText },
  { id: 'services', label: 'Services', icon: Target },
  { id: 'blog', label: 'Blog Posts', icon: MessageSquare },
  { id: 'careers', label: 'Job Listings', icon: Building },
  { id: 'testimonials', label: 'Testimonials', icon: Star },
  { id: 'team', label: 'Team Members', icon: Users },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'contact', label: 'Messages', icon: MessageSquare },
  { id: 'blocks', label: 'Blocks Library', icon: Layers },
  { id: 'applications', label: 'Applications', icon: ClipboardList },
];

const BOTTOM_ITEMS = [
  { id: 'settings', label: 'Settings', icon: Settings },
];

const AdminSidebar = ({ activeTab, onTabChange, contentSubTab, onContentSubTabChange }: AdminSidebarProps) => {
  const { state, toggleSidebar } = useSidebar();
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const collapsed = state === 'collapsed';

  const toggleAdminTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('admin-theme', newTheme);
  };

  const isNavActive = (id: string) => activeTab === id;
  const isContent = activeTab === 'content';
  const isContentSub = (id: string) => isContent && contentSubTab === id;

  const navBtn = (active: boolean) =>
    `w-full transition-colors ${collapsed ? 'justify-center px-2' : 'justify-start'} ${active
      ? 'bg-primary text-white hover:bg-primary/90'
      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <Sidebar collapsible="icon">
      <SidebarRail />
      <SidebarContent>

        {/* ── Logo / collapse toggle ─────────────────────────────── */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'px-2 py-3' : 'px-4 py-3'}>
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
              {!collapsed && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Admin CMS</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">JDGK Business Solutions</p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="w-8 h-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex-shrink-0"
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {collapsed
                  ? <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  : <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
              </Button>
            </div>
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* ── Main nav ──────────────────────────────────────────────── */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Navigation</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(id)}
                    className={navBtn(isNavActive(id))}
                    title={collapsed ? label : undefined}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span className="ml-3">{label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ── Content nav (flat, no accordion) ─────────────────────── */}
        <SidebarGroup className="flex-1">
          {!collapsed && <SidebarGroupLabel>Content</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {CONTENT_ITEMS.map(({ id, label, icon: Icon }) => (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton
                    onClick={() => { onTabChange('content'); onContentSubTabChange?.(id); }}
                    className={navBtn(isContentSub(id))}
                    title={collapsed ? label : undefined}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span className="ml-3">{label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ── Bottom / quick actions ────────────────────────────────── */}
        <SidebarGroup className="mt-auto">
          {!collapsed && <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onTabChange('profile')}
                  className={navBtn(isNavActive('profile'))}
                  title={collapsed ? 'User Profile' : undefined}
                >
                  <User className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span className="ml-3">My Profile</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>

              {BOTTOM_ITEMS.map(({ id, label, icon: Icon }) => (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(id)}
                    className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'} ${isNavActive(id) ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    title={collapsed ? label : undefined}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span className="ml-3">{label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <SidebarMenuButton
                  className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'}`}
                  title={collapsed ? 'View Site' : undefined}
                  onClick={() => window.open('/', '_blank')}
                >
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span className="ml-3">View Site</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={toggleAdminTheme}
                  className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'} hover:bg-slate-100 dark:hover:bg-slate-800`}
                  title={collapsed ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : undefined}
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 flex-shrink-0" /> : <Moon className="w-4 h-4 flex-shrink-0" />}
                  {!collapsed && <span className="ml-3">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={signOut}
                  className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'} text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950`}
                  title={collapsed ? 'Logout' : undefined}
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
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
