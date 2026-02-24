import React from 'react';
import { Phone, Users, TrendingUp, Shield, Zap, Globe, ArrowRight, Headphones, Search, FileCheck, Briefcase, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CMSService } from '@/hooks/useCMS';
import { Skeleton } from '@/components/ui/skeleton';

// Map icon name strings (from CMS) to Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp, Shield, Globe, Zap, Phone, Users, Headphones, Search, FileCheck, Briefcase, ArrowRight,
};
const resolveIcon = (name?: string | null): LucideIcon => ICON_MAP[name || ''] ?? Briefcase;

// Hardcoded fallback data — used when the API returns no services
const FALLBACK_SERVICES = [
  { title: 'Credit Collection Recovery', slug: 'credit-collection-recovery', icon: 'TrendingUp', description: 'Comprehensive credit recovery services designed to optimize cash flow and minimize bad debts using proven, ethical strategies.', features: ['Debt Collection & Negotiation', 'Account Reconciliation', 'Skip Tracing', 'Legal Referrals'] },
  { title: 'Repossession', slug: 'repossession', icon: 'Shield', description: 'Professional and discreet asset recovery operations that ensure compliance and protect client interests.', features: ['Asset Tracing & Retrieval', 'Secure Asset Storage', 'Detailed Condition Reporting', 'Legal Compliance'] },
  { title: 'Skip Tracing', slug: 'skip-tracing', icon: 'Globe', description: 'Specialized investigative service for locating individuals or assets with precision and discretion.', features: ['Individual Location', 'Asset Discovery', 'Database Research', 'Confidential Investigation'] },
  { title: 'Credit Investigation', slug: 'credit-investigation', icon: 'Zap', description: 'Verification of credit and financial background for loan applications, collections, or client vetting.', features: ['Credit History Verification', 'Financial Background Checks', 'Risk Assessment', 'Detailed Reports'] },
  { title: 'Tele Sales', slug: 'tele-sales', icon: 'Phone', description: 'Outbound and inbound calling solutions for lead generation, follow-ups, and debt recovery support.', features: ['Lead Generation', 'Follow-up Calls', 'Sales Support', 'Customer Outreach'] },
  { title: 'Virtual Assistance', slug: 'virtual-assistance', icon: 'Users', description: 'Reliable administrative and operational support to help clients focus on core business priorities.', features: ['Administrative Support', 'Customer Service', 'Data Entry', 'Scheduling & Bookkeeping'] },
];

const Services = () => {
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
  const rawServices = cmsServices && cmsServices.length > 0 ? cmsServices : FALLBACK_SERVICES;
  // Featured first, fill to 3
  const featured = rawServices.filter(s => s.is_featured);
  const nonFeatured = rawServices.filter(s => !s.is_featured);
  const mainServicesRaw = [...featured, ...nonFeatured].slice(0, 3);
  const mainServices = mainServicesRaw.map(s => ({
    icon: resolveIcon(s.icon),
    title: s.title,
    slug: s.slug,
    description: s.description ?? '',
    features: s.features ?? [],
  }));
  const allServices = rawServices.map(s => ({
    icon: resolveIcon(s.icon),
    title: s.title,
    slug: s.slug,
    description: s.description ?? '',
    features: s.features ?? [],
  }));

  const handleLearnMore = (serviceSlug: string) => {
    navigate(`/services?service=${encodeURIComponent(serviceSlug)}`);
  };

  const capabilities = [
    { icon: Shield, title: 'Security First', desc: 'Bank-grade security protocols' },
    { icon: Zap, title: 'AI-Powered', desc: 'Advanced automation & analytics' },
    { icon: Globe, title: 'Global Reach', desc: 'Worldwide service delivery' },
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-primary text-sm font-medium">Our Services</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Comprehensive
            <span className="block text-gradient">Business Solutions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From customer service excellence to debt recovery mastery, we deliver results 
            that drive your business forward with cutting-edge technology and expert teams.
          </p>
        </div>

        {/* Main Services - Show only first 3 (featured prioritized) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-3xl p-8 space-y-4">
                <Skeleton className="w-16 h-16 rounded-2xl" />
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-16 w-full" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => <Skeleton key={j} className="h-4 w-2/3" />)}
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            ))
          ) : (
            mainServices.map((service, index) => (
              <div key={index} className="group">
                <div className="glass rounded-3xl p-8 h-full hover-lift hover-scale transition-all duration-300 flex flex-col">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center mb-6 group-hover:shadow-glow transition-all duration-300`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                    onClick={() => handleLearnMore(service.slug)}
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>


        {/* View More Button */}
        <div className="text-center mb-16">
          <Button 
            className="btn-hero px-8 py-4 text-lg font-semibold group"
            onClick={() => navigate('/services')}
          >
            View All Services
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Capabilities */}
        <div className="glass rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why Choose JDGK Business Solutions Inc.?</h3>
            <p className="text-muted-foreground text-lg">Industry-leading capabilities that set us apart</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {capabilities.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="btn-hero px-8 py-4 text-lg font-semibold" onClick={() => navigate('/contact')}>
              Request Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;