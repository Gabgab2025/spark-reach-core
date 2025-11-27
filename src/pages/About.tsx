import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Users, Target, Eye, Award, TrendingUp, Shield } from 'lucide-react';
import { useCMS } from '@/hooks/useCMS';
import { useQuery } from '@tanstack/react-query';

const About = () => {
  const navigate = useNavigate();
  const cms = useCMS();
  
  const { data: settings } = useQuery({
    queryKey: ['cms', 'settings'],
    queryFn: () => cms.getSettings(),
    staleTime: 5 * 60 * 1000,
  });
  
  const timeline = [
    { year: '2025', event: 'Company Registration', desc: 'JDGK Business Solutions Inc. registered with SEC on March 3, 2025' },
    { year: '2025', event: 'Operations Launch', desc: 'Commenced comprehensive business solutions services' },
    { year: '2025', event: 'Client Partnerships', desc: 'Established partnerships with major financial institutions' },
    { year: '2025', event: 'Email Blasting, Text Blasting', desc: 'Launched comprehensive communication solutions for mass outreach' },
    { year: '2026', event: 'CRM Launch and Smart AI Automations', desc: 'Introducing advanced customer relationship management with AI-powered automation integrations' }
  ];

  const values = [
    { icon: Shield, title: 'Integrity', desc: 'Unwavering commitment to ethical practices and transparency' },
    { icon: Award, title: 'Excellence', desc: 'Delivering superior results through continuous improvement' },
    { icon: Users, title: 'Partnership', desc: 'Building lasting relationships with clients and team members' },
    { icon: TrendingUp, title: 'Innovation', desc: 'Embracing cutting-edge technology and forward-thinking solutions' }
  ];

  const leadership = [
    {
      name: 'Donna Bucad Dealca',
      position: 'Chief Executive Officer / President',
      bio: 'Visionary leader driving strategic direction and business growth with integrity and innovation',
      avatar: 'DD',
      slug: 'donna-bucad-dealca'
    },
    {
      name: 'Kristofferson Doctor Dealca',
      position: 'Vice President',
      bio: 'Dynamic leader focused on operational excellence and business expansion',
      avatar: 'KD',
      slug: 'kristofferson-doctor-dealca'
    },
    {
      name: 'Jaime Doblado Bucad Jr.',
      position: 'Board of Directors',
      bio: 'Expertise in business management and sustainable growth opportunities',
      avatar: 'JB',
      slug: 'jaime-doblado-bucad-jr'
    },
    {
      name: 'Joan Bucad Landeza',
      position: 'Board of Directors',
      bio: 'Supports corporate initiatives and business planning',
      avatar: 'JL',
      slug: 'joan-bucad-landeza'
    },
    {
      name: 'Erwin Landeza',
      position: 'Board of Directors',
      bio: 'Strengthens governance framework and promotes business sustainability',
      avatar: 'EL',
      slug: 'erwin-landeza'
    },
    {
      name: 'Randy Magauay Rodriguez',
      position: 'Board of Directors',
      bio: 'Provides insights in corporate governance and strategic decision-making',
      avatar: 'RR',
      slug: 'randy-magauay-rodriguez'
    },
    {
      name: 'Von Jaime Horlador Barro',
      position: 'Board of Directors',
      bio: 'Shapes company policies and strategies aligned with JDGK mission',
      avatar: 'VB',
      slug: 'von-jaime-horlador-barro'
    },
    {
      name: 'Geraldine Bucad Barro',
      position: 'Corporate Secretary',
      bio: 'Oversees corporate compliance, documentation, and governance',
      avatar: 'GB',
      slug: 'geraldine-bucad-barro'
    },
    {
      name: 'Zandy Lyn Jesalva Laid',
      position: 'Admin Head',
      bio: 'Manages administrative operations and daily business functions',
      avatar: 'ZL',
      slug: 'zandy-lyn-jesalva-laid'
    },
    {
      name: 'Joshell Tuliao Rodriguez',
      position: 'Auditor',
      bio: 'Ensures financial transparency, compliance, and accountability',
      avatar: 'JR',
      slug: 'joshell-tuliao-rodriguez'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* Hero Section - Modern & Clean */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-2.5 mb-8">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-primary text-sm font-semibold tracking-wide">About Us</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                About
                <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  JDGK Business Solutions Inc.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                A dynamic business solutions provider committed to delivering comprehensive and effective strategies tailored to client needs.
              </p>
            </div>
          </div>
        </section>

        {/* Company Overview - Clean Cards */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Company Overview</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
              </div>
              
              <div className="bg-card border border-border rounded-2xl p-8 md:p-12 mb-8 shadow-soft hover:shadow-medium transition-all duration-300">
                {settings?.company_overview_paragraph1 && (
                  <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                    {settings.company_overview_paragraph1}
                  </p>
                )}
                {settings?.company_overview_paragraph2 && (
                  <p className="text-foreground/80 text-lg leading-relaxed">
                    {settings.company_overview_paragraph2}
                  </p>
                )}
                {!settings?.company_overview_paragraph1 && !settings?.company_overview_paragraph2 && (
                  <>
                    <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                      JDGK BUSINESS SOLUTIONS INC. is a corporation duly organized and existing under the laws of the Republic of the Philippines, registered with the Securities and Exchange Commission on March 3, 2025. Its principal office is located at Phase 1-B4 L1 Ridge Point Subdivision, Prinza 1880, Teresa, Rizal, Philippines.
                    </p>
                    <p className="text-foreground/80 text-lg leading-relaxed">
                      As a dynamic business solutions provider, the corporation is committed to equipping its clients with comprehensive and effective strategies tailored to their needs which includes but not limited to credit collection recovery, repossession, skip tracing, credit investigation and virtual assistance, among others.
                    </p>
                  </>
                )}
              </div>

              <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-soft hover:shadow-medium transition-all duration-300">
                <h3 className="text-2xl md:text-3xl font-bold mb-6">Established by Five Filipino Professionals</h3>
                {settings?.company_founders_intro && (
                  <p className="text-foreground/80 text-lg leading-relaxed mb-8">
                    {settings.company_founders_intro}
                  </p>
                )}
                {!settings?.company_founders_intro && (
                  <p className="text-foreground/80 text-lg leading-relaxed mb-8">
                    The company was established by five (5) Filipino professionals, each possessing extensive expertise and a proven track record in their respective fields:
                  </p>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                  {(settings?.company_founders && settings.company_founders.length > 0 
                    ? settings.company_founders 
                    : ['Donna Bucad Dealca', 'Kristofferson Doctor Dealca', 'Joan Bucad-Landeza', 'Jaime Jr. Doblado Bucad', 'Geraldine Bucad Barro']
                  ).map((founder, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      <span className="text-foreground/80 font-medium">{founder}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CEO Message - Featured */}
        <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">CEO Message</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
              </div>
              <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-medium">
                <div className="flex flex-col items-center mb-10">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary via-accent to-primary p-1 mb-6 shadow-glow">
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                      <span className="text-3xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">DD</span>
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-1">Donna Bucad Dealca</h3>
                  <p className="text-primary font-semibold text-lg">CEO/President</p>
                </div>
                <div className="space-y-6 text-foreground/80 text-lg leading-relaxed">
                  <p className="italic border-l-4 border-primary pl-6">
                    "As the Chief Executive Officer, I am honored to lead a team of dedicated professionals committed to delivering innovative business solutions that empower our clients to achieve their goals."
                  </p>
                  <p>
                    "Our mission is to provide exceptional business solutions—particularly in asset and credit recovery and virtual assistance—enabling our clients to achieve their strategic goals, optimize operational efficiency, and maximize profitability."
                  </p>
                  <p>
                    "We tailor solutions to the unique challenges of each client, leveraging technology and best practices. Our passion for continuous improvement and deep sense of responsibility drive us to serve our clients, employees, and communities with excellence."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision - Side by Side */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Mission and Vision</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
            </div>
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-24">
              <div className="group bg-card border-2 border-primary/20 rounded-2xl p-8 md:p-10 hover:border-primary/40 hover:shadow-glow transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-primary font-bold text-lg">Our Mission</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Sustainable Excellence</h3>
                <p className="text-foreground/80 text-lg leading-relaxed">
                  To provide sustainable and exceptional business solutions that enable our clients to achieve their strategic goals, optimize operational efficiency, and maximize profitability.
                </p>
              </div>
              <div className="group bg-card border-2 border-accent/20 rounded-2xl p-8 md:p-10 hover:border-accent/40 hover:shadow-glow transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Eye className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-accent font-bold text-lg">Our Vision</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Leading Provider</h3>
                <p className="text-foreground/80 text-lg leading-relaxed">
                  To become a leading provider of comprehensive business solutions, recognized for excellence, innovation, and client success.
                </p>
              </div>
            </div>

            {/* Core Values - Modern Grid */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Core Values</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                These principles guide everything we do and shape our commitment to excellence.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <div key={index} className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-medium transition-all duration-300 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform shadow-soft">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline - Modern Design */}
        <section className="py-24 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Journey</h2>
              <p className="text-muted-foreground text-lg">
                Building excellence since our foundation
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-4" />
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-6 md:gap-8 group">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-32 text-right">
                      <span className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                        {item.year}
                      </span>
                    </div>
                  </div>
                  <div className="relative flex-shrink-0 pt-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-primary to-accent rounded-full shadow-glow group-hover:scale-125 transition-transform" />
                    {index < timeline.length - 1 && (
                      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary/50 to-accent/20" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-medium transition-all duration-300">
                      <h3 className="text-xl md:text-2xl font-bold mb-2">{item.event}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Team - Modern Cards */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Leadership Team</h2>
              <p className="text-muted-foreground text-lg">
                Experienced leaders driving innovation and excellence
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-4" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {leadership.map((leader, index) => (
                <div 
                  key={index} 
                  className="group cursor-pointer"
                  onClick={() => navigate(`/team/${leader.slug}`)}
                >
                  <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-glow transition-all duration-300 h-full">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-primary to-accent p-1 group-hover:scale-110 transition-transform shadow-soft">
                        <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                          <span className="text-lg font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                            {leader.avatar}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-base font-bold mb-1 group-hover:text-primary transition-colors leading-tight">
                        {leader.name}
                      </h3>
                      <p className="text-primary font-semibold text-xs mb-3">{leader.position}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{leader.bio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Business License Section */}
        <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Business License</h2>
              <p className="text-muted-foreground text-lg">
                Certified and accredited business credentials
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-4" />
            </div>

            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-medium transition-all duration-300">
                  <div className="aspect-[4/3] overflow-hidden rounded-lg">
                    <img 
                      src="/licenses/business-permits-wall.jpg" 
                      alt="Business Permits and Licenses Display" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-center text-muted-foreground text-sm mt-4">Business Permits & Registrations</p>
                </div>

                <div className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-medium transition-all duration-300">
                  <div className="aspect-[4/3] overflow-hidden rounded-lg">
                    <img 
                      src="/licenses/award-rookie.jpg" 
                      alt="Top Shining Rookie Award" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-center text-muted-foreground text-sm mt-4">Top Shining Rookie Award 2024</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-medium transition-all duration-300">
                  <div className="aspect-[4/3] overflow-hidden rounded-lg">
                    <img 
                      src="/licenses/certificate-appreciation.jpg" 
                      alt="Certificate of Appreciation from Tomas Claudio Colleges" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-center text-muted-foreground text-sm mt-4">Certificate of Appreciation</p>
                </div>

                <div className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-medium transition-all duration-300">
                  <div className="aspect-[4/3] overflow-hidden rounded-lg">
                    <img 
                      src="/licenses/circle-gold-franchisee.jpg" 
                      alt="Circle of Gold Franchisee Certificate" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-center text-muted-foreground text-sm mt-4">Circle of Gold Franchisee</p>
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

export default About;