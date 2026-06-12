const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

const rx178 = /#### Q\[ID: 178\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;

let match178 = rx178.exec(content);
if (match178) {
  console.log('--- QID 178 Answer ---');
  console.log(match178[2].trim());
} else {
  console.log('QID 178 not found!');
}
