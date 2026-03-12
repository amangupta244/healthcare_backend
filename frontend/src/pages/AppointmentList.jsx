import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyAppointments, getDoctorAppointments } from '../services/appointmentService';
import { getDoctorProfile } from '../services/doctorService';
import MainLayout from '../layouts/MainLayout';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { formatDate, formatTime } from '../utils/format';
import { statusColors } from '../utils/statusColors';
import { getUserRole } from '../utils/auth';

export default function AppointmentList() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const role = getUserRole();
  const isDoctor = role === 'doctor';

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    const fetchAppointments = isDoctor
      ? getDoctorProfile()
          .then(({ data }) => getDoctorAppointments(data.data._id))
      : getMyAppointments();

    fetchAppointments
      .then(({ data }) => setAppointments(data.data || []))
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login');
        else setError(err.response?.data?.message || 'Failed to load appointments');
      })
      .finally(() => setLoading(false));
  }, [navigate, isDoctor]);

  return (
    <MainLayout>
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {isDoctor ? 'Patient Appointments' : 'My Appointments'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isDoctor
              ? 'All appointments booked with you'
              : 'Track and manage all your scheduled appointments'}
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton type="card" count={4} />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl text-sm">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium text-gray-700 mb-2">No appointments yet</p>
            {!isDoctor && (
              <>
                <p className="text-gray-500 text-sm mb-6">Browse our doctors and book your first appointment</p>
                <button
                  onClick={() => navigate('/doctors')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition text-sm"
                >
                  Find a Doctor
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {isDoctor ? 'Patient' : 'Doctor'}
                    </th>
                    {!isDoctor && (
                      <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Specialty</th>
                    )}
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Time</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    {isDoctor && (
                      <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.map((appt) => (
                    <tr key={appt._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm shrink-0">
                            {isDoctor
                              ? (appt.userId?.name || 'P').charAt(0)
                              : (appt.doctorId?.name || 'D').charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {isDoctor
                              ? (appt.userId?.name || 'Unknown Patient')
                              : `Dr. ${appt.doctorId?.name || 'Unknown Doctor'}`}
                          </span>
                        </div>
                      </td>
                      {!isDoctor && (
                        <td className="py-3.5 px-5 text-sm text-gray-600">
                          {appt.doctorId?.specialization || '—'}
                        </td>
                      )}
                      <td className="py-3.5 px-5 text-sm text-gray-600">
                        {appt.date ? formatDate(appt.date) : '—'}
                      </td>
                      <td className="py-3.5 px-5 text-sm text-gray-600">
                        {appt.date ? formatTime(appt.date) : '—'}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[appt.status] || statusColors.pending}`}>
                          {appt.status || 'pending'}
                        </span>
                      </td>
                      {isDoctor && (
                        <td className="py-3.5 px-5 text-xs text-gray-500">
                          {appt.isFollowUp ? (
                            <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full font-medium">
                              Follow-up
                            </span>
                          ) : (
                            <span className="bg-gray-50 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full font-medium">
                              New
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {appointments.map((appt) => (
                <div key={appt._id} className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                        {isDoctor
                          ? (appt.userId?.name || 'P').charAt(0)
                          : (appt.doctorId?.name || 'D').charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">
                          {isDoctor
                            ? (appt.userId?.name || 'Unknown Patient')
                            : `Dr. ${appt.doctorId?.name || 'Unknown Doctor'}`}
                        </p>
                        {!isDoctor && (
                          <p className="text-xs text-gray-500 truncate">{appt.doctorId?.specialization}</p>
                        )}
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${statusColors[appt.status] || statusColors.pending}`}>
                      {appt.status || 'pending'}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {appt.date ? formatDate(appt.date) : '—'}
                    </span>
                    {appt.date && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(appt.date)}
                      </span>
                    )}
                    {isDoctor && appt.isFollowUp && (
                      <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full font-medium">
                        Follow-up
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </MainLayout>
  );
}

