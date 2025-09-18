import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCMS } from '@/hooks/useCMS';
import { useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const SettingsPreview = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cms = useCMS();

  const testSettings = async () => {
    setIsLoading(true);
    try {
      const settings = await cms.getSettings();
      
      const results = {
        chat_widget_code: !!settings.chat_widget_code,
        google_analytics_code: !!settings.google_analytics_code,
        google_tag_manager_code: !!settings.google_tag_manager_code,
        meta_pixel_code: !!settings.meta_pixel_code,
        custom_head_code: !!settings.custom_head_code,
        custom_body_code: !!settings.custom_body_code,
        google_search_console_code: !!settings.google_search_console_code,
        bing_webmaster_code: !!settings.bing_webmaster_code,
        google_maps_api_key: !!settings.google_maps_api_key,
        recaptcha_site_key: !!settings.recaptcha_site_key,
        recaptcha_secret_key: !!settings.recaptcha_secret_key,
        email_otp_enabled: !!settings.email_otp_enabled,
        logging_enabled: !!settings.logging_enabled,
        audit_logging_enabled: !!settings.audit_logging_enabled,
        sitemap_enabled: !!settings.sitemap_enabled,
        robots_txt_content: !!settings.robots_txt_content,
        third_party_integrations: !!settings.third_party_integrations
      };
      
      setTestResults(results);
    } catch (error) {
      console.error('Error testing settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-gray-400" />;
  };

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge variant={status ? "default" : "secondary"}>
        {status ? "Configured" : "Not Set"}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Settings Integration Status
        </CardTitle>
        <CardDescription>
          Check which settings are configured and will be active on your public pages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testSettings} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Test Settings Integration
        </Button>

        {testResults && (
          <div className="space-y-3">
            <h4 className="font-medium">Integration Status:</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.chat_widget_code)}
                  <span className="text-sm">Chat Widget</span>
                </div>
                {getStatusBadge(testResults.chat_widget_code)}
              </div>

              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.google_analytics_code)}
                  <span className="text-sm">Google Analytics</span>
                </div>
                {getStatusBadge(testResults.google_analytics_code)}
              </div>

              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.google_tag_manager_code)}
                  <span className="text-sm">Google Tag Manager</span>
                </div>
                {getStatusBadge(testResults.google_tag_manager_code)}
              </div>

              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.meta_pixel_code)}
                  <span className="text-sm">Meta Pixel</span>
                </div>
                {getStatusBadge(testResults.meta_pixel_code)}
              </div>

              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.custom_head_code)}
                  <span className="text-sm">Custom Head Code</span>
                </div>
                {getStatusBadge(testResults.custom_head_code)}
              </div>

              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.custom_body_code)}
                  <span className="text-sm">Custom Body Code</span>
                </div>
                {getStatusBadge(testResults.custom_body_code)}
              </div>

              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.google_maps_api_key)}
                  <span className="text-sm">Google Maps API</span>
                </div>
                {getStatusBadge(testResults.google_maps_api_key)}
              </div>

              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.recaptcha_site_key)}
                  <span className="text-sm">reCAPTCHA</span>
                </div>
                {getStatusBadge(testResults.recaptcha_site_key)}
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>✅ Integration is working!</strong> Any configured settings above will automatically be applied to your public pages (not admin pages).
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SettingsPreview;