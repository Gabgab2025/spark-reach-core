import React from 'react';
import { Phone, Users, TrendingUp, Shield, Zap, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();

  const handleLearnMore = (serviceTitle: string) => {
    // Navigate to services page with the specific service
    navigate(`/services?service=${encodeURIComponent(serviceTitle.toLowerCase().replace(/\s+/g, '-'))}`);
  };
  const services = [
    {
      icon: Phone,
      title: 'Call Center Solutions',
      description: 'Comprehensive inbound and outbound call center services with advanced technology and skilled agents.',
      features: ['24/7 Customer Support', 'Multi-language Support', 'CRM Integration', 'Real-time Analytics'],
      color: 'blue-corporate'
    },
    {
      icon: TrendingUp,
      title: 'Bank Collections',
      description: 'Professional debt recovery services for financial institutions with proven track record and compliance.',
      features: ['Regulatory Compliance', 'Advanced Negotiation', 'Payment Processing', 'Detailed Reporting'],
      color: 'teal'
    },
    {
      icon: Users,
      title: 'Customer Experience',
      description: 'Enhance customer satisfaction with our premium customer experience management solutions.',
      features: ['Quality Assurance', 'Agent Training', 'Performance Monitoring', 'Customer Insights'],
      color: 'accent'
    }
  ];

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

        {/* Main Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div key={index} className="group">
              <div className="glass rounded-3xl p-8 h-full hover-lift hover-scale transition-all duration-300">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${service.color} to-${service.color}-light flex items-center justify-center mb-6 group-hover:shadow-glow transition-all duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-3 mb-8">
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
                  onClick={() => handleLearnMore(service.title)}
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Capabilities */}
        <div className="glass rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why Choose CallCenter Pro?</h3>
            <p className="text-muted-foreground text-lg">Industry-leading capabilities that set us apart</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {capabilities.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
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
            <Button className="btn-hero px-8 py-4 text-lg font-semibold">
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