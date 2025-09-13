import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      position: 'VP of Operations',
      company: 'First National Bank',
      content: 'CallCenter Pro transformed our customer service operations. Their AI-powered solutions increased our efficiency by 40% while maintaining exceptional quality.',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      position: 'Collections Director',
      company: 'Metro Credit Union',
      content: 'Outstanding collection results with full regulatory compliance. Their team recovered 35% more than our previous provider while maintaining customer relationships.',
      rating: 5,
      avatar: 'MC'
    },
    {
      name: 'Emily Rodriguez',
      position: 'Chief Technology Officer',
      company: 'Regional Financial Group',
      content: 'The level of technology integration and real-time analytics they provide is unmatched. We have complete visibility into all operations.',
      rating: 5,
      avatar: 'ER'
    }
  ];

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
          {testimonials.map((testimonial, index) => (
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
          ))}
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