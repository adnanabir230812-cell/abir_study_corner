const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'extracted_raw_secb', 'MRI Book.md');
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  console.log('--- Matches in MRI Book.md ---');
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes('wheat') && (line.toLowerCase().includes('rust') || line.toLowerCase().includes('smut') || line.toLowerCase().includes('blight') || line.toLowerCase().includes('blast') || line.toLowerCase().includes('powdery') || line.toLowerCase().includes('bunt'))) {
      console.log(`  [L${idx+1}] ${line.trim()}`);
    }
  });
} else {
  console.log('MRI Book.md does not exist!');
}
