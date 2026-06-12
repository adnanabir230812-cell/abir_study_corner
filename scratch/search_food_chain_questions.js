const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'ecology_ocr_raw.txt');
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let currentHeader = '';
  let inSectionB = false;
  
  lines.forEach((line, idx) => {
    const l = line.trim();
    if (l.startsWith('=== PAGE')) {
      inSectionB = false;
    }
    if (l.includes('Examination 20') || l.includes('Session 20') || l.includes('Term-I1 Examination')) {
      currentHeader = l;
    }
    if (l.toLowerCase().includes('section b')) {
      inSectionB = true;
    }
    if (inSectionB) {
      const lower = l.toLowerCase();
      if (lower.includes('food-chain') || lower.includes('food chain') || lower.includes('food-web') || lower.includes('food web') || lower.includes('pyramid') || lower.includes('thermodynamic') || lower.includes('eltonian') || lower.includes('grazing') || lower.includes('detritus') || lower.includes('10%')) {
        console.log(`YEAR: ${currentHeader}`);
        console.log(`[Line ${idx+1}] ${l}`);
        // print surrounding lines
        const start = Math.max(0, idx - 1);
        const end = Math.min(lines.length - 1, idx + 2);
        for (let i = start; i <= end; i++) {
          console.log(`  * ${i === idx ? '>>>' : '   '} [Line ${i+1}] ${lines[i]}`);
        }
        console.log('---------------------------------------------');
      }
    }
  });
} else {
  console.log("OCR file not found");
}
