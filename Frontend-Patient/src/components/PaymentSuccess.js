import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState("verifying");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:4000/api/v1/payment/verify",
          { sessionId }
        );

        if (data.success) {
          setPaymentStatus("success");
          toast.success("Payment completed successfully!");
        } else {
          setPaymentStatus("failed");
          toast.error("Payment verification failed");
        }
      } catch (error) {
        setPaymentStatus("failed");
        toast.error("Error verifying payment");
      }
    };

    if (sessionId) {
      verifyPayment();
    }
  }, [sessionId]);

  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        {paymentStatus === "verifying" && (
          <>
            <div className="loading-spinner"></div>
            <h2>Verifying Payment...</h2>
            <p>Please wait while we confirm your payment.</p>
          </>
        )}
        
        {paymentStatus === "success" && (
          <>
            <div className="success-icon">✓</div>
            <h2>Payment Successful!</h2>
            <p>Your appointment has been confirmed. You will receive a confirmation email shortly.</p>
            <Link to="/appointments" className="btn-primary">
              View My Appointments
            </Link>
          </>
        )}
        
        {paymentStatus === "failed" && (
          <>
            <div className="error-icon">✕</div>
            <h2>Payment Failed</h2>
            <p>There was an issue with your payment. Please try again.</p>
            <Link to="/book-appointment" className="btn-primary">
              Try Again
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;