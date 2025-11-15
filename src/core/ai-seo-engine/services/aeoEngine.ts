// AEO (Answer Engine Optimization) Service

import type { StructuredContent } from '../types';

export class AEOEngine {
  /**
   * Generate answer blocks optimized for voice and AI assistants
   */
  generateAnswerBlocks(content: string, question?: string): string[] {
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    // Find direct answer sentences (typically at the beginning or containing key phrases)
    const answerBlocks: string[] = [];
    
    // First paragraph usually contains the main answer
    if (sentences.length > 0) {
      answerBlocks.push(sentences[0].trim() + '.');
    }
    
    // Look for definition-style sentences
    const definitionPatterns = [
      /is (a|an|the)/i,
      /refers to/i,
      /means/i,
      /defined as/i
    ];
    
    sentences.forEach(sentence => {
      if (definitionPatterns.some(pattern => pattern.test(sentence))) {
        answerBlocks.push(sentence.trim() + '.');
      }
    });
    
    return answerBlocks.slice(0, 3);
  }

  /**
   * Generate step-by-step instructions for processes
   */
  generateStepByStepInstructions(content: string): Array<{ step: number; instruction: string }> {
    const steps: Array<{ step: number; instruction: string }> = [];
    
    // Look for numbered lists or step indicators
    const stepPatterns = [
      /(?:step\s+)?(\d+)[.:)]\s*([^.!?]+[.!?])/gi,
      /(?:first|second|third|fourth|fifth|finally)[,:]\s*([^.!?]+[.!?])/gi
    ];
    
    let stepNumber = 1;
    
    stepPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const instruction = match[2] || match[1];
        if (instruction && instruction.trim().length > 10) {
          steps.push({
            step: stepNumber++,
            instruction: instruction.trim()
          });
        }
      }
    });
    
    return steps;
  }

  /**
   * Generate speakable content optimized for voice assistants
   */
  generateSpeakableContent(content: string): {
    summary: string;
    keyPoints: string[];
    callToAction?: string;
  } {
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    // Summary: First 2 sentences
    const summary = sentences.slice(0, 2).join('. ') + '.';
    
    // Key points: Extract bullet points or important sentences
    const keyPoints = this.extractKeyPoints(content);
    
    // Call to action: Look for action-oriented sentences
    const callToAction = this.extractCallToAction(content);
    
    return {
      summary,
      keyPoints,
      callToAction
    };
  }

  /**
   * Extract key points from content
   */
  private extractKeyPoints(content: string): string[] {
    const points: string[] = [];
    
    // Look for bullet points
    const bulletPattern = /[•\-*]\s*([^•\-*\n]+)/g;
    let match;
    
    while ((match = bulletPattern.exec(content)) !== null) {
      const point = match[1].trim();
      if (point.length > 10 && point.length < 150) {
        points.push(point);
      }
    }
    
    // If no bullets found, extract important sentences
    if (points.length === 0) {
      const sentences = content
        .replace(/<[^>]*>/g, '')
        .split(/[.!?]+/)
        .filter(s => s.trim().length > 20 && s.trim().length < 150);
      
      // Take sentences with important keywords
      const importantKeywords = ['important', 'key', 'essential', 'critical', 'main', 'primary'];
      sentences.forEach(sentence => {
        if (importantKeywords.some(k => sentence.toLowerCase().includes(k))) {
          points.push(sentence.trim());
        }
      });
    }
    
    return points.slice(0, 5);
  }

  /**
   * Extract call-to-action from content
   */
  private extractCallToAction(content: string): string | undefined {
    const ctaPatterns = [
      /contact us/i,
      /get started/i,
      /learn more/i,
      /call now/i,
      /visit us/i,
      /schedule/i,
      /book/i,
      /sign up/i
    ];
    
    const sentences = content
      .replace(/<[^>]*>/g, '')
      .split(/[.!?]+/)
      .filter(s => s.trim().length > 10);
    
    for (const sentence of sentences) {
      if (ctaPatterns.some(pattern => pattern.test(sentence))) {
        return sentence.trim() + '.';
      }
    }
    
    return undefined;
  }

  /**
   * Generate multi-format responses for different AI assistants
   */
  generateMultiFormatResponse(content: string, question?: string): {
    shortAnswer: string;
    detailedAnswer: string;
    voiceAnswer: string;
    visualAnswer?: string;
  } {
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    // Short answer (for quick replies)
    const shortAnswer = sentences[0]?.trim() + '.' || cleanContent.substring(0, 100);
    
    // Detailed answer (for comprehensive responses)
    const detailedAnswer = sentences.slice(0, 4).join('. ') + '.';
    
    // Voice answer (optimized for speech)
    const voiceAnswer = this.optimizeForVoice(sentences.slice(0, 3).join('. '));
    
    return {
      shortAnswer,
      detailedAnswer,
      voiceAnswer
    };
  }

  /**
   * Optimize text for voice output
   */
  private optimizeForVoice(text: string): string {
    // Remove URLs
    let optimized = text.replace(/https?:\/\/[^\s]+/g, '');
    
    // Replace abbreviations
    const abbreviations: Record<string, string> = {
      'e.g.': 'for example',
      'i.e.': 'that is',
      'etc.': 'and so on',
      'vs.': 'versus',
      'Dr.': 'Doctor',
      'Mr.': 'Mister',
      'Mrs.': 'Missus',
      'Ms.': 'Miss'
    };
    
    Object.entries(abbreviations).forEach(([abbr, full]) => {
      optimized = optimized.replace(new RegExp(abbr, 'gi'), full);
    });
    
    // Add periods for better pacing
    optimized = optimized.replace(/([a-z])([A-Z])/g, '$1. $2');
    
    return optimized.trim();
  }

  /**
   * Generate featured snippet content
   */
  generateFeaturedSnippet(content: string, type: 'paragraph' | 'list' | 'table' = 'paragraph'): any {
    if (type === 'paragraph') {
      return {
        type: 'paragraph',
        content: this.extractDefinition(content)
      };
    }
    
    if (type === 'list') {
      return {
        type: 'list',
        items: this.extractKeyPoints(content)
      };
    }
    
    // For table type, would need more structured data
    return {
      type: 'paragraph',
      content: this.extractDefinition(content)
    };
  }

  /**
   * Extract definition from content
   */
  private extractDefinition(content: string): string {
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    const sentences = cleanContent.split(/[.!?]+/);
    
    // Look for definition patterns
    const definitionPatterns = [
      /(.+)\s+is\s+(.+)/i,
      /(.+)\s+refers to\s+(.+)/i,
      /(.+)\s+means\s+(.+)/i
    ];
    
    for (const sentence of sentences) {
      for (const pattern of definitionPatterns) {
        const match = pattern.exec(sentence);
        if (match) {
          return sentence.trim() + '.';
        }
      }
    }
    
    // Default to first sentence
    return sentences[0]?.trim() + '.' || cleanContent.substring(0, 160);
  }
}
