class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Captures the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorMiddleware = (err, req, res, next) => {
  // Default values
  let error = { ...err };
  error.message = err.message || "Internal Server Error";
  error.statusCode = err.statusCode || 500;

  // Handle duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    error = new ErrorHandler(message, 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new ErrorHandler("Json Web Token is invalid, Try Again!", 400);
  }

  if (err.name === "TokenExpiredError") {
    error = new ErrorHandler("Json Web Token is Expired, Try Again!", 400);
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`;
    error = new ErrorHandler(message, 400);
  }

  // Mongoose validation errors
  const errorMessage = error.errors
    ? Object.values(error.errors)
        .map((error) => error.message)
        .join(" ")
    : error.message;

  return res.status(error.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
