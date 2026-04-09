import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Headphones, Shield, Search, FileCheck, Phone, Users, TrendingUp, DollarSign, Briefcase, Zap, Globe, type LucideIcon } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CMSPage, CMSService } from '@/hooks/useCMS';
import { Skeleton } from '@/components/ui/skeleton';
import { usePageMeta } from '@/hooks/usePageMeta';

// Map icon name strings (from CMS) to Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp, Shield, Globe, Zap, Phone, Users, Headphones, Search, FileCheck, Briefcase, ArrowRight, DollarSign,
};
const resolveIcon = (name?: string | null): LucideIcon => ICON_MAP[name || ''] ?? Briefcase;

// Hardcoded fallback data
const FALLBACK_SERVICES = [
  { title: 'Credit Collection Recovery', slug: 'credit-collection-recovery', icon: 'Headphones', description: 'Comprehensive credit recovery services designed to optimize cash flow and minimize bad debts using proven, ethical strategies.', features: ['Debt Collection & Negotiation', 'Account Reconciliation', 'Skip Tracing', 'Legal Referrals'], category: 'Financial Services' },
  { title: 'Repossession', slug: 'repossession', icon: 'Shield', description: 'Professional and discreet asset recovery operations that ensure compliance and protect client interests.', features: ['Asset Tracing & Retrieval', 'Secure Asset Storage', 'Detailed Condition Reporting'], category: 'Asset Recovery' },
  { title: 'Skip Tracing', slug: 'skip-tracing', icon: 'Search', description: 'Specialized investigative service for locating individuals or assets with precision and discretion. Used in collections, legal, finance, and real estate industries.', features: ['Advanced Location Services', 'Confidential Investigations', 'Industry-Specific Solutions'], category: 'Investigation' },
  { title: 'Credit Investigation', slug: 'credit-investigation', icon: 'FileCheck', description: 'Verification of credit and financial background for loan applications, collections, or client vetting.', features: ['Comprehensive Background Checks', 'Financial History Analysis', 'Risk Assessment'], category: 'Verification' },
  { title: 'Tele Sales', slug: 'tele-sales', icon: 'Phone', description: 'Outbound and inbound calling solutions for lead generation, follow-ups, and debt recovery support.', features: ['Lead Generation', 'Customer Follow-ups', 'Sales Campaign Management'], category: 'Sales Support' },
  { title: 'Virtual Assistance', slug: 'virtual-assistance', icon: 'Users', description: 'Reliable and streamlined administrative and operational support to help clients focus on their core business priorities.', features: ['Administrative Support', 'Customer Service', 'Data Entry', 'Scheduling & Calendar Management', 'Bookkeeping'], category: 'Business Support' },
];

const Services = () => {
  usePageMeta('services');
  const navigate = useNavigate();

  // Fetch services from CMS API
  const { data: cmsServices, isLoading } = useQuery({
    queryKey: ['public-services'],
    queryFn: async () => {
      const { data, error } = await api.get<CMSService[]>('/services', {
        params: { sort_by: 'sort_order', order: 'asc' },
      });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Use CMS data when available, otherwise fall back to hardcoded
  const services = (cmsServices && cmsServices.length > 0 ? cmsServices : FALLBACK_SERVICES).map(s => ({
    icon: resolveIcon(s.icon),
    title: s.title,
    slug: s.slug,
    description: s.description ?? '',
    features: s.features ?? [],
    category: s.category ?? 'Services',
  }));

  // Fetch services page content from CMS
  const { data: pageContent } = useQuery({
    queryKey: ['public-page', 'services'],
    queryFn: async () => {
      const { data, error } = await api.get<CMSPage[]>('/pages', {
        params: { slug: 'services', status: 'published' },
      });
      if (error) throw error;
      return data?.[0]?.content ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Hero text from CMS
  const heroBadge = pageContent?.hero?.badge ?? 'Our Services';
  const heroTitle = pageContent?.hero?.title ?? 'Professional';
  const heroHighlight = pageContent?.hero?.highlight ?? 'Business Solutions';
  const heroDescription = pageContent?.hero?.description ?? 'Discover our comprehensive range of services designed to drive your business forward with cutting-edge technology and expert teams.';

  // "Why Choose Us" section from CMS
  const whyChooseTitle = pageContent?.why_choose?.title ?? 'Why Choose JDGK Business Solutions?';
  const whyChooseSubtitle = pageContent?.why_choose?.subtitle ?? 'Industry-leading capabilities that set us apart from the competition';
  const whyChooseCards = pageContent?.why_choose?.cards ?? [
    { icon: 'TrendingUp', title: 'Proven Results', description: 'Track record of delivering exceptional results for our clients' },
    { icon: 'Shield', title: 'Trusted Partner', description: 'Recognized industry leader serving major financial institutions' },
    { icon: 'DollarSign', title: 'Maximize Profitability', description: 'Optimize operational efficiency and maximize your bottom line' },
  ];

  // CTA section from CMS
  const ctaTitle = pageContent?.cta?.title ?? 'Ready to Transform Your Business?';
  const ctaDescription = pageContent?.cta?.description ?? 'Contact us today to learn more about our services and how we can help you achieve your goals.';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-primary text-sm font-medium">{heroBadge}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {heroTitle}
                <span className="block text-gradient">{heroHighlight}</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {heroDescription}
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="glass rounded-3xl p-8 space-y-4">
                    <Skeleton className="w-16 h-16 rounded-2xl" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-16 w-full" />
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, j) => <Skeleton key={j} className="h-4 w-2/3" />)}
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))
              ) : (
              services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div key={index} className="group">
                    <div className="glass rounded-3xl p-8 h-full hover-lift hover-scale transition-all duration-300 flex flex-col">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center mb-6 group-hover:shadow-glow transition-all duration-300">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          {service.category}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                        {service.description}
                      </p>
                      
                      <ul className="space-y-2 mb-6 flex-grow">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"
                        onClick={() => navigate(`/service/${encodeURIComponent(service.slug)}`)}
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                );
              })
              )}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                {whyChooseTitle}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {whyChooseSubtitle}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {whyChooseCards.map((card: { icon?: string; title: string; description: string }, idx: number) => {
                const CardIcon = resolveIcon(card.icon);
                return (
                  <div key={idx} className="glass rounded-3xl p-8 text-center hover-lift">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <CardIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{card.title}</h3>
                    <p className="text-muted-foreground">{card.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-accent">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              {ctaTitle}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {ctaDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => navigate('/contact')}
              >
                Get Free Consultation
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary"
                onClick={() => navigate('/about')}
              >
                Learn About Us
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;