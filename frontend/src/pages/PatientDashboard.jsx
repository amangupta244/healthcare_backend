import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyAppointments } from '../services/appointmentService';
import { getMyPrescriptions } from '../services/prescriptionService';
import MainLayout from '../layouts/MainLayout';
import StatCard from '../components/StatCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { formatDate } from '../utils/format';
import { getTokenPayload } from '../utils/auth';
import { statusColors } from '../utils/statusColors';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const payload = getTokenPayload();
  const userName = payload?.name || 'Patient';

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    Promise.all([getMyAppointments(), getMyPrescriptions()])
      .then(([apptRes, rxRes]) => {
        setAppointments(apptRes.data.data || []);
        setPrescriptions(rxRes.data.data || []);
      })
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login');
        else setError('Failed to load dashboard data');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const upcomingCount = appointments.filter(
    (a) => a.status === 'pending' || a.status === 'confirmed'
  ).length;

  const recentAppointments = appointments.slice(0, 5);

  return (
    <MainLayout>
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {userName}</h1>
          <p className="text-gray-500 mt-1">Your health at a glance</p>
        </div>

        {loading ? (
          <>
            <LoadingSkeleton type="stat" count={3} />
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
                <div className="animate-pulse h-5 w-40 bg-gray-200 rounded mb-5" />
                <LoadingSkeleton type="row" count={4} />
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse space-y-3">
                <div className="h-5 w-28 bg-gray-200 rounded mb-5" />
                <div className="h-9 bg-gray-200 rounded-lg" />
                <div className="h-9 bg-gray-100 rounded-lg" />
                <div className="h-9 bg-gray-100 rounded-lg" />
              </div>
            </div>
          </>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl text-sm">{error}</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <StatCard
                label="Upcoming Appointments"
                value={upcomingCount}
                color="bg-blue-100"
                icon={
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
              <StatCard
                label="Total Appointments"
                value={appointments.length}
                color="bg-purple-100"
                icon={
                  <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                }
              />
              <StatCard
                label="Prescriptions"
                value={prescriptions.length}
                color="bg-green-100"
                icon={
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Recent Appointments</h2>
                  {appointments.length > 5 && (
                    <Link to="/appointments" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View all →
                    </Link>
                  )}
                </div>
                {recentAppointments.length === 0 ? (
                  <div className="text-center py-10 px-6">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-400 text-sm mb-3">No appointments yet</p>
                    <Link to="/doctors" className="text-blue-600 hover:text-blue-700 text-sm font-medium">Find a Doctor →</Link>
                  </div>
                ) : (
                  <>
                    {/* Desktop mini-table */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-y border-gray-100 bg-gray-50">
                            <th className="text-left py-2.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wide">Doctor</th>
                            <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                            <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Time</th>
                            <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {recentAppointments.map((appt) => (
                            <tr key={appt._id} className="hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs shrink-0">
                                    {(appt.doctorId?.name || 'D').charAt(0)}
                                  </div>
                                  <span className="text-sm font-medium text-gray-800">Dr. {appt.doctorId?.name || 'Unknown'}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">{appt.date ? formatDate(appt.date) : '—'}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{appt.timeSlot || '—'}</td>
                              <td className="py-3 px-4">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[appt.status] || statusColors.pending}`}>
                                  {appt.status || 'pending'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Mobile list */}
                    <div className="sm:hidden divide-y divide-gray-100 px-4 pb-4">
                      {recentAppointments.map((appt) => (
                        <div key={appt._id} className="flex items-center justify-between py-3 gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs shrink-0">
                              {(appt.doctorId?.name || 'D').charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">Dr. {appt.doctorId?.name || 'Unknown'}</p>
                              <p className="text-xs text-gray-500">{appt.date ? formatDate(appt.date) : '—'}{appt.timeSlot ? ` · ${appt.timeSlot}` : ''}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${statusColors[appt.status] || statusColors.pending}`}>
                            {appt.status || 'pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/doctors"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Find a Doctor
                  </Link>
                  <Link
                    to="/appointments"
                    className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-2.5 rounded-lg transition text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    My Appointments
                  </Link>
                  <Link
                    to="/prescriptions"
                    className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-2.5 rounded-lg transition text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Prescriptions
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </MainLayout>
  );
}
