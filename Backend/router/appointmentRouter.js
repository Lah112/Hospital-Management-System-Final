import express from "express";
import {
  deleteAppointment,
  getAllAppointments,
  postAppointment,
  updateAppointmentStatus,
} from "../controller/appointmentController.js";

const router = express.Router();

// ------------------ JWT-FREE ROUTES ------------------

// Public route: anyone can post an appointment
router.post("/post", postAppointment);

// Public route: anyone can fetch all appointments
router.get("/getall", getAllAppointments);



// Public route: anyone can update appointment status
router.put("/update/:id", updateAppointmentStatus);

// Public route: anyone can delete an appointment
router.delete("/delete/:id", deleteAppointment);

export default router;
