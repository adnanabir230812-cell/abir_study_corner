const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'scratch', 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log('Section A Topics and Questions:');
lines.forEach((line, idx) => {
  if (idx < 1545) { // line number where Rice diseases begin in check_topics output
    if (line.startsWith('### Topic:') || line.startsWith('#### Q[')) {
      console.log(`${idx + 1}: ${line}`);
    }
  }
});
