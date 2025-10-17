import { Message } from "../models/messageSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";



// ------------------- Send Message -------------------
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !message) {
        return next(new ErrorHandler("Please fill the full form!", 400));
    }

    // Create message
    const newMessage = await Message.create({ firstName, lastName, email, phone, message });

    res.status(201).json({
        success: true,
        message: "Message sent successfully!",
        data: newMessage
    });
});

// ------------------- Get All Messages -------------------
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    const messages = await Message.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json({
        success: true,
        messages
    });
});
