const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
if (!fs.existsSync(dbPath)) {
  console.error('database.json not found!');
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Find Plant Pathology course
const pathology = db.courses.find(c => c.id === 1);
if (!pathology) {
  console.error('Plant Pathology course not found in database.json');
  process.exit(1);
}

// Desired topic ID sequences
const sectionASequence = [40, 41, 42, 43, 44, 45, 46];
const sectionBSequence = [47, 48, 49, 50, 51];

pathology.Sections.forEach(section => {
  if (section.name === 'Section A') {
    section.Topics.sort((a, b) => {
      const idxA = sectionASequence.indexOf(a.id);
      const idxB = sectionASequence.indexOf(b.id);
      return idxA - idxB;
    });
  } else if (section.name === 'Section B') {
    section.Topics.sort((a, b) => {
      const idxA = sectionBSequence.indexOf(a.id);
      const idxB = sectionBSequence.indexOf(b.id);
      return idxA - idxB;
    });
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully reordered Plant Pathology topics in database.json!');
