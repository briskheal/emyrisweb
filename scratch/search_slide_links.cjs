const fs = require('fs');
const filePath = 'C:/Users/J S DASH/.gemini/antigravity/brain/9d632920-ccf9-4e3b-a6ad-dcac529c915b/.system_generated/steps/4/content.md';
const content = fs.readFileSync(filePath, 'utf8');

console.log("=== SLIDER LINKS SEARCH ===");
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (idx > 175 && idx < 295) {
    if (line.includes('<a') || line.includes('href')) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
