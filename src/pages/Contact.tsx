import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Calendar, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Client-side validation schema
const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s\-'.]+$/, "Name can only contain letters, spaces, hyphens, apostrophes, and periods"),
  email: z.string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  company: z.string()
    .trim()
    .max(100, "Company name must be less than 100 characters")
    .optional(),
  phone: z.string()
    .trim()
    .max(20, "Phone must be less than 20 characters")
    .regex(/^[\d\s\-+().]*$/, "Phone can only contain numbers and basic punctuation")
    .optional(),
  service: z.string()
    .trim()
    .max(50, "Service must be less than 50 characters")
    .optional(),
  message: z.string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
});

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    message: "",
    honeypot: "", // Hidden spam trap
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: [
        { label: "Mobile 1", value: "+639177122824" },
        { label: "Mobile 2", value: "+639954902070" },
        { label: "Telephone", value: "02-8252-0584" },
      ],
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        { label: "General Inquiries", value: "info@jdgkbsi.ph" },
        { label: "Business", value: "dbdealca@jdgkbsi.ph" },
      ],
    },
    {
      icon: MapPin,
      title: "Office Location",
      details: [
        { label: "Address", value: "Phase 1-B4 L1 Ridge Point Subdivision, Prinza 1880, Teresa, Rizal, Philippines" },
      ],
    },
  ];

  const offices = [
    {
      city: "Teresa, Rizal",
      address: "Phase 1-B4 L1 Ridge Point Subdivision\nPrinza 1880, Teresa, Rizal\nPhilippines",
      phone: "+639177122824 / +639954902070",
      tel: "02-8252-0584",
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
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData,
      });

      if (error) throw error;

      // Success!
      toast({
        title: "Message Sent! 🎉",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });

      // Clear form
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        service: "",
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
                <span className="text-primary text-sm font-medium">Get In Touch</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Connect
                <span className="block text-gradient">With Us</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Get in touch with our team and discover how we can help drive your business forward with our
                comprehensive solutions.
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
                <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
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
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                        disabled={isSubmitting}
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && (
                        <p className="text-destructive text-sm mt-1">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                        disabled={isSubmitting}
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Company</label>
                      <Input
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Enter your company name"
                        disabled={isSubmitting}
                        className={errors.company ? "border-destructive" : ""}
                      />
                      {errors.company && (
                        <p className="text-destructive text-sm mt-1">{errors.company}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        disabled={isSubmitting}
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && (
                        <p className="text-destructive text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Service Interest</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={`w-full p-3 border border-border rounded-lg bg-background ${errors.service ? "border-destructive" : ""}`}
                    >
                      <option value="">Select a service</option>
                      <option value="credit-collection">Credit Collection Recovery</option>
                      <option value="repossession">Repossession</option>
                      <option value="skip-tracing">Skip Tracing</option>
                      <option value="credit-investigation">Credit Investigation</option>
                      <option value="tele-sales">Tele Sales</option>
                      <option value="virtual-assistance">Virtual Assistance</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.service && (
                      <p className="text-destructive text-sm mt-1">{errors.service}</p>
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
                        Send Message
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
