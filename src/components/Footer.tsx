import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Linkedin, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CMSService, CMSSettings } from '@/hooks/useCMS';
import { useBlocksByPage } from '@/hooks/useContentBlocks';

const Footer = () => {
  const { getBlock } = useBlocksByPage('footer');

  // Block data with fallbacks
  const ctaBlock = getBlock('footer-cta');
  const companyBlock = getBlock('footer-company');
  const linksBlock = getBlock('footer-links');
  const bottomBlock = getBlock('footer-bottom');

  const FALLBACK_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  const quickLinks = (linksBlock?.items as { label: string; href: string }[]) ?? FALLBACK_LINKS;

  // Fetch services for the services list
  const { data: cmsServices } = useQuery({
    queryKey: ['public-services'],
    queryFn: async () => {
      const { data, error } = await api.get<CMSService[]>('/services', {
        params: { sort_by: 'sort_order', order: 'asc' },
      });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch public settings for contact info & social links
  const { data: settings } = useQuery({
    queryKey: ['public-settings'],
    queryFn: async () => {
      const { data, error } = await api.get<{ key: string; value: string }[]>('/settings/public');
      if (error) throw error;
      const map: Record<string, string> = {};
      data?.forEach((s) => { map[s.key] = s.value; });
      return map as Partial<CMSSettings>;
    },
    staleTime: 5 * 60 * 1000,
  });

  const FALLBACK_SERVICES = [
    { label: 'Credit Collection Recovery', slug: 'credit-collection-recovery' },
    { label: 'Repossession', slug: 'repossession' },
    { label: 'Skip Tracing', slug: 'skip-tracing' },
    { label: 'Credit Investigation', slug: 'credit-investigation' },
    { label: 'Tele Sales', slug: 'tele-sales' },
    { label: 'Virtual Assistance', slug: 'virtual-assistance' },
  ];

  const services = cmsServices && cmsServices.length > 0
    ? cmsServices.slice(0, 6).map((s) => ({ label: s.title, slug: s.slug }))
    : FALLBACK_SERVICES;

  // Contact info from CMS settings or fallback
  const companyName = settings?.company_name ?? 'JDGK BUSINESS SOLUTIONS INC.';
  const phone1 = settings?.phone_primary ?? '+639177122824';
  const phone2 = settings?.phone_secondary ?? '+639954902070';
  const phone3 = settings?.phone_landline ?? '02-8252-0584';
  const email1 = settings?.email_primary ?? 'info@jdgkbsi.ph';
  const email2 = settings?.email_secondary ?? 'dbdealca@jdgkbsi.ph';
  const address = settings?.address ?? 'Phase 1-B4 L1 Ridge Point Subdivision\nPrinza 1880, Teresa, Rizal\nPhilippines';
  const linkedinUrl = settings?.linkedin_url ?? '#';
  const twitterUrl = settings?.twitter_url ?? '#';
  const facebookUrl = settings?.facebook_url ?? '#';

  return (
    <footer className="bg-slate-900 dark:bg-background text-white dark:text-foreground">
      {/* CTA Section */}
      <div className="border-b border-white/10 dark:border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white/5 dark:bg-card/50 backdrop-blur-sm border border-white/10 dark:border-border rounded-3xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white dark:text-foreground">
              {ctaBlock?.title ?? 'Ready to Transform Your Operations?'}
            </h2>
            <p className="text-white/80 dark:text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              {ctaBlock?.description ?? 'Partner with us for comprehensive business solutions including credit recovery, asset management, and professional virtual assistance services.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-hero px-8 py-4 text-lg font-semibold">
                <Link to={ctaBlock?.primary_button_link ?? '/contact'}>
                  {ctaBlock?.primary_button_text ?? "Let's Work Together"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="px-8 py-4 text-lg font-semibold border-white/30 text-white hover:bg-white/10 dark:border-border dark:text-foreground dark:hover:bg-muted">
                <Link to={ctaBlock?.secondary_button_link ?? '/services'}>
                  {ctaBlock?.secondary_button_text ?? 'View Our Services'}
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
                <h3 className="text-xl font-bold text-gradient">{companyBlock?.company_name ?? companyName}</h3>
                <p className="text-sm text-white/70 dark:text-muted-foreground">{companyBlock?.tagline ?? 'RESULTS DRIVEN, CLIENT FOCUSED'}</p>
              </div>
            </div>
            <p className="text-white/90 dark:text-card-foreground mb-6 leading-relaxed">
              {companyBlock?.description ?? 'Empowering businesses through efficient and innovative solutions. We provide comprehensive business strategies including credit collection recovery, asset management, and virtual assistance services.'}
            </p>
            <div className="flex space-x-4">
              {linkedinUrl !== '#' && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-muted dark:hover:bg-muted/80 flex items-center justify-center transition-colors">
                  <Linkedin className="w-5 h-5 text-white dark:text-muted-foreground" />
                </a>
              )}
              {twitterUrl !== '#' && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-muted dark:hover:bg-muted/80 flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5 text-white dark:text-muted-foreground" />
                </a>
              )}
              {facebookUrl !== '#' && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-muted dark:hover:bg-muted/80 flex items-center justify-center transition-colors">
                  <Facebook className="w-5 h-5 text-white dark:text-muted-foreground" />
                </a>
              )}
              {/* Show placeholders if no social links configured */}
              {linkedinUrl === '#' && twitterUrl === '#' && facebookUrl === '#' && (
                <>
                  <span className="w-10 h-10 rounded-lg bg-white/10 dark:bg-muted flex items-center justify-center">
                    <Linkedin className="w-5 h-5 text-white/50 dark:text-muted-foreground" />
                  </span>
                  <span className="w-10 h-10 rounded-lg bg-white/10 dark:bg-muted flex items-center justify-center">
                    <Twitter className="w-5 h-5 text-white/50 dark:text-muted-foreground" />
                  </span>
                  <span className="w-10 h-10 rounded-lg bg-white/10 dark:bg-muted flex items-center justify-center">
                    <Facebook className="w-5 h-5 text-white/50 dark:text-muted-foreground" />
                  </span>
                </>
              )}
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
                  <Link to={`/services?service=${service.slug}`} className="text-white/80 hover:text-white dark:text-muted-foreground dark:hover:text-foreground transition-colors">
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
                  <a href={`tel:${phone1.replace(/[^+\d]/g, '')}`} className="text-white/90 dark:text-card-foreground hover:text-white dark:hover:text-foreground transition-colors">
                    {phone1}
                  </a>
                </div>
                {phone2 && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-yellow-500 opacity-0" />
                    <a href={`tel:${phone2.replace(/[^+\d]/g, '')}`} className="text-white/90 dark:text-card-foreground hover:text-white dark:hover:text-foreground transition-colors">
                      {phone2}
                    </a>
                  </div>
                )}
                {phone3 && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-yellow-500 opacity-0" />
                    <a href={`tel:${phone3.replace(/[^+\d]/g, '')}`} className="text-white/90 dark:text-card-foreground hover:text-white dark:hover:text-foreground transition-colors">
                      {phone3}
                    </a>
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-yellow-500" />
                  <a href={`mailto:${email1}`} className="text-white/90 dark:text-card-foreground hover:text-white dark:hover:text-foreground transition-colors">
                    {email1}
                  </a>
                </div>
                {email2 && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-yellow-500 opacity-0" />
                    <a href={`mailto:${email2}`} className="text-white/90 dark:text-card-foreground hover:text-white dark:hover:text-foreground transition-colors">
                      {email2}
                    </a>
                  </div>
                )}
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-yellow-500 mt-1" />
                <span className="text-white/90 dark:text-card-foreground whitespace-pre-line">
                  {address}
                </span>
              </div>
            </div>
          </div>

          {/* NPC DPO/DPS Registration Sticker */}
          <div className="lg:col-start-4 flex justify-center lg:justify-start">
            <img
              src="/licenses/npnc-dpo.png"
              alt="NPC DPO/DPS Registered - National Privacy Commission, Valid until 02 February 2027"
              className="w-48 h-auto opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 dark:border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/70 dark:text-muted-foreground text-sm">
              © {new Date().getFullYear()} {bottomBlock?.company_name ?? companyName}. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-white/70 dark:text-muted-foreground text-sm">{bottomBlock?.registration_label ?? 'Registered with SEC'}</span>
              <div className="px-3 py-1 bg-white/10 dark:bg-muted rounded text-xs font-medium text-white dark:text-foreground">
                {bottomBlock?.registration_date ?? 'March 3, 2025'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;