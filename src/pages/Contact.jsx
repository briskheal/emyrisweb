import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useRecaptcha } from '../components/CaptchaBox';

function Contact() {
  const { siteData } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    offering: '',
    message: '',
    fax: '' // Honeypot
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const getRecaptchaToken = useRecaptcha();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const captchaToken = await getRecaptchaToken('contact_form');
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, captchaToken })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setError('');
        setFormData({ name: '', email: '', phone: '', offering: '', message: '' });
      } else {
        setError(data.error || 'Failed to submit inquiry.');
      }
    } catch (err) {
      setError('Network error. Saving to local database backup.');
      const savedInquiries = JSON.parse(localStorage.getItem('emyrisInquiries') || '[]');
      savedInquiries.push({
        ...formData,
        id: Date.now(),
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('emyrisInquiries', JSON.stringify(savedInquiries));
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container fade-in" style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
        <h3 style={{ color: 'var(--primary)' }}>Connect Us Today!</h3>
        <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>We are available 24/7 for your service.</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Contact us on the given number for emergency product requirements or Doctor consultations. {siteData.companyName} is always ready to help you.
        </p>
        
        <div className="contact-info glass" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="info-item">
            <strong>Emergency Requirement</strong>
            <h2>{siteData.contactNumber}</h2>
          </div>
          <div className="info-item">
            <strong>Email Us</strong>
            <h2>{siteData.email}</h2>
          </div>
          <div className="info-item">
            <strong>Office Address</strong>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginTop: '0.5rem', fontWeight: 'bold' }}>
              {siteData.address}
            </p>
          </div>
        </div>
      </div>

      <div className="contact-form glass" style={{ flex: '1 1 300px', minWidth: '280px', padding: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Send a Message</h2>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Inquiry Submitted!</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Thank you for contacting us. Our team will get back to you shortly.
            </p>
            <button className="btn" style={{ marginTop: '2rem' }} onClick={() => setSubmitted(false)}>
              Send another message
            </button>
          </div>
        ) : (
          <form className="admin-form" onSubmit={handleSubmit} style={{ padding: 0 }}>
            {error && (
              <div style={{ padding: '10px 15px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '1rem' }}>
                {error}
              </div>
            )}
            <label>
              Name*
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="Your Name" 
                required 
                style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }}
              />
            </label>
            <label>
              Select Offerings
              <select 
                name="offering" 
                value={formData.offering} 
                onChange={handleInputChange}
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--glass-border)', 
                  background: 'var(--bg-panel)', 
                  color: 'var(--text-light)', 
                  outline: 'none' 
                }}
              >
                <option value="">Select offerings</option>
                <option value="Anti-Infective">Anti-Infective</option>
                <option value="Oncology">Oncology</option>
                <option value="Enteral Nutrition">Enteral Nutrition</option>
                <option value="Nutraceuticals">Nutraceuticals</option>
                <option value="Anasthetics">Anasthetics</option>
                <option value="HIV">HIV</option>
              </select>
            </label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <label style={{ flex: 1 }}>
                Phone
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  placeholder="Phone" 
                  style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }}
                />
              </label>
              <label style={{ flex: 1 }}>
                Email*
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="Email" 
                  required 
                  style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }}
                />
              </label>
            </div>
            <label>
              Message*
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleInputChange} 
                rows="4" 
                placeholder="How can we help you?" 
                required
                style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }}
              ></textarea>
            </label>
            {/* Honeypot Field - Hidden from humans, filled by bots */}
            <input 
              type="text" 
              name="fax" 
              value={formData.fax} 
              onChange={handleInputChange} 
              style={{ display: 'none' }} 
              tabIndex="-1" 
              autoComplete="off" 
            />
            <button type="submit" className="btn" style={{ marginTop: '1rem' }} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Inquiry'}
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              🔒 Protected by reCAPTCHA
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Contact;
