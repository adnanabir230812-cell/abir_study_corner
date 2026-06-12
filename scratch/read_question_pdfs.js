const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const files = [
  'E:\\Abir study\\3.2 1st Part\\3.2 1st Part\\1. Questions\\3.2 CT Question .pdf',
  'E:\\Abir study\\3.2 1st Part\\3.2 1st Part\\1. Questions\\3.2 Questions (CT, Sessional).pdf',
  'E:\\Abir study\\3.2 1st Part\\3.2 1st Part\\1. Questions\\All CT Question.pdf'
];

async function scanPdf(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const data = await parser.getText();
    console.log(`\n===================================`);
    console.log(`FILE: ${path.basename(filePath)}`);
    console.log(`Pages: ${data.total}`);
    
    // Write full text to a scratch txt file for further inspection if needed
    const outputTxtPath = path.join(__dirname, `${path.basename(filePath, '.pdf')}_text.txt`);
    fs.writeFileSync(outputTxtPath, data.text, 'utf8');
    console.log(`Extracted text saved to: ${outputTxtPath}`);
    
    // Search for keywords
    const keywords = ['AT-3203', 'AT 3203', 'Ecology', 'Sarwar', 'Crop Ecology'];
    console.log(`--- Searching for Crop Ecology content ---`);
    const lines = data.text.split('\n');
    lines.forEach((line, idx) => {
      const match = keywords.some(kw => line.toLowerCase().includes(kw.toLowerCase()));
      if (match) {
        console.log(`  Line ${idx + 1}: ${line.trim()}`);
      }
    });
    console.log(`===================================\n`);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
}

(async () => {
  for (const file of files) {
    await scanPdf(file);
  }
})();
