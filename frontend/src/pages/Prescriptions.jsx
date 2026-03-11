import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyPrescriptions } from '../services/prescriptionService';
import MainLayout from '../layouts/MainLayout';
import { formatDate } from '../utils/format';

export default function Prescriptions() {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyPrescriptions()
      .then(({ data }) => setPrescriptions(data.data || []))
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login');
        else setError('Failed to load prescriptions');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <MainLayout>
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Prescriptions</h1>
          <p className="text-gray-500 mt-1">View prescriptions issued by your doctors</p>
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
        ) : prescriptions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium text-gray-700 mb-2">No prescriptions yet</p>
            <p className="text-gray-500 text-sm mb-6">Your prescriptions will appear here after a consultation</p>
            <button
              onClick={() => navigate('/doctors')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition text-sm"
            >
              Find a Doctor
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((rx) => (
              <div key={rx._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg shrink-0">
                      {(rx.doctorId?.name || 'D').charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Dr. {rx.doctorId?.name || 'Unknown Doctor'}
                      </p>
                      <p className="text-sm text-gray-500">{rx.doctorId?.specialization}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(rx.createdAt)}
                  </span>
                </div>

                {rx.diagnosis && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Diagnosis</p>
                    <p className="text-gray-800 text-sm">{rx.diagnosis}</p>
                  </div>
                )}

                {rx.medications?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Medications</p>
                    <div className="space-y-1.5">
                      {rx.medications.map((med, i) => (
                        <div key={i} className="flex flex-wrap gap-x-4 gap-y-1 bg-blue-50 rounded-lg px-4 py-2 text-sm text-blue-900">
                          <span className="font-medium">{med.name}</span>
                          {med.dosage && <span className="text-blue-700">{med.dosage}</span>}
                          {med.frequency && <span className="text-blue-600">{med.frequency}</span>}
                          {med.duration && <span className="text-blue-500">{med.duration}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {rx.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</p>
                    <p className="text-gray-700 text-sm">{rx.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </MainLayout>
  );
}
