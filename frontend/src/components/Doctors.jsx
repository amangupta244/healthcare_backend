import { useEffect, useState } from 'react';
import api from '../api';
import DoctorDetail from './DoctorDetail';

export default function Doctors({ onBack }) {
  const [doctors, setDoctors] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/doctors')
      .then(r => setDoctors(r.data.data))
      .catch(console.error);
  }, []);

  if (selected) {
    return <DoctorDetail doctor={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div>
      <h2>Doctors</h2>
      <ul>
        {doctors.map(d => (
          <li key={d._id} style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setSelected(d)}>
            {d.name} ({d.specialization})
          </li>
        ))}
      </ul>
      {onBack && <button onClick={onBack}>Back</button>}
    </div>
  );
}
