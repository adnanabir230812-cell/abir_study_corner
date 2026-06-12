const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const ecology = db.courses.find(c => c.id === 2);
if (ecology) {
  const secB = ecology.Sections.find(s => s.id === 4);
  if (secB) {
    const terms = ['biotic', 'abiotic', 'producer', 'consumer', 'decomposer', 'natural', 'artificial', 'lotic', 'lentic'];
    secB.Topics.forEach(t => {
      // skip 100, 101, 102 as we already have them
      if ([100, 101, 102].includes(t.id)) return;
      if (t.Questions) {
        t.Questions.forEach(q => {
          const match = terms.some(term => q.questionText.toLowerCase().includes(term));
          if (match) {
            console.log(`Topic ${t.id} (${t.name}) - QID ${q.id}: ${q.questionText}`);
            console.log(`Answer:\n${q.answerText}\n------------------------------------------------`);
          }
        });
      }
    });
  }
}
