const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch\\extracted_ocr_pages.md';
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`File: ${filePath} (Size: ${content.length})`);
  
  // Let's search for "Page 1", "Page 2", etc. and print their contents
  // Let's write a script that splits the content by "Page" or "Step" and prints out sections containing pathology
  const regex = /pathology_q_page_\d+/g;
  let matches;
  const indices = [];
  while ((matches = regex.exec(content)) !== null) {
    indices.push({ index: matches.index, text: matches[0] });
  }
  
  console.log(`Found ${indices.length} pathology page occurrences in OCR pages file.`);
  indices.forEach((match, idx) => {
    console.log(`\n================== Match ${idx + 1}: ${match.text} ==================`);
    const nextIndex = indices[idx + 1] ? indices[idx + 1].index : content.length;
    console.log(content.substring(match.index, Math.min(nextIndex, match.index + 2000)).trim());
    console.log('--------------------------------------------------');
  });
} else {
  console.log('File not found!');
}
