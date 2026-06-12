const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const course = db.courses.find(c => c.id === 1);
const sectionB = course.Sections.find(s => s.name === 'Section B');

console.log('--- SAMPLE OF SECTION B QUESTIONS ---');
let count = 0;
for (const topic of sectionB.Topics) {
  console.log(`Topic: ${topic.name}`);
  for (const q of topic.Questions.slice(0, 5)) {
    console.log(`  - Q[ID:${q.id}]: "${q.questionText.substring(0, 100)}"`);
    count++;
  }
}
