const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('.system_generated')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.txt') || file.endsWith('.md') || file.endsWith('.json')) {
        results.push(file);
      }
    }
  });
  return results;
}

const allFiles = walk('C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\toppr');
console.log("Found text/md/json files:");
allFiles.forEach(f => {
  console.log(`  - ${f} (${fs.statSync(f).size} bytes)`);
});
