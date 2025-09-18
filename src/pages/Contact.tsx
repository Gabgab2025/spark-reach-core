import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: [
        { label: 'Main Line', value: '1-800-CALL-PRO' },
        { label: 'Sales', value: '1-800-555-0123' },
        { label: 'Support', value: '1-800-555-0124' }
      ]
    },
    {
      icon: Mail,
      title: 'Email',
      details: [
        { label: 'General Inquiries', value: 'info@callcenterpro.com' },
        { label: 'Sales', value: 'sales@callcenterpro.com' },
        { label: 'Support', value: 'support@callcenterpro.com' }
      ]
    },
    {
      icon: MapPin,
      title: 'Headquarters',
      details: [
        { label: 'Address', value: '123 Business Center Drive' },
        { label: 'City', value: 'New York, NY 10001' },
        { label: 'Hours', value: 'Mon-Fri: 8:00 AM - 6:00 PM EST' }
      ]
    }
  ];

  const offices = [
    {
      city: 'New York',
      address: '123 Business Center Drive\nNew York, NY 10001',
      phone: '1-800-555-0123',
      isHQ: true
    },
    {
      city: 'Chicago',
      address: '456 Technology Blvd\nChicago, IL 60601',
      phone: '1-312-555-0123',
      isHQ: false
    },
    {
      city: 'Dallas',
      address: '789 Innovation Way\nDallas, TX 75201',
      phone: '1-214-555-0123',
      isHQ: false
    },
    {
      city: 'San Francisco',
      address: '321 Tech Street\nSan Francisco, CA 94105',
      phone: '1-415-555-0123',
      isHQ: false
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="relative py-32 hero-gradient">
          <div className="absolute inset-0 bg-navy/60" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Contact
                <span className="block text-gradient">Us</span>
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Ready to transform your call center operations? Get in touch with our experts 
                and discover how we can help drive your business forward.
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
                      <option value="call-center">Call Center Solutions</option>
                      <option value="collections">Bank Collections</option>
                      <option value="customer-experience">Customer Experience</option>
                      <option value="technology">Technology Integration</option>
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
                      <Button variant="outline">
                        Chat Now
                      </Button>
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
                      <Button variant="outline">
                        Watch Demo
                      </Button>
                    </div>
                  </Card>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl">
                  <h3 className="font-bold mb-3">Emergency Support</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Need immediate assistance? Our emergency support line is available 24/7.
                  </p>
                  <a href="tel:1-800-555-HELP" className="flex items-center space-x-2 text-primary font-semibold">
                    <Phone className="w-4 h-4" />
                    <span>1-800-555-HELP</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Our Locations</h2>
              <p className="text-muted-foreground text-lg">
                With offices across the country, we're always close to you
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {offices.map((office, index) => (
                <Card key={index} className={`glass p-6 text-center hover-lift transition-all duration-300 ${office.isHQ ? 'ring-2 ring-primary/20' : ''}`}>
                  {office.isHQ && (
                    <div className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium mb-4">
                      <span>Headquarters</span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-4">{office.city}</h3>
                  <div className="text-sm text-muted-foreground mb-4 whitespace-pre-line">
                    {office.address}
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-primary">
                    <Phone className="w-4 h-4" />
                    <span className="font-medium">{office.phone}</span>
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
              <h2 className="text-4xl font-bold mb-6">Visit Our Headquarters</h2>
              <p className="text-muted-foreground text-lg">
                Located in the heart of New York's business district
              </p>
            </div>

            <div className="glass rounded-3xl p-2 overflow-hidden">
              <div className="w-full h-96 bg-muted rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Interactive Map</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    123 Business Center Drive<br />
                    New York, NY 10001
                  </p>
                </div>
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