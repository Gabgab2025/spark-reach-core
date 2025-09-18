import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, Search, Code, MapPin, Eye, Settings, 
  Globe, BarChart3, Lock, Mail, Monitor
} from 'lucide-react';
import { useCMS, CMSSettings } from '@/hooks/useCMS';
import { useToast } from '@/hooks/use-toast';
import SettingsPreview from './SettingsPreview';
import SettingsDebugger from './SettingsDebugger';

const SettingsManager = () => {
  const [settings, setSettings] = useState<CMSSettings>({});
  const [isLoading, setIsLoading] = useState(false);
  const cms = useCMS();
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await cms.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await cms.updateSettings(settings);
      toast({
        title: "Settings Updated",
        description: "All settings have been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: keyof CMSSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">Configure your website settings and integrations</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save All Settings"}
        </Button>
      </div>

      {/* Settings Preview */}
      <SettingsPreview />

      {/* Settings Debugger */}
      <SettingsDebugger />

      {/* Maps Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Maps Configuration
          </CardTitle>
          <CardDescription>
            Configure Google Maps integration for contact page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="google_maps_api_key">Google Maps API Key</Label>
            <Input
              id="google_maps_api_key"
              value={settings.google_maps_api_key || ''}
              onChange={(e) => updateSetting('google_maps_api_key', e.target.value)}
              placeholder="Enter your Google Maps API key"
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Configure security features and authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email OTP Authentication
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable one-time password authentication via email
              </p>
            </div>
            <Switch
              checked={settings.email_otp_enabled || false}
              onCheckedChange={(checked) => updateSetting('email_otp_enabled', checked)}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              reCAPTCHA Configuration
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recaptcha_site_key">Site Key</Label>
                <Input
                  id="recaptcha_site_key"
                  value={settings.recaptcha_site_key || ''}
                  onChange={(e) => updateSetting('recaptcha_site_key', e.target.value)}
                  placeholder="6Lc..."
                />
              </div>
              <div>
                <Label htmlFor="recaptcha_secret_key">Secret Key</Label>
                <Input
                  id="recaptcha_secret_key"
                  type="password"
                  value={settings.recaptcha_secret_key || ''}
                  onChange={(e) => updateSetting('recaptcha_secret_key', e.target.value)}
                  placeholder="6Lc..."
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Logging & Monitoring
            </Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Application Logging</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable detailed application logging
                  </p>
                </div>
                <Switch
                  checked={settings.logging_enabled || false}
                  onCheckedChange={(checked) => updateSetting('logging_enabled', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Audit Logging</Label>
                  <p className="text-sm text-muted-foreground">
                    Track user actions and system changes
                  </p>
                </div>
                <Switch
                  checked={settings.audit_logging_enabled || false}
                  onCheckedChange={(checked) => updateSetting('audit_logging_enabled', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            SEO Configuration
          </CardTitle>
          <CardDescription>
            Configure analytics, tracking, and search engine optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="google_analytics_code" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Google Analytics ID
              </Label>
              <Input
                id="google_analytics_code"
                value={settings.google_analytics_code || ''}
                onChange={(e) => updateSetting('google_analytics_code', e.target.value)}
                placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
              />
            </div>
            <div>
              <Label htmlFor="google_tag_manager_code">Google Tag Manager ID</Label>
              <Input
                id="google_tag_manager_code"
                value={settings.google_tag_manager_code || ''}
                onChange={(e) => updateSetting('google_tag_manager_code', e.target.value)}
                placeholder="GTM-XXXXXXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="google_search_console_code">Google Search Console</Label>
              <Input
                id="google_search_console_code"
                value={settings.google_search_console_code || ''}
                onChange={(e) => updateSetting('google_search_console_code', e.target.value)}
                placeholder="Verification meta tag content"
              />
            </div>
            <div>
              <Label htmlFor="bing_webmaster_code">Bing Webmaster Tools</Label>
              <Input
                id="bing_webmaster_code"
                value={settings.bing_webmaster_code || ''}
                onChange={(e) => updateSetting('bing_webmaster_code', e.target.value)}
                placeholder="Verification meta tag content"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="meta_pixel_code">Meta Pixel ID</Label>
            <Input
              id="meta_pixel_code"
              value={settings.meta_pixel_code || ''}
              onChange={(e) => updateSetting('meta_pixel_code', e.target.value)}
              placeholder="Facebook Pixel ID"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Auto-generate Sitemap
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically generate and update sitemap.xml
                </p>
              </div>
              <Switch
                checked={settings.sitemap_enabled || false}
                onCheckedChange={(checked) => updateSetting('sitemap_enabled', checked)}
              />
            </div>

            <div>
              <Label htmlFor="robots_txt_content">Robots.txt Content</Label>
              <Textarea
                id="robots_txt_content"
                value={settings.robots_txt_content || ''}
                onChange={(e) => updateSetting('robots_txt_content', e.target.value)}
                placeholder="User-agent: *&#10;Disallow: /admin&#10;Sitemap: https://yoursite.com/sitemap.xml"
                rows={6}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Embedding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Code Embedding & Integrations
          </CardTitle>
          <CardDescription>
            Add custom code for third-party integrations and widgets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="chat_widget_code" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Chat Widget Code
            </Label>
            <Textarea
              id="chat_widget_code"
              value={settings.chat_widget_code || ''}
              onChange={(e) => updateSetting('chat_widget_code', e.target.value)}
              placeholder="Paste your chat widget embed code here (e.g., Intercom, Zendesk, Crisp)"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="custom_head_code">Custom Head Code</Label>
            <Textarea
              id="custom_head_code"
              value={settings.custom_head_code || ''}
              onChange={(e) => updateSetting('custom_head_code', e.target.value)}
              placeholder="HTML code to be inserted in the <head> section"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="custom_body_code">Custom Body Code</Label>
            <Textarea
              id="custom_body_code"
              value={settings.custom_body_code || ''}
              onChange={(e) => updateSetting('custom_body_code', e.target.value)}
              placeholder="HTML/JavaScript code to be inserted before closing </body> tag"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="third_party_integrations">Third-Party Integrations</Label>
            <Textarea
              id="third_party_integrations"
              value={settings.third_party_integrations || ''}
              onChange={(e) => updateSetting('third_party_integrations', e.target.value)}
              placeholder="JSON configuration for third-party integrations"
              rows={6}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Store API keys, webhook URLs, and configuration for external services
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} size="lg">
          {isLoading ? "Saving..." : "Save All Settings"}
        </Button>
      </div>
    </div>
  );
};

export default SettingsManager;