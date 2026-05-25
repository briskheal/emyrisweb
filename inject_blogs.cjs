const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

async function run() {
  const blogs = JSON.parse(fs.readFileSync('scraped_blogs.json', 'utf8')).map(b => ({
    ...b,
    status: 'published',
    publishDate: null
  }));

  console.log(`Loaded ${blogs.length} blogs to inject.`);

  // 1. Update Database ConfigRecord key='pages'
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    },
    logging: false
  });

  const ConfigRecord = sequelize.define('ConfigRecord', {
    key: { type: DataTypes.STRING, primaryKey: true },
    value: { type: DataTypes.TEXT, allowNull: false }
  }, { timestamps: false });

  await sequelize.authenticate();
  
  const record = await ConfigRecord.findOne({ where: { key: 'pages' } });
  if (record) {
    const data = JSON.parse(record.value);
    data.blogs = blogs;
    record.value = JSON.stringify(data);
    await record.save();
    console.log('✅ PostgreSQL "pages" config updated with blogs!');
  } else {
    console.log('❌ ConfigRecord key="pages" not found in DB!');
  }
  await sequelize.close();

  // 2. Patch server.js to add default blogs
  const serverFile = 'server.js';
  let serverContent = fs.readFileSync(serverFile, 'utf8');

  // Let's find defaultPages and add `blogs: [...]` inside it.
  // We can insert `blogs: [ ... ],` right after `slides: [ ... ],` or just at the end of defaultPages.
  // Let's search for "advisors: [" inside defaultPages
  const insertKey = 'advisors: [';
  const insertIndex = serverContent.indexOf(insertKey);
  if (insertIndex !== -1) {
    const blogsStr = `blogs: ${JSON.stringify(blogs, null, 4).replace(/\n/g, '\n  ')},\n  `;
    serverContent = serverContent.slice(0, insertIndex) + blogsStr + serverContent.slice(insertIndex);
    fs.writeFileSync(serverFile, serverContent);
    console.log('✅ server.js defaultPages patched with blogs!');
  } else {
    console.log('❌ Could not find insertion spot in server.js');
  }

  // 3. Patch src/context/AppContext.jsx to add default blogs
  const contextFile = 'src/context/AppContext.jsx';
  let contextContent = fs.readFileSync(contextFile, 'utf8');

  const contextInsertKey = 'offerings: [';
  const contextInsertIndex = contextContent.indexOf(contextInsertKey);
  if (contextInsertIndex !== -1) {
    const blogsStr = `blogs: ${JSON.stringify(blogs, null, 4).replace(/\n/g, '\n    ')},\n    `;
    contextContent = contextContent.slice(0, contextInsertIndex) + blogsStr + contextContent.slice(contextInsertIndex);
    fs.writeFileSync(contextFile, contextContent);
    console.log('✅ AppContext.jsx default state patched with blogs!');
  } else {
    console.log('❌ Could not find insertion spot in AppContext.jsx');
  }
  
  process.exit(0);
}

run().catch(console.error);
