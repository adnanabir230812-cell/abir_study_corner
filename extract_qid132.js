const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'scratch', 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

const rx = /#### Q\[ID: 132\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;
const match = rx.exec(content);

if (match) {
  console.log('--- FOUND QID 132 ---');
  console.log('Title:', match[1].trim());
  console.log('Answer:\n', match[2].trim());
} else {
  console.log('QID 132 not found');
}
