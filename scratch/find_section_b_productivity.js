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
    if (l.includes('Examination 20') || l.includes('Session 20')) {
      currentHeader = l;
    }
    if (l.toLowerCase().includes('section b')) {
      inSectionB = true;
      console.log(`\n======================================================================`);
      console.log(`YEAR/SESSION: ${currentHeader || 'Unknown Year'}`);
      console.log(`======================================================================`);
    }
    if (inSectionB) {
      // Print question if it contains productivity or GPP or NPP or eutrophication or dead zones
      const lower = l.toLowerCase();
      if (lower.includes('product') || lower.includes('npp') || lower.includes('gpp') || lower.includes('trophic') || lower.includes('eutroph') || lower.includes('dead-zone') || lower.includes('dead zone')) {
        console.log(`[Line ${idx+1}] ${l}`);
      }
    }
  });
} else {
  console.log("OCR file not found");
}
