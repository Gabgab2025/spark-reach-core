import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    message: "",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
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
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
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
                      />
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
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Service Interest</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-border rounded-lg bg-background"
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
                    />
                  </div>

                  <Button type="submit" className="btn-hero w-full py-4 text-lg font-semibold">
                    Send Message
                    <Send className="w-5 h-5 ml-2" />
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
