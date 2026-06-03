const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const matiulSirDir = `E:\\Abir study\\3.2 2nd Part\\3.2 2nd Part\\AT-3205 Fundamentals of Extension, Communication and Leadership\\Matiul Sir`;
const outputSummaryPath = path.join(__dirname, '../scratch/extension_content_summary.md');

// Ensure scratch directory exists
const scratchDir = path.dirname(outputSummaryPath);
if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir, { recursive: true });
}

async function scanPdfs() {
  try {
    const files = fs.readdirSync(matiulSirDir);
    const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));
    
    console.log(`Found ${pdfFiles.length} PDF files. Beginning deep scan...`);
    
    let summaryContent = `# Summary of Matiul Sir's Course Content for AT-3205\n\n`;
    summaryContent += `Scanned on: ${new Date().toLocaleString()}\n\n`;
    
    for (const file of pdfFiles) {
      const filePath = path.join(matiulSirDir, file);
      const dataBuffer = fs.readFileSync(filePath);
      
      console.log(`Scanning: ${file} (${Math.round(dataBuffer.length / 1024)} KB)`);
      
      let pdfData;
      try {
        pdfData = await pdfParse(dataBuffer);
      } catch (err) {
        console.error(`Failed to parse ${file}:`, err.message);
        summaryContent += `## ❌ ${file}\n*Failed to parse PDF file.*\n\n---\n\n`;
        continue;
      }
      
      const text = pdfData.text;
      const numPages = pdfData.numpages;
      
      // Extract structural headers or first few sentences
      const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0);
        
      // Try to find the title/headings
      const headings = [];
      const topicsFound = [];
      
      for (const line of lines) {
        if (line.toUpperCase() === line && line.length > 3 && line.length < 60 && !line.includes('PAGE') && !line.match(/^\d+$/)) {
          if (headings.length < 15 && !headings.includes(line)) {
            headings.push(line);
          }
        }
        // Common extension keywords
        const keywords = [
          'DEFINITION', 'PHILOSOPHY', 'PRINCIPLE', 'HISTORY', 'NARS', 'DAE', 'T&V', 'UAO', 'AEO',
          'SAAO', 'LEARNING', 'ADULT', 'MASLOW', 'BLOOM', 'PEDAGOGY', 'ANDRAGOGY', 'HEUTAGOGY',
          'AUDIO-VISUAL', 'MONITORING', 'EVALUATION', 'TEACHING'
        ];
        keywords.forEach(kw => {
          if (line.toUpperCase().includes(kw) && line.length < 80) {
            if (topicsFound.length < 15 && !topicsFound.includes(kw)) {
              topicsFound.push(kw);
            }
          }
        });
      }
      
      // Get a clean sample of the first 800 characters
      const sampleText = text.substring(0, 1500).replace(/\s+/g, ' ').trim();
      
      summaryContent += `## 📄 ${file}\n`;
      summaryContent += `* **Total Pages:** ${numPages}\n`;
      summaryContent += `* **Extracted Major Keywords:** ${topicsFound.join(', ') || 'None found'}\n`;
      if (headings.length > 0) {
        summaryContent += `* **Major Headings Found:**\n`;
        headings.slice(0, 8).forEach(h => {
          summaryContent += `  * ${h}\n`;
        });
      }
      summaryContent += `* **Introductory Content Sample:**\n  > ${sampleText.substring(0, 600)}...\n\n`;
      summaryContent += `---\n\n`;
    }
    
    fs.writeFileSync(outputSummaryPath, summaryContent, 'utf8');
    console.log(`\nScan complete! Detailed summary report saved to:\n${outputSummaryPath}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error scanning PDFs:', error);
    process.exit(1);
  }
}

scanPdfs();
