const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '..', 'extracted_raw_secb');
const files = fs.readdirSync(dirPath);

files.forEach(file => {
  const filePath = path.join(dirPath, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes('fertilizer') || line.toLowerCase().includes('potash') || line.toLowerCase().includes('nitrogen') || line.toLowerCase().includes('silica')) {
      if (file.includes('Rice') || file.includes('Pathology') || file.includes('MRI') || file.includes('Symptoms')) {
        console.log(`[${file}:${idx+1}] ${line.trim()}`);
      }
    }
  });
});
