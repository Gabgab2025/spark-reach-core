import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCMS } from '@/hooks/useCMS';

const SettingsRenderer = () => {
  const cms = useCMS();
  const location = useLocation();
  
  // Don't run on admin pages
  const isAdminPage = location.pathname.startsWith('/admin');

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
        
        // Apply chat widget code
        if (settings.chat_widget_code) {
          console.log('Applying chat widget code:', settings.chat_widget_code.substring(0, 100));
          
          // Create a temporary container to parse the HTML
          const tempContainer = document.createElement('div');
          tempContainer.innerHTML = settings.chat_widget_code;
          
          // Process each element in the widget code
          Array.from(tempContainer.children).forEach((element) => {
            const clonedElement = element.cloneNode(true) as HTMLElement;
            clonedElement.setAttribute('data-settings-applied', 'chat-widget');
            
            // If it's a script tag, we need to create a new script element for proper execution
            if (element.tagName === 'SCRIPT') {
              const scriptEl = element as HTMLScriptElement;
              const newScript = document.createElement('script');
              newScript.setAttribute('data-settings-applied', 'chat-widget');
              
              if (scriptEl.src) {
                newScript.src = scriptEl.src;
              } else {
                newScript.text = scriptEl.text;
              }
              
              if (scriptEl.type) newScript.type = scriptEl.type;
              if (scriptEl.async) newScript.async = scriptEl.async;
              if (scriptEl.defer) newScript.defer = scriptEl.defer;
              
              // Copy all other attributes
              Array.from(scriptEl.attributes).forEach(attr => {
                if (!['src', 'type', 'async', 'defer'].includes(attr.name)) {
                  newScript.setAttribute(attr.name, attr.value);
                }
              });
              
              document.body.appendChild(newScript);
            } else {
              // For non-script elements (like iframes), append directly
              document.body.appendChild(clonedElement);
            }
          });
          
          // Also handle any loose text or inline scripts
          if (tempContainer.innerHTML.includes('<script') && !tempContainer.children.length) {
            // Handle inline script tags that might not be parsed as elements
            const scriptContainer = document.createElement('div');
            scriptContainer.setAttribute('data-settings-applied', 'chat-widget');
            scriptContainer.innerHTML = settings.chat_widget_code;
            document.body.appendChild(scriptContainer);
          }
        }
        
        // Apply custom head code
        if (settings.custom_head_code) {
          console.log('Applying custom head code');
          const headContainer = document.createElement('div');
          headContainer.innerHTML = settings.custom_head_code;
          const scripts = headContainer.querySelectorAll('script');
          const styles = headContainer.querySelectorAll('style, link');
          const metas = headContainer.querySelectorAll('meta');
          
          // Add scripts to head
          scripts.forEach(script => {
            const scriptEl = script as HTMLScriptElement;
            const newScript = document.createElement('script');
            newScript.setAttribute('data-settings-applied', 'custom-head');
            if (scriptEl.src) {
              newScript.src = scriptEl.src;
            } else {
              newScript.innerHTML = scriptEl.innerHTML;
            }
            if (scriptEl.type) newScript.type = scriptEl.type;
            if (scriptEl.async) newScript.async = scriptEl.async;
            if (scriptEl.defer) newScript.defer = scriptEl.defer;
            document.head.appendChild(newScript);
          });
          
          // Add styles to head
          styles.forEach(style => {
            if (style.tagName === 'LINK') {
              const linkEl = style as HTMLLinkElement;
              const newLink = document.createElement('link');
              newLink.setAttribute('data-settings-applied', 'custom-head');
              Array.from(linkEl.attributes).forEach(attr => {
                newLink.setAttribute(attr.name, attr.value);
              });
              document.head.appendChild(newLink);
            } else {
              const styleEl = style as HTMLStyleElement;
              const newStyle = document.createElement('style');
              newStyle.setAttribute('data-settings-applied', 'custom-head');
              newStyle.innerHTML = styleEl.innerHTML;
              if (styleEl.type) newStyle.type = styleEl.type;
              document.head.appendChild(newStyle);
            }
          });
          
          // Add meta tags to head
          metas.forEach(meta => {
            const newMeta = document.createElement('meta');
            newMeta.setAttribute('data-settings-applied', 'custom-head');
            Array.from(meta.attributes).forEach(attr => {
              newMeta.setAttribute(attr.name, attr.value);
            });
            document.head.appendChild(newMeta);
          });
        }
        
        // Apply custom body code
        if (settings.custom_body_code) {
          console.log('Applying custom body code');
          const bodyContainer = document.createElement('div');
          bodyContainer.setAttribute('data-settings-applied', 'custom-body');
          bodyContainer.innerHTML = settings.custom_body_code;
          document.body.appendChild(bodyContainer);
        }
        
        // Apply Google Analytics
        if (settings.google_analytics_code) {
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
        
        // Apply Google Tag Manager
        if (settings.google_tag_manager_code) {
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
        
        // Apply Meta Pixel
        if (settings.meta_pixel_code) {
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
        
        // Apply verification meta tags
        if (settings.google_search_console_code) {
          console.log('Applying Google Search Console verification');
          const googleMeta = document.createElement('meta');
          googleMeta.setAttribute('data-settings-applied', 'google-verification');
          googleMeta.name = 'google-site-verification';
          googleMeta.content = settings.google_search_console_code;
          document.head.appendChild(googleMeta);
        }
        
        if (settings.bing_webmaster_code) {
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