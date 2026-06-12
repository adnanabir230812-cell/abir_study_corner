const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const ecology = db.courses.find(c => c.id === 2);
if (ecology) {
  const secB = ecology.Sections.find(s => s.id === 4);
  if (secB) {
    const ecosystemTopics = secB.Topics.filter(t => [100, 101, 102].includes(t.id));
    ecosystemTopics.forEach(t => {
      console.log(`\n==================================================`);
      console.log(`TOPIC ${t.id}: ${t.name}`);
      console.log(`==================================================`);
      if (t.Questions && t.Questions.length > 0) {
        t.Questions.forEach((q, i) => {
          console.log(`\n[QID ${q.id}] ${q.questionText}`);
          console.log(`Answer:`);
          console.log(q.answerText);
          console.log(`\n--------------------------------------------------`);
        });
      } else {
        console.log("No questions.");
      }
    });
  }
}
