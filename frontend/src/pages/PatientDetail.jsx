import { useParams, useNavigate } from 'react-router-dom';
import { getPatientById, getPatientAppointments, getPatientPrescriptions } from '../services/adminService';
import { useFetch } from '../hooks/useFetch';
import MainLayout from '../layouts/MainLayout';
import LoadingSkeleton from '../components/LoadingSkeleton';

function StatusBadge({ status }) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    paid: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: patientData, loading: patientLoading, error: patientError } = useFetch(() => getPatientById(id), [id]);
  const { data: appointmentsData, loading: appointmentsLoading } = useFetch(() => getPatientAppointments(id), [id]);
  const { data: prescriptionsData, loading: prescriptionsLoading } = useFetch(() => getPatientPrescriptions(id), [id]);

  const patient = patientData?.data;
  const appointments = appointmentsData?.data || [];
  const prescriptions = prescriptionsData?.data || [];

  if (patientLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-10">
          <LoadingSkeleton type="stat" count={2} />
        </div>
      </MainLayout>
    );
  }

  if (patientError || !patient) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-10 text-center text-gray-500">
          {patientError || 'Patient not found.'}
        </div>
      </MainLayout>
    );
  }

  const user = patient.userId || {};

  return (
    <MainLayout>
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Back button */}
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        {/* Patient Profile */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 px-8 py-10 text-white">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold shrink-0">
                {(user.name || 'P').charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name || '—'}</h1>
                <p className="text-green-200 mt-1">{user.email || '—'}</p>
                <p className="text-green-200 text-sm mt-1">
                  Registered:{' '}
                  {patient.createdAt
                    ? new Date(patient.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="px-6 pt-6 pb-4">
            <h2 className="text-lg font-semibold text-gray-800">Appointment History</h2>
            <p className="text-sm text-gray-500 mt-0.5">All appointments for this patient</p>
          </div>
          {appointmentsLoading ? (
            <div className="px-6 pb-6"><LoadingSkeleton type="row" count={3} /></div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8 px-6">
              <p className="text-gray-400 text-sm">No appointments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-y border-gray-100 bg-gray-50">
                    <th className="text-left py-2.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wide">Doctor</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.map((appt) => (
                    <tr key={appt._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-6">
                        <p className="text-sm font-medium text-gray-800">{appt.doctorId?.name || '—'}</p>
                        <p className="text-xs text-gray-500">{appt.doctorId?.specialization || ''}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {appt.date ? new Date(appt.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="py-3 px-4"><StatusBadge status={appt.status} /></td>
                      <td className="py-3 px-4"><StatusBadge status={appt.paymentStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Prescriptions & Follow-ups */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 pt-6 pb-4">
            <h2 className="text-lg font-semibold text-gray-800">Prescriptions &amp; Follow-ups</h2>
            <p className="text-sm text-gray-500 mt-0.5">Medical prescriptions issued to this patient</p>
          </div>
          {prescriptionsLoading ? (
            <div className="px-6 pb-6"><LoadingSkeleton type="row" count={3} /></div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-8 px-6">
              <p className="text-gray-400 text-sm">No prescriptions found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 px-6 pb-6">
              {prescriptions.map((rx) => (
                <div key={rx._id} className="py-5">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Dr. {rx.doctorId?.name || '—'}
                        <span className="text-gray-400 font-normal ml-1">· {rx.doctorId?.specialization || ''}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Issued:{' '}
                        {rx.createdAt
                          ? new Date(rx.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                          : '—'}
                      </p>
                    </div>
                    {rx.followUpDate && (
                      <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Follow-up: {new Date(rx.followUpDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-2"><span className="font-medium">Diagnosis:</span> {rx.diagnosis}</p>
                  {rx.notes && (
                    <p className="text-sm text-gray-600 mb-3"><span className="font-medium">Notes:</span> {rx.notes}</p>
                  )}
                  {rx.medicines?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Medicines</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border border-gray-100 rounded-lg overflow-hidden">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Name</th>
                              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Dosage</th>
                              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Frequency</th>
                              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Duration</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {rx.medicines.map((med, i) => (
                              <tr key={`${rx._id}-${i}`}>
                                <td className="py-2 px-3 text-gray-800">{med.name}</td>
                                <td className="py-2 px-3 text-gray-600">{med.dosage}</td>
                                <td className="py-2 px-3 text-gray-600">{med.frequency}</td>
                                <td className="py-2 px-3 text-gray-600">{med.duration}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </MainLayout>
  );
}
