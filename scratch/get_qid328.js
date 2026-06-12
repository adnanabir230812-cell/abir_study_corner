const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

const rx = /#### Q\[ID: 328\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;

let match = rx.exec(content);
if (match) {
  console.log('--- Question ---');
  console.log(match[1].trim());
  console.log('--- Answer ---');
  console.log(match[2].trim());
} else {
  console.log('QID 328 not found!');
}
