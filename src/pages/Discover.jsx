import React, { useState } from 'react';

function Discover() {
  const [activeToggle, setActiveToggle] = useState('mission');

  const toggles = {
    mission: {
      title: 'Our Mission',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
      text: 'Our mission at EMYRIS BIOLIFESCIENCES is to discover, develop, and market pharmaceutical products that prevent, diagnose, alleviate, and cure diseases. We strive for total customer satisfaction and global leadership through technological excellence, world-class research, and ethical business practices, all while being responsible corporate citizens.'
    },
    vision: {
      title: 'Our Vision',
      image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800&q=80',
      text: 'Our vision at EMYRIS BIOLIFESCIENCES is to emerge as a leading pharmaceutical company in India and establish a significant global presence. We aim to achieve this by delivering high-quality, affordable, and innovative solutions in medicine and treatment. Through our commitment to excellence and innovation, we aspire to make a positive impact on healthcare outcomes both locally and globally.'
    },
    strategies: {
      title: 'Our Strategies',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      text: 'Our strategy at EMYRIS BIOLIFESCIENCES is to engage healthcare practitioners and promote the message of affordable care. Through targeted outreach programs and educational initiatives, we aim to inform and empower healthcare professionals about our affordable healthcare solutions, fostering better patient outcomes and access to quality care.'
    },
    values: {
      title: 'Our Core Values',
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
      text: 'Being a care-focused, research-driven company, we are committed to complying with the highest ethical standard in clinical research and medical practice. We want to be valued not only for our pharmaceutical products but also for the way we conduct our research and business activities.'
    }
  };

  return (
    <div className="fade-in" style={{ marginTop: '0' }}>
      {/* Banner */}
      <div 
        className="glass" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.6)), url('/images/assets/discover-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '250px',
          borderRadius: '0 0 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          padding: '2rem',
          textAlign: 'center',
          marginBottom: '3rem'
        }}
      >
        <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: 0 }}>About Us</h1>
        <p style={{ color: 'var(--secondary)', fontWeight: '600', marginTop: '0.5rem', fontSize: '1.1rem' }}>Discover / About Us</p>
      </div>

      <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Experience & WHAT WE DO section */}
        <div className="discover-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          
          {/* Experience card */}
          <div className="glass" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(135deg, rgba(82, 203, 203, 0.05), rgba(14, 165, 233, 0.05))', border: '1px solid rgba(82, 203, 203, 0.15)', borderRadius: '24px' }}>
            <span style={{ fontSize: '6rem', fontWeight: '800', color: 'var(--primary)', lineHeight: '1' }}>5+</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-light)', marginTop: '0.5rem', display: 'block' }}>Years of Experience</span>
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Delivering affordable and high-quality healthcare formulations in India.</span>
          </div>

          {/* WHAT WE DO Details */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ color: 'var(--primary)', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>WHAT WE DO</h3>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-light)', lineHeight: '1.2' }}>
              We Have 5 Years <span style={{ color: 'var(--secondary)' }}>Experience</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-light)', fontWeight: '500', textAlign: 'justify' }}>
                EMYRIS BIOLIFESCIENCES, a leading pharmaceutical company in India dedicated to developing affordable medicines for patients nationwide. Our innovation-driven approach ensures the health and well-being of people across the country, making a profound impact on real lives.
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-muted)', textAlign: 'justify' }}>
                As a care-focused, research-driven company, we uphold the highest ethical standards in clinical research and medical practice. We strive to be valued not only for our pharmaceutical products but also for our ethical business conduct.
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-muted)', textAlign: 'justify' }}>
                At EMYRIS BIOLIFESCIENCES, we lead the industry by integrating cutting-edge research with ethical business practices to produce optimal health outcomes for all. Join us as we continue our journey to provide accessible and innovative healthcare solutions for a healthier society.
              </p>
            </div>
          </div>

        </div>

        {/* Accordion Toggles */}
        <div className="glass discover-toggles-container" style={{ padding: '3rem', borderRadius: '24px', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', textAlign: 'center' }}>
            Our Strategic Vision & Core Values
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Toggle tabs */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {Object.keys(toggles).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveToggle(key)}
                  className={`btn${activeToggle === key ? '' : '-outline'}`}
                  style={{ 
                    padding: '12px 24px', 
                    borderRadius: '12px', 
                    fontSize: '1rem', 
                    fontWeight: '700',
                    cursor: 'pointer',
                    minWidth: '150px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {toggles[key].title}
                </button>
              ))}
            </div>

            {/* Toggle Content Box */}
            <div 
              className="glass discover-toggle-content" 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '2.5rem', 
                padding: '2.5rem', 
                background: 'rgba(255, 255, 255, 0.4)', 
                borderRadius: '16px', 
                marginTop: '1rem',
                alignItems: 'center'
              }}
            >
              <img 
                src={toggles[activeToggle].image} 
                alt={toggles[activeToggle].title} 
                style={{ 
                  width: '100%', 
                  maxHeight: '260px', 
                  objectFit: 'cover', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                }} 
              />
              <div>
                <h3 style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>
                  {toggles[activeToggle].title}
                </h3>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)', textAlign: 'justify', margin: 0 }}>
                  {toggles[activeToggle].text}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Discover;
