import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const location = useLocation();
  const { authenticated, role, logout } = useAuth();

  const isActive = (path) =>
    location.pathname === path
      ? 'text-blue-600 font-semibold'
      : 'text-gray-600 hover:text-blue-600';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/doctors" className="flex items-center gap-2 text-blue-600">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-lg font-bold text-gray-800">HealthCare</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm">
          <Link to="/doctors" className={isActive('/doctors')}>Doctors</Link>
          {role === 'user' && (
            <Link to="/patient/dashboard" className={isActive('/patient/dashboard')}>Dashboard</Link>
          )}
          {role === 'doctor' && (
            <Link to="/doctor/dashboard" className={isActive('/doctor/dashboard')}>Dashboard</Link>
          )}
          {authenticated && (
            <Link to="/appointments" className={isActive('/appointments')}>My Appointments</Link>
          )}
          {role === 'user' && (
            <Link to="/prescriptions" className={isActive('/prescriptions')}>Prescriptions</Link>
          )}
          {role === 'admin' && (
            <Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>Dashboard</Link>
          )}
          {role === 'admin' && (
            <Link to="/create-doctor" className={isActive('/create-doctor')}>Add Doctor</Link>
          )}
          {authenticated ? (
            <button
              onClick={logout}
              className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-1.5 rounded-lg transition text-sm"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className={`${isActive('/login')} font-medium`}>Login</Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1.5 rounded-lg transition text-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
