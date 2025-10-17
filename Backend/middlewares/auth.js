import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";

// Admin authentication (JWT-free)
export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // Option 1: manually pass userId in query or body for testing
  const userId = req.query.userId || req.body.userId;

  // Option 2: auto-select first admin in DB if userId not provided
  const user = userId ? await User.findById(userId) : await User.findOne({ role: "Admin" });

  if (!user) return next(new ErrorHandler("Admin not authenticated!", 400));
  if (user.role !== "Admin") return next(new ErrorHandler(`${user.role} not authorized for this resource!`, 403));

  req.user = user;
  next();
});

// Patient authentication (JWT-free)
export const isPatientAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const userId = req.query.userId || req.body.userId;
  const user = userId ? await User.findById(userId) : await User.findOne({ role: "Patient" });

  if (!user) return next(new ErrorHandler("Patient not authenticated!", 400));
  if (user.role !== "Patient") return next(new ErrorHandler(`${user.role} not authorized for this resource!`, 403));

  req.user = user;
  next();
});
