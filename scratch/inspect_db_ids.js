const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let maxTopicId = 0;
let maxQuestionId = 0;

db.courses.forEach(c => {
  c.Sections.forEach(s => {
    s.Topics.forEach(t => {
      if (t.id > maxTopicId) maxTopicId = t.id;
      if (t.Questions) {
        t.Questions.forEach(q => {
          if (q.id > maxQuestionId) maxQuestionId = q.id;
        });
      }
    });
  });
});

console.log('Max Topic ID in database.json:', maxTopicId);
console.log('Max Question ID in database.json:', maxQuestionId);
