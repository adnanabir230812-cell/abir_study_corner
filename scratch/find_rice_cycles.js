const fs = require('fs');
const path = require('path');

const db = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'database.json'), 'utf8'));
const pathology = db.courses.find(c => c.id === 1);
const riceTopic = pathology.Sections.find(s => s.name === 'Section B').Topics.find(t => t.name === 'Rice Diseases');

console.log('=== Rice Disease Cycle Questions ===');
riceTopic.Questions.forEach(q => {
  if (q.questionText.toLowerCase().includes('cycle')) {
    console.log(`- [ID: ${q.id}]: "${q.questionText}"`);
  }
});
