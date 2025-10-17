import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";
import {
  postAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment
} from "../controller/appointmentController.js";
import { errorMiddleware } from "../middlewares/errorMiddleware.js";

const app = express();
app.use(express.json());

// Mount routes directly to the app
app.post("/api/v1/appointments", postAppointment);
app.get("/api/v1/appointments", getAllAppointments);
app.put("/api/v1/appointments/:id", updateAppointmentStatus);
app.delete("/api/v1/appointments/:id", deleteAppointment);
app.use(errorMiddleware);

let mongoServer;

// ---------- SETUP ----------
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
  await Appointment.deleteMany();
  await User.deleteMany();
});

// ---------- TEST CASES ----------
describe("🧪 Appointment Controller Tests", () => {
  test("✅ should create a new appointment successfully", async () => {
    // Create doctor
    const doctor = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "doctor@example.com",
      password: "password123",
      role: "Doctor",
      doctrDptmnt: "Cardiology",
      doctrAvatar: {
        public_id: "123",
        url: "http://example.com/avatar.jpg"
      },
      gender: "Male",
      dob: "1980-05-10",
      aadhar: "999988887777",
      phone: "0771234567"
    });

    // Create patient
    const patient = await User.create({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      password: "password123",
      role: "Patient",
      gender: "Female",
      dob: "1990-01-01",
      aadhar: "123456789012",
      phone: "0712345678"
    });

    const res = await request(app)
      .post("/api/v1/appointments")
      .send({
        patientEmail: patient.email,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
        aadhar: patient.aadhar,
        dob: patient.dob,
        gender: patient.gender,
        appointment_date: "2025-10-18",
        department: "Cardiology",
        doctor_firstName: doctor.firstName,
        doctor_lastName: doctor.lastName,
        hasVisited: false,
        address: "123 Main Street"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.appointment.firstName).toBe("Jane");
  });

  test("❌ should fail if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/v1/appointments")
      .send({}); // missing all fields

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please fill the full form!");
  });

  test("📋 should get all appointments", async () => {
    const doctor = await User.create({
      firstName: "Doc",
      lastName: "Who",
      email: "doc@example.com",
      password: "password123",
      role: "Doctor",
      doctrDptmnt: "Dermatology",
      doctrAvatar: { public_id: "1", url: "http://example.com/doc.jpg" },
      gender: "Male",
      dob: "1980-01-01",
      aadhar: "111122223333",
      phone: "0755555555"
    });

    const patient = await User.create({
      firstName: "Lahiru",
      lastName: "Perera",
      email: "lp@example.com",
      password: "password123",
      role: "Patient",
      gender: "Male",
      dob: "1995-01-01",
      aadhar: "999999999999",
      phone: "0711111111"
    });

    await Appointment.create({
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      aadhar: patient.aadhar,
      dob: patient.dob,
      gender: patient.gender,
      appointment_date: "2025-10-18",
      department: "Dermatology",
      doctor: { firstName: doctor.firstName, lastName: doctor.lastName },
      patientId: patient._id,
      doctorId: doctor._id,
      hasVisited: false,
      address: "Colombo"
    });

    const res = await request(app).get("/api/v1/appointments");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.appointments.length).toBeGreaterThan(0);
  });

  test("✏️ should update an appointment successfully", async () => {
    const doctor = await User.create({
      firstName: "Saman",
      lastName: "Perera",
      email: "saman@example.com",
      password: "password123",
      role: "Doctor",
      doctrDptmnt: "ENT",
      doctrAvatar: { public_id: "2", url: "http://example.com/saman.jpg" },
      gender: "Male",
      dob: "1980-02-02",
      aadhar: "111133334444",
      phone: "0766666666"
    });

    const patient = await User.create({
      firstName: "Kamal",
      lastName: "Silva",
      email: "kamal@example.com",
      password: "password123",
      role: "Patient",
      gender: "Male",
      dob: "1985-02-02",
      aadhar: "111122223333",
      phone: "0700000000"
    });

    const appointment = await Appointment.create({
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      aadhar: patient.aadhar,
      dob: patient.dob,
      gender: patient.gender,
      appointment_date: "2025-10-19",
      department: "ENT",
      doctor: { firstName: doctor.firstName, lastName: doctor.lastName },
      patientId: patient._id,
      doctorId: doctor._id,
      hasVisited: false,
      address: "Galle"
    });

    const res = await request(app)
      .put(`/api/v1/appointments/${appointment._id}`)
      .send({ hasVisited: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.appointment.hasVisited).toBe(true);
  });

  test("🗑️ should delete an appointment successfully", async () => {
    const doctor = await User.create({
      firstName: "Ravi",
      lastName: "Fernando",
      email: "ravi@example.com",
      password: "password123",
      role: "Doctor",
      doctrDptmnt: "Surgery",
      doctrAvatar: { public_id: "3", url: "http://example.com/ravi.jpg" },
      gender: "Male",
      dob: "1980-03-03",
      aadhar: "444455556666",
      phone: "0722222222"
    });

    const patient = await User.create({
      firstName: "Nimal",
      lastName: "Jayasinghe",
      email: "nimal@example.com",
      password: "password123",
      role: "Patient",
      gender: "Male",
      dob: "1980-03-03",
      aadhar: "555566667777",
      phone: "0788888888"
    });

    const appointment = await Appointment.create({
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      aadhar: patient.aadhar,
      dob: patient.dob,
      gender: patient.gender,
      appointment_date: "2025-10-20",
      department: "Surgery",
      doctor: { firstName: doctor.firstName, lastName: doctor.lastName },
      patientId: patient._id,
      doctorId: doctor._id,
      hasVisited: false,
      address: "Kandy"
    });

    const res = await request(app).delete(`/api/v1/appointments/${appointment._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Appointment deleted successfully!");
  });
});
