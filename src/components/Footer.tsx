import React from 'react';
import { Phone, Mail, MapPin, Linkedin, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const quickLinks = [
    { label: 'About Us', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Careers', href: '#careers' },
    { label: 'Contact', href: '#contact' },
  ];

  const services = [
    { label: 'Call Center Solutions', href: '#services' },
    { label: 'Bank Collections', href: '#services' },
    { label: 'Customer Experience', href: '#services' },
    { label: 'Technology Integration', href: '#services' },
  ];

  const legal = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Compliance', href: '/compliance' },
    { label: 'Security', href: '/security' },
  ];

  return (
    <footer className="bg-slate-900 dark:bg-background text-white dark:text-foreground">
      {/* CTA Section */}
      <div className="border-b border-white/10 dark:border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white/5 dark:bg-card/50 backdrop-blur-sm border border-white/10 dark:border-border rounded-3xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white dark:text-foreground">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-white/80 dark:text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join 500+ financial institutions who trust CallCenter Pro for their 
              customer service and collections needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-hero px-8 py-4 text-lg font-semibold">
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" className="px-8 py-4 text-lg font-semibold border-white/30 text-white hover:bg-white/10 dark:border-border dark:text-foreground dark:hover:bg-muted">
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gradient">CallCenter Pro</h3>
                <p className="text-sm text-white/70 dark:text-muted-foreground">Excellence in Service</p>
              </div>
            </div>
            <p className="text-white/90 dark:text-card-foreground mb-6 leading-relaxed">
              Leading provider of call center services and bank collections solutions. 
              We combine advanced technology with expert teams to deliver exceptional 
              results for financial institutions worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-muted dark:hover:bg-muted/80 flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5 text-white dark:text-muted-foreground" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-muted dark:hover:bg-muted/80 flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5 text-white dark:text-muted-foreground" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-muted dark:hover:bg-muted/80 flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5 text-white dark:text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white dark:text-foreground">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-white/80 hover:text-white dark:text-muted-foreground dark:hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white dark:text-foreground">Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a href={service.href} className="text-white/80 hover:text-white dark:text-muted-foreground dark:hover:text-foreground transition-colors">
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white dark:text-foreground">Contact</h4>
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-yellow-500" />
                <span className="text-white/90 dark:text-card-foreground">1-800-CALL-PRO</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-yellow-500" />
                <span className="text-white/90 dark:text-card-foreground">info@callcenterpro.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-yellow-500 mt-1" />
                <span className="text-white/90 dark:text-card-foreground">
                  123 Business Center<br />
                  New York, NY 10001
                </span>
              </div>
            </div>
            
            <h5 className="font-semibold mb-3 text-white dark:text-foreground">Legal</h5>
            <ul className="space-y-2">
              {legal.map((item, index) => (
                <li key={index}>
                  <a href={item.href} className="text-white/70 hover:text-white dark:text-muted-foreground dark:hover:text-foreground transition-colors text-sm">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 dark:border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/70 dark:text-muted-foreground text-sm">
              © 2024 CallCenter Pro. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-white/70 dark:text-muted-foreground text-sm">Certified & Compliant</span>
              <div className="flex space-x-3">
                <div className="px-3 py-1 bg-white/10 dark:bg-muted rounded text-xs font-medium text-white dark:text-foreground">SOC 2</div>
                <div className="px-3 py-1 bg-white/10 dark:bg-muted rounded text-xs font-medium text-white dark:text-foreground">HIPAA</div>
                <div className="px-3 py-1 bg-white/10 dark:bg-muted rounded text-xs font-medium text-white dark:text-foreground">PCI DSS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;