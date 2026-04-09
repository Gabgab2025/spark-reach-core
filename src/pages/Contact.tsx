/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Calendar, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import type { CMSPage, CMSSettings } from "@/hooks/useCMS";
import { usePageMeta } from '@/hooks/usePageMeta';

// Client-side validation schema
const contactSchema = z.object({
  full_name: z.string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s\-'.]+$/, "Name can only contain letters, spaces, hyphens, apostrophes, and periods"),
  email: z.string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  contact_number: z.string()
    .trim()
    .min(1, "Contact number is required")
    .max(20, "Contact number must be less than 20 characters")
    .regex(/^[\d\s\-+().]+$/, "Contact number can only contain numbers and basic punctuation"),
  message: z.string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
});

const Contact = () => {
  usePageMeta('contact');
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    contact_number: "",
    message: "",
    honeypot: "", // Hidden spam trap
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch public settings for contact info
  const { data: settings } = useQuery({    queryKey: ['public-settings'],
    queryFn: async () => {
      const { data, error } = await api.get<{ key: string; value: string }[]>('/settings/public');
      if (error) throw error;
      const map: Record<string, string> = {};
      data?.forEach((s) => { map[s.key] = s.value; });
      return map as Partial<CMSSettings>;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch contact page content from CMS
  const { data: pageContent } = useQuery({
    queryKey: ['public-page', 'contact'],
    queryFn: async () => {
      const { data, error } = await api.get<CMSPage[]>('/pages', {
        params: { slug: 'contact', status: 'published' },
      });
      if (error) throw error;
      return data?.[0]?.content ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Hero text from CMS
  const heroBadge = pageContent?.hero?.badge ?? 'Message Us';
  const heroTitle = pageContent?.hero?.title ?? 'Message';
  const heroHighlight = pageContent?.hero?.highlight ?? 'Us';
  const heroDescription = pageContent?.hero?.description ?? 'Send us a message and our team will get back to you within 24 hours.';

  // Contact info from settings (same source as Footer)
  const phone1 = settings?.phone_primary ?? '+639177122824';
  const phone2 = settings?.phone_secondary ?? '+639954902070';
  const phoneLandline = settings?.phone_landline ?? '02-8252-0584';
  const email1 = settings?.email_primary ?? 'info@jdgkbsi.ph';
  const email2 = settings?.email_secondary ?? 'dbdealca@jdgkbsi.ph';
  const officeAddress = settings?.address ?? 'Phase 1-B4 L1 Ridge Point Subdivision, Prinza 1880, Teresa, Rizal, Philippines';

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: [
        { label: "Mobile 1", value: phone1 },
        { label: "Mobile 2", value: phone2 },
        { label: "Telephone", value: phoneLandline },
      ],
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        { label: "General Inquiries", value: email1 },
        { label: "Business", value: email2 },
      ],
    },
    {
      icon: MapPin,
      title: "Office Location",
      details: [
        { label: "Address", value: officeAddress },
      ],
    },
  ];

  const offices = [
    {
      city: pageContent?.office?.city ?? "Teresa, Rizal",
      address: officeAddress.replace(/, /g, '\n'),
      phone: `${phone1} / ${phone2}`,
      tel: phoneLandline,
      isHQ: true,
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Honeypot check — bots fill hidden fields, humans leave them empty
    if (formData.honeypot !== '') return;

    // Client-side validation
    try {
      contactSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: "Validation Error",
          description: "Please check the form for errors.",
          variant: "destructive",
        });
        return;
      }
    }

    // Prevent double submission
    if (isSubmitting || isSubmitted) return;

    setIsSubmitting(true);

    try {
      // Send form data including honeypot (backend validates it server-side too)
      const { data, error } = await api.post('/contact', formData);

      if (error) throw error;

      // Success!
      toast({
        title: "Message Sent! 🎉",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });

      // Clear form
      setFormData({
        full_name: "",
        email: "",
        contact_number: "",
        message: "",
        honeypot: "",
      });

      setIsSubmitted(true);

      // Reset submission lock after 30 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 30000);

    } catch (error: any) {
      console.error("Error sending email:", error);
      toast({
        title: "Error Sending Message",
        description: error.message || "Something went wrong. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-primary text-sm font-medium">{heroBadge}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {heroTitle}
                <span className="block text-gradient">{heroHighlight}</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {heroDescription}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {contactInfo.map((info, index) => (
                <Card key={index} className="glass p-8 text-center hover-lift transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <info.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{info.title}</h3>
                  <div className="space-y-2">
                    {info.details.map((detail, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-medium text-muted-foreground">{detail.label}:</span>
                        <br />
                        <span className="text-foreground">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Message Us</h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field - hidden from users, bots will fill it */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={handleInputChange}
                    style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <Input
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                        disabled={isSubmitting}
                        className={errors.full_name ? "border-destructive" : ""}
                      />
                      {errors.full_name && (
                        <p className="text-destructive text-sm mt-1">{errors.full_name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Contact Number *</label>
                      <Input
                        type="tel"
                        name="contact_number"
                        value={formData.contact_number}
                        onChange={handleInputChange}
                        placeholder="Enter your contact number"
                        required
                        disabled={isSubmitting}
                        className={errors.contact_number ? "border-destructive" : ""}
                      />
                      {errors.contact_number && (
                        <p className="text-destructive text-sm mt-1">{errors.contact_number}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      required
                      disabled={isSubmitting}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-destructive text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your needs and how we can help..."
                      rows={5}
                      required
                      disabled={isSubmitting}
                      className={errors.message ? "border-destructive" : ""}
                    />
                    {errors.message && (
                      <p className="text-destructive text-sm mt-1">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="btn-hero w-full py-4 text-lg font-semibold"
                    disabled={isSubmitting || isSubmitted}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : isSubmitted ? (
                      <>Message Sent! ✓</>
                    ) : (
                      <>
                        Message Us
                        <Send className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Get Started Today</h2>
                <p className="text-muted-foreground mb-8">
                  Choose the best way to connect with our team and start your project.
                </p>

                <div className="space-y-6">
                  <Card className="glass p-6 hover-lift transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">Schedule a Call</h3>
                        <p className="text-sm text-muted-foreground">Speak directly with our experts</p>
                      </div>
                      <Button variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Now
                      </Button>
                    </div>
                  </Card>

                  <Card className="glass p-6 hover-lift transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-teal flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">Live Chat</h3>
                        <p className="text-sm text-muted-foreground">Get instant answers to your questions</p>
                      </div>
                      <Button variant="outline">Chat Now</Button>
                    </div>
                  </Card>

                  <Card className="glass p-6 hover-lift transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-blue-corporate flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">Request Demo</h3>
                        <p className="text-sm text-muted-foreground">See our solutions in action</p>
                      </div>
                      <Button variant="outline">Watch Demo</Button>
                    </div>
                  </Card>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl">
                  <h3 className="font-bold mb-3">Business Hours</h3>
                  <p className="text-sm text-muted-foreground mb-4">We're here to help you with your business needs.</p>
                  <a href="tel:+639177712282" className="flex items-center space-x-2 text-primary font-semibold">
                    <Phone className="w-4 h-4" />
                    <span>+63 917 71 22824</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Location */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Our Office</h2>
              <p className="text-muted-foreground text-lg">Visit us at our principal office in Teresa, Rizal</p>
            </div>

            <div className="max-w-md mx-auto">
              {offices.map((office, index) => (
                <Card
                  key={index}
                  className="glass p-8 text-center hover-lift transition-all duration-300 ring-2 ring-primary/20"
                >
                  <div className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
                    <span>Principal Office</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-6">{office.city}</h3>
                  <div className="text-muted-foreground mb-6 whitespace-pre-line leading-relaxed">{office.address}</div>
                  <div className="flex items-center justify-center space-x-2 text-primary">
                    <Phone className="w-5 h-5" />
                    <span className="font-medium text-lg">{office.phone}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6">Visit Our Office</h2>
              <p className="text-muted-foreground text-lg">Located in Teresa, Rizal, Philippines</p>
            </div>

            <div className="glass rounded-3xl p-2 overflow-hidden">
              <div className="w-full h-96 rounded-2xl overflow-hidden">
                <div className="embed-map-responsive">
                  <div className="embed-map-container">
                    <iframe
                      className="embed-map-frame"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src="https://maps.google.com/maps?width=600&height=400&hl=en&q=14.542113422200385%2C%20121.2203198955366&t=&z=15&ie=UTF8&iwloc=B&output=embed"
                      title="Office Location Map"
                    />
                  </div>
                </div>
                <style dangerouslySetInnerHTML={{
                  __html: `
                    .embed-map-responsive{position:relative;text-align:right;width:100%;height:0;padding-bottom:66.66666666666666%;}
                    .embed-map-container{overflow:hidden;background:none!important;width:100%;height:100%;position:absolute;top:0;left:0;}
                    .embed-map-frame{width:100%!important;height:100%!important;position:absolute;top:0;left:0;}
                  `
                }} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
