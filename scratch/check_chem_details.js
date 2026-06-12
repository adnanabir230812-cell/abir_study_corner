const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

const rx = /#### Q\[ID: (\d+)\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;

let match;
console.log('--- Chemical Control Questions & Papers ---');
while ((match = rx.exec(content)) !== null) {
  const id = parseInt(match[1]);
  const title = match[2];
  if ([132, 133, 325, 131].includes(id)) {
    console.log(`\nQID: ${id}`);
    console.log(`Title: ${title.trim()}`);
  }
}
