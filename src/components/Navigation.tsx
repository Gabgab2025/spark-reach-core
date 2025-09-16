import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useRoles();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass shadow-medium' : 'bg-black/20 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-corporate to-teal flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-xl font-bold ${isScrolled ? 'text-black' : 'text-white'}`}>CallCenter Pro</h1>
              <p className={`text-xs ${isScrolled ? 'text-black/80' : 'text-white/80'}`}>Excellence in Service</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`transition-colors duration-200 font-medium ${
                  location.pathname === item.href 
                    ? (isScrolled ? 'text-black' : 'text-white')
                    : (isScrolled ? 'text-black/90 hover:text-black' : 'text-white/90 hover:text-white')
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="tel:+1-800-CALL-PRO" className={`flex items-center space-x-2 text-sm transition-colors ${isScrolled ? 'text-black/80 hover:text-black' : 'text-white/80 hover:text-white'}`}>
              <Phone className="w-4 h-4" />
              <span>1-800-CALL-PRO</span>
            </a>
            {user ? (
              <div className="flex items-center space-x-2">
                {isAdmin() && (
                  <Button asChild variant="outline" size="sm">
                    <Link to="/admin">Admin</Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{user.email}</span>
                </Button>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button asChild className="btn-hero px-6 py-2">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 glass rounded-2xl mt-2 mx-4">
            <div className="flex flex-col space-y-4 px-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`transition-colors duration-200 font-medium py-2 ${
                    location.pathname === item.href 
                      ? 'text-white' 
                      : 'text-white/90 hover:text-white'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                <a href="tel:+1-800-CALL-PRO" className="flex items-center space-x-2 text-sm text-white/80 mb-3">
                  <Phone className="w-4 h-4" />
                  <span>1-800-CALL-PRO</span>
                </a>
                {user ? (
                  <div className="space-y-2">
                    {isAdmin() && (
                      <Button asChild variant="outline" className="w-full mb-2">
                        <Link to="/admin">Admin Dashboard</Link>
                      </Button>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-white/80">
                      <User className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <Button variant="outline" className="w-full" onClick={signOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button asChild className="btn-hero w-full">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;