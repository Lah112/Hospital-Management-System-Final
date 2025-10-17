import mongoose from "mongoose";

const medicalHistorySchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment"
  },
  symptoms: {
    type: String,
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  treatment: {
    type: String,
    required: true
  },
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String
  }],
  tests: [{
    testName: String,
    testDate: Date,
    results: String,
    notes: String
  }],
  vitalSigns: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    oxygenSaturation: Number,
    weight: Number,
    height: Number
  },
  allergies: [String],
  pastMedicalHistory: [String],
  familyHistory: [String],
  notes: String,
  followUpDate: Date,
  status: {
    type: String,
    enum: ["Active", "Resolved", "Chronic", "Follow-up Required"],
    default: "Active"
  },
  visitDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const MedicalHistory = mongoose.model("MedicalHistory", medicalHistorySchema);