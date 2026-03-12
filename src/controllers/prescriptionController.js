import { asyncHandler } from '../middleware/asyncHandler.js';
import * as prescriptionService from '../services/prescriptionService.js';
import { escapeHtml } from '../utils/escapeHtml.js';

export const createPrescription = asyncHandler(async (req, res) => {
    const prescription = await prescriptionService.createPrescription(req.user.id, req.body);
    res.status(201).json({
        success: true,
        message: 'Prescription created successfully',
        data: prescription
    });
});

export const getMyPrescriptions = asyncHandler(async (req, res) => {
    const prescriptions = await prescriptionService.getPrescriptionsByPatientUserId(req.user.id);
    res.status(200).json({
        success: true,
        count: prescriptions.length,
        data: prescriptions
    });
});

export const getPrescriptionsForPatient = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const prescriptions = await prescriptionService.getPrescriptionsByPatient(patientId);
    res.status(200).json({
        success: true,
        count: prescriptions.length,
        data: prescriptions
    });
});

export const getMyDoctorPrescriptions = asyncHandler(async (req, res) => {
    const prescriptions = await prescriptionService.getPrescriptionsByDoctor(req.user.id);
    res.status(200).json({
        success: true,
        count: prescriptions.length,
        data: prescriptions
    });
});

export const getPrescriptionById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const prescription = await prescriptionService.getPrescriptionById(id);
    res.status(200).json({
        success: true,
        data: prescription
    });
});

export const getByAppointment = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params;
    const prescription = await prescriptionService.getPrescriptionByAppointment(appointmentId);
    res.status(200).json({
        success: true,
        data: prescription || null
    });
});

export const downloadPrescription = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const prescription = await prescriptionService.getPrescriptionById(id);

    const doctor = prescription.doctorId;
    const patientUser = prescription.patientId?.userId;
    const appointment = prescription.appointmentId;

    const medicinesHtml = prescription.medicines
        .map(
            (m) =>
                `<tr>
          <td>${escapeHtml(m.name)}</td>
          <td>${escapeHtml(m.dosage)}</td>
          <td>${escapeHtml(m.frequency)}</td>
          <td>${escapeHtml(m.duration)}</td>
        </tr>`
        )
        .join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Prescription</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    h1 { color: #2c7be5; }
    .header { border-bottom: 2px solid #2c7be5; padding-bottom: 10px; margin-bottom: 20px; }
    .section { margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; }
    th { background: #f0f4ff; }
    .footer { margin-top: 40px; font-size: 12px; color: #888; }
    @media print { button { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>Healthcare Prescription</h1>
    <p><strong>Date:</strong> ${escapeHtml(new Date(prescription.createdAt).toDateString())}</p>
  </div>
  <div class="section">
    <h3>Doctor Information</h3>
    <p><strong>Name:</strong> ${escapeHtml(doctor.name)}</p>
    <p><strong>Specialization:</strong> ${escapeHtml(doctor.specialization)}</p>
  </div>
  <div class="section">
    <h3>Patient Information</h3>
    <p><strong>Name:</strong> ${escapeHtml(patientUser?.name || 'N/A')}</p>
    <p><strong>Email:</strong> ${escapeHtml(patientUser?.email || 'N/A')}</p>
  </div>
  <div class="section">
    <h3>Appointment</h3>
    <p><strong>Date:</strong> ${appointment ? escapeHtml(new Date(appointment.date).toDateString()) : 'N/A'}</p>
    <p><strong>Status:</strong> ${appointment ? escapeHtml(appointment.status) : 'N/A'}</p>
  </div>
  <div class="section">
    <h3>Diagnosis</h3>
    <p>${escapeHtml(prescription.diagnosis)}</p>
  </div>
  ${prescription.notes ? `<div class="section"><h3>Notes</h3><p>${escapeHtml(prescription.notes)}</p></div>` : ''}
  ${
      prescription.medicines.length > 0
          ? `<div class="section">
    <h3>Medicines</h3>
    <table>
      <thead>
        <tr><th>Name</th><th>Dosage</th><th>Frequency</th><th>Duration</th></tr>
      </thead>
      <tbody>${medicinesHtml}</tbody>
    </table>
  </div>`
          : ''
  }
  ${prescription.followUpDate ? `<div class="section"><h3>Follow-up Date</h3><p>${escapeHtml(new Date(prescription.followUpDate).toDateString())}</p></div>` : ''}
  <div class="footer">
    <p>This prescription is computer-generated and valid without a physical signature.</p>
    <button onclick="window.print()">Print / Download</button>
  </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader(
        'Content-Disposition',
        `attachment; filename="prescription-${id}.html"`
    );
    res.status(200).send(html);
});
