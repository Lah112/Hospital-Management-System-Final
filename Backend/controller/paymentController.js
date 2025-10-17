import { Appointment } from "../models/appointmentSchema.js";

// Generate a simple transaction ID
const generateTransactionId = () => {
    return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export const processOnlinePayment = async (req, res, next) => {
    try {
        const { appointmentId, paymentMethod = "online" } = req.body;

        console.log("Processing payment for appointment:", appointmentId);

        // Validate appointment exists
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        // Check if already paid
        if (appointment.paymentStatus === 'paid') {
            return res.status(400).json({
                success: false,
                message: "Payment already completed for this appointment"
            });
        }

        // Simulate payment processing
        // In real scenario, you'd integrate with payment gateway here
        const paymentSuccess = Math.random() > 0.1; // 90% success rate for simulation

        if (paymentSuccess) {
            // Update appointment with payment details
            appointment.paymentStatus = 'paid';
            appointment.paymentMethod = paymentMethod;
            appointment.paidAt = new Date();
            appointment.transactionId = generateTransactionId();
            appointment.status = 'Confirmed';
            
            await appointment.save();

            console.log("Payment processed successfully for appointment:", appointmentId);

            return res.status(200).json({
                success: true,
                message: "Payment processed successfully!",
                transactionId: appointment.transactionId,
                appointment: appointment
            });
        } else {
            // Payment failed
            appointment.paymentStatus = 'failed';
            await appointment.save();

            return res.status(400).json({
                success: false,
                message: "Payment processing failed. Please try again."
            });
        }

    } catch (error) {
        console.error("Payment processing error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Payment processing failed"
        });
    }
};

export const processCashPayment = async (req, res, next) => {
    try {
        const { appointmentId } = req.body;

        console.log("Processing cash payment for appointment:", appointmentId);

        // Validate appointment exists
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        // For cash payment, mark as paid immediately
        appointment.paymentStatus = 'paid';
        appointment.paymentMethod = 'cash';
        appointment.paidAt = new Date();
        appointment.transactionId = generateTransactionId();
        appointment.status = 'Confirmed';
        
        await appointment.save();

        console.log("Cash payment recorded successfully");

        res.status(200).json({
            success: true,
            message: "Appointment booked successfully! Please pay $50 at the hospital.",
            transactionId: appointment.transactionId,
            appointment: appointment
        });

    } catch (error) {
        console.error("Cash payment error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Cash payment processing failed"
        });
    }
};

export const getPaymentDetails = async (req, res, next) => {
    try {
        const { appointmentId } = req.params;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        res.status(200).json({
            success: true,
            payment: {
                amount: appointment.amount,
                status: appointment.paymentStatus,
                method: appointment.paymentMethod,
                transactionId: appointment.transactionId,
                paidAt: appointment.paidAt
            }
        });

    } catch (error) {
        console.error("Get payment error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to get payment details"
        });
    }
};

export const refundPayment = async (req, res, next) => {
    try {
        const { appointmentId } = req.body;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        if (appointment.paymentStatus !== 'paid') {
            return res.status(400).json({
                success: false,
                message: "Cannot refund - payment not completed"
            });
        }

        // Update payment status to refunded
        appointment.paymentStatus = 'refunded';
        await appointment.save();

        res.status(200).json({
            success: true,
            message: "Payment refunded successfully"
        });

    } catch (error) {
        console.error("Refund error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Refund processing failed"
        });
    }
};