import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import CaptchaBox from '../components/CaptchaBox';

function Career() {
  const { siteData } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    qualification: '',
    experience: '',
    address: ''
  });
  const [cvFile, setCvFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);

  const careerCards = [
    {
      title: 'Our People Matter',
      desc: 'At EMYRIS BIOLIFESCIENCES, our employees and customers are the heart of our organization. We value them not just as stakeholders, but as invaluable assets. Our inclusive organizational culture ensures that every individual has equal opportunities to grow, thrive, and excel within our vibrant ecosystem.'
    },
    {
      title: 'Opportunities for Advancement',
      desc: 'Join us on a journey where your talents are not just valued, but essential to our company\'s success. At EMYRIS BIOLIFESCIENCES, we offer a supportive atmosphere where every individual has equal opportunities to develop and advance professionally. Your career with us is a journey of continuous learning and growth.'
    },
    {
      title: 'Building a Sustainable Future',
      desc: 'EMYRIS BIOLIFESCIENCES is committed to providing outstanding services while significantly contributing to the betterment of society and the environment. Our extensive range of pharmaceutical solutions addresses various healthcare needs, empowering individuals and communities to lead healthier lives.'
    },
    {
      title: 'Our Culture',
      desc: 'Our organizational culture is built on cooperation, creativity, and mutual success. We encourage diversity of thought and embrace each person\'s unique perspective and abilities. At EMYRIS BIOLIFESCIENCES, we believe that collaboration drives innovation, and every team member plays a crucial role in our collective success.'
    },
    {
      title: 'Education and Training',
      desc: 'At EMYRIS BIOLIFESCIENCES, we prioritize the continuous development and growth of our team members as an integral part of our commitment to excellence. We firmly believe that investing in our employees\' professional development not only benefits them individually but also contributes significantly to the overall success of our organization.'
    },
    {
      title: 'Investing in Your Growth',
      desc: 'We recognize that our team\'s dedication is the cornerstone of our success. That\'s why at EMYRIS BIOLIFESCIENCES, we don\'t just offer jobs; we provide opportunities for progressive and meaningful careers. Our commitment to your growth is reflected in our efforts to create an environment where every contribution is recognized and celebrated, fostering a sense of pride and fulfilment.'
    }
  ];

  const whyChooseUs = [
    {
      title: 'Innovative Solutions',
      desc: 'Be part of a company at the forefront of pioneering pharmaceutical solutions, consistently pushing the boundaries of healthcare innovation.'
    },
    {
      title: 'Collaborative Work Environment',
      desc: 'Join a team that values cooperation, diversity, and the strength of collective expertise.'
    },
    {
      title: 'Professional Advancement',
      desc: 'Embark on a career journey of ongoing learning and development in an environment that supports your growth.'
    },
    {
      title: 'Positive Impact',
      desc: 'Contribute to an organization dedicated to improving healthcare outcomes and making a positive difference in people\'s lives.'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setCvFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.qualification || !formData.experience || !formData.address) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!captchaToken) {
      setError('Please complete the CAPTCHA verification.');
      return;
    }
    setSubmitting(true);
    setError('');

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    // Backend expects 'position' and 'message'
    submitData.append('position', formData.qualification); 
    submitData.append('experience', formData.experience);
    submitData.append('message', formData.address); 
    
    if (cvFile) {
      submitData.append('resume', cvFile);
    }

    try {
      submitData.append('captchaToken', captchaToken);
      const res = await fetch('/api/careers', {
        method: 'POST',
        body: submitData
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit application.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in">
      {/* Page Title */}
      <div className="ttm-page-title-row" style={{ 
        background: 'linear-gradient(rgba(0,35,69,0.7), rgba(0,35,69,0.7)), url("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80")', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        padding: '100px 0', 
        textAlign: 'center', 
        color: 'white',
        boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
      }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '2px', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>Career</h1>
        <p style={{ fontSize: '1.1rem', marginTop: '1rem', opacity: 0.9 }}>Join our mission to revolutionize healthcare.</p>
      </div>

      <section className="career-section" style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="section-title text-center" style={{ marginBottom: '4rem' }}>
          <h2 style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '2.5rem' }}>Careers at <b style={{ color: 'var(--secondary)' }}>EMYRIS BIOLIFESCIENCES PVT LTD.</b></h2>
          <h3 style={{ marginTop: '1.5rem', color: 'var(--text-dark)', fontWeight: '600', fontSize: '1.4rem' }}>Welcome to EMYRIS BIOLIFESCIENCES - Where Innovation Fuels Growth and Excellence Flourishes.</h3>
          <p style={{ marginTop: '1.2rem', color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', maxWidth: '900px', margin: '1rem auto' }}>
            EMYRIS BIOLIFESCIENCES isn't just a pharmaceutical company; it's a dynamic force propelled by innovation and a steadfast commitment to excellence. Specializing in groundbreaking pharmaceutical solutions, we empower individuals to embark on impactful careers that drive positive change in the healthcare industry.
          </p>
        </div>

        {/* Onboarding Portal Card */}
        <div style={{
          background: 'linear-gradient(135deg, #002345 0%, #003a70 100%)',
          borderRadius: '20px',
          padding: '2.5rem',
          color: '#ffffff',
          marginBottom: '4rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
          boxShadow: '0 20px 40px rgba(0, 35, 69, 0.15)',
          border: '1px solid rgba(82, 203, 203, 0.3)'
        }}>
          <div style={{ flex: '1 1 400px', textAlign: 'left' }}>
            <span style={{ background: 'var(--secondary)', color: '#002345', padding: '4px 12px', borderRadius: '20px', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase' }}>Selected Candidates & Staff</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '1rem', color: '#ffffff' }}>Official Employee Onboarding Portal</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.05rem', marginTop: '0.5rem', lineHeight: '1.6' }}>
              Have you received an offer letter or onboarding invitation? Access our secure digital portal to complete your verification, upload documents, and generate your joining paperwork.
            </p>
          </div>
          <div>
            <a href="https://emyrishr.in" target="_blank" rel="noopener noreferrer" className="btn" style={{
              background: 'var(--secondary)',
              color: '#002345',
              padding: '1rem 2rem',
              borderRadius: '50px',
              fontWeight: '800',
              fontSize: '1.05rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 10px 25px rgba(82, 203, 203, 0.3)'
            }}>
              Launch Onboarding Portal ↗
            </a>
          </div>
        </div>

        <div className="career-cards-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2.5rem', 
          marginBottom: '2rem' 
        }}>
          {careerCards.map((card, idx) => (
            <div key={idx} className="glass" style={{ 
              padding: '2.5rem', 
              borderRadius: '16px', 
              borderTop: '5px solid var(--secondary)',
              background: '#ffffff',
              boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              <h3 style={{ color: 'var(--primary)', marginBottom: '1.2rem', fontSize: '1.4rem', fontWeight: '800' }}>{card.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', textAlign: 'justify', fontSize: '1.05rem' }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ backgroundColor: '#f1f5f9', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'flex-start' }}>
          
          <div style={{ flex: '1 1 500px' }}>
            <span className="section-subtitle">OPPORTUNITIES</span>
            <h4 style={{ color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: '800' }}>Why Choose Us</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', marginBottom: '2.5rem', lineHeight: '1.7' }}>
              Join EMYRIS BIOLIFESCIENCES, where careers flourish, excellence thrives, and every individual is a vital part of our mission to revolutionize healthcare. Experience a workplace that values talent, fosters growth, and envisions a progressive future for healthcare.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {whyChooseUs.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                  <div style={{ 
                    minWidth: '45px', 
                    height: '45px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--secondary)', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    boxShadow: '0 4px 10px rgba(82, 203, 203, 0.4)'
                  }}>i</div>
                  <div>
                    <h5 style={{ color: 'var(--primary)', fontSize: '1.2rem', marginBottom: '0.4rem', fontWeight: '800' }}>{item.title}</h5>
                    <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: '1.6', fontSize: '1.05rem' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: '1 1 400px' }} id="apply-form">
            <div className="glass" style={{ 
              padding: '3rem', 
              borderRadius: '24px', 
              backgroundColor: '#ffffff', 
              boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
              border: '1px solid rgba(82, 203, 203, 0.05)'
            }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '2rem', fontWeight: '800', fontSize: '1.8rem', textAlign: 'center' }}>Submit Your Details</h3>
              
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎉</div>
                  <h4 style={{ color: '#10b981', marginBottom: '1rem', fontWeight: '800', fontSize: '1.5rem' }}>Application Submitted!</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>Thank you for your interest. We will review your profile and get back to you shortly.</p>
                  <button className="btn" onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', phone: '', email: '', qualification: '', experience: '', address: '' });
                    setCvFile(null);
                  }} style={{ marginTop: '2rem' }}>Submit Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {error && <div style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '12px', borderRadius: '8px', fontWeight: '600' }}>{error}</div>}
                  
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name*:" required style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone:" style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email*:" required style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                  <input type="text" name="qualification" value={formData.qualification} onChange={handleInputChange} placeholder="Qualification*:" required style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                  <input type="text" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="Experience*:" required style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                  
                  <div style={{ padding: '16px', border: '2px dashed #cbd5e1', borderRadius: '8px', backgroundColor: '#f8fafc', transition: 'border 0.3s ease' }}>
                    <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '600' }}>Upload CV*</label>
                    <input type="file" onChange={handleFileChange} required accept=".pdf,.doc,.docx" style={{ width: '100%' }} />
                  </div>
                  
                  <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Address*:" required rows="4" style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', resize: 'vertical', fontSize: '1rem' }}></textarea>
                  
                  <CaptchaBox onVerify={setCaptchaToken} onExpire={() => setCaptchaToken(null)} />

                  <button type="submit" className="btn" disabled={submitting || !captchaToken} style={{ padding: '16px', fontSize: '1.15rem', fontWeight: 'bold', marginTop: '1rem', width: '100%' }}>
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Career;
