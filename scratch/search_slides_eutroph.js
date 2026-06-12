const fs = require('fs');
const path = require('path');

const files = ['pollution_slides_text.md', 'productivity_slides_text.md'];
files.forEach(f => {
  const filePath = path.join(__dirname, f);
  if (fs.existsSync(filePath)) {
    console.log(`=========================================`);
    console.log(`FILE: ${f}`);
    console.log(`=========================================`);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      const lower = line.toLowerCase();
      if (lower.includes('eutroph') || lower.includes('dead zone') || lower.includes('harvest') || lower.includes('satellite') || lower.includes('bottle') || lower.includes('npp') || lower.includes('gpp')) {
        console.log(`[Line ${idx+1}] ${line.trim()}`);
      }
    });
  }
});
