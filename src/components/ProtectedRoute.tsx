
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAdminOrCoord?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  allowedRoles,
  requireAdminOrCoord = false 
}: ProtectedRouteProps) => {
  const { user, session, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ProtectedRoute check:', { user, session, isLoading, allowedRoles, requireAdminOrCoord });
    
    if (!isLoading && !session) {
      console.log('No session found, redirecting to login');
      navigate('/login');
    }
  }, [session, isLoading, navigate]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    console.log('Still loading auth...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect)
  if (!session || !user) {
    console.log('No session or user, should redirect to login');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  // Check role-based access
  if (requireAdminOrCoord && !['admin', 'coordenacao'].includes(user.role)) {
    console.log('Access denied: requireAdminOrCoord but user role is', user.role);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
          <p className="text-sm text-gray-500 mt-2">Papel atual: {user.role}</p>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log('Access denied: role not in allowedRoles', { userRole: user.role, allowedRoles });
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
          <p className="text-sm text-gray-500 mt-2">Papel atual: {user.role}</p>
          <p className="text-sm text-gray-500">Papéis permitidos: {allowedRoles.join(', ')}</p>
        </div>
      </div>
    );
  }

  console.log('Access granted for user:', user);
  return <>{children}</>;
};
