const fs = require('fs');
const filePath = 'C:/Users/J S DASH/.gemini/antigravity/brain/9d632920-ccf9-4e3b-a6ad-dcac529c915b/.system_generated/steps/4/content.md';
const content = fs.readFileSync(filePath, 'utf8');

console.log("=== ADDRESS / LOCATION SEARCH ===");
const lines = content.split('\n');
lines.forEach((line, idx) => {
  const l = line.toLowerCase();
  if (l.includes('road') || 
      l.includes('plot') || 
      l.includes('street') || 
      l.includes('floor') || 
      l.includes('building') || 
      l.includes('colony') || 
      l.includes('nagore') || 
      l.includes('nagar') || 
      l.includes('hyderabad') || 
      l.includes('secunderabad') || 
      l.includes('address')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
