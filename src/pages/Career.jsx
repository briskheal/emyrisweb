import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

function Career() {
  const { siteData } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    message: ''
  });
  const [cvFile, setCvFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [activePosition, setActivePosition] = useState(null);

  const positions = [
    {
      title: 'Medical Representative (MR)',
      dept: 'Sales & Marketing',
      loc: 'Hyderabad, India',
      exp: '1-3 Years',
      type: 'Full-Time',
      icon: '💊',
      color: '#1d4ed8',
      skills: ['Communication', 'Medical Knowledge', 'CRM Tools']
    },
    {
      title: 'Research & Development Specialist',
      dept: 'R&D',
      loc: 'Secunderabad, India',
      exp: '2-5 Years',
      type: 'Full-Time',
      icon: '🔬',
      color: '#0ea5e9',
      skills: ['Formulation Chemistry', 'HPLC Testing', 'Clinical Trials']
    },
    {
      title: 'Quality Assurance Chemist',
      dept: 'Manufacturing & QA',
      loc: 'Telangana, India',
      exp: '3-6 Years',
      type: 'Full-Time',
      icon: '⚗️',
      color: '#7c3aed',
      skills: ['GMP Compliance', 'Microbiological Assay', 'Batch Analysis']
    },
    {
      title: 'Regulatory Affairs Executive',
      dept: 'Compliance',
      loc: 'Secunderabad, India',
      exp: '1-2 Years',
      type: 'Full-Time',
      icon: '📋',
      color: '#059669',
      skills: ['Drug Filing', 'CDSCO Regulations', 'Documentation']
    }
  ];

  const perks = [
    { icon: '🏥', title: 'Health Coverage', desc: 'Comprehensive medical, dental & vision insurance for you and your family.' },
    { icon: '📈', title: 'Career Growth', desc: 'Structured learning paths, mentorship programs, and internal promotions.' },
    { icon: '💰', title: 'Competitive Pay', desc: 'Above-market salaries, annual bonuses, and performance incentives.' },
    { icon: '🌍', title: 'Mission-Driven', desc: 'Work that matters — improving patient lives across India and beyond.' },
    { icon: '🎓', title: 'Education Support', desc: 'Sponsorships for pharma certifications and advanced degrees.' },
    { icon: '⚖️', title: 'Work-Life Balance', desc: 'Flexible hours, leave policies, and employee wellness programs.' },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setCvFile(file);
  };

  const handleApply = (pos) => {
    setFormData({ ...formData, position: pos.title });
    setActivePosition(pos.title);
    const el = document.getElementById('apply-form');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.position) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setError('');

    const uploadData = new FormData();
    Object.entries(formData).forEach(([k, v]) => uploadData.append(k, v));
    if (cvFile) uploadData.append('resume', cvFile);

    try {
      const res = await fetch('/api/careers', { method: 'POST', body: uploadData });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setError('');
        setFormData({ name: '', email: '', phone: '', position: '', experience: '', message: '' });
        setCvFile(null);
        setActivePosition(null);
      } else {
        setError(data.error || 'Submission failed');
      }
    } catch (err) {
      // Local fallback
      const savedApps = JSON.parse(localStorage.getItem('emyrisCareers') || '[]');
      if (cvFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          savedApps.push({ ...formData, id: Date.now(), status: 'pending', resumeFileName: cvFile.name, resumeData: reader.result.split(',')[1], createdAt: new Date().toISOString() });
          localStorage.setItem('emyrisCareers', JSON.stringify(savedApps));
          setSubmitted(true);
        };
        reader.readAsDataURL(cvFile);
      } else {
        savedApps.push({ ...formData, id: Date.now(), status: 'pending', resumeFileName: null, createdAt: new Date().toISOString() });
        localStorage.setItem('emyrisCareers', JSON.stringify(savedApps));
        setSubmitted(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in">

      {/* Career Hero Banner */}
      <section className="career-hero-section">
        <div className="career-hero-bg-glow"></div>
        <div className="career-hero-content">
          <span className="section-subtitle" style={{ color: '#52cbcb' }}>JOIN THE TEAM</span>
          <h1 className="career-hero-title">
            Shape the Future of<br />
            <span style={{ color: '#52cbcb' }}>Healthcare in India</span>
          </h1>
          <p className="career-hero-desc">
            At {siteData.companyName || 'EMYRIS BIOLIFESCIENCES'}, we are building a passionate team of scientists, marketers, and medical professionals who believe in accessible, high-quality healthcare for every patient.
          </p>
          <div className="career-hero-badges">
            <span className="career-hero-badge">🌱 4+ Open Positions</span>
            <span className="career-hero-badge">🏆 WHO-GMP Certified Workplace</span>
            <span className="career-hero-badge">📍 Hyderabad & Secunderabad</span>
          </div>
        </div>
        <div className="career-hero-image-col">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=700&q=80"
            alt="Emyris team working in pharmaceutical lab"
            className="career-hero-image"
          />
          <div className="career-hero-image-badge">
            <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🧪</div>
            <strong style={{ color: '#1d4ed8', fontSize: '0.95rem' }}>Research-first culture</strong>
            <span style={{ fontSize: '0.75rem', color: '#475569' }}>Every team member drives innovation</span>
          </div>
        </div>
      </section>

      {/* Why Work With Us - Perks Grid */}
      <section className="career-perks-section">
        <div className="home-showcase-container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">WHY EMYRIS</span>
            <h2 className="section-main-title">Benefits That Matter</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '1.05rem' }}>
              We invest in our people because our people invest in patients.
            </p>
          </div>
          <div className="career-perks-grid">
            {perks.map((perk, idx) => (
              <div key={idx} className="career-perk-card glass">
                <div className="career-perk-icon">{perk.icon}</div>
                <h3 className="career-perk-title">{perk.title}</h3>
                <p className="career-perk-desc">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="career-openings-section">
        <div className="home-showcase-container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">OPPORTUNITIES</span>
            <h2 className="section-main-title">Current Openings</h2>
          </div>
          <div className="career-positions-list">
            {positions.map((pos, idx) => (
              <div key={idx} className={`career-position-card glass ${activePosition === pos.title ? 'career-position-active' : ''}`}>
                <div className="career-position-icon" style={{ backgroundColor: pos.color + '18', color: pos.color }}>
                  {pos.icon}
                </div>
                <div className="career-position-info">
                  <div className="career-position-header">
                    <div>
                      <h3 className="career-position-title">{pos.title}</h3>
                      <div className="career-position-meta">
                        <span>📂 {pos.dept}</span>
                        <span>📍 {pos.loc}</span>
                        <span>⏱ {pos.exp}</span>
                      </div>
                    </div>
                    <div className="career-position-right">
                      <span className="career-type-badge">{pos.type}</span>
                      <button
                        className="btn"
                        onClick={() => handleApply(pos)}
                        id={`apply-btn-${idx}`}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Apply Now →
                      </button>
                    </div>
                  </div>
                  <div className="career-skills-row">
                    {pos.skills.map((skill, si) => (
                      <span key={si} className="career-skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="career-form-section" id="apply-form">
        <div className="home-showcase-container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">APPLY NOW</span>
            <h2 className="section-main-title">Submit Your Application</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              Tell us about yourself. We review every application carefully.
            </p>
          </div>

          <div className="career-form-wrapper glass">
            {submitted ? (
              <div className="career-success-state">
                <div className="career-success-icon">🎉</div>
                <h3>Application Submitted Successfully!</h3>
                <p>Thank you for your interest in joining {siteData.companyName || 'EMYRIS BIOLIFESCIENCES'}. Our HR team will review your profile and reach out within 5-7 business days.</p>
                <button className="btn" onClick={() => setSubmitted(false)} style={{ marginTop: '1.5rem' }}>
                  Apply for Another Role
                </button>
              </div>
            ) : (
              <form className="career-form-grid" onSubmit={handleSubmit}>
                {error && (
                  <div className="form-error-banner" style={{ gridColumn: '1 / -1' }}>
                    ⚠️ {error}
                  </div>
                )}

                <label className="form-field">
                  Full Name *
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your full name" required />
                </label>

                <label className="form-field">
                  Email Address *
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" required />
                </label>

                <label className="form-field">
                  Phone Number
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" />
                </label>

                <label className="form-field">
                  Experience Level
                  <select name="experience" value={formData.experience} onChange={handleInputChange}>
                    <option value="">Select Experience</option>
                    <option value="Fresher">Fresher / Graduate</option>
                    <option value="1-2 Years">1-2 Years</option>
                    <option value="2-5 Years">2-5 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </label>

                <label className="form-field" style={{ gridColumn: '1 / -1' }}>
                  Position Applying For *
                  <select name="position" value={formData.position} onChange={handleInputChange} required>
                    <option value="">Select a position</option>
                    {positions.map((p, idx) => <option key={idx} value={p.title}>{p.title}</option>)}
                    <option value="Other">Other (Specify in message)</option>
                  </select>
                </label>

                <label className="form-field" style={{ gridColumn: '1 / -1' }}>
                  Upload CV / Resume (PDF, DOCX) *
                  <div className="career-file-drop">
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} required id="cv-upload" style={{ display: 'none' }} />
                    <label htmlFor="cv-upload" className="career-file-label">
                      {cvFile
                        ? <><span style={{ color: '#10b981', fontSize: '1.3rem' }}>✅</span> <strong>{cvFile.name}</strong> ({(cvFile.size / 1024).toFixed(1)} KB)</>
                        : <><span style={{ fontSize: '1.5rem' }}>📎</span> Click to upload your CV</>
                      }
                    </label>
                  </div>
                </label>

                <label className="form-field" style={{ gridColumn: '1 / -1' }}>
                  Cover Letter / Message
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Tell us about yourself, your experience, and why you'd be a great fit at Emyris Biolifesciences."
                  />
                </label>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button type="submit" className="btn" disabled={submitting} style={{ padding: '14px 36px', fontSize: '1.05rem' }}>
                    {submitting ? '⏳ Submitting...' : '🚀 Submit Application'}
                  </button>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    * Required fields. We keep your data confidential.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}

export default Career;
