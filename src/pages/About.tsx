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
    { year: '2025', event: 'Client Partnerships', desc: 'Established partnerships with major financial institutions' }
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
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-primary text-sm font-medium">About Us</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                About
                <span className="block text-gradient">JDGK Business Solutions Inc.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A dynamic business solutions provider committed to delivering comprehensive and effective strategies tailored to client needs.
              </p>
            </div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-6 text-center">Company Overview</h2>
              <div className="glass rounded-3xl p-8 mb-8">
                {settings?.company_overview_paragraph1 && (
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    {settings.company_overview_paragraph1}
                  </p>
                )}
                {settings?.company_overview_paragraph2 && (
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    {settings.company_overview_paragraph2}
                  </p>
                )}
                {!settings?.company_overview_paragraph1 && !settings?.company_overview_paragraph2 && (
                  <>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                      JDGK BUSINESS SOLUTIONS INC. is a corporation duly organized and existing under the laws of the Republic of the Philippines, registered with the Securities and Exchange Commission on March 3, 2025. Its principal office is located at Phase 1-B4 L1 Ridge Point Subdivision, Prinza 1880, Teresa, Rizal, Philippines.
                    </p>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                      As a dynamic business solutions provider, the corporation is committed to equipping its clients with comprehensive and effective strategies tailored to their needs which includes but not limited to credit collection recovery, repossession, skip tracing, credit investigation and virtual assistance, among others.
                    </p>
                  </>
                )}
              </div>

              <div className="glass rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-6">Established by Five Filipino Professionals</h3>
                {settings?.company_founders_intro && (
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    {settings.company_founders_intro}
                  </p>
                )}
                {!settings?.company_founders_intro && (
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    The company was established by five (5) Filipino professionals, each possessing extensive expertise and a proven track record in their respective fields:
                  </p>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                  {(settings?.company_founders && settings.company_founders.length > 0 
                    ? settings.company_founders 
                    : ['Donna Bucad Dealca', 'Kristofferson Doctor Dealca', 'Joan Bucad-Landeza', 'Jaime Jr. Doblado Bucad', 'Geraldine Bucad Barro']
                  ).map((founder, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-muted-foreground">{founder}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CEO Message */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-6">CEO Message</h2>
              </div>
              <div className="glass rounded-3xl p-8 lg:p-12">
                <div className="flex flex-col items-center mb-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold mb-4">
                    DD
                  </div>
                  <h3 className="text-2xl font-bold">Donna Bucad Dealca</h3>
                  <p className="text-primary font-semibold">CEO/President</p>
                </div>
                <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                  <p>
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

        {/* Mission & Vision */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6">Mission and Vision</h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <div className="glass rounded-3xl p-8 hover-lift">
                <div className="flex items-center space-x-2 mb-6">
                  <Target className="w-6 h-6 text-primary" />
                  <span className="text-primary font-semibold">Our Mission</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Sustainable Excellence</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To provide sustainable and exceptional business solutions that enable our clients to achieve their strategic goals, optimize operational efficiency, and maximize profitability.
                </p>
              </div>
              <div className="glass rounded-3xl p-8 hover-lift">
                <div className="flex items-center space-x-2 mb-6">
                  <Eye className="w-6 h-6 text-accent" />
                  <span className="text-accent font-semibold">Our Vision</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Leading Provider</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To become a leading provider of comprehensive business solutions, recognized for excellence, innovation, and client success.
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Our Core Values</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                These principles guide everything we do and shape our commitment to excellence.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {values.map((value, index) => (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                    <value.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Our Journey</h2>
              <p className="text-muted-foreground text-lg">
                A decade of innovation and growth in the call center industry
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-center mb-12 last:mb-0">
                  <div className="flex-shrink-0 w-24 text-right mr-8">
                    <span className="text-2xl font-bold text-primary">{item.year}</span>
                  </div>
                  <div className="flex-shrink-0 w-4 h-4 bg-gradient-to-br from-primary to-accent rounded-full mr-8 relative">
                    {index < timeline.length - 1 && (
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-border" />
                    )}
                  </div>
                  <div className="flex-1 glass rounded-xl p-6 hover-lift">
                    <h3 className="text-xl font-bold mb-2">{item.event}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Leadership Team</h2>
              <p className="text-muted-foreground text-lg">
                Experienced leaders driving innovation and excellence
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leadership.map((leader, index) => (
                <div 
                  key={index} 
                  className="text-center group cursor-pointer"
                  onClick={() => navigate(`/team/${leader.slug}`)}
                >
                  <div className="glass rounded-3xl p-6 hover-lift hover-scale transition-all duration-300">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-lg font-bold group-hover:shadow-glow transition-all duration-300">
                      {leader.avatar}
                    </div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{leader.name}</h3>
                    <p className="text-primary font-semibold text-sm mb-3">{leader.position}</p>
                    <p className="text-muted-foreground text-sm">{leader.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;