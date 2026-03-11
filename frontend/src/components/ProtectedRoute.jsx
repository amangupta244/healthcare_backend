import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

export default function ProtectedRoute({ children, allowedRoles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const role = getUserRole();
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/doctors" replace />;
    }
  }

  return children;
}
