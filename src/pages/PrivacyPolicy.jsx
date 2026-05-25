import React, { useEffect } from 'react';
import HeaderSection from '../components/HeaderSection';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy-page" style={{ paddingBottom: '4rem' }}>
      <HeaderSection 
        title="Privacy Policy" 
        subtitle="EMYRIS BIOLIFESCIENCES"
        bgImage="https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1920&q=80"
      />
      
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 20px', lineHeight: '1.8', color: 'var(--text-color)' }}>
        <p style={{ marginBottom: '2rem' }}>Thank you for choosing EMYRIS BIOLIFESCIENCES. This Privacy Policy outlines how we collect, use, disclose, and safeguard your personal information when you engage with our services related to medicine and healthcare. Please take a moment to review the following information</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Information Collection</h3>
        <p style={{ marginBottom: '1.5rem' }}>We may collect personal information such as names, contact details, and healthcare-related information when you interact with our website or engage in our services. This information is collected with your consent and used for the purpose of providing and improving our healthcare solutions.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Use of Information</h3>
        <p style={{ marginBottom: '1.5rem' }}>Your personal information may be used to provide healthcare services, deliver personalized healthcare solutions, and improve our services. We may also use the information for communication, marketing, and research purposes, always with the option to opt-out.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Information Sharing</h3>
        <p style={{ marginBottom: '1.5rem' }}>We do not sell or share your personal information with third parties for their marketing purposes. However, we may share information with healthcare professionals, regulatory authorities, and service providers to facilitate our operations and services.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Data Security</h3>
        <p style={{ marginBottom: '1.5rem' }}>We take appropriate measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Our security protocols are regularly reviewed and updated to ensure the integrity of your data.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Cookies and Tracking Technologies</h3>
        <p style={{ marginBottom: '1.5rem' }}>Our website may use cookies and similar tracking technologies to enhance your user experience. You have the option to control cookie preferences through your browser settings.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Third-Party Links</h3>
        <p style={{ marginBottom: '1.5rem' }}>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. Please review the privacy policies of such websites before providing any personal information.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Children's Privacy</h3>
        <p style={{ marginBottom: '1.5rem' }}>Our services are not directed at individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will take appropriate steps to remove such information.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Updates to Privacy Policy</h3>
        <p style={{ marginBottom: '1.5rem' }}>We reserve the right to update and modify this Privacy Policy. Any changes will be effective upon posting on our website. We encourage you to review this policy periodically.</p>
        
        <p style={{ marginTop: '2rem', marginBottom: '2rem' }}>By using our services, you confirm that you have read, comprehended, and agree to be bound by these terms and conditions. If you have any questions or concerns, please contact us for further clarification. Your privacy is important to us, and we are committed to ensuring the security and confidentiality of your personal information.</p>
        
        <a href="mailto:contact@emyrisbio.com" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>contact@emyrisbio.com</a>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
