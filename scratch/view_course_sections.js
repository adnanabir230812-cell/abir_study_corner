const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const ecology = db.courses.find(c => c.id === 2);
if (ecology) {
  console.log(`Course: ${ecology.name} (ID: ${ecology.id})`);
  ecology.Sections.forEach(s => {
    console.log(`- Section ID: ${s.id}, Name: ${s.name}, Teacher: ${s.teacherName}`);
    console.log(`  Topics:`);
    s.Topics.forEach(t => {
      console.log(`    * Topic ID: ${t.id}, Name: ${t.name}, Questions count: ${t.Questions ? t.Questions.length : 0}`);
      if (t.Questions && t.Questions.length > 0) {
        console.log(`      First Q: ${t.Questions[0].questionText.substring(0, 60)}...`);
      }
    });
  });
} else {
  console.log('Course ID 2 not found!');
}
