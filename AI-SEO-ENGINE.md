# AI SEO Engine Documentation

## Overview

The AI SEO Engine is a comprehensive optimization system that enhances your website's visibility across search engines, AI assistants, and voice platforms. It operates entirely in the background without affecting your UI.

## Features

### 1. GEO (Generative Engine Optimization)
- **AI-Friendly Summaries**: Automatically generates short and long summaries optimized for AI assistants
- **EEAT Metadata**: Adds Experience, Expertise, Authoritativeness, and Trustworthiness signals
- **Content Analysis**: Analyzes page intent, keywords, and readability
- **Contextual FAQs**: Generates relevant FAQs injected via JSON-LD
- **Answer Blocks**: Creates structured answer blocks for AI systems

### 2. SEO (Search Engine Optimization)
- **JSON-LD Schemas**: Automatic generation of WebSite, Organization, WebPage, Article, FAQ, and Breadcrumb schemas
- **Meta Tag Generation**: Auto-generates optimized title, description, Open Graph, and Twitter cards
- **Canonical URLs**: Automatic canonical URL generation for all pages
- **Internal Link Scoring**: Analyzes and scores internal linking structure
- **Sitemap Management**: Works with existing sitemap.xml
- **Robots.txt Management**: Works with existing robots.txt

### 3. AEO (Answer Engine Optimization)
- **Speakable Content**: Generates content optimized for voice assistants (Google Speakable)
- **Answer Blocks**: Creates direct answer blocks for featured snippets
- **Step-by-Step Instructions**: Extracts and formats procedural content
- **Multi-Format Responses**: Generates answers for text, voice, and visual interfaces
- **Featured Snippets**: Optimizes content for featured snippet positions

### 4. Content Health System
- **Automated Analysis**: Detects outdated content, missing metadata, and low EEAT signals
- **Issue Detection**: Identifies content length, heading, and structure issues
- **Recommendations**: Provides actionable suggestions for improvement
- **Batch Reporting**: Generates comprehensive reports for multiple pages
- **Scoring System**: Rates content health from 0-100

## Architecture

```
src/core/ai-seo-engine/
├── services/
│   ├── geoEngine.ts       # GEO optimization logic
│   ├── seoEngine.ts       # SEO optimization logic
│   ├── aeoEngine.ts       # AEO optimization logic
│   ├── contentHealth.ts   # Content health analysis
│   └── schemaGenerator.ts # JSON-LD schema generation
├── types/
│   └── index.ts           # TypeScript types
├── utils/
│   └── helpers.ts         # Utility functions
└── index.ts               # Main export
```

## Usage

### Basic Usage

```typescript
import { seoEngine } from '@/core/ai-seo-engine';

// Analyze content
const analysis = await seoEngine.geo.analyzeContent(
  '/about',
  'Your page content here',
  { author: 'John Doe' }
);

// Generate meta tags
const metaTags = seoEngine.seo.generateMetaTags(
  'About Us',
  'Learn about our company',
  '/about'
);

// Generate schemas
const articleSchema = seoEngine.schema.generateArticleSchema(
  'https://example.com/article',
  'Article Title',
  'Article description',
  '2025-01-15',
  '2025-01-15',
  'Author Name'
);

// Check content health
const healthReport = seoEngine.health.analyzeContentHealth(
  '/services',
  'Your content',
  { metaTags, schemas: [articleSchema] }
);
```

### Automated Integration

The engine is already integrated into your application through the enhanced `StructuredData` component. All pages automatically receive:

- Local Business schema
- Organization schema
- Website schema
- Breadcrumb schema (on non-home pages)
- Service schema (on service pages)

## Admin Dashboard

Access the admin dashboard at `/admin/seo-engine` (requires admin authentication).

### Dashboard Features:
- **Overall Score**: Combined GEO + SEO + AEO performance
- **Individual Scores**: Separate scores for GEO, SEO, and AEO
- **Content Health Reports**: Page-by-page health analysis
- **Recommendations**: Prioritized action items
- **Engine Status**: Technical status of all services

### Dashboard Sections:

1. **Overview**: Current status and active features
2. **Content Health**: Detailed health reports for all pages
3. **Recommendations**: Prioritized improvement suggestions
4. **Engine Status**: Technical information and version details

## Configuration

### Enabling/Disabling Features

```typescript
import { seoEngine } from '@/core/ai-seo-engine';

// Check engine status
const status = seoEngine.getStatus();
console.log(status);
// Output:
// {
//   version: '1.0.0',
//   services: {
//     geo: true,
//     seo: true,
//     aeo: true,
//     health: true,
//     schema: true
//   },
//   timestamp: '2025-01-15T...'
// }
```

### Customizing Base URL

```typescript
import { AISeEngine } from '@/core/ai-seo-engine';

const customEngine = new AISeEngine('https://yourdomain.com');
```

## API Reference

### GEOEngine

#### `analyzeContent(url, content, metadata?)`
Analyzes page content for AI optimization.

**Returns**: `Promise<ContentAnalysis>`

#### `generateContextualFAQs(content, topic)`
Generates contextual FAQs based on content.

