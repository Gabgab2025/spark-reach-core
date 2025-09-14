import React from 'react';
import { ArrowRight, Play, Phone, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-bg.jpg';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/60 to-navy/80" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-teal/20 animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-blue-corporate/20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-20 w-16 h-16 rounded-full bg-accent/20 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-teal rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">Trusted by 500+ Financial Institutions</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Next-Gen
              <span className="block text-gradient">Call Center</span>
              <span className="block">& Collections</span>
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Revolutionizing customer service and debt recovery with AI-powered solutions, 
              cutting-edge technology, and industry-leading expertise.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button className="btn-hero px-8 py-4 text-lg font-semibold group">
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="btn-glass px-8 py-4 text-lg font-semibold text-white border-white/30 hover:bg-white/10">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <Users className="w-6 h-6 text-teal mr-2" />
                  <span className="text-2xl font-bold text-white">500+</span>
                </div>
                <p className="text-white/70 text-sm">Active Clients</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <Phone className="w-6 h-6 text-teal mr-2" />
                  <span className="text-2xl font-bold text-white">10M+</span>
                </div>
                <p className="text-white/70 text-sm">Calls Handled</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <TrendingUp className="w-6 h-6 text-teal mr-2" />
                  <span className="text-2xl font-bold text-white">95%</span>
                </div>
                <p className="text-white/70 text-sm">Success Rate</p>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="hidden lg:block relative">
            <div className="relative w-full h-96 glass rounded-3xl p-8 hover-lift">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-corporate/20 to-teal/20 rounded-3xl" />
              <div className="relative z-10 h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-white mb-4">Real-Time Analytics</h3>
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80 text-sm">Active Calls</span>
                      <span className="text-teal font-bold">1,247</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-teal h-2 rounded-full w-3/4" />
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80 text-sm">Collection Rate</span>
                      <span className="text-blue-corporate font-bold">94.2%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-blue-corporate h-2 rounded-full w-11/12" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;