import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Offerings() {
  const { siteData } = useContext(AppContext);
  const { offerings } = siteData;

  const getSlug = (title) => {
    return title.toLowerCase().replace(/ /g, '-').replace(/[()]/g, '');
  };

  return (
    <div className="page-container fade-in">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h3 style={{ color: 'var(--primary)' }}>Our Offerings</h3>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Pioneering Medical Solutions</h1>
        <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--text-muted)' }}>
          Explore our wide range of pharmaceutical offerings designed with precision, care, and the latest scientific advancements to tackle the world's most pressing health challenges.
        </p>
      </div>

      <div className="offerings-grid">
        {offerings.map((off, idx) => (
          <div key={idx} className="offering-card glass" style={{ borderTop: `4px solid ${off.color.replace('0.2', '1')}` }}>
            <h3>{off.title}</h3>
            <p>{off.desc}</p>
            <Link 
              to={`/offerings/${getSlug(off.title)}`} 
              className="btn-outline" 
              style={{ textDecoration: 'none', textAlign: 'center', display: 'inline-block' }}
            >
              Learn More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Offerings;
