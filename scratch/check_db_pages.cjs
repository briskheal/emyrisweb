const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

async function checkDb() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is not set in .env');
    return;
  }
  
  console.log('Connecting to database...');
  const sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Connected successfully to Neon Postgres!');

    const ConfigRecord = sequelize.define('ConfigRecord', {
      key: { type: DataTypes.STRING, primaryKey: true },
      value: { type: DataTypes.TEXT, allowNull: false }
    }, { timestamps: false });

    const pagesRecord = await ConfigRecord.findByPk('pages');
    if (!pagesRecord) {
      console.log('❌ "pages" record not found in database.');
    } else {
      console.log('✅ Found "pages" record.');
      const pages = JSON.parse(pagesRecord.value);
      console.log('Number of offerings:', pages.offerings ? pages.offerings.length : 0);
      
      if (pages.offerings && pages.offerings.length > 0) {
        console.log('First offering details:');
        console.log('Title:', pages.offerings[0].title);
        console.log('Slug:', pages.offerings[0].slug);
        console.log('Tagline:', pages.offerings[0].tagline);
        console.log('Desc paragraph count:', pages.offerings[0].desc ? pages.offerings[0].desc.length : 0);
        console.log('Desc excerpt:', pages.offerings[0].desc ? pages.offerings[0].desc.slice(0, 3) : null);
      }
    }
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
  } finally {
    await sequelize.close();
  }
}

checkDb();
