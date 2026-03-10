import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Doctors from './pages/Doctors';
import DoctorDetail from './pages/DoctorDetail';
import AppointmentList from './pages/AppointmentList';
import CreateDoctor from './pages/CreateDoctor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/doctors" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route path="/appointments" element={<AppointmentList />} />
        <Route path="/create-doctor" element={<CreateDoctor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

