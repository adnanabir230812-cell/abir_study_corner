const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const docxPath = 'F:\\gay work\\CropEcology_SectionB_TopicWise_QuestionBank.docx';
const scratchDir = __dirname;
const tempZip = path.join(scratchDir, 'temp_doc.zip');
const tempDir = path.join(scratchDir, 'temp_doc');

if (!fs.existsSync(docxPath)) {
  console.error(`File not found: ${docxPath}`);
  process.exit(1);
}

// Clean old temp files
if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip);
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

// Copy to zip
fs.copyFileSync(docxPath, tempZip);

// Extract using PowerShell
try {
  const cmd = `powershell -Command "Expand-Archive -Path '${tempZip}' -DestinationPath '${tempDir}' -Force"`;
  execSync(cmd);
} catch (err) {
  console.error('Error expanding docx zip:', err.message);
  process.exit(1);
}

const docXmlPath = path.join(tempDir, 'word', 'document.xml');
if (!fs.existsSync(docXmlPath)) {
  console.error('document.xml not found inside docx archive!');
  process.exit(1);
}

const content = fs.readFileSync(docXmlPath, 'utf8');

// Find all paragraphs (<w:p>...</w:p>)
const paragraphs = [];
const pRx = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
let pMatch;
while ((pMatch = pRx.exec(content)) !== null) {
  const pContent = pMatch[1];
  
  // Extract all text tags (<w:t>...</w:t>) inside this paragraph
  const textParts = [];
  const tRx = /<w:t\b[^>]*>([^<]*)<\/w:t>/g;
  let tMatch;
  while ((tMatch = tRx.exec(pContent)) !== null) {
    textParts.push(tMatch[1]);
  }
  
  const pText = textParts.join('').trim();
  if (pText) {
    paragraphs.push(pText);
  }
}

// Save the text to a file
const outText = paragraphs.join('\n\n');
const outPath = path.join(scratchDir, 'ecology_questions_raw.md');
fs.writeFileSync(outPath, outText, 'utf8');

console.log(`Successfully parsed ${paragraphs.length} paragraphs to ${outPath}`);

// Cleanup
try {
  fs.unlinkSync(tempZip);
  fs.rmSync(tempDir, { recursive: true, force: true });
} catch (e) {}
