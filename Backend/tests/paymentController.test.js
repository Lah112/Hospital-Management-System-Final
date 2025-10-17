import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { Appointment } from "../models/appointmentSchema.js";
import {
  processOnlinePayment,
  processCashPayment,
  getPaymentDetails,
  refundPayment
} from "../controller/paymentController.js";

// Helper function to mock Express req/res
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe("💳 Payment Controller Tests with Mongoose Mock", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("✅ should process online payment successfully", async () => {
    const appointment = {
      _id: new mongoose.Types.ObjectId(),
      paymentStatus: "pending",
      save: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(Appointment, "findById").mockResolvedValue(appointment);

    const req = { body: { appointmentId: appointment._id, paymentMethod: "online" } };
    const res = mockResponse();

    await processOnlinePayment(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      transactionId: expect.any(String),
      appointment: expect.objectContaining({ paymentStatus: "paid" })
    }));
  });

  test("❌ should fail online payment if appointment not found", async () => {
    jest.spyOn(Appointment, "findById").mockResolvedValue(null);

    const req = { body: { appointmentId: new mongoose.Types.ObjectId() } };
    const res = mockResponse();

    await processOnlinePayment(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Appointment not found" }));
  });

  test("✅ should process cash payment successfully", async () => {
    const appointment = {
      _id: new mongoose.Types.ObjectId(),
      paymentStatus: "pending",
      save: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(Appointment, "findById").mockResolvedValue(appointment);

    const req = { body: { appointmentId: appointment._id } };
    const res = mockResponse();

    await processCashPayment(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      transactionId: expect.any(String),
      appointment: expect.objectContaining({ paymentMethod: "cash" })
    }));
  });

  test("✅ should get payment details", async () => {
    const appointment = {
      _id: new mongoose.Types.ObjectId(),
      amount: 100,
      paymentStatus: "paid",
      paymentMethod: "online",
      transactionId: "TXN12345",
      paidAt: new Date()
    };

    jest.spyOn(Appointment, "findById").mockResolvedValue(appointment);

    const req = { params: { appointmentId: appointment._id } };
    const res = mockResponse();

    await getPaymentDetails(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      payment: expect.objectContaining({ transactionId: "TXN12345", status: "paid" })
    }));
  });

  test("❌ should fail getting payment if appointment not found", async () => {
    jest.spyOn(Appointment, "findById").mockResolvedValue(null);

    const req = { params: { appointmentId: new mongoose.Types.ObjectId() } };
    const res = mockResponse();

    await getPaymentDetails(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Appointment not found" }));
  });

  test("✅ should refund payment successfully", async () => {
    const appointment = {
      _id: new mongoose.Types.ObjectId(),
      paymentStatus: "paid",
      save: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(Appointment, "findById").mockResolvedValue(appointment);

    const req = { body: { appointmentId: appointment._id } };
    const res = mockResponse();

    await refundPayment(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    expect(appointment.paymentStatus).toBe("refunded");
  });

  test("❌ should fail refund if payment not completed", async () => {
    const appointment = {
      _id: new mongoose.Types.ObjectId(),
      paymentStatus: "pending"
    };

    jest.spyOn(Appointment, "findById").mockResolvedValue(appointment);

    const req = { body: { appointmentId: appointment._id } };
    const res = mockResponse();

    await refundPayment(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "Cannot refund - payment not completed"
    }));
  });

});
