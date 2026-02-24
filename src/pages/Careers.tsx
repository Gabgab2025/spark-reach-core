import React, { useState, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Briefcase, MapPin, Clock, Users, Heart, TrendingUp, Upload, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CMSJobListing, CMSPage } from '@/hooks/useCMS';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { usePageMeta } from '@/hooks/usePageMeta';

const Careers = () => {
  usePageMeta('careers');
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch open job listings from CMS API
  const { data: cmsJobs, isLoading } = useQuery({
    queryKey: ['public-job-listings'],
    queryFn: async () => {
      const { data, error } = await api.get<CMSJobListing[]>('/job_listings', {
        params: { status: 'open', sort_by: 'created_at', order: 'desc' },
      });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Hardcoded fallback positions (only used if API returns nothing)
  const FALLBACK_POSITIONS = [
    { id: 'fallback-1', title: 'Senior Call Center Agent', department: 'Operations', location: 'New York, NY / Remote', employment_type: 'Full-time', description: 'Join our team as a Senior Call Center Agent and help deliver exceptional customer service for our financial institution clients.', requirements: ['Excellent communication and interpersonal skills', 'Experience in customer service or call center environment', 'Knowledge of financial services preferred', 'Proficiency in CRM systems', 'Ability to handle high-volume customer interactions'], benefits: ['Competitive salary + performance bonuses', 'Comprehensive health benefits', 'Flexible work arrangements', 'Professional development opportunities'], salary_range: null, status: 'open' as const, applications_count: 0, created_at: '', updated_at: '' },
    { id: 'fallback-2', title: 'Collections Specialist', department: 'Collections', location: 'Chicago, IL / Hybrid', employment_type: 'Full-time', description: 'Seeking an experienced Collections Specialist to manage debt recovery processes while maintaining positive customer relationships.', requirements: ['Experience in debt collection or financial services', 'Knowledge of FDCPA and other collection regulations', 'Strong negotiation and problem-solving skills', 'Ability to work with collection software and databases', 'Professional demeanor under pressure'], benefits: ['Base salary + commission structure', 'Health, dental, and vision insurance', '401(k) with company matching', 'Career advancement opportunities'], salary_range: null, status: 'open' as const, applications_count: 0, created_at: '', updated_at: '' },
  ];

  const openPositions = cmsJobs && cmsJobs.length > 0 ? cmsJobs : FALLBACK_POSITIONS;

  // Fetch careers page content from CMS
  const { data: pageContent } = useQuery({
    queryKey: ['public-page', 'careers'],
    queryFn: async () => {
      const { data, error } = await api.get<CMSPage[]>('/pages', {
        params: { slug: 'careers', status: 'published' },
      });
      if (error) throw error;
      return data?.[0]?.content ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Hero text from CMS
  const heroBadge = pageContent?.hero?.badge ?? 'Join Our Team';
  const heroTitle = pageContent?.hero?.title ?? 'Build Your Career';
  const heroHighlight = pageContent?.hero?.highlight ?? 'With Industry Leaders';
  const heroDescription = pageContent?.hero?.description ?? "We're looking for passionate professionals to help shape the future of call center and collections services with cutting-edge technology.";

  // Benefits from CMS
  const benefits = pageContent?.benefits ?? [
    { icon: 'Heart', title: 'Health & Wellness', desc: 'Comprehensive medical, dental, and vision coverage' },
    { icon: 'TrendingUp', title: 'Career Growth', desc: 'Professional development and advancement opportunities' },
    { icon: 'Clock', title: 'Work-Life Balance', desc: 'Flexible schedules and remote work options' },
    { icon: 'Users', title: 'Team Culture', desc: 'Collaborative environment with team-building activities' },
  ];

  // Culture section from CMS
  const cultureTitle = pageContent?.culture?.title ?? 'Our Culture';
  const cultureDescription = pageContent?.culture?.description ?? 'At JDGK Business Solutions, we foster an environment of collaboration, innovation, and continuous learning. Our team members are empowered to make decisions, drive change, and grow their careers while delivering exceptional results for our clients.';
  const culturePillars = pageContent?.culture?.pillars ?? [
    { title: 'Innovation', description: 'Encouraging creative solutions and new ideas' },
    { title: 'Growth', description: 'Continuous learning and career development' },
    { title: 'Excellence', description: 'Striving for the highest standards in everything' },
  ];

  // Icon resolver for benefits
  const BENEFIT_ICON_MAP: Record<string, typeof Heart> = { Heart, TrendingUp, Clock, Users, Briefcase, MapPin, Upload, Send };
  const resolveBenefitIcon = (name?: string) => BENEFIT_ICON_MAP[name || ''] ?? Heart;

  const handleJobApplication = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      // Upload resume if present
      let resumeUrl = '';
      if (resumeFile) {
        const uploadData = new FormData();
        uploadData.append('file', resumeFile);
        uploadData.append('path', 'resumes/');
        const { data: uploadResult, error: uploadError } = await api.upload<{ publicUrl: string }>('/storage/upload', uploadData);
        if (uploadError) throw uploadError;
        resumeUrl = uploadResult?.publicUrl ?? '';
      }

      // Send application via contact endpoint
      await api.post('/contact', {
        name: `${formData.get('firstName')} ${formData.get('lastName')}`,
        email: formData.get('email'),
        phone: formData.get('phone') || '',
        company: '',
        service: `Job Application: ${formData.get('position')}`,
        message: `Cover Letter:\n${formData.get('coverLetter') || 'N/A'}\n\nResume: ${resumeUrl || 'Not uploaded'}`,
      });

      toast({ title: 'Application Submitted', description: 'Thank you! We\'ll get back to you soon.' });
      form.reset();
      setResumeFile(null);
    } catch {
      toast({ title: 'Error', description: 'Failed to submit application. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setResumeFile(file);
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
              {benefits.map((benefit: { icon?: string; title: string; desc: string }, index: number) => {
                const BenefitIcon = resolveBenefitIcon(benefit.icon);
                return (
                  <div key={index} className="text-center group">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                      <BenefitIcon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="glass rounded-3xl p-8 lg:p-12 text-center">
              <h3 className="text-3xl font-bold mb-6">{cultureTitle}</h3>
              <p className="text-muted-foreground text-lg mb-8 max-w-3xl mx-auto">
                {cultureDescription}
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {culturePillars.map((pillar: { title: string; description: string }, idx: number) => (
                  <div key={idx} className="p-4 bg-background/50 rounded-xl">
                    <h4 className="font-bold mb-2">{pillar.title}</h4>
                    <p className="text-sm text-muted-foreground">{pillar.description}</p>
                  </div>
                ))}
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
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="glass p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-10 w-28" />
                  </Card>
                ))
              ) : (
              openPositions.map((job) => (
                <Card key={job.id} className="glass p-6 hover-lift transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        {job.department && (
                        <span className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {job.department}
                        </span>
                        )}
                        {job.location && (
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </span>
                        )}
                        {job.employment_type && (
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.employment_type}
                        </span>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                      className="shrink-0"
                    >
                      {selectedJob === job.id ? 'Close' : 'View Details'}
                    </Button>
                  </div>

                  <p className="text-muted-foreground mb-4">{job.description}</p>

                  <div className="flex items-center justify-between">
                    {job.salary_range && (
                      <span className="text-sm font-medium text-primary">
                        {job.salary_range}
                      </span>
                    )}
                    <Button className="btn-hero ml-auto"
                      onClick={() => {
                        const formEl = document.getElementById('application-form');
                        formEl?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Apply Now
                    </Button>
                  </div>

                  {selectedJob === job.id && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="grid md:grid-cols-2 gap-6">
                        {job.requirements && job.requirements.length > 0 && (
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
                        )}
                        {job.benefits && job.benefits.length > 0 && (
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
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              ))
              )}
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

              <form id="application-form" onSubmit={handleJobApplication} className="glass rounded-3xl p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <Input name="firstName" placeholder="Enter your first name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <Input name="lastName" placeholder="Enter your last name" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <Input name="email" type="email" placeholder="Enter your email address" required />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input name="phone" type="tel" placeholder="Enter your phone number" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Position of Interest *</label>
                  <select name="position" className="w-full p-3 border border-border rounded-lg bg-background" required>
                    <option value="">Select a position</option>
                    {openPositions.map((job) => (
                      <option key={job.id} value={job.title}>{job.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Cover Letter</label>
                  <Textarea 
                    name="coverLetter"
                    placeholder="Tell us why you're interested in this position..." 
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Resume Upload</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">
                      {resumeFile ? resumeFile.name : 'Drag and drop your resume here, or click to browse'}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button variant="outline" type="button" onClick={() => fileInputRef.current?.click()}>
                      Choose File
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="btn-hero w-full py-4 text-lg font-semibold" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
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