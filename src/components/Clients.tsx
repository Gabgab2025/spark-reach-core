import React from 'react';
import { Building2, Shield, TrendingUp } from 'lucide-react';

const Clients = () => {
  const clients = [
    {
      name: 'Unistar Credit and Finance Corporation',
      description: 'A non-depository lending and financing company offering Motorcycle, Auto, Mortgage, Personal, and Business Loans.',
      category: 'Lending & Financing'
    },
    {
      name: 'AACT Moneylink Corporation',
      description: 'Administrative and support services provider focused on business support and office administration.',
      category: 'Business Services'
    },
    {
      name: 'Global Dominion Financing Inc.',
      description: 'Consumer lending institution offering Car & Truck Financing, Doctors\' Loans, and Business Loans.',
      category: 'Consumer Lending'
    },
    {
      name: 'Stronghold Insurance Company',
      description: 'Non-life insurance provider with products such as Fire, Motor, Marine, Casualty, and Liability Insurance.',
      category: 'Insurance'
    },
    {
      name: 'Cocogen Insurance Inc.',
      description: 'Provider of Property and Microinsurance solutions, serving individuals and businesses since 1963.',
      category: 'Insurance'
    },
    {
      name: 'Milestone Insurance Company',
      description: 'Non-life insurance firm specializing in Surety Bonds, Casualty, and Nationwide coverage.',
      category: 'Insurance'
    },
    {
      name: 'Fundline Finance Corporation',
      description: 'Lending company serving individuals and SMEs with microfinance, Fundlife, and Fundlite loan programs.',
      category: 'Microfinance'
    },
    {
      name: 'JMCT Motorcycle Center',
      description: 'A Marikina-based retailer and repair shop for motorcycles and scooters, providing maintenance and accessories.',
      category: 'Retail & Services'
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-primary text-sm font-medium">Our Clients</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Trusted by
            <span className="block text-gradient">Industry Leaders</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're proud to partner with leading financial institutions and businesses 
            across various industries, delivering exceptional results.
          </p>
        </div>

        {/* Client Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clients.map((client, index) => (
            <div key={index} className="group">
              <div className="glass rounded-3xl p-8 h-full hover-lift transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 group-hover:shadow-glow transition-all duration-300">
                  {client.category.includes('Insurance') ? (
                    <Shield className="w-8 h-8 text-white" />
                  ) : client.category.includes('Lending') || client.category.includes('Finance') ? (
                    <TrendingUp className="w-8 h-8 text-white" />
                  ) : (
                    <Building2 className="w-8 h-8 text-white" />
                  )}
                </div>
                
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {client.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                  {client.name}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {client.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 glass rounded-3xl p-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">8+</div>
              <p className="text-muted-foreground">Major Clients</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">5+</div>
              <p className="text-muted-foreground">Industries Served</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">100%</div>
              <p className="text-muted-foreground">Client Satisfaction</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">2025</div>
              <p className="text-muted-foreground">Year Established</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
