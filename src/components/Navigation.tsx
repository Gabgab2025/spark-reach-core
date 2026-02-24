import React, { useState, useEffect } from "react";
import { Menu, X, Phone, LogOut, User, Sun, Moon, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import jdgkLogo from "@/assets/jdgk-logo.png";
import { useRoles } from "@/hooks/useRoles";
import { useTheme } from "next-themes";
import { useBlocksByPage } from "@/hooks/useContentBlocks";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useRoles();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getBlock } = useBlocksByPage('header');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const FALLBACK_NAV = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

  const brandingBlock = getBlock('header-branding');
  const navBlock = getBlock('header-navigation');

  const companyName = brandingBlock?.company_name ?? 'JDGK BUSINESS SOLUTIONS INC.';
  const tagline = brandingBlock?.tagline ?? 'RESULTS DRIVEN, CLIENT FOCUSED';
  const phoneNumber = brandingBlock?.phone ?? '02-8252-0584';
  const navItems = (navBlock?.items as { label: string; href: string }[]) ?? FALLBACK_NAV;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass shadow-medium" : "bg-black/20 dark:bg-background/20 backdrop-blur-sm"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={jdgkLogo} alt="JDGK Business Solutions Inc." className="h-10 w-auto" />
            <div className="hidden sm:block">
              <h1
                className={`text-xl font-bold transition-colors ${isScrolled ? "text-foreground" : "text-white dark:text-foreground"
                  }`}
              >
                {companyName}
              </h1>
              <p
                className={`text-xs transition-colors ${isScrolled ? "text-muted-foreground" : "text-white/80 dark:text-muted-foreground"
                  }`}
              >
                {tagline}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`transition-colors duration-200 font-medium ${location.pathname === item.href
                    ? isScrolled
                      ? "text-foreground"
                      : "text-white dark:text-foreground"
                    : isScrolled
                      ? "text-muted-foreground hover:text-foreground"
                      : "text-white/90 hover:text-white dark:text-muted-foreground dark:hover:text-foreground"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href={`tel:${phoneNumber.replace(/[^+\d]/g, '')}`}
              className={`flex items-center space-x-2 text-sm transition-colors ${isScrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-white/80 hover:text-white dark:text-muted-foreground dark:hover:text-foreground"
                }`}
            >
              <Phone className="w-4 h-4" />
              <span>{phoneNumber}</span>
            </a>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2 ${isScrolled
                  ? "text-foreground hover:bg-muted"
                  : "text-white hover:bg-white/10 dark:text-foreground dark:hover:bg-muted"
                }`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {user && (
              <div className="flex items-center space-x-2">
                {(isAdmin() || user.role === 'admin') && (
                  <Button variant="default" size="sm" asChild>
                    <Link to="/auth-proadmin2025/cms">
                      <LayoutDashboard className="w-4 h-4 mr-1" />
                      Dashboard
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg hover:bg-muted transition-colors ${isScrolled ? "text-foreground" : "text-white dark:text-foreground"
              }`}
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
                  className={`transition-colors duration-200 font-medium py-2 ${location.pathname === item.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                <a
                  href={`tel:${phoneNumber.replace(/[^+\d]/g, '')}`}
                  className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
                >
                  <Phone className="w-4 h-4" />
                  <span>{phoneNumber}</span>
                </a>
                {user && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    {(isAdmin() || user.role === 'admin') && (
                      <Button variant="default" className="w-full" asChild onClick={() => setIsMobileMenuOpen(false)}>
                        <Link to="/auth-proadmin2025/cms">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" className="w-full" onClick={signOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
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
