import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from '@/components/ui/Loading';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;

  // Show loading during initialization
  if (userState === undefined) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return children;
};

export default ProtectedRoute;