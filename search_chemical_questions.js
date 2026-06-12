const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'scratch', 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

const rx = /#### Q\[ID: (\d+)\]\.(.*?)\n\n\*\*Answer:\*\*\n([\s\S]*?)(?=\n---\n|\n### Topic:|$)/g;

const matched = [];
const keywords = [
  'fungicide', 'chemical', 'bordeaux', 'nematicide', 
  'bactericide', 'insecticide', 'carbofuran', 'propiconazole',
  'carbendazim', 'mancozeb', 'metalaxyl'
];

let match;
while ((match = rx.exec(content)) !== null) {
  const id = parseInt(match[1]);
  const title = match[2];
  const titleLower = title.toLowerCase();
  
  const hasKeyword = keywords.some(kw => titleLower.includes(kw));
  if (hasKeyword) {
    matched.push({ id, title: title.trim() });
  }
}

console.log(`Found ${matched.length} questions matching chemical keywords:`);
matched.forEach(q => console.log(` - Q[ID: ${q.id}]. ${q.title}`));
