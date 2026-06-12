const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'controllers', 'courseController.js');
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes('parsedanswer') || line.toLowerCase().includes('render(\'qa') || line.toLowerCase().includes('getqa')) {
      console.log(`${idx+1}: ${line.trim()}`);
    }
  });
} else {
  console.log('courseController.js not found!');
}
