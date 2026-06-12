const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach(line => {
  if (line.includes('ID: 132') || line.includes('ID: 133') || line.includes('ID: 325') || line.includes('ID: 131')) {
    console.log(line);
  }
});
