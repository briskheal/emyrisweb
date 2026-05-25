const fs = require('fs');
const path = require('path');

const rootDir = 'd:/MY WORK FLOW';

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
  console.log("=== SEARCHING WORKSPACE FOR SUBPAGES ===");
  const files = walk(rootDir);
  files.forEach(f => {
    const base = path.basename(f).toLowerCase();
    if (base.includes('advisor') || base.includes('doctor') || base.includes('presence') || base.includes('faq') || base.includes('enhancer')) {
      console.log(f);
    }
  });
} catch(e) {
  console.error(e);
}
