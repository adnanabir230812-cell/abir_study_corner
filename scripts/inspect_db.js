const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const course = db.courses.find(c => c.id === 1);
console.log(`Course: ${course.name} (${course.code})`);
course.Sections.forEach(sec => {
  console.log(`\nSection: ${sec.name}`);
  sec.Topics.forEach(top => {
    console.log(`  Topic ID: ${top.id} | Name: "${top.name}" | Questions: ${top.Questions.length}`);
  });
});
