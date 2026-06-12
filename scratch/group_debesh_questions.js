const fs = require('fs');
const path = require('path');

const rawQuestionsPath = path.join(__dirname, 'debesh_questions_raw.md');
const content = fs.readFileSync(rawQuestionsPath, 'utf8');

const lines = content.split('\n');

let currentChapter = '';
let questions = [];

const chapterRx = /^Chapter\s+(\d+):\s+(.*)$/i;
// Match: 1. Question text... [marks] (year)
const qRx = /^(\d+)\.\s+(.*?)(?:\s+\[([\d+=.]+)\])?(?:\s+\((\d{4}(?:-\d{2})?)\))?$/;

lines.forEach(line => {
  const trimmed = line.trim();
  if (!trimmed) return;

  const chapMatch = trimmed.match(chapterRx);
  if (chapMatch) {
    currentChapter = `Chapter ${chapMatch[1]}: ${chapMatch[2].trim()}`;
    return;
  }

  const qMatch = trimmed.match(qRx);
  if (qMatch) {
    const qNum = parseInt(qMatch[1]);
    const qText = qMatch[2].trim();
    const marks = qMatch[3] ? qMatch[3].trim() : null;
    const year = qMatch[4] ? qMatch[4].trim() : null;

    questions.push({
      chapter: currentChapter,
      num: qNum,
      text: qText,
      marks: marks,
      year: year,
      raw: trimmed
    });
  }
});

// Group identical questions by text (case insensitive, ignoring spacing and punctuation at the end)
function cleanTextForMatching(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // remove all non-alphanumeric chars
    .trim();
}

const groups = {};
questions.forEach(q => {
  const key = cleanTextForMatching(q.text);
  if (!groups[key]) {
    groups[key] = {
      text: q.text,
      chapter: q.chapter,
      repeats: []
    };
  }
  groups[key].repeats.push({
    year: q.year,
    marks: q.marks,
    rawNum: q.num
  });
});

// Convert groups back to array and format
const groupedList = Object.values(groups);

// Write to grouped markdown for inspection
let mdOutput = '# Grouped Previous Year Questions for Debesh Sir (Crop Ecology Section A)\n\n';
let currentChapForMd = '';

groupedList.forEach((g, index) => {
  if (g.chapter !== currentChapForMd) {
    currentChapForMd = g.chapter;
    mdOutput += `\n## ${currentChapForMd}\n\n`;
  }

  // Format years and marks
  const yearMarks = g.repeats.map(r => {
    let part = r.year || 'Unknown Year';
    if (r.marks) part += `, Marks: ${r.marks}`;
    return part;
  }).join('; ');

  mdOutput += `### Q${index + 1}: ${g.text}\n`;
  mdOutput += `* **Years & Marks:** (${yearMarks})\n`;
  mdOutput += `* **Unique Key Count:** ${g.repeats.length} times repeated\n\n`;
});

const outPath = path.join(__dirname, 'debesh_questions_grouped.md');
fs.writeFileSync(outPath, mdOutput, 'utf8');

console.log(`Grouped ${questions.length} raw questions into ${groupedList.length} unique questions.`);
console.log(`Saved result to ${outPath}`);
