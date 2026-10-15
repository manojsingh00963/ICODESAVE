import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const location = useLocation();
  const isAuthenticated = Boolean(token && token !== 'undefined' && token !== 'null');

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('Please log in to access your snippets vault.');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
