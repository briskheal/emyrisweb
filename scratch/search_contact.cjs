const fs = require('fs');
const filePath = 'C:/Users/J S DASH/.gemini/antigravity/brain/9d632920-ccf9-4e3b-a6ad-dcac529c915b/.system_generated/steps/4/content.md';
const content = fs.readFileSync(filePath, 'utf8');

console.log("=== CONTACT AND PHONE SEARCH ===");
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (/\d{4,}/.test(line) || line.includes('@') || line.includes('Phone') || line.includes('Toll')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
