/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Default values from index.html — restored on unmount
const DEFAULTS = {
  title: 'JDGK Business Solutions Inc.',
  description:
    'JDGK Business Solutions Inc. is a premier BPO in the Philippines specializing in Debt Collection, Customer Service, and Telemarketing. Partner with us for cost-effective, high-quality outsourcing solutions.',
  keywords:
    'Debt Collection BPO Philippines, Call Center Philippines, BPO Services, Customer Service Outsourcing, Telemarketing Philippines, Lead Generation, Virtual Assistant Services, Back Office Support',
  ogImage: 'https://jdgkbsi.ph/og-image.jpg',
  canonical: 'https://jdgkbsi.ph/',
};

export interface PageMeta {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
  og_image?: string;
}

/**
 * Helper to set or create a <meta> tag. If value is empty, restores the default.
 */
function setMetaTag(
  attr: 'name' | 'property',
  key: string,
  value: string | undefined,
  fallback: string,
) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value || fallback);
}

function setCanonical(url: string | undefined, fallback: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url || fallback);
}

/**
 * Fetches page meta from CMS by slug and applies it to the document head.
 * Use for system pages like home, about, services, etc.
 *
 * Usage: usePageMeta('home');
 */
export function usePageMeta(slug: string) {
  const { data: pageMeta } = useQuery<PageMeta | null>({
    queryKey: ['page-meta', slug],
    queryFn: async () => {
      const { data, error } = await api.get('/pages', {
        params: { slug, status: 'published' },
      });
      if (error || !data || !Array.isArray(data) || data.length === 0) return null;
      const page = data[0];
      return {
        meta_title: page.meta_title,
        meta_description: page.meta_description,
        meta_keywords: page.meta_keywords,
        canonical_url: page.canonical_url,
        og_image: page.og_image,
      } as PageMeta;
    },
    staleTime: 5 * 60 * 1000, // cache for 5 mins
    retry: 1,
  });

  useEffect(() => {
    if (!pageMeta) return;
    applyMeta(pageMeta);

    return () => {
      // Restore defaults when leaving the page
      restoreDefaults();
    };
  }, [pageMeta]);
}

/**
 * Manually apply meta from inline data (e.g. blog post, service detail).
 * Does NOT fetch from API — caller provides the data.
 *
 * Usage: useDirectMeta({ meta_title: post.title, meta_description: post.excerpt });
 */
export function useDirectMeta(meta: PageMeta | null | undefined) {
  useEffect(() => {
    if (!meta) return;
    applyMeta(meta);

    return () => {
      restoreDefaults();
    };
  }, [
    meta?.meta_title,
    meta?.meta_description,
    meta?.meta_keywords,
    meta?.canonical_url,
    meta?.og_image,
  ]);
}

function applyMeta(meta: PageMeta) {
  // Title
  if (meta.meta_title) {
    document.title = meta.meta_title;
  }

  // Description
  setMetaTag('name', 'description', meta.meta_description, DEFAULTS.description);
  setMetaTag('property', 'og:description', meta.meta_description, DEFAULTS.description);
  setMetaTag('name', 'twitter:description', meta.meta_description, DEFAULTS.description);

  // Keywords
  if (meta.meta_keywords) {
    setMetaTag('name', 'keywords', meta.meta_keywords, DEFAULTS.keywords);
  }

  // Title OG/Twitter
  if (meta.meta_title) {
    setMetaTag('property', 'og:title', meta.meta_title, DEFAULTS.title);
    setMetaTag('name', 'twitter:title', meta.meta_title, DEFAULTS.title);
  }

  // OG Image
  if (meta.og_image) {
    setMetaTag('property', 'og:image', meta.og_image, DEFAULTS.ogImage);
    setMetaTag('name', 'twitter:image', meta.og_image, DEFAULTS.ogImage);
  }

  // Canonical
  if (meta.canonical_url) {
    setCanonical(meta.canonical_url, DEFAULTS.canonical);
  }
}

function restoreDefaults() {
  document.title = DEFAULTS.title;
  setMetaTag('name', 'description', DEFAULTS.description, DEFAULTS.description);
  setMetaTag('name', 'keywords', DEFAULTS.keywords, DEFAULTS.keywords);
  setMetaTag('property', 'og:title', DEFAULTS.title, DEFAULTS.title);
  setMetaTag('property', 'og:description', DEFAULTS.description, DEFAULTS.description);
  setMetaTag('property', 'og:image', DEFAULTS.ogImage, DEFAULTS.ogImage);
  setMetaTag('name', 'twitter:title', DEFAULTS.title, DEFAULTS.title);
  setMetaTag('name', 'twitter:description', DEFAULTS.description, DEFAULTS.description);
  setMetaTag('name', 'twitter:image', DEFAULTS.ogImage, DEFAULTS.ogImage);
  setCanonical(DEFAULTS.canonical, DEFAULTS.canonical);
}
