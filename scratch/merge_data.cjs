const fs = require('fs');

let raw = fs.readFileSync('scratch/config_dump_utf8.json', 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) {
    raw = raw.slice(1);
}
const data = JSON.parse(raw);

if (data.success && data.branding && data.pages) {
    const merged = { ...data.branding, ...data.pages };
    fs.writeFileSync('src/context/defaultSiteData.json', JSON.stringify(merged, null, 2));
    console.log('Successfully created defaultSiteData.json');
} else {
    console.error('Data format is incorrect');
}
