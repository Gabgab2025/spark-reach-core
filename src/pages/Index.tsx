import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Clients from '@/components/Clients';
import Footer from '@/components/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Autoplay from 'embla-carousel-autoplay';
import { Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CMSPage } from '@/hooks/useCMS';
import { useBlocksByPage } from '@/hooks/useContentBlocks';
import { usePageMeta } from '@/hooks/usePageMeta';

const Index = () => {
  usePageMeta('home');
  const services = useScrollAnimation({ delay: 100 });
  const clients = useScrollAnimation({ delay: 200 });
  const licenses = useScrollAnimation({ delay: 300 });
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null);

  // ── Content Blocks (primary source) ──
  const { blocks: homeBlocks } = useBlocksByPage('home');

  // Collect images from gallery-type blocks assigned to 'home' (for license/gallery sections)
  const blockGalleryImages = (homeBlocks ?? [])
    .filter(b => b.block_type === 'gallery' && b.content?.images?.length)
    .flatMap(b => (b.content!.images as { src: string; alt?: string; title?: string }[])
      .map(img => ({ src: img.src, title: img.alt || img.title || '' }))
    );

  // ── Pages API (secondary source) ──
  const { data: pageContent } = useQuery({
    queryKey: ['public-page', 'home-index'],
    queryFn: async () => {
      const { data, error } = await api.get<CMSPage[]>('/pages', {
        params: { slug: 'home', status: 'published' },
      });
      if (error) throw error;
      return data?.[0]?.content ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });

  // License section text — fallback chain: Pages API → hardcoded
  const licenseBadge = pageContent?.license_section?.badge ?? 'Certified & Accredited';
  const licenseTitle = pageContent?.license_section?.title ?? 'Our Business';
  const licenseHighlight = pageContent?.license_section?.highlight ?? 'License';
  const licenseSubtitle = pageContent?.license_section?.subtitle ?? 'Certified and accredited business credentials demonstrating our commitment to excellence';

  const FALLBACK_LICENSE_IMAGES = [
    { src: '/licenses/business-permits-wall.jpg', title: 'Business Permits & Registrations' },
    { src: '/licenses/award-rookie.jpg', title: 'Top Shining Rookie Award 2024' },
    { src: '/licenses/certificate-appreciation.jpg', title: 'Certificate of Appreciation' },
    { src: '/licenses/circle-gold-franchisee.jpg', title: 'Circle of Gold Franchisee' },
  ];

  // License images — fallback chain: Block gallery images → Pages API → hardcoded
  const licenseImages = blockGalleryImages.length > 0
    ? blockGalleryImages
    : pageContent?.license_section?.images ?? FALLBACK_LICENSE_IMAGES;

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <div
          ref={services.ref}
          className={`transition-all duration-700 ${services.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
            }`}
        >
          <Services />
        </div>
        <div
          ref={clients.ref}
          className={`transition-all duration-700 ${clients.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
            }`}
        >
          <Clients />
        </div>
        <div
          ref={licenses.ref}
          className={`transition-all duration-700 ${licenses.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
            }`}
        >
          <section className="py-20 bg-gradient-to-b from-background to-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-flex items-center space-x-2 bg-accent/10 rounded-full px-4 py-2 mb-6">
                  <Award className="w-4 h-4 text-accent" />
                  <span className="text-accent text-sm font-medium">{licenseBadge}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  {licenseTitle}
                  <span className="block text-gradient">{licenseHighlight}</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  {licenseSubtitle}
                </p>
              </div>

              <div className="max-w-5xl mx-auto">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  plugins={[
                    Autoplay({
                      delay: 3000,
                    }),
                  ]}
                  className="w-full"
                >
                  <CarouselContent>
                    {licenseImages.map((license, index) => (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div
                          className="p-2 cursor-pointer group"
                          onClick={() => setSelectedLicense(license.src)}
                        >
                          <div className="glass rounded-2xl overflow-hidden hover-lift transition-all duration-300">
                            <img
                              src={license.src}
                              alt={license.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="p-4 text-center">
                              <p className="font-medium text-foreground">{license.title}</p>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </Carousel>
              </div>
            </div>
          </section>
        </div>

        <Dialog open={!!selectedLicense} onOpenChange={() => setSelectedLicense(null)}>
          <DialogContent className="max-w-4xl">
            {selectedLicense && (
              <img
                src={selectedLicense}
                alt="License certificate"
                className="w-full h-auto rounded-lg"
              />
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
