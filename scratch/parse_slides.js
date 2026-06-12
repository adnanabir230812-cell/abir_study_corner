const fs = require('fs');
const path = require('path');

const slidesDir = path.join(__dirname, '..', 'scratch', 'temp_pptx', 'ppt', 'slides');
if (!fs.existsSync(slidesDir)) {
  console.error('Slides directory not found at:', slidesDir);
  process.exit(1);
}

// Read and sort slide files
const files = fs.readdirSync(slidesDir)
  .filter(f => f.startsWith('slide') && f.endsWith('.xml'))
  .sort((a, b) => {
    const numA = parseInt(a.replace('slide', '').replace('.xml', ''));
    const numB = parseInt(b.replace('slide', '').replace('.xml', ''));
    return numA - numB;
  });

console.log(`Found ${files.length} slide files to parse.`);

let mdContent = `# 1.1 Pathogenesis Lecture Slides Reference\n\n`;

files.forEach((file, idx) => {
  const filePath = path.join(slidesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find all text inside <a:t>...</a:t>
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
    // Join lines. Filter out duplicate consecutive lines if any
    const uniqueLines = [];
    textMatches.forEach(line => {
      // Decode simple XML entities
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

const outputPath = path.join(__dirname, '..', 'scratch', 'pathogenesis_slides_text.md');
fs.writeFileSync(outputPath, mdContent, 'utf8');
console.log('Successfully written parsed slides to:', outputPath);
console.log('First 500 characters:');
console.log(mdContent.substring(0, 500));