**Returns**: `Promise<FAQItem[]>`

#### `generateSpeakableContent(content)`
Generates speakable content for voice assistants.

**Returns**: `string[]`

### SEOEngine

#### `generateMetaTags(title, description, path, keywords?, imageUrl?)`
Generates comprehensive meta tags.

**Returns**: `MetaTags`

#### `generateSitemapEntry(url, priority?, changefreq?, lastmod?)`
Generates sitemap entry for a page.

**Returns**: `SitemapEntry`

#### `calculateInternalLinkScore(pageContent, allPageUrls)`
Calculates internal linking score.

**Returns**: `number`

### AEOEngine

#### `generateAnswerBlocks(content, question?)`
Generates answer blocks for AI assistants.

**Returns**: `string[]`

#### `generateStepByStepInstructions(content)`
Extracts step-by-step instructions.

**Returns**: `Array<{ step: number; instruction: string }>`

#### `generateMultiFormatResponse(content, question?)`
Generates responses optimized for different formats.

**Returns**: `{ shortAnswer, detailedAnswer, voiceAnswer, visualAnswer? }`

### ContentHealthService

#### `analyzeContentHealth(url, content, seoData)`
Analyzes content health and generates report.

**Returns**: `ContentHealthReport`

#### `isContentOutdated(lastModified, thresholdDays?)`
Checks if content is outdated.

**Returns**: `boolean`

#### `generateBatchReport(pagesData)`
Generates batch report for multiple pages.

**Returns**: `BatchHealthReport`

### SchemaGenerator

#### `generateLocalBusinessSchema()`
Generates Local Business JSON-LD schema.

#### `generateOrganizationSchema()`
Generates Organization JSON-LD schema.

#### `generateArticleSchema(url, headline, description, datePublished, dateModified, author, imageUrl?)`
Generates Article JSON-LD schema.

#### `generateFAQSchema(faqs)`
Generates FAQ JSON-LD schema.

#### `generateBreadcrumbSchema(pathname)`
Generates Breadcrumb JSON-LD schema.

## Best Practices

### 1. Content Creation
- Write at least 300 words per page
- Include clear headings (H1-H6)
- Add author information for blog posts
- Update content regularly

### 2. Metadata
- Keep titles under 60 characters
- Keep descriptions under 160 characters
- Use descriptive, keyword-rich content
- Always include canonical URLs

### 3. Structured Data
- Add FAQs to relevant pages
- Include author credentials
- Use proper date formatting
- Validate JSON-LD schemas

### 4. Internal Linking
- Link to at least 3-5 related pages
- Use descriptive anchor text
- Link to important pages (About, Services, Contact)
- Avoid excessive linking

### 5. EEAT Signals
- Always include author information
- Add publication and update dates
- Display credentials and expertise
- Include trust signals (awards, certifications)

## Monitoring

### Regular Checks
1. Visit `/admin/seo-engine` weekly
2. Review content health scores
3. Address high-priority recommendations
4. Monitor score trends

### Key Metrics
- **Overall Score**: Target 85+
- **GEO Score**: Target 80+
- **SEO Score**: Target 90+
- **AEO Score**: Target 75+
- **Content Health**: Target 80+ per page

## Troubleshooting

### Low Scores

**GEO Score Low (<70)**
- Add author information
- Generate FAQs
- Improve content readability
- Add EEAT signals

**SEO Score Low (<70)**
- Check meta tags
- Add structured data
- Improve internal linking
- Verify canonical URLs

**AEO Score Low (<70)**
- Add speakable content
- Create answer blocks
- Optimize for voice search
- Add step-by-step instructions

### Common Issues

**Issue**: Schemas not appearing in search results
**Solution**: Validate using Google's Rich Results Test, ensure schemas are properly formatted

**Issue**: Low content health scores
**Solution**: Review recommendations in dashboard, address issues starting with high priority

**Issue**: Outdated content warnings
**Solution**: Update content with current information, change lastModified dates

## Updates

### Version 1.0.0
- Initial release
- GEO, SEO, and AEO engines
- Content health system
- Schema generator
- Admin dashboard

## Support

For issues or questions:
1. Check this documentation
2. Review admin dashboard recommendations
3. Validate schemas using Google's tools
4. Check browser console for errors

## Security

- All engines run on the frontend (no external API calls by default)
- No sensitive data is stored or transmitted
- Admin dashboard requires authentication
- All operations are read-only (except dashboard refresh)

## Future Enhancements

Potential future additions:
- AI-powered content generation
- Automated content refresh suggestions
- Integration with Google Search Console
- Real-time competitor analysis
- Advanced analytics integration
- Automated A/B testing for SEO

## Maintenance

### Regular Tasks
- [ ] Review scores monthly
- [ ] Update outdated content
- [ ] Add new FAQs as needed
- [ ] Monitor search console
- [ ] Update schemas for new pages

### Quarterly Reviews
- [ ] Comprehensive content audit
- [ ] Internal link optimization
- [ ] Schema validation
- [ ] EEAT signal updates
- [ ] Performance benchmarking

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: Production Ready
