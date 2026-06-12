const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const ignoreDirs = ['.git', 'node_modules', 'public/downloads', '.gemini', 'pdf_extracts', 'uploads'];
const ignoreFiles = ['package-lock.json', 'database.json', 'database.sqlite'];

function searchDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.relative(rootDir, fullPath);
    
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      if (ignoreDirs.includes(item) || ignoreDirs.some(id => relativePath.startsWith(id))) {
        continue;
      }
      searchDir(fullPath);
    } else {
      if (ignoreFiles.includes(item)) {
        continue;
      }
      
      // Only search text files
      const ext = path.extname(item).toLowerCase();
      if (!['.js', '.json', '.ejs', '.html', '.css', '.md', '.env'].includes(ext)) {
        continue;
      }
      
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.toLowerCase().includes('vercel.app') || content.toLowerCase().includes('abir-study-corner')) {
        console.log(`Found reference in file: ${relativePath}`);
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.toLowerCase().includes('vercel.app') || line.toLowerCase().includes('abir-study-corner')) {
            console.log(`  Line ${idx + 1}: ${line.trim().substring(0, 120)}`);
          }
        });
      }
    }
  }
}

console.log('Searching project for domain references...');
searchDir(rootDir);
console.log('Done searching!');
