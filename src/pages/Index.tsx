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

const Index = () => {
  const services = useScrollAnimation({ delay: 100 });
  const clients = useScrollAnimation({ delay: 200 });
  const licenses = useScrollAnimation({ delay: 300 });
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null);

  const licenseImages = [
    {
      src: '/licenses/business-permits-wall.jpg',
      title: 'Business Permits & Registrations'
    },
    {
      src: '/licenses/award-rookie.jpg',
      title: 'Top Shining Rookie Award 2024'
    },
    {
      src: '/licenses/certificate-appreciation.jpg',
      title: 'Certificate of Appreciation'
    },
    {
      src: '/licenses/circle-gold-franchisee.jpg',
      title: 'Circle of Gold Franchisee'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <div
          ref={services.ref}
          className={`transition-all duration-700 ${
            services.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <Services />
        </div>
        <div
          ref={clients.ref}
          className={`transition-all duration-700 ${
            clients.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <Clients />
        </div>
        <div
          ref={licenses.ref}
          className={`transition-all duration-700 ${
            licenses.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <section className="py-20 bg-gradient-to-b from-background to-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-flex items-center space-x-2 bg-accent/10 rounded-full px-4 py-2 mb-6">
                  <Award className="w-4 h-4 text-accent" />
                  <span className="text-accent text-sm font-medium">Certified & Accredited</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Our Business
                  <span className="block text-gradient">License</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Certified and accredited business credentials demonstrating our commitment to excellence
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
