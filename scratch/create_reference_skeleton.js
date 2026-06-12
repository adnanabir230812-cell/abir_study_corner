const fs = require('fs');
const path = require('path');

const rawPath = path.join(__dirname, 'ecology_questions_raw.md');
if (!fs.existsSync(rawPath)) {
  console.error('ecology_questions_raw.md not found!');
  process.exit(1);
}

const content = fs.readFileSync(rawPath, 'utf8');
const lines = content.split('\n');

let mdContent = `# Crop Ecology (Section B) Solved Question Bank\n\n`;
mdContent += `This reference document contains all solved past exam questions (2016–2025) of Crop Ecology Section B (Sarwar Sir's lectures) grouped by chapter and topic.\n\n---\n\n`;

lines.forEach(line => {
  const trimmed = line.trim();
  if (trimmed === '') return;
  
  if (trimmed.startsWith('Chapter ')) {
    mdContent += `\n# ${trimmed}\n\n`;
  } else if (trimmed.startsWith('Topic ')) {
    mdContent += `\n## ${trimmed}\n\n`;
  } else if (/^\d+\./.test(trimmed)) {
    // It's a question
    mdContent += `\n#### ${trimmed}\n\n**Answer:**\n*(To be solved)*\n\n---\n`;
  } else {
    // If it's a general intro or note, skip or format
    if (trimmed.startsWith('Question Bank') || trimmed.startsWith('Topic-wise') || trimmed.startsWith('Repeated') || trimmed.startsWith('Chapters:')) {
      return;
    }
    if (trimmed.startsWith('Exam Pattern') || trimmed.startsWith('1. Question') || trimmed.startsWith('2. Topic') || trimmed.startsWith('3. Year') || trimmed.startsWith('4. Strategic')) {
      return;
    }
    // Just add as text
    if (trimmed.startsWith('Note:') || trimmed.startsWith('Total Questions:')) {
      return;
    }
  }
});

const outPath = path.join(__dirname, 'ecology_qa_reference.md');
fs.writeFileSync(outPath, mdContent, 'utf8');
console.log(`Successfully generated skeleton at: ${outPath}`);
