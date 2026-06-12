const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

const rx168 = /#### Q\[ID: 168\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;
const rx172 = /#### Q\[ID: 172\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;

let match168 = rx168.exec(content);
if (match168) {
  console.log('--- QID 168 Answer ---');
  console.log(match168[2].trim());
}

let match172 = rx172.exec(content);
if (match172) {
  console.log('--- QID 172 Answer ---');
  console.log(match172[2].trim());
}
