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
    <footer className="bg-navy text-white">
      {/* CTA Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-16">
          <div className="glass rounded-3xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-black/80 text-lg mb-8 max-w-2xl mx-auto">
              Join 500+ financial institutions who trust CallCenter Pro for their 
              customer service and collections needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-hero px-8 py-4 text-lg font-semibold">
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" className="btn-glass px-8 py-4 text-lg font-semibold text-white border-white/30">
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-corporate to-teal flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gradient">CallCenter Pro</h3>
                <p className="text-sm text-white/70">Excellence in Service</p>
              </div>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">
              Leading provider of call center services and bank collections solutions. 
              We combine advanced technology with expert teams to deliver exceptional 
              results for financial institutions worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a href={service.href} className="text-white/70 hover:text-white transition-colors">
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-teal" />
                <span className="text-white/80">1-800-CALL-PRO</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-teal" />
                <span className="text-white/80">info@callcenterpro.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-teal mt-1" />
                <span className="text-white/80">
                  123 Business Center<br />
                  New York, NY 10001
                </span>
              </div>
            </div>
            
            <h5 className="font-semibold mb-3">Legal</h5>
            <ul className="space-y-2">
              {legal.map((item, index) => (
                <li key={index}>
                  <a href={item.href} className="text-white/70 hover:text-white transition-colors text-sm">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © 2024 CallCenter Pro. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-white/60 text-sm">Certified & Compliant</span>
              <div className="flex space-x-3">
                <div className="px-3 py-1 bg-white/10 rounded text-xs font-medium">SOC 2</div>
                <div className="px-3 py-1 bg-white/10 rounded text-xs font-medium">HIPAA</div>
                <div className="px-3 py-1 bg-white/10 rounded text-xs font-medium">PCI DSS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;