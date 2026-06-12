const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const findQuestion = (id) => {
  for (const c of db.courses) {
    for (const s of c.Sections) {
      for (const t of s.Topics) {
        const q = t.Questions.find(ques => ques.id == id);
        if (q) return { q, t, s, c };
      }
    }
  }
  return null;
};

const q145 = findQuestion(145);
const q302 = findQuestion(302);

if (q145) {
  console.log('Q145:', q145.q.questionText, 'in Topic:', q145.t.name, 'Section:', q145.s.name);
} else {
  console.log('Q145 not found');
}

if (q302) {
  console.log('Q302:', q302.q.questionText, 'in Topic:', q302.t.name, 'Section:', q302.s.name);
} else {
  console.log('Q302 not found');
}
