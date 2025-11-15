// SEO Engine Service

import type { MetaTags } from '../types';
import { generateCanonicalUrl, truncateText } from '../utils/helpers';

export class SEOEngine {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://jdgkbusiness.com') {
    this.baseUrl = baseUrl;
  }

  /**
   * Generate comprehensive meta tags for a page
   */
  generateMetaTags(
    title: string,
    description: string,
    path: string,
    keywords?: string[],
    imageUrl?: string
  ): MetaTags {
    const canonical = generateCanonicalUrl(path, this.baseUrl);
    const ogImage = imageUrl || `${this.baseUrl}/og-image.jpg`;
    
    return {
      title: truncateText(title, 60),
      description: truncateText(description, 160),
      keywords: keywords?.join(', '),
      canonical,
      ogTitle: truncateText(title, 70),
      ogDescription: truncateText(description, 200),
      ogImage,
      twitterCard: 'summary_large_image',
      twitterTitle: truncateText(title, 70),
      twitterDescription: truncateText(description, 200)
    };
  }

  /**
   * Generate sitemap entry
   */
  generateSitemapEntry(
    url: string,
    priority: number = 0.8,
    changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly',
    lastmod?: string
  ) {
    return {
      url: `${this.baseUrl}${url}`,
      lastmod: lastmod || new Date().toISOString().split('T')[0],
      changefreq,
      priority
    };
  }

  /**
   * Generate robots.txt directives
   */
  generateRobotsTxt(
    allowedPaths: string[] = ['/'],
    disallowedPaths: string[] = ['/admin', '/api'],
    sitemapUrl?: string
  ): string {
    const sitemap = sitemapUrl || `${this.baseUrl}/sitemap.xml`;
    
    let robotsTxt = `User-agent: *\n`;
    
    allowedPaths.forEach(path => {
      robotsTxt += `Allow: ${path}\n`;
    });
    
    disallowedPaths.forEach(path => {
      robotsTxt += `Disallow: ${path}\n`;
    });
    
    robotsTxt += `\nSitemap: ${sitemap}\n`;
    
    return robotsTxt;
  }

  /**
   * Calculate internal link score
   */
  calculateInternalLinkScore(pageContent: string, allPageUrls: string[]): number {
    let score = 0;
    const links = this.extractInternalLinks(pageContent);
    
    // Points for having internal links
    if (links.length > 0) score += 20;
    if (links.length >= 3) score += 20;
    if (links.length >= 5) score += 20;
    
    // Points for linking to important pages
    const importantPages = ['/about', '/services', '/contact'];
    const hasImportantLinks = importantPages.some(page => 
      links.some(link => link.includes(page))
    );
    if (hasImportantLinks) score += 20;
    
    // Points for varied linking
    const uniqueLinks = new Set(links).size;
    if (uniqueLinks === links.length) score += 20;
    
    return Math.min(100, score);
  }

  /**
   * Extract internal links from content
   */
  private extractInternalLinks(content: string): string[] {
    const linkPattern = /<a[^>]*href=["']([^"']*)["'][^>]*>/gi;
    const links: string[] = [];
    let match;
    
    while ((match = linkPattern.exec(content)) !== null) {
      const href = match[1];
      if (href.startsWith('/') || href.startsWith(this.baseUrl)) {
        links.push(href);
      }
    }
    
    return links;
  }

  /**
   * Generate optimal page title
   */
  generateOptimalTitle(pageTitle: string, includeCompany: boolean = true): string {
    const companyName = 'JDGK Business Solutions';
    const separator = ' | ';
    
    if (!includeCompany) return pageTitle;
    
    const combined = `${pageTitle}${separator}${companyName}`;
    return combined.length <= 60 ? combined : pageTitle;
  }

  /**
   * Validate meta tags
   */
  validateMetaTags(tags: MetaTags): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (!tags.title) issues.push('Missing title');
    if (tags.title && tags.title.length > 60) issues.push('Title too long (max 60 chars)');
    if (!tags.description) issues.push('Missing description');
    if (tags.description && tags.description.length > 160) issues.push('Description too long (max 160 chars)');
    if (!tags.canonical) issues.push('Missing canonical URL');
    
    return {
      valid: issues.length === 0,
      issues
    };
  }
}
