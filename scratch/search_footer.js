const fs = require('fs');
const path = require('path');

const filePath = 'C:/Users/J S DASH/.gemini/antigravity/brain/9d632920-ccf9-4e3b-a6ad-dcac529c915b/.system_generated/steps/4/content.md';

if (!fs.existsSync(filePath)) {
  console.error("File not found!");
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');

console.log("=== SOCIAL LINKS AND FOOTER SEARCH ===");

// Let's find lines containing social networks
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('facebook') || 
      line.toLowerCase().includes('twitter') || 
      line.toLowerCase().includes('linkedin') || 
      line.toLowerCase().includes('instagram') ||
      line.toLowerCase().includes('youtube') ||
      line.toLowerCase().includes('social') ||
      line.toLowerCase().includes('address') ||
      line.toLowerCase().includes('office') ||
      line.toLowerCase().includes('copyright') ||
      line.toLowerCase().includes('phone') ||
      line.toLowerCase().includes('toll free') ||
      line.toLowerCase().includes('tollfree')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
