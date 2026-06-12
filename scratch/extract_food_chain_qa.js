const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const ecology = db.courses.find(c => c.id === 2);
if (ecology) {
  const secB = ecology.Sections.find(s => s.id === 4);
  if (secB) {
    const topics = secB.Topics.filter(t => [104, 105, 106].includes(t.id));
    topics.forEach(t => {
      console.log(`==================================================`);
      console.log(`Topic ID: ${t.id} - ${t.name}`);
      console.log(`==================================================`);
      if (t.Questions && t.Questions.length > 0) {
        t.Questions.forEach((q, i) => {
          console.log(`\nQuestion ${i+1}: QID ${q.id}`);
          console.log(`Text: ${q.questionText}`);
          console.log(`Answer:\n${q.answerText}\n`);
          console.log(`--------------------------------------------------`);
        });
      } else {
        console.log("No questions found.");
      }
    });
  }
}
