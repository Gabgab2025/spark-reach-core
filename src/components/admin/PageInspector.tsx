import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Code } from 'lucide-react';

const PageInspector = () => {
  const inspectPageHead = () => {
    const headContent = document.head.innerHTML;
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Page Head Inspector</title>
            <style>
              body { font-family: monospace; padding: 20px; background: #f5f5f5; }
              .highlight { background: yellow; }
              .script { color: blue; }
              .meta { color: green; }
              .link { color: purple; }
              pre { background: white; padding: 15px; border-radius: 5px; overflow-x: auto; }
            </style>
          </head>
          <body>
            <h1>Current Page Head Content</h1>
            <p>This shows everything currently in the &lt;head&gt; section:</p>
            <pre>${headContent
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/&lt;script/g, '<span class="script">&lt;script')
              .replace(/&lt;\/script&gt;/g, '&lt;/script&gt;</span>')
              .replace(/&lt;meta/g, '<span class="meta">&lt;meta')
              .replace(/&lt;link/g, '<span class="link">&lt;link')
              .replace(/(google-analytics|googletagmanager|fbq|gtag)/gi, '<span class="highlight">$1</span>')
            }</pre>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const checkNetworkTab = () => {
    alert(`
To check if your analytics are working:

1. Open Developer Tools (F12)
2. Go to Network tab
3. Reload the page
4. Look for these requests:
   - Google Analytics: google-analytics.com or googletagmanager.com
   - Google Tag Manager: googletagmanager.com/gtm.js
   - Meta Pixel: facebook.com/tr

If you don't see these requests, your configurations aren't being applied.
    `);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Page Inspector
        </CardTitle>
        <CardDescription>
          Inspect what's actually in your page headers and check network requests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={inspectPageHead} variant="outline">
            <Code className="mr-2 h-4 w-4" />
            View Page Head HTML
          </Button>
          <Button onClick={checkNetworkTab} variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Check Network Requests
          </Button>
        </div>
        
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>💡 How to verify SEO configurations:</strong>
          </p>
          <ul className="text-sm text-blue-800 mt-2 space-y-1">
            <li>• Click "View Page Head HTML" to see all scripts and meta tags</li>
            <li>• Click "Check Network Requests" for instructions on verifying analytics</li>
            <li>• Look for your Google Analytics ID, GTM code, or Meta Pixel ID</li>
            <li>• Make sure you're testing on a public page (not /admin)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PageInspector;