import React, { Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import SettingsRenderer from "@/components/SettingsRenderer";
import StructuredData from "@/components/StructuredData";
import AdminRedirect from "@/components/auth/AdminRedirect";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";

// Eager-loaded pages (above the fold / critical path)
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Lazy-loaded pages
const Blog = React.lazy(() => import("./pages/Blog"));
const Careers = React.lazy(() => import("./pages/Careers"));
const Gallery = React.lazy(() => import("./pages/Gallery"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Admin = React.lazy(() => import("./pages/Admin"));
const SEOEngine = React.lazy(() => import("./pages/admin/SEOEngine"));
const ServiceDetail = React.lazy(() => import("./pages/ServiceDetail"));
const PageDetail = React.lazy(() => import("./pages/PageDetail"));
const BlogDetail = React.lazy(() => import("./pages/BlogDetail"));
const JobDetail = React.lazy(() => import("./pages/JobDetail"));
const TeamMemberProfile = React.lazy(() => import("./pages/TeamMemberProfile"));

// Lightweight redirect: /admin → CMS for authenticated admins
const AdminShortcut = React.lazy(() => import("./components/auth/AdminShortcut"));

const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-4 w-64" />
    <Skeleton className="h-4 w-56" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        {/* Security headers — XSS / clickjacking / MIME-sniff protection */}
        <Helmet>
          <meta http-equiv="X-Content-Type-Options" content="nosniff" />
          <meta http-equiv="X-Frame-Options" content="DENY" />
          <meta http-equiv="X-XSS-Protection" content="1; mode=block" />
          <meta name="referrer" content="strict-origin-when-cross-origin" />
          <meta
            http-equiv="Content-Security-Policy"
            content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com; frame-src 'self' https://www.googletagmanager.com; object-src 'none'; base-uri 'self';"
          />
        </Helmet>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SettingsRenderer />
          <StructuredData />
          <AdminRedirect>
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/auth-proadmin2025" element={<Auth />} />
                  <Route path="/auth-proadmin2025/cms" element={<Admin />} />
                  <Route path="/auth-proadmin2025/cms/seo-engine" element={<SEOEngine />} />
                  <Route path="/admin" element={<AdminShortcut />} />
                  <Route path="/service/:slug" element={<ServiceDetail />} />
                  <Route path="/blog/:slug" element={<BlogDetail />} />
                  <Route path="/job/:id" element={<JobDetail />} />
                  <Route path="/team/:id" element={<TeamMemberProfile />} />
                  <Route path="/:slug" element={<PageDetail />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </AdminRedirect>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
