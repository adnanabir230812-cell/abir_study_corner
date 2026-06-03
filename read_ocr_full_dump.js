const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch\\ocr_full_dump.md';
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`ocr_full_dump.md size: ${content.length}`);
  
  // Let's search for Pathology pages like 'page 1', 'page 2', etc. or print the first 4000 characters
  console.log('First 4000 characters of ocr_full_dump.md:');
  console.log(content.substring(0, 4000));
} else {
  console.log('ocr_full_dump.md not found!');
}
