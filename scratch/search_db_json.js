const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
if (fs.existsSync(dbPath)) {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  console.log('Total Courses:', db.courses.length);
  db.courses.forEach(c => {
    console.log(`- ID: ${c.id}, Name: ${c.name}, Code: ${c.code}`);
    c.Sections.forEach(s => {
      console.log(`  * Section ID: ${s.id}, Name: ${s.name}`);
      console.log(`    Topics Count: ${s.Topics ? s.Topics.length : 0}`);
    });
  });
} else {
  console.log('database.json not found!');
}
