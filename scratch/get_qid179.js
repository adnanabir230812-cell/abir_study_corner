const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

const rx179 = /#### Q\[ID: 179\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;

let match179 = rx179.exec(content);
if (match179) {
  console.log('--- QID 179 Answer ---');
  console.log(match179[2].trim());
} else {
  console.log('QID 179 not found!');
}
