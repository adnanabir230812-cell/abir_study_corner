const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch\\ocr_questions_extracted.md';
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`ocr_questions_extracted.md size: ${content.length}`);
  
  // Let's print the first 3000 characters to see what's in it!
  console.log('Beginning of ocr_questions_extracted.md:');
  console.log(content.substring(0, 3000));
} else {
  console.log('ocr_questions_extracted.md not found!');
}
