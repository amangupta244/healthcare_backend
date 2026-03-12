import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDoctorProfile } from '../services/doctorService';
import { getDoctorAppointments } from '../services/appointmentService';
import { getDoctorPrescriptions } from '../services/prescriptionService';
import MainLayout from '../layouts/MainLayout';
import StatCard from '../components/StatCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { formatDate, formatTime } from '../utils/format';
import { statusColors } from '../utils/statusColors';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    getDoctorProfile()
      .then(({ data }) => {
        setProfile(data.data);
        return Promise.all([
          getDoctorAppointments(data.data._id),
          getDoctorPrescriptions(),
        ]);
      })
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

  const stats = appointments.reduce(
    (acc, a) => {
      acc.total += 1;
      if (a.status === 'pending') acc.pending += 1;
      else if (a.status === 'confirmed') acc.confirmed += 1;
      else if (a.status === 'completed') acc.completed += 1;
      return acc;
    },
    { total: 0, pending: 0, confirmed: 0, completed: 0 }
  );

  const recentAppointments = appointments.slice(0, 5);
  const recentPrescriptions = prescriptions.slice(0, 3);

  return (
    <MainLayout>
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {profile ? `Welcome, Dr. ${profile.name}` : 'Doctor Dashboard'}
          </h1>
          <p className="text-gray-500 mt-1">
            {profile
              ? `${profile.specialization} · ${profile.experience} years experience`
              : 'Your practice overview'}
          </p>
        </div>

        {loading ? (
          <>
            <LoadingSkeleton type="stat" count={4} />
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
                <div className="animate-pulse h-5 w-44 bg-gray-200 rounded mb-5" />
                <LoadingSkeleton type="row" count={4} />
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse space-y-3">
                  <div className="h-5 w-28 bg-gray-200 rounded mb-5" />
                  <div className="h-3 bg-gray-100 rounded" />
                  <div className="h-3 bg-gray-100 rounded" />
                  <div className="h-3 bg-gray-100 rounded" />
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                  <div className="h-5 w-32 bg-gray-200 rounded mb-5" />
                  <div className="h-9 bg-gray-200 rounded-lg" />
                </div>
              </div>
            </div>
          </>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl text-sm">{error}</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard
                label="Total Appointments"
                value={stats.total}
                color="bg-blue-100"
                icon={
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
              <StatCard
                label="Pending"
                value={stats.pending}
                color="bg-yellow-100"
                icon={
                  <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatCard
                label="Completed"
                value={stats.completed}
                color="bg-purple-100"
                icon={
                  <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
                    <p className="text-gray-400 text-sm">No appointments yet</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop mini-table */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-y border-gray-100 bg-gray-50">
                            <th className="text-left py-2.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wide">Patient</th>
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
                                    {(appt.userId?.name || 'P').charAt(0)}
                                  </div>
                                  <span className="text-sm font-medium text-gray-800">{appt.userId?.name || 'Patient'}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">{appt.date ? formatDate(appt.date) : '—'}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{appt.date ? formatTime(appt.date) : '—'}</td>
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
                              {(appt.userId?.name || 'P').charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{appt.userId?.name || 'Patient'}</p>
                              <p className="text-xs text-gray-500">{appt.date ? formatDate(appt.date) : '—'}{appt.date ? ` · ${formatTime(appt.date)}` : ''}</p>
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

              {/* Profile, Prescriptions & Quick Actions */}
              <div className="space-y-4">
                {profile && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Profile</h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Specialization</span>
                        <span className="font-medium text-gray-800">{profile.specialization}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Experience</span>
                        <span className="font-medium text-gray-800">{profile.experience} yrs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Consultation Fee</span>
                        <span className="font-medium text-gray-800">£{profile.consultationFee}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Prescriptions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Prescriptions</h2>
                  {recentPrescriptions.length === 0 ? (
                    <p className="text-gray-400 text-sm">No prescriptions issued yet</p>
                  ) : (
                    <div className="space-y-3">
                      {recentPrescriptions.map((rx) => (
                        <div key={rx._id} className="border border-gray-100 rounded-lg px-3 py-2.5">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {rx.patientId?.name || 'Patient'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{rx.diagnosis}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{formatDate(rx.createdAt)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/appointments"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      All Appointments
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </MainLayout>
  );
}

