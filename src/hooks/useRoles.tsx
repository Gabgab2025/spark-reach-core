import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'admin' | 'user';

interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

interface UserWithRole {
  id: string;
  email: string;
  full_name?: string;
  role?: UserRole;
}

export const useRoles = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Get current user's role
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await api.get('/user_roles/me');

        if (error) {
          console.error('Error fetching user role:', error);
          setUserRole('user'); // Default to user role
        } else {
          setUserRole(data.role as UserRole);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  // Check if user has specific role
  const hasRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  // Check if user is admin
  const isAdmin = (): boolean => {
    return userRole === 'admin';
  };

  // Get all users with their roles (admin only)
  const getAllUsersWithRoles = async (): Promise<UserWithRole[]> => {
    if (!isAdmin()) {
      throw new Error('Only admins can view all users');
    }

    try {
      const { data, error } = await api.get('/admin/users');

      if (error) throw error;

      return data as UserWithRole[];
    } catch (error) {
      console.error('Error fetching users with roles:', error);
      throw error;
    }
  };

  // Update user role (admin only)
  const updateUserRole = async (userId: string, newRole: UserRole): Promise<void> => {
    if (!isAdmin()) {
      throw new Error('Only admins can update user roles');
    }

    try {
      const { error } = await api.put(`/admin/users/${userId}/role`, {
        role: newRole
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    userRole,
    loading,
    hasRole,
    isAdmin,
    getAllUsersWithRoles,
    updateUserRole
  };
};