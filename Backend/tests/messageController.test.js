import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Message } from "../models/messageSchema.js";
import { sendMessage, getAllMessages } from "../controller/messageController.js";
import { errorMiddleware } from "../middlewares/errorMiddleware.js";

const app = express();
app.use(express.json());

// Routes
app.post("/api/v1/messages", sendMessage);
app.get("/api/v1/messages", getAllMessages);
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
  await Message.deleteMany();
});

describe("📩 Message Controller Tests", () => {

  test("✅ should send a message successfully", async () => {
    const res = await request(app).post("/api/v1/messages").send({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "0771234567",
      message: "Hello, this is a test message!" // ≥10 chars
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBe("Hello, this is a test message!");
  });

  test("❌ should fail when required fields are missing", async () => {
    const res = await request(app).post("/api/v1/messages").send({
      firstName: "John"
      // missing lastName, email, phone, message
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please fill the full form!");
  });

  test("📄 should get all messages", async () => {
    // Insert two valid messages
    await Message.create([
      {
        firstName: "Alice",
        lastName: "Smith",
        email: "alice@example.com",
        phone: "0771111111",
        message: "This is Alice's message, longer than 10 chars."
      },
      {
        firstName: "Bob",
        lastName: "Brown",
        email: "bob@example.com",
        phone: "0772222222",
        message: "This is Bob's message, also valid."
      }
    ]);

    const res = await request(app).get("/api/v1/messages");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.messages.length).toBe(2);
    expect(res.body.messages[0].message.length).toBeGreaterThanOrEqual(10);
  });

});
