const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pollution_slides_text.md');
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  for (let i = 870; i <= 930 && i < lines.length; i++) {
    console.log(`[Line ${i+1}] ${lines[i]}`);
  }
}
