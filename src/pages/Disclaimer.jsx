import React, { useEffect } from 'react';
import HeaderSection from '../components/HeaderSection';

const Disclaimer = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="disclaimer-page" style={{ paddingBottom: '4rem' }}>
      <HeaderSection 
        title="Disclaimer" 
        subtitle="EMYRIS BIOLIFESCIENCES"
        bgImage="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1920&q=80"
      />
      
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 20px', lineHeight: '1.8', color: 'var(--text-color)' }}>
        <p style={{ marginBottom: '2rem' }}>The information provided on the "EMYRIS BIOLIFESCIENCES PVT LTD" website is for general informational purposes only. By accessing and using this website, you agree to the terms of this disclaimer.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Accuracy of Information</h3>
        <p style={{ marginBottom: '1.5rem' }}>While we endeavor to provide accurate and up-to-date information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is strictly at your own risk.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Professional Advice</h3>
        <p style={{ marginBottom: '1.5rem' }}>The content on this website does not constitute professional advice. It is provided for general informational purposes only. Before making any decisions based on the information provided, we recommend consulting with qualified healthcare professionals or advisors.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Third-Party Links</h3>
        <p style={{ marginBottom: '1.5rem' }}>Our website may contain links to third-party websites. These links are provided for your convenience to provide further information. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorsement of the views expressed within them.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Limitation of Liability</h3>
        <p style={{ marginBottom: '1.5rem' }}>In no event will "EMYRIS BIOLIFESCIENCES PVT LTD" be liable for any loss or damage, including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Shipping and Delivery</h3>
        <p style={{ marginBottom: '1.5rem' }}>For product deliveries, shipping details will be communicated, and delivery timelines are estimates. Any delays or issues during transportation will be communicated promptly to the customer.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Changes to the Website</h3>
        <p style={{ marginBottom: '1.5rem' }}>We reserve the right to modify or discontinue, temporarily or permanently, the website or any part of it without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the website.</p>
        
        <p style={{ marginTop: '2rem', marginBottom: '2rem' }}>By using this website, you agree to the terms of this disclaimer. This disclaimer is subject to change without notice, and your continued use of the website after any modifications will constitute your acceptance of such modifications.</p>
        
        <a href="mailto:contact@emyrisbio.com" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>contact@emyrisbio.com</a>
      </div>
    </div>
  );
};

export default Disclaimer;
