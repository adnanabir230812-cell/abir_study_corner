const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'ecology_ocr_raw.txt');
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let currentHeader = 'Initial';
  let printing = false;
  let printCount = 0;
  
  lines.forEach((line, idx) => {
    const l = line.trim();
    if (l.startsWith('=== PAGE')) {
      printing = false;
    }
    if (l.includes('Examination 20') || l.includes('Session 20') || l.includes('Term-I1 Examination')) {
      currentHeader = l;
    }
    if (l.toLowerCase().includes('section b')) {
      printing = true;
      printCount = 0;
      console.log(`\n------------------------------------------------------------`);
      console.log(`YEAR: ${currentHeader}`);
      console.log(`------------------------------------------------------------`);
    }
    if (printing) {
      printCount++;
      if (printCount < 25) { // Print first 25 lines after Section B
        console.log(`[Line ${idx+1}] ${l}`);
      } else {
        printing = false;
      }
    }
  });
} else {
  console.log("OCR file not found");
}
