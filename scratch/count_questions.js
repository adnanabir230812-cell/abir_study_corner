const fs = require('fs');
const path = require('path');

const qPath = path.join(__dirname, 'ecology_questions.json');
const qData = JSON.parse(fs.readFileSync(qPath, 'utf8'));

let count = 0;
qData.chapters.forEach(ch => {
  ch.topics.forEach(t => {
    t.questions.forEach(q => {
      count++;
      console.log(`${count}. QID: ${q.id} (Topic: ${t.name}) - ${q.questionText}`);
    });
  });
});

console.log('Total questions in ecology_questions.json:', count);
