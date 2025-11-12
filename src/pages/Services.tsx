import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Headphones, Shield, Search, FileCheck, Phone, Users, TrendingUp, DollarSign } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Headphones,
      title: 'Credit Collection Recovery',
      description: 'Comprehensive credit recovery services designed to optimize cash flow and minimize bad debts using proven, ethical strategies.',
      features: [
        'Debt Collection & Negotiation',
        'Account Reconciliation',
        'Skip Tracing',
        'Legal Referrals'
      ],
      category: 'Financial Services'
    },
    {
      icon: Shield,
      title: 'Repossession',
      description: 'Professional and discreet asset recovery operations that ensure compliance and protect client interests.',
      features: [
        'Asset Tracing & Retrieval',
        'Secure Asset Storage',
        'Detailed Condition Reporting'
      ],
      category: 'Asset Recovery'
    },
    {
      icon: Search,
      title: 'Skip Tracing',
      description: 'Specialized investigative service for locating individuals or assets with precision and discretion. Used in collections, legal, finance, and real estate industries.',
      features: [
        'Advanced Location Services',
        'Confidential Investigations',
        'Industry-Specific Solutions'
      ],
      category: 'Investigation'
    },
    {
      icon: FileCheck,
      title: 'Credit Investigation',
      description: 'Verification of credit and financial background for loan applications, collections, or client vetting.',
      features: [
        'Comprehensive Background Checks',
        'Financial History Analysis',
        'Risk Assessment'
      ],
      category: 'Verification'
    },
    {
      icon: Phone,
      title: 'Tele Sales',
      description: 'Outbound and inbound calling solutions for lead generation, follow-ups, and debt recovery support.',
      features: [
        'Lead Generation',
        'Customer Follow-ups',
        'Sales Campaign Management'
      ],
      category: 'Sales Support'
    },
    {
      icon: Users,
      title: 'Virtual Assistance',
      description: 'Reliable and streamlined administrative and operational support to help clients focus on their core business priorities.',
      features: [
        'Administrative Support',
        'Customer Service',
        'Data Entry',
        'Scheduling & Calendar Management',
        'Bookkeeping'
      ],
      category: 'Business Support'
    }
  ];

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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div key={index} className="group">
                    <div className="glass rounded-3xl p-8 h-full hover-lift hover-scale transition-all duration-300">
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
                      
                      <ul className="space-y-2 mb-6">
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
                        onClick={() => navigate('/contact')}
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Why Choose JDGK Business Solutions?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Industry-leading capabilities that set us apart from the competition
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass rounded-3xl p-8 text-center hover-lift">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Proven Results</h3>
                <p className="text-muted-foreground">
                  Track record of delivering exceptional results for our clients
                </p>
              </div>
              
              <div className="glass rounded-3xl p-8 text-center hover-lift">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Trusted Partner</h3>
                <p className="text-muted-foreground">
                  Recognized industry leader serving major financial institutions
                </p>
              </div>
              
              <div className="glass rounded-3xl p-8 text-center hover-lift">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Maximize Profitability</h3>
                <p className="text-muted-foreground">
                  Optimize operational efficiency and maximize your bottom line
                </p>
              </div>
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