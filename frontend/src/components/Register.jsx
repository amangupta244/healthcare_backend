import { useState } from 'react';
import api from '../api';

export default function Register({ onLogin, switchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [error, setError] = useState(null);

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      localStorage.setItem('token', res.data.token);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <div>
        <label>Role</label>
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>
      </div>
      <button type="submit">Register</button>
      <p>
        Already have an account? <button type="button" onClick={switchToLogin}>Log in</button>
      </p>
    </form>
  );
}
