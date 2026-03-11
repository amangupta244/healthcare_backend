import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

export function useAuth() {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const role = getUserRole();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return { authenticated, role, logout };
}
