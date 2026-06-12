const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'extracted_raw_secb', '2. Wheat Maize Barley Jute Cotton Sugarcane Groundnut.md');
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.slice(900, 930).forEach((line, idx) => {
    console.log(`${idx+901}: ${line}`);
  });
}
