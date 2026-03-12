import { Link, useNavigate } from 'react-router-dom';
import { getDashboardStats, getPatients } from '../services/adminService';
import { useFetch } from '../hooks/useFetch';
import MainLayout from '../layouts/MainLayout';
import StatCard from '../components/StatCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data, loading, error } = useFetch(getDashboardStats, []);
  const { data: patientsData, loading: patientsLoading } = useFetch(getPatients, []);
  const stats = data?.data;
  const patients = patientsData?.data || [];

  return (
    <MainLayout>
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of the healthcare platform</p>
        </div>

        {loading ? (
          <LoadingSkeleton type="stat" count={4} />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl text-sm">{error}</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard
                label="Total Doctors"
                value={stats?.doctors}
                color="bg-blue-100"
                icon={
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatCard
                label="Total Patients"
                value={stats?.patients}
                color="bg-green-100"
                icon={
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              />
              <StatCard
                label="Total Appointments"
                value={stats?.appointments}
                color="bg-purple-100"
                icon={
                  <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
              <StatCard
                label="Pending Appointments"
                value={stats?.pendingAppointments}
                color="bg-yellow-100"
                icon={
                  <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>

            {/* Patient List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="px-6 pt-6 pb-4">
                <h2 className="text-lg font-semibold text-gray-800">Registered Patients</h2>
                <p className="text-sm text-gray-500 mt-0.5">All patients registered on the platform</p>
              </div>
              {patientsLoading ? (
                <div className="px-6 pb-6">
                  <LoadingSkeleton type="row" count={4} />
                </div>
              ) : patients.length === 0 ? (
                <div className="text-center py-10 px-6">
                  <p className="text-gray-400 text-sm">No patients registered yet</p>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-y border-gray-100 bg-gray-50">
                          <th className="text-left py-2.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                          <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                          <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Registered</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {patients.map((patient) => (
                          <tr key={patient._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/patients/${patient._id}`)}>
                            <td className="py-3 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-xs shrink-0">
                                  {(patient.userId?.name || 'P').charAt(0)}
                                </div>
                                <span className="text-sm font-medium text-gray-800">{patient.userId?.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">{patient.userId?.email}</td>
                            <td className="py-3 px-4 text-sm text-gray-500">
                              {patient.createdAt
                                ? new Date(patient.createdAt).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Mobile list */}
                  <div className="md:hidden divide-y divide-gray-100 px-4 pb-4">
                    {patients.map((patient) => (
                      <div key={patient._id} className="flex items-center gap-3 py-3 cursor-pointer" onClick={() => navigate(`/patients/${patient._id}`)}>
                        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm shrink-0">
                          {(patient.userId?.name || 'P').charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{patient.userId?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{patient.userId?.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/create-doctor"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Doctor
                </Link>
                <Link
                  to="/doctors"
                  className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-2.5 rounded-lg transition text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  View Doctors
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </MainLayout>
  );
}

