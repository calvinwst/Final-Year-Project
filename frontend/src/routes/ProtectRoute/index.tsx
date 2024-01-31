import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    isLogged: boolean;
    loading: boolean;
    }


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isLogged, loading }) => {
    if (loading) {
        return null; // Or a loading spinner
      }
      if (isLogged) {
        return <>{children}</>;
      }
      return <Navigate to="/login" />;
}

export default ProtectedRoute;