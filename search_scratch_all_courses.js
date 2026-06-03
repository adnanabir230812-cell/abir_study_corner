const fs = require('fs');
const path = require('path');

const scratchDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch';
const files = fs.readdirSync(scratchDir);

const keywords = ['olericulture', 'methodology', 'ecology', 'extension'];

files.forEach(file => {
  if (!file.endsWith('.md') && !file.endsWith('.txt')) return;
  const filePath = path.join(scratchDir, file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    keywords.forEach(keyword => {
      if (content.toLowerCase().includes(keyword.toLowerCase())) {
        // Skip log step files if we want, but let's see where actual data resides
        if (file.includes('extracted_ocr_pages') || file.includes('ocr_full_dump') || file.includes('human_readable_history') || file.includes('matched_transcripts') || file.includes('model_questions')) {
          return;
        }
        console.log(`\nFound "${keyword}" in file: ${file} (Size: ${content.length})`);
        // Print the first occurrence
        const idx = content.toLowerCase().indexOf(keyword.toLowerCase());
        console.log(content.substring(idx - 100, idx + 1000));
        console.log('--------------------------------------------------');
      }
    });
  } catch (err) {}
});
