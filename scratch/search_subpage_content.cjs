const fs = require('fs');
const filePath = 'C:/Users/J S DASH/.gemini/antigravity/brain/9d632920-ccf9-4e3b-a6ad-dcac529c915b/.system_generated/steps/4/content.md';
const content = fs.readFileSync(filePath, 'utf8');

console.log("=== SEARCHING SUBPAGE DETAILS TEXT IN CONTENT.MD ===");
// Search for sections that discuss innovation, society, healthcare in detail
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('innovation') && line.length > 150) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
