const fs = require('fs');
const path = require('path');

const ocrPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch\\ocr_questions_extracted.md';

if (!fs.existsSync(ocrPath)) {
  console.log(`File not found: ${ocrPath}`);
  process.exit(1);
}

const content = fs.readFileSync(ocrPath, 'utf8');
const lines = content.split('\n');

console.log('Listing all topics in ocr_questions_extracted.md:\n');

lines.forEach((line, idx) => {
  if (line.includes('Topic ID:')) {
    console.log(`Line ${idx + 1}: ${line}`);
    // Print the next few questions
    for (let i = idx + 1; i < idx + 15; i++) {
      if (lines[i] && (lines[i].includes('Topic ID:') || lines[i].includes('Section ID:'))) {
        break;
      }
      if (lines[i] && lines[i].trim().length > 0) {
        console.log(`  ${lines[i].trim()}`);
      }
    }
  }
});
