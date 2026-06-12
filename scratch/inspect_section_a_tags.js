const fs = require('fs');
const path = require('path');

const db = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'database.json'), 'utf8'));
const pathology = db.courses.find(c => c.id === 1);
const secA = pathology.Sections.find(s => s.name === 'Section A');

console.log('=== Sample Section A Questions ===');
let count = 0;
for (const topic of secA.Topics) {
  console.log(`Topic: ${topic.name}`);
  for (const q of topic.Questions.slice(0, 3)) {
    console.log(`  - "${q.questionText}"`);
    count++;
  }
}
