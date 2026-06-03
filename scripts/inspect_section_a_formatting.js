const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\toppr\\all_section_a_questions.txt', 'utf8');
const blocks = content.split('=====================================\n');

console.log('Inspecting Section A questions for unformatted lists...');

for (const block of blocks) {
  if (!block.trim()) continue;
  
  const idLine = block.split('\n')[0];
  if (!idLine.startsWith('ID:')) continue;
  
  const lines = block.split('\n');
  const answerLines = lines.slice(2); // skip ID line and separator
  
  let unformattedCount = 0;
  let sample = [];
  
  for (let i = 0; i < answerLines.length; i++) {
    const line = answerLines[i].trim();
    if (!line) continue;
    
    // Check if line doesn't start with markdown symbols
    const isMarkdown = line.startsWith('#') || 
                       line.startsWith('*') || 
                       line.startsWith('-') || 
                       line.startsWith('|') || 
                       line.startsWith('>') || 
                       line.match(/^\d+\./) ||
                       line.startsWith('##') ||
                       line.startsWith('===') ||
                       line.startsWith('---');
                       
    if (!isMarkdown && line.length > 0 && line.length < 150) {
      unformattedCount++;
      if (sample.length < 5) {
        sample.push(line);
      }
    }
  }
  
  if (unformattedCount > 5) {
    console.log(`\nPotential Unformatted Question - ${idLine}`);
    console.log('Sample plain lines:');
    sample.forEach(s => console.log(`  - ${s}`));
  }
}
