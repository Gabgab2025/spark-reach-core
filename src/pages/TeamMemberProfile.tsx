import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Linkedin, Award, Target, TrendingUp } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const TeamMemberProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const teamMembers = {
    'donna-bucad-dealca': {
      name: 'Donna Bucad Dealca',
      position: 'Chief Executive Officer / President',
      avatar: 'DD',
      bio: 'Visionary leader driving strategic direction and business growth with integrity and innovation',
      fullBio: 'As the Chief Executive Officer and President of JDGK Business Solutions Inc., Donna Bucad Dealca brings a wealth of experience in strategic leadership and business development. Her visionary approach has been instrumental in establishing JDGK as a trusted partner in the business solutions industry. With a deep commitment to ethical practices and innovation, she leads the company toward sustainable growth and excellence.',
      expertise: [
        'Strategic Leadership & Business Development',
        'Corporate Governance & Compliance',
        'Financial Management & Planning',
        'Client Relations & Partnership Development'
      ],
      achievements: [
        'Founded JDGK Business Solutions Inc. in 2025',
        'Established partnerships with major financial institutions',
        'Led company registration and SEC compliance',
        'Developed comprehensive service portfolio'
      ],
      quote: 'Our mission is to provide exceptional business solutions that empower our clients to achieve their goals.'
    },
    'kristofferson-doctor-dealca': {
      name: 'Kristofferson Doctor Dealca',
      position: 'Vice President',
      avatar: 'KD',
      bio: 'Dynamic leader focused on operational excellence and business expansion',
      fullBio: 'Kristofferson Doctor Dealca serves as Vice President, bringing dynamic leadership and operational expertise to JDGK Business Solutions Inc. His focus on operational excellence and strategic business expansion ensures that the company delivers consistent, high-quality services to clients while scaling operations effectively.',
      expertise: [
        'Operations Management & Optimization',
        'Business Expansion Strategy',
        'Team Leadership & Development',
        'Process Improvement & Efficiency'
      ],
      achievements: [
        'Co-founded JDGK Business Solutions Inc.',
        'Implemented operational excellence frameworks',
        'Led business expansion initiatives',
        'Developed scalable service delivery models'
      ],
      quote: 'Excellence in operations is the foundation of sustainable business growth.'
    },
    'jaime-doblado-bucad-jr': {
      name: 'Jaime Doblado Bucad Jr.',
      position: 'Board of Directors',
      avatar: 'JB',
      bio: 'Expertise in business management and sustainable growth opportunities',
      fullBio: 'Jaime Doblado Bucad Jr. brings extensive experience in business management and strategic planning to the JDGK Board of Directors. His expertise in identifying and developing sustainable growth opportunities has been crucial in shaping the company\'s strategic direction and long-term vision.',
      expertise: [
        'Business Management & Strategy',
        'Sustainable Growth Development',
        'Corporate Planning & Analysis',
        'Risk Management & Mitigation'
      ],
      achievements: [
        'Co-founder of JDGK Business Solutions Inc.',
        'Contributed to strategic business planning',
        'Supported sustainable growth initiatives',
        'Enhanced corporate governance practices'
      ],
      quote: 'Sustainable growth is achieved through strategic planning and ethical business practices.'
    },
    'joan-bucad-landeza': {
      name: 'Joan Bucad Landeza',
      position: 'Board of Directors',
      avatar: 'JL',
      bio: 'Supports corporate initiatives and business planning',
      fullBio: 'Joan Bucad Landeza serves on the JDGK Board of Directors, providing valuable insights and support for corporate initiatives and business planning. Her strategic perspective and commitment to the company\'s mission help guide JDGK toward achieving its business objectives.',
      expertise: [
        'Corporate Strategy & Planning',
        'Business Development',
        'Stakeholder Relations',
        'Policy Development'
      ],
      achievements: [
        'Co-founder of JDGK Business Solutions Inc.',
        'Supported corporate initiative development',
        'Contributed to business planning processes',
        'Enhanced stakeholder engagement'
      ],
      quote: 'Strategic planning and corporate alignment drive successful business outcomes.'
    },
    'erwin-landeza': {
      name: 'Erwin Landeza',
      position: 'Board of Directors',
      avatar: 'EL',
      bio: 'Strengthens governance framework and promotes business sustainability',
      fullBio: 'Erwin Landeza is a Board Director at JDGK Business Solutions Inc., specializing in corporate governance and business sustainability. His expertise in strengthening governance frameworks ensures that the company operates with integrity, transparency, and long-term sustainability in mind.',
      expertise: [
        'Corporate Governance & Compliance',
        'Business Sustainability',
        'Risk Management',
        'Strategic Oversight'
      ],
      achievements: [
        'Enhanced corporate governance frameworks',
        'Promoted sustainable business practices',
        'Supported compliance initiatives',
        'Contributed to strategic decision-making'
      ],
      quote: 'Strong governance and sustainability are the pillars of long-term business success.'
    },
    'randy-magauay-rodriguez': {
      name: 'Randy Magauay Rodriguez',
      position: 'Board of Directors',
      avatar: 'RR',
      bio: 'Provides insights in corporate governance and strategic decision-making',
      fullBio: 'Randy Magauay Rodriguez brings valuable expertise in corporate governance and strategic decision-making to the JDGK Board of Directors. His insights help guide the company through complex business challenges and ensure sound governance practices.',
      expertise: [
        'Corporate Governance',
        'Strategic Decision-Making',
        'Business Analysis',
        'Policy Development'
      ],
      achievements: [
        'Contributed to governance framework development',
        'Supported strategic planning initiatives',
        'Enhanced decision-making processes',
        'Promoted best practices in corporate governance'
      ],
      quote: 'Effective governance and strategic insights drive business excellence.'
    },
    'von-jaime-horlador-barro': {
      name: 'Von Jaime Horlador Barro',
      position: 'Board of Directors',
      avatar: 'VB',
      bio: 'Shapes company policies and strategies aligned with JDGK mission',
      fullBio: 'Von Jaime Horlador Barro serves as a Board Director, focusing on shaping company policies and strategies that align with JDGK\'s mission and values. His strategic vision and policy expertise ensure that the company remains on track to achieve its long-term goals.',
      expertise: [
        'Policy Development & Strategy',
        'Mission Alignment',
        'Strategic Planning',
        'Corporate Vision'
      ],
      achievements: [
        'Developed key company policies',
        'Aligned strategies with company mission',
        'Contributed to long-term planning',
        'Enhanced corporate strategic framework'
      ],
      quote: 'Policies and strategies must always reflect our core mission and values.'
    },
    'geraldine-bucad-barro': {
      name: 'Geraldine Bucad Barro',
      position: 'Corporate Secretary',
      avatar: 'GB',
      bio: 'Oversees corporate compliance, documentation, and governance',
      fullBio: 'Geraldine Bucad Barro serves as Corporate Secretary at JDGK Business Solutions Inc., overseeing all aspects of corporate compliance, documentation, and governance. Her meticulous attention to detail and deep understanding of corporate law ensure that JDGK maintains the highest standards of compliance and corporate governance.',
      expertise: [
        'Corporate Compliance & Governance',
        'Legal Documentation & Records Management',
        'Board Administration',
        'Regulatory Compliance'
      ],
      achievements: [
        'Co-founder of JDGK Business Solutions Inc.',
        'Managed SEC registration and compliance',
        'Established corporate documentation systems',
        'Ensured regulatory compliance across operations'
      ],
      quote: 'Compliance and proper governance are the foundations of corporate integrity.'
    },
    'zandy-lyn-jesalva-laid': {
      name: 'Zandy Lyn Jesalva Laid',
      position: 'Admin Head',
      avatar: 'ZL',
      bio: 'Manages administrative operations and daily business functions',
      fullBio: 'Zandy Lyn Jesalva Laid serves as Admin Head at JDGK Business Solutions Inc., managing all administrative operations and daily business functions. Her organizational skills and attention to detail ensure that the company\'s administrative processes run smoothly and efficiently.',
      expertise: [
        'Administrative Operations Management',
        'Office Management & Coordination',
        'Process Optimization',
        'Team Coordination & Support'
      ],
      achievements: [
        'Streamlined administrative operations',
        'Implemented efficient business processes',
        'Coordinated cross-functional teams',
        'Enhanced operational efficiency'
      ],
      quote: 'Efficient administration is the backbone of successful business operations.'
    },
    'joshell-tuliao-rodriguez': {
      name: 'Joshell Tuliao Rodriguez',
      position: 'Auditor',
      avatar: 'JR',
      bio: 'Ensures financial transparency, compliance, and accountability',
      fullBio: 'Joshell Tuliao Rodriguez serves as Auditor at JDGK Business Solutions Inc., ensuring financial transparency, compliance, and accountability across all operations. His expertise in financial auditing and internal controls helps maintain the company\'s financial integrity and regulatory compliance.',
      expertise: [
        'Financial Auditing & Analysis',
        'Compliance & Internal Controls',
        'Risk Assessment',
        'Financial Reporting'
      ],
      achievements: [
        'Established internal audit frameworks',
        'Ensured financial transparency',
        'Implemented compliance monitoring systems',
        'Enhanced financial accountability'
      ],
      quote: 'Transparency and accountability are essential for financial integrity.'
    }
  };

  const member = id ? teamMembers[id as keyof typeof teamMembers] : null;

  if (!member) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">Team Member Not Found</h1>
            <Button onClick={() => navigate('/about')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to About
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
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/about')}
              className="mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Team
            </Button>

            <div className="max-w-5xl mx-auto">
              <div className="glass rounded-3xl p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold shadow-glow">
                      {member.avatar}
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                      {member.name}
                    </h1>
                    <p className="text-xl text-primary font-semibold mb-4">
                      {member.position}
                    </p>
                    <p className="text-lg text-muted-foreground mb-6">
                      {member.bio}
                    </p>
                    
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        {member.quote && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="glass rounded-3xl p-8 lg:p-12 text-center border-l-4 border-primary">
                  <blockquote className="text-2xl font-semibold text-foreground italic">
                    "{member.quote}"
                  </blockquote>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* About Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="glass rounded-3xl p-8 lg:p-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center">
                  <Award className="w-8 h-8 mr-3 text-primary" />
                  About
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {member.fullBio}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="glass rounded-3xl p-8 lg:p-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center">
                  <Target className="w-8 h-8 mr-3 text-primary" />
                  Areas of Expertise
                </h2>
                <ul className="space-y-4">
                  {member.expertise.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-4 flex-shrink-0" />
                      <span className="text-lg text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-12 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="glass rounded-3xl p-8 lg:p-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center">
                  <TrendingUp className="w-8 h-8 mr-3 text-primary" />
                  Key Achievements
                </h2>
                <ul className="space-y-4">
                  {member.achievements.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 mr-4 flex-shrink-0" />
                      <span className="text-lg text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-accent">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Want to Learn More About Our Team?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get in touch to discover how our leadership team can help drive your business success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => navigate('/contact')}
              >
                Contact Us
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary"
                onClick={() => navigate('/about')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Team
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default TeamMemberProfile;
