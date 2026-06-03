const fs = require('fs');
const path = require('path');
const PDFParser = require('pdf2json');

const baseDir = 'E:\\Abir study\\3.2 1st Part\\3.2 1st Part\\AT-3201 Principles of Plant Pathology and Diseases of Field Crops\\Rezaul Sir';

const files = [
  '3. Rice.pdf',
  '4. Barley,Maize, Cotton and Jute.pdf',
  '5. Wheat and Pulse.pdf',
  '6. Sugarcane, Mustard, Sunflower, Groundnut.pdf',
  '7. Scientific Names.pdf',
  '8. All Disease Differences.pdf'
];

function extractText(filePath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    
    pdfParser.on('pdfParser_dataError', errData => reject(errData.parserError));
    pdfParser.on('pdfParser_dataReady', pdfData => {
      // Extract text from all pages
      let allText = '';
      if (pdfData && pdfData.Pages) {
        for (let p = 0; p < pdfData.Pages.length; p++) {
          const page = pdfData.Pages[p];
          allText += `\n--- PAGE ${p+1} ---\n`;
          if (page.Texts) {
            // Sort texts by y then x position
            const texts = page.Texts.map(t => ({
              x: t.x,
              y: t.y,
              text: t.R.map(r => {
                try { return decodeURIComponent(r.T); }
                catch(e) { return r.T; }
              }).join('')
            }));
            texts.sort((a, b) => a.y - b.y || a.x - b.x);
            
            let lastY = -1;
            for (const t of texts) {
              if (lastY >= 0 && Math.abs(t.y - lastY) > 0.5) {
                allText += '\n';
              } else if (lastY >= 0) {
                allText += ' ';
              }
              allText += t.text;
              lastY = t.y;
            }
          }
        }
      }
      resolve(allText);
    });
    
    pdfParser.loadPDF(filePath);
  });
}

async function main() {
  const outDir = path.join(__dirname, '..', 'pdf_extracts');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  
  for (const file of files) {
    const filePath = path.join(baseDir, file);
    console.log(`\n=== Processing: ${file} ===`);
    try {
      const text = await extractText(filePath);
      const outFile = path.join(outDir, file.replace('.pdf', '.txt'));
      fs.writeFileSync(outFile, text);
      console.log(`Extracted ${text.length} chars -> ${outFile}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message || err);
    }
  }
}

main();
