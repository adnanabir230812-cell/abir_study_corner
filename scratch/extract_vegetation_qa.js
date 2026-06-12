const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let output = '';

const ecology = db.courses.find(c => c.id === 2);
if (ecology) {
  const secB = ecology.Sections.find(s => s.id === 4);
  if (secB) {
    const topics = secB.Topics.filter(t => t.id >= 126 && t.id <= 135);
    topics.forEach(t => {
      output += `==================================================\n`;
      output += `Topic: ${t.name} (Topic ID: ${t.id})\n`;
      output += `==================================================\n`;
      if (t.Questions && t.Questions.length > 0) {
        t.Questions.forEach((q, i) => {
          output += `\n### Question ${i+1}: ${q.questionText}\n\n`;
          output += `**Answer:**\n${q.answerText}\n\n`;
          output += `--------------------------------------------------\n`;
        });
      } else {
        output += "No questions found.\n";
      }
    });
  }
}

fs.writeFileSync(path.join(__dirname, 'vegetation_qa_output_utf8.md'), output, 'utf8');
console.log('Successfully wrote to vegetation_qa_output_utf8.md');
