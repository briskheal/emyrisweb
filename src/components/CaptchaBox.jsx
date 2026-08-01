/**
 * reCAPTCHA v3 utility hook.
 * Usage in any form component:
 *   const getRecaptchaToken = useRecaptcha();
 *   const token = await getRecaptchaToken('contact_form');
 *   // send token with form data to backend
 *
 * v3 is invisible — no checkbox, no user friction.
 * The GoogleReCaptchaProvider in main.jsx handles the script loading.
 */
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export function useRecaptcha() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getToken = async (action = 'submit') => {
    if (!executeRecaptcha) {
      console.warn('reCAPTCHA not loaded yet');
      return null;
    }
    try {
      const token = await executeRecaptcha(action);
      return token;
    } catch (err) {
      console.error('reCAPTCHA execute error:', err);
      return null;
    }
  };

  return getToken;
}

export default useRecaptcha;
