import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyAppointments } from '../services/appointmentService';
import { getMyPrescriptions } from '../services/prescriptionService';
import MainLayout from '../layouts/MainLayout';
import StatCard from '../components/StatCard';
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
          <div className="flex justify-center py-20">
            <svg className="animate-spin h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </div>
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
              {/* Recent Appointments */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Appointments</h2>
                {recentAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-400 text-sm mb-3">No appointments yet</p>
                    <Link to="/doctors" className="text-blue-600 hover:text-blue-700 text-sm font-medium">Find a Doctor →</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentAppointments.map((appt) => (
                      <div key={appt._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm shrink-0">
                            {(appt.doctorId?.name || 'D').charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Dr. {appt.doctorId?.name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">
                              {appt.date ? formatDate(appt.date) : 'N/A'}
                              {appt.timeSlot ? ` · ${appt.timeSlot}` : ''}
                            </p>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[appt.status] || statusColors.pending}`}>
                          {appt.status || 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {appointments.length > 5 && (
                  <div className="mt-4">
                    <Link to="/appointments" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View all {appointments.length} appointments →
                    </Link>
                  </div>
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
