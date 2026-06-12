const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('Courses list:');
db.courses.forEach(c => {
  console.log(`- Course [${c.id}]: ${c.name} (${c.code})`);
  c.Sections.forEach(s => {
    console.log(`  - Section [${s.id}]: ${s.name}`);
    if (s.Topics) {
      console.log(`    - Topics count: ${s.Topics.length}`);
      s.Topics.forEach(t => {
        console.log(`      - Topic [${t.id}]: ${t.name} (${t.Questions ? t.Questions.length : 0} questions)`);
      });
    }
  });
});
