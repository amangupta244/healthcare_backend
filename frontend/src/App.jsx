import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Doctors from './components/Doctors';
import AppointmentList from './components/AppointmentList';
import CreateDoctor from './components/CreateDoctor';

function getUserFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (_) {
    return null;
  }
}

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [view, setView] = useState('doctors');
  const [user, setUser] = useState(getUserFromToken());

  const AuthWrapper = ({ onLogin }) => {
    const [mode, setMode] = useState('login');
    const handleLogin = () => {
      setUser(getUserFromToken());
      onLogin();
    };
    return mode === 'login' ? (
      <Login onLogin={handleLogin} switchToRegister={() => setMode('register')} />
    ) : (
      <Register onLogin={handleLogin} switchToLogin={() => setMode('login')} />
    );
  };

  if (!loggedIn) {
    return (
      <AuthWrapper onLogin={() => setLoggedIn(true)} />
    );
  }

  return (
    <div className="App">
      <button onClick={() => { localStorage.removeItem('token'); setLoggedIn(false); setUser(null); }}>Logout</button>
      <nav>
        <button onClick={() => setView('doctors')}>Doctors</button>
        <button onClick={() => setView('appointments')}>My Appointments</button>
        {user?.role === 'admin' && (
          <button onClick={() => setView('create-doctor')}>Create Doctor</button>
        )}
      </nav>
      {view === 'doctors' && <Doctors />}
      {view === 'appointments' && <AppointmentList />}
      {view === 'create-doctor' && <CreateDoctor onCreated={() => setView('doctors')} />}
    </div>
  );
}

export default App;
