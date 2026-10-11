import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'qrcode';

export default function ConferenceStandeeModal({ event, onClose, adminFetch }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [activeTab, setActiveTab] = useState('none'); // 'none' | 'email' | 'whatsapp'

  const eventUrl = `${window.location.origin}/conference-checkin?event=${encodeURIComponent(event.id || event.conferenceName)}`;

  useEffect(() => {
    // Generate crisp QR code
    QRCode.toDataURL(eventUrl, {
      width: 500,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR Generation Error:', err));
  }, [eventUrl]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Generate ultra high-res 1200x780 PNG canvas for download and email
  const generateHighResCanvasDataUrl = async () => {
    if (!qrDataUrl) return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 780;
    const ctx = canvas.getContext('2d');

    // 1. Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle background circle in top right
    ctx.fillStyle = 'rgba(2, 132, 199, 0.04)';
    ctx.beginPath();
    ctx.arc(1080, 100, 90, 0, Math.PI * 2);
    ctx.fill();

    // Outer border
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 1160, 740);

    // 2. Logo Icon & Name
    const logoX = 70;
    const logoY = 80;
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    const nodes = [
      { x: logoX + 30, y: logoY - 20 },
      { x: logoX + 60, y: logoY - 5 },
      { x: logoX + 65, y: logoY + 25 },
      { x: logoX + 40, y: logoY + 45 },
      { x: logoX + 10, y: logoY + 35 },
      { x: logoX + 5, y: logoY + 5 }
    ];
    ctx.beginPath();
    nodes.forEach((n, idx) => {
      if (idx === 0) ctx.moveTo(n.x, n.y);
      else ctx.lineTo(n.x, n.y);
    });
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(logoX + 35, logoY + 14, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#0284c7';
    ctx.fill();

    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
    });

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
    ctx.fillText('E M Y R I S', logoX + 85, logoY + 12);
    
    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
    ctx.fillText('BIOLIFESCIENCES', logoX + 87, logoY + 28);

    ctx.fillStyle = '#0284c7';
    ctx.font = 'italic 13px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Enhancing Life, Excelling in Care', logoX + 87, logoY + 46);

    // 3. For Healthcare Professionals Badge
    const badgeX = 70;
    const badgeY = 175;
    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, 320, 36, 18);
    ctx.fill();

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
    ctx.fillText('FOR HEALTHCARE PROFESSIONALS', badgeX + 22, badgeY + 23);

    // 4. Main Headline
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 44px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Doctor Details', 70, 270);
    ctx.fillText('Registration Form', 70, 325);

    // Cyan underline
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.roundRect(70, 345, 120, 6, 3);
    ctx.fill();

    // 5. Conference details badge
    if (event.conferenceName) {
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.roundRect(70, 375, 480, 42, 8);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
      const loc = event.city ? ` • ${event.city}${event.state ? `, ${event.state}` : ''}` : '';
      ctx.fillText(`📍 ${event.conferenceName}${loc}`, 85, 402);
    }

    // 6. Subtext
    ctx.fillStyle = '#475569';
    ctx.font = '500 20px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Please scan the QR code to', 70, 460);
    ctx.fillText('share your details with us.', 70, 490);

    ctx.fillStyle = '#64748b';
    ctx.font = '16px "Segoe UI", Arial, sans-serif';
    ctx.fillText('It only takes a moment.', 70, 535);

    // 7. Right Side QR Card Box
    const cardX = 680;
    const cardY = 140;
    const cardW = 440;
    const cardH = 500;

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 24);
    ctx.fill();
    ctx.stroke();

    // Draw QR Code Image (Guaranteed async load)
    const qrImg = new Image();
    await new Promise((resolve) => {
      qrImg.onload = resolve;
      qrImg.src = qrDataUrl;
    });
    ctx.drawImage(qrImg, cardX + 45, cardY + 45, 350, 350);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 17px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCAN TO FILL', cardX + cardW / 2, cardY + 435);

    ctx.fillStyle = '#64748b';
    ctx.font = '15px "Segoe UI", Arial, sans-serif';
    ctx.fillText('your details securely', cardX + cardW / 2, cardY + 460);
    ctx.textAlign = 'left';

    // 8. Bottom Navy Ribbon
    const footerY = 690;
    const footerH = 70;
    ctx.fillStyle = '#0f2744';
    ctx.fillRect(20, footerY, 1160, footerH);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
    ctx.fillText('THANK YOU', 60, footerY + 42);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '15px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Enhancing Life, Excelling in Care', 240, footerY + 41);

    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.roundRect(1080, footerY + 34, 70, 6, 3);
    ctx.fill();

    return canvas.toDataURL('image/png');
  };

  const handleDownload = async () => {
    const dataUrl = await generateHighResCanvasDataUrl();
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    const cleanName = (event.conferenceName || 'Conference').replace(/[^a-zA-Z0-9_-]/g, '_');
    a.download = `${cleanName}_QR_Standee.png`;
    a.click();
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setIsSendingEmail(true);
    setEmailStatus('');
    try {
      const cardImageData = await generateHighResCanvasDataUrl();
      const res = await adminFetch('/api/admin/share-standee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput,
          conferenceName: event.conferenceName,
          city: event.city,
          state: event.state,
          eventUrl,
          cardImageData
        })
      });
      const data = await res.json();
      if (data.success) {
        setEmailStatus('✅ Standee card sent successfully to team email!');
        setEmailInput('');
      } else {
        setEmailStatus(`❌ Error: ${data.error || 'Failed to send'}`);
      }
    } catch (err) {
      setEmailStatus('❌ Error sending email. Check network.');
    }
    setIsSendingEmail(false);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Team,\n\nHere is the official Doctor Registration Standee QR link for *${event.conferenceName || 'Medical Conference'}* (${event.city || ''}, ${event.state || ''}):\n\n🔗 ${eventUrl}\n\nPlease display the printed standee at the conference stall for doctor check-ins.\n\n— Emyris Biolifesciences`
    );
    const cleanPhone = whatsappPhone.replace(/[^0-9]/g, '');
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  // Render via React Portal on document.body to ensure it floats above all navbars and layout containers
  return createPortal(
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999999, // Float above all navbars and headers
        padding: '12px'
      }}
    >
      <div style={{
        background: '#ffffff',
        borderRadius: '14px',
        maxWidth: '760px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        {/* ── TOP ACTION BAR (ALWAYS VISIBLE & PROMINENT) ── */}
        <div style={{
          background: '#0f172a',
          color: '#ffffff',
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          flexShrink: 0
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🖼 Doctor Registration Standee & QR
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {event.conferenceName} ({event.city}, {event.state})
            </span>
          </div>

          {/* Action Buttons Right at Top */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              onClick={handleDownload}
              style={{
                background: '#0284c7',
                color: '#fff',
                border: 'none',
                padding: '7px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              📥 Download PNG
            </button>

            <button 
              type="button" 
              onClick={() => setActiveTab(activeTab === 'whatsapp' ? 'none' : 'whatsapp')}
              style={{
                background: '#25D366',
                color: '#fff',
                border: 'none',
                padding: '7px 12px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              💬 WhatsApp
            </button>

            <button 
              type="button" 
              onClick={() => setActiveTab(activeTab === 'email' ? 'none' : 'email')}
              style={{
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                padding: '7px 12px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              📧 Email
            </button>

            {/* HIGHLY VISIBLE RED CLOSE BUTTON */}
            <button 
              type="button" 
              onClick={onClose}
              style={{
                background: '#dc2626',
                color: '#ffffff',
                border: 'none',
                padding: '7px 14px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
              title="Close Standee Window"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* ── EXPANDABLE SHARING CONTROLS ── */}
        {activeTab === 'whatsapp' && (
          <div style={{ background: '#f0fdf4', borderBottom: '1px solid #bbf7d0', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#166534' }}>
              WhatsApp Coordinator Number:
            </span>
            <input 
              type="text" 
              placeholder="e.g. 919876543210 (with country code)" 
              value={whatsappPhone}
              onChange={(e) => setWhatsappPhone(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #86efac', fontSize: '0.88rem', minWidth: '240px' }}
            />
            <button 
              type="button" 
              onClick={handleShareWhatsApp}
              style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Open WhatsApp Chat
            </button>
            <button 
              type="button" 
              onClick={() => setActiveTab('none')}
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Cancel
            </button>
          </div>
        )}

        {activeTab === 'email' && (
          <form onSubmit={handleSendEmail} style={{ background: '#eff6ff', borderBottom: '1px solid #bfdbfe', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#1e40af' }}>
              Send Standee Graphic to Email:
            </span>
            <input 
              type="email" 
              placeholder="e.g. coordinator@emyrisbio.com" 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #93c5fd', fontSize: '0.88rem', minWidth: '240px' }}
            />
            <button 
              type="submit" 
              disabled={isSendingEmail}
              style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              {isSendingEmail ? 'Sending...' : 'Send Attachment'}
            </button>
            {emailStatus && (
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: emailStatus.startsWith('✅') ? '#16a34a' : '#dc2626' }}>
                {emailStatus}
              </span>
            )}
            <button 
              type="button" 
              onClick={() => setActiveTab('none')}
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Cancel
            </button>
          </form>
        )}

        {/* ── SCROLLABLE PREVIEW AREA: PURE HTML/CSS STANDEE CARD ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#f1f5f9', display: 'flex', justifyContent: 'center' }}>
          
          {/* THE STANDEE CARD (Matching User Sample Image) */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #cbd5e1',
            width: '100%',
            maxWidth: '700px',
            boxShadow: '0 15px 25px -5px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            
            {/* Card Main Body */}
            <div style={{ padding: '22px 24px 18px', display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              
              {/* Left Column: Branding & Headlines */}
              <div style={{ flex: '1 1 300px' }}>
                
                {/* Logo & Tagline */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <img src="/images/assets/logo.png" alt="Emyris" style={{ height: '44px', objectFit: 'contain' }} />
                  <div>
                    <h2 style={{ margin: 0, fontSize: '19px', fontWeight: '900', color: '#0284c7', letterSpacing: '1px', lineHeight: 1.1 }}>
                      EMYRIS
                    </h2>
                    <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#0369a1', letterSpacing: '1.5px', display: 'block' }}>
                      BIOLIFESCIENCES
                    </span>
                    <span style={{ fontSize: '10px', fontStyle: 'italic', color: '#0284c7' }}>
                      Enhancing Life, Excelling in Care
                    </span>
                  </div>
                </div>

                {/* Pill Badge */}
                <div style={{
                  display: 'inline-block',
                  background: '#e0f2fe',
                  color: '#0284c7',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '10px',
                  fontWeight: '800',
                  letterSpacing: '0.5px',
                  marginBottom: '12px'
                }}>
                  FOR HEALTHCARE PROFESSIONALS
                </div>

                {/* Title */}
                <h1 style={{
                  margin: '0 0 8px',
                  fontSize: '24px',
                  fontWeight: '900',
                  color: '#0f172a',
                  lineHeight: '1.2'
                }}>
                  Doctor Details<br/>Registration Form
                </h1>

                {/* Cyan Accent Bar */}
                <div style={{ width: '60px', height: '4px', background: '#06b6d4', borderRadius: '2px', marginBottom: '12px' }} />

                {/* Conference Tag */}
                {event.conferenceName && (
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    marginBottom: '12px',
                    display: 'inline-block'
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>
                      📍 {event.conferenceName}
                    </span>
                    {(event.city || event.state) && (
                      <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '6px' }}>
                        • {event.city}{event.state ? `, ${event.state}` : ''}
                      </span>
                    )}
                  </div>
                )}

                <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '500', color: '#475569' }}>
                  Please scan the QR code to share your details with us.
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                  It only takes a moment.
                </p>
              </div>

              {/* Right Column: QR Code Standee Card Box */}
              <div style={{
                flex: '0 0 230px',
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '14px',
                padding: '14px',
                textAlign: 'center',
                boxShadow: '0 8px 14px -3px rgba(0,0,0,0.06)'
              }}>
                {/* QR Code Image */}
                {qrDataUrl ? (
                  <img 
                    src={qrDataUrl} 
                    alt="Scan to Register" 
                    style={{ width: '180px', height: '180px', objectFit: 'contain', display: 'block', margin: '0 auto 8px' }} 
                  />
                ) : (
                  <div style={{ width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', margin: '0 auto 8px' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>Generating QR...</span>
                  </div>
                )}

                <h4 style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: '900', color: '#0f172a', letterSpacing: '0.5px' }}>
                  SCAN TO FILL
                </h4>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>
                  your details securely
                </p>
              </div>

            </div>

            {/* Bottom Navy Footer Ribbon */}
            <div style={{
              background: '#0f2744',
              color: '#ffffff',
              padding: '10px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                THANK YOU
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>
                Enhancing Life, Excelling in Care
              </span>
              <div style={{ width: '35px', height: '3px', background: '#06b6d4', borderRadius: '2px' }} />
            </div>

          </div>
        </div>

        {/* ── BOTTOM TOOLBAR WITH CLEAR CLOSE BUTTON ── */}
        <div style={{
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          padding: '10px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            💡 Press <kbd style={{ background: '#e2e8f0', padding: '2px 5px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>Esc</kbd> or click outside to dismiss
          </span>
          <button 
            type="button" 
            onClick={onClose}
            style={{
              background: '#475569',
              color: '#ffffff',
              border: 'none',
              padding: '7px 18px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            ✕ Close Window
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
