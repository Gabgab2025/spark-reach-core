import React from 'react';
import { Building2, Shield, TrendingUp } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const Clients = () => {
  const clients = [
    {
      name: 'Unistar Credit and Finance Corporation',
      description: 'JDGK assists Unistar in sourcing clients who are willing to mortgage the Official Receipt (OR) and Certificate of Registration (CR) of their vehicles as collateral for financing. A non-depository lending and financing company offering Motorcycle, Auto, Mortgage, Personal, and Business Loans.',
      category: 'Tele Sales & Marketing'
    },
    {
      name: 'AMG Collection Services Inc',
      description: 'JDGK delivers professional collection and recovery solutions, driving efficient loan repayment while reinforcing the institution\'s credit accessibility and financial resilience. AMGCSI is an IT-enabled debt management firm specializing in recovery of unsecured loans through debt collection operations.',
      category: 'Credit & Collection'
    },
    {
      name: 'Flexi Finance',
      description: 'JDGK provides professional collection and recovery services to Flexi Finance, ensuring efficient loan repayment and improved credit management. Flexi Finance offers flexible and affordable loan products for individuals, employees, and small business owners, providing installment plans for consumer goods, gadgets, motorcycles, and personal needs.',
      category: 'Credit & Collection'
    },
    {
      name: 'Aiqon Unicorp',
      description: 'JDGK extends its collection and recovery expertise to AIQON Unicorp, ensuring efficient account management and consistent loan repayment performance. AIQON Unicorp provides innovative credit and loan solutions with accessible and technology-driven financial products designed to meet the evolving needs of modern consumers.',
      category: 'Credit & Collection'
    },
    {
      name: 'Supremebike',
      description: 'JDGK provides credit investigation, repossession and collection recovery services to support financing and after-sales operation. Supremebikes operates as a motorcycle dealership and service provider, retailing new and used motorcycles, supplying accessories and parts, and offering repair, servicing, and maintenance.',
      category: 'Repossession'
    },
    {
      name: 'Top Ride Motorcycle Hub',
      description: 'JDGK provides credit investigation, repossession and collection recovery services to support financing and after-sales operation. Top Ride Motorcycle Hub operates as a motorcycle dealership delivering expert, customer-focused advice.',
      category: 'Repossession'
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

        {/* Client Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {clients.map((client, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="group p-1">
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        {/* Stats */}
        <div className="mt-16 glass rounded-3xl p-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">13+</div>
              <p className="text-muted-foreground">Major Clients</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">8+</div>
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
