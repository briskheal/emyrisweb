import defaultSiteData from './defaultSiteData.json';
import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [siteData, setSiteData] = useState(defaultSiteData);

  // Load from database on mount, fallback to local storage
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        const data = await res.json();
        if (data.success && data.branding && data.pages) {
          const merged = {
            ...siteData,
            ...data.branding,
            ...data.pages
          };
          setSiteData(merged);
          localStorage.setItem('emyrisSiteData', JSON.stringify(merged));
          console.log("✅ Config successfully loaded from server DB.");
        }
      } catch (err) {
        console.warn("⚠️ Failed to fetch config from server, falling back to localStorage/defaults:", err);
        const savedData = localStorage.getItem('emyrisSiteData');
        if (savedData) {
          setSiteData(JSON.parse(savedData));
        }
      }
    };
    fetchConfig();
  }, []);

  const updateSiteData = (newData) => {
    // Optimistic UI update only (does NOT hit the server)
    const updated = { ...siteData, ...newData };
    setSiteData(updated);
    localStorage.setItem('emyrisSiteData', JSON.stringify(updated));
  };

  const saveConfigToServer = async (newDataToSave = siteData) => {
    // Partition keys to synchronize to the database
    const brandingKeys = [
      'logo', 'companyName', 'contactNumber', 'email', 'address', 'tollFree',
      'headerColor', 'footerColor', 'headerTextColor', 'footerTextColor', 'socialLinks', 'youtubeVideoId'
    ];
    const pagesKeys = ['slides', 'discover', 'offerings', 'services', 'advisors', 'doctors', 'enhancers', 'testimonials', 'logisticPartners', 'markets', 'blogs'];

    let hasBranding = false;
    let hasPages = false;

    Object.keys(newDataToSave).forEach(key => {
      if (brandingKeys.includes(key)) {
        hasBranding = true;
      }
      if (pagesKeys.includes(key)) {
        hasPages = true;
      }
    });

    try {
      // Read admin token stored in sessionStorage after login
      const adminToken = sessionStorage.getItem('emyrisAdminToken') || '';
      const adminHeaders = {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken
      };

      if (hasBranding) {
        const brandingData = {};
        brandingKeys.forEach(k => { brandingData[k] = newDataToSave[k]; });
        await fetch('/api/admin/config', {
          method: 'POST',
          headers: adminHeaders,
          body: JSON.stringify({ type: 'branding', data: brandingData })
        });
      }

      if (hasPages) {
        const pagesData = {};
        pagesKeys.forEach(k => { pagesData[k] = newDataToSave[k]; });
        await fetch('/api/admin/config', {
          method: 'POST',
          headers: adminHeaders,
          body: JSON.stringify({ type: 'pages', data: pagesData })
        });
      }
      console.log("✅ Successfully saved configuration to server.");
      return true;
    } catch (err) {
      console.warn("Server synchronization failed, saved locally:", err);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{ siteData, updateSiteData, saveConfigToServer }}>
      {children}
    </AppContext.Provider>
  );
};
