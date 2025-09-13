import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Phone, TrendingUp, Users, Shield, Zap, Globe, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ServicesPage = () => {
  const mainServices = [
    {
      icon: Phone,
      title: 'Call Center Solutions',
      description: 'Comprehensive inbound and outbound call center services designed to enhance customer experience and drive business growth.',
      features: [
        'Inbound Customer Support',
        'Outbound Sales & Marketing',
        'Technical Help Desk',
        'Order Processing',
        'Appointment Scheduling',
        'Multi-language Support',
        'CRM Integration',
        'Real-time Monitoring'
      ],
      benefits: [
        '24/7 Customer Coverage',
        'Reduced Operational Costs',
        'Improved Customer Satisfaction',
        'Scalable Solutions'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Bank Collections Services',
      description: 'Professional debt recovery services with proven results, full compliance, and customer relationship preservation.',
      features: [
        'Early Stage Collections',
        'Default Management',
        'Skip Tracing',
        'Payment Plan Negotiation',
        'Legal Compliance',
        'Detailed Reporting',
        'Customer Retention',
        'Recovery Analytics'
      ],
      benefits: [
        'Higher Recovery Rates',
        'Regulatory Compliance',
        'Preserved Customer Relations',
        'Detailed Performance Metrics'
      ]
    },
    {
      icon: Users,
      title: 'Customer Experience Management',
      description: 'End-to-end customer experience solutions that transform how you interact with your customers.',
      features: [
        'Customer Journey Mapping',
        'Quality Assurance',
        'Agent Training Programs',
        'Performance Analytics',
        'Voice of Customer Programs',
        'Omnichannel Support',
        'Customer Feedback Systems',
        'Experience Optimization'
      ],
      benefits: [
        'Increased Customer Loyalty',
        'Enhanced Brand Reputation',
        'Improved Agent Performance',
        'Data-Driven Insights'
      ]
    }
  ];

  const additionalServices = [
    { icon: Shield, title: 'Compliance & Risk Management', desc: 'Comprehensive regulatory compliance and risk mitigation' },
    { icon: Zap, title: 'AI & Automation', desc: 'Cutting-edge AI solutions for enhanced efficiency' },
    { icon: Globe, title: 'Global Operations', desc: 'Worldwide service delivery with local expertise' }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="relative py-32 hero-gradient">
          <div className="absolute inset-0 bg-navy/80" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Our
                <span className="block text-gradient">Services</span>
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Comprehensive call center and collections solutions designed to drive 
                your business forward with cutting-edge technology and expert teams.
              </p>
            </div>
          </div>
        </section>

        {/* Main Services */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {mainServices.map((service, index) => (
              <div key={index} className={`mb-20 last:mb-0 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-4xl font-bold">{service.title}</h2>
                    </div>
                    
                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-4">Key Benefits</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-foreground">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="btn-hero px-8 py-4">
                      Learn More
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>

                  <div className="glass rounded-3xl p-8 hover-lift">
                    <h3 className="text-2xl font-bold mb-6">Service Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg">
                          <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                          <span className="text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Additional Capabilities</h2>
              <p className="text-muted-foreground text-lg">
                Specialized services that enhance our core offerings
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {additionalServices.map((service, index) => (
                <div key={index} className="glass rounded-3xl p-8 text-center hover-lift hover-scale transition-all duration-300">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                    <service.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                  <p className="text-muted-foreground">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Powered by Advanced Technology</h2>
              <p className="text-muted-foreground text-lg">
                Industry-leading technology stack that drives exceptional results
              </p>
            </div>

            <div className="glass rounded-3xl p-8 lg:p-12">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <h4 className="font-bold mb-3">AI & Machine Learning</h4>
                  <p className="text-muted-foreground text-sm">Predictive analytics, sentiment analysis, automated workflows</p>
                </div>
                <div className="text-center">
                  <h4 className="font-bold mb-3">Cloud Infrastructure</h4>
                  <p className="text-muted-foreground text-sm">Scalable, secure, and reliable cloud-based solutions</p>
                </div>
                <div className="text-center">
                  <h4 className="font-bold mb-3">Real-time Analytics</h4>
                  <p className="text-muted-foreground text-sm">Live dashboards, performance metrics, actionable insights</p>
                </div>
                <div className="text-center">
                  <h4 className="font-bold mb-3">Integration APIs</h4>
                  <p className="text-muted-foreground text-sm">Seamless integration with existing systems and workflows</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-accent text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Schedule a consultation to discuss how our services can transform your operations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" className="px-8 py-4 text-lg font-semibold">
                Request Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" className="btn-glass px-8 py-4 text-lg font-semibold text-white border-white/30">
                Download Brochure
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;