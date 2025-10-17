import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "./Loading";
import "./MedicalHistory.css";

const MedicalHistory = ({ userEmail, userRole }) => {
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        setLoading(true);
        
        if (userRole === "Patient") {
          // Fetch patient's medical history
          const { data } = await axios.get(
            `http://localhost:4000/api/v1/medical-history/patient/${userEmail}`
          );
          setMedicalHistory(data.medicalHistory || []);

          // Fetch patient summary
          const summaryData = await axios.get(
            `http://localhost:4000/api/v1/medical-history/summary/${userEmail}`
          );
          setSummary(summaryData.data.summary);
        } else if (userRole === "Doctor") {
          // Fetch doctor's medical records
          const { data } = await axios.get(
            `http://localhost:4000/api/v1/medical-history/doctor/${userEmail}`
          );
          setMedicalHistory(data.medicalHistory || []);
        }
      } catch (error) {
        console.error("Error fetching medical history:", error);
        toast.error("Error loading medical history");
        setMedicalHistory([]);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchMedicalHistory();
    }
  }, [userEmail, userRole]);

  const viewRecordDetails = async (recordId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/v1/medical-history/record/${recordId}`
      );
      setSelectedRecord(data.medicalRecord);
      setShowModal(true);
    } catch (error) {
      toast.error("Error loading record details");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="medical-history-container">
      <div className="medical-history-header">
        <div>
          <h1>Medical History</h1>
          <p>Your complete health records and medical history</p>
        </div>
        <div className="header-actions">
          <button className="action-btn view-btn">
            Download Records
          </button>
          <button className="action-btn edit-btn">
            Share Records
          </button>
        </div>
      </div>

      {/* Summary Section for Patients */}
      {userRole === "Patient" && summary && (
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Visits</h3>
            <div className="number">{summary.statistics.totalVisits}</div>
          </div>
          <div className="summary-card">
            <h3>Active Conditions</h3>
            <div className="number">{summary.statistics.activeConditions}</div>
          </div>
          <div className="summary-card">
            <h3>Chronic Conditions</h3>
            <div className="number">{summary.statistics.chronicConditions}</div>
          </div>
          <div className="summary-card">
            <h3>Allergies</h3>
            <div className="number">{summary.allergies.length}</div>
          </div>
        </div>
      )}

      {/* Medical Records */}
      <div className="medical-records-grid">
        {medicalHistory.length > 0 ? (
          medicalHistory.map((record) => (
            <div key={record._id} className="medical-record-card">
              <div className="record-header">
                <div className="record-doctor">
                  <img
                    src={record.doctorId?.doctrAvatar?.url || "/default-avatar.png"}
                    alt="Doctor"
                    className="doctor-avatar"
                  />
                  <div className="doctor-info">
                    <h4>Dr. {record.doctorId.firstName} {record.doctorId.lastName}</h4>
                    <p>{record.doctorId.doctrDptmnt}</p>
                  </div>
                </div>
                <div className="record-date">
                  <div className="visit-date">{formatDate(record.visitDate)}</div>
                  <span className={`status-badge status-${record.status.toLowerCase().replace(' ', '')}`}>
                    {record.status}
                  </span>
                </div>
              </div>

              <div className="record-details">
                <div className="detail-section">
                  <h5>Symptoms</h5>
                  <div className="detail-content">{record.symptoms}</div>
                </div>
                <div className="detail-section">
                  <h5>Diagnosis</h5>
                  <div className="detail-content">{record.diagnosis}</div>
                </div>
                <div className="detail-section">
                  <h5>Treatment</h5>
                  <div className="detail-content">{record.treatment}</div>
                </div>
                {record.medications && record.medications.length > 0 && (
                  <div className="detail-section">
                    <h5>Medications</h5>
                    <div className="medications-list">
                      {record.medications.slice(0, 2).map((med, index) => (
                        <div key={index} className="medication-item">
                          <div className="medication-name">{med.name}</div>
                          <div className="medication-details">
                            {med.dosage} - {med.frequency}
                          </div>
                        </div>
                      ))}
                      {record.medications.length > 2 && (
                        <div className="medication-item">
                          +{record.medications.length - 2} more medications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="record-actions">
                <button
                  className="action-btn view-btn"
                  onClick={() => viewRecordDetails(record._id)}
                >
                  View Details
                </button>
                {userRole === "Doctor" && (
                  <button className="action-btn edit-btn">
                    Edit Record
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
            </div>
            <h3>No Medical Records Found</h3>
            <p>
              {userRole === "Patient" 
                ? "You don't have any medical records yet. Your records will appear here after your first doctor's visit."
                : "No medical records found for your patients yet."
              }
            </p>
          </div>
        )}
      </div>

      {/* Record Details Modal */}
      {showModal && selectedRecord && (
        <RecordDetailsModal
          record={selectedRecord}
          onClose={() => setShowModal(false)}
          userRole={userRole}
        />
      )}
    </div>
  );
};

// Modal Component for Detailed Record View
const RecordDetailsModal = ({ record, onClose, userRole }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Medical Record Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {/* Add detailed record view here */}
          <p>Detailed view of: {record.diagnosis}</p>
          {/* You can expand this to show all record details */}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;