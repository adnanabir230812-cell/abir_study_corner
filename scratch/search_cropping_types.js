const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const ecology = db.courses.find(c => c.id === 2);
if (ecology) {
  const secB = ecology.Sections.find(s => s.id === 4);
  if (secB) {
    secB.Topics.forEach(t => {
      if (t.Questions) {
        t.Questions.forEach(q => {
          const lower = q.questionText.toLowerCase() + " " + q.answerText.toLowerCase();
          if (lower.includes('parallel cropping') || lower.includes('companion cropping') || lower.includes('multistoreyed') || lower.includes('synergetic')) {
            console.log(`Topic ${t.id} (${t.name}) - QID ${q.id}: ${q.questionText}`);
            console.log(`Answer:\n${q.answerText}\n------------------------------------------------`);
          }
        });
      }
    });
  }
}
