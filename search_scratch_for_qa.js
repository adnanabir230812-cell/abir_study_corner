const fs = require('fs');
const path = require('path');

const scratchDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch';
const files = fs.readdirSync(scratchDir);

const keywords = ['Epidemiological factors', 'field sanitation', 'disease tetrahedron', 'resistant varieties break down', 'brown spot of rice', 'blast disease of rice', 'mungbean mosaic', 'loose smut of wheat'];

files.forEach(file => {
  const filePath = path.join(scratchDir, file);
  if (!fs.statSync(filePath).isFile()) return;
  if (!file.endsWith('.md') && !file.endsWith('.txt')) return;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    keywords.forEach(keyword => {
      let idx = 0;
      while ((idx = content.toLowerCase().indexOf(keyword.toLowerCase(), idx)) !== -1) {
        console.log(`\n================== Found "${keyword}" in file: ${file} at index ${idx} ==================`);
        // Print 3000 chars after it
        console.log(content.substring(idx, Math.min(content.length, idx + 4000)));
        console.log('--------------------------------------------------');
        idx = idx + 4000; // skip ahead to avoid repeating same block
      }
    });
  } catch (err) {}
});
