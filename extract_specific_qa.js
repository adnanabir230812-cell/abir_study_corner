const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'scratch', 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

// Parse the markdown into individual questions
const questions = [];
const rx = /#### Q\[ID: (\d+)\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;

let match;
while ((match = rx.exec(content)) !== null) {
  questions.push({
    id: parseInt(match[1]),
    title: match[2].trim(),
    answer: match[3].trim()
  });
}

const targetIds = [97, 98, 99, 100, 101, 102, 335, 103, 104, 105, 106, 107, 108, 109, 309, 310, 311, 317, 321, 117, 118, 313];
const matched = questions.filter(q => targetIds.includes(q.id));

console.log(`Matched ${matched.length} out of ${targetIds.length} target questions.`);

const output = matched.map(q => {
  return `### Question ID: ${q.id}\n**Title:** ${q.title}\n\n**Answer:**\n${q.answer}\n\n=========================================\n`;
}).join('\n');

fs.writeFileSync('scratch/extracted_pathogenesis_qa.md', output, 'utf8');
console.log('Saved to scratch/extracted_pathogenesis_qa.md');
