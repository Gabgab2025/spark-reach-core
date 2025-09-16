import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

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
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name');

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Get auth users (admin only can see this)
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) throw authError;

      // Combine the data
      const usersWithRoles: UserWithRole[] = authUsers.users.map(authUser => {
        const profile = profiles.find(p => p.user_id === authUser.id);
        const roleData = roles.find(r => r.user_id === authUser.id);

        return {
          id: authUser.id,
          email: authUser.email || '',
          full_name: profile?.full_name,
          role: roleData?.role as UserRole || 'user'
        };
      });

      return usersWithRoles;
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
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
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