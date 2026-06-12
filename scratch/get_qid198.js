const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

const rx198 = /#### Q\[ID: 198\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;

let match198 = rx198.exec(content);
if (match198) {
  console.log('--- QID 198 Answer ---');
  console.log(match198[2].trim());
} else {
  console.log('QID 198 not found!');
}
