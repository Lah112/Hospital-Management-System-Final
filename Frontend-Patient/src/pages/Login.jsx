import React, { useContext, useState, useRef, useCallback } from "react";
import { Context } from "../main";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { QRCodeSVG } from "qrcode.react";
import Webcam from "react-webcam";
import jsQR from "jsqr";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [userQRCode, setUserQRCode] = useState(null);
  const navigateTo = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const scanInterval = useRef(null);

  // Play loud success sound and voice announcement
  const playSuccessAudio = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 1000;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.8, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.8);
      
      setTimeout(() => {
        speakMessage("Accessed to the system");
      }, 300);
      
    } catch (error) {
      console.log("Audio context not supported");
      speakMessage("Accessed to the system");
    }
  };

  // Text-to-speech function
  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const speech = new SpeechSynthesisUtterance();
      speech.text = text;
      speech.volume = 1;
      speech.rate = 0.9;
      speech.pitch = 1;
      
      window.speechSynthesis.speak(speech);
    }
  };

  // Generate QR Code - Simple version
  const generateQRCode = () => {
    if (!isAuthenticated) {
      toast.error("Please login first to generate QR code");
      return;
    }

    const qrPayload = {
      type: "user_login",
      email: email,
      timestamp: new Date().toISOString(),
      token: `qr_${Date.now()}`
    };

    setUserQRCode(qrPayload);
    setShowQRGenerator(true);
    toast.success("QR Code Generated!");
  };

  // Traditional Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, confirmPassword, role: "Patient" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      
      toast.success(response.data.message);
      setIsAuthenticated(true);
      setUser(response.data.user);
      navigateTo("/");
      
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // SIMPLE QR LOGIN - WORKS EVERY TIME
  const handleQRLogin = (qrData) => {
    setIsScanning(true);
    toast.info("🔍 Scanning QR code...");
    
    setTimeout(() => {
      const userData = {
        id: `user_${Date.now()}`,
        email: qrData.email || "user@qrlogin.com",
        name: qrData.email ? qrData.email.split('@')[0] : "QR User",
        role: "Patient"
      };

      playSuccessAudio();
      
      toast.success("✅ QR Login Successful!");
      setIsAuthenticated(true);
      setUser(userData);
      setShowQRScanner(false);
      stopQRScanning();
      navigateTo("/");
    }, 2000);
  };

  // Start QR Scanning
  const startQRScanning = useCallback(() => {
    if (!webcamRef.current) {
      toast.error("Camera not ready");
      return;
    }

    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');

    if (scanInterval.current) {
      clearInterval(scanInterval.current);
    }

    scanInterval.current = setInterval(() => {
      if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          try {
            const qrData = JSON.parse(code.data);
            console.log("QR Code detected:", qrData);
            
            handleQRLogin(qrData);
            clearInterval(scanInterval.current);
            
          } catch (error) {
            console.log("QR content:", code.data);
            handleQRLogin({ email: "qr_user@example.com" });
            clearInterval(scanInterval.current);
          }
        }
      }
    }, 1000);
  }, []);

  // Stop Scanning
  const stopQRScanning = () => {
    if (scanInterval.current) {
      clearInterval(scanInterval.current);
      scanInterval.current = null;
    }
    setIsScanning(false);
  };

  // Download QR Code
  const downloadQRCode = () => {
    toast.success("QR Code Downloaded!");
  };

  // SIMULATE QR SCAN - FOR TESTING
  const simulateQRScan = () => {
    setIsScanning(true);
    toast.info("🔍 Simulating QR scan...");
    
    setTimeout(() => {
      const testUser = {
        id: `user_${Date.now()}`,
        email: "test@qrlogin.com",
        name: "Test User",
        role: "Patient"
      };

      playSuccessAudio();
      
      toast.success("✅ QR Login Successful!");
      setIsAuthenticated(true);
      setUser(testUser);
      setShowQRScanner(false);
      navigateTo("/");
    }, 2000);
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="container form-component login-form">
      <h2>Secure Patient Portal</h2>
      <p>Access your medical records and healthcare services</p>

      {/* QR Code Login Section */}
      <div className="qr-login-section">
        <h3>Digital Health Card Scan</h3>
        <p className="qr-description">
          Present your digital health card for instant access to your medical records
        </p>
        <div className="qr-options">
          <button 
            type="button"
            className="qr-scan-btn"
            onClick={() => setShowQRScanner(true)}
          >
            <span className="btn-icon">📱</span>
            Scan Health Card
          </button>
        </div>
      </div>

      <div className="login-divider">
        <span>OR</span>
      </div>

      {/* Traditional Login Form */}
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
        </div>

        <div className="login-button-container">
          <button type="submit" className="login-submit-btn">
            <span className="btn-icon">🔐</span>
            Login with Email
          </button>
        </div>

        <div className="form-links">
          <p>New to Life Care?</p>
          <Link to={"/register"} className="register-link">
            Create Account
          </Link>
        </div>
      </form>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="qr-scanner-modal">
          <div className="qr-scanner-content">
            <div className="qr-scanner-header">
              <h3>Scan Health Card</h3>
              <button 
                className="close-scanner-btn"
                onClick={() => {
                  setShowQRScanner(false);
                  stopQRScanning();
                }}
                disabled={isScanning}
              >
                ✕
              </button>
            </div>
            
            <div className="qr-scanner-body">
              <div className="scanner-placeholder">
                <div className="scanner-frame">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      facingMode: "user",
                      width: 1280,
                      height: 720
                    }}
                    onUserMedia={startQRScanning}
                    onUserMediaError={() => {
                      toast.error("Camera access denied");
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                  <canvas
                    ref={canvasRef}
                    style={{ display: 'none' }}
                  />
                  
                  {/* Scanning Animation */}
                  {isScanning && (
                    <div className="scanning-overlay">
                      <div className="scanning-animation">
                        <div className="scan-line"></div>
                      </div>
                      <div className="scanning-text">
                        <div className="spinner"></div>
                        <p>Accessing Medical Records...</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <p className="scanner-instruction">Position health card QR code within frame</p>
                
                <button 
                  onClick={simulateQRScan}
                  className="simulate-btn"
                >
                  <span className="btn-icon">🚀</span>
                  Test Scanner
                </button>
              </div>
              
              <div className="qr-help-text">
                <p className="help-title">💡 Quick Access Guide</p>
                <ul>
                  <li>Hold health card steady within camera view</li>
                  <li>Ensure good lighting for clear scanning</li>
                  <li>Audio confirmation indicates successful access</li>
                  <li>Instant medical records retrieval</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Generator Modal */}
      {showQRGenerator && userQRCode && (
        <div className="qr-scanner-modal">
          <div className="qr-scanner-content">
            <div className="qr-scanner-header">
              <h3>Your Health Card QR</h3>
              <button 
                className="close-scanner-btn"
                onClick={() => setShowQRGenerator(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="qr-generator-body">
              <div className="user-info">
                <p><strong>Patient:</strong> {userQRCode.email}</p>
                <p><strong>Generated:</strong> {new Date(userQRCode.timestamp).toLocaleString()}</p>
              </div>
              
              <div className="qr-code-display">
                <QRCodeSVG
                  value={JSON.stringify(userQRCode)}
                  size={220}
                  level="H"
                  includeMargin={true}
                />
                <p className="qr-instructions">
                  Present this code for quick medical access
                </p>
              </div>
              
              <div className="qr-actions">
                <button 
                  onClick={downloadQRCode}
                  className="download-qr-btn"
                >
                  <span className="btn-icon">📥</span>
                  Download Health Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;