const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configure marked options exactly as in courseController.js
marked.setOptions({
  breaks: true,
  gfm: true
});

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Find QID 2018
let answerText = '';
db.courses.forEach(c => {
  c.Sections.forEach(s => {
    s.Topics.forEach(t => {
      t.Questions.forEach(q => {
        if (q.id === 2018) {
          answerText = q.answerText;
        }
      });
    });
  });
});

console.log('Raw answerText:');
console.log(JSON.stringify(answerText));

console.log('\nParsed HTML:');
console.log(marked.parse(answerText));
