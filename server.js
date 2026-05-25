import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Sequelize, DataTypes } from 'sequelize';

dotenv.config();



const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Configure temp directory for multer temp files (Serverless compatible)
const uploadDir = os.tmpdir();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Cloudinary Configuration
let cloudinaryConfigured = false;
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  cloudinaryConfigured = true;
  console.log('✅ Cloudinary Configured Successfully');
} else {
  console.warn('⚠️ Cloudinary environment variables missing. File uploads will fallback to mock URLs.');
}

// Check for Database Placeholder
const isPlaceholderDb = !process.env.DATABASE_URL || 
                         process.env.DATABASE_URL.includes('YOUR_PASSWORD_HERE') || 
                         process.env.DATABASE_URL.includes('your-neon-hostname');

let sequelize;
let dbEnabled = false;

let Inquiry, Career, ConfigRecord;

if (isPlaceholderDb) {
  console.warn('⚠️ DATABASE_URL is configured with placeholder values. Running in Fallback/InMemory Database Mode.');
} else {
  try {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    });
    dbEnabled = true;
  } catch (err) {
    console.error('❌ Failed to initialize Sequelize database connection:', err.message);
    dbEnabled = false;
  }
}

// Define Models (Either SQL or In-Memory fallbacks)
let inMemoryInquiries = [];
let inMemoryCareers = [];
let inMemoryConfig = {};

if (dbEnabled && sequelize) {
  // Define SQL Models
  Inquiry = sequelize.define('Inquiry', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: true },
    offering: { type: DataTypes.STRING, allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'pending' }
  });

  Career = sequelize.define('Career', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: true },
    position: { type: DataTypes.STRING, allowNull: false },
    experience: { type: DataTypes.STRING, allowNull: true },
    resumeData: { type: DataTypes.TEXT, allowNull: true }, // base64 string
    resumeFileName: { type: DataTypes.STRING, allowNull: true },
    resumeFileType: { type: DataTypes.STRING, allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING, defaultValue: 'pending' }
  });

  ConfigRecord = sequelize.define('ConfigRecord', {
    key: { type: DataTypes.STRING, primaryKey: true },
    value: { type: DataTypes.TEXT, allowNull: false }
  });
}

// Default settings for seeding
const defaultBranding = {
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
  }
};

const defaultPages = {
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
      "Where healthcare excellence is our top priority.",
      "At EMYRIS BIOLIFESCIENCES, we're driven by our passion to make a positive impact on individuals and communities worldwide."
    ],
    values: ["Authenticity", "Customer Focus", "Responsibility", "Teamwork", "Integrity", "Limitless Living", "Healthcare", "Humanity"]
  },
  offerings: [
    { title: "Anti-Infective", desc: "Advanced solutions for combating infectious diseases and protecting public health.", color: "rgba(255, 99, 132, 0.2)" },
    { title: "Oncology", desc: "Cutting-edge therapies dedicated to fighting cancer and improving patient survival rates.", color: "rgba(54, 162, 235, 0.2)" }
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
  ]
};

// Database Initializer
async function initDb() {
  if (!dbEnabled || !sequelize) return;
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to Neon PostgreSQL Database.');
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized.');

    // Seed Config if empty
    const brandRecord = await ConfigRecord.findByPk('branding');
    if (!brandRecord) {
      await ConfigRecord.create({ key: 'branding', value: JSON.stringify(defaultBranding) });
      await ConfigRecord.create({ key: 'pages', value: JSON.stringify(defaultPages) });
      console.log('✅ Seeded default configurations into database.');
    } else {
      // Safe merge: ensure existing branding config is updated with the new header patch color
      try {
        const currentBranding = JSON.parse(brandRecord.value);
        if (currentBranding.headerColor === '#ffffff' || currentBranding.headerColor === 'rgba(255, 255, 255, 0.8)' || currentBranding.headerColor === 'rgba(0, 35, 69, 0.85)') {
          currentBranding.headerColor = '#002345';
          currentBranding.headerTextColor = '#ffffff';
          await brandRecord.update({ value: JSON.stringify(currentBranding) });
          console.log('✅ Updated header patch color to #002345 in branding database.');
        }
      } catch (e) {
        console.error('Failed to update brand color:', e);
      }
      // Safe merge: ensure existing pages config contains doctors and enhancers tables
      const pagesRecord = await ConfigRecord.findByPk('pages');
      if (pagesRecord) {
        try {
          const currentPages = JSON.parse(pagesRecord.value);
          let modified = false;
          if (!currentPages.doctors) {
            currentPages.doctors = defaultPages.doctors;
            modified = true;
          }
          if (!currentPages.enhancers) {
            currentPages.enhancers = defaultPages.enhancers;
            modified = true;
          }
          if (!currentPages.testimonials) {
            currentPages.testimonials = defaultPages.testimonials;
            modified = true;
          }
          if (!currentPages.logisticPartners) {
            currentPages.logisticPartners = defaultPages.logisticPartners;
            modified = true;
          }
          if (!currentPages.services || currentPages.services.length < 6) {
            currentPages.services = defaultPages.services;
            modified = true;
          }
          if (modified) {
            await pagesRecord.update({ value: JSON.stringify(currentPages) });
            console.log('✅ Merged missing dynamic tables (doctors, enhancers, testimonials, logistics, services) into Config database.');
          }
        } catch (e) {
          console.error('Failed to merge config tables:', e);
        }
      }
    }
  } catch (err) {
    console.error('❌ Error establishing Postgres connection. Falling back to InMemory mode.', err.message);
    dbEnabled = false;
  }
}

