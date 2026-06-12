const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('--- Course Schema ---');
const c = db.courses[0];
console.log('Course keys:', Object.keys(c));
console.log('Section keys:', Object.keys(c.Sections[0]));
console.log('Topic keys:', Object.keys(c.Sections[0].Topics[0]));
if (c.Sections[0].Topics[0].Questions && c.Sections[0].Topics[0].Questions.length > 0) {
  console.log('Question keys:', Object.keys(c.Sections[0].Topics[0].Questions[0]));
}
