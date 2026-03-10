import { useState } from 'react';
import api from '../api';

export default function CreateDoctor({ onCreated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [availabilityDay, setAvailabilityDay] = useState('Monday');
  const [availabilityFrom, setAvailabilityFrom] = useState('09:00');
  const [availabilityTo, setAvailabilityTo] = useState('17:00');
  const [message, setMessage] = useState(null);

  const submit = async e => {
    e.preventDefault();
    try {
      await api.post('/doctors/create', {
        name,
        email,
        password,
        specialization,
        experience: Number(experience),
        consultationFee: Number(consultationFee),
        availability: [
          {
            day: availabilityDay,
            from: availabilityFrom,
            to: availabilityTo
          }
        ]
      });
      setMessage('Doctor created!');
      if (onCreated) onCreated();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Creation failed');
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Create Doctor</h2>
      {message && <p>{message}</p>}
      <div>
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <div>
        <label>Specialization</label>
        <input value={specialization} onChange={e => setSpecialization(e.target.value)} required />
      </div>
      <div>
        <label>Experience (years)</label>
        <input
          type="number"
          value={experience}
          onChange={e => setExperience(e.target.value)}
          required
          min={0}
        />
      </div>
      <div>
        <label>Consultation Fee</label>
        <input
          type="number"
          value={consultationFee}
          onChange={e => setConsultationFee(e.target.value)}
          required
          min={0}
        />
      </div>
      <div>
        <label>Availability</label>
        <div>
          <select value={availabilityDay} onChange={e => setAvailabilityDay(e.target.value)}>
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
            <option>Sunday</option>
          </select>
          <input
            type="time"
            value={availabilityFrom}
            onChange={e => setAvailabilityFrom(e.target.value)}
            required
          />
          <input
            type="time"
            value={availabilityTo}
            onChange={e => setAvailabilityTo(e.target.value)}
            required
          />
        </div>
      </div>
      <button type="submit">Create</button>
    </form>
  );
}
