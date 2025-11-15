import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Linkedin, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  const services = [
    { label: 'Credit Collection Recovery', href: '/services' },
    { label: 'Repossession', href: '/services' },
    { label: 'Skip Tracing', href: '/services' },
    { label: 'Credit Investigation', href: '/services' },
    { label: 'Tele Sales', href: '/services' },
    { label: 'Virtual Assistance', href: '/services' },
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
              Partner with us for comprehensive business solutions including credit recovery, 
              asset management, and professional virtual assistance services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-hero px-8 py-4 text-lg font-semibold">
                <Link to="/contact">
                  Let's Work Together
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="px-8 py-4 text-lg font-semibold border-white/30 text-white hover:bg-white/10 dark:border-border dark:text-foreground dark:hover:bg-muted">
                <Link to="/services">
                  View Our Services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gradient">JDGK BUSINESS SOLUTIONS INC.</h3>
                <p className="text-sm text-white/70 dark:text-muted-foreground">RESULTS DRIVEN, CLIENT FOCUSED</p>
              </div>
            </div>
            <p className="text-white/90 dark:text-card-foreground mb-6 leading-relaxed">
              Empowering businesses through efficient and innovative solutions. We provide 
              comprehensive business strategies including credit collection recovery, asset 
              management, and virtual assistance services.
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
                  <Link to={link.href} className="text-white/80 hover:text-white dark:text-muted-foreground dark:hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
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
                  <Link to={service.href} className="text-white/80 hover:text-white dark:text-muted-foreground dark:hover:text-foreground transition-colors">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white dark:text-foreground">Contact</h4>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-yellow-500" />
                  <a href="tel:+639177122824" className="text-white/90 dark:text-card-foreground hover:text-white dark:hover:text-foreground transition-colors">
                    +639177122824
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-yellow-500 opacity-0" />
                  <a href="tel:+639954902070" className="text-white/90 dark:text-card-foreground hover:text-white dark:hover:text-foreground transition-colors">
                    +639954902070
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-yellow-500 opacity-0" />
                  <a href="tel:0282520584" className="text-white/90 dark:text-card-foreground hover:text-white dark:hover:text-foreground transition-colors">
                    02-8252-0584
                  </a>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-yellow-500" />
                  <a href="mailto:info@jdgkbsi.ph" className="text-white/90 dark:text-card-foreground hover:text-white dark:hover:text-foreground transition-colors">
                    info@jdgkbsi.ph
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-yellow-500 opacity-0" />
                  <a href="mailto:dbdealca@jdgkbsi.ph" className="text-white/90 dark:text-card-foreground hover:text-white dark:hover:text-foreground transition-colors">
                    dbdealca@jdgkbsi.ph
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-yellow-500 mt-1" />
                <span className="text-white/90 dark:text-card-foreground">
                  Phase 1-B4 L1 Ridge Point Subdivision<br />
                  Prinza 1880, Teresa, Rizal<br />
                  Philippines
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 dark:border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/70 dark:text-muted-foreground text-sm">
              © 2025 JDGK Business Solutions Inc. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-white/70 dark:text-muted-foreground text-sm">Registered with SEC</span>
              <div className="px-3 py-1 bg-white/10 dark:bg-muted rounded text-xs font-medium text-white dark:text-foreground">
                March 3, 2025
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;