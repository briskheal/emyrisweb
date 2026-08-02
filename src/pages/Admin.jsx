import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';

// Modern Visual Rich Text Editor (WYSIWYG) Component
function WYSIWYGEditor({ value, onChange, idx, onImageUpload }) {
  const [showHtml, setShowHtml] = useState(false);
  const editorRef = useRef(null);

  // Sync value from parent prop to contentEditable innerHTML without losing cursor position
  useEffect(() => {
    if (editorRef.current && !showHtml) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, showHtml]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      if (html !== value) {
        onChange(html);
      }
    }
  };

  const toggleHtmlMode = () => {
    if (!showHtml && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    setShowHtml(!showHtml);
  };

  const handleInsertImageTag = (imgUrl) => {
    const imgHtml = `<p style="text-align: center;"><img src="${imgUrl}" style="max-width: 85%; border-radius: 12px; margin: 15px auto; display: block; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" /></p>`;
    if (showHtml) {
      onChange((value || '') + '\n' + imgHtml);
    } else {
      if (editorRef.current) {
        editorRef.current.focus();
        const inserted = document.execCommand('insertHTML', false, imgHtml);
        if (!inserted) {
          editorRef.current.innerHTML += imgHtml;
        }
        handleInput();
      } else {
        onChange((value || '') + imgHtml);
      }
    }
  };

  const execCmd = (command, arg = '') => {
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleLink = () => {
    const url = prompt("Enter Link URL:", "https://");
    if (url) {
      execCmd("createLink", url);
    }
  };

  const handleImage = () => {
    const url = prompt("Enter Image URL:", "https://");
    if (url) {
      handleInsertImageTag(url);
    }
  };

  const handleImageAlign = (alignment) => {
    const selection = window.getSelection();
    let imgNode = null;
    if (selection && selection.anchorNode) {
      if (selection.anchorNode.nodeName === 'IMG') {
        imgNode = selection.anchorNode;
      } else if (selection.anchorNode.parentElement && selection.anchorNode.parentElement.nodeName === 'IMG') {
        imgNode = selection.anchorNode.parentElement;
      }
    }
    if (!imgNode && editorRef.current) {
      const imgs = editorRef.current.querySelectorAll('img');
      if (imgs.length > 0) imgNode = imgs[imgs.length - 1];
    }

    if (imgNode) {
      if (alignment === 'left') {
        imgNode.style.cssText = 'float: left; margin: 0 18px 18px 0; max-width: 48%; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);';
      } else if (alignment === 'right') {
        imgNode.style.cssText = 'float: right; margin: 0 0 18px 18px; max-width: 48%; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);';
      } else if (alignment === 'center') {
        imgNode.style.cssText = 'display: block; margin: 20px auto; max-width: 90%; border-radius: 12px; box-shadow: 0 6px 16px rgba(0,0,0,0.1); float: none; clear: both;';
      }
      handleInput();
    } else {
      alert('Please select or insert an image first to format its alignment.');
    }
  };

  return (
    <div className="wysiwyg-editor-container" style={{ border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden', background: '#f8fafc', marginTop: '0.8rem' }}>
      {/* Editor Toolbar */}
      <div className="wysiwyg-editor-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '8px 12px', background: '#f1f5f9', borderBottom: '1px solid var(--glass-border)', alignItems: 'center' }}>
        <button type="button" className="toolbar-btn" onClick={() => execCmd('bold')} title="Bold" style={{ fontWeight: 'bold' }}>B</button>
        <button type="button" className="toolbar-btn" onClick={() => execCmd('italic')} title="Italic" style={{ fontStyle: 'italic' }}>I</button>
        <button type="button" className="toolbar-btn" onClick={() => execCmd('underline')} title="Underline" style={{ textDecoration: 'underline' }}>U</button>
        <button type="button" className="toolbar-btn" onClick={() => execCmd('strikeThrough')} title="Strikethrough" style={{ textDecoration: 'line-through' }}>S</button>
        
        <span style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 4px' }} />
        
        <button type="button" className="toolbar-btn" onClick={() => execCmd('formatBlock', '<p>')} title="Paragraph">Para</button>
        <button type="button" className="toolbar-btn" onClick={() => execCmd('formatBlock', '<h1>')} title="Heading 1" style={{ fontWeight: 'bold' }}>H1</button>
        <button type="button" className="toolbar-btn" onClick={() => execCmd('formatBlock', '<h2>')} title="Heading 2" style={{ fontWeight: 'bold' }}>H2</button>
        <button type="button" className="toolbar-btn" onClick={() => execCmd('formatBlock', '<h3>')} title="Heading 3" style={{ fontWeight: 'bold' }}>H3</button>
        
        <span style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 4px' }} />
        
        <button type="button" className="toolbar-btn" onClick={() => execCmd('justifyLeft')} title="Align Left">Align L</button>
        <button type="button" className="toolbar-btn" onClick={() => execCmd('justifyCenter')} title="Align Center">Align C</button>
        <button type="button" className="toolbar-btn" onClick={() => execCmd('justifyRight')} title="Align Right">Align R</button>
        <button type="button" className="toolbar-btn" onClick={() => execCmd('justifyFull')} title="Justify">Justify</button>
        
        <span style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 4px' }} />
        
        <button type="button" className="toolbar-btn" onClick={() => handleImageAlign('left')} title="Float Image Left">🖼️ Pic Left</button>
        <button type="button" className="toolbar-btn" onClick={() => handleImageAlign('center')} title="Center Image">🖼️ Pic Center</button>
        <button type="button" className="toolbar-btn" onClick={() => handleImageAlign('right')} title="Float Image Right">🖼️ Pic Right</button>
        
        <span style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 4px' }} />
        
        <button type="button" className="toolbar-btn" onClick={() => execCmd('insertUnorderedList')} title="Bullet List">• List</button>
        <button type="button" className="toolbar-btn" onClick={() => execCmd('insertOrderedList')} title="Numbered List">1. List</button>
        
        <span style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 4px' }} />
        
        <button type="button" className="toolbar-btn" onClick={handleLink} title="Insert Link">🔗 Link</button>
        <button type="button" className="toolbar-btn" onClick={handleImage} title="Insert Image Link">🖼️ Image Link</button>
        
        {onImageUpload && (
          <button type="button" className="toolbar-btn upload" onClick={() => onImageUpload(idx, handleInsertImageTag)} title="Upload Image & Insert">📤 Upload Photo</button>
        )}
        
        <button type="button" className="toolbar-btn" onClick={() => execCmd('removeFormat')} title="Clear Formatting">🧹 Clear</button>
        
        <button 
          type="button" 
          className="toolbar-btn mode-toggle" 
          style={{ marginLeft: 'auto', background: showHtml ? '#e2e8f0' : 'transparent', fontWeight: 'bold' }}
          onClick={toggleHtmlMode}
          title="Toggle HTML Source"
        >
          {showHtml ? '👁️ Rich Text' : '💻 HTML Code'}
        </button>
      </div>

      {/* Editor Content Area */}
      {showHtml ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows="10"
          style={{ 
            width: '100%', 
            padding: '15px', 
            border: 'none', 
            background: '#0f172a', 
            color: '#38bdf8', 
            fontFamily: 'monospace', 
            fontSize: '0.9rem', 
            resize: 'vertical', 
            display: 'block', 
            outline: 'none',
            margin: 0
          }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          style={{ 
            minHeight: '220px', 
            padding: '15px', 
            background: 'white', 
            color: '#1e293b', 
            outline: 'none', 
            overflowY: 'auto' 
          }}
          placeholder="Type slide page details content here..."
        />
      )}
    </div>
  );
}

// Image compression utility to bypass Vercel limits & speed up loading
const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
            type: 'image/webp',
            lastModified: Date.now(),
          });
          resolve(newFile);
        }, 'image/webp', quality);
      };
    };
  });
};

function Admin() {
  const { siteData, updateSiteData, saveConfigToServer } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('Profile');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminCreds, setAdminCreds] = useState({ adminId: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Data lists from DB
  const [inquiries, setInquiries] = useState([]);
  const [careers, setCareers] = useState([]);
  const [selectedInquiries, setSelectedInquiries] = useState([]);
  const [selectedCareers, setSelectedCareers] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  // File uploading states
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingSlideIdx, setUploadingSlideIdx] = useState(null);
  const [uploadingOfferingIdx, setUploadingOfferingIdx] = useState(null);

  // Social links save state
  const [savingSocials, setSavingSocials] = useState(false);
  const [socialSaved, setSocialSaved] = useState(false);

  // --- NEW SAVE FUNCTIONS ---
  const [savingProfile, setSavingProfile] = useState(false);
  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      await saveConfigToServer(siteData);
      alert("✅ Profile settings saved successfully!");
    } catch (err) { alert("❌ Failed to save profile settings."); }
    setSavingProfile(false);
  };

  const [savingBranding, setSavingBranding] = useState(false);
  const saveBranding = async () => {
    setSavingBranding(true);
    try {
      await saveConfigToServer(siteData);
      alert("✅ Branding colors saved successfully!");
    } catch (err) { alert("❌ Failed to save branding colors."); }
    setSavingBranding(false);
  };

  const [savingDiscover, setSavingDiscover] = useState(false);
  const saveDiscover = async () => {
    setSavingDiscover(true);
    try {
      await saveConfigToServer(siteData);
      alert("✅ Discover page content saved successfully!");
    } catch (err) { alert("❌ Failed to save discover page content."); }
    setSavingDiscover(false);
  };

  const [savingOfferings, setSavingOfferings] = useState(false);
  const saveOfferings = async () => {
    setSavingOfferings(true);
    try {
      await saveConfigToServer(siteData);
      alert("✅ Offerings saved successfully!");
    } catch (err) { alert("❌ Failed to save offerings."); }
    setSavingOfferings(false);
  };

  const [savingServices, setSavingServices] = useState(false);
  const saveServices = async () => {
    setSavingServices(true);
    try {
      await saveConfigToServer(siteData);
      alert("✅ Services saved successfully!");
    } catch (err) { alert("❌ Failed to save services."); }
    setSavingServices(false);
  };

  const [savingTestimonials, setSavingTestimonials] = useState(false);
  const saveTestimonials = async () => {
    setSavingTestimonials(true);
    try {
      await saveConfigToServer(siteData);
      alert("✅ Testimonials saved successfully!");
    } catch (err) { alert("❌ Failed to save testimonials."); }
    setSavingTestimonials(false);
  };

  const [savingPartners, setSavingPartners] = useState(false);
  const savePartners = async () => {
    setSavingPartners(true);
    try {
      await saveConfigToServer(siteData);
      alert("✅ Logistic partners saved successfully!");
    } catch (err) { alert("❌ Failed to save partners."); }
    setSavingPartners(false);
  };

  const saveSocials = async () => {
    setSavingSocials(true);
    setSocialSaved(false);
    try {
      updateSiteData({ socialLinks: siteData.socialLinks });
      await saveConfigToServer({ ...siteData, socialLinks: siteData.socialLinks });
      setSocialSaved(true);
      setTimeout(() => setSocialSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to save social links.');
    } finally {
      setSavingSocials(false);
    }
  };

  // Slide editing local buffering states
  const [editedSlides, setEditedSlides] = useState([]);
  const [savingSlides, setSavingSlides] = useState(false);

  useEffect(() => {
    if (siteData.slides) {
      setEditedSlides(siteData.slides);
    }
  }, [siteData.slides]);

  // Advisors editing local buffering states
  const [editedAdvisors, setEditedAdvisors] = useState([]);
  const [savingAdvisors, setSavingAdvisors] = useState(false);
  const [uploadingAdvisorIdx, setUploadingAdvisorIdx] = useState(null);

  useEffect(() => {
    if (siteData.advisors) {
      setEditedAdvisors(siteData.advisors);
    }
  }, [siteData.advisors]);

  // Doctors editing local buffering states
  const [editedDoctors, setEditedDoctors] = useState([]);
  const [savingDoctors, setSavingDoctors] = useState(false);
  const [uploadingDoctorIdx, setUploadingDoctorIdx] = useState(null);

  useEffect(() => {
    if (siteData.doctors) {
      setEditedDoctors(siteData.doctors);
    }
  }, [siteData.doctors]);

  // Business Enhancers editing local buffering states
  const [editedEnhancers, setEditedEnhancers] = useState([]);
  const [savingEnhancers, setSavingEnhancers] = useState(false);
  const [uploadingEnhancerIdx, setUploadingEnhancerIdx] = useState(null);

  useEffect(() => {
    if (siteData.enhancers) {
      setEditedEnhancers(siteData.enhancers);
    }
  }, [siteData.enhancers]);

  // Markets local buffering states
  const [editedMarkets, setEditedMarkets] = useState([]);
  const [savingMarkets, setSavingMarkets] = useState(false);
  const [showMarketsList, setShowMarketsList] = useState(false);

  useEffect(() => {
    if (siteData.markets) {
      setEditedMarkets(siteData.markets);
    }
  }, [siteData.markets]);

  // Blogs local buffering states
  const [editedBlogs, setEditedBlogs] = useState([]);
  const [savingBlogs, setSavingBlogs] = useState(false);
  const [uploadingBlogIdx, setUploadingBlogIdx] = useState(null);
  const [uploadingBlogPicIdx, setUploadingBlogPicIdx] = useState(null);
  const [editingBlogIdx, setEditingBlogIdx] = useState(null);

  useEffect(() => {
    if (siteData.blogs) {
      setEditedBlogs(siteData.blogs);
    }
  }, [siteData.blogs]);


  // Check login on mount
  useEffect(() => {
    if (sessionStorage.getItem('emyrisAdminLoggedIn') === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Helper: fetch with admin token header automatically attached
  const adminFetch = (url, options = {}) => {
    const token = sessionStorage.getItem('emyrisAdminToken') || '';
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        'x-admin-token': token
      }
    });
  };

  // Fetch tables when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchAdminData();
    }
  }, [isLoggedIn]);

  const fetchAdminData = async () => {
    setLoadingList(true);
    try {
      // Inquiries
      const inqRes = await adminFetch('/api/admin/inquiries');
      const inqData = await inqRes.json();
      if (inqData.success) {
        setInquiries(inqData.inquiries);
      } else {
        // Localstorage fallback
        setInquiries(JSON.parse(localStorage.getItem('emyrisInquiries') || '[]'));
      }

      // Careers
      const carRes = await adminFetch('/api/admin/careers');
      const carData = await carRes.json();
      if (carData.success) {
        setCareers(carData.applications);
      } else {
        // Localstorage fallback
        setCareers(JSON.parse(localStorage.getItem('emyrisCareers') || '[]'));
      }
    } catch (err) {
      console.warn("Could not load data from backend server, falling back to LocalStorage:", err);
      setInquiries(JSON.parse(localStorage.getItem('emyrisInquiries') || '[]'));
      setCareers(JSON.parse(localStorage.getItem('emyrisCareers') || '[]'));
    } finally {
      setLoadingList(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminCreds)
      });
      const data = await res.json();
      if (data.success) {
        // Store the admin secret token for all subsequent admin API calls
        const adminToken = import.meta.env.VITE_ADMIN_SECRET_TOKEN || '';
        sessionStorage.setItem('emyrisAdminLoggedIn', 'true');
        sessionStorage.setItem('emyrisAdminToken', adminToken);
        setIsLoggedIn(true);
      } else {
        setLoginError(data.message || 'Invalid Credentials');
      }
    } catch (err) {
      setLoginError('Incorrect credentials or connection failed.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('emyrisAdminLoggedIn');
  };

  // State Change handlers
  const handleProfileChange = (e) => {
    updateSiteData({ [e.target.name]: e.target.value });
  };

  const handleSocialChange = (e) => {
    const updatedSocials = {
      ...siteData.socialLinks,
      [e.target.name]: e.target.value
    };
    updateSiteData({ socialLinks: updatedSocials });
  };

  const handleColorChange = (e) => {
    updateSiteData({ [e.target.name]: e.target.value });
  };

  const handleDiscoverText = (index, val) => {
    const newParagraphs = [...siteData.discover.paragraphs];
    newParagraphs[index] = val;
    updateSiteData({ discover: { ...siteData.discover, paragraphs: newParagraphs } });
  };

  const handleOfferingChange = (index, field, val) => {
    const newOfferings = [...siteData.offerings];
    newOfferings[index] = { ...newOfferings[index], [field]: val };
    updateSiteData({ offerings: newOfferings });
  };

  const addOffering = () => {
    const newOfferings = [
      ...(siteData.offerings || []),
      { 
        title: 'New Offering', slug: `new-offering-${Date.now()}`, image: '', icon: '🌟', accentColor: '#3b82f6', 
        tagline: '', highlights: [], desc: [''], products: [] 
      }
    ];
    updateSiteData({ offerings: newOfferings });
  };

  const deleteOffering = (index) => {
    if (window.confirm("Are you sure you want to delete this entire offering?")) {
      const newOfferings = (siteData.offerings || []).filter((_, idx) => idx !== index);
      updateSiteData({ offerings: newOfferings });
    }
  };

  const handleProductChange = (oIdx, pIdx, field, val) => {
    const newOfferings = [...siteData.offerings];
    const newProducts = [...(newOfferings[oIdx].products || [])];
    newProducts[pIdx] = { ...newProducts[pIdx], [field]: val };
    newOfferings[oIdx] = { ...newOfferings[oIdx], products: newProducts };
    updateSiteData({ offerings: newOfferings });
  };

  const addProductToOffering = (oIdx) => {
    const newOfferings = [...siteData.offerings];
    newOfferings[oIdx].products = [...(newOfferings[oIdx].products || []), { therapy: '', genericName: '', moleculeName: '' }];
    updateSiteData({ offerings: newOfferings });
  };

  const deleteProductFromOffering = (oIdx, pIdx) => {
    const newOfferings = [...siteData.offerings];
    newOfferings[oIdx].products = (newOfferings[oIdx].products || []).filter((_, idx) => idx !== pIdx);
    updateSiteData({ offerings: newOfferings });
  };

  const handleServiceChange = (index, field, val) => {
    const newServices = [...siteData.services];
    newServices[index] = { ...newServices[index], [field]: val };
    updateSiteData({ services: newServices });
  };

  const handleTestimonialChange = (index, field, val) => {
    const newTestimonials = [...(siteData.testimonials || [])];
    newTestimonials[index] = { ...newTestimonials[index], [field]: val };
    updateSiteData({ testimonials: newTestimonials });
  };

  const addTestimonial = () => {
    const newTestimonials = [
      ...(siteData.testimonials || []),
      { id: Date.now(), name: '', role: '', company: '', quote: '' }
    ];
    updateSiteData({ testimonials: newTestimonials });
  };

  const deleteTestimonial = (index) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      const newTestimonials = (siteData.testimonials || []).filter((_, idx) => idx !== index);
      updateSiteData({ testimonials: newTestimonials });
    }
  };

  const handlePartnerChange = (index, field, val) => {
    const newPartners = [...(siteData.logisticPartners || [])];
    newPartners[index] = { ...newPartners[index], [field]: val };
    updateSiteData({ logisticPartners: newPartners });
  };

  const addPartner = () => {
    const newPartners = [
      ...(siteData.logisticPartners || []),
      { id: Date.now(), name: '', scope: '', icon: '📦' }
    ];
    updateSiteData({ logisticPartners: newPartners });
  };

  const deletePartner = (index) => {
    if (window.confirm("Are you sure you want to delete this logistics partner?")) {
      const newPartners = (siteData.logisticPartners || []).filter((_, idx) => idx !== index);
      updateSiteData({ logisticPartners: newPartners });
    }
  };

  const handleSlideChange = (index, field, val) => {
    setEditedSlides(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const saveSlides = async () => {
    setSavingSlides(true);
    try {
      updateSiteData({ slides: editedSlides });
      await saveConfigToServer({ ...siteData, slides: editedSlides });
      alert("✅ Slide configuration saved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save slide configuration.");
    } finally {
      setSavingSlides(false);
    }
  };

  const handleAdvisorChange = (index, field, val) => {
    let finalVal = val;
    if (field === 'dob' && finalVal) {
      let cleaned = finalVal.replace(/[^\d-]/g, '');
      if (cleaned.length === 2 && !cleaned.includes('-')) cleaned += '-';
      else if (cleaned.length > 2 && !cleaned.includes('-')) cleaned = cleaned.substring(0, 2) + '-' + cleaned.substring(2);
      finalVal = cleaned.substring(0, 5);
    }
    setEditedAdvisors(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: finalVal };
      return next;
    });
  };

  const saveAdvisors = async () => {
    setSavingAdvisors(true);
    try {
      updateSiteData({ advisors: editedAdvisors });
      await saveConfigToServer({ ...siteData, advisors: editedAdvisors });
      alert("✅ Advisors team saved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save advisors team.");
    } finally {
      setSavingAdvisors(false);
    }
  };

  const handleAdvisorImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAdvisorIdx(index);
    try {
      const compressedFile = await compressImage(file);
      const formData = new FormData();
      formData.append('file', compressedFile);

      const res = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        handleAdvisorChange(index, 'image', data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Error uploading advisor photo.');
    } finally {
      setUploadingAdvisorIdx(null);
    }
  };

  const addAdvisor = () => {
    setEditedAdvisors(prev => [
      ...(prev || []),
      { id: Date.now(), name: '', role: '', image: '', bio: '' }
    ]);
  };

  const deleteAdvisor = (index) => {
    if (window.confirm("Are you sure you want to remove this advisor?")) {
      setEditedAdvisors(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  const handleDoctorChange = (index, field, val) => {
    let finalVal = val;
    if (field === 'dob' && finalVal) {
      let cleaned = finalVal.replace(/[^\d-]/g, '');
      if (cleaned.length === 2 && !cleaned.includes('-')) cleaned += '-';
      else if (cleaned.length > 2 && !cleaned.includes('-')) cleaned = cleaned.substring(0, 2) + '-' + cleaned.substring(2);
      finalVal = cleaned.substring(0, 5);
    }
    setEditedDoctors(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: finalVal };
      return next;
    });
  };

  const saveDoctors = async () => {
    setSavingDoctors(true);
    try {
      updateSiteData({ doctors: editedDoctors });
      await saveConfigToServer({ ...siteData, doctors: editedDoctors });
      alert("✅ Doctors team saved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save doctors team.");
    } finally {
      setSavingDoctors(false);
    }
  };

  const handleDoctorImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingDoctorIdx(index);
    try {
      const compressedFile = await compressImage(file);
      const formData = new FormData();
      formData.append('file', compressedFile);

      const res = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        handleDoctorChange(index, 'image', data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Error uploading doctor photo.');
    } finally {
      setUploadingDoctorIdx(null);
    }
  };

  const addDoctor = () => {
    setEditedDoctors(prev => [
      ...(prev || []),
      { id: Date.now(), name: '', role: '', image: '', bio: '' }
    ]);
  };

  const deleteDoctor = (index) => {
    if (window.confirm("Are you sure you want to remove this doctor?")) {
      setEditedDoctors(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  const handleEnhancerChange = (index, field, val) => {
    let finalVal = val;
    if (field === 'dob' && finalVal) {
      let cleaned = finalVal.replace(/[^\d-]/g, '');
      if (cleaned.length === 2 && !cleaned.includes('-')) cleaned += '-';
      else if (cleaned.length > 2 && !cleaned.includes('-')) cleaned = cleaned.substring(0, 2) + '-' + cleaned.substring(2);
      finalVal = cleaned.substring(0, 5);
    }
    setEditedEnhancers(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: finalVal };
      return next;
    });
  };

  const saveEnhancers = async () => {
    setSavingEnhancers(true);
    try {
      updateSiteData({ enhancers: editedEnhancers });
      await saveConfigToServer({ ...siteData, enhancers: editedEnhancers });
      alert("✅ Business Enhancers saved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save business enhancers.");
    } finally {
      setSavingEnhancers(false);
    }
  };

  const handleMarketChange = (index, field, val) => {
    setEditedMarkets(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const saveMarketsAdmin = async () => {
    setSavingMarkets(true);
    try {
      const cleanedMarkets = editedMarkets.map(m => {
        const { isNew, ...rest } = m;
        return rest;
      });
      updateSiteData({ markets: cleanedMarkets });
      await saveConfigToServer({ ...siteData, markets: cleanedMarkets });
      setEditedMarkets(cleanedMarkets);
      alert("✅ Markets saved successfully!");
    } catch (err) {
      alert("❌ Failed to save markets.");
    } finally {
      setSavingMarkets(false);
    }
  };

  const fetchCoordinatesForMarket = async (index) => {
    const market = editedMarkets[index];
    if (!market.name) return alert('Please enter a City / Market name first.');
    
    const isDuplicate = editedMarkets.some((m, i) => i !== index && m.name.toLowerCase().trim() === market.name.toLowerCase().trim());
    if (isDuplicate) {
      alert(`A market with the name "${market.name}" already exists!`);
      return;
    }

    try {
      const query = `${market.name}${market.state ? `, ${market.state}` : ''}, India`;
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        handleMarketChange(index, 'lat', data[0].lat);
        handleMarketChange(index, 'lng', data[0].lon);
      } else {
        alert('❌ Could not find coordinates for this location. Please enter manually.');
      }
    } catch (err) {
      alert('❌ Error fetching coordinates.');
    }
  };

  const addMarket = () => {
    setEditedMarkets(prev => [
      { id: Date.now(), name: '', state: '', lat: '', lng: '', status: 'Active', isNew: true },
      ...(prev || [])
    ]);
  };

  const deleteMarket = (index) => {
    if (window.confirm("Are you sure you want to remove this market location?")) {
      setEditedMarkets(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  const handleEnhancerImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingEnhancerIdx(index);
    try {
      const compressedFile = await compressImage(file);
      const formData = new FormData();
      formData.append('file', compressedFile);

      const res = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        handleEnhancerChange(index, 'image', data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Error uploading enhancer photo.');
    } finally {
      setUploadingEnhancerIdx(null);
    }
  };

  const addEnhancer = () => {
    setEditedEnhancers(prev => [
      ...(prev || []),
      { id: Date.now(), name: '', role: '', image: '', bio: '' }
    ]);
  };

  const deleteEnhancer = (index) => {
    if (window.confirm("Are you sure you want to remove this business enhancer?")) {
      setEditedEnhancers(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  const handleBlogChange = (index, field, val) => {
    setEditedBlogs(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleBlogContentChange = (bIdx, pIdx, val) => {
    setEditedBlogs(prev => {
      const next = [...prev];
      const newContent = [...(next[bIdx].content || [])];
      newContent[pIdx] = val;
      next[bIdx] = { ...next[bIdx], content: newContent };
      return next;
    });
  };

  const addBlogContentParagraph = (bIdx) => {
    setEditedBlogs(prev => {
      const next = [...prev];
      const newContent = [...(next[bIdx].content || []), ''];
      next[bIdx] = { ...next[bIdx], content: newContent };
      return next;
    });
  };

  const deleteBlogContentParagraph = (bIdx, pIdx) => {
    setEditedBlogs(prev => {
      const next = [...prev];
      const newContent = (next[bIdx].content || []).filter((_, idx) => idx !== pIdx);
      next[bIdx] = { ...next[bIdx], content: newContent };
      return next;
    });
  };

  const addBlog = () => {
    setEditedBlogs(prev => [
      ...prev,
      {
        id: Date.now(),
        title: 'New Blog Post',
        slug: `new-blog-${Date.now()}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        author: 'Admin',
        category: 'General',
        image: '',
        content: [''],
        status: 'draft',
        publishDate: ''
      }
    ]);
  };

  const deleteBlog = (index) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      setEditedBlogs(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  const saveBlogs = async () => {
    setSavingBlogs(true);
    try {
      await saveConfigToServer({ ...siteData, blogs: editedBlogs });
      alert("✅ Blog posts saved successfully!");
    } catch (err) {
      alert("❌ Failed to save blog posts.");
    }
    setSavingBlogs(false);
  };

  const handleBlogImageUpload = async (e, index) => {
    const rawFile = e.target.files[0];
    if (!rawFile) return;
    setUploadingBlogIdx(index);
    const file = await compressImage(rawFile, 1200, 1200, 0.82);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        handleBlogChange(index, 'image', data.url);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setUploadingBlogIdx(null);
    }
  };

  const handleBlogPicUpload = async (e, index) => {
    const rawFile = e.target.files[0];
    if (!rawFile) return;
    setUploadingBlogPicIdx(index);
    const file = await compressImage(rawFile, 1200, 1200, 0.82);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && (data.url || data.secure_url)) {
        handleBlogChange(index, 'blogpic', data.url || data.secure_url);
        alert("✅ Uploaded blogpic! You can click '⚡ Paste Link into Editor' or '📋 Copy Link' below.");
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setUploadingBlogPicIdx(null);
    }
  };


  const handleEditorImageUpload = async (index, insertCallbackOrRef) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const res = await adminFetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success && (data.url || data.secure_url)) {
          const imgUrl = data.url || data.secure_url;
          if (typeof insertCallbackOrRef === 'function') {
            insertCallbackOrRef(imgUrl);
          } else if (insertCallbackOrRef && insertCallbackOrRef.current) {
            insertCallbackOrRef.current.focus();
            const inserted = document.execCommand('insertImage', false, imgUrl);
            if (!inserted || !insertCallbackOrRef.current.innerHTML.includes(imgUrl)) {
              const imgHtml = `<p style="text-align: center;"><img src="${imgUrl}" style="max-width: 85%; border-radius: 12px; margin: 15px auto; display: block; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" /></p>`;
              insertCallbackOrRef.current.innerHTML += imgHtml;
            }
            handleSlideChange(index, 'details', insertCallbackOrRef.current.innerHTML);
          }
        } else {
          alert(data.error || 'Upload failed');
        }
      } catch (err) {
        alert('Error uploading image to local disk.');
      }
    };
    input.click();
  };

  const handleBlogEditorImageUpload = async (index, insertCallbackOrRef) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const rawFile = e.target.files[0];
      if (!rawFile) return;
      setUploadingBlogIdx(index);
      const file = await compressImage(rawFile, 1200, 1200, 0.82);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await adminFetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success && (data.url || data.secure_url)) {
          const imgUrl = data.url || data.secure_url;
          if (typeof insertCallbackOrRef === 'function') {
            insertCallbackOrRef(imgUrl);
          } else if (insertCallbackOrRef && insertCallbackOrRef.current) {
            insertCallbackOrRef.current.focus();
            const inserted = document.execCommand('insertImage', false, imgUrl);
            if (!inserted || !insertCallbackOrRef.current.innerHTML.includes(imgUrl)) {
              const imgHtml = `<p style="text-align: center;"><img src="${imgUrl}" style="max-width: 85%; border-radius: 12px; margin: 15px auto; display: block; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" /></p>`;
              insertCallbackOrRef.current.innerHTML += imgHtml;
            }
            handleBlogChange(index, 'content', insertCallbackOrRef.current.innerHTML);
          }
        } else {
          alert(data.error || 'Upload failed');
        }
      } catch (err) {
        console.error(err);
        alert('Error uploading image.');
      } finally {
        setUploadingBlogIdx(null);
      }
    };
    input.click();
  };

  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split('\n\n').map((para, pIdx) => {
      let html = para
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^\s*-\s*(.*?)$/gm, '<li>$1</li>');
      
      if (html.includes('<li>')) {
        return (
          <ul key={pIdx} style={{ paddingLeft: '1.5rem', marginBottom: '1rem', color: '#475569', textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: html }} />
        );
      }

      return (
        <p key={pIdx} style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#475569', textAlign: 'justify', marginBottom: '1rem' }} dangerouslySetInnerHTML={{ __html: html }} />
      );
    });
  };

  const renderPreview = (text) => {
    if (!text) return null;
    const isHtml = /<[a-z][\s\S]*>/i.test(text);
    if (isHtml) {
      return (
        <div 
          className="wysiwyg-content" 
          style={{ textAlign: 'justify', color: '#475569' }} 
          dangerouslySetInnerHTML={{ __html: text }} 
        />
      );
    }
    return renderMarkdown(text);
  };

  // Logo file upload using Cloudinary
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        updateSiteData({ logo: data.url });
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Error uploading logo. Running offline? Check server logs.');
    } finally {
      setUploadingLogo(false);
    }
  };

  // Slide Image Upload
  const handleSlideImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingSlideIdx(index);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        handleSlideChange(index, 'image', data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Error uploading slide image.');
    } finally {
      setUploadingSlideIdx(null);
    }
  };

  // Offering Banner Image Upload
  const handleOfferingImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingOfferingIdx(index);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        handleOfferingChange(index, 'image', data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Error uploading banner image.');
    } finally {
      setUploadingOfferingIdx(null);
    }
  };

  // Actions for Inquiry/Careers
  const handleBulkDeleteInquiries = async () => {
    if (selectedInquiries.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedInquiries.length} inquiries?`)) return;
    setLoadingList(true);
    for (const id of selectedInquiries) {
      try { await adminFetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' }); } catch (e) {}
    }
    setInquiries(inquiries.filter(i => !selectedInquiries.includes(i.id)));
    setSelectedInquiries([]);
    setLoadingList(false);
  };

  const handleBulkDeleteCareers = async () => {
    if (selectedCareers.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedCareers.length} applications?`)) return;
    setLoadingList(true);
    for (const id of selectedCareers) {
      try { await adminFetch(`/api/admin/careers/${id}`, { method: 'DELETE' }); } catch (e) {}
    }
    setCareers(careers.filter(c => !selectedCareers.includes(c.id)));
    setSelectedCareers([]);
    setLoadingList(false);
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const res = await adminFetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setInquiries(inquiries.filter(i => i.id !== id));
        setSelectedInquiries(selectedInquiries.filter(selId => selId !== id));
      }
    } catch (err) {
      // Local fallback delete
      const local = JSON.parse(localStorage.getItem('emyrisInquiries') || '[]');
      const filtered = local.filter(i => i.id !== id);
      localStorage.setItem('emyrisInquiries', JSON.stringify(filtered));
      setInquiries(filtered);
    }
  };

  const updateInquiryStatus = async (id, newStatus) => {
    try {
      const res = await adminFetch(`/api/admin/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i));
      }
    } catch (err) {
      // Local fallback
      const local = JSON.parse(localStorage.getItem('emyrisInquiries') || '[]');
      const updated = local.map(i => i.id === id ? { ...i, status: newStatus } : i);
      localStorage.setItem('emyrisInquiries', JSON.stringify(updated));
      setInquiries(updated);
    }
  };

  const deleteCareer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job application?")) return;
    try {
      const res = await adminFetch(`/api/admin/careers/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCareers(careers.filter(c => c.id !== id));
        setSelectedCareers(selectedCareers.filter(selId => selId !== id));
      }
    } catch (err) {
      // Local fallback delete
      const local = JSON.parse(localStorage.getItem('emyrisCareers') || '[]');
      const filtered = local.filter(c => c.id !== id);
      localStorage.setItem('emyrisCareers', JSON.stringify(filtered));
      setCareers(filtered);
    }
  };

  const updateCareerStatus = async (id, newStatus) => {
    try {
      const res = await adminFetch(`/api/admin/careers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setCareers(careers.map(c => c.id === id ? { ...c, status: newStatus } : c));
      }
    } catch (err) {
      // Local fallback
      const local = JSON.parse(localStorage.getItem('emyrisCareers') || '[]');
      const updated = local.map(c => c.id === id ? { ...c, status: newStatus } : c);
      localStorage.setItem('emyrisCareers', JSON.stringify(updated));
      setCareers(updated);
    }
  };

  // --- LOGIN PAGE RENDER ---
  if (!isLoggedIn) {
    return (
      <div className="page-container fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <div className="contact-form glass" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>Admin Portal</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
            Please log in to manage your site configuration, branding settings, and view user queries/careers.
          </p>
          <form className="admin-form" onSubmit={handleLoginSubmit} style={{ padding: 0 }}>
            {loginError && (
              <div style={{ padding: '10px 15px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '1.5rem' }}>
                {loginError}
              </div>
            )}
            <label>
              Admin ID
              <input 
                type="text" 
                value={adminCreds.adminId} 
                onChange={(e) => setAdminCreds({ ...adminCreds, adminId: e.target.value })} 
                placeholder="Enter Admin ID"
                required
                style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }}
              />
            </label>
            <label>
              Password
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={adminCreds.password} 
                  onChange={(e) => setAdminCreds({ ...adminCreds, password: e.target.value })} 
                  placeholder="Enter Password"
                  required
                  style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)', width: '100%', paddingRight: '2.5rem' }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ 
                    position: 'absolute', 
                    right: '10px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    background: 'transparent', 
                    border: 'none', 
                    cursor: 'pointer', 
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    color: 'var(--primary)',
                    zIndex: 10
                  }}
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>
            <button type="submit" className="btn" style={{ marginTop: '1.5rem', width: '100%' }}>
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- ADMIN PORTAL PANEL RENDER ---
  return (
    <div className="admin-layout fade-in">
      
      {/* Sidebar Navigation */}
      <div className="admin-sidebar glass">
        <h2>Admin Panel</h2>
        <ul>
          <li className={activeTab === 'Profile' ? 'active' : ''} onClick={() => setActiveTab('Profile')}>Company Profile</li>
          <li className={activeTab === 'Branding' ? 'active' : ''} onClick={() => setActiveTab('Branding')}>Header & Footer</li>
          <li className={activeTab === 'Socials' ? 'active' : ''} onClick={() => setActiveTab('Socials')}>Social Sites</li>
          <li className={activeTab === 'Slides' ? 'active' : ''} onClick={() => setActiveTab('Slides')}>Home Slider</li>
          <li className={activeTab === 'Discover' ? 'active' : ''} onClick={() => setActiveTab('Discover')}>Discover</li>
          <li className={activeTab === 'Offerings' ? 'active' : ''} onClick={() => setActiveTab('Offerings')}>Offerings</li>
          <li className={activeTab === 'Services' ? 'active' : ''} onClick={() => setActiveTab('Services')}>Services</li>
          <li className={activeTab === 'Testimonials' ? 'active' : ''} onClick={() => setActiveTab('Testimonials')}>Testimonials</li>
          <li className={activeTab === 'Markets' ? 'active' : ''} onClick={() => setActiveTab('Markets')}>Presence Markets</li>
          <li className={activeTab === 'Logistics' ? 'active' : ''} onClick={() => setActiveTab('Logistics')}>Logistic Partners</li>
          <li className={activeTab === 'Advisors' ? 'active' : ''} onClick={() => setActiveTab('Advisors')}>Our Advisors</li>
          <li className={activeTab === 'Doctors' ? 'active' : ''} onClick={() => setActiveTab('Doctors')}>Our Doctors</li>
          <li className={activeTab === 'Enhancers' ? 'active' : ''} onClick={() => setActiveTab('Enhancers')}>Business Enhancers</li>
          <li className={activeTab === 'Blogs' ? 'active' : ''} onClick={() => setActiveTab('Blogs')}>Blog Posts</li>
          <li className={activeTab === 'Inquiries' ? 'active' : ''} onClick={() => setActiveTab('Inquiries')}>
            Inquiries Inbox ({inquiries.length})
          </li>
          <li className={activeTab === 'Careers' ? 'active' : ''} onClick={() => setActiveTab('Careers')}>
            Applications ({careers.length})
          </li>
        </ul>
        <button className="btn-outline" style={{ marginTop: 'auto', alignSelf: 'stretch' }} onClick={handleLogout}>
          Log Out
        </button>
      </div>

      {/* Main Content Area */}
      <div className="admin-content glass">
        
        {/* TABS */}
        
        {/* Profile Control */}
        {activeTab === 'Profile' && (
          <div className="admin-section">
            <h3>Company Profile Settings</h3>
            <div className="admin-form" style={{ padding: 0 }}>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <img 
                  src={siteData.logo || '/vite.svg'} 
                  alt="Current Logo" 
                  width="80" 
                  height="80" 
                  style={{ objectFit: 'contain', border: '1px dashed var(--glass-border)', padding: '10px', borderRadius: '8px' }} 
                />
                <label style={{ flex: 1, margin: 0 }}>
                  Upload Logo (Local Storage)
                  <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploadingLogo} />
                  {uploadingLogo && <span style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>Uploading new logo to local disk...</span>}
                </label>
              </div>
              <label>Logo Image URL
                <input name="logo" value={siteData.logo || ''} onChange={handleProfileChange} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
              </label>
              <label>Company Name
                <input name="companyName" value={siteData.companyName || ''} onChange={handleProfileChange} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
              </label>
              <label>Office Address
                <textarea rows="3" name="address" value={siteData.address || ''} onChange={handleProfileChange} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ flex: 1 }}>Contact Hotline
                  <input name="contactNumber" value={siteData.contactNumber || ''} onChange={handleProfileChange} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                </label>
                <label style={{ flex: 1 }}>Toll-Free Number
                  <input name="tollFree" value={siteData.tollFree || ''} onChange={handleProfileChange} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                </label>
              </div>
              <label>Email Address
                <input name="email" value={siteData.email || ''} onChange={handleProfileChange} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
              <button className="btn" onClick={saveProfile} disabled={savingProfile} style={{ minWidth: '180px' }}>
                {savingProfile ? 'Saving...' : '💾 Save Profile Settings'}
              </button>
            </div>
          </div>
        )}

        {/* Branding & Style Colors */}
        {activeTab === 'Branding' && (
          <div className="admin-section">
            <h3>Header & Footer Color Schemes</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Choose a color pattern for your page header and footer. Updates reflect instantly across all pages in the app.
            </p>
            <div className="admin-form" style={{ padding: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                
                <div className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h4 style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Header (Navigation)</h4>
                  <label>Background Color
                    <input 
                      type="color" 
                      name="headerColor" 
                      value={siteData.headerColor || '#ffffff'} 
                      onChange={handleColorChange} 
                      style={{ height: '50px', cursor: 'pointer', padding: 0 }} 
                    />
                  </label>
                  <label>Text / Links Color
                    <input 
                      type="color" 
                      name="headerTextColor" 
                      value={siteData.headerTextColor || '#0f172a'} 
                      onChange={handleColorChange} 
                      style={{ height: '50px', cursor: 'pointer', padding: 0 }} 
                    />
                  </label>
                </div>

                <div className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h4 style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Footer Accent</h4>
                  <label>Background Color
                    <input 
                      type="color" 
                      name="footerColor" 
                      value={siteData.footerColor || '#0f172a'} 
                      onChange={handleColorChange} 
                      style={{ height: '50px', cursor: 'pointer', padding: 0 }} 
                    />
                  </label>
                  <label>Text & Titles Color
                    <input 
                      type="color" 
                      name="footerTextColor" 
                      value={siteData.footerTextColor || '#ffffff'} 
                      onChange={handleColorChange} 
                      style={{ height: '50px', cursor: 'pointer', padding: 0 }} 
                    />
                  </label>
                </div>

              </div>

              {/* YouTube Corporate Video ID Settings */}
              <div className="glass" style={{ padding: '2rem', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <h4 style={{ color: 'var(--primary)', fontWeight: 'bold', margin: 0 }}>YouTube Corporate Video</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                  Paste the full YouTube Video URL (e.g. `https://www.youtube.com/watch?v=ysz5S6PUM-U`) or just the 11-character Video ID (`ysz5S6PUM-U`). It will automatically embed properly on the landing page.
                </p>
                <label style={{ margin: 0 }}>
                  YouTube Video Link / ID
                  <input 
                    type="text" 
                    name="youtubeVideoId" 
                    value={siteData.youtubeVideoId || ''} 
                    onChange={handleProfileChange} 
                    placeholder="e.g. https://www.youtube.com/watch?v=..." 
                    style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)', marginTop: '0.5rem' }} 
                  />
                </label>
              </div>

            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
              <button className="btn" onClick={saveBranding} disabled={savingBranding} style={{ minWidth: '180px' }}>
                {savingBranding ? 'Saving...' : '💾 Save Branding Colors'}
              </button>
            </div>
          </div>
        )}

        {/* Social Links Setup */}
        {activeTab === 'Socials' && (
          <div className="admin-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.2rem' }}>
              <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Social Media Links</h3>
              <button
                className="btn"
                onClick={saveSocials}
                disabled={savingSocials}
                style={{ minWidth: '180px' }}
              >
                {savingSocials ? '⏳ Saving...' : socialSaved ? '✅ Saved!' : '💾 Save Social Links'}
              </button>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              These links populate the social media icons on your footer. Ensure you use complete URL syntax (including https://).
            </p>
            <div className="admin-form" style={{ padding: 0 }}>
              <label>🌐 Facebook URL
                <input name="facebook" value={siteData.socialLinks?.facebook || ''} onChange={handleSocialChange} placeholder="https://www.facebook.com/profile.php?id=61556130077286" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
              </label>
              <label>🐦 Twitter / X URL
                <input name="twitter" value={siteData.socialLinks?.twitter || ''} onChange={handleSocialChange} placeholder="https://x.com/emyrisbio" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
              </label>
              <label>📸 Instagram URL
                <input name="instagram" value={siteData.socialLinks?.instagram || ''} onChange={handleSocialChange} placeholder="https://instagram.com/emyrisbio" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
              </label>
              <label>💼 LinkedIn URL
                <input name="linkedin" value={siteData.socialLinks?.linkedin || ''} onChange={handleSocialChange} placeholder="https://linkedin.com/company/emyrisbio" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
              </label>
              <label>▶️ YouTube Channel URL
                <input name="youtube" value={siteData.socialLinks?.youtube || ''} onChange={handleSocialChange} placeholder="https://youtube.com/@emyrisbio" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
              </label>
              <label>💬 WhatsApp Number (with country code)
                <input name="whatsapp" value={siteData.socialLinks?.whatsapp || ''} onChange={handleSocialChange} placeholder="919993163300" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
              </label>
            </div>

            {/* Preview strip */}
            <div style={{ marginTop: '2rem', padding: '1.2rem 1.5rem', background: 'rgba(82, 203, 203,0.04)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Link Preview</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {siteData.socialLinks?.facebook && (
                  <a href={siteData.socialLinks.facebook} target="_blank" rel="noopener noreferrer" style={{ padding: '0.4rem 1rem', background: '#1877f2', color: '#fff', borderRadius: '50px', fontSize: '0.82rem', textDecoration: 'none', fontWeight: '700' }}>🌐 Facebook</a>
                )}
                {siteData.socialLinks?.twitter && (
                  <a href={siteData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" style={{ padding: '0.4rem 1rem', background: '#000000', color: '#fff', borderRadius: '50px', fontSize: '0.82rem', textDecoration: 'none', fontWeight: '700' }}>🐦 X / Twitter</a>
                )}
                {siteData.socialLinks?.instagram && (
                  <a href={siteData.socialLinks.instagram} target="_blank" rel="noopener noreferrer" style={{ padding: '0.4rem 1rem', background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color: '#fff', borderRadius: '50px', fontSize: '0.82rem', textDecoration: 'none', fontWeight: '700' }}>📸 Instagram</a>
                )}
                {siteData.socialLinks?.linkedin && (
                  <a href={siteData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{ padding: '0.4rem 1rem', background: '#0077b5', color: '#fff', borderRadius: '50px', fontSize: '0.82rem', textDecoration: 'none', fontWeight: '700' }}>💼 LinkedIn</a>
                )}
                {siteData.socialLinks?.youtube && (
                  <a href={siteData.socialLinks.youtube} target="_blank" rel="noopener noreferrer" style={{ padding: '0.4rem 1rem', background: '#ff0000', color: '#fff', borderRadius: '50px', fontSize: '0.82rem', textDecoration: 'none', fontWeight: '700' }}>▶️ YouTube</a>
                )}
                {siteData.socialLinks?.whatsapp && (
                  <a href={`https://wa.me/${siteData.socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ padding: '0.4rem 1rem', background: '#25d366', color: '#fff', borderRadius: '50px', fontSize: '0.82rem', textDecoration: 'none', fontWeight: '700' }}>💬 WhatsApp</a>
                )}
                {!Object.values(siteData.socialLinks || {}).some(Boolean) && (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No links added yet — fill in the fields above.</span>
                )}
              </div>
            </div>

            {/* Bottom save button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
              <button
                className="btn"
                onClick={saveSocials}
                disabled={savingSocials}
                style={{ minWidth: '200px', padding: '14px 28px', fontSize: '1rem' }}
              >
                {savingSocials ? '⏳ Saving...' : socialSaved ? '✅ Social Links Saved!' : '💾 Save Social Links'}
              </button>
            </div>
          </div>
        )}

        {/* Home Slider Control */}
        {activeTab === 'Slides' && (
          <div className="admin-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.2rem' }}>
              <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Homepage Slider Management</h3>
              <button 
                className="btn" 
                onClick={saveSlides} 
                disabled={savingSlides}
                style={{ minWidth: '180px' }}
              >
                {savingSlides ? 'Saving Changes...' : '💾 Save Slide Configuration'}
              </button>
            </div>
            
            <div className="admin-form" style={{ padding: 0, gap: '2.5rem', display: 'flex', flexDirection: 'column' }}>
              {editedSlides?.map((slide, idx) => (
                <div key={idx} className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h4 style={{ color: 'var(--primary)', fontWeight: 'bold', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', fontSize: '1.2rem' }}>
                    Slide #{idx + 1}: {slide.title || 'Untitled Slide'}
                  </h4>
                  
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <img 
                      src={slide.image || 'https://via.placeholder.com/150'} 
                      alt={`Slide ${idx + 1}`} 
                      style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--glass-border)' }} 
                    />
                    <label style={{ flex: 1, margin: 0 }}>
                      Change Slide Photo (Local Storage)
                      <input type="file" accept="image/*" onChange={(e) => handleSlideImageUpload(e, idx)} disabled={uploadingSlideIdx !== null} />
                      {uploadingSlideIdx === idx && <span style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>Uploading image to local disk...</span>}
                    </label>
                  </div>
                  
                  <label>Image URL
                    <input value={slide.image || ''} onChange={(e) => handleSlideChange(idx, 'image', e.target.value)} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                  </label>
                  <label>Title Text
                    <input value={slide.title || ''} onChange={(e) => handleSlideChange(idx, 'title', e.target.value)} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                  </label>
                  <label>Subtitle / Tenet Text
                    <textarea rows="3" value={slide.subtitle || ''} onChange={(e) => handleSlideChange(idx, 'subtitle', e.target.value)} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                  </label>

                  {/* Modern WYSIWYG Editor for details */}
                  <div style={{ marginTop: '1.2rem' }}>
                    <strong style={{ color: 'var(--primary)', fontSize: '0.95rem', display: 'block', marginBottom: '0.5rem' }}>
                      Details Page Content (Visual Rich Text Editor)
                    </strong>
                    <WYSIWYGEditor 
                      value={slide.details || ''} 
                      onChange={(val) => handleSlideChange(idx, 'details', val)}
                      idx={idx}
                      onImageUpload={handleEditorImageUpload}
                    />

                    {/* Live Preview Box */}
                    <div style={{ marginTop: '1.5rem', background: 'rgba(82, 203, 203, 0.02)', padding: '1.5rem', borderRadius: '8px', border: '1px dashed var(--glass-border)' }}>
                      <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.8rem' }}>LIVE PREVIEW (Styled & Justified)</strong>
                      <div className="glass" style={{ padding: '1.5rem', background: 'white', border: '1px solid rgba(82, 203, 203, 0.1)', minHeight: '80px', borderRadius: '8px' }}>
                        {renderPreview(slide.details)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
              <button 
                className="btn" 
                onClick={saveSlides} 
                disabled={savingSlides}
                style={{ minWidth: '180px' }}
              >
                {savingSlides ? 'Saving Changes...' : '💾 Save Slide Configuration'}
              </button>
            </div>
          </div>
        )}

        {/* Discover Page Content */}
        {activeTab === 'Discover' && (
          <div className="admin-section">
            <h3>Discover Page Control</h3>
            <div className="admin-form" style={{ padding: 0 }}>
              <label>Discover Section Header Title
                <input 
                  value={siteData.discover.title} 
                  onChange={(e) => updateSiteData({ discover: { ...siteData.discover, title: e.target.value } })} 
                  style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }}
                />
              </label>
              {siteData.discover.paragraphs.map((p, idx) => (
                <label key={idx}>About Us Paragraph {idx + 1}
                  <textarea rows="4" value={p} onChange={(e) => handleDiscoverText(idx, e.target.value)} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
              <button className="btn" onClick={saveDiscover} disabled={savingDiscover} style={{ minWidth: '180px' }}>
                {savingDiscover ? 'Saving...' : '💾 Save Discover Content'}
              </button>
            </div>
          </div>
        )}

        {/* Offerings Control */}
        {activeTab === 'Offerings' && (
          <div className="admin-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.2rem' }}>
              <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Offerings Page Control</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-outline" onClick={addOffering}>➕ Add Offering</button>
                <button type="button" className="btn" onClick={saveOfferings} disabled={savingOfferings}>
                  {savingOfferings ? 'Saving...' : '💾 Save Offerings'}
                </button>
              </div>
            </div>
            
            <div className="admin-form" style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {(siteData.offerings || []).map((off, idx) => (
                <div key={idx} className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                  <button 
                    type="button" 
                    onClick={() => deleteOffering(idx)} 
                    style={{ position: 'absolute', right: '2rem', top: '2rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    🗑️ Delete Offering
                  </button>
                  <h4 style={{ color: 'var(--primary)', fontWeight: 'bold', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', width: '70%', fontSize: '1.15rem' }}>
                    Offering #{idx + 1}: {off.title || 'New Offering'}
                  </h4>
                  
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    <label style={{ flex: 1, minWidth: '200px' }}>Title
                      <input value={off.title || ''} onChange={(e) => handleOfferingChange(idx, 'title', e.target.value)} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                    <label style={{ flex: 1, minWidth: '200px' }}>Slug (URL path)
                      <input value={off.slug || ''} onChange={(e) => handleOfferingChange(idx, 'slug', e.target.value)} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                    <label style={{ flex: 0.5, minWidth: '100px' }}>Icon (Emoji)
                      <input value={off.icon || '🌟'} onChange={(e) => handleOfferingChange(idx, 'icon', e.target.value)} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                    <label style={{ flex: 0.5, minWidth: '100px' }}>Theme Color
                      <input type="color" value={off.accentColor || '#3b82f6'} onChange={(e) => handleOfferingChange(idx, 'accentColor', e.target.value)} style={{ height: '42px', padding: '0', width: '100%', cursor: 'pointer' }} />
                    </label>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label>Banner Image URL (or upload below)
                      <input value={off.image || ''} onChange={(e) => handleOfferingChange(idx, 'image', e.target.value)} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Upload Banner Image (Local Storage)
                      <input type="file" accept="image/*" onChange={(e) => handleOfferingImageUpload(e, idx)} disabled={uploadingOfferingIdx !== null} style={{ marginTop: '0.25rem' }} />
                    </label>
                    {uploadingOfferingIdx === idx && <span style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>Uploading banner to local disk...</span>}
                  </div>
                  
                  <label>Tagline (Short Summary)
                    <input value={off.tagline || ''} onChange={(e) => handleOfferingChange(idx, 'tagline', e.target.value)} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                  </label>

                  <label>Main Content Paragraphs (one paragraph per line)
                    <textarea rows="5" value={(off.desc || []).join('\n')} onChange={(e) => handleOfferingChange(idx, 'desc', e.target.value.split('\n'))} placeholder="Enter paragraphs, separated by newlines..." style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                  </label>

                  {/* PRODUCTS MANAGER SECTION */}
                  <div style={{ marginTop: '1.5rem', background: 'rgba(82, 203, 203, 0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h5 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.05rem', fontWeight: '800' }}>Manage Products ({off.products ? off.products.length : 0})</h5>
                      <button type="button" className="btn-outline" onClick={() => addProductToOffering(idx)} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                        ➕ Add Product
                      </button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                      {(off.products || []).map((prod, pIdx) => (
                        <div key={pIdx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                          <input 
                            type="text" 
                            placeholder="Therapy / Category" 
                            value={prod.therapy || ''} 
                            onChange={(e) => handleProductChange(idx, pIdx, 'therapy', e.target.value)}
                            style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                          />
                          <input 
                            type="text" 
                            placeholder="Generic Name" 
                            value={prod.genericName || ''} 
                            onChange={(e) => handleProductChange(idx, pIdx, 'genericName', e.target.value)}
                            style={{ flex: 1.5, padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                          />
                          <input 
                            type="text" 
                            placeholder="Our Molecule Name" 
                            value={prod.moleculeName || ''} 
                            onChange={(e) => handleProductChange(idx, pIdx, 'moleculeName', e.target.value)}
                            style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                          />
                          <button 
                            type="button"
                            onClick={() => deleteProductFromOffering(idx, pIdx)}
                            title="Remove Product"
                            style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0 5px' }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {(!off.products || off.products.length === 0) && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No products added yet. Click "Add Product" to begin.</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
              <button className="btn" onClick={saveOfferings} disabled={savingOfferings} style={{ minWidth: '180px', padding: '14px 28px', fontSize: '1rem' }}>
                {savingOfferings ? 'Saving...' : '💾 Save Offerings'}
              </button>
            </div>
          </div>
        )}

        {/* Services Control */}
        {activeTab === 'Services' && (
          <div className="admin-section">
            <h3>Services Page Control</h3>
            <div className="admin-form" style={{ padding: 0 }}>
              {siteData.services.map((srv, idx) => (
                <div key={idx} className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                  <h4 style={{ color: 'var(--primary)' }}>Service Pillar #{idx + 1}</h4>
                  <label>Title <input value={srv.title} onChange={(e) => handleServiceChange(idx, 'title', e.target.value)} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} /></label>
                  <label>Description <textarea rows="3" value={srv.desc} onChange={(e) => handleServiceChange(idx, 'desc', e.target.value)} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} /></label>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
              <button className="btn" onClick={saveServices} disabled={savingServices} style={{ minWidth: '180px' }}>
                {savingServices ? 'Saving...' : '💾 Save Services'}
              </button>
            </div>
          </div>
        )}
        {/* Testimonials Control */}
        {activeTab === 'Testimonials' && (
          <div className="admin-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.2rem' }}>
              <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Client & Partner Testimonials</h3>
              <button type="button" className="btn" onClick={addTestimonial}>➕ Add Testimonial</button>
            </div>
            <div className="admin-form" style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {(siteData.testimonials || []).map((t, idx) => (
                <div key={idx} className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                  <button 
                    type="button" 
                    onClick={() => deleteTestimonial(idx)} 
                    style={{ position: 'absolute', right: '2rem', top: '2rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    🗑️ Delete Testimonial
                  </button>
                  <h4 style={{ color: 'var(--primary)', fontWeight: 'bold', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', width: '70%', fontSize: '1.15rem' }}>
                    Testimonial #{idx + 1}: {t.name || 'New Testimonial'}
                  </h4>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    <label style={{ flex: 1, minWidth: '250px' }}>Name
                      <input value={t.name || ''} onChange={(e) => handleTestimonialChange(idx, 'name', e.target.value)} placeholder="e.g. Rishita Dash" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                    <label style={{ flex: 1, minWidth: '250px' }}>Role / Designation
                      <input value={t.role || ''} onChange={(e) => handleTestimonialChange(idx, 'role', e.target.value)} placeholder="e.g. Representative" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                    <label style={{ flex: 1, minWidth: '250px' }}>Company / Organization
                      <input value={t.company || ''} onChange={(e) => handleTestimonialChange(idx, 'company', e.target.value)} placeholder="e.g. Business Partner Organization" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                  </div>
                  <label style={{ margin: 0 }}>Quote
                    <textarea rows="4" value={t.quote || ''} onChange={(e) => handleTestimonialChange(idx, 'quote', e.target.value)} placeholder="Enter quote details..." style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                  </label>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
              <button className="btn" onClick={saveTestimonials} disabled={savingTestimonials} style={{ minWidth: '180px' }}>
                {savingTestimonials ? 'Saving...' : '💾 Save Testimonials'}
              </button>
            </div>
          </div>
        )}

        {/* Logistics Partners Control */}
        {activeTab === 'Logistics' && (
          <div className="admin-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.2rem' }}>
              <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Logistic Partners Management</h3>
              <button type="button" className="btn" onClick={addPartner}>➕ Add Partner</button>
            </div>
            <div className="admin-form" style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {(siteData.logisticPartners || []).map((partner, idx) => (
                <div key={idx} className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                  <button 
                    type="button" 
                    onClick={() => deletePartner(idx)} 
                    style={{ position: 'absolute', right: '2rem', top: '2rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    🗑️ Delete Partner
                  </button>
                  <h4 style={{ color: 'var(--primary)', fontWeight: 'bold', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', width: '70%', fontSize: '1.15rem' }}>
                    Logistic Partner #{idx + 1}: {partner.name || 'New Partner'}
                  </h4>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    <label style={{ flex: 1, minWidth: '250px' }}>Partner Name
                      <input value={partner.name || ''} onChange={(e) => handlePartnerChange(idx, 'name', e.target.value)} placeholder="e.g. DHL SmartSensor Logistics" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                    <label style={{ flex: 1, minWidth: '250px' }}>Operational Scope
                      <input value={partner.scope || ''} onChange={(e) => handlePartnerChange(idx, 'scope', e.target.value)} placeholder="e.g. Cold Chain Critical Logistics" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                    <label style={{ flex: 0.5, minWidth: '100px' }}>Icon (Emoji)
                      <input value={partner.icon || '📦'} onChange={(e) => handlePartnerChange(idx, 'icon', e.target.value)} placeholder="e.g. 📦" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
              <button className="btn" onClick={savePartners} disabled={savingPartners} style={{ minWidth: '180px' }}>
                {savingPartners ? 'Saving...' : '💾 Save Logistic Partners'}
              </button>
            </div>
          </div>
        )}

        {/* Presence Markets Control */}
        {activeTab === 'Markets' && (
          <div className="admin-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.2rem' }}>
              <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Presence Map Locations</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-outline" onClick={() => setShowMarketsList(!showMarketsList)}>
                  {showMarketsList ? '🙈 Hide Markets' : '👁️ Show All Markets'}
                </button>
                <button type="button" className="btn-outline" onClick={addMarket}>➕ Add Market</button>
                <button type="button" className="btn" onClick={saveMarketsAdmin} disabled={savingMarkets}>
                  {savingMarkets ? 'Saving Changes...' : '💾 Save Markets'}
                </button>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Add exact GPS coordinates for your markets. These will automatically render as custom 3D fluttering flags on the interactive Business Presence Map.</p>
            <div className="admin-form" style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {editedMarkets?.map((m, idx) => {
                if (!showMarketsList && !m.isNew) return null;
                return (
                <div key={idx} className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                  <button 
                    type="button" 
                    onClick={() => deleteMarket(idx)} 
                    style={{ position: 'absolute', right: '2rem', top: '2rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    🗑️ Delete Market
                  </button>
                  <h4 style={{ color: 'var(--primary)', fontWeight: 'bold', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', width: '70%', fontSize: '1.15rem' }}>
                    Market #{idx + 1}: {m.name || 'New Market'}
                  </h4>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    <label style={{ flex: 1, minWidth: '200px' }}>City / Market Name
                      <input value={m.name || ''} onChange={(e) => handleMarketChange(idx, 'name', e.target.value)} placeholder="e.g. Mumbai" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)', padding: '12px', width: '100%', borderRadius: '8px', marginTop: '0.5rem' }} />
                    </label>
                    <label style={{ flex: 1, minWidth: '200px' }}>State
                      <select value={m.state || ''} onChange={(e) => handleMarketChange(idx, 'state', e.target.value)} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)', padding: '12px', width: '100%', borderRadius: '8px', marginTop: '0.5rem', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                        <option value="" style={{ color: '#000' }}>Select State (Optional)</option>
                        <option value="Andhra Pradesh" style={{ color: '#000' }}>Andhra Pradesh</option>
                        <option value="Arunachal Pradesh" style={{ color: '#000' }}>Arunachal Pradesh</option>
                        <option value="Assam" style={{ color: '#000' }}>Assam</option>
                        <option value="Bihar" style={{ color: '#000' }}>Bihar</option>
                        <option value="Chhattisgarh" style={{ color: '#000' }}>Chhattisgarh</option>
                        <option value="Goa" style={{ color: '#000' }}>Goa</option>
                        <option value="Gujarat" style={{ color: '#000' }}>Gujarat</option>
                        <option value="Haryana" style={{ color: '#000' }}>Haryana</option>
                        <option value="Himachal Pradesh" style={{ color: '#000' }}>Himachal Pradesh</option>
                        <option value="Jharkhand" style={{ color: '#000' }}>Jharkhand</option>
                        <option value="Karnataka" style={{ color: '#000' }}>Karnataka</option>
                        <option value="Kerala" style={{ color: '#000' }}>Kerala</option>
                        <option value="Madhya Pradesh" style={{ color: '#000' }}>Madhya Pradesh</option>
                        <option value="Maharashtra" style={{ color: '#000' }}>Maharashtra</option>
                        <option value="Manipur" style={{ color: '#000' }}>Manipur</option>
                        <option value="Meghalaya" style={{ color: '#000' }}>Meghalaya</option>
                        <option value="Mizoram" style={{ color: '#000' }}>Mizoram</option>
                        <option value="Nagaland" style={{ color: '#000' }}>Nagaland</option>
                        <option value="Odisha" style={{ color: '#000' }}>Odisha</option>
                        <option value="Punjab" style={{ color: '#000' }}>Punjab</option>
                        <option value="Rajasthan" style={{ color: '#000' }}>Rajasthan</option>
                        <option value="Sikkim" style={{ color: '#000' }}>Sikkim</option>
                        <option value="Tamil Nadu" style={{ color: '#000' }}>Tamil Nadu</option>
                        <option value="Telangana" style={{ color: '#000' }}>Telangana</option>
                        <option value="Tripura" style={{ color: '#000' }}>Tripura</option>
                        <option value="Uttar Pradesh" style={{ color: '#000' }}>Uttar Pradesh</option>
                        <option value="Uttarakhand" style={{ color: '#000' }}>Uttarakhand</option>
                        <option value="West Bengal" style={{ color: '#000' }}>West Bengal</option>
                        <option value="Andaman and Nicobar Islands" style={{ color: '#000' }}>Andaman and Nicobar Islands</option>
                        <option value="Chandigarh" style={{ color: '#000' }}>Chandigarh</option>
                        <option value="Dadra and Nagar Haveli and Daman and Diu" style={{ color: '#000' }}>Dadra and Nagar Haveli</option>
                        <option value="Delhi" style={{ color: '#000' }}>Delhi</option>
                        <option value="Jammu and Kashmir" style={{ color: '#000' }}>Jammu and Kashmir</option>
                        <option value="Ladakh" style={{ color: '#000' }}>Ladakh</option>
                        <option value="Lakshadweep" style={{ color: '#000' }}>Lakshadweep</option>
                        <option value="Puducherry" style={{ color: '#000' }}>Puducherry</option>
                      </select>
                    </label>
                    <label style={{ flex: 1, minWidth: '200px' }}>Status
                      <select value={m.status || 'Active'} onChange={(e) => handleMarketChange(idx, 'status', e.target.value)} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)', padding: '12px', width: '100%', borderRadius: '8px', marginTop: '0.5rem' }}>
                        <option value="Active">Active (Show Flag)</option>
                        <option value="Upcoming">Upcoming (Hide Flag)</option>
                      </select>
                    </label>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem', alignItems: 'flex-end' }}>
                    <label style={{ flex: 1, minWidth: '200px' }}>Latitude (Y-axis)
                      <input value={m.lat || ''} onChange={(e) => handleMarketChange(idx, 'lat', e.target.value)} placeholder="e.g. 19.0760" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                    <label style={{ flex: 1, minWidth: '200px' }}>Longitude (X-axis)
                      <input value={m.lng || ''} onChange={(e) => handleMarketChange(idx, 'lng', e.target.value)} placeholder="e.g. 72.8777" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                    <button type="button" className="btn-outline" onClick={() => fetchCoordinatesForMarket(idx)} style={{ padding: '12px 20px', borderRadius: '8px', flexShrink: 0, height: '48px', marginTop: '0.5rem' }}>
                      📍 Auto-Fetch
                    </button>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <label style={{ width: '100%', display: 'block' }}>Operational Scope
                      <textarea value={m.scope || ''} onChange={(e) => handleMarketChange(idx, 'scope', e.target.value)} placeholder="e.g. Administrative, Global R&D, and Southern Distribution Hub" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)', width: '100%', marginTop: '0.5rem', minHeight: '60px', padding: '12px', borderRadius: '8px' }} />
                    </label>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <label style={{ width: '100%', display: 'block' }}>Regional Address
                      <input value={m.address || ''} onChange={(e) => handleMarketChange(idx, 'address', e.target.value)} placeholder="e.g. Plot No. 12, Secunderabad, Telangana, India" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)', width: '100%', marginTop: '0.5rem' }} />
                    </label>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <label style={{ width: '100%', display: 'block' }}>Contact Email
                      <input type="email" value={m.email || ''} onChange={(e) => handleMarketChange(idx, 'email', e.target.value)} placeholder="e.g. contact@emyrisbio.com" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)', width: '100%', marginTop: '0.5rem' }} />
                    </label>
                  </div>
                </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
              <button type="button" className="btn" onClick={saveMarketsAdmin} disabled={savingMarkets} style={{ minWidth: '180px' }}>
                {savingMarkets ? 'Saving Changes...' : '💾 Save Markets'}
              </button>
            </div>
          </div>
        )}

        {/* Our Advisors Control */}
        {activeTab === 'Advisors' && (
          <div className="admin-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.2rem' }}>
              <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Our Advisors Team</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-outline" onClick={addAdvisor}>➕ Add Advisor</button>
                <button type="button" className="btn" onClick={saveAdvisors} disabled={savingAdvisors}>
                  {savingAdvisors ? 'Saving Changes...' : '💾 Save Advisors'}
                </button>
              </div>
            </div>
            <div className="admin-form" style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {editedAdvisors?.map((adv, idx) => (
                <div key={idx} className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                  <button 
                    type="button" 
                    onClick={() => deleteAdvisor(idx)} 
                    style={{ position: 'absolute', right: '2rem', top: '2rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    🗑️ Delete Profile
                  </button>
                  <h4 style={{ color: 'var(--primary)', fontWeight: 'bold', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', width: '70%', fontSize: '1.15rem' }}>
                    Advisor #{idx + 1}: {adv.name || 'New Advisor'}
                  </h4>
                  
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <img 
                        src={adv.image || 'https://via.placeholder.com/120x130?text=No+Photo'} 
                        alt={adv.name} 
                        style={{ width: '120px', height: '130px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--glass-border)', background: '#cbd5e1' }} 
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <label style={{ margin: 0 }}>
                        Upload Advisor Photo (Local Storage)
                        <input type="file" accept="image/*" onChange={(e) => handleAdvisorImageUpload(e, idx)} disabled={uploadingAdvisorIdx !== null} />
                        {uploadingAdvisorIdx === idx && <span style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>Uploading image to local disk...</span>}
                      </label>
                      <label style={{ margin: 0 }}>Photo URL
                        <input value={adv.image || ''} onChange={(e) => handleAdvisorChange(idx, 'image', e.target.value)} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <label style={{ flex: 1, minWidth: '250px' }}>Advisor Name
                      <input value={adv.name || ''} onChange={(e) => handleAdvisorChange(idx, 'name', e.target.value)} placeholder="e.g. Shabbirhusen Akhai" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                    <label style={{ flex: 1, minWidth: '250px' }}>Advisor Role / Title
                      <input value={adv.role || ''} onChange={(e) => handleAdvisorChange(idx, 'role', e.target.value)} placeholder="e.g. Legal Affairs Advisor" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                    <label style={{ flex: 0.5, minWidth: '100px' }}>Display Order
                      <input type="number" value={adv.sequence || ''} onChange={(e) => handleAdvisorChange(idx, 'sequence', e.target.value)} placeholder="e.g. 1" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                    <label style={{ flex: 0.5, minWidth: '120px' }}>DOB (DD-MM)
                      <input type="text" value={adv.dob || ''} onChange={(e) => handleAdvisorChange(idx, 'dob', e.target.value)} placeholder="e.g. 15-08" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                  </div>
                  <label style={{ margin: 0 }}>Biography & Narration
                    <textarea rows="4" value={adv.bio || ''} onChange={(e) => handleAdvisorChange(idx, 'bio', e.target.value)} placeholder="Enter biography details..." style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                  </label>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
              <button type="button" className="btn" onClick={saveAdvisors} disabled={savingAdvisors} style={{ minWidth: '180px' }}>
                {savingAdvisors ? 'Saving Changes...' : '💾 Save Advisors'}
              </button>
            </div>
          </div>
        )}

        {/* Our Doctors Control */}
        {activeTab === 'Doctors' && (
          <div className="admin-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.2rem' }}>
              <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Our Doctors Team</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-outline" onClick={addDoctor}>➕ Add Doctor</button>
                <button type="button" className="btn" onClick={saveDoctors} disabled={savingDoctors}>
                  {savingDoctors ? 'Saving Changes...' : '💾 Save Doctors'}
                </button>
              </div>
            </div>
            <div className="admin-form" style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {editedDoctors?.map((doc, idx) => (
                <div key={idx} className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                  <button 
                    type="button" 
                    onClick={() => deleteDoctor(idx)} 
                    style={{ position: 'absolute', right: '2rem', top: '2rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    🗑️ Delete Profile
                  </button>
                  <h4 style={{ color: 'var(--primary)', fontWeight: 'bold', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', width: '70%', fontSize: '1.15rem' }}>
                    Doctor #{idx + 1}: {doc.name || 'New Doctor'}
                  </h4>
                  
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <img 
                        src={doc.image || 'https://via.placeholder.com/120x130?text=No+Photo'} 
                        alt={doc.name} 
                        style={{ width: '120px', height: '130px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--glass-border)', background: '#cbd5e1' }} 
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <label style={{ margin: 0 }}>
                        Upload Doctor Photo (Local Storage)
                        <input type="file" accept="image/*" onChange={(e) => handleDoctorImageUpload(e, idx)} disabled={uploadingDoctorIdx !== null} />
                        {uploadingDoctorIdx === idx && <span style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>Uploading image to local disk...</span>}
                      </label>
                      <label style={{ margin: 0 }}>Photo URL
                        <input value={doc.image || ''} onChange={(e) => handleDoctorChange(idx, 'image', e.target.value)} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <label style={{ flex: 1, minWidth: '250px' }}>Doctor Name
                      <input value={doc.name || ''} onChange={(e) => handleDoctorChange(idx, 'name', e.target.value)} placeholder="e.g. Dr. Rajesh Khanna" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                    <label style={{ flex: 1, minWidth: '250px' }}>Doctor Role / Title
                      <input value={doc.role || ''} onChange={(e) => handleDoctorChange(idx, 'role', e.target.value)} placeholder="e.g. Consultant Oncologist" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                    <label style={{ flex: 0.5, minWidth: '100px' }}>Display Order
                      <input type="number" value={doc.sequence || ''} onChange={(e) => handleDoctorChange(idx, 'sequence', e.target.value)} placeholder="e.g. 1" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                    <label style={{ flex: 0.5, minWidth: '120px' }}>DOB (DD-MM)
                      <input type="text" value={doc.dob || ''} onChange={(e) => handleDoctorChange(idx, 'dob', e.target.value)} placeholder="e.g. 15-08" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                  </div>
                  <label style={{ margin: 0 }}>Biography & Narration
                    <textarea rows="4" value={doc.bio || ''} onChange={(e) => handleDoctorChange(idx, 'bio', e.target.value)} placeholder="Enter biography details..." style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                  </label>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
              <button type="button" className="btn" onClick={saveDoctors} disabled={savingDoctors} style={{ minWidth: '180px' }}>
                {savingDoctors ? 'Saving Changes...' : '💾 Save Doctors'}
              </button>
            </div>
          </div>
        )}

        {/* Business Enhancers Control */}
        {activeTab === 'Enhancers' && (
          <div className="admin-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.2rem' }}>
              <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Business Enhancers Team</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-outline" onClick={addEnhancer}>➕ Add Enhancer</button>
                <button type="button" className="btn" onClick={saveEnhancers} disabled={savingEnhancers}>
                  {savingEnhancers ? 'Saving Changes...' : '💾 Save Enhancers'}
                </button>
              </div>
            </div>
            <div className="admin-form" style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {editedEnhancers?.map((enh, idx) => (
                <div key={idx} className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                  <button 
                    type="button" 
                    onClick={() => deleteEnhancer(idx)} 
                    style={{ position: 'absolute', right: '2rem', top: '2rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    🗑️ Delete Profile
                  </button>
                  <h4 style={{ color: 'var(--primary)', fontWeight: 'bold', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', width: '70%', fontSize: '1.15rem' }}>
                    Enhancer #{idx + 1}: {enh.name || 'New Enhancer'}
                  </h4>
                  
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <img 
                        src={enh.image || 'https://via.placeholder.com/120x130?text=No+Photo'} 
                        alt={enh.name} 
                        style={{ width: '120px', height: '130px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--glass-border)', background: '#cbd5e1' }} 
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <label style={{ margin: 0 }}>
                        Upload Photo (Local Storage)
                        <input type="file" accept="image/*" onChange={(e) => handleEnhancerImageUpload(e, idx)} disabled={uploadingEnhancerIdx !== null} />
                        {uploadingEnhancerIdx === idx && <span style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>Uploading image to local disk...</span>}
                      </label>
                      <label style={{ margin: 0 }}>Photo URL
                        <input value={enh.image || ''} onChange={(e) => handleEnhancerChange(idx, 'image', e.target.value)} style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <label style={{ flex: 1, minWidth: '250px' }}>Enhancer Name
                      <input value={enh.name || ''} onChange={(e) => handleEnhancerChange(idx, 'name', e.target.value)} placeholder="e.g. Silla Padhi" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                    <label style={{ flex: 1, minWidth: '250px' }}>Role / Title
                      <input value={enh.role || ''} onChange={(e) => handleEnhancerChange(idx, 'role', e.target.value)} placeholder="e.g. Executive Director" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                    <label style={{ flex: 0.5, minWidth: '100px' }}>Display Order
                      <input type="number" value={enh.sequence || ''} onChange={(e) => handleEnhancerChange(idx, 'sequence', e.target.value)} placeholder="e.g. 1" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                    <label style={{ flex: 0.5, minWidth: '120px' }}>DOB (DD-MM)
                      <input type="text" value={enh.dob || ''} onChange={(e) => handleEnhancerChange(idx, 'dob', e.target.value)} placeholder="e.g. 15-08" style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                    </label>
                  </div>
                  <label style={{ margin: 0 }}>Biography & Narration
                    <textarea rows="4" value={enh.bio || ''} onChange={(e) => handleEnhancerChange(idx, 'bio', e.target.value)} placeholder="Enter biography details..." style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} />
                  </label>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
              <button type="button" className="btn" onClick={saveEnhancers} disabled={savingEnhancers} style={{ minWidth: '180px' }}>
                {savingEnhancers ? 'Saving Changes...' : '💾 Save Enhancers'}
              </button>
            </div>
          </div>
        )}

        {/* Blogs Manager Pane */}
        {activeTab === 'Blogs' && (
          <div className="admin-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.2rem' }}>
              <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Blog Posts Manager</h3>
              {editingBlogIdx === null ? (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" className="btn-outline" onClick={addBlog}>➕ Add New Blog Post</button>
                  <button type="button" className="btn" onClick={saveBlogs} disabled={savingBlogs}>
                    {savingBlogs ? 'Saving...' : '💾 Save Blogs'}
                  </button>
                </div>
              ) : (
                <button type="button" className="btn-outline" onClick={() => setEditingBlogIdx(null)}>
                  &larr; Back to List
                </button>
              )}
            </div>

            {editingBlogIdx === null ? (
              /* LIST VIEW */
              <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--glass-border)', textAlign: 'left' }}>
                      <th style={{ padding: '12px', width: '80px' }}>Image</th>
                      <th style={{ padding: '12px' }}>Title</th>
                      <th style={{ padding: '12px' }}>Category</th>
                      <th style={{ padding: '12px' }}>Author & Date</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px', width: '200px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editedBlogs.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No blog posts found. Click "Add New Blog Post" to create one.
                        </td>
                      </tr>
                    ) : (
                      editedBlogs.map((blog, idx) => (
                        <tr key={blog.id || idx} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                          <td style={{ padding: '12px' }}>
                            <img 
                              src={blog.image || 'https://via.placeholder.com/80x50?text=No+Image'} 
                              alt="" 
                              style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                            />
                          </td>
                          <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--primary)' }}>
                            {blog.title}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span className="glass" style={{ padding: '4px 8px', fontSize: '0.8rem', borderRadius: '30px' }}>
                              {blog.category || 'General'}
                            </span>
                          </td>
                          <td style={{ padding: '12px', fontSize: '0.85rem' }}>
                            <div>✍️ {blog.author || 'Admin'}</div>
                            <div style={{ color: 'var(--text-muted)' }}>📅 {blog.date}</div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            {blog.status === 'published' && (
                              <span style={{ background: '#d1fae5', color: '#065f46', padding: '4px 10px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                Published
                              </span>
                            )}
                            {blog.status === 'draft' && (
                              <span style={{ background: '#e2e8f0', color: '#475569', padding: '4px 10px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                Draft
                              </span>
                            )}
                            {blog.status === 'scheduled' && (
                              <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                Scheduled {blog.publishDate ? `(${new Date(blog.publishDate).toLocaleDateString()})` : ''}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                            <button 
                              type="button" 
                              className="btn-outline" 
                              onClick={() => setEditingBlogIdx(idx)}
                              style={{ padding: '4px 10px', fontSize: '0.85rem' }}
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              type="button" 
                              onClick={() => deleteBlog(idx)}
                              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '4px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* DETAIL / EDIT FORM VIEW */
              (() => {
                const blog = editedBlogs[editingBlogIdx];
                return (
                  <div className="admin-form glass" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <label style={{ flex: 2, minWidth: '250px' }}>Post Title
                        <input 
                          value={blog.title || ''} 
                          onChange={(e) => {
                            handleBlogChange(editingBlogIdx, 'title', e.target.value);
                            // Auto-generate slug from title
                            const slugified = e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, '-')
                              .replace(/(^-|-$)+/g, '');
                            handleBlogChange(editingBlogIdx, 'slug', slugified);
                          }} 
                          style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} 
                        />
                      </label>
                      <label style={{ flex: 1, minWidth: '150px' }}>Category
                        <input 
                          list="blog-categories-datalist"
                          value={blog.category || ''} 
                          onChange={(e) => handleBlogChange(editingBlogIdx, 'category', e.target.value)} 
                          placeholder="Select or enter category"
                          style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)', width: '100%' }} 
                        />
                        <datalist id="blog-categories-datalist">
                          <option value="Latest News" />
                          <option value="Health Awareness" />
                          <option value="Educational" />
                          <option value="Healthier Living" />
                        </datalist>
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                      <label style={{ flex: 1, minWidth: '200px' }}>Slug (URL path)
                        <input 
                          value={blog.slug || ''} 
                          onChange={(e) => handleBlogChange(editingBlogIdx, 'slug', e.target.value)} 
                          style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} 
                        />
                      </label>
                      <label style={{ flex: 1, minWidth: '150px' }}>Author
                        <input 
                          value={blog.author || ''} 
                          onChange={(e) => handleBlogChange(editingBlogIdx, 'author', e.target.value)} 
                          style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} 
                        />
                      </label>
                      <label style={{ flex: 1, minWidth: '150px' }}>Display Date
                        <input 
                          value={blog.date || ''} 
                          onChange={(e) => handleBlogChange(editingBlogIdx, 'date', e.target.value)} 
                          style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} 
                        />
                      </label>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
                      <label>Featured Image URL (or upload below)
                        <input 
                          value={blog.image || ''} 
                          onChange={(e) => handleBlogChange(editingBlogIdx, 'image', e.target.value)} 
                          style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)' }} 
                        />
                      </label>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Upload Featured Image (Local Storage)
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleBlogImageUpload(e, editingBlogIdx)} 
                          disabled={uploadingBlogIdx !== null} 
                          style={{ marginTop: '0.25rem' }} 
                        />
                      </label>
                      {uploadingBlogIdx === editingBlogIdx && (
                        <span style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>Uploading image to local server disk...</span>
                      )}
                    </div>

                    {/* Dedicated blogpic Upload Section */}
                    <div className="glass" style={{ marginTop: '1.5rem', padding: '1.25rem', borderRadius: '12px', background: 'rgba(82, 203, 203, 0.04)', border: '1px solid rgba(82, 203, 203, 0.2)' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)', fontSize: '0.95rem', fontWeight: 'bold' }}>📸 Extra Article Picture (blogpic field)</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.8rem 0' }}>Upload any image below. It will save directly onto your VPS disk and store its URL in the <code>blogpic</code> database field. You can then click paste to instantly insert it into your HTML article editor below!</p>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <label style={{ flex: 1, minWidth: '220px', margin: 0 }}>blogpic URL
                          <input 
                            value={blog.blogpic || ''} 
                            onChange={(e) => handleBlogChange(editingBlogIdx, 'blogpic', e.target.value)} 
                            placeholder="/uploads/my-article-pic.webp"
                            style={{ color: 'var(--text-light)', border: '1px solid var(--glass-border)', width: '100%', padding: '8px', borderRadius: '6px', background: '#fff', marginTop: '4px' }} 
                          />
                        </label>
                        <div>
                          <label className="btn-outline" style={{ display: 'inline-block', cursor: 'pointer', padding: '8px 14px', fontSize: '0.85rem', margin: 0 }}>
                            {uploadingBlogPicIdx === editingBlogIdx ? '📤 Uploading...' : '📤 Upload blogpic'}
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleBlogPicUpload(e, editingBlogIdx)} 
                              disabled={uploadingBlogPicIdx !== null} 
                              style={{ display: 'none' }} 
                            />
                          </label>
                        </div>
                        {blog.blogpic && (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              type="button"
                              className="btn"
                              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                              onClick={() => {
                                const currentVal = Array.isArray(blog.content) ? blog.content.map(p => `<p>${p}</p>`).join('') : (blog.content || '');
                                const imgHtml = `<p style="text-align: center;"><img src="${blog.blogpic}" style="max-width: 85%; border-radius: 12px; margin: 15px auto; display: block; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" /></p>`;
                                handleBlogChange(editingBlogIdx, 'content', currentVal + imgHtml);
                                alert("✅ Inserted blogpic directly into the HTML editor below!");
                              }}
                            >
                              ⚡ Paste Link into Editor
                            </button>
                            <button
                              type="button"
                              className="btn-outline"
                              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                              onClick={() => {
                                navigator.clipboard.writeText(blog.blogpic);
                                alert("📋 Copied blogpic link to clipboard!");
                              }}
                            >
                              📋 Copy Link
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Scheduling Section */}
                    <div className="glass" style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '12px', background: 'rgba(82, 203, 203, 0.02)' }}>
                      <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary)', fontSize: '1rem', fontWeight: 'bold' }}>Publication & Scheduling</h4>
                      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <label style={{ flex: 1, minWidth: '200px', margin: 0 }}>Publish Status
                          <select
                            value={blog.status || 'draft'}
                            onChange={(e) => handleBlogChange(editingBlogIdx, 'status', e.target.value)}
                            style={{ 
                              width: '100%', 
                              padding: '10px', 
                              borderRadius: '8px', 
                              border: '1px solid var(--glass-border)',
                              background: '#ffffff',
                              color: 'var(--text-light)',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="draft">Draft (Hidden)</option>
                            <option value="published">Published (Visible Immediately)</option>
                            <option value="scheduled">Scheduled (Release at Date/Time)</option>
                          </select>
                        </label>
                        
                        {blog.status === 'scheduled' && (
                          <label style={{ flex: 1.5, minWidth: '250px', margin: 0 }}>Release Date & Time
                            <input
                              type="datetime-local"
                              value={
                                blog.publishDate 
                                  ? new Date(new Date(blog.publishDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
                                  : ''
                              }
                              onChange={(e) => {
                                const localTime = e.target.value;
                                const isoTime = localTime ? new Date(localTime).toISOString() : '';
                                handleBlogChange(editingBlogIdx, 'publishDate', isoTime);
                              }}
                              style={{ 
                                color: 'var(--text-light)', 
                                border: '1px solid var(--glass-border)', 
                                padding: '8px 10px',
                                borderRadius: '8px'
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Visual HTML Rich Text Editor */}
                    <div style={{ marginTop: '2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <h4 style={{ margin: 0, color: 'var(--primary)', fontSize: '1rem', fontWeight: 'bold' }}>Article Content (Visual HTML Editor)</h4>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>💡 Images are converted to .webp & aligned with Pic Left / Center / Right</span>
                      </div>
                      <WYSIWYGEditor
                        value={Array.isArray(blog.content) ? blog.content.map(p => `<p>${p}</p>`).join('') : (blog.content || '')}
                        onChange={(val) => handleBlogChange(editingBlogIdx, 'content', val)}
                        idx={editingBlogIdx}
                        onImageUpload={handleBlogEditorImageUpload}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                      <button type="button" className="btn-outline" onClick={() => setEditingBlogIdx(null)}>
                        Cancel & Return
                      </button>
                      <button type="button" className="btn" onClick={saveBlogs} disabled={savingBlogs} style={{ minWidth: '150px' }}>
                        {savingBlogs ? 'Saving...' : '💾 Save Blogs'}
                      </button>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        )}

        {/* Customer Inquiries Inbox */}
        {activeTab === 'Inquiries' && (
          <div className="admin-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3>Customer Inquiries Inbox</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {selectedInquiries.length > 0 && (
                  <button className="btn" onClick={handleBulkDeleteInquiries} style={{ background: '#ef4444' }}>
                    ❌ Delete Selected ({selectedInquiries.length})
                  </button>
                )}
                <button className="btn" onClick={fetchAdminData} disabled={loadingList}>
                  {loadingList ? 'Refreshing...' : '🔄 Refresh'}
                </button>
              </div>
            </div>
            {inquiries.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No customer inquiries found.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-light)' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--glass-border)', textAlign: 'left' }}>
                      <th style={{ padding: '12px' }}>
                        <input 
                          type="checkbox" 
                          checked={inquiries.length > 0 && selectedInquiries.length === inquiries.length}
                          onChange={(e) => setSelectedInquiries(e.target.checked ? inquiries.map(i => i.id) : [])}
                        />
                      </th>
                      <th style={{ padding: '12px' }}>Date</th>
                      <th style={{ padding: '12px' }}>Name</th>
                      <th style={{ padding: '12px' }}>Contact</th>
                      <th style={{ padding: '12px' }}>Offering Choice</th>
                      <th style={{ padding: '12px' }}>Message</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inq) => (
                      <tr key={inq.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '12px' }}>
                          <input 
                            type="checkbox" 
                            checked={selectedInquiries.includes(inq.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedInquiries([...selectedInquiries, inq.id]);
                              else setSelectedInquiries(selectedInquiries.filter(id => id !== inq.id));
                            }}
                          />
                        </td>
                        <td style={{ padding: '12px', fontSize: '0.85rem' }}>{new Date(inq.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{inq.name}</td>
                        <td style={{ padding: '12px' }}>
                          <div>{inq.email}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{inq.phone}</div>
                        </td>
                        <td style={{ padding: '12px' }}><span className="glass" style={{ padding: '4px 8px', fontSize: '0.8rem', color: 'var(--primary)' }}>{inq.offering || 'General'}</span></td>
                        <td style={{ padding: '12px', fontSize: '0.9rem', maxWidth: '250px' }}>{inq.message}</td>
                        <td style={{ padding: '12px' }}>
                          <select 
                            value={inq.status} 
                            onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                            style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              background: inq.status === 'contacted' ? '#d1fae5' : '#fef3c7', 
                              color: inq.status === 'contacted' ? '#065f46' : '#92400e',
                              border: 'none',
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                          </select>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button 
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }} 
                            onClick={() => deleteInquiry(inq.id)}
                          >
                            ❌ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Job Applications Inbox */}
        {activeTab === 'Careers' && (
          <div className="admin-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3>Job Applications Inbox</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {selectedCareers.length > 0 && (
                  <button className="btn" onClick={handleBulkDeleteCareers} style={{ background: '#ef4444' }}>
                    ❌ Delete Selected ({selectedCareers.length})
                  </button>
                )}
                <button className="btn" onClick={fetchAdminData} disabled={loadingList}>
                  {loadingList ? 'Refreshing...' : '🔄 Refresh'}
                </button>
              </div>
            </div>
            {careers.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No job applications found.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-light)' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--glass-border)', textAlign: 'left' }}>
                      <th style={{ padding: '12px' }}>
                        <input 
                          type="checkbox" 
                          checked={careers.length > 0 && selectedCareers.length === careers.length}
                          onChange={(e) => setSelectedCareers(e.target.checked ? careers.map(c => c.id) : [])}
                        />
                      </th>
                      <th style={{ padding: '12px' }}>Date</th>
                      <th style={{ padding: '12px' }}>Applicant</th>
                      <th style={{ padding: '12px' }}>Position & Exp</th>
                      <th style={{ padding: '12px' }}>Resume / CV</th>
                      <th style={{ padding: '12px' }}>Address</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {careers.map((appRecord) => (
                      <tr key={appRecord.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '12px' }}>
                          <input 
                            type="checkbox" 
                            checked={selectedCareers.includes(appRecord.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedCareers([...selectedCareers, appRecord.id]);
                              else setSelectedCareers(selectedCareers.filter(id => id !== appRecord.id));
                            }}
                          />
                        </td>
                        <td style={{ padding: '12px', fontSize: '0.85rem' }}>{new Date(appRecord.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 'bold' }}>{appRecord.name}</div>
                          <div style={{ fontSize: '0.85rem' }}>{appRecord.email}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{appRecord.phone}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{appRecord.qualification || appRecord.position}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Exp: {appRecord.experience || 'N/A'}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          {appRecord.resumeFileName ? (
                            <a href={`data:application/octet-stream;base64,${appRecord.resumeData}`} download={appRecord.resumeFileName} style={{ color: 'var(--secondary)', fontWeight: 'bold', textDecoration: 'underline' }}>
                              📥 Download {appRecord.resumeFileName}
                            </a>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No file uploaded</span>
                          )}
                        </td>
                        <td style={{ padding: '12px', fontSize: '0.9rem', maxWidth: '200px' }}>{appRecord.address || appRecord.message || '-'}</td>
                        <td style={{ padding: '12px' }}>
                          <select 
                            value={appRecord.status} 
                            onChange={(e) => updateCareerStatus(appRecord.id, e.target.value)}
                            style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              background: appRecord.status === 'reviewed' ? '#d1fae5' : '#fef3c7', 
                              color: appRecord.status === 'reviewed' ? '#065f46' : '#92400e',
                              border: 'none',
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                          </select>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button 
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }} 
                            onClick={() => deleteCareer(appRecord.id)}
                          >
                            ❌ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default Admin;
