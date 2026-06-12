const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'scratch', 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

const targetIds = [131, 134, 139, 326, 327];
const questions = [];
const rx = /#### Q\[ID: (\d+)\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;

let match;
while ((match = rx.exec(content)) !== null) {
  const id = parseInt(match[1]);
  if (targetIds.includes(id)) {
    questions.push({
      id: id,
      title: match[2].trim(),
      answer: match[3].trim()
    });
  }
}

const output = questions.map(q => {
  return `### Question ID: ${q.id}\n**Title:** ${q.title}\n\n**Answer:**\n${q.answer}\n\n=========================================\n`;
}).join('\n');

fs.writeFileSync('scratch/extracted_biocontrol_qa.md', output, 'utf8');
console.log('Saved to scratch/extracted_biocontrol_qa.md');
