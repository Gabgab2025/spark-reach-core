import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCMS } from '@/hooks/useCMS';

interface AdminDataProviderProps {
  children: React.ReactNode;
}

export const AdminDataContext = React.createContext<{
  dashboardStats: any;
  analyticsData: any[];
  isLoading: boolean;
}>({
  dashboardStats: null,
  analyticsData: [],
  isLoading: true
});

export const AdminDataProvider = ({ children }: AdminDataProviderProps) => {
  const cms = useCMS();

  // Cache dashboard stats and analytics data
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['cms', 'dashboard-stats'],
    queryFn: cms.getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const { data: analyticsData = [], isLoading: analyticsLoading } = useQuery({
    queryKey: ['cms', 'analytics'],
    queryFn: cms.getAnalyticsData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const value = useMemo(() => ({
    dashboardStats,
    analyticsData,
    isLoading: statsLoading || analyticsLoading
  }), [dashboardStats, analyticsData, statsLoading, analyticsLoading]);

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = React.useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within AdminDataProvider');
  }
  return context;
};