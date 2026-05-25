import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

function Services() {
  const { siteData } = useContext(AppContext);
  const { services } = siteData;

  return (
    <div className="page-container fade-in">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h3 style={{ color: 'var(--primary)' }}>Our Services</h3>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>We Provide Assistance In <br /> Various Directions</h1>
        <p style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-muted)' }}>
          EMYRIS BIOLIFESCIENCES, where excellence in healthcare is not just a commitment but a way of life. We take pride in offering a comprehensive range of services tailored to meet the diverse needs of our valued customers and partners in the healthcare industry.
        </p>
      </div>

      <div className="services-grid">
        {services.map((svc, idx) => (
          <div key={idx} className="service-card glass">
            <div className="service-icon">{svc.icon}</div>
            <h3>{svc.title}</h3>
            <p>{svc.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
