import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Briefcase, MapPin, Clock, Users, Heart, TrendingUp, Upload, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  const openPositions = [
    {
      title: 'Senior Call Center Agent',
      department: 'Operations',
      location: 'New York, NY / Remote',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Join our team as a Senior Call Center Agent and help deliver exceptional customer service for our financial institution clients.',
      requirements: [
        'Excellent communication and interpersonal skills',
        'Experience in customer service or call center environment',
        'Knowledge of financial services preferred',
        'Proficiency in CRM systems',
        'Ability to handle high-volume customer interactions'
      ],
      benefits: [
        'Competitive salary + performance bonuses',
        'Comprehensive health benefits',
        'Flexible work arrangements',
        'Professional development opportunities'
      ]
    },
    {
      title: 'Collections Specialist',
      department: 'Collections',
      location: 'Chicago, IL / Hybrid',
      type: 'Full-time',
      experience: '2+ years',
      description: 'Seeking an experienced Collections Specialist to manage debt recovery processes while maintaining positive customer relationships.',
      requirements: [
        'Experience in debt collection or financial services',
        'Knowledge of FDCPA and other collection regulations',
        'Strong negotiation and problem-solving skills',
        'Ability to work with collection software and databases',
        'Professional demeanor under pressure'
      ],
      benefits: [
        'Base salary + commission structure',
        'Health, dental, and vision insurance',
        '401(k) with company matching',
        'Career advancement opportunities'
      ]
    },
    {
      title: 'AI Solutions Engineer',
      department: 'Technology',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Lead the development of AI-powered solutions to enhance our call center operations and customer experience.',
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        'Experience with machine learning and AI technologies',
        'Proficiency in Python, TensorFlow, or similar frameworks',
        'Understanding of call center operations',
        'Strong analytical and problem-solving skills'
      ],
      benefits: [
        'Competitive tech industry salary',
        'Stock options and equity participation',
        'Unlimited PTO policy',
        'Cutting-edge technology budget'
      ]
    },
    {
      title: 'Quality Assurance Manager',
      department: 'Operations',
      location: 'Dallas, TX / Hybrid',
      type: 'Full-time',
      experience: '4+ years',
      description: 'Oversee quality assurance programs to ensure exceptional service delivery and compliance standards.',
      requirements: [
        'Experience in quality assurance or operations management',
        'Knowledge of call center quality metrics',
        'Leadership and team management skills',
        'Familiarity with compliance requirements',
        'Data analysis and reporting capabilities'
      ],
      benefits: [
        'Management-level compensation',
        'Performance-based bonuses',
        'Leadership development programs',
        'Comprehensive benefits package'
      ]
    }
  ];

  const benefits = [
    { icon: Heart, title: 'Health & Wellness', desc: 'Comprehensive medical, dental, and vision coverage' },
    { icon: TrendingUp, title: 'Career Growth', desc: 'Professional development and advancement opportunities' },
    { icon: Clock, title: 'Work-Life Balance', desc: 'Flexible schedules and remote work options' },
    { icon: Users, title: 'Team Culture', desc: 'Collaborative environment with team-building activities' }
  ];

  const handleJobApplication = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Application submitted');
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
                <span className="text-primary text-sm font-medium">Join Our Team</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Build Your Career
                <span className="block text-gradient">With Industry Leaders</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We're looking for passionate professionals to help shape the future of 
                call center and collections services with cutting-edge technology.
              </p>
            </div>
          </div>
        </section>

        {/* Company Culture */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Why Work With Us?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Join a team that values innovation, growth, and excellence in everything we do.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                    <benefit.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.desc}</p>
                </div>
              ))}
            </div>

            <div className="glass rounded-3xl p-8 lg:p-12 text-center">
              <h3 className="text-3xl font-bold mb-6">Our Culture</h3>
              <p className="text-muted-foreground text-lg mb-8 max-w-3xl mx-auto">
                At CallCenter Pro, we foster an environment of collaboration, innovation, and continuous learning. 
                Our team members are empowered to make decisions, drive change, and grow their careers while 
                delivering exceptional results for our clients.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-background/50 rounded-xl">
                  <h4 className="font-bold mb-2">Innovation</h4>
                  <p className="text-sm text-muted-foreground">Encouraging creative solutions and new ideas</p>
                </div>
                <div className="p-4 bg-background/50 rounded-xl">
                  <h4 className="font-bold mb-2">Growth</h4>
                  <p className="text-sm text-muted-foreground">Continuous learning and career development</p>
                </div>
                <div className="p-4 bg-background/50 rounded-xl">
                  <h4 className="font-bold mb-2">Excellence</h4>
                  <p className="text-sm text-muted-foreground">Striving for the highest standards in everything</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Open Positions</h2>
              <p className="text-muted-foreground text-lg">
                Explore exciting career opportunities with our growing team
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {openPositions.map((job, index) => (
                <Card key={index} className="glass p-6 hover-lift transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {job.department}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedJob(selectedJob === index ? null : index)}
                      className="shrink-0"
                    >
                      {selectedJob === index ? 'Close' : 'View Details'}
                    </Button>
                  </div>

                  <p className="text-muted-foreground mb-4">{job.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">
                      Experience: {job.experience}
                    </span>
                    <Button className="btn-hero">
                      Apply Now
                    </Button>
                  </div>

                  {selectedJob === index && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold mb-3">Requirements</h4>
                          <ul className="space-y-2">
                            {job.requirements.map((req, idx) => (
                              <li key={idx} className="text-sm flex items-start">
                                <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-bold mb-3">Benefits</h4>
                          <ul className="space-y-2">
                            {job.benefits.map((benefit, idx) => (
                              <li key={idx} className="text-sm flex items-start">
                                <div className="w-2 h-2 bg-accent rounded-full mr-3 mt-2 shrink-0" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-6">Apply Today</h2>
                <p className="text-muted-foreground text-lg">
                  Ready to join our team? Submit your application and we'll get back to you soon.
                </p>
              </div>

              <form onSubmit={handleJobApplication} className="glass rounded-3xl p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <Input placeholder="Enter your first name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <Input placeholder="Enter your last name" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <Input type="email" placeholder="Enter your email address" required />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input type="tel" placeholder="Enter your phone number" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Position of Interest *</label>
                  <select className="w-full p-3 border border-border rounded-lg bg-background" required>
                    <option value="">Select a position</option>
                    {openPositions.map((job, index) => (
                      <option key={index} value={job.title}>{job.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Cover Letter</label>
                  <Textarea 
                    placeholder="Tell us why you're interested in this position..." 
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Resume Upload *</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">
                      Drag and drop your resume here, or click to browse
                    </p>
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
                    <Button variant="outline" type="button">
                      Choose File
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="btn-hero w-full py-4 text-lg font-semibold">
                  Submit Application
                  <Send className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;