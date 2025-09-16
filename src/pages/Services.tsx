import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Star, CheckCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

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

const Services = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedService = searchParams.get('service');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (slug: string) => {
    navigate(`/service/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                <span className="text-primary text-sm font-medium">Our Services</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Professional
                <span className="block text-gradient">Business Solutions</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover our comprehensive range of services designed to drive your business forward 
                with cutting-edge technology and expert teams.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            {services.length === 0 ? (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">No Services Available</h2>
                <p className="text-muted-foreground mb-8">Services will appear here once they are added to the system.</p>
                <Button onClick={() => navigate('/')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                  <Card key={service.id} className="group cursor-pointer hover-lift" onClick={() => handleServiceClick(service.slug)}>
                    <CardHeader>
                      {service.image_url && (
                        <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                          <img 
                            src={service.image_url} 
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{service.category}</Badge>
                        {service.is_featured && (
                          <Badge className="bg-gradient-to-r from-primary to-accent text-white">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {service.features && service.features.length > 0 && (
                        <div className="space-y-2 mb-6">
                          {service.features.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                              <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                          {service.features.length > 3 && (
                            <div className="text-sm text-muted-foreground">
                              +{service.features.length - 3} more features
                            </div>
                          )}
                        </div>
                      )}
                      
                      {service.pricing_info && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-primary">{service.pricing_info}</p>
                        </div>
                      )}
                      
                      <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Why Choose CallCenter Pro?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Industry-leading capabilities that set us apart from the competition
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover-lift">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Proven Results</h3>
                  <p className="text-muted-foreground">
                    Track record of delivering exceptional results for our clients
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover-lift">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Award-Winning</h3>
                  <p className="text-muted-foreground">
                    Recognized industry leader with multiple awards and certifications
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover-lift">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <ArrowRight className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Future-Ready</h3>
                  <p className="text-muted-foreground">
                    Cutting-edge technology and innovative solutions for tomorrow's challenges
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
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Contact us today to learn more about our services and how we can help you achieve your goals.
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