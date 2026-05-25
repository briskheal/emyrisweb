import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function SliderDetails() {
  const { index } = useParams();
  const { siteData } = useContext(AppContext);

  if (!siteData.slides || !siteData.slides[index]) {
    return (
      <div className="page-container fade-in" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2>Slide details not found.</h2>
        <Link to="/" className="btn" style={{ marginTop: '2rem' }}>Back to Home</Link>
      </div>
    );
  }

  const slide = siteData.slides[index];

  // Lightweight Markdown/RichText Parser
  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split('\n\n').map((para, pIdx) => {
      let html = para
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^\s*-\s*(.*?)$/gm, '<li>$1</li>');
      
      if (html.includes('<li>')) {
        return (
          <ul key={pIdx} style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)', textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: html }} />
        );
      }

      return (
        <p key={pIdx} style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)', textAlign: 'justify', marginBottom: '1.5rem' }} dangerouslySetInnerHTML={{ __html: html }} />
      );
    });
  };

  return (
    <div className="page-container fade-in" style={{ marginTop: '2rem' }}>
      
      {/* Back link */}
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 'bold' }}>
          ← Back to Home
        </Link>
      </div>

      {/* Header Banner */}
      <div 
        className="glass" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.55)), url(${slide.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '350px',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          padding: '2rem',
          textAlign: 'center',
          marginBottom: '3rem'
        }}
      >
        <h3 style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800', marginBottom: '1rem' }}>
          {siteData.companyName}
        </h3>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', margin: 0 }}>
          {slide.title}
        </h1>
      </div>

      {/* Content Section */}
      <div className="glass" style={{ padding: '3.5rem', maxWidth: '850px', margin: '0 auto' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem' }}>
          Our Commitment & Vision
        </h2>
        
        {/* Dynamic Justified Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--text-light)', fontWeight: '500', textAlign: 'justify', marginBottom: '1.5rem' }}>
            {slide.subtitle}
          </p>
          {slide.details ? (
            // Detect if the content is HTML or Markdown
            /<[a-z][\s\S]*>/i.test(slide.details) ? (
              <div 
                className="wysiwyg-content" 
                dangerouslySetInnerHTML={{ __html: slide.details }} 
              />
            ) : (
              renderMarkdown(slide.details)
            )
          ) : (
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)', textAlign: 'justify' }}>
              We are dedicated to maintaining the highest clinical standards in delivering this commitment. Emyris Biolifesciences works alongside doctors, medical boards, and regional pharmacies to ensure all health formulations adhere strictly to public safety, efficacy, and bio-equivalence criteria. Detailed reports, scientific dossiers, and regulatory approvals relating to this operational pillar are available for medical practitioners upon request.
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
          <Link to="/" className="btn-outline" style={{ textDecoration: 'none' }}>
            ← Back to Home
          </Link>
          <Link to="/contact" className="btn" style={{ textDecoration: 'none' }}>
            Connect with us
          </Link>
        </div>

      </div>

    </div>
  );
}

export default SliderDetails;
