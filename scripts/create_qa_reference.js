const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const pathology = db.courses.find(c => c.id === 1);
let md = `# Plant Pathology Q&A Reference Document\n\n`;

pathology.Sections.forEach(sec => {
  md += `## SECTION: ${sec.name} (Instructor: ${sec.teacherName})\n\n`;
  
  sec.Topics.forEach(topic => {
    md += `### Topic: ${topic.name}\n\n`;
    
    topic.Questions.forEach((q, idx) => {
      md += `#### Q[ID: ${q.id}]. ${q.questionText}\n\n`;
      md += `**Answer:**\n${q.answerText || 'No answer uploaded.'}\n\n`;
      md += `---\n\n`;
    });
  });
});

const outputPath = path.join(__dirname, '..', 'scratch', 'pathology_qa_reference.md');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, md, 'utf8');
console.log('Successfully created pathology_qa_reference.md at:', outputPath);
