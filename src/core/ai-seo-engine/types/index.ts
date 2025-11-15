// Core types for the AI-powered SEO engine

export interface SEOScore {
  overall: number;
  geo: number;
  seo: number;
  aeo: number;
  timestamp: string;
}

export interface EEATMetadata {
  author?: string;
  lastUpdated: string;
  contentType: string;
  expertise?: string;
  trustSignals?: string[];
}

export interface ContentAnalysis {
  pageUrl: string;
  intent: string;
  shortSummary: string;
  longSummary: string;
  eeat: EEATMetadata;
  keywords: string[];
  readabilityScore: number;
  aiOptimizationScore: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface StructuredContent {
  faqs: FAQItem[];
  speakableContent?: string[];
  answerBlocks?: string[];
  stepByStep?: Array<{ step: number; instruction: string }>;
}

export interface MetaTags {
  title: string;
  description: string;
  keywords?: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
}

export interface ContentHealthReport {
  pageUrl: string;
  issues: string[];
  recommendations: string[];
  score: number;
  lastChecked: string;
}

export interface SEOEngineConfig {
  enableGEO: boolean;
  enableSEO: boolean;
  enableAEO: boolean;
  autoGenerateFAQs: boolean;
  autoGenerateSummaries: boolean;
  contentHealthChecks: boolean;
}

export interface PageSEOData {
  url: string;
  analysis: ContentAnalysis;
  structuredContent: StructuredContent;
  metaTags: MetaTags;
  schemas: any[];
  healthReport: ContentHealthReport;
  score: SEOScore;
}
