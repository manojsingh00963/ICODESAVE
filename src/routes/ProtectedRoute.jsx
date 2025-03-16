import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // ✅ Redirect to login if token is missing
    return (
      <>
      <h1>Please login first</h1>
      <Navigate to="/login" replace />
      </>
    );
  }

  return children;
};

export default ProtectedRoute;
