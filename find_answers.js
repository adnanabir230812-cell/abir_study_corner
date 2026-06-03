const fs = require('fs');
const path = require('path');

const scratchDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch';
const files = ['classtest_resolved.md', 'classtest_full.md', 'model_questions.md', 'ocr_questions_extracted.md', 'found_questions.md', 'clean_questions_list.md'];

const keywords = ['field sanitation', 'disease tetrahedron', 'resistant varieties break down', 'prevent epidemic', 'brown spot of rice', 'blast disease of rice', 'mungbean mosaic', 'loose smut'];

files.forEach(fileName => {
  const filePath = path.join(scratchDir, fileName);
  if (!fs.existsSync(filePath)) return;
  
  console.log(`\n================== Inspecting ${fileName} ==================`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  keywords.forEach(keyword => {
    let idx = 0;
    while ((idx = content.toLowerCase().indexOf(keyword.toLowerCase(), idx)) !== -1) {
      console.log(`\nFound "${keyword}" in ${fileName} at position ${idx}:`);
      const start = Math.max(0, idx - 100);
      const end = Math.min(content.length, idx + 1000);
      console.log(content.substring(start, end));
      console.log('--------------------------------------------------');
      idx = end;
    }
  });
});
