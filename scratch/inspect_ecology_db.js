const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const ecology = db.courses.find(c => c.id === 2);
if (ecology) {
  console.log(`Course: ${ecology.name}`);
  const secB = ecology.Sections.find(s => s.id === 4);
  if (secB) {
    console.log(`Section: ${secB.name}`);
    console.log('Topics inside Section B:');
    secB.Topics.forEach(t => {
      console.log(`- Topic ID: ${t.id}, Name: ${t.name}`);
      console.log(`  Questions count: ${t.Questions ? t.Questions.length : 0}`);
      if (t.Questions) {
        t.Questions.forEach(q => {
          console.log(`    * QID: ${q.id}, Text: ${q.questionText.substring(0, 80)}...`);
          console.log(`      Answer length: ${q.answerText ? q.answerText.length : 0} chars`);
        });
      }
    });
  } else {
    console.log('Section B not found!');
  }
} else {
  console.log('Crop Ecology not found!');
}
