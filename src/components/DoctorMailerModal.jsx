import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export default function DoctorMailerModal({ visitors, selectedIds, onClose, adminFetch }) {
  // Determine initial recipient pool
  const hasSelection = selectedIds && selectedIds.length > 0;
  const [recipientMode, setRecipientMode] = useState(hasSelection ? 'selected' : 'all'); // 'all' | 'selected'
  
  const [subject, setSubject] = useState('Update & Study Material from Emyris Biolifesciences for Dr. {doctor_name}');
  const [bodyMessage, setBodyMessage] = useState(
`Dear Dr. {doctor_name},

Thank you for visiting us and connecting with Emyris Biolifesciences at {conference}.

As discussed, we are pleased to share our latest product updates and scientific study material for your review. Please find the attached document for your reference.

Should you require any further clinical data or product samples, please feel free to connect with our medical affairs team.

Warm regards,
Medical Affairs Team
Emyris Biolifesciences
www.emyrisbio.com | contact@emyrisbio.com`
  );

  const [attachment, setAttachment] = useState(null); // { filename, content: base64 }
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Compute recipients based on mode
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const pool = recipientMode === 'selected' && hasSelection
    ? visitors.filter(v => selectedIds.includes(v.id))
    : visitors;

  const validRecipients = pool.filter(v => v.email && emailRegex.test(v.email.trim()));
  const invalidRecipients = pool.filter(v => !v.email || !emailRegex.test(v.email.trim()));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setAttachment(null);
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      alert('File size exceeds 15MB. Please choose a smaller PDF or document.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachment({
        filename: file.name,
        content: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (validRecipients.length === 0) {
      alert('No valid doctor email addresses found in the chosen recipient list.');
      return;
    }

    if (!confirm(`Are you sure you want to send this email to ${validRecipients.length} doctor(s)?\n(Zoho safe sending with 2.5s delay per email will begin)`)) {
      return;
    }

    setIsSending(true);
    setErrorMessage('');
    setSendResult(null);

    try {
      // Convert plain newlines to HTML paragraphs/breaks
      const formattedBodyHtml = bodyMessage
        .split('\n\n')
        .map(p => `<p style="margin: 0 0 12px 0;">${p.replace(/\n/g, '<br/>')}</p>`)
        .join('');

      const res = await adminFetch('/api/admin/send-doctor-mailer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: pool.map(dr => ({
            id: dr.id,
            name: dr.name,
            email: dr.email,
            conferenceName: dr.conferenceName
          })),
          subject,
          bodyHtml: formattedBodyHtml,
          attachment
        })
      });

      const data = await res.json();
      if (data.success) {
        setSendResult(data.results);
      } else {
        setErrorMessage(data.error || 'Failed to dispatch emails.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network error while dispatching emails.');
    } finally {
      setIsSending(false);
    }
  };

  return createPortal(
    <div 
      onClick={(e) => { if (e.target === e.currentTarget && !isSending) onClose(); }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.82)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999999,
        padding: '16px'
      }}
    >
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        maxWidth: '720px',
        width: '100%',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid #cbd5e1',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: '#0f172a',
          color: '#ffffff',
          padding: '14px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ✉️ Doctor Mailer Notification Box
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Send personalized email notifications & study material via Zoho SMTP
            </span>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            disabled={isSending}
            style={{
              background: '#dc2626',
              color: '#ffffff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              cursor: isSending ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              opacity: isSending ? 0.6 : 1
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Recipient Target Selection */}
          <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 'bold', color: '#1e293b', display: 'block', marginBottom: '8px' }}>
              🎯 Target Doctors:
            </span>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer', margin: 0 }}>
                <input 
                  type="radio" 
                  name="recipientMode" 
                  value="all" 
                  checked={recipientMode === 'all'} 
                  onChange={() => setRecipientMode('all')} 
                  disabled={isSending}
                />
                All Doctors ({visitors.length})
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: hasSelection ? 'pointer' : 'not-allowed', margin: 0, color: hasSelection ? '#1e293b' : '#94a3b8' }}>
                <input 
                  type="radio" 
                  name="recipientMode" 
                  value="selected" 
                  checked={recipientMode === 'selected'} 
                  onChange={() => setRecipientMode('selected')} 
                  disabled={!hasSelection || isSending}
                />
                Only Selected Table Doctors ({selectedIds ? selectedIds.length : 0})
              </label>
            </div>

            {/* Email Verification Badges */}
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.78rem' }}>
              <span style={{ background: '#dcfce7', color: '#166534', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                ✅ {validRecipients.length} Deliverable Valid Email(s)
              </span>
              {invalidRecipients.length > 0 && (
                <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                  ⚠️ {invalidRecipients.length} Missing/Invalid Email (Auto-Skipped)
                </span>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Subject */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                Email Subject:
              </label>
              <input 
                type="text" 
                required 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                disabled={isSending}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                💡 Tip: Use <code>&#123;doctor_name&#125;</code> to insert the doctor's name dynamically.
              </span>
            </div>

            {/* Content Box */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                Message Content:
              </label>
              <textarea 
                rows="7" 
                required 
                value={bodyMessage} 
                onChange={(e) => setBodyMessage(e.target.value)} 
                disabled={isSending}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontFamily: 'inherit', lineHeight: '1.5' }}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                💡 Dynamic tags: <code>&#123;doctor_name&#125;</code> for doctor's name, <code>&#123;conference&#125;</code> for conference name.
              </span>
            </div>

            {/* Study Material / Attachment */}
            <div style={{ background: '#f1f5f9', padding: '12px 14px', borderRadius: '8px', border: '1px dashed #94a3b8' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}>
                📎 Attach Study Material / Document (Optional):
              </label>
              <input 
                type="file" 
                onChange={handleFileChange} 
                disabled={isSending}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
                style={{ fontSize: '0.85rem' }}
              />
              {attachment && (
                <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#0284c7', fontWeight: 'bold' }}>
                  Attached: {attachment.filename}
                </div>
              )}
            </div>

            {/* Live Progress / Results */}
            {isSending && (
              <div style={{ background: '#e0f2fe', padding: '12px', borderRadius: '8px', border: '1px solid #7dd3fc', textAlign: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: '#0369a1', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                  🚀 Sending emails via Zoho SMTP...
                </span>
                <span style={{ fontSize: '0.8rem', color: '#0284c7' }}>
                  Please do not close this window. Throttling at 2.5 seconds per doctor to protect your Zoho quota.
                </span>
              </div>
            )}

            {sendResult && (
              <div style={{ background: '#f0fdf4', padding: '12px 16px', borderRadius: '8px', border: '1px solid #86efac' }}>
                <h4 style={{ margin: '0 0 6px', color: '#166534', fontSize: '0.95rem' }}>
                  🎉 Dispatch Completed Successfully!
                </h4>
                <div style={{ fontSize: '0.85rem', color: '#15803d' }}>
                  • <strong>{sendResult.sent}</strong> email(s) successfully delivered.<br/>
                  • <strong>{sendResult.skipped}</strong> invalid email(s) skipped.<br/>
                  {sendResult.failed > 0 && <span>• <strong>{sendResult.failed}</strong> failed.<br/></span>}
                </div>
              </div>
            )}

            {errorMessage && (
              <div style={{ background: '#fee2e2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: '0.85rem' }}>
                ❌ {errorMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
              <button 
                type="button" 
                onClick={onClose} 
                disabled={isSending}
                style={{ background: '#64748b', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: isSending ? 'not-allowed' : 'pointer' }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSending || validRecipients.length === 0}
                style={{
                  background: isSending || validRecipients.length === 0 ? '#94a3b8' : '#0284c7',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 22px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  cursor: isSending || validRecipients.length === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isSending ? 'Sending in Progress...' : `🚀 Send to ${validRecipients.length} Doctor(s)`}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>,
    document.body
  );
}
