const fs = require('fs');
const path = require('path');
const marked = require('marked');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const c9 = db.courses.find(c => c.id === 9);
const sec15 = c9.Sections[0];

console.log(`Course: ${c9.name} (${c9.code})`);
console.log(`Section: ${sec15.name}`);
console.log(`Total Topics: ${sec15.Topics.length}`);

const allQs = [];
sec15.Topics.forEach((t, idx) => {
  console.log(`  Topic ${idx + 1}: ${t.name} (${t.Questions.length} cards)`);
  allQs.push(...t.Questions);
});

console.log(`Total Cards: ${allQs.length}`);

const bad = [];
allQs.forEach(q => {
  try {
    marked.parse(q.answerText);
  } catch (err) {
    bad.push({ id: q.id, error: err.message });
  }
});

console.log(`Marked parsing test: Checked ${allQs.length}, Bad: ${bad.length}`);
if (bad.length > 0) {
  console.error('Errors found:', bad);
  process.exit(1);
} else {
  console.log('ALL TOPICS & CARDS PASSED PARSING CHECKS!');
}
