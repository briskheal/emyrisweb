const fs = require('fs');
const path = require('path');

const dirToSearch = 'C:/Users/J S DASH/.gemini/antigravity/brain/';

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

try {
  console.log("=== SEARCHING SCAPED FILES ===");
  const allFiles = walkDir(dirToSearch);
  allFiles.forEach(file => {
    if (file.endsWith('.md') || file.endsWith('.html') || file.endsWith('.json')) {
      console.log(file);
    }
  });
} catch (e) {
  console.error(e);
}
