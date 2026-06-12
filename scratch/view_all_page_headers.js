const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'ecology_ocr_raw.txt');
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const pages = content.split(/=== PAGE \d+ /);
  
  pages.forEach((page, index) => {
    console.log(`\n============================================================`);
    console.log(`PAGE ${index}`);
    console.log(`============================================================`);
    const lines = page.split('\n');
    // Print the first 15 lines of this page
    lines.slice(0, 40).forEach((line, lineIdx) => {
      console.log(`[Line ${lineIdx+1}] ${line}`);
    });
  });
} else {
  console.log("OCR file not found");
}
