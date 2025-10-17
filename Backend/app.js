import { config } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

import userRouter from "./router/userRouter.js";
import messageRouter from "./router/messageRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import medicalHistoryRoutes from "./router/medicalHistoryRoutes.js";
 // Add this import

config({ path: "./.env" });

const app = express();

// Stripe webhook needs raw body, so we handle it before other middleware
app.use('/api/v1/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const stripe = new (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);
    
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      const { default: Payment } = await import('./models/Payment.js');
      const { Appointment } = await import('./models/appointmentSchema.js');
      
      const payment = await Payment.findOne({ stripeSessionId: session.id });
      if (payment) {
        payment.status = 'completed';
        payment.paidAt = new Date();
        payment.stripePaymentIntentId = session.payment_intent;
        await payment.save();

        await Appointment.findByIdAndUpdate(payment.appointment, {
          paymentStatus: 'paid',
          payment: payment._id,
          status: 'Confirmed'
        });

        console.log(`Payment ${payment._id} completed successfully via webhook`);
      }
    } catch (error) {
      console.error('Error handling successful payment via webhook:', error);
    }
  }

  res.json({ received: true });
});

// Regular middleware for other routes
app.use(cors({
  origin: [process.env.FRONTEND_PATIENT, process.env.FRONTEND_ADMIN],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Routes
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/medical-history", medicalHistoryRoutes);


// Health check route
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running healthy",
    timestamp: new Date().toISOString()
  });
});

dbConnection();

app.use(errorMiddleware);

export default app;