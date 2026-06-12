const fs = require('fs');
const path = require('path');

const modelPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch\\model_questions.md';

if (!fs.existsSync(modelPath)) {
  console.log(`File not found: ${modelPath}`);
  process.exit(1);
}

const content = fs.readFileSync(modelPath, 'utf8');
const lines = content.split('\n');

const lineNumbers = [492, 579, 666, 954, 1089];

lineNumbers.forEach(ln => {
  console.log(`\n=================== LINES FOLLOWING LINE ${ln} ===================`);
  const idx = ln - 1;
  const end = Math.min(lines.length - 1, idx + 40);
  for (let i = idx; i <= end; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
});
