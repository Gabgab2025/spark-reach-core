import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Phone, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CMSPage } from "@/hooks/useCMS";
import { useBlocksByPage } from "@/hooks/useContentBlocks";

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const startProjectTimeoutRef = useRef<number | null>(null);

  const defaultHeroImages = ["/hero/office-1.jpg", "/hero/office-2.jpg"];

  // ── Content Blocks (primary source) ──
  const { getBlock } = useBlocksByPage('home');
  const heroBlock = getBlock('home-hero');

  // ── Pages API (secondary source) ──
  const { data: homePageContent } = useQuery({
    queryKey: ["public-pages", "home"],
    queryFn: async () => {
      const { data, error } = await api.get<CMSPage[]>("/pages", {
        params: { slug: "home", status: "published" },
      });
      if (error) throw error;
      return data?.[0]?.content ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Hero slideshow images — fallback chain: Block → Pages API → default
  const blockBgImages = heroBlock?.background_images as string[] | undefined;
  const cmsImages = homePageContent?.hero?.background_images;
  const legacySingle = homePageContent?.hero?.background_image;
  const heroImages: string[] =
    Array.isArray(blockBgImages) && blockBgImages.filter(Boolean).length > 0
      ? blockBgImages.filter(Boolean)
      : Array.isArray(cmsImages) && cmsImages.length > 0
        ? cmsImages.filter((img: string) => img)
        : legacySingle
          ? [legacySingle]
          : defaultHeroImages;

  // Hero text — fallback chain: Block → Pages API → hardcoded
  const heroTitle = heroBlock?.title ?? homePageContent?.hero?.title ?? "Results Driven,";
  const heroTitleHighlight = heroBlock?.subtitle ?? homePageContent?.hero?.subtitle ?? "Client Focused";
  const heroTagline = heroBlock?.description ?? homePageContent?.hero?.description ?? "Empowering businesses through efficient and innovative solutions.";
  const heroBody = heroBlock?.body ?? homePageContent?.hero?.body ?? "We are focused on fostering strong, results-driven partnerships with our clients. With our dedicated team, we live up to our mission to provide exceptional business solutions that help clients achieve their goals, optimize operational efficiency, and maximize profitability.";
  const heroCta = heroBlock?.cta_text ?? homePageContent?.hero?.cta_text ?? "Let's Work Together";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Cleanup timeout on unmount (fixes 4.5.1 timer leak)
  useEffect(() => {
    return () => {
      if (startProjectTimeoutRef.current !== null) {
        clearTimeout(startProjectTimeoutRef.current);
      }
    };
  }, []);

  const handleStartProject = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
      startProjectTimeoutRef.current = window.setTimeout(() => {
        navigate("/contact");
      }, 1500);
    } else {
      navigate("/contact");
    }
  };

  const handleWatchDemo = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-charcoal-light">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
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
        <div
          className="absolute top-40 right-20 w-32 h-32 rounded-full bg-accent/20 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 left-20 w-16 h-16 rounded-full bg-primary/30 animate-float"
          style={{ animationDelay: "4s" }}
        />
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
              {heroTitle}
              <span className="block text-gradient">{heroTitleHighlight}</span>
            </h1>

            <p className="text-xl text-white/90 dark:text-card-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {heroTagline}
            </p>

            <div className="mb-12">
              <p className="text-white/90 dark:text-card-foreground text-lg leading-relaxed mb-8 max-w-3xl mx-auto lg:mx-0">
                {heroBody}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button className="btn-hero px-8 py-4 text-lg font-semibold group" onClick={handleStartProject}>
                  {heroCta}
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
                  <span className="text-2xl font-bold text-white dark:text-foreground">13+</span>
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
