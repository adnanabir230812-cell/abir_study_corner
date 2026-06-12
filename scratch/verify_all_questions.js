const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const rawQuestionsPath = path.join(__dirname, 'debesh_questions_raw.md');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const rawContent = fs.readFileSync(rawQuestionsPath, 'utf8');

const rawLines = rawContent.split('\n');

const qRx = /^(\d+)\.\s+(.*?)(?:\s+\[([\d+=.]+)\])?(?:\s+\((\d{4}(?:-\d{2})?)\))?$/;
const rawQuestions = [];

rawLines.forEach(line => {
  const trimmed = line.trim();
  if (!trimmed) return;
  const match = trimmed.match(qRx);
  if (match) {
    rawQuestions.push(match[2].trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
  }
});

const dbQuestions = [];
const ecology = db.courses.find(c => c.id === 2);
if (ecology) {
  const secA = ecology.Sections.find(s => s.id === 3);
  if (secA) {
    secA.Topics.forEach(t => {
      t.Questions.forEach(q => {
        // We also want to check the full text
        dbQuestions.push(q.questionText.toLowerCase().replace(/[^a-z0-9]/g, ''));
      });
    });
  }
}

let missing = 0;
rawQuestions.forEach((rawQ, i) => {
  let found = false;
  for (const dbQ of dbQuestions) {
    if (dbQ.includes(rawQ) || rawQ.includes(dbQ)) {
      found = true;
      break;
    }
  }
  if (!found) {
    console.log(`Missing Raw Question ${i+1}: "${rawLines.find(l => l.includes((i+1) + '.'))}"`);
    missing++;
  }
});

console.log(`Verification Complete. Total raw questions: ${rawQuestions.length}, Missing: ${missing}`);
