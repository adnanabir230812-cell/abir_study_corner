const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

const rx180 = /#### Q\[ID: 180\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;

let match180 = rx180.exec(content);
if (match180) {
  console.log('--- QID 180 Answer ---');
  console.log(match180[2].trim());
} else {
  console.log('QID 180 not found!');
}
