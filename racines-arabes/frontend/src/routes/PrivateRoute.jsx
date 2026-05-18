// Garde de route : protège les pages accessibles aux seuls utilisateurs connectés.
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Pendant la vérification du token : état de chargement neutre.
  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Chargement…
        </span>
      </div>
    );
  }

  // Non authentifié : redirection vers /login en mémorisant la provenance.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
