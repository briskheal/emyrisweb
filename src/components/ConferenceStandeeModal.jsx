import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export default function ConferenceStandeeModal({ event, onClose, adminFetch }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);
  const canvasRef = useRef(null);

  const eventUrl = `${window.location.origin}/conference-checkin?event=${encodeURIComponent(event.id || event.conferenceName)}`;

  useEffect(() => {
    // Generate QR Code data URL
    QRCode.toDataURL(eventUrl, {
      width: 450,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' }
    })
      .then(url => {
        setQrDataUrl(url);
      })
      .catch(err => console.error('QR Generation Error:', err));
  }, [eventUrl]);

  // Render high-res printable standee on canvas
  const drawStandeeOnCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !qrDataUrl) return null;
    const ctx = canvas.getContext('2d');
    
    // Canvas dimensions: 1200 x 780 (High-res landscape standee card)
    canvas.width = 1200;
    canvas.height = 780;

    // Background: clean white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle background medical cross icon in top right
    ctx.fillStyle = 'rgba(2, 132, 199, 0.04)';
    ctx.beginPath();
    ctx.arc(1080, 100, 90, 0, Math.PI * 2);
    ctx.fill();

    // Outer border rounded container
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 1160, 740);

    // ── 1. LOGO & COMPANY NAME ──
    // Draw Emyris Molecule Logo Icon
    const logoX = 70;
    const logoY = 80;
    
    // Draw outer nodes & connecting lines
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

    // Central core hexagon
    ctx.beginPath();
    ctx.arc(logoX + 35, logoY + 14, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#0284c7';
    ctx.fill();

    // Circular nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
    });

    // Company Name Text
    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
    ctx.fillText('E M Y R I S', logoX + 85, logoY + 12);
    
    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
    ctx.fillText('BIOLIFESCIENCES', logoX + 87, logoY + 28);

    ctx.fillStyle = '#0284c7';
    ctx.font = 'italic 13px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Enhancing Life, Excelling in Care', logoX + 87, logoY + 46);

    // ── 2. FOR HEALTHCARE PROFESSIONALS BADGE ──
    const badgeX = 70;
    const badgeY = 175;
    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, 320, 36, 18);
    ctx.fill();

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
    ctx.fillText('FOR HEALTHCARE PROFESSIONALS', badgeX + 22, badgeY + 23);

    // ── 3. MAIN TITLE ──
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 44px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Doctor Details', 70, 270);
    ctx.fillText('Registration Form', 70, 325);

    // Cyan accent underline
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.roundRect(70, 345, 120, 6, 3);
    ctx.fill();

    // ── 4. CONFERENCE DETAIL SUB-BADGE ──
    if (event.conferenceName) {
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.roundRect(70, 375, 460, 40, 8);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
      const loc = event.city ? ` • ${event.city}${event.state ? `, ${event.state}` : ''}` : '';
      ctx.fillText(`📍 ${event.conferenceName}${loc}`, 85, 400);
    }

    // ── 5. SUBTEXT ──
    ctx.fillStyle = '#475569';
    ctx.font = '500 20px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Please scan the QR code to', 70, 455);
    ctx.fillText('share your details with us.', 70, 485);

    ctx.fillStyle = '#64748b';
    ctx.font = '16px "Segoe UI", Arial, sans-serif';
    ctx.fillText('It only takes a moment.', 70, 535);

    // ── 6. RIGHT SIDE QR CARD CONTAINER ──
    const cardX = 680;
    const cardY = 140;
    const cardW = 440;
    const cardH = 500;

    // Outer card rounded box
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 24);
    ctx.fill();
    ctx.stroke();

    // Draw QR Code Image
    const qrImg = new Image();
    qrImg.src = qrDataUrl;
    ctx.drawImage(qrImg, cardX + 45, cardY + 45, 350, 350);

    // Text below QR code
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 17px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCAN TO FILL', cardX + cardW / 2, cardY + 435);

    ctx.fillStyle = '#64748b';
    ctx.font = '15px "Segoe UI", Arial, sans-serif';
    ctx.fillText('your details securely', cardX + cardW / 2, cardY + 460);
    ctx.textAlign = 'left';

    // ── 7. BOTTOM NAVY FOOTER RIBBON ──
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

    // Cyan indicator pill at right of footer
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.roundRect(1080, footerY + 34, 70, 6, 3);
    ctx.fill();

    return canvas.toDataURL('image/png');
  };

  useEffect(() => {
    if (qrDataUrl) {
      setTimeout(() => {
        drawStandeeOnCanvas();
      }, 100);
    }
  }, [qrDataUrl, event]);

  const handleDownload = () => {
    const dataUrl = drawStandeeOnCanvas();
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    const filename = `${(event.conferenceName || 'Conference').replace(/[^a-zA-Z0-9_-]/g, '_')}_QR_Standee.png`;
    a.download = filename;
    a.click();
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setIsSendingEmail(true);
    setEmailStatus('');
    try {
      const cardImageData = drawStandeeOnCanvas();
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
        setEmailStatus('✅ Standee card successfully sent to team email!');
        setEmailInput('');
      } else {
        setEmailStatus(`❌ Error: ${data.error || 'Failed to send'}`);
      }
    } catch (err) {
      setEmailStatus('❌ Error sending email. Please check network.');
    }
    setIsSendingEmail(false);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Team,\n\nHere is the official Doctor Registration Form QR link for *${event.conferenceName || 'Medical Conference'}* (${event.city || ''}, ${event.state || ''}):\n\n🔗 ${eventUrl}\n\nPlease display the printed standee at the stall for doctor check-ins.\n\n— Emyris Biolifesciences`
    );
    const cleanPhone = whatsappPhone.replace(/[^0-9]/g, '');
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99999,
      padding: '1rem'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        maxWidth: '850px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '1.75rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.35rem', color: '#0f172a', fontWeight: 'bold' }}>
              🖼 Official Doctor Registration Standee
            </h3>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.88rem' }}>
              Event: <strong style={{ color: '#0284c7' }}>{event.conferenceName}</strong> ({event.city}, {event.state})
            </p>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}
          >
            ✕
          </button>
        </div>

        {/* Standee Canvas Preview */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <canvas 
            ref={canvasRef} 
            style={{ 
              maxWidth: '100%', 
              height: 'auto', 
              borderRadius: '8px', 
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              background: '#fff' 
            }} 
          />
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <button 
            type="button" 
            onClick={handleDownload} 
            className="btn" 
            style={{ background: '#0284c7', padding: '10px 20px', fontSize: '0.92rem', borderRadius: '8px' }}
          >
            📥 Download High-Res Standee (PNG)
          </button>
          <button 
            type="button" 
            onClick={() => setShowShareOptions(!showShareOptions)} 
            className="btn" 
            style={{ background: '#10b981', padding: '10px 20px', fontSize: '0.92rem', borderRadius: '8px' }}
          >
            🚀 Share with Team
          </button>
          <button 
            type="button" 
            onClick={() => window.open(eventUrl, '_blank')} 
            className="btn-outline" 
            style={{ padding: '8px 16px', fontSize: '0.9rem', borderRadius: '8px', alignSelf: 'center' }}
          >
            🔗 Open Link
          </button>
        </div>

        {/* Share Options Panel */}
        {showShareOptions && (
          <div style={{ background: '#f1f5f9', padding: '1.25rem', borderRadius: '12px', marginTop: '1rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#0f172a' }}>
              Share Standee & QR with Field Team
            </h4>

            {/* Email Option */}
            <form onSubmit={handleSendEmail} style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>
                📧 Send Printable Graphic to Team Email:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="email" 
                  placeholder="e.g., coordinator@emyrisbio.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <button 
                  type="submit" 
                  disabled={isSendingEmail} 
                  style={{ background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 18px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {isSendingEmail ? 'Sending...' : 'Send Email'}
                </button>
              </div>
              {emailStatus && (
                <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: emailStatus.startsWith('✅') ? '#10b981' : '#ef4444' }}>
                  {emailStatus}
                </p>
              )}
            </form>

            {/* WhatsApp Option */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>
                💬 Share via WhatsApp (with Country Code):
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="e.g. 919876543210 (or leave empty to pick in WhatsApp)"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <button 
                  type="button" 
                  onClick={handleShareWhatsApp}
                  style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 18px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Open WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
