const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');

const ecologyImagesDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\toppr\\uploads\\questions\\ecology';
const outputTxtPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\toppr\\scratch\\ecology_ocr_raw.txt';

if (!fs.existsSync(ecologyImagesDir)) {
  console.error(`Ecology images directory not found: ${ecologyImagesDir}`);
  process.exit(1);
}

const images = [
  'ecology_q_page_1_img_1.jpg',
  'ecology_q_page_2_img_1.jpg',
  'ecology_q_page_3_img_1.jpg',
  'ecology_q_page_4_img_1.jpg',
  'ecology_q_page_5_img_1.jpg',
  'ecology_q_page_6_img_1.jpg',
  'ecology_q_page_7_img_1.jpg'
];

async function runOcr() {
  let fullText = '';
  
  for (let i = 0; i < images.length; i++) {
    const imageName = images[i];
    const imagePath = path.join(ecologyImagesDir, imageName);
    console.log(`[${i+1}/${images.length}] Running OCR on ${imageName}...`);
    
    try {
      const { data: { text } } = await Tesseract.recognize(
        imagePath,
        'eng',
        { logger: m => {
            if (m.status === 'recognizing text' && Math.random() < 0.1) { // Throttle log frequency
              console.log(`  Progress: ${(m.progress * 100).toFixed(0)}%`);
            }
          }
        }
      );
      
      fullText += `\n\n===================================\n`;
      fullText += `=== PAGE ${i + 1} (${imageName}) ===\n`;
      fullText += `===================================\n\n`;
      fullText += text;
      
    } catch (err) {
      console.error(`Failed to OCR ${imageName}:`, err);
    }
  }
  
  fs.writeFileSync(outputTxtPath, fullText, 'utf8');
  console.log(`\nOCR completed successfully! Output saved to: ${outputTxtPath}`);
  process.exit(0);
}

runOcr();
