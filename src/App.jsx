import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import Discover from './pages/Discover';
import DiscoverSubpage from './pages/DiscoverSubpage';
import Services from './pages/Services';
import Offerings from './pages/Offerings';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Blog from './pages/Blog';
import BlogSubpage from './pages/BlogSubpage';
import ServiceSubpage from './pages/ServiceSubpage';
import OfferingSubpage from './pages/OfferingSubpage';
import Career from './pages/Career';
import SliderDetails from './pages/SliderDetails';
import Footer from './components/Footer';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Disclaimer from './pages/Disclaimer';

function Home() {
  const { siteData } = useContext(AppContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [birthdayPerson, setBirthdayPerson] = useState(null);

  useEffect(() => {
    // Check for birthdays
    const dismissed = sessionStorage.getItem('birthdaySeen');
    if (!dismissed && siteData) {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const todayStr = `${dd}-${mm}`;

      const allPeople = [
        ...(siteData.advisors || []),
        ...(siteData.doctors || []),
        ...(siteData.enhancers || [])
      ];
      
      const bdayPerson = allPeople.find(p => {
        if (!p.dob) return false;
        const match = p.dob.match(/(\d+)[^\d]+(\d+)/);
        if (match) {
          const d = String(parseInt(match[1])).padStart(2, '0');
          const m = String(parseInt(match[2])).padStart(2, '0');
          return `${d}-${m}` === todayStr;
        }
        return false;
      });
      if (bdayPerson) {
        setBirthdayPerson(bdayPerson);
      }
    }
  }, [siteData]);

  const dismissBirthday = () => {
    sessionStorage.setItem('birthdaySeen', 'true');
    setBirthdayPerson(null);
  };

  useEffect(() => {
    if (!siteData.slides || siteData.slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % siteData.slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [siteData.slides]);

  if (!siteData.slides || siteData.slides.length === 0) {
    return <div className="hero slider"><div className="slider-overlay"><div className="slider-card"><h1>Loading...</h1></div></div></div>;
  }

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? siteData.slides.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % siteData.slides.length);
  };

  const getSlug = (title) => {
    return title.toLowerCase().replace(/ /g, '-').replace(/[()]/g, '');
  };

  const getYoutubeId = (url) => {
    if (!url) return 'ysz5S6PUM-U';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : (url.length === 11 ? url : 'ysz5S6PUM-U');
  };

  const slide = siteData.slides[currentSlide];

  return (
    <div className="homepage-wrapper fade-in">
      {/* Birthday Greeting Modal */}
      {birthdayPerson && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 999, /* Under the header */
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass fade-in" style={{
            width: '100%', maxWidth: '380px', aspectRatio: '1/1',
            background: 'linear-gradient(135deg, rgba(82, 203, 203, 0.95), rgba(14, 165, 233, 0.95))',
            borderRadius: '24px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            textAlign: 'center', padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '2px solid rgba(255,255,255,0.4)',
            color: 'white'
          }} onClick={(e) => e.stopPropagation()}>
            <button onClick={dismissBirthday} style={{
              position: 'absolute', top: '15px', right: '15px',
              background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white',
              width: '30px', height: '30px', borderRadius: '50%',
              cursor: 'pointer', fontWeight: 'bold'
            }}>✕</button>
            <img src={birthdayPerson.image} alt={birthdayPerson.name} style={{
              width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover',
              border: '4px solid white', marginBottom: '1rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }} />
            <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', fontFamily: "'Outfit', sans-serif" }}>Happy Birthday!</h2>
            <h3 style={{ margin: '0.5rem 0', fontSize: '1.4rem', color: '#ffefcc' }}>{birthdayPerson.name}</h3>
            <p style={{ margin: 0, fontSize: '1.05rem', opacity: 0.9 }}>Wishing you a wonderful day from the Emyris team!</p>
          </div>
        </div>
      )}

      {/* Hero Slider */}
      <div className="hero slider" style={{ backgroundImage: `url(${slide.image})` }}>
        <div className="slider-overlay">
          {/* Navigation Arrows */}
          <button className="slider-arrow prev" onClick={handlePrev} aria-label="Previous Slide">‹</button>
          <button className="slider-arrow next" onClick={handleNext} aria-label="Next Slide">›</button>

          <div className="slider-card fade-in">
            <h1 key={`title-${currentSlide}`}>{slide.title}</h1>
            <p key={`subtitle-${currentSlide}`}>{slide.subtitle}</p>
            <Link to={`/slider-details/${currentSlide}`} className="btn">More Details</Link>
          </div>
          <div className="slider-dots">
            {siteData.slides.map((_, idx) => (
              <span 
                key={idx} 
                className={`dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
              ></span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Counter Section — Dark Navy Premium */}
      <section className="stats-section stats-section-dark">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">5+</div>
            <div className="stat-label">Years of Excellence</div>
            <div className="stat-desc">Serving high-quality medical formulations across India</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">100%</div>
            <div className="stat-label">WHO-GMP Compliant</div>
            <div className="stat-desc">Batches manufactured in clean, certified sterile blocks</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Emergency Helpline</div>
            <div className="stat-desc">Priority channels for urgent ICU drug dispatch</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Patients Impacted</div>
            <div className="stat-desc">Providing affordable, life-saving therapies daily</div>
          </div>
        </div>
      </section>

      {/* About Teaser Section — Light Blue Clinical */}
      <section className="about-teaser-section about-teaser-light">
        <div className="about-teaser-grid">
          <div className="about-teaser-image-wrapper float-effect">
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80" 
              alt="Emyris Innovation R&D" 
            />
            <div className="about-image-overlay">
              <strong style={{ color: 'var(--primary)', display: 'block', fontSize: '1.1rem', marginBottom: '0.2rem' }}>Pioneering Medical Care</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Guided by elite medical & regulatory advisors.</span>
            </div>
          </div>
          <div>
            <span className="section-subtitle">WHO WE ARE</span>
            <h2 className="section-main-title" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              Redefining Healthcare Through <span style={{ color: 'var(--secondary)' }}>Innovation & Access</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.2rem', fontSize: '1.05rem', lineHeight: '1.7', textAlign: 'justify' }}>
              At {siteData.companyName || 'EMYRIS BIOLIFESCIENCES'}, we bridge the gap between advanced pharmaceutical R&D and affordable patient care. As one of India's fastest-growing healthcare companies, we specialize in high-efficacy anti-infectives, cytotoxic oncology formulations, enteral clinical nutrition, and critical anesthetics.
            </p>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.05rem', lineHeight: '1.7', textAlign: 'justify' }}>
              Our operations combine clinical science with logistical precision, ensuring that critical drugs reach ICU wards and local pharmacies when every minute matters. We believe in doing business correctly, ethically, and responsibly.
            </p>
            <Link to="/discover" className="btn">Learn More About Us</Link>
          </div>
        </div>
      </section>

      {/* Corporate Video Section — Sleek Light Glass */}
      <section className="video-section video-section-light" style={{ padding: '6rem 5%' }}>
        <div className="home-showcase-container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">CORPORATE VIDEO</span>
            <h2 className="section-main-title">Watch Emyris in Action</h2>
          </div>
          <div className="glass" style={{ 
            maxWidth: '900px', 
            margin: '0 auto', 
            padding: '1.5rem', 
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
            background: 'rgba(255, 255, 255, 0.6)'
          }}>
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%', /* 16:9 Aspect Ratio */
              height: 0,
              overflow: 'hidden',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <iframe
                title="Emyris Corporate Video"
                src={`https://www.youtube.com/embed/${getYoutubeId(siteData.youtubeVideoId)}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Offerings Showcase Section — Crisp White */}
      <section className="home-showcase-section home-showcase-white">
        <div className="home-showcase-container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">OUR PORTFOLIO</span>
            <h2 className="section-main-title">Pioneering Product Offerings</h2>
          </div>
          <div className="offerings-grid">
            {(siteData.offerings || []).map((off, idx) => (
              <div 
                key={idx} 
                className="home-offering-card glass" 
                style={{ borderTop: `4px solid ${off.color ? off.color.replace('0.2', '1') : 'var(--primary)'}` }}
              >
                <h3 style={{ color: 'var(--primary)', marginBottom: '0.8rem', fontSize: '1.4rem', fontWeight: '800' }}>
                  {off.title}
                </h3>
                <p style={{ 
                  color: 'var(--text-muted)', 
                  marginBottom: '1.5rem', 
                  flexGrow: 1, 
                  fontSize: '0.95rem', 
                  lineHeight: '1.6',
                  display: '-webkit-box',
                  WebkitLineClamp: 6,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {off.desc}
                </p>
                <Link 
                  to={`/offerings/${getSlug(off.title)}`} 
                  className="btn-outline" 
                  style={{ textDecoration: 'none', textAlign: 'center', width: 'fit-content' }}
                >
                  Read More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid Section — Clinical Blue */}
      <section className="services-bg-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="section-title-wrapper">
          <span className="section-subtitle">SERVICES & CARE</span>
          <h2 className="section-main-title">Bridging Clinical Channels</h2>
        </div>
        <div className="services-grid">
          {(siteData.services || []).map((svc, idx) => (
            <div key={idx} className="service-card premium-glass">
              <div className="service-icon-wrapper">
                {svc.icon}
              </div>
              <h3 className="service-title">
                {svc.title}
              </h3>
              <p className="service-desc">
                {svc.desc}
              </p>
              <div className="service-hover-arrow">→</div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Testimonials Section — Premium Light Glass */}
      <section className="testimonials-light-section">
        <div className="home-showcase-container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">TESTIMONIALS</span>
            <h2 className="section-main-title">What Others Are Saying</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.8rem', fontSize: '1.05rem', textAlign: 'center' }}>
              Hear from satisfied customers, healthcare professionals, and partners about their experiences with our pharmaceutical solutions.
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
            marginTop: '1.5rem'
          }}>
            {(siteData.testimonials || []).map((t, idx) => (
              <div key={t.id || idx} className="glass testimonial-card" style={{
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#ffffff',
                border: '1px solid rgba(82, 203, 203, 0.05)',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                transition: 'var(--transition)'
              }}>
                <div>
                  <div style={{ color: 'var(--secondary)', fontSize: '2.5rem', lineHeight: '1', marginBottom: '1rem' }}>“</div>
                  <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '1rem',
                    lineHeight: '1.7',
                    fontStyle: 'italic',
                    textAlign: 'justify',
                    marginBottom: '1.5rem'
                  }}>
                    {t.quote}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--glass-border)', paddingTop: '1.2rem' }}>
                  <div style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.05rem', margin: 0 }}>{t.name}</h4>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block' }}>{t.role}, {t.company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logistic Partners Section — Soft Blue Tint */}
      <section className="partners-section-bg">
        <div className="home-showcase-container">
          <div className="section-title-wrapper" style={{ marginBottom: '2.5rem' }}>
            <span className="section-subtitle">DISTRIBUTION INTEGRITY</span>
            <h2 className="section-main-title">Our Logistic Partners</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.8rem', fontSize: '1.05rem', textAlign: 'center' }}>
              We collaborate with premier cold-chain and medical shipping providers to ensure safe, stable delivery nationwide.
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {(siteData.logisticPartners || []).map((partner, idx) => (
              <div key={partner.id || idx} className="glass partner-logo-card" style={{
                padding: '1.8rem 1.5rem',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px dashed var(--glass-border)',
                borderRadius: '16px',
                transition: 'var(--transition)',
                cursor: 'default'
              }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>{partner.icon}</span>
                <strong style={{ color: 'var(--primary)', display: 'block', fontSize: '1rem', fontWeight: '800' }}>
                  {partner.name}
                </strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginTop: '0.25rem' }}>
                  {partner.scope}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Helpline & CTA Banner */}
      <section className="cta-banner-section">
        <div className="cta-banner">
          <div className="cta-banner-bg-glow"></div>
          <div className="cta-banner-content">
            <h2>Partnering for a Healthier Society</h2>
            <p>
              Whether you are a healthcare practitioner looking for emergency medicine stocks or an ambitious professional seeking career opportunities, {siteData.companyName} is ready to coordinate.
            </p>
          </div>
          <div className="cta-banner-action">
            <div className="cta-phone-badge">
              <span>📞</span>
              <span>Despatch Helpline: {siteData.contactNumber}</span>
            </div>
            <Link to="/contact" className="btn-white">Get in Touch</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function App() {
  const { siteData } = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (menuName) => {
    setOpenDropdown(prev => prev === menuName ? null : menuName);
  };

  const navStyle = {
    backgroundColor: siteData.headerColor || '#002345',
    color: siteData.headerTextColor || '#ffffff',
    borderBottom: '3px solid #52cbcb',
    boxShadow: '0 4px 24px rgba(0, 35, 69, 0.45)',
    transition: 'var(--transition)'
  };

  const linkStyle = {
    color: siteData.headerTextColor || '#ffffff'
  };

  return (
    <Router>
      <ScrollToTop />
      <nav className="navbar" style={navStyle}>
        <Link to="/" className="logo" style={linkStyle} onClick={closeMenu}>
          <img src={siteData.logo || '/images/assets/logo.png'} alt="Emyris Logo" width="210" style={{ height: 'auto', objectFit: 'contain' }} />
        </Link>

        {/* Desktop Nav Links */}
        <div className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
          {/* Mobile header inside drawer */}
          <div className="mobile-nav-header">
            <img src={siteData.logo || '/images/assets/logo.png'} alt="Emyris Logo" width="160" style={{ height: 'auto', objectFit: 'contain' }} />
            <button className="mobile-close-btn" onClick={closeMenu} aria-label="Close menu">✕</button>
          </div>

          <Link to="/" style={linkStyle} onClick={closeMenu}>Home</Link>
          
          <div className={`dropdown ${openDropdown === 'discover' ? 'open' : ''}`}>
            <span className="dropbtn" style={{ ...linkStyle, cursor: 'pointer' }} onClick={() => toggleDropdown('discover')}>Discover ▾</span>
            <div className="dropdown-content">
              <Link to="/discover" onClick={closeMenu}>About Us</Link>
              <Link to="/discover/advisors" onClick={closeMenu}>Our Advisors</Link>
              <Link to="/discover/doctors" onClick={closeMenu}>Our Doctors</Link>
              <Link to="/discover/enhancers" onClick={closeMenu}>Business Enhancers</Link>
              <Link to="/discover/presence" onClick={closeMenu}>Business Presence</Link>
              <Link to="/discover/faq" onClick={closeMenu}>FAQs</Link>
            </div>
          </div>
          
          <div className={`dropdown ${openDropdown === 'offerings' ? 'open' : ''}`}>
            <span className="dropbtn" style={{ ...linkStyle, cursor: 'pointer' }} onClick={() => toggleDropdown('offerings')}>Offerings ▾</span>
            <div className="dropdown-content">
              <Link to="/offerings/anti-infective" onClick={closeMenu}>Anti-Infective</Link>
              <Link to="/offerings/oncology" onClick={closeMenu}>Oncology</Link>
              <Link to="/offerings/enteral-nutrition" onClick={closeMenu}>Enteral Nutrition</Link>
              <Link to="/offerings/nutraceuticals" onClick={closeMenu}>Nutraceuticals</Link>
              <Link to="/offerings/anasthetics" onClick={closeMenu}>Anasthetics</Link>
              <Link to="/offerings/hiv" onClick={closeMenu}>HIV</Link>
            </div>
          </div>
          
          <div className={`dropdown ${openDropdown === 'services' ? 'open' : ''}`}>
            <span className="dropbtn" style={{ ...linkStyle, cursor: 'pointer' }} onClick={() => toggleDropdown('services')}>Services ▾</span>
            <div className="dropdown-content">
              <Link to="/services/second-opinion" onClick={closeMenu}>Second Opinion</Link>
              <Link to="/services/diagnostic-support" onClick={closeMenu}>Diagnostic Support</Link>
              <Link to="/services/hospital-connect" onClick={closeMenu}>Hospital Connect</Link>
              <Link to="/services/train-the-future" onClick={closeMenu}>Train the Future</Link>
            </div>
          </div>

          <Link to="/career" style={linkStyle} onClick={closeMenu}>Career</Link>
          <Link to="/blog" style={linkStyle} onClick={closeMenu}>Blog</Link>
          <Link to="/contact" style={linkStyle} onClick={closeMenu}>Contact Us</Link>

          {/* Mobile contact info inside drawer */}
          <div className="mobile-nav-contact">
            <div style={{ fontSize: '0.8rem', color: '#52cbcb', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>📞 Call 24×7</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff' }}><a href={`tel:${siteData.contactNumber || '+917993163300'}`} style={{ color: 'inherit', textDecoration: 'none' }}>{siteData.contactNumber || '+91 7993163300'}</a></div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', marginTop: '0.15rem' }}><a href={`mailto:${siteData.email || 'contact@emyrisbio.com'}`} style={{ color: 'inherit', textDecoration: 'none' }}>{siteData.email || 'contact@emyrisbio.com'}</a></div>
          </div>
        </div>

        {/* Mobile Menu Overlay Backdrop */}
        {menuOpen && <div className="mobile-nav-backdrop" onClick={closeMenu} aria-hidden="true" />}

        {/* Right-side 24x7 Contact Widget — Desktop only */}
        <div className="header-contact-widget">
          <div className="header-contact-label">📞 Call 24×7</div>
          <div className="header-contact-phone"><a href={`tel:${siteData.contactNumber || '+917993163300'}`} style={{ color: 'inherit', textDecoration: 'none' }}>{siteData.contactNumber || '+91 7993163300'}</a></div>
          <div className="header-contact-email"><a href={`mailto:${siteData.email || 'contact@emyrisbio.com'}`} style={{ color: 'inherit', textDecoration: 'none' }}>{siteData.email || 'contact@emyrisbio.com'}</a></div>
        </div>

        {/* Hamburger Button — Mobile only */}
        <button
          className={`hamburger-btn ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/discover/:pageId" element={<DiscoverSubpage />} />
        <Route path="/offerings" element={<Navigate to="/offerings/anti-infective" replace />} />
        <Route path="/offerings/:pageId" element={<OfferingSubpage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:pageId" element={<ServiceSubpage />} />
        <Route path="/career" element={<Career />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:blogSlug" element={<BlogSubpage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/slider-details/:index" element={<SliderDetails />} />
        <Route path="/terms-and-conditions" element={<Terms />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
