import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCMS } from '@/hooks/useCMS';
import DOMPurify from 'dompurify';

// Validation patterns for tracking IDs — reject anything that isn't a real ID
const TRACKING_ID_PATTERNS: Record<string, RegExp> = {
  google_analytics_code: /^(G|UA)-[A-Z0-9-]+$/i,
  google_tag_manager_code: /^GTM-[A-Z0-9]+$/i,
  meta_pixel_code: /^[0-9]+$/,
  google_search_console_code: /^[A-Za-z0-9_-]+$/,
  bing_webmaster_code: /^[A-Fa-f0-9]+$/,
};

function isValidTrackingId(key: string, value: string): boolean {
  const pattern = TRACKING_ID_PATTERNS[key];
  if (!pattern) return true; // No pattern = allow
  return pattern.test(value.trim());
}

/** Sanitize raw HTML snippets (chat widget, custom head/body) — strip scripts & event handlers */
function sanitizeHtmlSnippet(html: string): string {
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ['iframe', 'link', 'meta', 'style', 'noscript'],
    ADD_ATTR: ['target', 'rel', 'content', 'property', 'charset', 'http-equiv', 'allow', 'allowfullscreen', 'frameborder', 'loading'],
    FORBID_TAGS: ['script'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });
}

const SettingsRenderer = () => {
  const cms = useCMS();
  const location = useLocation();
  
  // Don't run on admin pages
  const isAdminPage = location.pathname.startsWith('/auth-proadmin2025');

  useEffect(() => {
    // Don't load settings on admin pages
    if (isAdminPage) {
      console.log('SettingsRenderer: Skipping settings load - on admin page');
      return;
    }
    
    let hasAppliedSettings = false;
    
    const loadAndApplySettings = async () => {
      // Prevent multiple executions
      if (hasAppliedSettings) return;
      hasAppliedSettings = true;
      
      try {
        console.log('Loading and applying website settings...');
        const settings = await cms.getSettings();
        
        // Remove any previously added settings elements
        const existingElements = document.querySelectorAll('[data-settings-applied]');
        existingElements.forEach(el => el.remove());
        
        // Apply chat widget code (sanitized — no inline scripts allowed)
        if (settings.chat_widget_code) {
          console.log('Applying chat widget code (sanitized)');
          const sanitized = sanitizeHtmlSnippet(settings.chat_widget_code);
          if (sanitized.trim()) {
            const container = document.createElement('div');
            container.setAttribute('data-settings-applied', 'chat-widget');
            container.innerHTML = sanitized;
            document.body.appendChild(container);
          }
        }
        
        // Apply custom head code (sanitized — scripts stripped, styles/meta/links preserved)
        if (settings.custom_head_code) {
          console.log('Applying custom head code (sanitized)');
          const sanitized = sanitizeHtmlSnippet(settings.custom_head_code);
          const headContainer = document.createElement('div');
          headContainer.innerHTML = sanitized;

          // Extract and append safe elements to <head>
          headContainer.querySelectorAll('style, link').forEach(el => {
            const clone = el.cloneNode(true) as HTMLElement;
            clone.setAttribute('data-settings-applied', 'custom-head');
            document.head.appendChild(clone);
          });
          headContainer.querySelectorAll('meta').forEach(el => {
            const clone = el.cloneNode(true) as HTMLElement;
            clone.setAttribute('data-settings-applied', 'custom-head');
            document.head.appendChild(clone);
          });
        }
        
        // Apply custom body code (sanitized)
        if (settings.custom_body_code) {
          console.log('Applying custom body code (sanitized)');
          const sanitized = sanitizeHtmlSnippet(settings.custom_body_code);
          if (sanitized.trim()) {
            const bodyContainer = document.createElement('div');
            bodyContainer.setAttribute('data-settings-applied', 'custom-body');
            bodyContainer.innerHTML = sanitized;
            document.body.appendChild(bodyContainer);
          }
        }
        
        // Apply Google Analytics (validated ID format)
        if (settings.google_analytics_code && isValidTrackingId('google_analytics_code', settings.google_analytics_code)) {
          console.log('Applying Google Analytics');
          // Google Analytics 4
          if (settings.google_analytics_code.startsWith('G-')) {
            const script1 = document.createElement('script');
            script1.setAttribute('data-settings-applied', 'google-analytics');
            script1.async = true;
            script1.src = `https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_code}`;
            document.head.appendChild(script1);
            
            const script2 = document.createElement('script');
            script2.setAttribute('data-settings-applied', 'google-analytics');
            script2.innerHTML = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${settings.google_analytics_code}');
            `;
            document.head.appendChild(script2);
          }
          // Universal Analytics
          else if (settings.google_analytics_code.startsWith('UA-')) {
            const script = document.createElement('script');
            script.setAttribute('data-settings-applied', 'google-analytics');
            script.innerHTML = `
              (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
              })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
              ga('create', '${settings.google_analytics_code}', 'auto');
              ga('send', 'pageview');
            `;
            document.head.appendChild(script);
          }
        }
        
        // Apply Google Tag Manager (validated ID format)
        if (settings.google_tag_manager_code && isValidTrackingId('google_tag_manager_code', settings.google_tag_manager_code)) {
          // Check if GTM is already on the page (e.g. from index.html)
          const existingGTM = document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${settings.google_tag_manager_code}"]`);
          
          if (existingGTM && !existingGTM.hasAttribute('data-settings-applied')) {
            console.log('GTM already present in static HTML, skipping injection');
          } else {
            console.log('Applying Google Tag Manager');
            // GTM Head Script
            const gtmHeadScript = document.createElement('script');
            gtmHeadScript.setAttribute('data-settings-applied', 'google-tag-manager');
            gtmHeadScript.innerHTML = `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${settings.google_tag_manager_code}');
            `;
            document.head.appendChild(gtmHeadScript);
            
            // GTM Body NoScript
            const gtmBodyNoScript = document.createElement('noscript');
            gtmBodyNoScript.setAttribute('data-settings-applied', 'google-tag-manager');
            gtmBodyNoScript.innerHTML = `
              <iframe src="https://www.googletagmanager.com/ns.html?id=${settings.google_tag_manager_code}"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `;
            document.body.insertBefore(gtmBodyNoScript, document.body.firstChild);
          }
        }
        
        // Apply Meta Pixel (validated ID format)
        if (settings.meta_pixel_code && isValidTrackingId('meta_pixel_code', settings.meta_pixel_code)) {
          console.log('Applying Meta Pixel');
          const fbScript = document.createElement('script');
          fbScript.setAttribute('data-settings-applied', 'meta-pixel');
          fbScript.innerHTML = `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${settings.meta_pixel_code}');
            fbq('track', 'PageView');
          `;
          document.head.appendChild(fbScript);
          
          const fbNoscript = document.createElement('noscript');
          fbNoscript.setAttribute('data-settings-applied', 'meta-pixel');
          fbNoscript.innerHTML = `
            <img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=${settings.meta_pixel_code}&ev=PageView&noscript=1"/>
          `;
          document.body.appendChild(fbNoscript);
        }
        
        // Apply verification meta tags (validated format)
        if (settings.google_search_console_code && isValidTrackingId('google_search_console_code', settings.google_search_console_code)) {
          console.log('Applying Google Search Console verification');
          const googleMeta = document.createElement('meta');
          googleMeta.setAttribute('data-settings-applied', 'google-verification');
          googleMeta.name = 'google-site-verification';
          googleMeta.content = settings.google_search_console_code;
          document.head.appendChild(googleMeta);
        }
        
        if (settings.bing_webmaster_code && isValidTrackingId('bing_webmaster_code', settings.bing_webmaster_code)) {
          console.log('Applying Bing Webmaster verification');
          const bingMeta = document.createElement('meta');
          bingMeta.setAttribute('data-settings-applied', 'bing-verification');
          bingMeta.name = 'msvalidate.01';
          bingMeta.content = settings.bing_webmaster_code;
          document.head.appendChild(bingMeta);
        }
        
        console.log('Settings applied successfully');
        
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadAndApplySettings();
    
    // Cleanup function
    return () => {
      const settingsElements = document.querySelectorAll('[data-settings-applied]');
      settingsElements.forEach(el => el.remove());
    };
  }, [cms, isAdminPage, location.pathname]);
  
  return null; // This component doesn't render anything visible
};

export default SettingsRenderer;