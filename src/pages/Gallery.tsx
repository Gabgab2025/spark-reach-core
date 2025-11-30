import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Our Gallery
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore our visual showcase of projects, team moments, and company highlights
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
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
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
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
