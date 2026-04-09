import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoEngine } from '@/core/ai-seo-engine';

// Enhanced StructuredData component using AI SEO Engine
// This component dynamically injects JSON-LD schemas for GEO, SEO, and AEO optimization

const StructuredData = () => {
  const location = useLocation();

  useEffect(() => {
    // Generate schemas inside effect so they can incorporate future dynamic data
    const localBusinessSchema = seoEngine.schema.generateLocalBusinessSchema();
    const organizationSchema = seoEngine.schema.generateOrganizationSchema();
    const websiteSchema = seoEngine.schema.generateWebSiteSchema();

    // Remove existing structured data scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // Add Local Business Schema (on all pages for GEO SEO)
    const localBusinessScript = document.createElement('script');
    localBusinessScript.type = 'application/ld+json';
    localBusinessScript.text = JSON.stringify(localBusinessSchema);
    document.head.appendChild(localBusinessScript);

    // Add Organization Schema (on all pages for AEO)
    const organizationScript = document.createElement('script');
    organizationScript.type = 'application/ld+json';
    organizationScript.text = JSON.stringify(organizationSchema);
    document.head.appendChild(organizationScript);

    // Add Website Schema (on all pages)
    const websiteScript = document.createElement('script');
    websiteScript.type = 'application/ld+json';
    websiteScript.text = JSON.stringify(websiteSchema);
    document.head.appendChild(websiteScript);

    // Add Services Schema on services page
    if (location.pathname === '/services' || location.pathname.startsWith('/services/')) {
      const servicesSchema = seoEngine.schema.generateServiceSchema(
        "Business Process Outsourcing",
        "Professional BPO services including inbound call center, outbound telemarketing, and email support"
      );
      const servicesScript = document.createElement('script');
      servicesScript.type = 'application/ld+json';
      servicesScript.text = JSON.stringify(servicesSchema);
      document.head.appendChild(servicesScript);
    }

    // Add Breadcrumb Schema on non-home pages
    if (location.pathname !== '/') {
      const breadcrumbSchema = seoEngine.schema.generateBreadcrumbSchema(location.pathname);
      const breadcrumbScript = document.createElement('script');
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.text = JSON.stringify(breadcrumbSchema);
      document.head.appendChild(breadcrumbScript);
    }

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => script.remove());
    };
  }, [location.pathname]);

  return null;
};

export default StructuredData;
