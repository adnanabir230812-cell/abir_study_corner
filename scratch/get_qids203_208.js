const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

const rx203 = /#### Q\[ID: 203\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;
const rx208 = /#### Q\[ID: 208\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;

let match208 = rx208.exec(content);
if (match208) {
  console.log('--- QID 208 Answer ---');
  console.log(match208[2].trim());
}

let match203 = rx203.exec(content);
if (match203) {
  console.log('--- QID 203 Answer ---');
  console.log(match203[2].trim());
}
