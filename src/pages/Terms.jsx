import React, { useEffect } from 'react';
import HeaderSection from '../components/HeaderSection';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="terms-page" style={{ paddingBottom: '4rem' }}>
      <HeaderSection 
        title="Terms and Conditions" 
        subtitle="EMYRIS BIOLIFESCIENCES"
        bgImage="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1920&q=80"
      />
      
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 20px', lineHeight: '1.8', color: 'var(--text-color)' }}>
        <p style={{ marginBottom: '2rem' }}>These terms and conditions govern your engagement with our services related to medicine and healthcare. By accessing or using our services, you agree to comply with these terms and conditions. If you do not agree with any part of these terms, please do not use our services.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Service Agreement</h3>
        <p style={{ marginBottom: '1.5rem' }}>By availing our services, you agree to be bound by the terms outlined in the respective service agreements for pharmaceutical products, healthcare solutions, and related services.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Quality Standards</h3>
        <p style={{ marginBottom: '1.5rem' }}>We are committed to upholding the highest standards of quality in our products and services. All pharmaceutical products and healthcare solutions provided by EMYRIS BIOLIFESCIENCES PVT LTD meet stringent industry standards and undergo thorough quality control measures.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Order Placement</h3>
        <p style={{ marginBottom: '1.5rem' }}>Orders for pharmaceutical products and healthcare solutions can be placed through our designated channels. All orders are subject to availability, and confirmation will be provided upon processing.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Payment Terms</h3>
        <p style={{ marginBottom: '1.5rem' }}>Payment terms are outlined in the invoicing and may vary based on the nature of the service. Late payments may incur additional charges as per our billing policies.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Shipping and Delivery</h3>
        <p style={{ marginBottom: '1.5rem' }}>For product deliveries, shipping details will be communicated, and delivery timelines are estimates. Any delays or issues during transportation will be communicated promptly to the customer.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Intellectual Property</h3>
        <p style={{ marginBottom: '1.5rem' }}>All content on our website, including text, images, and logos, is the intellectual property of EMYRIS BIOLIFESCIENCES PVT LTD. Unauthorized use, reproduction, or distribution of any content is strictly prohibited.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Data Protection</h3>
        <p style={{ marginBottom: '1.5rem' }}>We are committed to protecting your privacy and personal information. Any data collected during your interaction with our website or services will be handled in accordance with our privacy policy.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Dispute Resolution</h3>
        <p style={{ marginBottom: '1.5rem' }}>In case of disputes, both parties agree to engage in good faith negotiations to resolve the issue. If resolution cannot be reached, the matter may be escalated to mediation or legal proceedings as per applicable laws.</p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Modification of Terms</h3>
        <p style={{ marginBottom: '1.5rem' }}>EMYRIS BIOLIFESCIENCES PVT LTD reserves the right to modify these terms and conditions at any time without prior notice. Any changes will be effective immediately upon posting on our website.</p>
        
        <p style={{ marginTop: '2rem', marginBottom: '2rem' }}>By accessing or using our services, you acknowledge that you have read, understood, and agreed to abide by these terms and conditions. If you have any questions or concerns, please contact us for clarification before proceeding.</p>
        
        <a href="mailto:contact@emyrisbio.com" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>contact@emyrisbio.com</a>
      </div>
    </div>
  );
};

export default Terms;
