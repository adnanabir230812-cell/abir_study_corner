const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const ecology = db.courses.find(c => c.id === 2);
if (ecology) {
  const secB = ecology.Sections.find(s => s.id === 4);
  if (secB) {
    const topic = secB.Topics.find(t => t.id === 110);
    if (topic && topic.Questions) {
      topic.Questions.forEach((q, i) => {
        console.log(`[QID ${q.id}] ${q.questionText}`);
        console.log(`Answer:\n${q.answerText}\n--------------------------------------`);
      });
    }
  }
}
