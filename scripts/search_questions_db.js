const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
if (!fs.existsSync(dbPath)) {
  console.error("database.json not found!");
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const query = process.argv[2];

if (!query) {
  console.log("Usage: node search_questions_db.js <query_string>");
  process.exit(0);
}

console.log(`Searching for "${query}" in database.json...\n`);

let matches = [];
db.courses.forEach(course => {
  course.Sections.forEach(section => {
    section.Topics.forEach(topic => {
      topic.Questions.forEach(q => {
        if (q.questionText.toLowerCase().includes(query.toLowerCase()) || q.answerText.toLowerCase().includes(query.toLowerCase())) {
          matches.push({
            course: course.name,
            section: section.name,
            topic: topic.name,
            qId: q.id,
            text: q.questionText
          });
        }
      });
    });
  });
});

console.log(`Found ${matches.length} matches:`);
matches.forEach(m => {
  console.log(`- [Course: ${m.course} | Topic: ${m.topic}] Q${m.qId}: ${m.text}`);
});
