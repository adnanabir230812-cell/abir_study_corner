const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

const rx177 = /#### Q\[ID: 177\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;

let match177 = rx177.exec(content);
if (match177) {
  console.log('--- QID 177 Answer ---');
  console.log(match177[2].trim());
} else {
  console.log('QID 177 not found!');
}
