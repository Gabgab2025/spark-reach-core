import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CMSGalleryItem } from '@/hooks/useCMS';
import { useBlocksByPage } from '@/hooks/useContentBlocks';
import { usePageMeta } from '@/hooks/usePageMeta';

const FALLBACK_IMAGES = [
  { src: '/gallery/A7C05991.jpg', alt: 'Gallery Image 1' },
  { src: '/gallery/A7C05996.jpg', alt: 'Gallery Image 2' },
  { src: '/gallery/A7C05835.jpg', alt: 'Gallery Image 3' },
  { src: '/gallery/A7C05841.jpg', alt: 'Gallery Image 4' },
  { src: '/gallery/A7C05833.jpg', alt: 'Gallery Image 5' },
  { src: '/gallery/A7C05836.jpg', alt: 'Gallery Image 6' },
  { src: '/gallery/A7C05840.jpg', alt: 'Gallery Image 7' },
  { src: '/gallery/A7C05998.jpg', alt: 'Gallery Image 8' },
  { src: '/gallery/A7C06098.jpg', alt: 'Gallery Image 9' },
  { src: '/gallery/A7C06104.jpg', alt: 'Gallery Image 10' },
  { src: '/gallery/A7C06105.jpg', alt: 'Gallery Image 11' },
  { src: '/gallery/A7C05868.jpg', alt: 'Gallery Image 12' },
  { src: '/gallery/A7C05923.jpg', alt: 'Gallery Image 13' },
  { src: '/gallery/A7C05934.jpg', alt: 'Gallery Image 14' },
  { src: '/gallery/A7C05963.jpg', alt: 'Gallery Image 15' },
  { src: '/gallery/A7C05992.jpg', alt: 'Gallery Image 16' },
  { src: '/gallery/A7C05994.jpg', alt: 'Gallery Image 17' },
  { src: '/gallery/call-center-agent.jpg', alt: 'Call Center Agent' },
  { src: '/gallery/A7C06108.jpg', alt: 'Modern Office Space' },
  { src: '/gallery/equipment-1.jpg', alt: 'Telecommunications Equipment' },
  { src: '/gallery/equipment-2.jpg', alt: 'Telecommunications Equipment' },
  { src: '/gallery/equipment-3.jpg', alt: 'Telecommunications Equipment' },
  { src: '/gallery/sms-blast-system.jpg', alt: 'SMS Blast System Interface' },
  { src: '/gallery/vici-phone.jpg', alt: 'VICIphone Web Phone Interface' },
  { src: '/gallery/vici-admin.jpg', alt: 'VICIdial Administration Dashboard' },
  { src: '/gallery/easyphone-dashboard.jpg', alt: 'EasyPhone GoIP32 System' },
  { src: '/gallery/vici-script.jpg', alt: 'VICIdial Script Interface' },
  { src: '/gallery/vici-login.jpg', alt: 'VICIdial Campaign Login' },
];

const Gallery = () => {
  usePageMeta('gallery');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // ── 1. Gallery Items API (primary source) ──
  const { data: galleryItems } = useQuery({
    queryKey: ['gallery-items'],
    queryFn: async () => {
      const { data, error } = await api.get<CMSGalleryItem[]>('/gallery_items', {
        params: { status: 'published' },
      });
      if (error) return [];        // gracefully fallback on API error
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // ── 2. Content Blocks (secondary source — backward compat) ──
  const { blocks: galleryBlocks, getBlock } = useBlocksByPage('gallery');
  const heroBlock = getBlock('gallery-hero');

  // Collect images from gallery-type content blocks
  const blockImages = (galleryBlocks ?? [])
    .filter(b => b.block_type === 'gallery' && b.content?.images?.length)
    .flatMap(b => b.content!.images as { src: string; alt: string }[]);

  // Hero text
  const heroTitle = heroBlock?.title ?? 'Our Gallery';
  const heroDescription = heroBlock?.description ?? 'Explore our visual showcase of projects, team moments, and company highlights';

  // Build images from API
  const apiImages = (galleryItems ?? []).map(item => ({
    src: item.image_url,
    alt: item.alt_text || item.title,
    caption: item.caption,
    category: item.category,
  }));

  // Fallback chain: Gallery API → Content Blocks → Hardcoded
  const images = apiImages.length > 0
    ? apiImages
    : blockImages.length > 0
      ? blockImages.map(img => ({ ...img, caption: undefined, category: undefined }))
      : FALLBACK_IMAGES.map(img => ({ ...img, caption: undefined, category: undefined }));

  // Extract unique categories for filter tabs
  const categories = ['all', ...Array.from(new Set(images.map(img => img.category).filter(Boolean) as string[]))];

  // Filter images by active category
  const filteredImages = activeCategory === 'all'
    ? images
    : images.filter(img => img.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              {heroTitle}
            </h1>
            <p className="text-lg text-muted-foreground">
              {heroDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter Tabs */}
      {categories.length > 1 && (
        <section className="pt-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedImage(image.src)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading={index < 6 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                  {image.caption && (
                    <div className="w-full p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm font-medium drop-shadow-lg">{image.caption}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-full p-0 bg-transparent border-0">
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Full size"
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Gallery;
