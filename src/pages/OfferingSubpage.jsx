import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import './ServiceSubpage.css'; // Import the same CSS for identical banner styles

const OfferingSubpage = () => {
  const { pageId } = useParams();
  const { siteData } = useContext(AppContext);

  // Find the offering by slug
  const offering = (siteData.offerings || []).find(o => o.slug === pageId);

  if (!offering) {
    return (
      <div className="page-container fade-in" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <h2>Offering Not Found</h2>
        <p>The offering you are looking for does not exist or has been removed.</p>
        <Link to="/offerings" className="btn">Return to Offerings</Link>
      </div>
    );
  }

  return (
    <div className="offering-page fade-in service-subpage">
      {/* Dynamic Hero Banner matching Services Page Width & Style */}
      <div className="service-banner" style={{ backgroundImage: `url('${offering.image}')` }}>
        <div className="service-banner-overlay">
          <h1>{offering.title}</h1>
          <p>{offering.tagline}</p>
        </div>
      </div>

      <div className="service-container">
        {/* Intro Paragraphs */}
        <div className="service-text" style={{ marginBottom: '3rem' }}>
          <h3 className="section-subtitle">OUR OFFERINGS</h3>
          <h2 className="section-main-title">EMYRIS BIOLIFESCIENCES <span>{offering.title}</span></h2>
          <div style={{ marginTop: '2rem' }}>
            {(offering.desc || []).map((paragraph, idx) => (
              <p key={idx}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Products Table Box */}
        <div className="products-container" style={{ 
          background: '#ffffff', 
          borderRadius: '20px', 
          boxShadow: '0 15px 50px rgba(0,0,0,0.08)',
          border: '1px solid rgba(29, 78, 216, 0.05)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            background: offering.accentColor || 'var(--primary)', 
            padding: '2rem', 
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.2rem' }}>Product Portfolio</h3>
              <span style={{ fontSize: '0.95rem', opacity: 0.9 }}>Browse our extensive range of specialized formulations.</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 20px', borderRadius: '50px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(5px)' }}>
              <span>↕</span> Scroll for more
            </div>
          </div>

          <div className="table-header" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 2fr 1.5fr', 
            padding: '1.2rem 2rem', 
            background: '#f1f5f9',
            borderBottom: '2px solid #e2e8f0',
            fontWeight: '800',
            color: 'var(--primary)',
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            <div>Therapy</div>
            <div>Generic Name</div>
            <div>Our Molecule Name</div>
          </div>

          <div className="table-body" style={{ 
            maxHeight: '450px', 
            overflowY: 'auto',
            padding: '0',
            scrollBehavior: 'smooth'
          }}>
            {offering.products && offering.products.length > 0 ? (
              offering.products.map((prod, idx) => (
                <div key={idx} className="table-row" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 2fr 1.5fr', 
                  padding: '1.2rem 2rem', 
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background 0.2s ease',
                  cursor: 'default',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '1.05rem' }}>
                    <span style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(29,78,216,0.05)', borderRadius: '6px' }}>
                      {prod.therapy}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-dark)', fontSize: '1.05rem', fontWeight: '500' }}>{prod.genericName}</div>
                  <div style={{ color: offering.accentColor || 'var(--secondary)', fontWeight: '800', fontSize: '1.1rem' }}>
                    {prod.moleculeName || <span style={{ opacity: 0.5, fontStyle: 'italic', fontWeight: 'normal' }}>TBA</span>}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                No products are currently listed in this category. They will appear here once added from the admin panel.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferingSubpage;
