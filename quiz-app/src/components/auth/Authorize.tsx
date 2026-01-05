import { useAuthContext } from '@/contexts/useAuthContext';

interface AuthorizeProps {
  children: React.ReactNode;
  role?: string;
  roles?: string[];
  fallback?: React.ReactNode;
}

/**
 * RBAC Component - Conditionally render children based on user roles
 * 
 * @example
 * <Authorize role="ADMIN">
 *   <button>Delete</button>
 * </Authorize>
 * 
 * @example
 * <Authorize roles={["ADMIN", "MODERATOR"]} fallback={<p>Access Denied</p>}>
 *   <AdminPanel />
 * </Authorize>
 */
export default function Authorize({ children, role, roles, fallback = null }: Readonly<AuthorizeProps>) {
  const { user, isAuthenticated } = useAuthContext();

  // Not authenticated - return fallback or nothing
  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  // Check single role
  if (role && !user.roles.includes(role)) {
    return <>{fallback}</>;
  }

  // Check multiple roles (user must have at least one)
  if (roles && !roles.some(r => user.roles.includes(r))) {
    return <>{fallback}</>;
  }

  // User has required permissions
  return <>{children}</>;
}
