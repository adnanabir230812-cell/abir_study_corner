const fs = require('fs');
const path = require('path');

const modelPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch\\model_questions.md';

if (!fs.existsSync(modelPath)) {
  console.log(`File not found: ${modelPath}`);
  process.exit(1);
}

const content = fs.readFileSync(modelPath, 'utf8');
const lines = content.split('\n');

const matches = [];
lines.forEach((line, idx) => {
  if (line.includes('Section ID: 4 | Crop Ecology - Section B (Sarwar Sir)')) {
    matches.push(idx);
  }
});

matches.forEach((startIdx, matchNum) => {
  let endIdx = -1;
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (lines[i].includes('Section ID:')) {
      endIdx = i;
      break;
    }
  }
  if (endIdx === -1) endIdx = lines.length;

  console.log(`=== Match ${matchNum + 1} (Lines ${startIdx + 1} to ${endIdx + 1}) ===`);
  for (let i = startIdx; i < endIdx; i++) {
    console.log(lines[i]);
  }
  console.log();
});
