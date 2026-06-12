const fs = require('fs');
const path = require('path');

const db = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'database.json'), 'utf8'));
const pathology = db.courses.find(c => c.id === 1);
pathology.Sections.forEach(s => {
  console.log(`Section ID: ${s.id} | Name: "${s.name}" | Instructor: "${s.teacherName}"`);
});
