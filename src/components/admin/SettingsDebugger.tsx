import { useState } from 'react';
import { useCMS } from '@/hooks/useCMS';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, ExternalLink, Loader2, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const SettingsDebugger = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cms = useCMS();
  const { signOut } = useAuth();

  const fixAuthIssues = async () => {
    try {
      // Clear any problematic tokens
      localStorage.removeItem('supabase.auth.token');
      localStorage.clear();
      
      // Sign out to clear session
      await signOut();
      
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error('Error fixing auth issues:', error);
      // Force reload anyway
      window.location.reload();
    }
  };

  const runDebug = async () => {
    setIsLoading(true);
    try {
      const settings = await cms.getSettings();
      
      // Check what's actually in the DOM
      const chatWidgetElements = document.querySelectorAll('[data-settings-applied="chat-widget"]');
      const customHeadElements = document.querySelectorAll('[data-settings-applied="custom-head"]');
      const customBodyElements = document.querySelectorAll('[data-settings-applied="custom-body"]');
      
      setDebugInfo({
        settings,
        domElements: {
          chatWidgetCount: chatWidgetElements.length,
          customHeadCount: customHeadElements.length,
          customBodyCount: customBodyElements.length,
          totalSettingsElements: document.querySelectorAll('[data-settings-applied]').length
        },
        currentPath: window.location.pathname,
        isPublicPage: !window.location.pathname.startsWith('/admin'),
        settingsKeys: Object.keys(settings),
        hasAnySettings: Object.keys(settings).length > 0,
        chatWidgetPreview: settings.chat_widget_code ? settings.chat_widget_code.substring(0, 100) + '...' : 'No chat widget code'
      });
    } catch (error) {
      console.error('Debug error:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const forceReloadSettings = () => {
    // Remove existing elements
    document.querySelectorAll('[data-settings-applied]').forEach(el => el.remove());
    
    // Trigger a page reload to re-apply settings
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Settings Debugger
        </CardTitle>
        <CardDescription>
          Debug why your chat widget isn't showing on public pages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800 mb-2">
            <strong>🚨 Auth Error Detected:</strong> Invalid refresh token is preventing settings from working properly.
          </p>
          <Button variant="destructive" size="sm" onClick={fixAuthIssues}>
            <LogOut className="mr-2 h-3 w-3" />
            Fix Auth Issues (Sign Out & Clear Cache)
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={runDebug} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Debug Settings
          </Button>
          <Button variant="outline" onClick={forceReloadSettings}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Force Reload
          </Button>
          <Button variant="outline" onClick={() => window.open('/', '_blank')}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Test on Homepage
          </Button>
        </div>

        {debugInfo && (
          <div className="space-y-4">
            {debugInfo.error ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">Error: {debugInfo.error}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded">
                    <div className="text-sm font-medium">Current Page</div>
                    <div className="text-xs text-muted-foreground">{debugInfo.currentPath}</div>
                    <Badge variant={debugInfo.isPublicPage ? "default" : "secondary"}>
                      {debugInfo.isPublicPage ? "Public Page" : "Admin Page"}
                    </Badge>
                  </div>
                  
                  <div className="p-3 border rounded">
                    <div className="text-sm font-medium">Settings Status</div>
                    <div className="text-xs text-muted-foreground">{debugInfo.settingsKeys.length} settings found</div>
                    <Badge variant={debugInfo.hasAnySettings ? "default" : "secondary"}>
                      {debugInfo.hasAnySettings ? "Has Settings" : "No Settings"}
                    </Badge>
                  </div>
                  
                  <div className="p-3 border rounded">
                    <div className="text-sm font-medium">DOM Elements</div>
                    <div className="text-xs text-muted-foreground">
                      Chat: {debugInfo.domElements.chatWidgetCount}, 
                      Head: {debugInfo.domElements.customHeadCount}, 
                      Body: {debugInfo.domElements.customBodyCount}
                    </div>
                    <Badge variant={debugInfo.domElements.totalSettingsElements > 0 ? "default" : "secondary"}>
                      {debugInfo.domElements.totalSettingsElements} Applied
                    </Badge>
                  </div>
                  
                  <div className="p-3 border rounded">
                    <div className="text-sm font-medium">Chat Widget</div>
                    <div className="text-xs text-muted-foreground break-all">
                      {debugInfo.chatWidgetPreview}
                    </div>
                    <Badge variant={debugInfo.settings.chat_widget_code ? "default" : "secondary"}>
                      {debugInfo.settings.chat_widget_code ? "Configured" : "Not Set"}
                    </Badge>
                  </div>
                </div>

                {debugInfo.settings.chat_widget_code && debugInfo.domElements.chatWidgetCount === 0 && debugInfo.isPublicPage && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>⚠️ Issue Found:</strong> Chat widget is configured but not applied to DOM. Try "Force Reload" button.
                    </p>
                  </div>
                )}

                {!debugInfo.isPublicPage && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>ℹ️ Note:</strong> You're on an admin page. Chat widgets only show on public pages.
                    </p>
                  </div>
                )}

                {debugInfo.isPublicPage && !debugInfo.settings.chat_widget_code && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-800">
                      <strong>❌ Issue:</strong> No chat widget code found in settings. Please add it in the admin panel.
                    </p>
                  </div>
                )}

                {debugInfo.isPublicPage && debugInfo.settings.chat_widget_code && debugInfo.domElements.chatWidgetCount > 0 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800">
                      <strong>✅ Success:</strong> Chat widget should be visible on this page!
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SettingsDebugger;