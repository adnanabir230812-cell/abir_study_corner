const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const outputPath = path.join(__dirname, '..', 'scratch', 'ecology_solved_section_b.md');

if (!fs.existsSync(dbPath)) {
  console.error('database.json not found!');
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const course = db.courses.find(c => c.id === 2); // Crop Ecology

if (!course) {
  console.error('Course 2 not found');
  process.exit(1);
}

const sectionB = course.Sections.find(s => s.name === 'Section B');
if (!sectionB) {
  console.error('Section B not found');
  process.exit(1);
}

let doc = `# Solved Past Exam & Class Test Questions\n`;
doc += `**Course: AT-3203 Crop Ecology (Section B — Sarwar Sir)**\n`;
doc += `**Agrotechnology Discipline, Khulna University**\n`;
doc += `*Solved strictly based on Sarwar Sir's slides (2016–2025)*\n\n`;
doc += `---\n\n`;

sectionB.Topics.forEach((topic, tIdx) => {
  if (topic.Questions.length === 0) return;
  
  doc += `## Topic ${tIdx + 1}: ${topic.name}\n\n`;
  
  topic.Questions.forEach((q, qIdx) => {
    doc += `### Q${qIdx + 1}. ${q.questionText}\n\n`;
    doc += `${q.answerText}\n\n`;
    doc += `* * *\n\n`;
  });
});

fs.writeFileSync(outputPath, doc, 'utf8');
console.log(`Successfully generated solved questions document at: ${outputPath}`);
