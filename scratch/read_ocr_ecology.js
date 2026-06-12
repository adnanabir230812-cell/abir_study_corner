const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'ecology_ocr_raw.txt');
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log("OCR File Content Length:", content.length);
  // Split by pages or sections if possible, or print some parts containing productivity or question numbers
  const lines = content.split('\n');
  console.log("Total Lines:", lines.length);
  
  // Look for occurrences of "product" or "NPP" or "GPP"
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes('product') || line.toLowerCase().includes('npp') || line.toLowerCase().includes('gpp') || line.toLowerCase().includes('trophic')) {
      console.log(`Line ${idx+1}: ${line.trim()}`);
    }
  });
} else {
  console.log("OCR file not found");
}
