const fs = require('fs');
const path = require('path');

const ocrPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch\\ocr_questions_extracted.md';

if (!fs.existsSync(ocrPath)) {
  console.log(`File not found: ${ocrPath}`);
  process.exit(1);
}

const content = fs.readFileSync(ocrPath, 'utf8');
const lines = content.split('\n');

console.log('Searching for topics and questions with sectionId: 4...\n');

let currentTopic = '';
let currentSection = '';

lines.forEach((line, idx) => {
  if (line.includes('Topic ID:')) {
    currentTopic = line;
  }
  if (line.includes('sectionId: 4') || line.includes('sectionId:4')) {
    // Check if this topic has questions or if we should print the surrounding block
    console.log(`Line ${idx + 1}: ${line}`);
    // Print next 20 lines to see questions
    for (let i = idx + 1; i < Math.min(lines.length, idx + 20); i++) {
      if (lines[i].includes('Topic ID:') || lines[i].includes('Section ID:')) {
        break;
      }
      if (lines[i].trim().length > 0) {
        console.log(`  ${lines[i].trim()}`);
      }
    }
    console.log();
  }
});
