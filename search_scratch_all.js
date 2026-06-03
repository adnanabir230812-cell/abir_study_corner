const fs = require('fs');
const path = require('path');

const scratchDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch';
const files = fs.readdirSync(scratchDir);

const keyword = 'field sanitation';

files.forEach(file => {
  if (!file.endsWith('.md') && !file.endsWith('.txt')) return;
  const filePath = path.join(scratchDir, file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.toLowerCase().includes(keyword.toLowerCase())) {
      console.log(`File: ${file} (Size: ${content.length})`);
      const idx = content.toLowerCase().indexOf(keyword.toLowerCase());
      console.log(`Match at index ${idx}:`);
      console.log(content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 800)));
      console.log('--------------------------------------------------');
    }
  } catch (err) {}
});
