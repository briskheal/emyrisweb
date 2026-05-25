const fs = require('fs');
const filePath = 'C:/Users/J S DASH/.gemini/antigravity/brain/9d632920-ccf9-4e3b-a6ad-dcac529c915b/.system_generated/steps/4/content.md';
const content = fs.readFileSync(filePath, 'utf8');

console.log("=== SLIDER STYLE AND COLOR SEARCH ===");
const lines = content.split('\n');
lines.forEach((line, idx) => {
  const l = line.toLowerCase();
  if (idx > 120 && idx < 300) { // This is where the slider is defined in content.md
    if (l.includes('style') || l.includes('class') || l.includes('color') || l.includes('rgba') || l.includes('rgb')) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
