import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function DiscoverSubpage() {
  const { pageId } = useParams();
  const { siteData } = useContext(AppContext);

  const getTitle = () => {
    switch(pageId) {
      case 'advisors': return 'Our Advisors';
      case 'doctors': return 'Our Doctors';
      case 'enhancers': return 'Business Enhancers';
      case 'presence': return 'Business Presence';
      case 'faq': return 'Frequently Asked Questions';
      default: return 'Discover Emyris';
    }
  };

  // Accordion state for FAQs
  const [openFaq, setOpenFaq] = useState(null);
  const [faqQuery, setFaqQuery] = useState('');

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const renderContent = () => {
    switch(pageId) {
      case 'advisors':
        const advisorsList = siteData.advisors || [];
        return (
          <div>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: '1.8', textAlign: 'justify' }}>
              At EMYRIS BIOLIFESCIENCES, our advisors are integral to shaping our vision, informing decisions, and driving success. Their commitment, dedication, and contributions are invaluable as we strive to advance healthcare and improve lives. We express gratitude for their unwavering support and eagerly anticipate continued collaboration, knowing that together, we can make significant strides in enhancing the well-being of individuals and communities worldwide.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
              {advisorsList.map((adv, idx) => (
                <div key={adv.id || idx} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  
                  {/* Photo Frame */}
                  <div style={{ 
                    width: '100%', 
                    height: '350px', 
                    overflow: 'hidden', 
                    borderRadius: '16px 16px 0 0',
                    border: '1px solid var(--glass-border)',
                    borderBottom: 'none',
                    position: 'relative',
                    background: '#f1f5f9'
                  }}>
                    <img 
                      src={adv.image || 'https://via.placeholder.com/370x380?text=No+Photo'} 
                      alt={adv.name} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }} 
                      className="profile-hover-zoom"
                    />
                  </div>

                  {/* Definition Space Underneath */}
                  <div className="glass" style={{ 
                    padding: '2rem', 
                    borderRadius: '0 0 16px 16px', 
                    borderTop: 'none',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem',
                    flex: '1',
                    background: 'rgba(255, 255, 255, 0.7)'
                  }}>
                    <h3 style={{ color: 'var(--primary)', margin: '0', fontSize: '1.35rem', fontWeight: '800' }}>
                      {adv.name}
                    </h3>
                    <h4 style={{ color: 'var(--secondary)', fontSize: '0.9rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0' }}>
                      {adv.role}
                    </h4>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.7', textAlign: 'justify', margin: '0.5rem 0 0 0' }}>
                      {adv.bio}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        );

      case 'doctors':
        const doctorsList = siteData.doctors || [];
        return (
          <div>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: '1.8', textAlign: 'justify' }}>
              We collaborate with a vast network of medical practitioners, clinicians, and consulting specialists to bridge the gap between pharmaceutical innovations and real-world patient care. These healthcare professionals guide us in optimizing treatment therapies and patient-centric designs.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
              {doctorsList.map((doc, idx) => (
                <div key={doc.id || idx} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  
                  {/* Photo Frame */}
                  <div style={{ 
                    width: '100%', 
                    height: '350px', 
                    overflow: 'hidden', 
                    borderRadius: '16px 16px 0 0',
                    border: '1px solid var(--glass-border)',
                    borderBottom: 'none',
                    position: 'relative',
                    background: '#f1f5f9'
                  }}>
                    <img 
                      src={doc.image || 'https://via.placeholder.com/370x380?text=No+Photo'} 
                      alt={doc.name} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover'
                      }} 
                    />
                  </div>

                  {/* Definition Space Underneath */}
                  <div className="glass" style={{ 
                    padding: '2rem', 
                    borderRadius: '0 0 16px 16px', 
                    borderTop: 'none',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem',
                    flex: '1',
                    background: 'rgba(255, 255, 255, 0.7)'
                  }}>
                    <h3 style={{ color: 'var(--primary)', margin: '0', fontSize: '1.35rem', fontWeight: '800' }}>
                      {doc.name}
                    </h3>
                    <h4 style={{ color: 'var(--secondary)', fontSize: '0.9rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0' }}>
                      {doc.role}
                    </h4>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.7', textAlign: 'justify', margin: '0.5rem 0 0 0' }}>
                      {doc.bio}
                    </p>
                  </div>

                </div>
              ))}
            </div>

            {/* Free Consultation CTA */}
            <div className="glass" style={{ 
              padding: '3rem', 
              borderRadius: '20px', 
              textAlign: 'center', 
              background: 'linear-gradient(135deg, rgba(29,78,216,0.05) 0%, rgba(30,58,138,0.08) 100%)',
              border: '1px solid var(--primary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <div style={{ fontSize: '3rem' }}>🩺</div>
              <h2 style={{ color: 'var(--primary)', fontSize: '2rem', fontWeight: '800', margin: 0 }}>Want a Free Consultation?</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                We offer extensive medical consultation support to outbound and inbound patients. We take care of Patient queries in facilitating connects with Dr's associated with us. Connect us to help you to find Right Doctor for your concern.
              </p>
              <Link to="/contact" className="btn" style={{ marginTop: '1rem', padding: '0.8rem 2.5rem', fontSize: '1.05rem' }}>
                Connect with Us
              </Link>
            </div>
          </div>
        );

      case 'enhancers':
        const enhancersList = siteData.enhancers || [];
        return (
          <div>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: '1.8', textAlign: 'justify' }}>
              Our Business Enhancers believe in optimizing processes, leveraging technology, and fostering a culture of continuous development. They engage a passionate team to do the right job in bringing massive success for EMYRIS BIOLIFESCIENCES. We are happy that our TEAM works like a family and they come with rich experience in the Pharmaceutical Business.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
              {enhancersList.map((enh, idx) => (
                <div key={enh.id || idx} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  
                  {/* Photo Frame */}
                  <div style={{ 
                    width: '100%', 
                    height: '350px', 
                    overflow: 'hidden', 
                    borderRadius: '16px 16px 0 0',
                    border: '1px solid var(--glass-border)',
                    borderBottom: 'none',
                    position: 'relative',
                    background: '#f1f5f9'
                  }}>
                    <img 
                      src={enh.image || 'https://via.placeholder.com/370x380?text=No+Photo'} 
                      alt={enh.name} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover'
                      }} 
                    />
                  </div>

                  {/* Definition Space Underneath */}
                  <div className="glass" style={{ 
                    padding: '2rem', 
                    borderRadius: '0 0 16px 16px', 
                    borderTop: 'none',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem',
                    flex: '1',
                    background: 'rgba(255, 255, 255, 0.7)'
                  }}>
                    <h3 style={{ color: 'var(--primary)', margin: '0', fontSize: '1.35rem', fontWeight: '800' }}>
                      {enh.name}
                    </h3>
                    <h4 style={{ color: 'var(--secondary)', fontSize: '0.9rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0' }}>
                      {enh.role}
                    </h4>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.7', textAlign: 'justify', margin: '0.5rem 0 0 0' }}>
                      {enh.bio}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        );

      case 'presence':
        return (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
              <div>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.7', textAlign: 'justify', marginBottom: '1.2rem' }}>
                  EMYRIS BIOLIFESCIENCES's rapid expansion across India's major cities reflects our unwavering commitment to providing high-quality healthcare solutions nationwide. As we prepare to extend our operations into neighbouring countries, our team of seasoned advisors plays a pivotal role in guiding our strategic initiatives.
                </p>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.7', textAlign: 'justify', marginBottom: '1.2rem' }}>
                  Comprised of esteemed professionals with extensive experience in the medical and healthcare sectors, our advisors bring a wealth of knowledge and expertise to the table. Their strategic counsel informs our decision-making processes, ensuring alignment with industry standards and best practices.
                </p>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.7', textAlign: 'justify', marginBottom: '1.2rem' }}>
                  Each advisor offers a unique perspective and specialized skill set, enriching our approach to pharmaceutical research, regulatory compliance, and market expansion. Their collective wisdom and leadership are instrumental as we navigate the complexities of international markets and forge successful partnerships abroad.
                </p>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.7', textAlign: 'justify', marginBottom: '2rem' }}>
                  EMYRIS BIOLIFESCIENCES values the collaborative partnership with our advisors, recognizing their pivotal role in driving innovation, fostering growth, and advancing our mission of delivering exceptional healthcare solutions. Together, we are poised to make a meaningful impact on the healthcare landscape, both domestically and internationally.
                </p>
                <Link to="/contact" className="btn">Connect with Us</Link>
              </div>
              <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                <img 
                  src="https://cms.emyrisbio.com//Content/images/offerings/Anti-Infective.jpg" 
                  alt="Business Presence Map" 
                  style={{ width: '100%', height: 'auto', display: 'block' }} 
                />
              </div>
            </div>

            <div className="glass" style={{ padding: '2.5rem', borderRadius: '16px' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontWeight: '800', fontSize: '1.5rem' }}>Our Regional Logistic Hubs</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                      <th style={{ padding: '15px', fontWeight: '700', color: 'var(--primary)' }}>Region Hub</th>
                      <th style={{ padding: '15px', fontWeight: '700', color: 'var(--primary)' }}>Operational Scope</th>
                      <th style={{ padding: '15px', fontWeight: '700', color: 'var(--primary)' }}>Contact Desk</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>Hyderabad (Headquarters)</td>
                      <td style={{ padding: '15px', color: 'var(--text-muted)' }}>Administrative, Global R&D, and Southern Distribution</td>
                      <td style={{ padding: '15px', color: 'var(--secondary)', fontWeight: 'bold' }}>hyd@emyrisbio.com</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>Vadodara Hub</td>
                      <td style={{ padding: '15px', color: 'var(--text-muted)' }}>Manufacturing Logistics and Western States Supply</td>
                      <td style={{ padding: '15px', color: 'var(--secondary)', fontWeight: 'bold' }}>west@emyrisbio.com</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>Bhubaneswar Desk</td>
                      <td style={{ padding: '15px', color: 'var(--text-muted)' }}>Eastern Region Warehouse and Government Supply Coordination</td>
                      <td style={{ padding: '15px', color: 'var(--secondary)', fontWeight: 'bold' }}>east@emyrisbio.com</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>Guwahati Hub</td>
                      <td style={{ padding: '15px', color: 'var(--text-muted)' }}>Northeastern States Logistics and Distribution Center</td>
                      <td style={{ padding: '15px', color: 'var(--secondary)', fontWeight: 'bold' }}>ne@emyrisbio.com</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>Jaipur Desk</td>
                      <td style={{ padding: '15px', color: 'var(--text-muted)' }}>Northern Region Inventory Management & Hospital Support</td>
                      <td style={{ padding: '15px', color: 'var(--secondary)', fontWeight: 'bold' }}>north@emyrisbio.com</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'faq':
        const faqs = [
          { q: "What does “EMYRIS BIOLIFESCIENCES” do?", a: "“EMYRIS BIOLIFESCIENCES” is a pharmaceutical company dedicated to developing innovative healthcare solutions to improve patient outcomes and enhance quality of life. We specialize in providing affordable medication to seriously ill patients." },
          { q: "What types of medications does EMYRIS BIOLIFESCIENCES offer?", a: "EMYRIS BIOLIFESCIENCES specializes in a wide range of pharmaceutical products tailored to address various medical conditions. Our product portfolio includes medications for cardiovascular health, respiratory disorders, oncology, infectious diseases, and more." },
          { q: "Can I purchase EMYRIS BIOLIFESCIENCES medications online?", a: "Yes, EMYRIS BIOLIFESCIENCES medications are available for purchase through authorized online pharmacies and our website. Simply visit our online store or contact your healthcare provider for assistance in obtaining our products." },
          { q: "Are EMYRIS BIOLIFESCIENCES medications covered by insurance?", a: "Coverage for EMYRIS BIOLIFESCIENCES medications may vary depending on your insurance provider and policy. We recommend contacting your insurance company directly to inquire about coverage for specific medications." },
          { q: "How does EMYRIS BIOLIFESCIENCES ensure the quality and safety of its products?", a: "EMYRIS BIOLIFESCIENCES adheres to strict quality control measures and regulatory standards to ensure the safety, efficacy, and purity of our medications. We conduct rigorous testing and monitoring throughout the manufacturing process to uphold the highest quality standards." },
          { q: "Does EMYRIS BIOLIFESCIENCES offer patient assistance programs?", a: "Yes, EMYRIS BIOLIFESCIENCES is committed to ensuring access to our medications for all patients, including those facing financial hardships. We offer various patient assistance programs and discounts to eligible individuals. Please contact our customer service team for more information on available assistance programs." },
          { q: "How can I contact “EMYRIS BIOLIFESCIENCES PVT LTD”?", a: "You can reach us by phone at +91 2269710582 during our business hours. Alternatively, you can send us an email at contact@emyrisbio.com or fill out the contact form on contact us page." },
          { q: "What products/services does “EMYRIS BIOLIFESCIENCES” offer?", a: "For a comprehensive list of our offerings, please visit our Products/Services page on our website." },
          { q: "How can I place an order for “EMYRIS BIOLIFESCIENCES” products?", a: "To place an order for our products, please contact our sales department at +91 2269710582. Our sales representatives will be happy to assist you with your order and answer any questions you may have." },
          { q: "Are “Emyris Products” products available internationally?", a: "Currently we focus in Indian markets and shortly we will commence our business operation in other neighbouring countries." },
          { q: "What quality assurance measures does “EMYRIS BIOLIFESCIENCES” adhere to?", a: "At “EMYRIS BIOLIFESCIENCES”, we are committed to maintaining the highest standards of quality, safety, and regulatory compliance in all aspects of our operations. Our products undergo rigorous testing and quality control processes to ensure that they meet or exceed regulatory requirements and industry standards." },
          { q: "How can I learn more about career opportunities at “EMYRIS BIOLIFESCIENCES”?", a: "We're always looking for talented individuals to join our team. For information about current job openings and career opportunities at “EMYRIS BIOLIFESCIENCES PVT LTD.”, please visit our Careers page on our website or contact our Human Resources department at contact@emyrisbio.com." },
          { q: "Does “EMYRIS BIOLIFESCIENCES” offer educational resources for healthcare professionals?", a: "Yes, we offer a variety of educational resources and conduct various Educational Programs and cross border meets for healthcare professionals. Please contact us in dropping a mail for your training requirements. We will be more happy in helping and guiding you." },
          { q: "Does “EMYRIS BIOLIFESCIENCES” offer training program to newcomers?", a: "Yes, we conduct training programs for graduates those willing to choose pharma sales as a career. Please visit our “services” page to find more about training schedule and enrolment process." },
          { q: "How does “EMYRIS BIOLIFESCIENCES” support community outreach and philanthropic initiatives?", a: "At “EMYRIS BIOLIFESCIENCES”, we are committed to giving back to the communities we serve. Through our philanthropic initiatives and community outreach programs, we support organizations and initiatives that promote health and wellness, education, and social responsibility. “Emyris Foundation” is a charitable organization takes care of those needs." }
        ];

        const filteredFaqs = faqs.filter(faq => 
          faq.q.toLowerCase().includes(faqQuery.toLowerCase()) || 
          faq.a.toLowerCase().includes(faqQuery.toLowerCase())
        );

        return (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '2rem' }}>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.8', textAlign: 'justify', marginBottom: '2rem' }}>
                Welcome to EMYRIS BIOLIFESCIENCES's FAQ page, your go-to resource for answers to common queries about our pharmaceutical products and healthcare services. Whether you're seeking information about our company, product offerings, or services, you'll find comprehensive answers here. If you can't find what you're looking for, don’t hesitate to email us at <b><a href="mailto:contact@emyrisbio.com" style={{ color: 'var(--primary)' }}>contact@emyrisbio.com</a></b>
              </p>

              {/* Real-time Search Box */}
              <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
                <input 
                  type="text" 
                  value={faqQuery}
                  onChange={(e) => setFaqQuery(e.target.value)}
                  placeholder="🔍 Search FAQs by keywords..."
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    borderRadius: '30px',
                    border: '1px solid var(--glass-border)',
                    outline: 'none',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                    color: 'var(--text-light)'
                  }}
                />
                {faqQuery && (
                  <button 
                    onClick={() => setFaqQuery('')}
                    style={{
                      position: 'absolute',
                      right: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {filteredFaqs.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No matching questions found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {filteredFaqs.map((faq, idx) => (
                  <div 
                    key={idx} 
                    className="glass faq-toggle-block" 
                    style={{ 
                      padding: '1.5rem 2rem', 
                      cursor: 'pointer', 
                      transition: 'all 0.3s ease',
                      borderRadius: '16px',
                      border: openFaq === idx ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                      background: openFaq === idx ? 'rgba(29, 78, 216, 0.02)' : 'rgba(255, 255, 255, 0.5)'
                    }}
                    onClick={() => toggleFaq(idx)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: openFaq === idx ? 'var(--primary)' : 'var(--text-light)', margin: 0, textAlign: 'justify', lineHeight: '1.5' }}>
                        ❓ {faq.q}
                      </h3>
                      <span style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 'bold', transition: 'transform 0.3s ease', transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        ▼
                      </span>
                    </div>
                    {openFaq === idx && (
                      <p style={{ marginTop: '1.2rem', color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7', borderTop: '1px solid var(--glass-border)', paddingTop: '1.2rem', textAlign: 'justify', animation: 'fadeIn 0.4s ease' }}>
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <p style={{ marginTop: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Thank you for visiting our FAQ page. If you have any additional questions or concerns, please don't hesitate to reach out to us. We're here to help!
            </p>
          </div>
        );

      default:
        return <p>Section content is being loaded...</p>;
    }
  };

  return (
    <div className="page-container fade-in" style={{ marginTop: '2rem', minHeight: '75vh' }}>
      
      {/* Back link */}
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/discover" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 'bold' }}>
          ← Back to Discover
        </Link>
      </div>

      <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        EMYRIS DISCOVER
      </h3>
      
      <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '2.5rem', borderBottom: '2px solid var(--glass-border)', paddingBottom: '1rem' }}>
        {getTitle()}
      </h1>

      {renderContent()}

    </div>
  );
}

export default DiscoverSubpage;
