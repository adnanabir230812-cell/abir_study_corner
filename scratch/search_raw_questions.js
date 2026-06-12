const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'ecology_questions_raw.md');
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const terms = ['niche', 'habitat', 'ecosystem', 'structural', 'maize', 'rice'];
  
  lines.forEach((line, idx) => {
    const matched = terms.filter(t => line.toLowerCase().includes(t));
    if (matched.length > 0) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  });
} else {
  console.log("File not found");
}
