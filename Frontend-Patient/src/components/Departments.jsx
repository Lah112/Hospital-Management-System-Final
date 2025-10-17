import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./Departments.css";

const Departments = () => {
  const departmentsArray = [
    {
      name: "Pediatrics",
      imageUrl: "/departments/pedia.jpg",
      description: "Comprehensive care for infants, children, and adolescents",
      icon: "👶",
    },
    {
      name: "Orthopedics",
      imageUrl: "/departments/ortho.jpg",
      description: "Expert care for bones, joints, and musculoskeletal system",
      icon: "🦴",
    },
    {
      name: "Cardiology",
      imageUrl: "/departments/cardio.jpg",
      description: "Advanced heart care and cardiovascular treatments",
      icon: "❤️",
    },
    {
      name: "Neurology",
      imageUrl: "/departments/neuro.jpg",
      description: "Specialized care for brain and nervous system disorders",
      icon: "🧠",
    },
    {
      name: "Oncology",
      imageUrl: "/departments/onco.jpg",
      description: "Comprehensive cancer care and treatment solutions",
      icon: "🎗️",
    },
    {
      name: "Radiology",
      imageUrl: "/departments/radio.jpg",
      description: "Advanced imaging and diagnostic services",
      icon: "📷",
    },
    {
      name: "Physical Therapy",
      imageUrl: "/departments/therapy.jpg",
      description: "Rehabilitation and mobility enhancement services",
      icon: "💪",
    },
    {
      name: "Dermatology",
      imageUrl: "/departments/derma.jpg",
      description: "Skin, hair, and nail care with latest treatments",
      icon: "✨",
    },
    {
      name: "ENT",
      imageUrl: "/departments/ent.jpg",
      description: "Ear, nose, and throat specialized medical care",
      icon: "👂",
    },
  ];

  const responsive = {
    extraLarge: {
      breakpoint: { max: 3000, min: 1324 },
      items: 4,
      slidesToSlide: 1,
    },
    large: {
      breakpoint: { max: 1324, min: 1005 },
      items: 3,
      slidesToSlide: 1,
    },
    medium: {
      breakpoint: { max: 1005, min: 700 },
      items: 2,
      slidesToSlide: 1,
    },
    small: {
      breakpoint: { max: 700, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  const CustomDot = ({ onClick, ...rest }) => {
    const { active } = rest;
    return (
      <button
        className={`custom-dot ${active ? "active" : ""}`}
        onClick={() => onClick()}
      />
    );
  };

  return (
    <section className="departments-section">
      <div className="departments-container">
        <div className="departments-header">
          <div className="section-badge">Specialties</div>
          <h2 className="section-title">Our Medical Departments</h2>
          <p className="section-subtitle">
            Expert care across all major medical specialties with state-of-the-art facilities 
            and renowned healthcare professionals
          </p>
        </div>

        <div className="carousel-wrapper">
          <Carousel
            responsive={responsive}
            swipeable={true}
            draggable={true}
            showDots={true}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={4000}
            keyBoardControl={true}
            customDot={<CustomDot />}
            removeArrowOnDeviceType={["small"]}
            itemClass="carousel-item"
            containerClass="departments-carousel"
            dotListClass="custom-dots"
          >
            {departmentsArray.map((department, index) => (
              <div className="department-card" key={index}>
                <div className="card-image-container">
                  <img 
                    src={department.imageUrl} 
                    alt={department.name}
                    className="card-image"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/300x200/667eea/white?text=${encodeURIComponent(department.name)}`;
                    }}
                  />
                  <div className="image-overlay"></div>
                  <div className="department-icon">{department.icon}</div>
                </div>
                
                <div className="card-content">
                  <h3 className="department-name">{department.name}</h3>
                  <p className="department-description">{department.description}</p>
                  
                  <div className="card-actions">
                    <button className="learn-more-btn">
                      Learn More
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    
                    <button className="book-btn">
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        <div className="departments-cta">
          <p>Can't find what you're looking for?</p>
          <button className="cta-button">
            View All Departments
            <svg className="cta-icon" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Departments;