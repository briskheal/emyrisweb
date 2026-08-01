import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

/**
 * Reusable reCAPTCHA v2 wrapper component.
 * Usage: <CaptchaBox onVerify={setToken} onExpire={() => setToken(null)} />
 * The parent must gate form submission on token being non-null.
 */
function CaptchaBox({ onVerify, onExpire }) {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    console.warn('VITE_RECAPTCHA_SITE_KEY not set. CAPTCHA disabled.');
    // Auto-verify so form still works in dev without keys
    if (onVerify) onVerify('dev-bypass');
    return null;
  }

  return (
    <div style={{ margin: '1rem 0' }}>
      <ReCAPTCHA
        sitekey={siteKey}
        theme="dark"
        onChange={onVerify}
        onExpired={onExpire}
      />
    </div>
  );
}

export default CaptchaBox;
