const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

const rx187 = /#### Q\[ID: 187\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;

let match187 = rx187.exec(content);
if (match187) {
  console.log('--- QID 187 Answer ---');
  console.log(match187[2].trim());
} else {
  console.log('QID 187 not found!');
}
