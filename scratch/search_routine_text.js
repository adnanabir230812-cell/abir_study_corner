const fs = require('fs');
const path = require('path');

function searchInDir(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file === '.git' || file === 'extracted_raw_secb' || file === 'extracted_raw' || file === 'pdf_extracts' || file === 'uploads') return;
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      searchInDir(fullPath);
    } else {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.toLowerCase().includes('routine') || content.toLowerCase().includes('exam') || content.toLowerCase().includes('schedule')) {
        console.log(`Found in: ${fullPath}`);
        // print matching lines
        const lines = content.split('\n');
        lines.forEach((l, idx) => {
          if (l.toLowerCase().includes('routine') || l.toLowerCase().includes('ecology') || l.toLowerCase().includes('3203')) {
            console.log(`  [L${idx+1}] ${l.trim()}`);
          }
        });
      }
    }
  });
}

searchInDir('C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\toppr');
