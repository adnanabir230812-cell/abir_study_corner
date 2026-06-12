const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const debeshDir = 'E:\\Abir study\\3.2 1st Part\\3.2 1st Part\\AT-3203 Crop Ecology\\Debesh Sir';
const scratchDir = __dirname;

const filesToParse = [
  {
    input: path.join(debeshDir, 'ECOLOGY SECTION A   (1).docx'),
    output: path.join(scratchDir, 'debesh_questions_raw.md')
  },
  {
    input: path.join(debeshDir, 'Ecology_Notes.docx'),
    output: path.join(scratchDir, 'debesh_notes_raw.md')
  }
];

filesToParse.forEach(fileInfo => {
  const docxPath = fileInfo.input;
  const outPath = fileInfo.output;

  if (!fs.existsSync(docxPath)) {
    console.error(`File not found: ${docxPath}`);
    return;
  }

  const tempZip = path.join(scratchDir, 'temp_doc.zip');
  const tempDir = path.join(scratchDir, 'temp_doc');

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
    console.error(`Error expanding docx zip for ${path.basename(docxPath)}:`, err.message);
    return;
  }

  const docXmlPath = path.join(tempDir, 'word', 'document.xml');
  if (!fs.existsSync(docXmlPath)) {
    console.error(`document.xml not found inside docx archive for ${path.basename(docxPath)}!`);
    return;
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
      // Decode HTML entities if any
      let txt = tMatch[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
      textParts.push(txt);
    }
    
    const pText = textParts.join('').trim();
    if (pText) {
      paragraphs.push(pText);
    }
  }

  // Save the text to a file
  const outText = paragraphs.join('\n\n');
  fs.writeFileSync(outPath, outText, 'utf8');
  console.log(`Successfully parsed ${paragraphs.length} paragraphs from ${path.basename(docxPath)} to ${path.basename(outPath)}`);

  // Cleanup
  try {
    fs.unlinkSync(tempZip);
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (e) {}
});
