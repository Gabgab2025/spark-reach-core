import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getAuthToken } from '@/lib/api';

/**
 * /admin shortcut — redirects authenticated admin users to the CMS dashboard.
 * Unauthenticated visitors see 404 (does NOT reveal the login page).
 */
const AdminShortcut = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    const hasToken = !!getAuthToken();

    // Still hydrating auth — wait
    if (!user && hasToken) return;

    if (user && user.role === 'admin') {
      navigate('/auth-proadmin2025/cms', { replace: true });
    } else {
      // Not authenticated or not admin → 404
      navigate('/not-found', { replace: true });
    }
  }, [user, loading, navigate]);

  // Spinner while auth loads
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
};

export default AdminShortcut;
