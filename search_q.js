const fs = require('fs');
const path = require('path');

const scratchDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch';
const files = fs.readdirSync(scratchDir);

const terms = ['field sanitation', 'disease tetrahedron', 'resistant varieties break down', 'Epidemiological factors', 'brown spot of rice'];

files.forEach(file => {
  const filePath = path.join(scratchDir, file);
  if (!fs.statSync(filePath).isFile()) return;
  if (!file.endsWith('.md') && !file.endsWith('.txt')) return;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    terms.forEach(term => {
      if (content.toLowerCase().includes(term.toLowerCase())) {
        console.log(`\nFound term "${term}" in file: ${file}`);
      }
    });
  } catch (err) {}
});
