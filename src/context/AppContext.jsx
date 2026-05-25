import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [siteData, setSiteData] = useState({
    logo: 'https://emyrisbio.com/Files/25032025070135.png',
    companyName: 'EMYRIS BIOLIFESCIENCES',
    youtubeVideoId: 'ysz5S6PUM-U',
    contactNumber: '+91 7993163300',
    email: 'contact@emyrisbio.com',
    address: 'Plot No. 12, Secunderabad, Telangana, India',
    tollFree: '1800-123-4567',
    headerColor: '#002345',
    footerColor: '#0f172a',
    headerTextColor: '#ffffff',
    footerTextColor: '#ffffff',
    socialLinks: {
      facebook: 'https://www.facebook.com/profile.php?id=61556130077286&mibextid=ZbWKwL',
      twitter: 'https://x.com/emyrisbio',
      instagram: 'https://www.instagram.com/emyrisbio?igsh=MWJwc2g0d2dncmlnbg==',
      linkedin: 'https://lnkd.in/dh_7SNMh'
    },
    slides: [
      {
        title: 'Committed to Innovation',
        subtitle: 'At Emyris Biolifesciences, our dedication to innovation is woven into the fabric of our organization. We recognize that in the dynamic landscape of healthcare, innovation is not just a choice but a necessity.',
        image: 'https://cms.emyrisbio.com//Files/30042024124445.jpg',
        details: 'We invest heavily in state-of-the-art research facilities, partnering with leading scientific experts to develop next-generation formulations that offer superior efficacy and safety. Our primary R&D focuses are:\n- **Advanced Anti-Infective Formulations**: Combatting highly resistant pathogens.\n- **Targeted Oncology Therapies**: Cytotoxic and supportive oncology formulations.\n- **Enteral Clinical Nutrition**: Advanced dietary supplements for patient recovery.\n\nThrough continuous innovation, Emyris Biolifesciences aims to deliver affordable and accessible healthcare solutions to patients across the nation.'
      },
      {
        title: 'Committed to Society',
        subtitle: 'At Emyris Biolifesciences, our commitment to society extends far beyond the boundaries of our business. We believe that as a leading pharmaceutical company, we have a fundamental responsibility to positively impact the communities we serve and contribute to the betterment of society as a whole.',
        image: 'https://cms.emyrisbio.com//Files/30042024124507.jpg',
        details: 'We believe that as a leading pharmaceutical company, we have a fundamental responsibility to positively impact the communities we serve and contribute to the betterment of society. Our social responsibility programs focus on:\n- **Free Diagnostic Camps**: Regular screening camps in remote rural areas.\n- **Essential Drug Supply**: Supplying medicines to underserved clinics.\n- **Green Manufacturing Operations**: Adopting eco-friendly production methods to minimize waste.\n\nBy aligning our corporate values with societal well-being, we strive to build a sustainable future where every individual has access to high-quality healthcare.'
      },
      {
        title: 'Emyris Biolifesciences',
        subtitle: 'Emyris Biolifesciences is one of the fastest growing pharmaceutical companies in India. Over the past few years, we have been developing and manufacturing affordable medicines for patients across country',
        image: 'https://cms.emyrisbio.com//Files/30042024124533.jpg',
        details: 'Emyris Biolifesciences has established itself as one of the fastest growing pharmaceutical leaders in India, driven by our dedication to medical reliability and excellence. Key growth highlights include:\n- **Wide Distribution Reach**: Ensuring critical medicines reach rural and urban pharmacies alike.\n- **WHO-GMP Manufacturing Compliance**: Batch formulations made in sterile, certified facility blocks.\n- **Professional Sales Force**: Providing scientific details and visual aids to medical consultants.\n\nOur operations combine clinical science with logistical excellence, ensuring Emyris remains a trusted partner for healthcare professionals and patient families across the nation.'
      },
      {
        title: 'Committed to Healthcare',
        subtitle: 'At Emyris Biolifesciences, our dedication to healthcare is at the core of everything we do. Since our inception, we have remained steadfast in our commitment to improving the well-being of individuals and communities worldwide.',
        image: 'https://cms.emyrisbio.com//Files/30042024124554.jpg',
        details: 'Our dedication to healthcare is at the core of everything we do. Emyris provides round-the-clock assistance for critical medical requirements. Our patient care desk is structured around:\n- **Emergency Hotline Channels**: Immediate access for hospital connect and stock procurement.\n- **Doctor Collaboration Panel**: Consultations with specialists regarding critical care drug applications.\n- **Specialized Therapy Support**: Priority logistics for high-stakes treatments like anesthetics and enteral feeds.\n\nOur medical teams are available 24/7, working tirelessly to support hospitals, clinics, and pharmacies in delivering compassionate, safe, and effective patient care.'
      }
    ],
    discover: {
      title: 'Welcome to EMYRIS BIOLIFESCIENCES',
      paragraphs: [
        "Where healthcare excellence is our top priority. Whether you're a valued customer, a dedicated healthcare professional, or simply intrigued by our mission, we're excited to have you join our pharmaceutical family.",
        "At EMYRIS BIOLIFESCIENCES, we're driven by our passion to make a positive impact on individuals and communities worldwide. With unwavering commitment to innovation, integrity, and patient-centered care, we strive to deliver cutting-edge pharmaceutical solutions that meet the ever-evolving needs of healthcare today and in the future."
      ],
      values: ["Authenticity", "Customer Focus", "Responsibility", "Teamwork", "Integrity", "Limitless Living", "Healthcare", "Humanity"]
    },
    offerings: [
      { title: "Anti-Infective", desc: "Advanced solutions for combating infectious diseases and protecting public health.", color: "rgba(255, 99, 132, 0.2)" },
      { title: "Oncology", desc: "Cutting-edge therapies dedicated to fighting cancer and improving patient survival rates.", color: "rgba(54, 162, 235, 0.2)" },
      { title: "Enteral Nutrition", desc: "Specialized nutritional products for patients who cannot consume food orally.", color: "rgba(255, 206, 86, 0.2)" },
      { title: "Nutraceuticals", desc: "Premium dietary supplements designed for long-term health and wellness.", color: "rgba(75, 192, 192, 0.2)" }
    ],
    services: [
      {
        title: "Research and Development (R&D)",
        desc: "At EMYRIS BIOLIFESCIENCES, we believe that research and development are the cornerstones of innovation. Our R&D team is dedicated to discovering and developing cutting-edge pharmaceutical solutions that address unmet medical needs. With a focus on scientific excellence and collaboration, we strive to bring new therapies and treatments to the market that improve patient outcomes and enhance quality of life.",
        icon: "🔬"
      },
      {
        title: "Manufacturing and Production",
        desc: "Our state-of-the-art manufacturing facilities adhere to the highest standards of quality, safety, and compliance. From formulation development to packaging and distribution, we maintain strict controls and protocols to ensure that every product we market meets rigorous regulatory requirements and exceeds customer expectations.",
        icon: "🏭"
      },
      {
        title: "Regulatory Affairs and Compliance",
        desc: "Navigating the complex landscape of regulatory affairs and compliance is essential to our success and the success of our partners. Our dedicated team of experts works tirelessly to ensure that our products meet all regulatory requirements and adhere to the highest standards of quality and safety. We stay abreast of evolving regulations and guidelines to ensure ongoing compliance and regulatory readiness.",
        icon: "📋"
      },
      {
        title: "Sales and Marketing",
        desc: "Our sales and marketing teams are committed to building strong relationships with healthcare professionals, institutions, and stakeholders throughout India. Through targeted marketing initiatives, educational programs, and strategic partnerships, we strive to raise awareness about our products and therapies and provide valuable support and resources to our customers.",
        icon: "📈"
      },
      {
        title: "Complete Distribution and Logistics",
        desc: "With a solid network of distribution partners and logistics experts, we ensure that our products reach patients and healthcare providers around the country safely and efficiently. Our robust distribution infrastructure and supply chain management capabilities enable us to meet the demands of a rapidly evolving marketplace while maintaining product integrity and reliability.",
        icon: "🚚"
      },
      {
        title: "Customer Support and Service",
        desc: "Exceptional customer support and service are paramount at EMYRIS BIOLIFESCIENCES. Our customer support team is available around the clock to address inquiries, resolve issues, and provide timely assistance to our customers and partners. We are committed to delivering superior products and ensuring that our customers' needs are met with professionalism, courtesy, and cost-effectiveness.",
        icon: "🛠️"
      }
    ],
    testimonials: [
      {
        id: 1,
        name: "Rishita Dash",
        role: "Representative",
        company: "Business Partner Organization",
        quote: "Our partnership with Emyris Biolifesciences has been incredibly fulfilling. Their dedication to quality, innovation, and patient care is visible in every batch of medicines they supply and in the integrity of their clinical operations."
      },
      {
        id: 2,
        name: "Dr. Rajesh Khanna",
        role: "Consultant Oncologist",
        company: "City Tertiary Care Hospital",
        quote: "Emyris's targeted therapies and prompt support channels have made a significant difference in oncologist patient care. Their oncology and critical care drug reliability is absolutely outstanding."
      },
      {
        id: 3,
        name: "Sarah Patel",
        role: "Nurse Practitioner",
        company: "Emergency Critical Care Unit",
        quote: "The enteral nutrition and clinical support feeds provided by Emyris are exceptionally formulated, speeding up post-operative patient recovery in our ICU wards. Their support desk is responsive and professional."
      }
    ],
    logisticPartners: [
      { id: 1, name: "DHL SmartSensor Logistics", scope: "Cold Chain Critical Logistics", icon: "📦" },
      { id: 2, name: "Blue Dart Apex Cold Chain", scope: "Domestic Express Distribution", icon: "✈️" },
      { id: 3, name: "FedEx Custom Critical Care", scope: "Emergency Distribution Channels", icon: "🚀" },
      { id: 4, name: "Emyris Cold-Chain Express", scope: "Regional Warehouse Logistics", icon: "🚚" }
    ],
    advisors: [
      {
        id: 1,
        name: 'Shabbirhusen Akhai',
        role: 'Legal Affairs Advisor',
        image: 'https://cms.emyrisbio.com//Files/02052024015259.jpg',
        bio: 'Mr. Shabir carrying a vast experience in company legal affairs and we are immensely proud to have him in our board of advisors. In Emyris we not only believe in doing things, but also believes in doing same correctly as advised by our esteemed advisors.'
      },
      {
        id: 2,
        name: 'Dr. Bachaspati Dash',
        role: 'Medical Advisor',
        image: 'https://cms.emyrisbio.com//Files/30042024051357.jpg',
        bio: 'Dr. Bachaspati Dash, esteemed advisor at Emyris Biolifesciences, enriches the company with profound medical insights and strategic guidance, advancing its mission to revolutionize healthcare solutions and improve patient outcomes.'
      },
      {
        id: 3,
        name: 'Mr. Shishir Ranjan Mishra',
        role: 'Strategic Advisor',
        image: 'https://cms.emyrisbio.com//Files/30042024051457.jpg',
        bio: 'Mr. Shishir Ranjan Mishra, an esteemed advisor at Emyris Biolifesciences, brings expertise and strategic insight, driving the company\'s mission to advance healthcare solutions and improve patient outcomes through innovation and excellence.'
      },
      {
        id: 4,
        name: 'Mr. Jayanta Kumar Bhutia',
        role: 'Operations & Logistics Advisor',
        image: 'https://cms.emyrisbio.com//Files/30042024051523.jpg',
        bio: 'Mr. Jayanta Kumar Bhutia, an esteemed advisor at Emyris Biolifesciences, contributes invaluable guidance and leadership, steering the company towards achieving its goals in delivering innovative healthcare solutions and enhancing patient care.'
      }
    ],
    doctors: [
      {
        id: 1,
        name: 'Dr. Rajesh Khanna',
        role: 'Consultant Oncologist',
        image: 'https://via.placeholder.com/370x380?text=Dr.+Rajesh+Khanna',
        bio: 'Dr. Khanna is a prominent oncologist with 15+ years of practice in tertiary care hospitals. He advises Emyris on our specialized chemotherapy drugs, patient-centric oncology support structures, and nutritional requirements during critical cancer treatments.'
      },
      {
        id: 2,
        name: 'Dr. Sneha Reddy',
        role: 'Critical Care Specialist',
        image: 'https://via.placeholder.com/370x380?text=Dr.+Sneha+Reddy',
        bio: 'An expert in emergency medicine and clinical nutrition, Dr. Reddy helps Emyris design enteral nutrition solutions, ensuring intensive-care patients receive precise dietary support matching their metabolic profiles.'
      },
      {
        id: 3,
        name: 'Dr. Amit Patel',
        role: 'Pediatric Nutritionist',
        image: 'https://via.placeholder.com/370x380?text=Dr.+Amit+Patel',
        bio: 'Dr. Patel consults on our pediatric nutraceutical and wellness formulations. His research on childhood micro-nutrient deficiencies guides our developers in crafting safe, highly bio-available supplements.'
      }
    ],
    enhancers: [
      {
        id: 1,
        name: 'Silla Padhi',
        role: 'Executive Director',
        image: 'https://cms.emyrisbio.com//Files/03092024125723.jpg',
        bio: 'Silla Padhi is a marketing expert in Biotechnology, Healthcare, and FMCG with an MBA in Marketing and Biotechnology. She excels in strategic product marketing across Asian and European markets and is currently pursuing Impact Measurement & Management for the SDGs from Duke University. As Executive Director of EMYRIS BIOLIFESCIENCES, Silla drives the company\'s vision and business development, focusing on delivering high-quality, accessible medicines globally. Her leadership is key to advancing healthcare, expanding market reach, and fostering sustainable growth through innovative, research-driven solutions.'
      },
      {
        id: 2,
        name: 'J.Ranjan Dash',
        role: 'Business Operation Head, India',
        image: 'https://cms.emyrisbio.com//Files/03092024125703.jpg',
        bio: 'Mr. J. Ranjan Dash is a veteran in industry with MBA in Marketing, having 3 decades of Industry experiences, being associated with National and Multination companies, engaged as Business Operation Head, India. Mr. Dash focuses on Critical Care , Nutrition & Herbo-Nutraceuticals business by improving productivity, streamlining operational issues and eliminating bottlenecks and bringing newer marketing concept into Emyris Biolifesciences Business. His unwavering passion for creativity and relentless pursuit to find best and economical products for consumer benefits, continue to drive Emyris Biotech business to a newer height. His mantra of success is “Build a Team, invest in cultivating their strength to make them challenge-ready”.'
      }
    ]
  });

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
    const pagesKeys = ['slides', 'discover', 'offerings', 'services', 'advisors', 'doctors', 'enhancers', 'testimonials', 'logisticPartners'];

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
      if (hasBranding) {
        const brandingData = {};
        brandingKeys.forEach(k => { brandingData[k] = newDataToSave[k]; });
        await fetch('/api/admin/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'branding', data: brandingData })
        });
      }

      if (hasPages) {
        const pagesData = {};
        pagesKeys.forEach(k => { pagesData[k] = newDataToSave[k]; });
        await fetch('/api/admin/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
