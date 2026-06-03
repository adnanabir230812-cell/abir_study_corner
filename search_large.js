const fs = require('fs');
const path = require('path');

const scratchDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch';
const files = fs.readdirSync(scratchDir);

files.forEach(file => {
  if (!file.endsWith('.md') && !file.endsWith('.txt')) return;
  const filePath = path.join(scratchDir, file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('qA27') || content.includes('qB14') || content.includes('qA28')) {
      console.log(`\n================== Found in ${file} ==================`);
      let idx = content.indexOf('qA27');
      if (idx === -1) idx = content.indexOf('qB14');
      if (idx === -1) idx = content.indexOf('qA28');
      
      console.log(content.substring(Math.max(0, idx - 200), Math.min(content.length, idx + 4000)));
      console.log('--------------------------------------------------');
    }
  } catch (err) {}
});
