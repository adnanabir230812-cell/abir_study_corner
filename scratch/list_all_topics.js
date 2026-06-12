const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log('--- Topic list in pathology_qa_reference.md ---');
let currentTopic = '';
let qCount = 0;
lines.forEach((line, idx) => {
  if (line.startsWith('### Topic:')) {
    if (currentTopic) {
      console.log(`- ${currentTopic}: ${qCount} questions`);
    }
    currentTopic = line.replace('### Topic:', '').trim();
    qCount = 0;
  } else if (line.startsWith('#### Q[')) {
    qCount++;
  }
});
if (currentTopic) {
  console.log(`- ${currentTopic}: ${qCount} questions`);
}
