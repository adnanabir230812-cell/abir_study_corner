const fs = require('fs');
const path = require('path');

const ocrPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch\\ocr_questions_extracted.md';

if (!fs.existsSync(ocrPath)) {
  console.log(`File not found: ${ocrPath}`);
  process.exit(1);
}

const content = fs.readFileSync(ocrPath, 'utf8');
const lines = content.split('\n');

const matches = [];
lines.forEach((line, idx) => {
  if (line.includes('sectionId: 4') || line.includes('sectionId:4')) {
    matches.push(idx);
  }
});

console.log(`Found ${matches.length} matches in ocr_questions_extracted.md:\n`);

matches.forEach((startIdx, matchNum) => {
  console.log(`=== Match ${matchNum + 1} (Line ${startIdx + 1}) ===`);
  const start = Math.max(0, startIdx - 2);
  const end = Math.min(lines.length - 1, startIdx + 8);
  for (let i = start; i <= end; i++) {
    const prefix = i === startIdx ? '=> ' : '   ';
    console.log(`${prefix}${i + 1}: ${lines[i]}`);
  }
  console.log();
});
