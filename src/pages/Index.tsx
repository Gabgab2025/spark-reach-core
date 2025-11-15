import React from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Clients from '@/components/Clients';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Index = () => {
  const services = useScrollAnimation({ delay: 100 });
  const clients = useScrollAnimation({ delay: 200 });
  const testimonials = useScrollAnimation({ delay: 300 });

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
          ref={testimonials.ref}
          className={`transition-all duration-700 ${
            testimonials.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <Testimonials />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
