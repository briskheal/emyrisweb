import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Footer() {
  const { siteData } = useContext(AppContext);

  const footerStyle = {
    backgroundColor: siteData.footerColor || '#0f172a',
    color: siteData.footerTextColor || '#ffffff',
    padding: '2.5rem 5% 1.2rem 5%',
    marginTop: '0',
    borderTop: '1px solid var(--glass-border)',
    transition: 'var(--transition)'
  };

  const textMutedStyle = {
    color: siteData.footerTextColor === '#ffffff' ? '#cbd5e1' : 'var(--text-muted)',
    fontSize: '0.95rem',
    marginBottom: '1rem'
  };

  const linkStyle = {
    color: siteData.footerTextColor || '#ffffff',
    textDecoration: 'none',
    transition: 'var(--transition)',
    fontSize: '0.95rem'
  };

  const headerStyle = {
    color: siteData.footerTextColor || '#ffffff',
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    position: 'relative',
    paddingBottom: '0.5rem'
  };

  const getSlug = (title) => title.toLowerCase().replace(/ /g, '-').replace(/[()]/g, '');

  return (
    <footer style={footerStyle}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
        marginBottom: '1.5rem'
      }}>
        
        {/* Company Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: '1.5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src={siteData.logo || '/vite.svg'} 
              alt="Emyris Biolifesciences Logo" 
              width="140"
              style={{ height: 'auto', objectFit: 'contain' }}
            />
            <span style={{ fontWeight: '800', fontSize: '1.3rem', letterSpacing: '0.5px', display: 'none' }}>
              {siteData.companyName}
            </span>
          </div>
          <p style={textMutedStyle}>
            A leading pharmaceutical company dedicated to providing innovative healthcare solutions. Our commitment to quality, affordability, and patient care drives us forward.
          </p>
          {siteData.socialLinks && (
            <div style={{ display: 'flex', gap: '1.2rem', marginTop: '0.8rem', alignItems: 'center' }}>
              {siteData.socialLinks.facebook && (
                <a 
                  href={siteData.socialLinks.facebook} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center', transition: 'var(--transition)' }}
                  aria-label="Facebook"
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--secondary)'}
                  onMouseOut={(e) => e.currentTarget.style.color = siteData.footerTextColor}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {siteData.socialLinks.twitter && (
                <a 
                  href={siteData.socialLinks.twitter} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center', transition: 'var(--transition)' }}
                  aria-label="Twitter / X"
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--secondary)'}
                  onMouseOut={(e) => e.currentTarget.style.color = siteData.footerTextColor}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
              {siteData.socialLinks.instagram && (
                <a 
                  href={siteData.socialLinks.instagram} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center', transition: 'var(--transition)' }}
                  aria-label="Instagram"
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--secondary)'}
                  onMouseOut={(e) => e.currentTarget.style.color = siteData.footerTextColor}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </a>
              )}
              {siteData.socialLinks.linkedin && (
                <a 
                  href={siteData.socialLinks.linkedin} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center', transition: 'var(--transition)' }}
                  aria-label="LinkedIn"
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--secondary)'}
                  onMouseOut={(e) => e.currentTarget.style.color = siteData.footerTextColor}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}
              {siteData.socialLinks.youtube && (
                <a
                  href={siteData.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center', transition: 'var(--transition)' }}
                  aria-label="YouTube"
                  onMouseOver={(e) => e.currentTarget.style.color = '#ff0000'}
                  onMouseOut={(e) => e.currentTarget.style.color = siteData.footerTextColor}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
                    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                  </svg>
                </a>
              )}
              {siteData.socialLinks.whatsapp && (
                <a
                  href={`https://wa.me/${siteData.socialLinks.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center', transition: 'var(--transition)' }}
                  aria-label="WhatsApp"
                  onMouseOver={(e) => e.currentTarget.style.color = '#25d366'}
                  onMouseOut={(e) => e.currentTarget.style.color = siteData.footerTextColor}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                </a>
              )}
            </div>
          )}

        </div>

        {/* Quick Links */}
        <div>
          <h4 style={headerStyle}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: 0 }}>
            <li><Link to="/" style={linkStyle} onMouseOver={(e) => e.target.style.paddingLeft = '5px'} onMouseOut={(e) => e.target.style.paddingLeft = '0'}>Home</Link></li>
            <li><Link to="/discover" style={linkStyle} onMouseOver={(e) => e.target.style.paddingLeft = '5px'} onMouseOut={(e) => e.target.style.paddingLeft = '0'}>About Us</Link></li>
            <li><Link to="/career" style={linkStyle} onMouseOver={(e) => e.target.style.paddingLeft = '5px'} onMouseOut={(e) => e.target.style.paddingLeft = '0'}>Careers</Link></li>
            <li><a href="https://emyrishr.in" target="_blank" rel="noopener noreferrer" style={{ ...linkStyle, color: 'var(--secondary)', fontWeight: '700' }} onMouseOver={(e) => e.target.style.paddingLeft = '5px'} onMouseOut={(e) => e.target.style.paddingLeft = '0'}>Employee Onboarding Portal ↗</a></li>
            <li><Link to="/terms-and-conditions" target="_blank" rel="noreferrer" style={linkStyle} onMouseOver={(e) => e.target.style.paddingLeft = '5px'} onMouseOut={(e) => e.target.style.paddingLeft = '0'}>Terms & Conditions</Link></li>
            <li><Link to="/privacy-policy" target="_blank" rel="noreferrer" style={linkStyle} onMouseOver={(e) => e.target.style.paddingLeft = '5px'} onMouseOut={(e) => e.target.style.paddingLeft = '0'}>Privacy Policy</Link></li>
            <li><Link to="/disclaimer" target="_blank" rel="noreferrer" style={linkStyle} onMouseOver={(e) => e.target.style.paddingLeft = '5px'} onMouseOut={(e) => e.target.style.paddingLeft = '0'}>Disclaimer</Link></li>
          </ul>
        </div>

        {/* Hours Widget */}
        <div>
          <h4 style={headerStyle}>Office Hours</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: 0 }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span>Mon – Sat:</span>
              <span>09:00 AM – 06:00 PM</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span>Sunday:</span>
              <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Emergency Only</span>
            </li>
          </ul>
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.9rem', display: 'block' }}>📞 24/7 Helpline:</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}><a href={`tel:${siteData.contactNumber}`} style={{ color: 'inherit', textDecoration: 'none' }}>{siteData.contactNumber}</a></span>
          </div>
        </div>

        {/* Contact info / Address */}
        <div>
          <h4 style={headerStyle}>Contact Office</h4>
          <p style={{ ...textMutedStyle, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span>📍</span>
            <span>{siteData.address}</span>
          </p>
          <p style={{ ...textMutedStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📞</span>
            <span>Toll-Free: <a href={`tel:${siteData.tollFree}`} style={{ color: 'inherit', textDecoration: 'none' }}>{siteData.tollFree}</a></span>
          </p>
          <p style={{ ...textMutedStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>✉️</span>
            <span><a href={`mailto:${siteData.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{siteData.email}</a></span>
          </p>
        </div>

      </div>

      {/* Copyright Footer — single line */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
        fontSize: '0.82rem',
        opacity: 0.75
      }}>
        <span>Copyright &copy; {new Date().getFullYear()} {siteData.companyName}. All rights reserved.</span>
        <span style={{ fontWeight: '600', color: '#52cbcb' }}>Powered By EMYRIS IT</span>
      </div>
    </footer>
  );
}

export default Footer;
