const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const baseDir = 'E:\\Abir study\\3.2 1st Part\\3.2 1st Part\\AT-3203 Crop Ecology\\Sarwar Sir';

const files = [
  'AT- 3203 (Crop Ecology).pdf',
  '5.1 Crop Association .pdf',
  'Ecology Note SJ .pdf',
  'Ecology SJ.pdf',
  'SJ L.pdf'
];

async function inspectPdf(filename) {
  const filePath = path.join(baseDir, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const data = await parser.getText();
    console.log(`\n===================================`);
    console.log(`FILE: ${filename}`);
    console.log(`Pages: ${data.total}`); // data.total represents the page count in this library structure
    console.log(`--- First 1000 characters of text ---`);
    console.log(data.text.substring(0, 1000));
    console.log(`===================================\n`);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
  }
}

(async () => {
  for (const file of files) {
    await inspectPdf(file);
  }
})();
