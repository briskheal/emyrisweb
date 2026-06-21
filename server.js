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
import pg from 'pg'; // Force Vercel to bundle pg
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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
let dbError = null;

let Inquiry, Career, ConfigRecord, FormSubmission;

if (isPlaceholderDb) {
  console.warn('⚠️ DATABASE_URL is configured with placeholder values. Running in Fallback/InMemory Database Mode.');
  dbError = 'DATABASE_URL is missing or contains placeholder values';
} else {
  try {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectModule: pg,
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
    dbError = 'Instantiation error: ' + err.message;
    dbEnabled = false;
  }
}

// Define Models (Either SQL or In-Memory fallbacks)
let inMemoryInquiries = [];
let inMemoryCareers = [];
let inMemoryConfig = {};
let inMemorySubmissions = [];

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

  FormSubmission = sequelize.define('FormSubmission', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    subject: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    servicePage: { type: DataTypes.STRING, allowNull: true },
    attachmentData: { type: DataTypes.TEXT, allowNull: true },
    attachmentFileName: { type: DataTypes.STRING, allowNull: true },
    attachmentFileType: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING, defaultValue: 'pending' }
  });
}

// Default settings for seeding
const defaultBranding = {
  logo: '/images/assets/logo.png',
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
      image: '/images/assets/slide1.jpg',
      details: 'We invest heavily in state-of-the-art research facilities, partnering with leading scientific experts to develop next-generation formulations that offer superior efficacy and safety. Our primary R&D focuses are:\n- **Advanced Anti-Infective Formulations**: Combatting highly resistant pathogens.\n- **Targeted Oncology Therapies**: Cytotoxic and supportive oncology formulations.\n- **Enteral Clinical Nutrition**: Advanced dietary supplements for patient recovery.\n\nThrough continuous innovation, Emyris Biolifesciences aims to deliver affordable and accessible healthcare solutions to patients across the nation.'
    },
    {
      title: 'Committed to Society',
      subtitle: 'At Emyris Biolifesciences, our commitment to society extends far beyond the boundaries of our business. We believe that as a leading pharmaceutical company, we have a fundamental responsibility to positively impact the communities we serve and contribute to the betterment of society as a whole.',
      image: '/images/assets/slide2.jpg',
      details: 'We believe that as a leading pharmaceutical company, we have a fundamental responsibility to positively impact the communities we serve and contribute to the betterment of society. Our social responsibility programs focus on:\n- **Free Diagnostic Camps**: Regular screening camps in remote rural areas.\n- **Essential Drug Supply**: Supplying medicines to underserved clinics.\n- **Green Manufacturing Operations**: Adopting eco-friendly production methods to minimize waste.\n\nBy aligning our corporate values with societal well-being, we strive to build a sustainable future where every individual has access to high-quality healthcare.'
    },
    {
      title: 'Emyris Biolifesciences',
      subtitle: 'Emyris Biolifesciences is one of the fastest growing pharmaceutical companies in India. Over the past few years, we have been developing and manufacturing affordable medicines for patients across country',
      image: '/images/assets/slide3.jpg',
      details: 'Emyris Biolifesciences has established itself as one of the fastest growing pharmaceutical leaders in India, driven by our dedication to medical reliability and excellence. Key growth highlights include:\n- **Wide Distribution Reach**: Ensuring critical medicines reach rural and urban pharmacies alike.\n- **WHO-GMP Manufacturing Compliance**: Batch formulations made in sterile, certified facility blocks.\n- **Professional Sales Force**: Providing scientific details and visual aids to medical consultants.\n\nOur operations combine clinical science with logistical excellence, ensuring Emyris remains a trusted partner for healthcare professionals and patient families across the nation.'
    },
    {
      title: 'Committed to Healthcare',
      subtitle: 'At Emyris Biolifesciences, our dedication to healthcare is at the core of everything we do. Since our inception, we have remained steadfast in our commitment to improving the well-being of individuals and communities worldwide.',
      image: '/images/assets/slide4.jpg',
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
        {
            "title": "Anti-Infective",
            "slug": "anti-infective",
            "image": "/images/banners/anti-infective.jpg",
            "icon": "✨",
            "accentColor": "#1d4ed8",
            "tagline": "Explore our specialized Anti-Infective formulations.",
            "desc": [
                "EMYRIS BIOLIFESCIENCES Anti-Infective, where we specialize\nin providing a comprehensive range of high-quality\nanti-infective medications at affordable prices. Our\ncommitment to healthcare excellence drives us to\noffer effective solutions to combat infections while\nprioritizing accessibility for all.",
                "Our anti-infective product portfolio encompasses a\ndiverse range of qualitative medications tailored to\naddress various infectious conditions. From\nantibiotics to antivirals and antifungals, we strive\nto meet the therapeutic needs of healthcare\nprofessionals and patients alike.",
                "At EMYRIS BIOLIFESCIENCES, we prioritize patient safety and\nwellbeing. Therefore, we strictly adhere to the\npractice of selling our anti-infective medications\nexclusively through healthcare professionals (HCPs).\nPatients can connect with us through their\nhealthcare providers to inquire about our\nanti-infective products and pricing.",
                "Our team is dedicated to ensuring that our\nanti-infective medications meet stringent quality\nstandards, regulatory requirements, and\naffordability criteria. We are committed to\nsupporting healthcare providers in their efforts to\ncombat infections and improve patient outcomes.",
                "For more information about our anti-infective range\nof products and pricing, please reach out to us. We\nare here to support healthcare professionals and\npatients in their fight against infectious diseases,\nproviding safe, effective, and accessible solutions.",
                "ICU RANGE",
                "Anti infection",
                "Ceftazidime 2gm + Avibactam  0.5gm",
                "Clindamycin Inj 300 mg /600mg",
                "Meropenem 1gm",
                "Clarithromycin 500mg",
                "Colistimethate Sodium 1MIU/2MIU/3MIU",
                "Doxycycline 100 mg",
                "Polymyxin B Sulphate 500000 IU, 750000 IU",
                "Tiecoplanin 200 mg/400mg",
                "Tigecycline 50mg/100mg",
                "Vancomycin 500mg/1000mg",
                "Ampilicin 1gm Sulbactum .5gm",
                "Anti Fungals",
                "Liposomal Amphotericin B 50 mg Inj",
                "Caspofungin 50mg/70mg",
                "Voriconazole 200mg Inj, 200mg  Suspension, 200mg Tab",
                "Anti inflimatory",
                "Methyl Prednisole Sodium Succinate 40mg/125mg/500mg/1 GM",
                "Hydrocortisone Sodium 100mg",
                "Anti Oxidant",
                "Gluthathione 600 mg",
                "N Acetylcysteine 400mg/1000mg/600mg Tab",
                "GH Regulator",
                "Octreotide 50mcg/100mcg",
                "Pschostimulant",
                "Citicoline 500/1000mg"
            ],
            "products": [
                {
                    "therapy": "Anti infection",
                    "genericName": "Ceftazidime 2gm + Avibactam&nbsp; 0.5gm\nClindamycin Inj 300 mg /600mg\nMeropenem 1gm\nClarithromycin 500mg\nColistimethate Sodium 1MIU/2MIU/3MIU\nDoxycycline 100 mg\nPolymyxin B Sulphate 500000 IU, 750000 IU\nTiecoplanin 200 mg/400mg\nTigecycline 50mg/100mg\nVancomycin 500mg/1000mg\nAmpilicin 1gm Sulbactum .5gm",
                    "moleculeName": ""
                },
                {
                    "therapy": "Anti Fungals",
                    "genericName": "Liposomal Amphotericin B 50 mg Inj\nCaspofungin 50mg/70mg\nVoriconazole 200mg Inj, 200mg&nbsp; Suspension, 200mg Tab",
                    "moleculeName": ""
                },
                {
                    "therapy": "Anti inflimatory",
                    "genericName": "Methyl Prednisole Sodium Succinate 40mg/125mg/500mg/1 GM\nHydrocortisone Sodium 100mg",
                    "moleculeName": ""
                },
                {
                    "therapy": "Anti Oxidant",
                    "genericName": "Gluthathione 600 mg\nN Acetylcysteine 400mg/1000mg/600mg Tab",
                    "moleculeName": ""
                },
                {
                    "therapy": "GH Regulator",
                    "genericName": "Octreotide 50mcg/100mcg",
                    "moleculeName": ""
                },
                {
                    "therapy": "Pschostimulant",
                    "genericName": "Citicoline 500/1000mg",
                    "moleculeName": ""
                }
            ]
        },
        {
            "title": "Oncology",
            "slug": "oncology",
            "image": "/images/banners/oncology.jpg",
            "icon": "✨",
            "accentColor": "#1d4ed8",
            "tagline": "Explore our specialized Oncology formulations.",
            "desc": [
                "Where we specialize in offering a comprehensive range of supportive care products tailored to meet the unique needs of cancer patients. As a dedicated healthcare company, we are committed to providing high-quality medications and supportive therapies to improve the quality of life for individuals battling cancer.",
                "Our oncology portfolio encompasses a diverse array of supportive care products designed to manage the side effects of cancer treatment, alleviate symptoms, and enhance overall well-being. From antiemetics to pain management medications, growth factors, and nutritional supplements, we aim to address the multifaceted challenges faced by cancer patients during their treatment journey.",
                "At EMYRIS BIOLIFESCIENCES, we prioritize patient-centered care and strive to empower healthcare providers with effective solutions to enhance the comfort and quality of life of their patients undergoing cancer treatment. Our supportive care products are developed and manufactured adhering to rigorous quality standards and regulatory requirements, ensuring their safety, efficacy, and reliability.",
                "We understand the critical role of supportive care in improving treatment outcomes and minimizing treatment-related complications for cancer patients. Therefore, our team is dedicated to collaborating with healthcare professionals to provide comprehensive support and guidance in managing the complex needs of cancer patients.",
                "For more information about our range of supportive care products for oncology patients, please connect with us. We are committed to supporting healthcare providers and patients in their journey towards better health and improved quality of life amidst the challenges of cancer treatment.",
                "Immuno-modulator",
                "L-Glutamine Sachet",
                "Protein Supplements",
                "1.High Protein Powder (Whey)",
                "2.High Protein Powder(Albumen)",
                "3.Onco Care Protein (ALA, DHA, Glutamine)",
                "Antioxidant",
                "1.Lycopene, Multi-vitamin & Multimineral",
                "2.Co-enzyme, L-Carnitine & Curcumin Tab",
                "3.Beta-Carotene, Vit-B, Berry Ext. Omega-3 Capsules",
                "Antifungals",
                "Voriconazole Tab & Syp",
                "Caspofungin Acetate for Inj. 50mg /Inj. 70mg(Lyophilized)",
                "Amphotericin B Liposomal 50mg inj"
            ],
            "products": [
                {
                    "therapy": "Immuno-modulator",
                    "genericName": "L-Glutamine Sachet",
                    "moleculeName": ""
                },
                {
                    "therapy": "Protein Supplements",
                    "genericName": "1.High Protein Powder (Whey)\n2.High Protein Powder(Albumen)\n3.Onco Care Protein (ALA, DHA, Glutamine)",
                    "moleculeName": ""
                },
                {
                    "therapy": "Antioxidant",
                    "genericName": "1.Lycopene, Multi-vitamin &amp; Multimineral\n2.Co-enzyme, L-Carnitine &amp; Curcumin Tab\n3.Beta-Carotene, Vit-B, Berry Ext. Omega-3 Capsules",
                    "moleculeName": ""
                },
                {
                    "therapy": "Antifungals",
                    "genericName": "Voriconazole Tab &amp; Syp\nCaspofungin Acetate for Inj. 50mg /Inj. 70mg(Lyophilized)\nAmphotericin B Liposomal 50mg inj",
                    "moleculeName": ""
                }
            ]
        },
        {
            "title": "Enteral Nutrition",
            "slug": "enteral-nutrition",
            "image": "/images/banners/enteral-nutrition.jpg",
            "icon": "✨",
            "accentColor": "#1d4ed8",
            "tagline": "Explore our specialized Enteral Nutrition formulations.",
            "desc": [
                "EMYRIS BIOLIFESCIENCES Enteral Nutrition, where we take pride in manufacturing high-quality enteral nutrition products at our state-of-the-art facility located in Gujarat. As a trusted name in the healthcare industry, we are dedicated to providing superior enteral nutrition solutions to meet the diverse nutritional needs of patients.",
                "Our enteral nutrition products are meticulously formulated to provide essential nutrients, vitamins, and minerals required for optimal patient health and well-being. Whether it's tube feeding formulas, nutritional supplements, or specialized enteral nutrition solutions, we strive to offer a comprehensive range of products to support patients with varying nutritional requirements.",
                "At EMYRIS BIOLIFESCIENCES, quality is paramount in everything we do. Our manufacturing facility adheres to stringent quality control measures and complies with regulatory standards to ensure the safety, efficacy, and purity of our enteral nutrition products. We utilize advanced manufacturing processes and cutting-edge technology to produce formulations that meet the highest standards of excellence.",
                "We understand the importance of tailored nutrition in promoting patient recovery and overall health. Therefore, our enteral nutrition products are developed with a focus on patient-centered care, providing optimal nutrition to support healing, enhance immune function, and improve patient outcomes.",
                "Healthcare professionals can rely on EMYRIS BIOLIFESCIENCES for reliable, high-quality enteral nutrition solutions that prioritize patient safety and well-being. For more information about our enteral nutrition products and manufacturing capabilities, please connect with us. We are committed to providing superior enteral nutrition options to support the nutritional needs of patients across diverse healthcare settings.",
                "Enteral Nutriton Range",
                "Categorization",
                "Brand Name",
                "Gold Starndard",
                "Whey Isolate",
                "Protein Supplements",
                "High Protein Formulation",
                "ALOMOS HP",
                "Standard Protein Formulation",
                "ALOMOS ST",
                "Diabetic Care Formulation",
                "ALOMOS DM",
                "Oral Albumen Protein",
                "ALOMOS ORAL ALBUMEN",
                "Nephro Care Formulation",
                "ALOMOS NC",
                "Weight Reduction Formulation",
                "ALOMOS GOLD",
                "Oncho Care Formulation",
                "ALOMOS ON",
                "Gastro Care Formulation",
                "ALOMOS GC",
                "Pregnancy & Lactation Care",
                "ALOMOS MAMA",
                "Ortho Care Formulation",
                "ALOMOS OC",
                "Superfood Fiber",
                "Superfood Fiber Formulation",
                "ALOMOS SF",
                "High Fiber Berry",
                "ALOMOS OB",
                "BCAA & MCT LIQUID SHOT",
                "ALOMOS-LS"
            ],
            "products": [
                {
                    "therapy": "Standard Protein Formulation",
                    "genericName": "ALOMOS ST",
                    "moleculeName": ""
                },
                {
                    "therapy": "Diabetic Care Formulation",
                    "genericName": "ALOMOS DM",
                    "moleculeName": ""
                },
                {
                    "therapy": "Oral Albumen Protein",
                    "genericName": "ALOMOS ORAL ALBUMEN",
                    "moleculeName": ""
                },
                {
                    "therapy": "Nephro Care Formulation",
                    "genericName": "ALOMOS NC",
                    "moleculeName": ""
                },
                {
                    "therapy": "Weight Reduction Formulation",
                    "genericName": "ALOMOS GOLD",
                    "moleculeName": ""
                },
                {
                    "therapy": "Oncho Care Formulation",
                    "genericName": "ALOMOS ON",
                    "moleculeName": ""
                },
                {
                    "therapy": "Gastro Care Formulation",
                    "genericName": "ALOMOS GC",
                    "moleculeName": ""
                },
                {
                    "therapy": "Pregnancy & Lactation Care",
                    "genericName": "ALOMOS MAMA",
                    "moleculeName": ""
                },
                {
                    "therapy": "Ortho Care Formulation",
                    "genericName": "ALOMOS OC",
                    "moleculeName": ""
                },
                {
                    "therapy": "High Fiber Berry",
                    "genericName": "ALOMOS OB",
                    "moleculeName": ""
                },
                {
                    "therapy": "BCAA & MCT LIQUID SHOT",
                    "genericName": "ALOMOS-LS",
                    "moleculeName": ""
                }
            ]
        },
        {
            "title": "Nutraceuticals",
            "slug": "nutraceuticals",
            "image": "/images/banners/nutraceuticals.jpg",
            "icon": "✨",
            "accentColor": "#1d4ed8",
            "tagline": "Explore our specialized Nutraceuticals formulations.",
            "desc": [
                "Where we take pride in manufacturing high-quality enteral nutrition products at our state-of-the-art facility located in Gujarat. As a trusted name in the healthcare industry, we are dedicated to providing superior enteral nutrition solutions to meet the diverse nutritional needs of patients.",
                "Our enteral nutrition products are meticulously formulated to provide essential nutrients, vitamins, and minerals required for optimal patient health and well-being. Whether it's tube feeding formulas, nutritional supplements, or specialized enteral nutrition solutions, we strive to offer a comprehensive range of products to support patients with varying nutritional requirements.",
                "At EMYRIS BIOLIFESCIENCES, quality is paramount in everything we do. Our manufacturing facility adheres to stringent quality control measures and complies with regulatory standards to ensure the safety, efficacy, and purity of our enteral nutrition products. We utilize advanced manufacturing processes and cutting-edge technology to produce formulations that meet the highest standards of excellence.",
                "We understand the importance of tailored nutrition in promoting patient recovery and overall health. Therefore, our enteral nutrition products are developed with a focus on patient-centered care, providing optimal nutrition to support healing, enhance immune function, and improve patient outcomes.",
                "Healthcare professionals can rely on EMYRIS BIOLIFESCIENCES for reliable, high-quality enteral nutrition solutions that prioritize patient safety and well-being. For more information about our enteral nutrition products and manufacturing capabilities, please connect with us. We are committed to providing superior enteral nutrition options to support the nutritional needs of patients across diverse healthcare settings.",
                "Neutraceutical Range",
                "Anti Inflammatory Herbal Agent",
                "Nano Curcumin (Water Soluble) 150ml Syp + Tab",
                "Conventional Oncho Care",
                "Nano Curcumin + Piperine + Lycopene Syp + Tab",
                "Antioxidant",
                "1.N-Acetyl Cysteine, Vit C, Sillinium",
                "2.L-Carnitine, Co-Enzyme Q10,Vit-E, Ala, Omega",
                "Anti Arthritic Pain",
                "Pain relief Roll On (Herbal)",
                "Pain Relief Spray with Wintergreen and Nilgiri Oil",
                "1.Joint Care Capsules Herbal",
                "2.Joint Care Capsule with MSM and Glucosamine, Chondroitin Sulphate, Co-Enzyme Q10",
                "Neuro Care",
                "1.Omega, EPA, DHA, Vit-A, Vit-D3, L-Carnosine Syp (200ml)",
                "2.Omega, EPA, DHA, Vitamins & Minerals Cap",
                "3.Co-Enzyme Q10, Astaxanthin, Omega 3Cap",
                "D3 Deficiency",
                "1.Nano 60,000 IU for 5ml bottle for Pediatric use",
                "2.Soft gel 60,00 IU Cap for Adults",
                "Female care",
                "1.Intimate Wash",
                "2.Intimate Gel",
                "3.Uterine Tonic",
                "4.Protein Supplements",
                "5.Mothers Milk Enhancer formulation",
                "Sleep Disorder",
                "1.L-Theanine, Milatonin, 5-Hydroxytryptophan,Grifonia Simplicifolia Tan",
                "2.Milatonin Spray form for better sleep"
            ],
            "products": [
                {
                    "therapy": "Anti Inflammatory Herbal Agent",
                    "genericName": "Nano Curcumin (Water Soluble) 150ml Syp + Tab",
                    "moleculeName": ""
                },
                {
                    "therapy": "Conventional Oncho Care",
                    "genericName": "Nano Curcumin + Piperine + Lycopene Syp + Tab",
                    "moleculeName": ""
                },
                {
                    "therapy": "Antioxidant",
                    "genericName": "1.N-Acetyl Cysteine, Vit C, Sillinium\n2.L-Carnitine, Co-Enzyme Q10,Vit-E, Ala, Omega",
                    "moleculeName": ""
                },
                {
                    "therapy": "Anti Arthritic Pain",
                    "genericName": "Pain relief Roll On (Herbal)\nPain Relief Spray with Wintergreen and Nilgiri Oil\n1.Joint Care Capsules Herbal\n2.Joint Care Capsule with MSM and Glucosamine, Chondroitin Sulphate, Co-Enzyme Q10",
                    "moleculeName": ""
                },
                {
                    "therapy": "Neuro Care",
                    "genericName": "1.Omega, EPA, DHA, Vit-A, Vit-D3, L-Carnosine Syp (200ml)\n2.Omega, EPA, DHA, Vitamins &amp; Minerals Cap\n3.Co-Enzyme Q10, Astaxanthin, Omega 3Cap",
                    "moleculeName": ""
                },
                {
                    "therapy": "D3 Deficiency",
                    "genericName": "1.Nano 60,000 IU for 5ml bottle for Pediatric use\n2.Soft gel 60,00 IU Cap for Adults",
                    "moleculeName": ""
                },
                {
                    "therapy": "Female care",
                    "genericName": "1.Intimate Wash\n2.Intimate Gel\n3.Uterine Tonic\n4.Protein Supplements\n5.Mothers Milk Enhancer formulation",
                    "moleculeName": ""
                },
                {
                    "therapy": "Sleep Disorder",
                    "genericName": "1.L-Theanine, Milatonin, 5-Hydroxytryptophan,Grifonia Simplicifolia Tan\n2.Milatonin Spray form for better sleep",
                    "moleculeName": ""
                }
            ]
        },
        {
            "title": "Anasthetics",
            "slug": "anasthetics",
            "image": "/images/banners/anasthetics.jpg",
            "icon": "✨",
            "accentColor": "#1d4ed8",
            "tagline": "Explore our specialized Anasthetics formulations.",
            "desc": [
                "Where we offer a comprehensive range of high-quality\nanesthetic products exclusively available to\nhealthcare professionals (HCP). As a leading\npharmaceutical company dedicated to healthcare\nexcellence, we prioritize the safety and efficacy of\nour anesthetic solutions.",
                "Our anesthetics portfolio encompasses a diverse\nrange of products tailored to meet the varied needs\nof healthcare providers and patients across\ndifferent medical specialties. From local\nanesthetics for minor procedures to general\nanesthetics for major surgeries, we strive to\nprovide a complete suite of anesthesia options to\nsupport optimal patient care.",
                "At EMYRIS BIOLIFESCIENCES, we place a strong emphasis on\nquality assurance throughout the manufacturing\nprocess. Our anesthetic products are manufactured in\nstate-of-the-art facilities that adhere to strict\nquality control standards and regulatory guidelines.\nWe employ advanced manufacturing technologies and\nrigorous testing procedures to ensure the safety,\npurity, and potency of our products.",
                "We understand the critical role that anesthetics\nplay in ensuring patient comfort and safety during\nmedical procedures. Therefore, our anesthetic\nformulations are meticulously developed and\ncarefully formulated to deliver reliable and\nconsistent anesthesia outcomes while minimizing\nadverse effects.",
                "Healthcare professionals can trust EMYRIS BIOLIFESCIENCES\nfor access to a reliable and comprehensive range of\nanesthetic products that meet the highest standards\nof quality and safety. Our commitment to healthcare\nexcellence extends beyond product quality to\nencompass ongoing support, education, and training\nto empower HCPs in delivering optimal patient care.",
                "For more information about our anesthetic products\nand how they can benefit your clinical practice,\nplease contact us. We are dedicated to supporting\nhealthcare professionals with innovative and\nreliable anesthetic solutions that enhance patient\noutcomes and ensure procedural success.",
                "Anasthesia Range",
                "Premedicant",
                "Gylcopyrolate 0.2mg",
                "Local Anesthetic",
                "Lignocaine 2% W/V in 30ml",
                "Lignocaine 2% W/V + Adrenaline ( 1:200000) 30ml",
                "Bupivacaine 0.25%/0.5%",
                "Induction Agent",
                "Propofol emulsion 1% W/V in 100/200/500 mg vial",
                "Etomidate 20 mg",
                "Reversal Agent",
                "Neostigmine Methylsulphate 0.5mg/ 2.5 mg",
                "Neostigmine 2.5 mg + Glycopyrolate 0.5 mg",
                "Sedative Agent",
                "Dexmedetomidine Hcl 50mg/100mg",
                "Muscle Relaxants",
                "Rocuronium Bromide 50/100 mg",
                "Vecuronium Bromide 4mg/10mg",
                "Atracuriium Besylate 25/50mg"
            ],
            "products": [
                {
                    "therapy": "Premedicant",
                    "genericName": "Gylcopyrolate 0.2mg",
                    "moleculeName": ""
                },
                {
                    "therapy": "Local Anesthetic",
                    "genericName": "Lignocaine 2% W/V in 30ml\nLignocaine 2% W/V + Adrenaline ( 1:200000) 30ml\nBupivacaine 0.25%/0.5%",
                    "moleculeName": ""
                },
                {
                    "therapy": "Induction Agent",
                    "genericName": "Propofol emulsion 1% W/V in 100/200/500 mg vial\nEtomidate 20 mg",
                    "moleculeName": ""
                },
                {
                    "therapy": "Reversal Agent",
                    "genericName": "Neostigmine Methylsulphate 0.5mg/ 2.5 mg\nNeostigmine 2.5 mg + Glycopyrolate 0.5 mg",
                    "moleculeName": ""
                },
                {
                    "therapy": "Sedative Agent",
                    "genericName": "Dexmedetomidine Hcl 50mg/100mg",
                    "moleculeName": ""
                },
                {
                    "therapy": "Muscle Relaxants",
                    "genericName": "Rocuronium Bromide 50/100 mg\nVecuronium Bromide 4mg/10mg\nAtracuriium Besylate 25/50mg",
                    "moleculeName": ""
                }
            ]
        },
        {
            "title": "HIV",
            "slug": "hiv",
            "image": "/images/banners/hiv.jpg",
            "icon": "✨",
            "accentColor": "#1d4ed8",
            "tagline": "Explore our specialized HIV formulations.",
            "desc": [
                "We are dedicated to revolutionizing HIV treatment by introducing affordable and innovative pharmaceutical solutions. Our upcoming line of HIV drugs is meticulously designed to meet the pressing healthcare needs of patients living with HIV/AIDS, offering effective treatment options at accessible prices.",
                "EMYRIS BIOSCIENCES is committed to leveraging cutting-edge research and development to bring forth novel HIV medications that not only effectively manage the virus but also improve the quality of life for patients. Our team of experts is dedicated to formulating HIV drugs that prioritize efficacy, safety, and affordability without compromising on quality.",
                "We understand the challenges faced by HIV patients in accessing essential medications, which is why we are working tirelessly to ensure that our upcoming HIV drug range is affordable and accessible to all. By offering cost-effective solutions, we aim to empower individuals living with HIV/AIDS to adhere to their treatment regimens and achieve better health outcomes.",
                "Our commitment to affordability extends beyond just pricing. We also prioritize patient education, support, and advocacy to ensure that individuals affected by HIV have access to comprehensive care and resources. Through partnerships with healthcare providers, advocacy organizations, and community initiatives, we strive to create a supportive ecosystem for HIV patients.",
                "At EMYRIS BIOLIFESCIENCES, we recognize the urgency of addressing the global HIV epidemic and are dedicated to playing our part in combatting it. Stay tuned for updates on our forthcoming HIV drug offerings, as we continue to work towards providing accessible and effective treatment options for HIV patients worldwide."
            ],
            "products": []
        }
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
      image: '/images/assets/advisor-shabbirhusen.jpg',
      bio: 'Mr. Shabir carrying a vast experience in company legal affairs and we are immensely proud to have him in our board of advisors. In Emyris we not only believe in doing things, but also believes in doing same correctly as advised by our esteemed advisors.'
    },
    {
      id: 2,
      name: 'Dr. Bachaspati Dash',
      role: 'Medical Advisor',
      image: '/images/assets/advisor-bachaspati.jpg',
      bio: 'Dr. Bachaspati Dash, esteemed advisor at Emyris Biolifesciences, enriches the company with profound medical insights and strategic guidance, advancing its mission to revolutionize healthcare solutions and improve patient outcomes.'
    },
    {
      id: 3,
      name: 'Mr. Shishir Ranjan Mishra',
      role: 'Strategic Advisor',
      image: '/images/assets/advisor-shishir.jpg',
      bio: 'Mr. Shishir Ranjan Mishra, an esteemed advisor at Emyris Biolifesciences, brings expertise and strategic insight, driving the company\'s mission to advance healthcare solutions and improve patient outcomes through innovation and excellence.'
    },
    {
      id: 4,
      name: 'Mr. Jayanta Kumar Bhutia',
      role: 'Operations & Logistics Advisor',
      image: '/images/assets/advisor-jayanta.jpg',
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
      image: '/images/assets/enhancer-silla.jpg',
      bio: 'Silla Padhi is a marketing expert in Biotechnology, Healthcare, and FMCG with an MBA in Marketing and Biotechnology. She excels in strategic product marketing across Asian and European markets and is currently pursuing Impact Measurement & Management for the SDGs from Duke University. As Executive Director of EMYRIS BIOLIFESCIENCES, Silla drives the company\'s vision and business development, focusing on delivering high-quality, accessible medicines globally. Her leadership is key to advancing healthcare, expanding market reach, and fostering sustainable growth through innovative, research-driven solutions.'
    },
    {
      id: 2,
      name: 'J.Ranjan Dash',
      role: 'Business Operation Head, India',
      image: '/images/assets/enhancer-jranjan.jpg',
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
  ],
  markets: [
    { id: 1, name: "Delhi", lat: 28.6139, lng: 77.2090, status: "Active" },
    { id: 2, name: "Lucknow", lat: 26.8467, lng: 80.9462, status: "Active" },
    { id: 3, name: "Bhubaneswar", lat: 20.2961, lng: 85.8245, status: "Active" },
    { id: 4, name: "Kolkata", lat: 22.5726, lng: 88.3639, status: "Active" },
    { id: 5, name: "Guwahati", lat: 26.1445, lng: 91.7362, status: "Active" },
    { id: 6, name: "Hyderabad", lat: 17.3850, lng: 78.4867, status: "Active" },
    { id: 7, name: "Chennai", lat: 13.0827, lng: 80.2707, status: "Active" },
    { id: 8, name: "Ahmedabad", lat: 23.0225, lng: 72.5714, status: "Active" },
    { id: 9, name: "Surat", lat: 21.1702, lng: 72.8311, status: "Active" },
    { id: 10, name: "Rajkot", lat: 22.3039, lng: 70.8022, status: "Active" },
    { id: 11, name: "Vadodara", lat: 22.3072, lng: 73.1812, status: "Active" },
    { id: 12, name: "Mumbai", lat: 19.0760, lng: 72.8777, status: "Active" },
    { id: 13, name: "Pune", lat: 18.5204, lng: 73.8567, status: "Active" },
    { id: 14, name: "Jaipur", lat: 26.9124, lng: 75.7873, status: "Active" }
  ]
};

