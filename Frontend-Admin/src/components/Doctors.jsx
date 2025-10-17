import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "./loading";
import "./Doctors.css";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors"
        );
        setDoctors(data.doctors || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error(error.response?.data?.message || "Error fetching doctors");
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Get unique departments for filter
  const departments = [...new Set(doctors.map(doctor => doctor.doctrDptmnt).filter(Boolean))];

  // Filter doctors based on search and department
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.doctrDptmnt?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !selectedDepartment || doctor.doctrDptmnt === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  if (loading) return <Loading />;

  return (
    <section className="doctors-page">
      <div className="doctors-header">
        <div className="header-content">
          <h1>Our Medical Team</h1>
          <p>Meet our team of experienced healthcare professionals dedicated to your well-being</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-number">{doctors.length}</span>
              <span className="stat-label">Total Doctors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <input
            type="text"
            placeholder="Search doctors by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="department-filter"
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <div className="doctors-grid">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor, index) => (
            <div className="doctor-card" key={doctor._id || index}>
              <div className="card-header">
                <div className="avatar-container">
                  <img
                    src={doctor.doctrAvatar?.url || "/default-avatar.png"}
                    alt={`${doctor.firstName} ${doctor.lastName}`}
                    className="doctor-avatar"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                  <div className="online-indicator"></div>
                </div>
                <div className="doctor-basic-info">
                  <h3 className="doctor-name">{`${doctor.firstName || ""} ${doctor.lastName || ""}`}</h3>
                  <span className="doctor-department">{doctor.doctrDptmnt || "General"}</span>
                </div>
              </div>

              <div className="card-body">
                <div className="info-grid">
                  <div className="info-item">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <div className="info-content">
                      <span className="info-label">Email</span>
                      <span className="info-value">{doctor.email || "-"}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <div className="info-content">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{doctor.phone || "-"}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <div className="info-content">
                      <span className="info-label">Date of Birth</span>
                      <span className="info-value">
                        {doctor.dob ? new Date(doctor.dob).toLocaleDateString() : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 3.5C14.5 3.2 13.8 3.2 13.3 3.5L7 7V9C7 9.6 7.4 10 8 10H9V20C9 20.6 9.4 21 10 21H14C14.6 21 15 20.6 15 20V10H16C16.6 10 17 9.6 17 9Z" fill="currentColor"/>
                    </svg>
                    <div className="info-content">
                      <span className="info-label">Gender</span>
                      <span className="info-value">{doctor.gender || "-"}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <div className="info-content">
                      <span className="info-label">Aadhar Number</span>
                      <span className="info-value">{doctor.aadhar || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <button className="appointment-btn">
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Book Appointment
                </button>
                <button className="profile-btn">
                  View Profile
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 16H4V8h16v12z"/>
              </svg>
            </div>
            <h3>No Doctors Found</h3>
            <p>No doctors match your current search criteria. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Doctors;