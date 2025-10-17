import express from "express";
import {
  createMedicalHistory,
  getMedicalHistoryByPatient,
  getMedicalHistoryByDoctor,
  getMedicalRecord,
  updateMedicalHistory,
  deleteMedicalHistory,
  getPatientMedicalSummary
} from "../controller/medicalHistoryController.js";

const router = express.Router();

// Public routes (you can add authentication later)
router.post("/create", createMedicalHistory);
router.get("/patient/:patientEmail", getMedicalHistoryByPatient);
router.get("/doctor/:doctorEmail", getMedicalHistoryByDoctor);
router.get("/record/:id", getMedicalRecord);
router.put("/update/:id", updateMedicalHistory);
router.delete("/delete/:id", deleteMedicalHistory);
router.get("/summary/:patientEmail", getPatientMedicalSummary);

export default router;