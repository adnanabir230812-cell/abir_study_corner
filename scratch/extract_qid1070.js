const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const ecology = db.courses.find(c => c.id === 2);
if (ecology) {
  const secB = ecology.Sections.find(s => s.id === 4);
  if (secB) {
    const topic = secB.Topics.find(t => t.id === 125);
    if (topic && topic.Questions) {
      const q = topic.Questions.find(q => q.id === 1070);
      if (q) {
        console.log(`[QID ${q.id}] ${q.questionText}`);
        console.log(`Answer:\n${q.answerText}`);
      }
    }
  }
}
