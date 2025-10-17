import { MedicalHistory } from "../models/medicalHistorySchema.js";
import { User } from "../models/userSchema.js";
import { Appointment } from "../models/appointmentSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";



// ------------------- Create Medical History -------------------
export const createMedicalHistory = catchAsyncErrors(async (req, res, next) => {
  const {
    patientEmail,
    doctorEmail,
    appointmentId,
    symptoms,
    diagnosis,
    treatment,
    medications,
    tests,
    vitalSigns,
    allergies,
    pastMedicalHistory,
    familyHistory,
    notes,
    followUpDate,
    status
  } = req.body;

  // Validate required fields
  if (!patientEmail || !doctorEmail || !symptoms || !diagnosis || !treatment) {
    return next(new ErrorHandler("Please fill all required fields!", 400));
  }

  // Find patient
  const patient = await User.findOne({ email: patientEmail, role: "Patient" });
  if (!patient) return next(new ErrorHandler("Patient not found!", 404));

  // Find doctor
  const doctor = await User.findOne({ email: doctorEmail, role: "Doctor" });
  if (!doctor) return next(new ErrorHandler("Doctor not found!", 404));

  // Create medical history
  const medicalHistory = await MedicalHistory.create({
    patientId: patient._id,
    doctorId: doctor._id,
    appointmentId,
    symptoms,
    diagnosis,
    treatment,
    medications: medications || [],
    tests: tests || [],
    vitalSigns: vitalSigns || {},
    allergies: allergies || [],
    pastMedicalHistory: pastMedicalHistory || [],
    familyHistory: familyHistory || [],
    notes,
    followUpDate,
    status: status || "Active"
  });

  res.status(201).json({
    success: true,
    message: "Medical history created successfully!",
    medicalHistory
  });
});

// ------------------- Get Medical History by Patient -------------------
export const getMedicalHistoryByPatient = catchAsyncErrors(async (req, res, next) => {
  const { patientEmail } = req.params;

  const patient = await User.findOne({ email: patientEmail, role: "Patient" });
  if (!patient) return next(new ErrorHandler("Patient not found!", 404));

  const medicalHistory = await MedicalHistory.find({ patientId: patient._id })
    .populate("doctorId", "firstName lastName doctrDptmnt email")
    .populate("appointmentId", "appointment_date department")
    .sort({ visitDate: -1 });

  res.status(200).json({
    success: true,
    medicalHistory
  });
});

// ------------------- Get Medical History by Doctor -------------------
export const getMedicalHistoryByDoctor = catchAsyncErrors(async (req, res, next) => {
  const { doctorEmail } = req.params;

  const doctor = await User.findOne({ email: doctorEmail, role: "Doctor" });
  if (!doctor) return next(new ErrorHandler("Doctor not found!", 404));

  const medicalHistory = await MedicalHistory.find({ doctorId: doctor._id })
    .populate("patientId", "firstName lastName email phone dob gender")
    .populate("appointmentId", "appointment_date department")
    .sort({ visitDate: -1 });

  res.status(200).json({
    success: true,
    medicalHistory
  });
});

// ------------------- Get Single Medical Record -------------------
export const getMedicalRecord = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const medicalRecord = await MedicalHistory.findById(id)
    .populate("patientId", "firstName lastName email phone dob gender aadhar address")
    .populate("doctorId", "firstName lastName doctrDptmnt email phone")
    .populate("appointmentId", "appointment_date department");

  if (!medicalRecord) return next(new ErrorHandler("Medical record not found!", 404));

  res.status(200).json({
    success: true,
    medicalRecord
  });
});

// ------------------- Update Medical History -------------------
export const updateMedicalHistory = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const medicalRecord = await MedicalHistory.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });

  if (!medicalRecord) return next(new ErrorHandler("Medical record not found!", 404));

  res.status(200).json({
    success: true,
    message: "Medical history updated successfully!",
    medicalRecord
  });
});

// ------------------- Delete Medical History -------------------
export const deleteMedicalHistory = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const medicalRecord = await MedicalHistory.findById(id);
  if (!medicalRecord) return next(new ErrorHandler("Medical record not found!", 404));

  await medicalRecord.deleteOne();

  res.status(200).json({
    success: true,
    message: "Medical history deleted successfully!"
  });
});

// ------------------- Get Patient Medical Summary -------------------
export const getPatientMedicalSummary = catchAsyncErrors(async (req, res, next) => {
  const { patientEmail } = req.params;

  const patient = await User.findOne({ email: patientEmail, role: "Patient" });
  if (!patient) return next(new ErrorHandler("Patient not found!", 404));

  const medicalHistory = await MedicalHistory.find({ patientId: patient._id })
    .populate("doctorId", "firstName lastName doctrDptmnt")
    .sort({ visitDate: -1 });

  // Calculate summary statistics
  const totalVisits = medicalHistory.length;
  const activeConditions = medicalHistory.filter(record => record.status === "Active").length;
  const chronicConditions = medicalHistory.filter(record => record.status === "Chronic").length;
  
  // Get recent diagnoses
  const recentDiagnoses = medicalHistory.slice(0, 5).map(record => ({
    diagnosis: record.diagnosis,
    date: record.visitDate,
    doctor: record.doctorId.firstName + " " + record.doctorId.lastName
  }));

  // Get current medications
  const currentMedications = [];
  medicalHistory.forEach(record => {
    if (record.medications && record.medications.length > 0) {
      record.medications.forEach(med => {
        currentMedications.push({
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          prescribedBy: record.doctorId.firstName + " " + record.doctorId.lastName,
          date: record.visitDate
        });
      });
    }
  });

  res.status(200).json({
    success: true,
    summary: {
      patient: {
        name: patient.firstName + " " + patient.lastName,
        email: patient.email,
        dob: patient.dob,
        gender: patient.gender
      },
      statistics: {
        totalVisits,
        activeConditions,
        chronicConditions
      },
      recentDiagnoses,
      currentMedications: currentMedications.slice(0, 10), // Last 10 medications
      allergies: medicalHistory.reduce((acc, record) => {
        if (record.allergies) acc.push(...record.allergies);
        return acc;
      }, []).filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
    }
  });
});