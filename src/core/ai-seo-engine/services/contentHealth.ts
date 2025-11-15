// Content Health Service

import type { ContentHealthReport, PageSEOData } from '../types';
import { detectContentIssues, scoreContent, getCurrentTimestamp } from '../utils/helpers';

export class ContentHealthService {
  /**
   * Analyze content health and generate report
   */
  analyzeContentHealth(
    url: string,
    content: string,
    seoData: Partial<PageSEOData>
  ): ContentHealthReport {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Check content length
    const wordCount = content.split(/\s+/).length;
    if (wordCount < 300) {
      issues.push('Content is too short');
      recommendations.push('Add at least 300 words of quality content');
    }
    
    // Check for meta tags
    if (!seoData.metaTags?.title) {
      issues.push('Missing page title');
      recommendations.push('Add a descriptive title tag (50-60 characters)');
    }
    
    if (!seoData.metaTags?.description) {
      issues.push('Missing meta description');
      recommendations.push('Add a compelling meta description (150-160 characters)');
    }
    
    // Check for structured data
    if (!seoData.schemas || seoData.schemas.length === 0) {
      issues.push('No structured data found');
      recommendations.push('Add JSON-LD structured data for better search visibility');
    }
    
    // Check for EEAT signals
    if (!seoData.analysis?.eeat?.author) {
      issues.push('No author information');
      recommendations.push('Add author credentials to improve E-E-A-T signals');
    }
    
    // Check for FAQs
    if (!seoData.structuredContent?.faqs || seoData.structuredContent.faqs.length === 0) {
      recommendations.push('Consider adding FAQ section for better voice search optimization');
    }
    
    // Check for internal links
    const internalLinkCount = (content.match(/href=["']\/[^"']*["']/g) || []).length;
    if (internalLinkCount < 3) {
      issues.push('Insufficient internal linking');
      recommendations.push('Add 3-5 relevant internal links to other pages');
    }
    
    // Check for images
    const imageCount = (content.match(/<img/g) || []).length;
    if (imageCount === 0) {
      recommendations.push('Add relevant images to improve engagement and SEO');
    }
    
    // Check for headings
    const h1Count = (content.match(/<h1[^>]*>/g) || []).length;
    if (h1Count === 0) {
      issues.push('Missing H1 heading');
      recommendations.push('Add a single H1 heading with primary keyword');
    } else if (h1Count > 1) {
      issues.push('Multiple H1 headings found');
      recommendations.push('Use only one H1 heading per page');
    }
    
    // Check readability
    if (seoData.analysis?.readabilityScore && seoData.analysis.readabilityScore < 60) {
      issues.push('Content readability is low');
      recommendations.push('Simplify sentence structure and use shorter paragraphs');
    }
    
    // Detect additional issues
    const contentIssues = detectContentIssues(content);
    issues.push(...contentIssues);
    
    // Calculate overall health score
    const score = this.calculateHealthScore(issues, seoData);
    
    return {
      pageUrl: url,
      issues,
      recommendations,
      score,
      lastChecked: getCurrentTimestamp()
    };
  }

  /**
   * Calculate content health score
   */
  private calculateHealthScore(issues: string[], seoData: Partial<PageSEOData>): number {
    let score = 100;
    
    // Deduct points for issues
    score -= issues.length * 5;
    
    // Add points for positive signals
    if (seoData.metaTags?.title) score += 5;
    if (seoData.metaTags?.description) score += 5;
    if (seoData.schemas && seoData.schemas.length > 0) score += 10;
    if (seoData.analysis?.eeat?.author) score += 10;
    if (seoData.structuredContent?.faqs && seoData.structuredContent.faqs.length > 0) score += 10;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Check if content is outdated
   */
  isContentOutdated(lastModified: string, thresholdDays: number = 180): boolean {
    const lastModifiedDate = new Date(lastModified);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - lastModifiedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysDiff > thresholdDays;
  }

  /**
   * Generate content refresh recommendations
   */
  generateRefreshRecommendations(
    url: string,
    lastModified: string,
    currentScore: number
  ): string[] {
    const recommendations: string[] = [];
    
    if (this.isContentOutdated(lastModified)) {
      recommendations.push('Content is outdated - consider updating with current information');
      recommendations.push('Review and update statistics, dates, and references');
    }
    
    if (currentScore < 70) {
      recommendations.push('Overall SEO score is low - prioritize content improvements');
    }
    
    if (currentScore < 50) {
      recommendations.push('URGENT: Content requires immediate attention and optimization');
    }
    
    return recommendations;
  }

  /**
   * Detect missing EEAT signals
   */
  detectMissingEEAT(eeat?: Partial<PageSEOData['analysis']['eeat']>): string[] {
    const missing: string[] = [];
    
    if (!eeat?.author) missing.push('Author information');
    if (!eeat?.expertise) missing.push('Author expertise/credentials');
    if (!eeat?.trustSignals || eeat.trustSignals.length === 0) missing.push('Trust signals (awards, certifications, etc.)');
    
    return missing;
  }

  /**
   * Generate batch health report for multiple pages
   */
  generateBatchReport(pagesData: Array<{ url: string; data: Partial<PageSEOData> }>): {
    totalPages: number;
    averageScore: number;
    criticalIssues: number;
    topIssues: Array<{ issue: string; count: number }>;
    lowScoringPages: Array<{ url: string; score: number }>;
  } {
    const reports = pagesData.map(page => 
      this.analyzeContentHealth(page.url, '', page.data)
    );
    
    const totalPages = reports.length;
    const averageScore = reports.reduce((sum, r) => sum + r.score, 0) / totalPages;
    const criticalIssues = reports.filter(r => r.score < 50).length;
    
    // Count issue occurrences
    const issueCount = new Map<string, number>();
    reports.forEach(report => {
      report.issues.forEach(issue => {
        issueCount.set(issue, (issueCount.get(issue) || 0) + 1);
      });
    });
    
    const topIssues = Array.from(issueCount.entries())
      .map(([issue, count]) => ({ issue, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    const lowScoringPages = pagesData
      .map((page, i) => ({ url: page.url, score: reports[i].score }))
      .filter(p => p.score < 70)
      .sort((a, b) => a.score - b.score)
      .slice(0, 10);
    
    return {
      totalPages,
      averageScore: Math.round(averageScore),
      criticalIssues,
      topIssues,
      lowScoringPages
    };
  }
}
