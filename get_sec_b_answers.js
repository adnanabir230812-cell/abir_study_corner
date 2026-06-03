const fs = require('fs');
const path = require('path');

const dirB = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\toppr\\extracted_raw_secb';
const files = fs.readdirSync(dirB);

const keywords = ['brown spot', 'blast', 'sugarcane mosaic', 'red rot', 'smut', 'mungbean', 'loose smut'];

files.forEach(file => {
  if (!file.endsWith('.md')) return;
  const content = fs.readFileSync(path.join(dirB, file), 'utf8');
  keywords.forEach(keyword => {
    if (content.toLowerCase().includes(keyword.toLowerCase())) {
      console.log(`\n================== Found "${keyword}" in Section B: ${file} ==================`);
      const idx = content.toLowerCase().indexOf(keyword.toLowerCase());
      const start = Math.max(0, idx - 100);
      console.log(content.substring(start, start + 1200));
    }
  });
});
