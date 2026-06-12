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
      if (content.toLowerCase().includes('parsedanswer') || content.toLowerCase().includes('qa.ejs')) {
        console.log(`Found in: ${fullPath}`);
      }
    }
  });
}

searchInDir(path.join(__dirname, '..'));
