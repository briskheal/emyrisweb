"use client";

import styles from './page.module.css';

export default function Home() {
  return (
    <>
      {/* Navbar Placeholder */}
      <header className="glass-panel" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
          <div style={{ fontWeight: 800, fontSize: '1.5rem', fontFamily: 'var(--font-outfit)' }}>
            <span className="text-gradient">EMYRIS</span> BIO
          </div>
          <nav style={{ display: 'flex', gap: '32px', fontWeight: 600 }}>
            <a href="#">Discover</a>
            <a href="#">Offerings</a>
            <a href="#">Services</a>
            <a href="#">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className="container">
          <div className={`${styles.heroContent} animate-fade-in`}>
            <h1 className={styles.heroTitle}>
              Committed to <span className="text-gradient">Innovation</span> & Society
            </h1>
            <p className={styles.heroSubtitle}>
              Emyris Biolifesciences is driving the future of healthcare. We deliver cutting-edge pharmaceutical solutions designed to improve patient care and enhance health outcomes globally.
            </p>
            <div className={styles.heroActions}>
              <button className="btn btn-primary">Explore Our Offerings</button>
              <button className="btn btn-secondary">Contact Us 24/7</button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.servicesSection}>
        <div className="container">
          <div className={`${styles.sectionHeader} animate-fade-in delay-1`}>
            <span className={styles.sectionSubtitle}>Our Services</span>
            <h2 className={styles.sectionTitle}>Comprehensive Healthcare Assistance</h2>
          </div>
          
          <div className={styles.servicesGrid}>
            <div className={`${styles.serviceCard} glass-panel animate-fade-in delay-2`}>
              <div className={styles.serviceIcon}>⚕️</div>
              <h3 className={styles.serviceTitle}>Diagnostic Support</h3>
              <p className={styles.serviceDesc}>State-of-the-art diagnostic assistance to ensure accurate and timely medical evaluations.</p>
            </div>
            
            <div className={`${styles.serviceCard} glass-panel animate-fade-in delay-2`}>
              <div className={styles.serviceIcon}>🏥</div>
              <h3 className={styles.serviceTitle}>Hospital Connect</h3>
              <p className={styles.serviceDesc}>Seamless integration and communication channels for hospitals and healthcare providers.</p>
            </div>
            
            <div className={`${styles.serviceCard} glass-panel animate-fade-in delay-2`}>
              <div className={styles.serviceIcon}>👩‍⚕️</div>
              <h3 className={styles.serviceTitle}>Second Opinion</h3>
              <p className={styles.serviceDesc}>Expert consultations to provide you with confidence and clarity on critical health decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contactSection}>
        <div className="container">
          <div className={styles.contactGrid}>
            <div className="animate-fade-in delay-1">
              <span className={styles.sectionSubtitle}>Get in Touch</span>
              <h2 className={styles.sectionTitle} style={{ marginBottom: '24px' }}>Connect Us Today!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>
                Fill out the form to ask questions, request emergency supplies, or consult with a doctor. Our team is available 24/7.
              </p>
              
              <div className="glass-panel" style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ width: '64px', height: '64px', background: 'var(--accent-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📞</div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Emergency Line</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-outfit)' }}>+91 7993163300</div>
                </div>
              </div>
            </div>
            
            <div className={`glass-panel animate-fade-in delay-2`} style={{ padding: '48px' }}>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className={styles.formGroup}>
                  <input type="text" className={styles.input} placeholder="Full Name *" required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <input type="tel" className={styles.input} placeholder="Phone Number *" required />
                  <input type="email" className={styles.input} placeholder="Email Address *" required />
                </div>
                <div className={styles.formGroup}>
                  <select className={styles.input} required defaultValue="">
                    <option value="" disabled>Select Offering</option>
                    <option value="Anti-Infective">Anti-Infective</option>
                    <option value="Oncology">Oncology</option>
                    <option value="Enteral Nutrition">Enteral Nutrition</option>
                    <option value="Nutraceuticals">Nutraceuticals</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <textarea className={`${styles.input} ${styles.textarea}`} placeholder="How can we help you? *" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer style={{ background: 'var(--primary-color)', color: 'white', padding: '40px 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ fontWeight: 800, fontSize: '1.5rem', fontFamily: 'var(--font-outfit)', marginBottom: '16px' }}>
            EMYRIS BIO
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
            &copy; {new Date().getFullYear()} Emyris Biolifesciences. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
