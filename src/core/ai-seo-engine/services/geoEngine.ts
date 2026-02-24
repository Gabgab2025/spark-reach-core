// GEO (Generative Engine Optimization) Service

import type { ContentAnalysis, EEATMetadata, StructuredContent } from '../types';
import { calculateReadabilityScore, extractKeywords, getCurrentTimestamp } from '../utils/helpers';

export class GEOEngine {
  /**
   * Analyze page content for AI optimization
   */
  async analyzeContent(
    url: string,
    content: string,
    metadata?: Partial<EEATMetadata>
  ): Promise<ContentAnalysis> {
    const keywords = extractKeywords(content);
    const readabilityScore = calculateReadabilityScore(content);
    
    // Generate summaries
    const shortSummary = this.generateShortSummary(content);
    const longSummary = this.generateLongSummary(content);
    
    // Detect content intent
    const intent = this.detectContentIntent(content, url);
    
    // Calculate AI optimization score
    const aiOptimizationScore = this.calculateAIScore(content, keywords, readabilityScore);
    
    return {
      pageUrl: url,
      intent,
      shortSummary,
      longSummary,
      eeat: {
        lastUpdated: getCurrentTimestamp(),
        contentType: this.detectContentType(url),
        ...metadata
      },
      keywords,
      readabilityScore,
      aiOptimizationScore
    };
  }

  /**
   * Generate AI-friendly short summary (for featured snippets)
   */
  private generateShortSummary(content: string): string {
    // Extract first meaningful paragraph
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 50);
    if (paragraphs.length === 0) return content.substring(0, 160);
    
    const firstParagraph = paragraphs[0].replace(/<[^>]*>/g, '').trim();
    return firstParagraph.length > 160 
      ? firstParagraph.substring(0, 157) + '...'
      : firstParagraph;
  }

  /**
   * Generate AI-friendly long summary (for AI assistants)
   */
  private generateLongSummary(content: string): string {
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    // Take first 3-5 sentences for summary
    const summaryLength = Math.min(5, Math.max(3, sentences.length));
    return sentences.slice(0, summaryLength).join('. ') + '.';
  }

  /**
   * Detect content intent (informational, transactional, navigational)
   */
  private detectContentIntent(content: string, url: string): string {
    const lowerContent = content.toLowerCase();
    const lowerUrl = url.toLowerCase();
    
    // Transactional keywords
    const transactionalKeywords = ['buy', 'purchase', 'order', 'contact', 'get quote', 'pricing', 'hire'];
    if (transactionalKeywords.some(k => lowerContent.includes(k) || lowerUrl.includes(k))) {
      return 'transactional';
    }
    
    // Navigational keywords
    if (lowerUrl.includes('about') || lowerUrl.includes('contact') || lowerUrl.includes('team')) {
      return 'navigational';
    }
    
    // Default to informational
    return 'informational';
  }

  /**
   * Detect content type from URL
   */
  private detectContentType(url: string): string {
    if (url.includes('/blog/')) return 'blog';
    if (url.includes('/services/')) return 'service';
    if (url.includes('/about')) return 'about';
    if (url.includes('/contact')) return 'contact';
    if (url.includes('/careers') || url.includes('/jobs')) return 'careers';
    return 'page';
  }

  /**
   * Calculate AI optimization score
   */
  private calculateAIScore(content: string, keywords: string[], readabilityScore: number): number {
    let score = 0;
    
    // Readability (40 points)
    score += (readabilityScore / 100) * 40;
    
    // Keyword density (30 points)
    const wordCount = content.split(/\s+/).length;
    const keywordDensity = (keywords.length / wordCount) * 100;
    score += Math.min(30, keywordDensity * 6);
    
    // Content length (30 points)
    if (wordCount >= 500) score += 30;
    else if (wordCount >= 300) score += 20;
    else if (wordCount >= 150) score += 10;
    
    return Math.round(Math.min(100, score));
  }

  /**
   * Generate contextual FAQs based on content
   */
  async generateContextualFAQs(content: string, topic: string): Promise<StructuredContent['faqs']> {
    // This would ideally use AI, but we'll provide a basic structure
    // In production, this should call an AI service for dynamic generation
    
    const commonFAQs = [
      {
        question: `What services does JDGK Business Solutions offer?`,
        answer: 'JDGK Business Solutions offers comprehensive BPO services including inbound and outbound call center solutions, email support, and customer service management.'
      },
      {
        question: `Where is JDGK Business Solutions located?`,
        answer: 'We are located at Phase 1-B4 L1 Ridge Point Subdivision Prinza 1880, Teresa, Rizal 1880, Philippines.'
      },
      {
        question: `How can I contact JDGK Business Solutions?`,
        answer: 'You can contact us through our website contact form, call us during business hours (Monday-Friday, 8:00 AM - 5:00 PM), or visit our office in Teresa, Rizal.'
      }
    ];
    
    return commonFAQs;
  }

  /**
   * Generate speakable content for voice assistants
   */
  generateSpeakableContent(content: string): string[] {
    // Extract key sentences that would sound natural when spoken
    const sentences = content
      .replace(/<[^>]*>/g, '')
      .split(/[.!?]+/)
      .filter(s => s.trim().length > 20 && s.trim().length < 200)
      .slice(0, 5);
    
    return sentences;
  }

  /**
   * Generate answer blocks for AI assistants
   */
  generateAnswerBlocks(content: string, keywords: string[]): string[] {
    const blocks: string[] = [];
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 50);
    
    // Find paragraphs containing keywords
    paragraphs.forEach(paragraph => {
      const cleanPara = paragraph.replace(/<[^>]*>/g, '').trim();
      const hasKeyword = keywords.some(k => cleanPara.toLowerCase().includes(k));
      
      if (hasKeyword && cleanPara.length <= 300) {
        blocks.push(cleanPara);
      }
    });
    
    return blocks.slice(0, 3);
  }
}