// Initialize the Database
initDb();

// --- API ENDPOINTS ---

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { adminId, password } = req.body;
  const correctId = process.env.ADMIN_ID;
  const correctPass = process.env.ADMIN_PASSWORD;

  if (correctId && correctPass && adminId === correctId && password === correctPass) {
    res.json({ success: true, message: 'Welcome Admin' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid Admin Credentials' });
  }
});

// Get Config (Public)
app.get('/api/config', async (req, res) => {
  try {
    if (dbEnabled) {
      const brandRecord = await ConfigRecord.findByPk('branding');
      const pagesRecord = await ConfigRecord.findByPk('pages');

      const branding = brandRecord ? JSON.parse(brandRecord.value) : defaultBranding;
      const pages = pagesRecord ? JSON.parse(pagesRecord.value) : defaultPages;

      res.json({ success: true, branding, pages });
    } else {
      // Fallback
      res.json({ 
        success: true, 
        branding: { ...defaultBranding, ...inMemoryConfig.branding }, 
        pages: { ...defaultPages, ...inMemoryConfig.pages } 
      });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Update Config (Admin only)
app.post('/api/admin/config', async (req, res) => {
  const { type, data } = req.body; // type can be 'branding' or 'pages'
  if (!['branding', 'pages'].includes(type)) {
    return res.status(400).json({ success: false, error: 'Invalid config type' });
  }

  try {
    if (dbEnabled) {
      const [record, created] = await ConfigRecord.findOrCreate({
        where: { key: type },
        defaults: { value: JSON.stringify(data) }
      });
      if (!created) {
        await record.update({ value: JSON.stringify(data) });
      }
      res.json({ success: true, message: `${type} updated successfully` });
    } else {
      inMemoryConfig[type] = data;
      res.json({ success: true, message: `${type} updated successfully (in memory)` });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Submit Contact Inquiry
app.post('/api/inquiries', async (req, res) => {
  const { name, email, phone, offering, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }

  try {
    if (dbEnabled) {
      const newInquiry = await Inquiry.create({ name, email, phone, offering, message });
      res.json({ success: true, inquiry: newInquiry });
    } else {
      const newInquiry = { id: Date.now(), name, email, phone, offering, message, status: 'pending', createdAt: new Date() };
      inMemoryInquiries.push(newInquiry);
      res.json({ success: true, inquiry: newInquiry });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Get Inquiries (Admin)
app.get('/api/admin/inquiries', async (req, res) => {
  try {
    if (dbEnabled) {
      const inquiries = await Inquiry.findAll({ order: [['createdAt', 'DESC']] });
      res.json({ success: true, inquiries });
    } else {
      res.json({ success: true, inquiries: [...inMemoryInquiries].reverse() });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Update Inquiry Status (Admin)
app.put('/api/admin/inquiries/:id', async (req, res) => {
  const { status } = req.body;
  try {
    if (dbEnabled) {
      const inquiry = await Inquiry.findByPk(req.params.id);
      if (!inquiry) return res.status(404).json({ success: false, error: 'Inquiry not found' });
      await inquiry.update({ status });
      res.json({ success: true, inquiry });
    } else {
      const idx = inMemoryInquiries.findIndex(i => i.id == req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, error: 'Inquiry not found' });
      inMemoryInquiries[idx].status = status;
      res.json({ success: true, inquiry: inMemoryInquiries[idx] });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Delete Inquiry (Admin)
app.delete('/api/admin/inquiries/:id', async (req, res) => {
  try {
    if (dbEnabled) {
      const deleted = await Inquiry.destroy({ where: { id: req.params.id } });
      res.json({ success: true, deleted: deleted > 0 });
    } else {
      inMemoryInquiries = inMemoryInquiries.filter(i => i.id != req.params.id);
      res.json({ success: true });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Submit Career Application
app.post('/api/careers', upload.single('resume'), async (req, res) => {
  const { name, email, phone, position, experience, message } = req.body;
  if (!name || !email || !position) {
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    return res.status(400).json({ success: false, error: 'Name, email, and position are required.' });
  }

  let resumeData = null;
  let resumeFileName = null;
  let resumeFileType = null;

  if (req.file) {
    try {
      const fileBuffer = fs.readFileSync(req.file.path);
      resumeData = fileBuffer.toString('base64');
      resumeFileName = req.file.originalname;
      resumeFileType = req.file.mimetype;
      fs.unlinkSync(req.file.path); // cleanup temp upload
    } catch (err) {
      console.error("Error reading uploaded CV file:", err);
    }
  }

  try {
    if (dbEnabled) {
      const newApp = await Career.create({ name, email, phone, position, experience, resumeData, resumeFileName, resumeFileType, message });
      res.json({ success: true, application: { id: newApp.id, name: newApp.name, email: newApp.email, position: newApp.position, resumeFileName } });
    } else {
      const newApp = { id: Date.now(), name, email, phone, position, experience, resumeData, resumeFileName, resumeFileType, message, status: 'pending', createdAt: new Date() };
      inMemoryCareers.push(newApp);
      res.json({ success: true, application: { id: newApp.id, name: newApp.name, email: newApp.email, position: newApp.position, resumeFileName } });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Get Career Applications (Admin)
app.get('/api/admin/careers', async (req, res) => {
  try {
    if (dbEnabled) {
      const applications = await Career.findAll({ order: [['createdAt', 'DESC']] });
      res.json({ success: true, applications });
    } else {
      res.json({ success: true, applications: [...inMemoryCareers].reverse() });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Update Career Application Status (Admin)
app.put('/api/admin/careers/:id', async (req, res) => {
  const { status } = req.body;
  try {
    if (dbEnabled) {
      const appRecord = await Career.findByPk(req.params.id);
      if (!appRecord) return res.status(404).json({ success: false, error: 'Application not found' });
      await appRecord.update({ status });
      res.json({ success: true, application: appRecord });
    } else {
      const idx = inMemoryCareers.findIndex(c => c.id == req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, error: 'Application not found' });
      inMemoryCareers[idx].status = status;
      res.json({ success: true, application: inMemoryCareers[idx] });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Delete Career Application (Admin)
app.delete('/api/admin/careers/:id', async (req, res) => {
  try {
    if (dbEnabled) {
      const deleted = await Career.destroy({ where: { id: req.params.id } });
      res.json({ success: true, deleted: deleted > 0 });
    } else {
      inMemoryCareers = inMemoryCareers.filter(c => c.id != req.params.id);
      res.json({ success: true });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Download CV from DB
app.get('/api/admin/careers/:id/cv', async (req, res) => {
  try {
    let cvRecord;
    if (dbEnabled) {
      cvRecord = await Career.findByPk(req.params.id);
    } else {
      cvRecord = inMemoryCareers.find(c => c.id == req.params.id);
    }

    if (!cvRecord || !cvRecord.resumeData) {
      return res.status(404).send('CV file not found.');
    }

    const buffer = Buffer.from(cvRecord.resumeData, 'base64');
    res.setHeader('Content-Type', cvRecord.resumeFileType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${cvRecord.resumeFileName || 'resume.pdf'}"`);
    res.send(buffer);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Cloudinary File Upload Endpoint (Admin Only)
app.post('/api/admin/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    if (cloudinaryConfigured) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'emyrisweb/branding'
      });

      // Cleanup local file synchronously
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Failed to delete temp file:', err);
      }

      res.json({ success: true, url: result.secure_url });
    } else {
      // Mock File Upload if Cloudinary is not configured
      const filename = path.basename(req.file.path);
      console.warn('⚠️ Cloudinary is offline. Returning mock URL.');
      res.json({ success: true, url: `https://via.placeholder.com/150?text=${encodeURIComponent(filename)}` });
    }
  } catch (e) {
    console.error('Upload Error:', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', dbEnabled, cloudinaryConfigured, timestamp: new Date() });
});



const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' || process.env.RUN_LOCAL) {
  app.listen(PORT, () => {
    console.log(`🚀 EmyrisWeb backend running on http://localhost:${PORT}`);
    console.log(`📡 Backend health endpoint: http://localhost:${PORT}/api/health`);
  });
}

export default app;
