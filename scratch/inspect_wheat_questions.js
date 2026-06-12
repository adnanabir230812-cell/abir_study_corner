const fs = require('fs');
const path = require('path');

const db = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'database.json'), 'utf8'));
const pathology = db.courses.find(c => c.id === 1);
const wheatTopic = pathology.Sections.find(s => s.name === 'Section B').Topics.find(t => t.name === 'Wheat & Barley Diseases');

console.log(`=== Wheat Diseases Questions (${wheatTopic.Questions.length}) ===`);
wheatTopic.Questions.forEach(q => {
  console.log(`- "${q.questionText}"`);
});
