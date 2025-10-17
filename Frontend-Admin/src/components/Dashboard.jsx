import React, { useEffect, useState } from "react";
import Loading from "./loading";
import axios from "axios";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import "./Dashboard.css";

const Dashboard = ({ userEmail }) => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserAndAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        // Check if userEmail is provided
        if (!userEmail) {
          setError("User email is required to load dashboard");
          setLoading(false);
          return;
        }

        // Fetch user by email
        const { data: userData } = await axios.get(
          `http://localhost:4000/api/v1/user/getbyemail?email=${userEmail}`
        );
        
        if (!userData.user) {
          setError("User not found with the provided email");
          setLoading(false);
          return;
        }
        
        setUser(userData.user);

        // Fetch all appointments
        const { data: appointmentData } = await axios.get(
          "http://localhost:4000/api/v1/appointment/getall"
        );
        setAppointments(appointmentData.appointments || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error loading dashboard data. Please try again.");
        setAppointments([]);
        setUser(null);
        toast.error("Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndAppointments();
  }, [userEmail]);

  const updateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/update/${appointmentId}`,
        { status }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating status");
    }
  };

  if (loading) return <Loading />;

  if (error || !user) {
    return (
      <div className="dashboard-error">
        <div className="error-container">
          <div className="error-icon">
            <AiFillCloseCircle />
          </div>
          <h2>{error || "Please provide a valid user email to load the dashboard."}</h2>
          <p>Please check if you're properly logged in or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="dashboard page">
      {/* Welcome Banner */}
      <div className="dashboard-banner">
        <div className="welcome-card">
          <div className="admin-profile">
            <img src="/doc.png" alt="Admin" className="admin-avatar" />
            <div className="admin-info">
              <div className="admin-greeting">
                <p className="greeting">Hello,</p>
                <h2 className="admin-name">{`${user.firstName} ${user.lastName}`}</h2>
              </div>
              <p className="admin-description">
                The Life Care Administration panel allows admins to add new
                administrators, register doctors, and manage patient appointments
                efficiently.
              </p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
          </div>
          <div className="stats-content">
            <p className="stats-label">Total Appointments</p>
            <h3 className="stats-value">{appointments.length}</h3>
          </div>
        </div>

        <div className="departments-card">
          <div className="departments-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7a2.5 2.5 0 010-5 2.5 2.5 0 010 5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/>
            </svg>
          </div>
          <div className="departments-content">
            <p className="departments-label">Departments</p>
            <div className="departments-list">
              <span>Pediatrics</span>
              <span>Orthopedics</span>
              <span>Cardiology</span>
              <span>Neurology</span>
              <span>Oncology</span>
              <span>Radiology</span>
              <span>Physical Therapy</span>
              <span>Dermatology</span>
              <span>ENT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="appointments-section">
        <div className="section-header">
          <h5>Recent Appointments</h5>
          <span className="appointments-count">{appointments.length} total</span>
        </div>
        
        <div className="table-container">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Appointment Date</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Status</th>
                <th>Visited</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment._id} className="appointment-row">
                    <td className="patient-name">
                      {`${appointment.firstName} ${appointment.lastName}`}
                    </td>
                    <td className="appointment-date">
                      {new Date(appointment.appointment_date).toLocaleDateString()}
                    </td>
                    <td className="doctor-name">
                      {appointment.doctor ? 
                        `${appointment.doctor.firstName} ${appointment.doctor.lastName}` : 
                        'N/A'
                      }
                    </td>
                    <td className="department">
                      <span className="department-badge">{appointment.department}</span>
                    </td>
                    <td className="status-cell">
                      <select
                        className={`status-select status-${appointment.status.toLowerCase()}`}
                        value={appointment.status}
                        onChange={(e) =>
                          updateStatus(appointment._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="visited-cell">
                      {appointment.hasVisited ? (
                        <GoCheckCircleFill className="icon-visited" />
                      ) : (
                        <AiFillCloseCircle className="icon-not-visited" />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="no-appointments">
                  <td colSpan="6">
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                      </svg>
                      <p>No appointments found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;