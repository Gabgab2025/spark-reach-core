// Main AI SEO Engine Export

export * from './types';
export * from './services/geoEngine';
export * from './services/seoEngine';
export * from './services/aeoEngine';
export * from './services/contentHealth';
export * from './services/schemaGenerator';
export * from './utils/helpers';

import { GEOEngine } from './services/geoEngine';
import { SEOEngine } from './services/seoEngine';
import { AEOEngine } from './services/aeoEngine';
import { ContentHealthService } from './services/contentHealth';
import { SchemaGenerator } from './services/schemaGenerator';

/**
 * Main AI SEO Engine Class
 * Coordinates all SEO optimization services
 */
export class AISeEngine {
  public geo: GEOEngine;
  public seo: SEOEngine;
  public aeo: AEOEngine;
  public health: ContentHealthService;
  public schema: SchemaGenerator;

  constructor(baseUrl: string = 'https://jdgkbusiness.com') {
    this.geo = new GEOEngine();
    this.seo = new SEOEngine(baseUrl);
    this.aeo = new AEOEngine();
    this.health = new ContentHealthService();
    this.schema = new SchemaGenerator(baseUrl);
  }

  /**
   * Get current SEO engine status
   */
  getStatus() {
    return {
      version: '1.0.0',
      services: {
        geo: true,
        seo: true,
        aeo: true,
        health: true,
        schema: true
      },
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const seoEngine = new AISeEngine();
