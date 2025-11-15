// JSON-LD Schema generation service

import type { FAQItem } from '../types';

export class SchemaGenerator {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://jdgkbusiness.com') {
    this.baseUrl = baseUrl;
  }

  generateWebSiteSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "JDGK Business Solutions Inc.",
      "url": this.baseUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${this.baseUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
  }

  generateOrganizationSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "JDGK Business Solutions Inc.",
      "url": this.baseUrl,
      "logo": `${this.baseUrl}/logo.png`,
      "description": "Professional business solutions and client-focused services. Results driven approach with advanced technology, proven results, exceptional service.",
      "foundingDate": "2020",
      "slogan": "Results Driven, Client Focused",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+63-XXX-XXX-XXXX",
        "contactType": "customer service",
        "areaServed": "PH",
        "availableLanguage": ["English", "Filipino"]
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Phase 1-B4 L1 Ridge Point Subdivision Prinza 1880",
        "addressLocality": "Teresa",
        "addressRegion": "Rizal",
        "postalCode": "1880",
        "addressCountry": "PH"
      }
    };
  }

  generateLocalBusinessSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "JDGK Business Solutions Inc.",
      "image": `${this.baseUrl}/og-image.jpg`,
      "@id": this.baseUrl,
      "url": this.baseUrl,
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
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "17:00"
      }
    };
  }

  generateWebPageSchema(url: string, name: string, description: string, dateModified?: string) {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": name,
      "description": description,
      "url": url,
      "dateModified": dateModified || new Date().toISOString(),
      "publisher": {
        "@type": "Organization",
        "name": "JDGK Business Solutions Inc."
      }
    };
  }

  generateArticleSchema(
    url: string,
    headline: string,
    description: string,
    datePublished: string,
    dateModified: string,
    author: string,
    imageUrl?: string
  ) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": headline,
      "description": description,
      "url": url,
      "datePublished": datePublished,
      "dateModified": dateModified,
      "author": {
        "@type": "Person",
        "name": author
      },
      "publisher": {
        "@type": "Organization",
        "name": "JDGK Business Solutions Inc.",
        "logo": {
          "@type": "ImageObject",
          "url": `${this.baseUrl}/logo.png`
        }
      },
      ...(imageUrl && {
        "image": {
          "@type": "ImageObject",
          "url": imageUrl
        }
      })
    };
  }

  generateFAQSchema(faqs: FAQItem[]) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  generateBreadcrumbSchema(pathname: string) {
    const paths = pathname.split('/').filter(Boolean);
    const itemListElement = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": this.baseUrl
      }
    ];

    paths.forEach((path, index) => {
      const name = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      itemListElement.push({
        "@type": "ListItem",
        "position": index + 2,
        "name": name,
        "item": `${this.baseUrl}/${paths.slice(0, index + 1).join('/')}`
      });
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": itemListElement
    };
  }

  generateSpeakableSchema(speakableSelectors: string[]) {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": speakableSelectors
      }
    };
  }

  generateHowToSchema(name: string, description: string, steps: Array<{ step: number; instruction: string }>) {
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": name,
      "description": description,
      "step": steps.map(s => ({
        "@type": "HowToStep",
        "position": s.step,
        "text": s.instruction
      }))
    };
  }

  generateServiceSchema(name: string, description: string, provider: string = "JDGK Business Solutions Inc.") {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": name,
      "description": description,
      "provider": {
        "@type": "Organization",
        "name": provider
      },
      "areaServed": {
        "@type": "Country",
        "name": "Philippines"
      }
    };
  }
}
