// Utility functions for SEO engine

export function calculateReadabilityScore(text: string): number {
  // Simple readability calculation (Flesch Reading Ease approximation)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const words = text.split(/\s+/).filter(w => w.length > 0).length;
  const syllables = text.split(/[aeiou]/i).length - 1;

  if (sentences === 0 || words === 0) return 0;

  const avgWordsPerSentence = words / sentences;
  const avgSyllablesPerWord = syllables / words;

  const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
  return Math.max(0, Math.min(100, score));
}

export function extractKeywords(text: string, limit: number = 10): string[] {
  // Simple keyword extraction (frequency-based)
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'been', 'be',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
    'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
  ]);

  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));

  const frequency = new Map<string, number>();
  words.forEach(word => {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });

  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

export function scoreContent(analysis: {
  hasTitle: boolean;
  hasDescription: boolean;
  hasKeywords: boolean;
  hasStructuredData: boolean;
  hasEEAT: boolean;
  readabilityScore: number;
  wordCount: number;
}): number {
  let score = 0;

  // Basic SEO elements (30 points)
  if (analysis.hasTitle) score += 10;
  if (analysis.hasDescription) score += 10;
  if (analysis.hasKeywords) score += 10;

  // Advanced features (30 points)
  if (analysis.hasStructuredData) score += 15;
  if (analysis.hasEEAT) score += 15;

  // Content quality (40 points)
  score += Math.min(20, analysis.readabilityScore / 5);
  score += Math.min(20, analysis.wordCount / 50);

  return Math.round(Math.min(100, score));
}

export function generateCanonicalUrl(path: string, baseUrl: string): string {
  const cleanPath = path.replace(/\/$/, '');
  const cleanBase = baseUrl.replace(/\/$/, '');
  return `${cleanBase}${cleanPath}`;
}

export function detectContentIssues(content: string): string[] {
  const issues: string[] = [];

  if (content.length < 300) {
    issues.push('Content is too short (recommended: 300+ words)');
  }

  if (!/[.!?]/.test(content)) {
    issues.push('No proper sentence structure detected');
  }

  const headingPattern = /<h[1-6][^>]*>/gi;
  if (!headingPattern.test(content)) {
    issues.push('No headings found (H1-H6)');
  }

  return issues;
}
