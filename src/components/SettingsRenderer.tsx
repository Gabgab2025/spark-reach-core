import { useEffect } from 'react';
import { useCMS } from '@/hooks/useCMS';

const SettingsRenderer = () => {
  const cms = useCMS();

  useEffect(() => {
    const loadAndApplySettings = async () => {
      try {
        const settings = await cms.getSettings();
        
        // Apply chat widget code
        if (settings.chat_widget_code) {
          const chatWidgetContainer = document.createElement('div');
          chatWidgetContainer.innerHTML = settings.chat_widget_code;
          document.body.appendChild(chatWidgetContainer);
        }
        
        // Apply custom head code
        if (settings.custom_head_code) {
          const headContainer = document.createElement('div');
          headContainer.innerHTML = settings.custom_head_code;
          const scripts = headContainer.querySelectorAll('script');
          const styles = headContainer.querySelectorAll('style, link');
          const metas = headContainer.querySelectorAll('meta');
          
          // Add scripts to head
          scripts.forEach(script => {
            const scriptEl = script as HTMLScriptElement;
            const newScript = document.createElement('script');
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
              Array.from(linkEl.attributes).forEach(attr => {
                newLink.setAttribute(attr.name, attr.value);
              });
              document.head.appendChild(newLink);
            } else {
              const styleEl = style as HTMLStyleElement;
              const newStyle = document.createElement('style');
              newStyle.innerHTML = styleEl.innerHTML;
              if (styleEl.type) newStyle.type = styleEl.type;
              document.head.appendChild(newStyle);
            }
          });
          
          // Add meta tags to head
          metas.forEach(meta => {
            const newMeta = document.createElement('meta');
            Array.from(meta.attributes).forEach(attr => {
              newMeta.setAttribute(attr.name, attr.value);
            });
            document.head.appendChild(newMeta);
          });
        }
        
        // Apply custom body code
        if (settings.custom_body_code) {
          const bodyContainer = document.createElement('div');
          bodyContainer.innerHTML = settings.custom_body_code;
          document.body.appendChild(bodyContainer);
        }
        
        // Apply Google Analytics
        if (settings.google_analytics_code) {
          // Google Analytics 4
          if (settings.google_analytics_code.startsWith('G-')) {
            const script1 = document.createElement('script');
            script1.async = true;
            script1.src = `https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_code}`;
            document.head.appendChild(script1);
            
            const script2 = document.createElement('script');
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
          // GTM Head Script
          const gtmHeadScript = document.createElement('script');
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
          gtmBodyNoScript.innerHTML = `
            <iframe src="https://www.googletagmanager.com/ns.html?id=${settings.google_tag_manager_code}"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>
          `;
          document.body.insertBefore(gtmBodyNoScript, document.body.firstChild);
        }
        
        // Apply Meta Pixel
        if (settings.meta_pixel_code) {
          const fbScript = document.createElement('script');
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
          fbNoscript.innerHTML = `
            <img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=${settings.meta_pixel_code}&ev=PageView&noscript=1"/>
          `;
          document.body.appendChild(fbNoscript);
        }
        
        // Apply verification meta tags
        if (settings.google_search_console_code) {
          const googleMeta = document.createElement('meta');
          googleMeta.name = 'google-site-verification';
          googleMeta.content = settings.google_search_console_code;
          document.head.appendChild(googleMeta);
        }
        
        if (settings.bing_webmaster_code) {
          const bingMeta = document.createElement('meta');
          bingMeta.name = 'msvalidate.01';
          bingMeta.content = settings.bing_webmaster_code;
          document.head.appendChild(bingMeta);
        }
        
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadAndApplySettings();
  }, [cms]);
  
  return null; // This component doesn't render anything visible
};

export default SettingsRenderer;