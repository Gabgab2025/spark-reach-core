import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CMSTestimonial } from '@/hooks/useCMS';
import { Skeleton } from '@/components/ui/skeleton';

// Hardcoded fallback data
const FALLBACK_TESTIMONIALS = [
  { client_name: 'Sarah Johnson', client_title: 'VP of Operations', company_name: 'First National Bank', content: 'JDGK Business Solutions Inc. transformed our business operations. Their results-driven solutions increased our efficiency by 40% while maintaining exceptional quality.', rating: 5 },
  { client_name: 'Michael Chen', client_title: 'Collections Director', company_name: 'Metro Credit Union', content: 'Outstanding collection results with full regulatory compliance. Their team recovered 35% more than our previous provider while maintaining customer relationships.', rating: 5 },
  { client_name: 'Emily Rodriguez', client_title: 'Chief Technology Officer', company_name: 'Regional Financial Group', content: 'The level of technology integration and real-time analytics they provide is unmatched. We have complete visibility into all operations.', rating: 5 },
];

// Derive initials from a name
const getInitials = (name: string): string => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const Testimonials = () => {
  // Fetch testimonials from CMS API
  const { data: cmsTestimonials, isLoading } = useQuery({
    queryKey: ['public-testimonials'],
    queryFn: async () => {
      const { data, error } = await api.get<CMSTestimonial[]>('/testimonials', {
        params: { sort_by: 'sort_order', order: 'asc' },
      });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Use CMS data when available, otherwise fall back to hardcoded
  const testimonials = (cmsTestimonials && cmsTestimonials.length > 0 ? cmsTestimonials : FALLBACK_TESTIMONIALS).map(t => ({
    name: t.client_name,
    position: t.client_title ?? '',
    company: t.company_name ?? '',
    content: t.content,
    rating: t.rating ?? 5,
    avatar: getInitials(t.client_name),
  }));

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-accent/10 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-accent" />
            <span className="text-accent text-sm font-medium">Client Success Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Trusted by
            <span className="block text-gradient">Industry Leaders</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how we've helped financial institutions achieve exceptional results
            and transform their customer service operations.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-3xl p-8 space-y-4">
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, j) => <Skeleton key={j} className="w-5 h-5" />)}
                </div>
                <Skeleton className="h-24 w-full" />
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            testimonials.map((testimonial, index) => (
              <div key={index} className="group">
                <div className="glass rounded-3xl p-8 h-full hover-lift transition-all duration-300 relative overflow-hidden">
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity">
                    <Quote className="w-12 h-12 text-primary" />
                  </div>

                  {/* Rating */}
                  <div className="flex space-x-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-foreground mb-8 leading-relaxed relative z-10">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.position}
                      </div>
                      <div className="text-sm font-medium text-primary">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-8">Trusted by 500+ financial institutions worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Placeholder for bank logos */}
            <div className="h-12 w-32 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-sm font-medium">Bank Logo</span>
            </div>
            <div className="h-12 w-32 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-sm font-medium">Credit Union</span>
            </div>
            <div className="h-12 w-32 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-sm font-medium">Financial Group</span>
            </div>
            <div className="h-12 w-32 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-sm font-medium">Investment Bank</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;