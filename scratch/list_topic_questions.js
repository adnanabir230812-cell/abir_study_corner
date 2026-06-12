const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log('--- Questions under "Principles of Disease Control" ---');
let capture = false;
lines.forEach((line) => {
  if (line.startsWith('### Topic:')) {
    if (line.includes('Principles of Disease Control')) {
      capture = true;
    } else {
      capture = false;
    }
  }
  if (capture && line.startsWith('#### Q[')) {
    console.log(line);
  }
});
