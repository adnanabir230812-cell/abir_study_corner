const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

const rx189 = /#### Q\[ID: 189\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;

let match189 = rx189.exec(content);
if (match189) {
  console.log('--- QID 189 Answer ---');
  console.log(match189[2].trim());
} else {
  console.log('QID 189 not found!');
}
