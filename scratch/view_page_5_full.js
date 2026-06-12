const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'ecology_ocr_raw.txt');
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const pages = content.split(/=== PAGE \d+ /);
  
  // Page 5 is index 5 (since Page 0 is empty/intro, let's verify)
  pages.forEach((page, index) => {
    if (page.includes('Term-I1 Examination 2019') || page.includes('PAGE 5')) {
      console.log(`PAGE ${index} content:`);
      console.log(page);
    }
  });
} else {
  console.log("OCR file not found");
}
