const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

const rx199 = /#### Q\[ID: 199\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;

let match199 = rx199.exec(content);
if (match199) {
  console.log('--- QID 199 Answer ---');
  console.log(match199[2].trim());
} else {
  console.log('QID 199 not found!');
}
