import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/useAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: Readonly<ProtectedRouteProps>) {
  const { user, isAuthenticated } = useAuthContext();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if user has required role
  if (requiredRole && user) {
    const hasRequiredRole = user.roles.includes(requiredRole);
    
    if (!hasRequiredRole) {
      // Redirect to home if user doesn't have required role
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
