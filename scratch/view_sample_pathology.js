const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const pathology = db.courses.find(c => c.id === 1);
if (pathology) {
  console.log('Sample Pathology Questions:');
  let count = 0;
  for (const s of pathology.Sections) {
    for (const t of s.Topics) {
      for (const q of t.Questions) {
        if (count < 5) {
          console.log(`- QID: ${q.id}: "${q.questionText}"`);
          count++;
        }
      }
    }
  }
}
