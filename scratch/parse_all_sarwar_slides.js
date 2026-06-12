const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const slidesDir = 'E:\\Abir study\\3.2 1st Part\\3.2 1st Part\\AT-3203 Crop Ecology\\Sarwar Sir';
const scratchDir = __dirname; // Since list_all_topics.js was in scratch/

const presentations = [
  { file: '1. Ecosystems.pptx', out: 'ecosystems_slides_text.md' },
  { file: '2. Productivity.pptx', out: 'productivity_slides_text.md' },
  { file: '3. Food Chain.pptx', out: 'food_chain_slides_text.md' },
  { file: '4. Agro-ecosystem.pptx', out: 'agro_ecosystem_slides_text.md' },
  { file: '5.0 Crop Association.pptx', out: 'crop_association_slides_text.md' },
  { file: '6. Environmental Pollution.pptx', out: 'pollution_slides_text.md' },
  { file: '7. Vegetations of Bangladesh.pptx', out: 'vegetations_slides_text.md' }
];

console.log('Starting Crop Ecology PPTX parser...');

presentations.forEach((p, idx) => {
  const pptxPath = path.join(slidesDir, p.file);
  if (!fs.existsSync(pptxPath)) {
    console.log(`❌ File not found: ${pptxPath}`);
    return;
  }

  console.log(`Processing [${idx + 1}/7]: ${p.file}`);

  const tempZip = path.join(scratchDir, `temp_sarwar_${idx}.zip`);
  const tempDir = path.join(scratchDir, `temp_sarwar_${idx}`);

  // Clean old files
  if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip);
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  // Copy to zip
  fs.copyFileSync(pptxPath, tempZip);

  // Extract using PowerShell
  try {
    const cmd = `powershell -Command "Expand-Archive -Path '${tempZip}' -DestinationPath '${tempDir}' -Force"`;
    execSync(cmd);
  } catch (err) {
    console.error(`Error expanding ${p.file}:`, err.message);
    return;
  }

  // Parse slide files
  const xmlDir = path.join(tempDir, 'ppt', 'slides');
  if (!fs.existsSync(xmlDir)) {
    console.log(`Slide directory not found for ${p.file}`);
    return;
  }

  const xmlFiles = fs.readdirSync(xmlDir)
    .filter(f => f.startsWith('slide') && f.endsWith('.xml'))
    .sort((a, b) => {
      const numA = parseInt(a.replace('slide', '').replace('.xml', ''));
      const numB = parseInt(b.replace('slide', '').replace('.xml', ''));
      return numA - numB;
    });

  let mdContent = `# Course Slides: ${p.file.replace('.pptx', '')}\n\n`;

  xmlFiles.forEach((file, sIdx) => {
    const filePath = path.join(xmlDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    const textMatches = [];
    const rx = /<a:t[^>]*>([^<]*)<\/a:t>/g;
    let match;
    while ((match = rx.exec(content)) !== null) {
      const text = match[1].trim();
      if (text) {
        textMatches.push(text);
      }
    }

    mdContent += `## Slide ${sIdx + 1}\n\n`;
    if (textMatches.length > 0) {
      const uniqueLines = [];
      textMatches.forEach(line => {
        let decoded = line
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'");
        
        if (uniqueLines.length === 0 || uniqueLines[uniqueLines.length - 1] !== decoded) {
          uniqueLines.push(decoded);
        }
      });
      mdContent += uniqueLines.join('\n\n') + '\n\n';
    } else {
      mdContent += `*(Empty slide or contains only images)*\n\n`;
    }
    mdContent += `---\n\n`;
  });

  const outPath = path.join(scratchDir, p.out);
  fs.writeFileSync(outPath, mdContent, 'utf8');
  console.log(`✅ Extracted text to: ${p.out}`);

  // Cleanup
  try {
    fs.unlinkSync(tempZip);
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (e) {
    // Ignore cleanup errors
  }
});

console.log('All slides processed successfully.');
