import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Doctors from './pages/Doctors';
import DoctorDetail from './pages/DoctorDetail';
import AppointmentList from './pages/AppointmentList';
import CreateDoctor from './pages/CreateDoctor';
import AdminDashboard from './pages/AdminDashboard';
import Prescriptions from './pages/Prescriptions';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/doctors" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <AppointmentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prescriptions"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Prescriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-doctor"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CreateDoctor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/doctors" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

