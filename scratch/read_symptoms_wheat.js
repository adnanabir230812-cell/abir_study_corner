const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'extracted_raw_secb', 'Symptoms of Important Diseases.md');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

for (let i = 320; i < 420; i++) {
  if (lines[i]) {
    console.log(`${i+1}: ${lines[i]}`);
  }
}
