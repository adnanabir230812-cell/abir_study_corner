const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const ecology = db.courses.find(c => c.id === 2);
if (ecology) {
  const secB = ecology.Sections.find(s => s.id === 4);
  if (secB) {
    console.log(`Course: ${ecology.name}`);
    console.log(`Section: ${secB.name}`);
    secB.Topics.forEach((t, index) => {
      console.log(`[${index + 1}] Topic ID: ${t.id}, Name: ${t.name}, Questions: ${t.Questions ? t.Questions.length : 0}`);
    });
  }
}
