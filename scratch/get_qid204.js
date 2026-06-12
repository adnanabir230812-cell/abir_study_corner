const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

const rx204 = /#### Q\[ID: 204\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;

let match204 = rx204.exec(content);
if (match204) {
  console.log('--- QID 204 Answer ---');
  console.log(match204[2].trim());
} else {
  console.log('QID 204 not found!');
}
