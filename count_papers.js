const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'scratch', 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const papers = new Set();
const sessions = new Set();

lines.forEach(line => {
  if (line.startsWith('#### Q[')) {
    // Look for tags like [Paper X] or [Session Y]
    const paperMatches = line.match(/Paper \d+/g);
    if (paperMatches) {
      paperMatches.forEach(p => papers.add(p));
    }
    const sessionMatches = line.match(/Session \d{4}-\d{2}/g);
    if (sessionMatches) {
      sessionMatches.forEach(s => sessions.add(s));
    }
  }
});

console.log('Found Papers:', Array.from(papers).sort());
console.log('Found Sessions:', Array.from(sessions).sort());
console.log('Total unique paper tags:', papers.size);
console.log('Total unique session tags:', sessions.size);
