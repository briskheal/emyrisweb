import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function CopyProofShield() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      document.body.classList.add('admin-mode');
      return;
    } else {
      document.body.classList.remove('admin-mode');
    }

    const triggerAlert = () => {
      setShowSecurityAlert(true);
      setTimeout(() => setShowSecurityAlert(false), 3000);
    };

    // 1. Disable Right-Click Context Menu
    const handleContextMenu = (e) => {
      // Allow right-click inside form inputs
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) {
        return;
      }
      e.preventDefault();
      triggerAlert();
    };

    // 2. Prevent Image Dragging
    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    // 3. Intercept Keyboard Shortcuts (Copy, PrintScreen, DevTools, View Source, Print)
    const handleKeyDown = (e) => {
      // PrintScreen Key
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('⚠️ Content protected by Emyris BioLifesciences security policy.');
        }
        triggerAlert();
      }

      // Ctrl/Cmd shortcuts
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        // Allow Copy/Paste inside input fields
        const isInput = ['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable;

        if (['c', 'x'].includes(key) && !isInput) {
          e.preventDefault();
          triggerAlert();
        }
        // View Source (Ctrl+U), Save (Ctrl+S), Print (Ctrl+P)
        if (['u', 's', 'p'].includes(key)) {
          e.preventDefault();
          triggerAlert();
        }
      }

      // DevTools (F12 or Ctrl+Shift+I / Cmd+Opt+I)
      if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))) {
        e.preventDefault();
        triggerAlert();
      }
    };

    // 4. Intercept PrintScreen on KeyUp as well
    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('⚠️ Content protected by Emyris BioLifesciences security policy.');
        }
        triggerAlert();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isAdmin]);

  if (isAdmin || !showSecurityAlert) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '25px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#002345',
      color: '#ffffff',
      padding: '12px 24px',
      borderRadius: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
      border: '2px solid #52cbcb',
      zIndex: 999999,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontFamily: "'Outfit', sans-serif",
      fontSize: '0.95rem',
      fontWeight: '600',
      animation: 'fadeInOut 0.3s ease'
    }}>
      <span style={{ fontSize: '1.2rem' }}>🛡️</span>
      <span>Content Protection Active: Copying, screenshots, and printing are disabled.</span>
    </div>
  );
}

export default CopyProofShield;
