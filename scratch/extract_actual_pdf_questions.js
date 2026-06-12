const fs = require('fs');
const path = require('path');

const ocrPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\toppr\\scratch\\ecology_ocr_raw.txt';

if (!fs.existsSync(ocrPath)) {
  console.error(`OCR file not found: ${ocrPath}`);
  process.exit(1);
}

const content = fs.readFileSync(ocrPath, 'utf8');
const pages = content.split('===================================');

pages.forEach(page => {
  if (page.trim().length === 0) return;
  const lines = page.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  // Find page title
  const pageHeader = lines.find(l => l.includes('PAGE'));
  if (pageHeader) {
    console.log(`\n${pageHeader}`);
    console.log('-------------------------------------------');
  }
  
  // Print lines that look like questions (starting with numbers or letters in parentheses)
  lines.forEach(line => {
    // Matches "5.", "6.", "7.", "8.", "(a)", "(b)", "(c)", "(d)", "1.", "2."
    if (/^\d+\./.test(line) || /^\([a-d]\)/.test(line) || /^[a-d]\)/.test(line)) {
      console.log(`  ${line}`);
    }
  });
});
