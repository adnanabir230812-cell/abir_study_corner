const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'scratch', 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

// Find the section for Toxins in Disease Development
const startIdx = content.indexOf('### Topic: Toxins in Disease Development');
const endIdx = content.indexOf('### Topic: Pathophysiology');

if (startIdx === -1 || endIdx === -1) {
  console.error('Failed to locate the Toxin topic section boundaries.');
  process.exit(1);
}

const toxinSection = content.substring(startIdx, endIdx);
fs.writeFileSync('scratch/extracted_toxin_qa.md', toxinSection, 'utf8');
console.log('Successfully saved Toxin Q&A section to scratch/extracted_toxin_qa.md');
console.log('\n--- PREVIEW ---');
console.log(toxinSection.substring(0, 500));
