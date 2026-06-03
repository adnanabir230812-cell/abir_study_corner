const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch\\classtest_resolved.md';
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`classtest_resolved.md size: ${content.length}`);
  console.log(`First 1500 chars:\n${content.substring(0, 1500)}`);
} else {
  console.log('File not found!');
}
