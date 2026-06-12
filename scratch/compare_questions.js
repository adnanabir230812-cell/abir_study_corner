const fs = require('fs');
const path = require('path');

const dbPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\toppr\\database.json';
const ocrPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\toppr\\scratch\\ecology_ocr_raw.txt';

if (!fs.existsSync(dbPath) || !fs.existsSync(ocrPath)) {
  console.error('Files not found!');
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const ocrText = fs.readFileSync(ocrPath, 'utf8');

const dbQuestions = [];
const c2 = db.courses.find(c => c.id === 2);
c2.Sections.forEach(s => {
  if (s.name === 'Section B') {
    s.Topics.forEach(t => {
      t.Questions.forEach(q => {
        dbQuestions.push({
          id: q.id,
          topicId: t.id,
          topicName: t.name,
          text: q.questionText
        });
      });
    });
  }
});

console.log(`Total Section B questions in database: ${dbQuestions.length}\n`);

// Let's check which lines in the OCR text look like questions and check if they are in the database
const ocrLines = ocrText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

console.log('--- Checking OCR lines against database ---');
let foundCount = 0;
let missingCount = 0;

ocrLines.forEach(line => {
  // We only check lines that look like Section B questions (starting with 5., 6., 7., 8., or sub-questions (a), (b), (c), (d))
  if (/^[5-8]\./.test(line) || /^\([a-d]\)/.test(line) || /^[a-d]\)/.test(line)) {
    // Normalize line text for comparison
    const cleanLine = line.replace(/^[5-8]\.\s*\(?[a-d]?\)?\s*/i, '').replace(/^\([a-d]\)\s*/i, '').replace(/^[a-d]\)\s*/i, '').trim();
    if (cleanLine.length < 10) return; // skip too short
    
    // Find matching question in database
    const match = dbQuestions.find(q => {
      // Check similarity or substring
      const t1 = q.text.toLowerCase();
      const t2 = cleanLine.toLowerCase();
      return t1.includes(t2) || t2.includes(t1) || t1.replace(/[^a-z0-9]/g, '').includes(t2.replace(/[^a-z0-9]/g, ''));
    });
    
    if (match) {
      foundCount++;
      // console.log(`[FOUND] "${line}" matches Q${match.id} under "${match.topicName}"`);
    } else {
      missingCount++;
      console.log(`[MISSING] "${line}" (Cleaned: "${cleanLine}")`);
    }
  }
});

console.log(`\nSummary: Matches found: ${foundCount}, Missing from database: ${missingCount}`);
