const fs = require('fs');
const path = require('path');

const rootDir = 'd:/MY WORK FLOW/emyrisweb';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const p = path.join(dir, file);
    if (file.includes('node_modules') || file.includes('.git') || file.includes('.next') || file.includes('dist')) return;
    const stat = fs.statSync(p);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(p));
    } else {
      results.push(p);
    }
  });
  return results;
}

try {
  console.log("=== SEARCHING EMYRISWEB FOR WAYSWEB ===");
  const files = walk(rootDir);
  files.forEach(f => {
    try {
      const content = fs.readFileSync(f, 'utf8');
      if (content.toLowerCase().includes('waysweb') || content.toLowerCase().includes('ways web')) {
        console.log(`Found reference in file: ${f}`);
      }
    } catch(e) {}
  });
} catch(e) {
  console.error(e);
}
