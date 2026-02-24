import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getAuthToken } from '@/lib/api';

// The real CMS URL — never exposed in a redirect, only used for guarding
const CMS_ROUTE = '/auth-proadmin2025/cms';

const AdminRedirect = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  const isCmsRoute = location.pathname.startsWith(CMS_ROUTE);

  useEffect(() => {
    // Still loading auth state — wait
    if (authLoading) return;

    if (isCmsRoute) {
      // Check both context AND localStorage token to avoid race conditions
      const hasToken = !!getAuthToken();

      // No user AND no token → truly unauthenticated → 404
      if (!user && !hasToken) {
        navigate('/not-found', { replace: true });
        return;
      }

      // Has token but no user yet → auth is still hydrating, wait
      if (!user && hasToken) return;

      // Authenticated but not admin → home
      if (user && user.role !== 'admin') {
        navigate('/', { replace: true });
        return;
      }
    }
  }, [authLoading, user, isCmsRoute, navigate]);

  // Show spinner while checking auth on CMS routes
  if (authLoading && isCmsRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If on CMS route and still waiting for auth to hydrate (token exists but user not loaded yet), show spinner
  if (isCmsRoute && !user && !!getAuthToken()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Block render for unauthenticated users on CMS routes (redirect pending)
  if (isCmsRoute && !user) return null;

  // Block render for non-admin users on CMS routes (redirect pending)
  if (isCmsRoute && user && user.role !== 'admin') return null;

  return <>{children}</>;
};

export default AdminRedirect;
