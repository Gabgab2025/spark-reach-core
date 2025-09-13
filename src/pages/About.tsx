import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Users, Target, Eye, Award, TrendingUp, Shield } from 'lucide-react';

const About = () => {
  const timeline = [
    { year: '2010', event: 'Company Founded', desc: 'Started with a vision to revolutionize call center services' },
    { year: '2015', event: 'National Expansion', desc: 'Expanded operations across the United States' },
    { year: '2018', event: 'AI Integration', desc: 'Pioneered AI-powered customer service solutions' },
    { year: '2021', event: 'Global Reach', desc: 'Established international presence in 15 countries' },
    { year: '2024', event: 'Industry Leader', desc: 'Serving 500+ financial institutions worldwide' }
  ];

  const values = [
    { icon: Shield, title: 'Integrity', desc: 'Unwavering commitment to ethical practices and transparency' },
    { icon: Award, title: 'Excellence', desc: 'Delivering superior results through continuous improvement' },
    { icon: Users, title: 'Partnership', desc: 'Building lasting relationships with clients and team members' },
    { icon: TrendingUp, title: 'Innovation', desc: 'Embracing cutting-edge technology and forward-thinking solutions' }
  ];

  const leadership = [
    {
      name: 'David Richardson',
      position: 'Chief Executive Officer',
      bio: '20+ years in financial services and call center operations',
      avatar: 'DR'
    },
    {
      name: 'Sarah Martinez',
      position: 'Chief Technology Officer',
      bio: 'Former tech lead at Fortune 500 companies, AI and automation expert',
      avatar: 'SM'
    },
    {
      name: 'Michael Thompson',
      position: 'VP of Operations',
      bio: 'Specialized in large-scale call center management and optimization',
      avatar: 'MT'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="relative py-32 hero-gradient">
          <div className="absolute inset-0 bg-navy/80" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                About
                <span className="block text-gradient">CallCenter Pro</span>
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Since 2010, we've been transforming customer service and collections 
                for financial institutions with innovative technology and exceptional expertise.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <div className="flex items-center space-x-2 mb-6">
                  <Target className="w-6 h-6 text-primary" />
                  <span className="text-primary font-semibold">Our Mission</span>
                </div>
                <h2 className="text-4xl font-bold mb-6">Empowering Financial Success</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To empower financial institutions with world-class call center and collections 
                  services that enhance customer relationships while maximizing recovery rates 
                  through innovative technology and expert human touch.
                </p>
              </div>
              <div className="glass rounded-3xl p-8 hover-lift">
                <div className="flex items-center space-x-2 mb-6">
                  <Eye className="w-6 h-6 text-accent" />
                  <span className="text-accent font-semibold">Our Vision</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Leading the Future</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be the global leader in AI-powered customer service and collections 
                  solutions, setting industry standards for efficiency, compliance, and 
                  customer satisfaction.
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
                <div key={index} className="text-center group">
                  <div className="glass rounded-3xl p-8 hover-lift hover-scale transition-all duration-300">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold group-hover:shadow-glow transition-all duration-300">
                      {leader.avatar}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{leader.name}</h3>
                    <p className="text-primary font-semibold mb-4">{leader.position}</p>
                    <p className="text-muted-foreground">{leader.bio}</p>
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