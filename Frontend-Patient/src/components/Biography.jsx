import React from "react";

const Biography = ({ imageUrl }) => {
  return (
    <div className="container biography">
      <div className="banner">
        <img src={imageUrl} alt="About" />
      </div>

      <div className="banner">
        <p>Biography</p>
        <h3>Who We Are</h3>
        <p>
            Sri Lanka Digital Health Initiative is a national healthcare technology partnership dedicated to r
            evolutionizing patient care through innovative digital solutions. 
            As the implementing body for Sri Lanka's Unified Health Record System, 
            we bridge the gap between traditional healthcare delivery and modern digital technology.
        </p>
        <p>
            Our consortium brings together leading software engineers, healthcare professionals, 
            and system architects with expertise in developing scalable healthcare 
            platforms. We specialize in creating integrated digital health ecosystems 
            that serve both government and private hospitals across urban Sri Lanka.
        </p>
        <p>
          Our team of doctors, nurses, and support staff work collaboratively to
          provide comprehensive medical solutions.
        </p>
        <p>
          We believe in a patient-centered approach, where each individual's
          needs are addressed with attention and expertise.
        </p>
        <p>
          We are dedicated to making a positive impact on the lives of our
          patients, providing the care and support they need to achieve their
          best health.
        </p>
      </div>
    </div>
  );
};

export default Biography;
