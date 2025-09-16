import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';

const AdminRedirect = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: rolesLoading } = useRoles();

  useEffect(() => {
    // Wait for both auth and roles to load
    if (authLoading || rolesLoading) return;

    // If user is logged in and is admin, redirect to admin dashboard
    if (user && isAdmin()) {
      // Only redirect if not already on admin routes
      if (!location.pathname.startsWith('/admin')) {
        navigate('/admin', { replace: true });
      }
    }
  }, [user, isAdmin, authLoading, rolesLoading, navigate, location.pathname]);

  // Don't render children while checking admin status
  if (authLoading || rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRedirect;