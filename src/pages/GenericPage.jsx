import React, { useContext, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useRecaptcha } from '../components/CaptchaBox';

// ── Offering data — matches emyrisbio.com content exactly ──────────────────
const OFFERING_DATA = {
  'anti-infective': {
    title: 'Anti-Infective',
    image: 'https://cms.emyrisbio.com/Content/images/offerings/Anti-Infective.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    icon: '🧬',
    accentColor: '#1d4ed8',
    tagline: 'Comprehensive Anti-Infective Formulations for ICU & Critical Care',
    highlights: [
      { icon: '🏥', label: 'ICU-Grade Formulations', desc: 'All anti-infective products are engineered for critical care use' },
      { icon: '✅', label: 'WHO-GMP Certified', desc: 'Manufactured in certified sterile blocks with full traceability' },
      { icon: '💊', label: 'HCP-Only Distribution', desc: 'Sold exclusively through verified healthcare professionals' },
      { icon: '🔬', label: 'Rigorous HPLC Testing', desc: 'Every batch verified by microbiological assay and potency tests' },
    ],
    desc: [
      'EMYRIS BIOLIFESCIENCES Anti-Infective, where we specialize in providing a comprehensive range of high-quality anti-infective medications at affordable prices. Our commitment to healthcare excellence drives us to offer effective solutions to combat infections while prioritizing accessibility for all.',
      'Our anti-infective product portfolio encompasses a diverse range of qualitative medications tailored to address various infectious conditions. From antibiotics to antivirals and antifungals, we strive to meet the therapeutic needs of healthcare professionals and patients alike.',
      'At EMYRIS BIOLIFESCIENCES, we prioritize patient safety and wellbeing. Therefore, we strictly adhere to the practice of selling our anti-infective medications exclusively through healthcare professionals (HCPs). Patients can connect with us through their healthcare providers to inquire about our anti-infective products and pricing.',
      'Our team is dedicated to ensuring that our anti-infective medications meet stringent quality standards, regulatory requirements, and affordability criteria. We are committed to supporting healthcare providers in their efforts to combat infections and improve patient outcomes.',
      'For more information about our anti-infective range of products and pricing, please reach out to us. We are here to support healthcare professionals and patients in their fight against infectious diseases, providing safe, effective, and accessible solutions.',
    ],
    productTable: [
      {
        category: 'Anti Infection',
        color: '#1d4ed8',
        badge: 'ICU RANGE',
        products: [
          'Ceftazidime 2gm + Avibactam 0.5gm',
          'Clindamycin Inj 300 mg / 600mg',
          'Meropenem 1gm',
          'Clarithromycin 500mg',
          'Colistimethate Sodium 1MIU / 2MIU / 3MIU',
          'Doxycycline 100 mg',
          'Polymyxin B Sulphate 500000 IU, 750000 IU',
          'Teicoplanin 200 mg / 400mg',
          'Tigecycline 50mg / 100mg',
          'Vancomycin 500mg / 1000mg',
          'Ampicillin 1gm + Sulbactam 0.5gm',
        ],
      },
      {
        category: 'Anti Fungals',
        color: '#7c3aed',
        badge: null,
        products: [
          'Liposomal Amphotericin B 50 mg Inj',
          'Caspofungin 50mg / 70mg',
          'Voriconazole 200mg Inj, 200mg Suspension, 200mg Tab',
        ],
      },
      {
        category: 'Anti Inflammatory',
        color: '#0ea5e9',
        badge: null,
        products: [
          'Methyl Prednisolone Sodium Succinate 40mg / 125mg / 500mg / 1 GM',
          'Hydrocortisone Sodium 100mg',
        ],
      },
      {
        category: 'Anti Oxidant',
        color: '#059669',
        badge: null,
        products: [
          'Glutathione 600 mg',
          'N-Acetylcysteine 400mg / 1000mg / 600mg Tab',
        ],
      },
      {
        category: 'GH Regulator',
        color: '#d97706',
        badge: null,
        products: ['Octreotide 50mcg / 100mcg'],
      },
      {
        category: 'Psychostimulant',
        color: '#db2777',
        badge: null,
        products: ['Citicoline 500 / 1000mg'],
      },
    ],
  },
  'oncology': {
    title: 'Oncology',
    image: 'https://cms.emyrisbio.com/Content/images/offerings/Oncology.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80',
    icon: '🔬',
    accentColor: '#7c3aed',
    tagline: 'Advanced Cytotoxic Therapies & Oncology Supportive Care',
    highlights: [
      { icon: '⚗️', label: 'Containment Facilities', desc: 'Cytotoxics prepared in dedicated, pressurised clean rooms' },
      { icon: '❄️', label: 'Cold-Chain Supply', desc: 'Unbroken cold chain from manufacture to hospital ward' },
      { icon: '🤝', label: 'Oncologist Endorsed', desc: 'Protocols validated by leading oncology specialists' },
      { icon: '✅', label: 'Sterility Verified', desc: 'Potency and sterility confirmed before every dispatch' },
    ],
    desc: [
      'EMYRIS BIOLIFESCIENCES Oncology division is dedicated to providing advanced cytotoxic therapies and supportive care formulations to fight cancer and improve patient survival rates.',
      'Our oncology portfolio features high-precision active pharmaceutical ingredients prepared in state-of-the-art containment facilities. We collaborate closely with leading oncologists to ensure our formulations meet the exacting demands of chemotherapy protocols.',
      'Each cytotoxic agent undergoes rigorous sterility and potency verification before dispatch. We maintain cold-chain compliant supply lines to ensure therapeutic integrity from our manufacturing blocks to the hospital ward.',
    ],
    productTable: [
      {
        category: 'Cytotoxic Agents',
        color: '#7c3aed',
        badge: 'CHEMO RANGE',
        products: [
          'Paclitaxel 30mg / 100mg / 300mg Inj',
          'Docetaxel 20mg / 80mg / 120mg Inj',
          'Gemcitabine 200mg / 1gm Inj',
          'Carboplatin 150mg / 450mg Inj',
          'Oxaliplatin 50mg / 100mg Inj',
          'Cisplatin 10mg / 25mg / 50mg Inj',
          'Ifosfamide 1gm / 2gm Inj',
          'Cyclophosphamide 200mg / 500mg / 1gm Inj',
        ],
      },
      {
        category: 'Supportive Oncology Care',
        color: '#0ea5e9',
        badge: null,
        products: [
          'Ondansetron 4mg / 8mg Inj (Anti-Emetic)',
          'Filgrastim 300mcg Inj (G-CSF)',
          'Dexamethasone 4mg / 8mg Inj',
          'Zoledronic Acid 4mg Inj',
        ],
      },
      {
        category: 'Targeted Therapy',
        color: '#059669',
        badge: null,
        products: [
          'Imatinib 100mg / 400mg Tab',
          'Dasatinib 50mg / 70mg Tab',
          'Erlotinib 100mg / 150mg Tab',
        ],
      },
    ],
  },
  'enteral-nutrition': {
    title: 'Enteral Nutrition',
    image: 'https://cms.emyrisbio.com/Content/images/offerings/Enteral-Nutrition.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1200&q=80',
    icon: '🧪',
    accentColor: '#059669',
    tagline: 'Clinical Enteral Feeds for Critical Care & Post-Operative Recovery',
    highlights: [
      { icon: '🍃', label: 'Balanced Macronutrients', desc: 'Optimal protein, lipid, and carbohydrate ratios for ICU patients' },
      { icon: '🏥', label: 'ICU-Specific Formulations', desc: 'Designed for critically ill patients who cannot eat orally' },
      { icon: '🔬', label: 'Dietitian-Formulated', desc: 'Developed in collaboration with clinical dietitians' },
      { icon: '✅', label: 'GMP Manufactured', desc: 'Strict GMP conditions ensure safety and potency' },
    ],
    desc: [
      'EMYRIS BIOLIFESCIENCES provides specialized clinical enteral nutrition feeds designed for patients who cannot consume food orally. Our formulations are specifically developed to support metabolic systems in intensive care units.',
      'Our enteral products contain balanced ratios of proteins, essential amino acids, lipids, vitamins, and minerals. They are formulated to be easily absorbed, helping critical care patients maintain lean mass, preserve gut integrity, and accelerate post-operative recovery.',
      'All enteral nutrition products are prepared under strict GMP conditions and formulated by clinical dietitians to meet the specific nutritional requirements of critically ill and post-surgical patients.',
    ],
    productTable: [
      {
        category: 'Standard Feeds',
        color: '#059669',
        badge: 'CLINICAL RANGE',
        products: [
          'Balanced Polymeric Feed 1.0 Kcal/ml',
          'High Protein Feed 1.5 Kcal/ml',
          'Fibre-Enriched Balanced Formula',
        ],
      },
      {
        category: 'Disease-Specific Feeds',
        color: '#0ea5e9',
        badge: null,
        products: [
          'Diabetic Formula (Low GI)',
          'Renal Formula (Low Phosphate, Low Potassium)',
          'Hepatic Formula (Branched Chain Amino Acids)',
          'Pulmonary Formula (High Fat, Low Carbohydrate)',
          'Immune-Modulating Formula (with Arginine & Omega-3)',
        ],
      },
      {
        category: 'Supplementary Modular Feeds',
        color: '#d97706',
        badge: null,
        products: [
          'Whey Protein Isolate 25g Sachet',
          'MCT Oil 100ml Supplement',
          'Glutamine 5gm Sachet',
          'Arginine 5gm Sachet',
        ],
      },
    ],
  },
  'nutraceuticals': {
    title: 'Nutraceuticals',
    image: 'https://cms.emyrisbio.com/Content/images/offerings/Nutraceuticals.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=1200&q=80',
    icon: '💊',
    accentColor: '#d97706',
    tagline: 'Premium Wellness & Dietary Supplements with Bioactive Formulations',
    highlights: [
      { icon: '🌿', label: 'Natural Bioactives', desc: 'Pharmaceutical-grade extracts from verified natural sources' },
      { icon: '🔬', label: 'Bioavailability Tested', desc: 'Stability and bioavailability verified throughout shelf life' },
      { icon: '❤️', label: 'Cardiac & Cellular Health', desc: 'High-grade micro-nutrients for preventative wellness' },
      { icon: '✅', label: 'Quality Assured', desc: 'Every batch passes independent quality verification' },
    ],
    desc: [
      'EMYRIS BIOLIFESCIENCES Nutraceuticals division combines natural bioactive extracts with modern pharmaceutical science to provide premium wellness and dietary supplements.',
      'Our nutraceutical range is formulated with high-grade micro-nutrients that promote cellular health and cardiac wellness, catering to the growing preventative health sector in India.',
      'Each nutraceutical product undergoes thorough stability testing and bioavailability studies to ensure that active ingredients remain potent and therapeutically effective throughout the shelf life of the product.',
    ],
    productTable: [
      {
        category: 'Vitamins & Minerals',
        color: '#d97706',
        badge: 'WELLNESS RANGE',
        products: [
          'Vitamin D3 60,000 IU Capsule / Sachet',
          'Vitamin B12 1500mcg Methylcobalamin',
          'Calcium + Vitamin D3 500mg / 250IU Tab',
          'Zinc + Vitamin C Effervescent',
          'Iron + Folic Acid + Vitamin C Tab',
        ],
      },
      {
        category: 'Specialty Wellness',
        color: '#059669',
        badge: null,
        products: [
          'Omega-3 Fatty Acids 1000mg Softgel',
          'CoQ10 100mg Capsule',
          'Alpha Lipoic Acid 600mg Tab',
          'Lycopene + Antioxidant Formulation',
          'Curcumin Phytosome 500mg Capsule',
        ],
      },
      {
        category: 'Hepatoprotective',
        color: '#0ea5e9',
        badge: null,
        products: [
          'Silymarin 140mg (Milk Thistle Extract)',
          'UDCA 150mg / 300mg Tab',
          'L-Ornithine L-Aspartate Granules',
        ],
      },
    ],
  },
  'anasthetics': {
    title: 'Anaesthetics',
    image: 'https://cms.emyrisbio.com/Content/images/offerings/Anasthetics.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=1200&q=80',
    icon: '💉',
    accentColor: '#0ea5e9',
    tagline: 'High-Precision Anaesthetic Formulations for Surgical Safety',
    highlights: [
      { icon: '🏥', label: 'OT-Ready Formulations', desc: 'Designed for operation theatre safety and predictable recovery' },
      { icon: '🧊', label: 'Cold-Chain Handled', desc: 'Temperature-sensitive dispatch with full chain-of-custody' },
      { icon: '👨‍⚕️', label: 'Anaesthesiologist Endorsed', desc: 'Validated by senior anaesthesiologists across major hospitals' },
      { icon: '⚗️', label: 'Nitrogen-Purged Ampoules', desc: 'Sterile glass ampoules with oxygen-free purging for stability' },
    ],
    desc: [
      'EMYRIS BIOLIFESCIENCES provides high-precision regional and general anaesthetic formulations engineered for operation theatre safety and predictable recovery profiles.',
      'From local numbing agents to general surgical inhalants, Emyris Anaesthetics meet absolute purity standards. We utilize oxygen-free nitrogen purging and sterile glass ampoules to guarantee batch stability and dosage reliability during surgeries.',
      'Our anaesthetics are endorsed by senior anaesthesiologists and distributed through verified hospital procurement channels. We ensure cold-chain handling and uninterrupted supply to support planned and emergency surgical procedures.',
    ],
    productTable: [
      {
        category: 'General Anaesthetics',
        color: '#0ea5e9',
        badge: 'OT RANGE',
        products: [
          'Propofol 10mg/ml Inj (20ml / 50ml / 100ml)',
          'Ketamine 50mg/ml Inj (10ml)',
          'Thiopentone Sodium 500mg / 1gm Inj',
          'Etomidate 2mg/ml Inj (10ml)',
        ],
      },
      {
        category: 'Local Anaesthetics',
        color: '#7c3aed',
        badge: null,
        products: [
          'Bupivacaine 0.5% Inj (Heavy & Plain)',
          'Lignocaine 2% Inj (30ml)',
          'Ropivacaine 2mg/ml / 7.5mg/ml Inj',
          'Lignocaine + Adrenaline Inj',
        ],
      },
      {
        category: 'Neuromuscular Blockers',
        color: '#059669',
        badge: null,
        products: [
          'Atracurium 25mg / 50mg Inj',
          'Vecuronium 4mg / 10mg Inj',
          'Succinylcholine 500mg Inj',
          'Neostigmine 0.5mg / 2.5mg Inj',
        ],
      },
      {
        category: 'Reversal Agents',
        color: '#d97706',
        badge: null,
        products: [
          'Sugammadex 200mg / 500mg Inj',
          'Flumazenil 0.5mg Inj',
          'Naloxone 0.4mg Inj',
        ],
      },
    ],
  },
  'hiv': {
    title: 'HIV',
    image: 'https://cms.emyrisbio.com/Content/images/offerings/HIV.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80',
    icon: '🎗️',
    accentColor: '#db2777',
    tagline: 'Affordable Antiretroviral Therapy for Sustainable HIV Management',
    highlights: [
      { icon: '💊', label: 'WHO-GMP ARTs', desc: 'Antiretrovirals manufactured under strict WHO-GMP protocols' },
      { icon: '🔒', label: 'Discreet Supply Chain', desc: 'Confidential dispatch through verified HCP networks' },
      { icon: '💰', label: 'Affordable Access', desc: 'Committed to providing therapy regardless of financial status' },
      { icon: '❤️', label: 'Destigmatising HIV', desc: 'Compassionate care with equal access for all patients' },
    ],
    desc: [
      'EMYRIS BIOLIFESCIENCES provides advanced antiretroviral formulations to support chronic HIV therapy, reduce viral load, and enhance life expectancy for patients living with HIV.',
      'Our anti-HIV line is manufactured under strict WHO-GMP protocols, ensuring affordability without compromising therapeutic bio-equivalence. We strive to provide reliable and consistent supply channels for these critical therapies.',
      'We are committed to destigmatising HIV healthcare and ensuring that every patient, regardless of location or financial condition, has access to effective antiretroviral therapy. Our supply chain operates discreetly and reliably through verified HCP networks.',
    ],
    productTable: [
      {
        category: 'NRTIs',
        color: '#db2777',
        badge: 'FIRST-LINE ART',
        products: [
          'Tenofovir Disoproxil Fumarate 300mg Tab',
          'Emtricitabine 200mg Cap',
          'Lamivudine 150mg / 300mg Tab',
          'Zidovudine 300mg Tab',
          'Abacavir 300mg / 600mg Tab',
        ],
      },
      {
        category: 'NNRTIs',
        color: '#7c3aed',
        badge: null,
        products: [
          'Efavirenz 200mg / 600mg Tab',
          'Nevirapine 200mg Tab',
          'Rilpivirine 25mg Tab',
          'Doravirine 100mg Tab',
        ],
      },
      {
        category: 'Integrase Inhibitors',
        color: '#059669',
        badge: null,
        products: [
          'Dolutegravir 50mg Tab',
          'Raltegravir 400mg / 600mg Tab',
          'Bictegravir (in combo formulation)',
        ],
      },
      {
        category: 'Fixed-Dose Combinations',
        color: '#0ea5e9',
        badge: null,
        products: [
          'TDF + 3TC + EFV (Tenofovir + Lamivudine + Efavirenz)',
          'TDF + FTC + DTG (Tenofovir + Emtricitabine + Dolutegravir)',
          'AZT + 3TC (Zidovudine + Lamivudine)',
        ],
      },
    ],
  },
};

const ALL_OFFERINGS = [
  { slug: 'anti-infective', label: 'Anti-Infective', icon: '🧬' },
  { slug: 'oncology', label: 'Oncology', icon: '🔬' },
  { slug: 'enteral-nutrition', label: 'Enteral Nutrition', icon: '🧪' },
  { slug: 'nutraceuticals', label: 'Nutraceuticals', icon: '💊' },
  { slug: 'anasthetics', label: 'Anaesthetics', icon: '💉' },
  { slug: 'hiv', label: 'HIV', icon: '🎗️' },
];

// ── InquiryModal ─────────────────────────────────────────────────────────────
function InquiryModal({ offering, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const getRecaptchaToken = useRecaptcha();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const captchaToken = await getRecaptchaToken('inquiry_modal');
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, offering, captchaToken }),
      });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inquiry-modal-overlay" onClick={onClose}>
      <div className="inquiry-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="inquiry-modal-close" onClick={onClose} aria-label="Close">✕</button>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ color: '#002345', marginBottom: '0.5rem', fontSize: '1.4rem' }}>Thank You!</h3>
            <p style={{ color: '#64748b' }}>We received your inquiry for <strong>{offering}</strong>. Our team will reach out shortly.</p>
            <button className="btn" style={{ marginTop: '1.5rem' }} onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="inquiry-modal-header">
              <h3>Connect With Us</h3>
              <p>Submit your details for <strong>{offering}</strong> inquiry</p>
            </div>
            <form onSubmit={handleSubmit} className="inquiry-modal-form">
              <input type="text" required placeholder="Your Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input type="tel" required placeholder="Phone Number *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input type="email" required placeholder="Email Address *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <textarea rows="3" placeholder="Your Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              <button type="submit" className="btn" disabled={loading} style={{ width: '100%' }}>
                {loading ? '⏳ Sending…' : '📨 Submit Inquiry'}
              </button>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.4rem' }}>🔒 Protected by reCAPTCHA</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ── GenericPage ──────────────────────────────────────────────────────────────
function GenericPage() {
  const { pageId } = useParams();
  const location = useLocation();
  const { siteData } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isOffering = location.pathname.startsWith('/offerings');
  const offeringData = isOffering && pageId ? OFFERING_DATA[pageId] : null;

  const getTitle = () => {
    if (offeringData) return offeringData.title;
    if (pageId) return pageId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return location.pathname.replace('/', '').toUpperCase() || 'PAGE';
  };

  // ── Offering Detail Layout ─────────────────────────────────────────────────
  if (isOffering && offeringData) {
    const heroImg = imgError ? offeringData.fallbackImage : offeringData.image;
    const accent = offeringData.accentColor || '#1d4ed8';

    return (
      <div className="offering-page-wrapper fade-in">

        {/* ── Premium Page Title Banner ───────────────────────────────────── */}
        <div className="offering-page-title-banner" style={{
          background: `linear-gradient(135deg, #001830 0%, #002345 55%, ${accent}22 100%)`
        }}>
          <div className="offering-page-title-bg-glow" style={{ background: `radial-gradient(circle at 80% 50%, ${accent}30 0%, transparent 60%)` }}></div>
          <div className="offering-page-title-content">
            <div className="offering-page-icon-badge" style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}>
              <span>{offeringData.icon}</span>
              <span style={{ color: '#52cbcb', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>EMYRIS OFFERINGS</span>
            </div>
            <h1 style={{ color: '#ffffff' }}>{offeringData.title}</h1>
            <p className="offering-page-tagline">{offeringData.tagline}</p>
            <div className="offering-breadcrumb">
              <Link to="/">🏠 Home</Link>
              <span>›</span>
              <Link to="/offerings">Offerings</Link>
              <span>›</span>
              <span className="offering-breadcrumb-current">{offeringData.title}</span>
            </div>
          </div>
        </div>

        {/* ── Key Highlights Strip ────────────────────────────────────────── */}
        <div className="offering-highlights-strip">
          {offeringData.highlights.map((h, i) => (
            <div key={i} className="offering-highlight-item">
              <div className="offering-highlight-icon" style={{ color: accent }}>{h.icon}</div>
              <div>
                <strong style={{ color: '#0f172a', fontSize: '0.95rem', display: 'block' }}>{h.label}</strong>
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{h.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Two-column main layout (matches emyrisbio.com structure) ──── */}
        <div className="offering-page-body">

          {/* ── MAIN CONTENT AREA (9 cols) ───────────────────────────────── */}
          <div className="offering-main-content">

            {/* Hero image with rounded corners */}
            <div className="offering-hero-image-wrapper">
              <img
                src={heroImg}
                alt={offeringData.title}
                onError={() => setImgError(true)}
              />
              <div className="offering-hero-image-caption" style={{ borderLeft: `4px solid ${accent}` }}>
                <span style={{ color: accent, fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {offeringData.icon} {offeringData.title} — Emyris Biolifesciences
                </span>
              </div>
            </div>

            {/* Title + separator */}
            <div className="offering-content-header">
              <h2 className="offering-content-title">
                EMYRIS BIOLIFESCIENCES <span style={{ color: accent }}>{offeringData.title}</span>
              </h2>
              <div className="offering-title-divider">
                <span style={{ background: accent }}></span>
                <span style={{ background: '#52cbcb' }}></span>
              </div>
            </div>

            {/* Description paragraphs */}
            <div className="offering-description">
              {offeringData.desc.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* ── ICU/Product Range Table ──────────────────────────────── */}
            {offeringData.productTable && offeringData.productTable.length > 0 && (
              <div className="offering-product-table-wrapper">
                <div className="offering-table-header-row">
                  <h3 className="offering-table-heading">
                    <span style={{ color: accent }}>📋</span> ICU Range — Product Portfolio
                  </h3>
                  <span className="offering-table-badge" style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}>
                    WHO-GMP Certified
                  </span>
                </div>

                {/* Category cards — modern alternative to plain table */}
                <div className="offering-category-cards">
                  {offeringData.productTable.map((section, si) => (
                    <div key={si} className="offering-category-card" style={{ borderLeft: `4px solid ${section.color}` }}>
                      <div className="offering-category-card-header">
                        <div className="offering-category-label" style={{ background: `${section.color}15`, color: section.color }}>
                          {section.category}
                        </div>
                        {section.badge && (
                          <span className="offering-category-badge" style={{ background: section.color, color: '#fff' }}>
                            {section.badge}
                          </span>
                        )}
                      </div>
                      <ul className="offering-product-list">
                        {section.products.map((product, pi) => (
                          <li key={pi} className="offering-product-item">
                            <span className="offering-product-dot" style={{ background: section.color }}></span>
                            <span>{product}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Also show traditional table for print/reference */}
                <details className="offering-table-toggle">
                  <summary>📄 View as Table (Printable Format)</summary>
                  <table className="offering-product-table">
                    <thead>
                      <tr>
                        <th style={{ background: accent }}>Therapy / Category</th>
                        <th style={{ background: accent }}>Generic / Product</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offeringData.productTable.map((section, si) =>
                        section.products.map((product, pi) => (
                          <tr key={`${si}-${pi}`}>
                            {pi === 0 && (
                              <td rowSpan={section.products.length} className="offering-table-category" style={{ borderLeft: `3px solid ${section.color}` }}>
                                {section.category}
                              </td>
                            )}
                            <td>{product}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </details>
              </div>
            )}

            {/* Connect With Us CTA */}
            <div className="offering-cta-block" style={{ background: `linear-gradient(135deg, ${accent}08, ${accent}12)`, border: `1px solid ${accent}20` }}>
              <div className="offering-cta-text">
                <h4 style={{ color: '#0f172a', marginBottom: '0.4rem' }}>Interested in this product range?</h4>
                <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}>
                  Reach out to our medical team for pricing, availability, and prescribing support.
                </p>
              </div>
              <button className="btn" onClick={() => setShowModal(true)} style={{ background: accent, whiteSpace: 'nowrap', flexShrink: 0 }}>
                📞 Connect With Us
              </button>
            </div>
          </div>

          {/* ── SIDEBAR (3 cols) ──────────────────────────────────────────── */}
          <aside className="offering-sidebar">

            {/* Other offerings list */}
            <div className="offering-sidebar-widget">
              <h4 className="offering-sidebar-title">Our Offerings</h4>
              <ul className="offering-sidebar-nav">
                {ALL_OFFERINGS.map((o) => (
                  <li key={o.slug} className={o.slug === pageId ? 'active' : ''}>
                    <Link to={`/offerings/${o.slug}`}>
                      <span className="offering-sidebar-link-icon">{o.icon}</span>
                      {o.label}
                      <span className="offering-sidebar-arrow">›</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help widget */}
            <div className="offering-sidebar-help">
              <div className="offering-sidebar-help-icon">🎧</div>
              <h4>Let's Help You!</h4>
              <p>
                <strong>India Office</strong><br />
                {siteData.address || 'Sumadhura Pragati Chambers, Park Ln, Kalasiguda, Secunderabad, PIN-500003'}
              </p>
              <a href={`mailto:${siteData.email || 'contact@emyrisbio.com'}`} className="offering-sidebar-email">
                ✉️ {siteData.email || 'contact@emyrisbio.com'}
              </a>
              <Link to="/contact" className="btn" style={{ marginTop: '1.2rem', display: 'block', textAlign: 'center', textDecoration: 'none', background: accent }}>
                Contact Us →
              </Link>
            </div>

            {/* Certification badge */}
            <div className="offering-sidebar-cert">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
              <strong style={{ color: '#002345', display: 'block', fontSize: '0.95rem' }}>WHO-GMP Certified</strong>
              <p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
                All products manufactured in certified facilities under international quality standards.
              </p>
            </div>

          </aside>
        </div>

        {showModal && (
          <InquiryModal offering={offeringData.title} onClose={() => setShowModal(false)} />
        )}
      </div>
    );
  }

  // ── Generic / Service / Other page fallback ────────────────────────────────
  const title = getTitle();
  return (
    <div className="page-container fade-in" style={{ marginTop: '2rem' }}>
      <div className="glass" style={{
        background: 'linear-gradient(135deg, rgba(0,35,69,0.06), rgba(82,203,203,0.06))',
        borderRadius: '20px', padding: '3.5rem 3rem',
        marginBottom: '3rem', borderLeft: '5px solid #002345'
      }}>
        <span style={{ color: '#002345', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>
          EMYRIS {location.pathname.startsWith('/services') ? 'SERVICE' : 'PAGE'}
        </span>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#0f172a', margin: '0.5rem 0 1rem 0' }}>{title}</h1>
        <p style={{ fontSize: '1.1rem', color: '#64748b', margin: 0 }}>
          This section is being updated. Please check back soon or contact us for more details.
        </p>
        <Link to="/contact" className="btn" style={{ marginTop: '2rem', display: 'inline-block', textDecoration: 'none' }}>
          Contact Us
        </Link>
      </div>
    </div>
  );
}

export default GenericPage;
