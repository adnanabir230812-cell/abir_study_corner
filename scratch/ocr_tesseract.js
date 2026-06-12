const Tesseract = require('tesseract.js');
const path = require('path');

const imagePath = 'E:\\Abir study\\3.2 1st Part\\3.2 1st Part\\AT-3203 Crop Ecology\\Sarwar Sir\\CT1.jpg';

console.log(`Starting OCR on: ${imagePath}\n`);

Tesseract.recognize(
  imagePath,
  'eng',
  { logger: m => {
      if (m.status === 'recognizing text') {
        console.log(`Progress: ${(m.progress * 100).toFixed(1)}%`);
      }
    }
  }
).then(({ data: { text } }) => {
  console.log('\n===================================');
  console.log('--- OCR Result for CT1.jpg ---');
  console.log(text);
  console.log('===================================\n');
  process.exit(0);
}).catch(err => {
  console.error('OCR failed:', err);
  process.exit(1);
});
