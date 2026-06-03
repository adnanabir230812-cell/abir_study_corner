const fs = require('fs');
const path = require('path');

const searchTerms = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];

function searchFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    searchTerms.forEach(term => {
      if (content.includes(term)) {
        console.log(`Found "${term}" in file: ${filePath}`);
        // print a few lines around the match
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes(term)) {
            console.log(`  L${idx+1}: ${line.trim().substring(0, 150)}`);
          }
        });
      }
    });
  } catch (err) {}
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('.system_generated')) {
        walk(file);
      }
    } else {
      if (file.endsWith('.txt') || file.endsWith('.md') || file.endsWith('.json') || file.endsWith('.js') || file.endsWith('.py')) {
        searchFile(file);
      }
    }
  });
}

walk('C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\toppr');
