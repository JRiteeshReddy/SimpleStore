
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state if auth is still being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <div className="w-3 h-3 bg-primary rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login, but save current location to return after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
