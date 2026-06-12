const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetFileName = '3.2 Biological Control.pptx';
const searchRoots = [
  'E:\\Abir study\\3.2 1st Part\\3.2 1st Part\\AT-3201 Principles of Plant Pathology and Diseases of Field Crops\\Sabiha Madame\\21 Batch',
  'E:\\Abir study\\3.2 1st Part\\AT-3201 Principles of Plant Pathology and Diseases of Field Crops\\Sabiha Madame\\21 Batch',
  'E:\\3.2 1st Part\\3.2 1st Part\\AT-3201 Principles of Plant Pathology and Diseases of Field Crops\\Sabiha Madame\\21 Batch',
  'C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\toppr\\scratch'
];

let targetPath = null;
for (const root of searchRoots) {
  const full = path.join(root, targetFileName);
  if (fs.existsSync(full)) {
    targetPath = full;
    break;
  }
}

if (!targetPath) {
  console.log(`Could not find at common paths. Searching recursively for ${targetFileName}...`);
  const drives = ['E:\\', 'D:\\', 'F:\\', 'C:\\Users\\Lenovo'];
  
  function searchFile(dir) {
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const full = path.join(dir, item);
        let stat;
        try { stat = fs.statSync(full); } catch(e) { continue; }
        if (stat.isDirectory()) {
          if (['$recycle.bin', 'system volume information', 'node_modules', 'appdata'].includes(item.toLowerCase())) continue;
          const found = searchFile(full);
          if (found) return found;
        } else if (item.toLowerCase() === targetFileName.toLowerCase()) {
          return full;
        }
      }
    } catch(e) {}
    return null;
  }

  for (const drive of drives) {
    if (fs.existsSync(drive)) {
      console.log(`Searching drive ${drive}...`);
      const found = searchFile(drive);
      if (found) {
        targetPath = found;
        break;
      }
    }
  }
}

if (!targetPath) {
  console.error(`FATAL: Could not locate ${targetFileName} anywhere on drives.`);
  process.exit(1);
}

console.log(`Found presentation file at: ${targetPath}`);

// Copy and extract
const scratchDir = path.join(__dirname, 'scratch');
if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir);
}

const tempZip = path.join(scratchDir, 'temp_biocontrol.zip');
const tempDir = path.join(scratchDir, 'temp_biocontrol');

// Remove existing temp files
if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip);
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

fs.copyFileSync(targetPath, tempZip);
console.log(`Copied presentation to temporary zip: ${tempZip}`);

// Extract zip using PowerShell
try {
  const cmd = `powershell -Command "Expand-Archive -Path '${tempZip}' -DestinationPath '${tempDir}' -Force"`;
  execSync(cmd);
  console.log(`Extracted presentation zip to: ${tempDir}`);
} catch (err) {
  console.error('Error expanding archive:', err.message);
  process.exit(1);
}

// Parse slides
const slidesDir = path.join(tempDir, 'ppt', 'slides');
if (!fs.existsSync(slidesDir)) {
  console.error('Slides directory not found at:', slidesDir);
  process.exit(1);
}

const files = fs.readdirSync(slidesDir)
  .filter(f => f.startsWith('slide') && f.endsWith('.xml'))
  .sort((a, b) => {
    const numA = parseInt(a.replace('slide', '').replace('.xml', ''));
    const numB = parseInt(b.replace('slide', '').replace('.xml', ''));
    return numA - numB;
  });

console.log(`Found ${files.length} slide XML files to parse.`);

let mdContent = `# 3.2 Biological Control Lecture Slides Reference\n\n`;

files.forEach((file, idx) => {
  const filePath = path.join(slidesDir, file);
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
  
  mdContent += `## Slide ${idx + 1}\n\n`;
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

const outputPath = path.join(scratchDir, 'biocontrol_slides_text.md');
fs.writeFileSync(outputPath, mdContent, 'utf8');
console.log('Successfully written parsed slides to:', outputPath);
console.log('\n--- PREVIEW (First 400 chars) ---');
console.log(mdContent.substring(0, 400));
console.log('---------------------------------');
