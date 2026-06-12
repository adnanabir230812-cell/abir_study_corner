const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

const rx195 = /#### Q\[ID: 195\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;

let match195 = rx195.exec(content);
if (match195) {
  console.log('--- QID 195 Answer ---');
  console.log(match195[2].trim());
} else {
  console.log('QID 195 not found!');
}
