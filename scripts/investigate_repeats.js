const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const course = db.courses.find(c => c.id === 1);
const sessions = {};

course.Sections.forEach(s => {
  s.Topics.forEach(t => {
    t.Questions.forEach(q => {
      // Find session tag like [Session 2023-24] or [Class Test]
      const match = q.questionText.match(/\[(.*?)\]/);
      if (match) {
        const session = match[1];
        if (!sessions[session]) sessions[session] = 0;
        sessions[session]++;
      } else {
        if (!sessions['No Session']) sessions['No Session'] = 0;
        sessions['No Session']++;
      }
    });
  });
});

console.log('=== QUESTION COUNT BY SESSION IN DATABASE ===');
Object.entries(sessions).forEach(([session, count]) => {
  console.log(`  - ${session}: ${count} questions`);
});
