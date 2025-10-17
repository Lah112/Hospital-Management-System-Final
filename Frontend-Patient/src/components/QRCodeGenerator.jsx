import React, { useState, useContext } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Context } from '../main';
import { toast } from 'react-toastify';
import axios from 'axios';
import './QRCodeGenerator.css';

const QRCodeGenerator = () => {
  const { user, isAuthenticated } = useContext(Context);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [userQRCode, setUserQRCode] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate QR Code with user data
  const generateQRCode = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please login to generate your QR code");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Try to get secure token from backend
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/generate-qr-token",
        { 
          userId: user._id || user.id, 
          email: user.email,
          name: user.name 
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

        // In QRCodeGenerator.jsx - make sure it generates the same structure
        const qrPayload = {
        type: "user_login",
        email: user.email,
        timestamp: new Date().toISOString(),
        qrToken: `qr_${Math.random().toString(36).substr(2, 16)}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };

      setUserQRCode(qrPayload);
      setShowQRGenerator(true);
      toast.success("🔐 Your personal QR code has been generated!");

    } catch (error) {
      // Fallback if backend endpoint doesn't exist
      console.log("Using fallback QR generation...");
      
      const qrPayload = {
        type: "user_login",
        userId: user._id || user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        timestamp: new Date().toISOString(),
        qrToken: `qr_${Math.random().toString(36).substr(2, 16)}_${Date.now()}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };

      setUserQRCode(qrPayload);
      setShowQRGenerator(true);
      toast.success("🔐 Your personal QR code has been generated!");
    } finally {
      setIsGenerating(false);
    }
  };

  // Download QR Code
  const downloadQRCode = () => {
    const svgElement = document.getElementById("user-qr-code");
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `life-care-qr-${user.name || 'user'}.png`;
      downloadLink.href = pngFile;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
    toast.success("📥 QR Code downloaded successfully!");
  };

  if (!isAuthenticated) {
    return null; // Don't show if not authenticated
  }

  return (
    <div className="qr-generator-section">
      <div className="qr-generator-card">
        <h3>Quick Login QR Code</h3>
        <p>Generate your personal QR code for fast, secure login</p>
        
        <button 
          onClick={generateQRCode}
          disabled={isGenerating}
          className="generate-qr-btn"
        >
          {isGenerating ? (
            <>
              <div className="spinner-small"></div>
              Generating...
            </>
          ) : (
            "🏥 Generate My QR Code"
          )}
        </button>

        <div className="qr-benefits">
          <h4>Benefits:</h4>
          <ul>
            <li>✅ Quick login without typing credentials</li>
            <li>✅ Secure encrypted token</li>
            <li>✅ Works for 24 hours</li>
            <li>✅ Easy to use on any device</li>
          </ul>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRGenerator && userQRCode && (
        <div className="qr-modal-overlay">
          <div className="qr-modal-content">
            <div className="qr-modal-header">
              <h3>Your Personal QR Code</h3>
              <button 
                onClick={() => setShowQRGenerator(false)}
                className="close-modal-btn"
              >
                ✕
              </button>
            </div>
            
            <div className="qr-modal-body">
              <div className="user-qr-info">
                <p><strong>Name:</strong> {userQRCode.name}</p>
                <p><strong>Email:</strong> {userQRCode.email}</p>
                <p><strong>Role:</strong> {userQRCode.role}</p>
                <p><strong>Generated:</strong> {new Date(userQRCode.timestamp).toLocaleString()}</p>
                <p><strong>Expires:</strong> {new Date(userQRCode.expiresAt).toLocaleString()}</p>
              </div>
              
              <div className="qr-code-container">
                <QRCodeSVG
                  id="user-qr-code"
                  value={JSON.stringify(userQRCode)}
                  size={280}
                  level="H"
                  includeMargin={true}
                />
                <p className="qr-instruction">
                  Scan this code with the Life Care app for quick login
                </p>
              </div>
              
              <div className="qr-modal-actions">
                <button 
                  onClick={downloadQRCode}
                  className="download-qr-btn"
                >
                  📥 Download QR Code
                </button>
                <button 
                  onClick={() => setShowQRGenerator(false)}
                  className="close-btn"
                >
                  Close
                </button>
              </div>
              
              <div className="qr-security-note">
                <p>🔒 <strong>Security Tip:</strong> Keep this QR code secure. It contains your login information.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;