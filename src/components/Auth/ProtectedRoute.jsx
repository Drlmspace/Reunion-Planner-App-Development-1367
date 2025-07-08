import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // For development and preview purposes, create a mock user if needed
  const isPreviewEnvironment = import.meta.env.MODE === 'development' || window.location.host.includes('preview');
  
  // Check for admin session or regular user
  const adminSession = localStorage.getItem('adminSession');
  let effectiveUser = user;
  
  if (!user && adminSession) {
    try {
      effectiveUser = JSON.parse(adminSession);
    } catch (e) {
      localStorage.removeItem('adminSession');
    }
  }
  
  // Only use the mock user in development or preview environments when there's no real user
  if (!effectiveUser && isPreviewEnvironment) {
    effectiveUser = { email: 'preview@example.com', id: 'preview-user-id' };
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!effectiveUser) {
    // Redirect to login page with return path
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;