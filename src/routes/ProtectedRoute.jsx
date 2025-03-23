import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!token) {
      setShowMessage(true);
      
      toast.info('Please login first'); // ✅ Show toast message
    }
  }, [token]);

  if (!token) {
    return (
      <>
        {showMessage && <h1 className="text-center text-red-500 mt-4">Please login first</h1>}
        <Navigate to="/login" replace />
      </>
    );
  }

  return children;
};

export default ProtectedRoute;
