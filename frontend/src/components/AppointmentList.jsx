import { useEffect, useState } from 'react';
import api from '../api';

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/appointments/my-appointments')
      .then(r => setAppointments(r.data.data))
      .catch(err => setError(err.response?.data?.message || 'Unable to load'));
  }, []);

  return (
    <div>
      <h2>My appointments</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {appointments.map(a => (
          <li key={a._id}>
            {new Date(a.date).toLocaleDateString()} at {a.time} with {a.doctor.name}
            {' '}({a.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
