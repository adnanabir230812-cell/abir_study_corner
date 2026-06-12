const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

const rx202 = /#### Q\[ID: 202\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;

let match202 = rx202.exec(content);
if (match202) {
  console.log('--- QID 202 Answer ---');
  console.log(match202[2].trim());
} else {
  console.log('QID 202 not found!');
}
