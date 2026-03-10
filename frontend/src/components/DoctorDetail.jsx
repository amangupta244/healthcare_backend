import { useState } from 'react';
import api from '../api';

export default function DoctorDetail({ doctor, onBack }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState('');

  const book = async e => {
    e.preventDefault();
    setStatus('loading');
    setMessage(null);

    try {
      await api.post('/appointments/book', { doctorId: doctor._id, date, time });
      setMessage('Appointment booked successfully!');
      setStatus('success');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <span className="text-xl">←</span>
        Back to list
      </button>

      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-gray-900">{doctor.name}</h3>
        <p className="mt-1 text-gray-600">{doctor.specialization}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500">Experience</p>
            <p className="mt-1 text-lg font-medium text-slate-900">{doctor.experience} years</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500">Fee</p>
            <p className="mt-1 text-lg font-medium text-slate-900">₹{doctor.consultationFee}</p>
          </div>
        </div>
      </div>

      <form onSubmit={book} className="mt-8 space-y-6">
        <h4 className="text-lg font-semibold text-gray-900">Book an appointment</h4>

        {message && (
          <div
            className={`rounded-md px-4 py-3 text-sm ${
              status === 'success'
                ? 'bg-emerald-50 text-emerald-800'
                : 'bg-rose-50 text-rose-800'
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            Date
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            Time
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {status === 'loading' ? 'Booking…' : 'Book Appointment'}
        </button>

        <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-medium text-slate-700">Availability</p>
          <ul className="mt-2 space-y-1">
            {doctor.availability?.map((slot, idx) => (
              <li key={idx}>
                <span className="font-medium text-slate-900">{slot.day}:</span>{' '}
                {slot.from}–{slot.to}
              </li>
            ))}
          </ul>
        </div>
      </form>
    </div>
  );
}
