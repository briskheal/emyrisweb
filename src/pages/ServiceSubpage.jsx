import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecaptcha } from '../components/CaptchaBox';
import './ServiceSubpage.css';

function ServiceSubpage() {
  const { pageId } = useParams();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    phone: '',
    message: '',
    fax: '' // Honeypot
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const getRecaptchaToken = useRecaptcha();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    const captchaToken = await getRecaptchaToken('service_form');
    
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('subject', formData.subject);
    submitData.append('phone', formData.phone);
    submitData.append('message', formData.message);
    submitData.append('servicePage', pageId);
    submitData.append('fax', formData.fax); // Send honeypot to server
    submitData.append('captchaToken', captchaToken);
    if (file) {
      submitData.append('attachment', file);
    }

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        body: submitData
      });

      const result = await response.json();
      if (result.success) {
        setStatus('Thank you! Your request has been submitted successfully.');
        setFormData({ name: '', email: '', subject: '', phone: '', message: '' });
        setFile(null);
      } else {
        setStatus('Failed to submit. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setStatus('An error occurred. Please try again.');
    }
  };

  // Render specific layout based on pageId
  const renderContent = () => {
    switch(pageId) {
      case 'second-opinion':
        return (
          <>
            <div className="service-banner" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1920&q=80')" }}>
              <div className="service-banner-overlay">
                <h1>Second Opinion</h1>
                <p>Expert medical insights and alternative perspectives for complex diagnoses.</p>
              </div>
            </div>
            
            <div className="service-container">
              <div className="service-content-split">
                <div className="service-text">
                  <h3 className="section-subtitle">OUR SERVICES</h3>
                  <h2 className="section-main-title">Second <span>Opinion</span></h2>
                  <p>
                    Second opinion services offered by EMYRIS BIOLIFESCIENCES provide patients with an invaluable opportunity to seek additional medical advice and insights from experienced healthcare professionals. When faced with complex medical decisions or uncertain diagnoses, obtaining a second opinion can offer clarity and peace of mind. Our team of specialized physicians and experts thoroughly review the patient's medical history, test results, and treatment plans to provide a comprehensive evaluation and alternative perspectives.
                  </p>
                  <p>
                    Choosing a second opinion from EMYRIS BIOLIFESCIENCES ensures access to a diverse network of highly qualified doctors and specialists across various medical fields. Patients benefit from the expertise of renowned healthcare professionals who bring extensive knowledge and experience to the table. By seeking a second opinion, patients can gain reassurance, clarity, and a deeper understanding of their medical condition.
                  </p>
                  <div className="highlight-box">
                    <strong>Remember:</strong> Seeking a second opinion is a normal part of the healthcare process. Your health and well-being are our top priority, and we're here to support you every step of the way. Connect with our specialist panellists for a second opinion.
                  </div>
                </div>
                <div className="service-image float-effect">
                  <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80" alt="Second Opinion" />
                </div>
              </div>
            </div>
          </>
        );

      case 'diagnostic-support':
        return (
          <>
            <div className="service-banner" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1920&q=80')" }}>
              <div className="service-banner-overlay">
                <h1>Diagnostic Support</h1>
                <p>Facilitating access to cutting-edge diagnostic services for accurate disease detection.</p>
              </div>
            </div>

            <div className="service-container">
              <div className="service-text text-center">
                <h3 className="section-subtitle">OUR SERVICES</h3>
                <h2 className="section-main-title">Diagnostic <span>Support</span></h2>
                <h3 className="sub-heading">EMYRIS BIOLIFESCIENCES Diagnostic Support Services</h3>
                <p style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
                  EMYRIS BIOLIFESCIENCES's Diagnostic Support Page, where we facilitate access to cutting-edge diagnostic services for accurate disease detection and management. EMYRIS BIOLIFESCIENCES is committed to facilitating seamless access to diagnostic support, empowering patients and healthcare providers in making informed decisions for optimal health outcomes.
                </p>
              </div>

              <div className="diagnostic-grid">
                {[
                  { title: 'Medical Imaging', desc: 'Connect to advanced imaging centers offering X-rays, CT scans, MRI scans, and ultrasound.', icon: '🩺', img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=500&q=60' },
                  { title: 'Multidisciplinary Consultation', desc: 'Collaborate with specialists across medical disciplines to ensure thorough evaluation.', icon: '👥', img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=500&q=60' },
                  { title: 'Medical History & Examination', desc: 'Benefit from comprehensive patient history-taking and physical examination.', icon: '📋', img: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=500&q=60' },
                  { title: 'Telemedicine & Monitoring', desc: 'Utilize telemedicine platforms for remote consultations and vital sign tracking.', icon: '💻', img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=500&q=60' },
                  { title: 'Laboratory Tests', desc: 'Access specialized laboratories for blood tests, biopsies, and other procedures.', icon: '🧪', img: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=500&q=60' },
                  { title: 'Medical Imaging II', desc: 'Connect to advanced imaging centers offering X-rays, CT scans, MRI scans, and ultrasound.', icon: '🔍', img: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=500&q=60' }
                ].map((item, idx) => (
                  <div className="diagnostic-card" key={idx}>
                    <img src={item.img} alt={item.title} className="diagnostic-img" />
                    <div className="diagnostic-content">
                      <div className="diagnostic-icon">{item.icon}</div>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'hospital-connect':
        return (
          <>
            <div className="service-banner" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80')" }}>
              <div className="service-banner-overlay">
                <h1>Hospital Connect</h1>
                <p>Bridging the gap between hospitals, pharmacies, and patients.</p>
              </div>
            </div>

            <div className="service-container">
              <div className="service-text">
                <h2 className="section-main-title" style={{ marginBottom: '1rem' }}>How Can We Help?</h2>
                <p>Fill out the form below to connect your hospital or clinic with Emyris Biolifesciences for priority procurement and critical care coordination.</p>
              </div>
            </div>
          </>
        );

      case 'train-the-future':
        return (
          <>
            <div className="service-banner" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80')" }}>
              <div className="service-banner-overlay">
                <h1>Train the Future</h1>
                <p>Empowering the next generation of healthcare professionals.</p>
              </div>
            </div>

            <div className="service-container">
              <div className="service-text text-center" style={{ marginBottom: '3rem' }}>
                <h3 className="section-subtitle">OUR SERVICES</h3>
                <h2 className="section-main-title">Train the <span>Future</span></h2>
                <h3 className="sub-heading">Developing Executive Leadership at EMYRIS BIOLIFESCIENCES</h3>
                <p style={{ maxWidth: '900px', margin: '0 auto' }}>
                  "Train the Future" is a comprehensive program offered by EMYRIS BIOLIFESCIENCES designed to empower medicine representatives with the knowledge, skills, and experience necessary to excel in their careers. This initiative goes beyond conventional training methods, providing participants with valuable insights, practical tools, and hands-on experiences to foster professional growth and development.
                </p>
              </div>

              <div className="service-content-split">
                <div className="service-text">
                  <p>
                    EMYRIS BIOLIFESCIENCES recognizes the importance of continuous learning and development in the pharmaceutical industry, where advancements in medicine and technology are constantly evolving. Through the "Train the Future" program, medicine representatives have the opportunity to expand their expertise, enhance their organizational effectiveness, and drive strategic growth.
                  </p>
                  <p>
                    One of the key benefits of participating in the "Train the Future" program is the opportunity to gain valuable experience through practical learning experiences. Working alongside experienced professionals, shadowing them in real-world scenarios, attending workshops and seminars, and engaging in role-playing exercises allows participants to apply their newly acquired knowledge.
                  </p>
                  <p>
                    Additionally, EMYRIS BIOLIFESCIENCES fosters a culture of continuous learning and professional development. By investing in the training and development of its representatives, EMYRIS BIOLIFESCIENCES cultivates a talented and skilled workforce capable of driving sustainable business growth.
                  </p>
                </div>
                <div className="service-image float-effect">
                  <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80" alt="Train the Future" />
                </div>
              </div>
            </div>
          </>
        );

      default:
        return (
          <div className="service-container">
            <h2>Service Not Found</h2>
            <p>The requested service could not be found.</p>
          </div>
        );
    }
  };

  return (
    <div className="service-subpage fade-in">
      {renderContent()}

      {/* Connect With Us Form Section (Shared across all 4 pages) */}
      <section className="connect-form-section">
        <div className="service-container">
          <div className="section-title-wrapper text-center">
            <h2 className="section-main-title">Connect <span>With Us</span></h2>
          </div>
          
          <div className="connect-form-wrapper glass">
            {status && <div className={`form-status ${status.includes('success') ? 'success' : ''}`}>{status}</div>}
            
            <form onSubmit={handleSubmit} className="connect-form">
              <div className="form-row">
                <div className="form-group">
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name*:" required />
                </div>
                <div className="form-group">
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email*:" required />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder={pageId === 'hospital-connect' ? "I'm interested in*:" : "Subject*:"} required />
                </div>
                <div className="form-group">
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone:" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width upload-group">
                  <label htmlFor="attachment">
                    {pageId === 'second-opinion' && "Upload Existing Prescription*:"}
                    {pageId === 'train-the-future' && "Upload CV*:"}
                    {pageId === 'hospital-connect' && "Upload Interest*:"}
                    {pageId === 'diagnostic-support' && "Upload Document:"}
                  </label>
                  <input type="file" id="attachment" onChange={handleFileChange} className="file-input" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <textarea name="message" value={formData.message} onChange={handleChange} rows="4" placeholder="Message*:" required></textarea>
                </div>
              </div>

              {/* Honeypot Field */}
              <input type="text" name="fax" value={formData.fax} onChange={handleChange} style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />

              <button type="submit" className="btn submit-btn" disabled={status === 'Submitting...'}>Submit</button>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>🔒 Protected by reCAPTCHA</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServiceSubpage;
