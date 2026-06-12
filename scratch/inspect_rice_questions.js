const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const pathology = db.courses.find(c => c.id === 1);
const sectionB = pathology.Sections.find(s => s.name === 'Section B');
const riceTopic = sectionB.Topics.find(t => t.name === 'Rice Diseases');

console.log(`=== Rice Diseases Questions (${riceTopic.Questions.length}) ===`);
riceTopic.Questions.forEach(q => {
  console.log(`- [ID: ${q.id}]: "${q.questionText}"`);
});
