const fs = require('fs');
const path = require('path');

const filePath = 'C:/Users/J S DASH/.gemini/antigravity/brain/9d632920-ccf9-4e3b-a6ad-dcac529c915b/.system_generated/steps/4/content.md';

if (!fs.existsSync(filePath)) {
  console.error("File not found!");
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');

console.log("=== SOCIAL LINKS AND FOOTER SEARCH ===");

const lines = content.split('\n');
lines.forEach((line, idx) => {
  const l = line.toLowerCase();
  if (l.includes('facebook') || 
      l.includes('twitter') || 
      l.includes('linkedin') || 
      l.includes('instagram') ||
      l.includes('youtube') ||
      l.includes('social') ||
      l.includes('office') ||
      l.includes('copyright') ||
      l.includes('toll free') ||
      l.includes('tollfree') ||
      l.includes('emyrisbio.com')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
