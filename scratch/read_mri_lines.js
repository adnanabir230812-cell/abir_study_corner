const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'extracted_raw_secb', 'MRI Book.md');
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.slice(0, 100).forEach((line, idx) => {
    console.log(`${idx+1}: ${line}`);
  });
}