// Database Initializer
async function initDb() {
  if (!dbEnabled || !sequelize) return;
  try {
    // Attempt to authenticate connection
    await sequelize.authenticate();
    console.log('✅ Connected to Neon PostgreSQL Database.');

    // Only run schema sync automatically if in local development to avoid Neon locks on Netlify Serverless
    if (process.env.NODE_ENV !== 'production' && !process.env.NETLIFY) {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized locally.');
    } else {
      console.log('✅ Bypassing automated schema sync for Serverless environment.');
    }

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
          if (!currentPages.markets) {
            currentPages.markets = defaultPages.markets;
            modified = true;
          } else {
            const hasJaipur = currentPages.markets.some(m => m.name === 'Jaipur');
            if (!hasJaipur) {
              currentPages.markets.push({ id: 14, name: "Jaipur", lat: 26.9124, lng: 75.7873, status: "Active" });
              modified = true;
            }
          }
                    if (!currentPages.offerings || currentPages.offerings.length <= 2 || !currentPages.offerings[0].slug) {
            currentPages.offerings = defaultPages.offerings;
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
    dbError = 'Connection error: ' + err.message;
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
    // Vercel Edge Caching to drastically reduce Fast Origin Transfer
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=3600');

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
app.get('/api/test-email', async (req, res) => {
  try {
    await transporter.verify();
    let info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "SMTP Test",
      text: "If you see this, SMTP is working."
    });
    res.json({ success: true, message: "Email sent successfully", info });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, stack: err.stack, code: err.code });
  }
});

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

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'contact@emyrisbio.com',
        subject: `New Inquiry from ${name}`,
        text: `You have received a new inquiry.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nOffering: ${offering || 'N/A'}\n\nMessage:\n${message}`
      });

      // Send auto-responder to the user
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Thank you for contacting Emyris Biolifesciences`,
        text: `Dear ${name},\n\nThank you for reaching out to Emyris Biolifesciences. We have received your inquiry and our team will get back to you shortly.\n\nBest regards,\nEmyris Biolifesciences Team`
      });
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
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

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'contact@emyrisbio.com',
      subject: `New Career Application from ${name}`,
      text: `You have received a new career application.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nPosition: ${position}\nExperience: ${experience || 'N/A'}\n\nMessage:\n${message || 'N/A'}`
    };
    if (resumeData) {
      mailOptions.attachments = [{
        filename: resumeFileName,
        content: Buffer.from(resumeData, 'base64'),
        contentType: resumeFileType
      }];
    }
    try {
      await transporter.sendMail(mailOptions);

      // Send auto-responder to the applicant
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Application Received - Emyris Biolifesciences`,
        text: `Dear ${name},\n\nThank you for applying for the ${position} position at Emyris Biolifesciences. We have successfully received your application and resume. Our HR team will review your profile and contact you if your qualifications match our requirements.\n\nBest regards,\nEmyris Biolifesciences HR Team`
      });
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Submit Form (for Services Pages)
app.post('/api/submissions', upload.single('attachment'), async (req, res) => {
  const { name, email, subject, phone, message, servicePage } = req.body;
  if (!name || !email || !message) {
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }

  let attachmentData = null;
  let attachmentFileName = null;
  let attachmentFileType = null;

  if (req.file) {
    try {
      const fileBuffer = fs.readFileSync(req.file.path);
      attachmentData = fileBuffer.toString('base64');
      attachmentFileName = req.file.originalname;
      attachmentFileType = req.file.mimetype;
      fs.unlinkSync(req.file.path);
    } catch (err) {
      console.error("Error reading uploaded attachment:", err);
    }
  }

  try {
    if (dbEnabled) {
      const newSubmission = await FormSubmission.create({ name, email, subject, phone, message, servicePage, attachmentData, attachmentFileName, attachmentFileType });
      res.json({ success: true, submission: { id: newSubmission.id, name: newSubmission.name, email: newSubmission.email } });
    } else {
      const newSubmission = { id: Date.now(), name, email, subject, phone, message, servicePage, attachmentData, attachmentFileName, attachmentFileType, status: 'pending', createdAt: new Date() };
      inMemorySubmissions.push(newSubmission);
      res.json({ success: true, submission: { id: newSubmission.id, name: newSubmission.name, email: newSubmission.email } });
    }

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'contact@emyrisbio.com',
      subject: `New Contact Submission from ${name}: ${subject || 'No Subject'}`,
      text: `You have received a new contact submission.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nService Area: ${servicePage || 'N/A'}\n\nMessage:\n${message}`
    };
    if (attachmentData) {
      mailOptions.attachments = [{
        filename: attachmentFileName,
        content: Buffer.from(attachmentData, 'base64'),
        contentType: attachmentFileType
      }];
    }
    try {
      await transporter.sendMail(mailOptions);

      // Send auto-responder to the user
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Thank you for contacting Emyris Biolifesciences`,
        text: `Dear ${name},\n\nThank you for your message regarding ${servicePage || 'our services'}. We have received your submission and one of our representatives will contact you shortly.\n\nBest regards,\nEmyris Biolifesciences Team`
      });
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
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
        folder: 'emyrisweb/branding',
        format: 'webp'
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
  res.json({ 
    status: 'UP', 
    dbEnabled, 
    dbError,
    cloudinaryConfigured, 
    hasDbUrl: !!process.env.DATABASE_URL,
    dbUrlLength: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
    timestamp: new Date() 
  });
});



// --- COOLIFY STANDALONE HOSTING CONFIGURATION ---
// Serve the built React frontend static files from the 'dist' directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'dist')));

// Wildcard catch-all: If it's not an API route, send back the React index.html
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    next();
  }
});
// ------------------------------------------------

const PORT = process.env.PORT || 5000;
// Vercel Serverless handles listening automatically. For all other environments (like Coolify), we must manually start the server.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 EmyrisWeb backend running on http://localhost:${PORT}`);
    console.log(`📡 Backend health endpoint: http://localhost:${PORT}/api/health`);
  });
}

export default app;
