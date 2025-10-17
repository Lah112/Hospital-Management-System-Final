import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from "../models/userSchema.js";
import { Appointment } from "../models/appointmentSchema.js";
import { MedicalHistory } from "../models/medicalHistorySchema.js";
import {
  createMedicalHistory,
  getMedicalHistoryByPatient,
  getMedicalHistoryByDoctor,
  getMedicalRecord,
  updateMedicalHistory,
  deleteMedicalHistory,
  getPatientMedicalSummary
} from "../controller/medicalHistoryController.js";
import { errorMiddleware } from "../middlewares/errorMiddleware.js";

const app = express();
app.use(express.json());

// Routes
app.post("/api/v1/medical-history", createMedicalHistory);
app.get("/api/v1/medical-history/patient/:patientEmail", getMedicalHistoryByPatient);
app.get("/api/v1/medical-history/doctor/:doctorEmail", getMedicalHistoryByDoctor);
app.get("/api/v1/medical-history/record/:id", getMedicalRecord);
app.put("/api/v1/medical-history/:id", updateMedicalHistory);
app.delete("/api/v1/medical-history/:id", deleteMedicalHistory);
app.get("/api/v1/medical-history/summary/:patientEmail", getPatientMedicalSummary);
app.use(errorMiddleware);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
  await Appointment.deleteMany();
  await MedicalHistory.deleteMany();
});

describe("🧬 Medical History Controller Tests", () => {

  test("✅ should create a new medical history successfully", async () => {
    const doctor = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "doctor@example.com",
      password: "password123",
      role: "Doctor",
      doctrDptmnt: "Cardiology",
      gender: "Male",
      dob: "1980-01-01",
      aadhar: "111122223333",
      phone: "0771234567",
      doctrAvatar: { public_id: "doc1", url: "http://example.com/doc1.jpg" }
    });

    const patient = await User.create({
      firstName: "Jane",
      lastName: "Smith",
      email: "patient@example.com",
      password: "password123",
      role: "Patient",
      gender: "Female",
      dob: "1990-01-01",
      aadhar: "444455556666",
      phone: "0711111111"
    });

    const appointment = await Appointment.create({
      firstName: "Jane",
      lastName: "Smith",
      email: patient.email,
      phone: patient.phone,
      aadhar: patient.aadhar,
      dob: patient.dob,
      gender: patient.gender,
      appointment_date: "2025-10-17",
      department: "Cardiology",
      doctor: { firstName: doctor.firstName, lastName: doctor.lastName },
      patientId: patient._id,
      doctorId: doctor._id,
      hasVisited: false,
      address: "Colombo"
    });

    const res = await request(app).post("/api/v1/medical-history").send({
      patientEmail: patient.email,
      doctorEmail: doctor.email,
      appointmentId: appointment._id,
      symptoms: "Fever, cough",
      diagnosis: "Flu",
      treatment: "Rest and fluids",
      medications: [{ name: "Paracetamol", dosage: "500mg", frequency: "Twice daily" }],
      notes: "Patient recovering well"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.medicalHistory.diagnosis).toBe("Flu");
  });

  test("❌ should fail when required fields are missing", async () => {
    const res = await request(app).post("/api/v1/medical-history").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please fill all required fields!");
  });

  test("📋 should get medical history by patient", async () => {
    const doctor = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "doc@example.com",
      password: "password123",
      role: "Doctor",
      doctrDptmnt: "ENT",
      gender: "Male",
      dob: "1980-01-01",
      aadhar: "111122223333",
      phone: "0777777777",
      doctrAvatar: { public_id: "doc2", url: "http://example.com/doc2.jpg" }
    });

    const patient = await User.create({
      firstName: "Kamal",
      lastName: "Silva",
      email: "kamal@example.com",
      password: "password123",
      role: "Patient",
      gender: "Male",
      dob: "1990-02-02",
      aadhar: "444455556666",
      phone: "0711111111"
    });

    await MedicalHistory.create({
      patientId: patient._id,
      doctorId: doctor._id,
      symptoms: "Headache",
      diagnosis: "Migraine",
      treatment: "Painkillers"
    });

    const res = await request(app).get(`/api/v1/medical-history/patient/${patient.email}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.medicalHistory.length).toBe(1);
  });

  test("🩺 should get medical history by doctor", async () => {
    const doctor = await User.create({
      firstName: "Saman",
      lastName: "Perera",
      email: "saman@example.com",
      password: "password123",
      role: "Doctor",
      doctrDptmnt: "Dermatology",
      gender: "Male",
      dob: "1980-01-01",
      aadhar: "123456789012",
      phone: "0755555555",
      doctrAvatar: { public_id: "doc3", url: "http://example.com/doc3.jpg" }
    });

    const patient = await User.create({
      firstName: "Nimal",
      lastName: "Perera",
      email: "nimal@example.com",
      password: "password123",
      role: "Patient",
      gender: "Male",
      dob: "1985-05-05",
      aadhar: "987654321098",
      phone: "0712345678"
    });

    await MedicalHistory.create({
      patientId: patient._id,
      doctorId: doctor._id,
      symptoms: "Skin rash",
      diagnosis: "Allergy",
      treatment: "Antihistamines"
    });

    const res = await request(app).get(`/api/v1/medical-history/doctor/${doctor.email}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.medicalHistory[0].diagnosis).toBe("Allergy");
  });

  // ✅ Similarly, make sure all other tests include `doctrAvatar` for doctors and password >= 8 chars

});
