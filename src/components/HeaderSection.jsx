import React from 'react';

const HeaderSection = ({ title, subtitle, bgImage }) => {
  return (
    <div 
      className="page-header"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '6rem 20px',
        textAlign: 'center',
        color: 'white',
        marginBottom: '2rem'
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>{title}</h1>
        {subtitle && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: '500', fontSize: '1.2rem', letterSpacing: '2px', textTransform: 'uppercase' }}>{subtitle}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderSection;
