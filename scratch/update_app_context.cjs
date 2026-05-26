const fs = require('fs');

let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

const regex = /const \[siteData, setSiteData\] = useState\(\{[\s\S]*?\}\);\s*\/\/\s*Load from database on mount, fallback to local storage/;

content = content.replace(regex, `const [siteData, setSiteData] = useState(defaultSiteData);\n\n  // Load from database on mount, fallback to local storage`);

if (!content.includes("import defaultSiteData from './defaultSiteData.json';")) {
    content = `import defaultSiteData from './defaultSiteData.json';\n` + content;
}

fs.writeFileSync('src/context/AppContext.jsx', content);
console.log('Successfully updated AppContext.jsx');
