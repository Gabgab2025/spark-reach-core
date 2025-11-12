import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Phone, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    '/hero/office-1.jpg',
    '/hero/office-2.jpg',
    '/hero/office-3.jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleStartProject = () => {
    // First try to scroll to services section
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
      // After a short delay, navigate to contact page
      setTimeout(() => {
        navigate('/contact');
      }, 1500);
    } else {
      // If services section doesn't exist, go directly to contact
      navigate('/contact');
    }
  };

  const handleWatchDemo = () => {
    // Scroll to services section to show capabilities
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: currentSlide === index ? 1 : 0,
            }}
          />
        ))}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/20 animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-accent/20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-20 w-16 h-16 rounded-full bg-primary/30 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-white/10 dark:bg-card/20 backdrop-blur-sm border border-white/20 dark:border-border/50 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-white dark:text-foreground text-sm font-medium">JDGK BUSINESS SOLUTIONS INC.</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white dark:text-foreground mb-6 leading-tight">
              Results Driven,
              <span className="block text-gradient">Client Focused</span>
            </h1>

            <p className="text-xl text-white/90 dark:text-card-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Empowering businesses through efficient and innovative solutions.
            </p>

            <div className="mb-12">
              <p className="text-white/90 dark:text-card-foreground text-lg leading-relaxed mb-8 max-w-3xl mx-auto lg:mx-0">
                We are focused on fostering strong, results-driven partnerships with our clients. With our dedicated team, we live up to our mission to provide exceptional business solutions that help clients achieve their goals, optimize operational efficiency, and maximize profitability.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  className="btn-hero px-8 py-4 text-lg font-semibold group"
                  onClick={handleStartProject}
                >
                  Let's Work Together
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  className="btn-glass px-8 py-4 text-lg font-semibold bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white"
                  onClick={handleWatchDemo}
                >
                  Connect With Us
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <Users className="w-6 h-6 text-primary mr-2" />
                  <span className="text-2xl font-bold text-white dark:text-foreground">8+</span>
                </div>
                <p className="text-white/70 dark:text-muted-foreground text-sm">Major Clients</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <Phone className="w-6 h-6 text-primary mr-2" />
                  <span className="text-2xl font-bold text-white dark:text-foreground">Expert</span>
                </div>
                <p className="text-white/70 dark:text-muted-foreground text-sm">Solutions</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <TrendingUp className="w-6 h-6 text-primary mr-2" />
                  <span className="text-2xl font-bold text-white dark:text-foreground">2025</span>
                </div>
                <p className="text-white/70 dark:text-muted-foreground text-sm">Established</p>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="hidden lg:block relative">
            <div className="relative w-full h-96 glass rounded-3xl p-8 hover-lift">
              <div className="absolute inset-0 bg-transparent rounded-3xl" />
              <div className="relative z-10 h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Core Services</h3>
                <div className="space-y-3">
                  <div className="bg-card/20 dark:bg-card/40 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-foreground font-medium">Credit Collection Recovery</span>
                    </div>
                  </div>
                  <div className="bg-card/20 dark:bg-card/40 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-foreground font-medium">Repossession Services</span>
                    </div>
                  </div>
                  <div className="bg-card/20 dark:bg-card/40 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-foreground font-medium">Skip Tracing</span>
                    </div>
                  </div>
                  <div className="bg-card/20 dark:bg-card/40 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-foreground font-medium">Virtual Assistance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 dark:border-border rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 dark:bg-muted-foreground rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;