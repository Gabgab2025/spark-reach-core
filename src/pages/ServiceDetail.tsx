import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Star, Clock, Users, Shield } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  features: string[];
  pricing_info: string;
  icon: string;
  image_url: string;
  category: string;
  is_featured: boolean;
  sort_order: number;
}

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchService();
    }
  }, [slug]);

  const fetchService = async () => {
    try {
      const { data, error } = await api.get('/services', {
        params: { slug }
      });

      if (error) throw error;
      setService(data && data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <Navigation />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
            <p className="text-muted-foreground mb-8">The service you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/services')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navigation />
      
      <main className="pt-20">
        {/* Back Button */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/services')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Button>
          </div>
        </section>

        {/* Hero Section */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="text-sm">{service.category}</Badge>
                  {service.is_featured && (
                    <Badge className="bg-gradient-to-r from-primary to-accent text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Featured Service
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold">
                  {service.title}
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                
                {service.pricing_info && (
                  <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                    <h3 className="text-lg font-semibold mb-2">Pricing</h3>
                    <p className="text-2xl font-bold text-primary">{service.pricing_info}</p>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="btn-hero" onClick={() => navigate('/contact')}>
                    Get Started Today
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/contact')}>
                    Request Consultation
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                {service.image_url ? (
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                    <img 
                      src={service.image_url} 
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                    <div className="w-full h-full bg-gradient-to-br from-primary to-accent opacity-10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 text-primary opacity-50">
                        <Users />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        {service.features && service.features.length > 0 && (
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  What's Included
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Our comprehensive service includes everything you need to succeed
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {service.features.map((feature, idx) => (
                  <Card key={idx} className="hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{feature}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Why Choose Us */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Why Choose Our {service.title}?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Industry-leading capabilities that set us apart from the competition
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover-lift">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Secure & Compliant</h3>
                  <p className="text-muted-foreground">
                    Bank-grade security protocols and full regulatory compliance
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover-lift">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">24/7 Support</h3>
                  <p className="text-muted-foreground">
                    Round-the-clock support and monitoring for your peace of mind
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover-lift">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Expert Team</h3>
                  <p className="text-muted-foreground">
                    Highly trained professionals with years of industry experience
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-accent">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Contact us today to learn more about our {service.title} and how we can help your business grow.
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
                onClick={() => navigate('/services')}
              >
                View All Services
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServiceDetail;