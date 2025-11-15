import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Local Business Schema for GEO SEO
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "JDGK Business Solutions Inc.",
  "image": "https://jdgkbusiness.com/og-image.jpg",
  "@id": "https://jdgkbusiness.com",
  "url": "https://jdgkbusiness.com",
  "telephone": "+63-XXX-XXX-XXXX",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Phase 1-B4 L1 Ridge Point Subdivision Prinza 1880",
    "addressLocality": "Teresa",
    "addressRegion": "Rizal",
    "postalCode": "1880",
    "addressCountry": "PH"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 14.542172875010287,
    "longitude": 121.22006609754878
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "opens": "08:00",
    "closes": "17:00"
  },
  "sameAs": [
    "https://www.facebook.com/jdgkbusiness",
    "https://www.linkedin.com/company/jdgkbusiness"
  ]
};

// Organization Schema for AEO
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "JDGK Business Solutions Inc.",
  "url": "https://jdgkbusiness.com",
  "logo": "https://jdgkbusiness.com/logo.png",
  "description": "Professional business solutions and client-focused services. Results driven approach with advanced technology, proven results, exceptional service.",
  "foundingDate": "2020",
  "slogan": "Results Driven, Client Focused",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+63-XXX-XXX-XXXX",
    "contactType": "customer service",
    "areaServed": "PH",
    "availableLanguage": ["English", "Filipino"]
  }
};

// Service Schema for AEO
const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Business Process Outsourcing",
  "provider": {
    "@type": "Organization",
    "name": "JDGK Business Solutions Inc."
  },
  "areaServed": {
    "@type": "Country",
    "name": "Philippines"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Business Solutions Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Inbound Call Center Services",
          "description": "Professional inbound customer service and support"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Outbound Call Center Services",
          "description": "Effective outbound sales and telemarketing"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Email Support Services",
          "description": "Comprehensive email customer support"
        }
      }
    ]
  }
};

// Breadcrumb Schema for AEO
const getBreadcrumbSchema = (pathname: string) => {
  const paths = pathname.split('/').filter(Boolean);
  
  const itemListElement = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://jdgkbusiness.com"
    }
  ];

  paths.forEach((path, index) => {
    const name = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
    itemListElement.push({
      "@type": "ListItem",
      "position": index + 2,
      "name": name,
      "item": `https://jdgkbusiness.com/${paths.slice(0, index + 1).join('/')}`
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement
  };
};

const StructuredData = () => {
  const location = useLocation();

  useEffect(() => {
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

    // Add Services Schema on services page
    if (location.pathname === '/services' || location.pathname.startsWith('/services/')) {
      const servicesScript = document.createElement('script');
      servicesScript.type = 'application/ld+json';
      servicesScript.text = JSON.stringify(servicesSchema);
      document.head.appendChild(servicesScript);
    }

    // Add Breadcrumb Schema on non-home pages
    if (location.pathname !== '/') {
      const breadcrumbScript = document.createElement('script');
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.text = JSON.stringify(getBreadcrumbSchema(location.pathname));
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
