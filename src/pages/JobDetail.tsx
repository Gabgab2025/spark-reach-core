import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, DollarSign, Calendar } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface JobListing {
  id: string;
  title: string;
  department?: string;
  location?: string;
  employment_type?: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  salary_range?: string;
  status: string;
  created_at: string;
  expires_at?: string;
}

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .eq('id', id)
        .eq('status', 'open')
        .maybeSingle();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      console.error('Error fetching job listing:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <Navigation />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl font-bold mb-4">Job Not Found</h1>
            <p className="text-muted-foreground mb-8">The job listing you're looking for doesn't exist or is no longer available.</p>
            <Button onClick={() => navigate('/careers')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Careers
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navigation />
      
      <main className="pt-20">
        <section className="py-8">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/careers')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Careers
            </Button>
          </div>
        </section>

        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {job.department && (
                    <Badge variant="secondary">{job.department}</Badge>
                  )}
                  {job.employment_type && (
                    <Badge variant="outline">{job.employment_type}</Badge>
                  )}
                  <Badge className="bg-green-100 text-green-800">Open Position</Badge>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                  {job.title}
                </h1>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {job.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job.salary_range && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-muted-foreground" />
                      <span>{job.salary_range}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <span>Posted {format(new Date(job.created_at), 'MMM dd, yyyy')}</span>
                  </div>
                </div>

                <Button className="btn-hero" onClick={() => navigate('/contact')}>
                  Apply Now
                </Button>
              </div>

              {job.description && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Job Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    />
                  </CardContent>
                </Card>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                {job.requirements && job.requirements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {job.benefits && job.benefits.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {job.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="mt-12 text-center bg-muted/50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-4">Ready to Apply?</h3>
                <p className="text-muted-foreground mb-6">
                  Join our team and help us deliver exceptional call center services.
                </p>
                <Button className="btn-hero" onClick={() => navigate('/contact')}>
                  Submit Application
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default JobDetail;