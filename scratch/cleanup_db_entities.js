const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const qPath = path.join(__dirname, 'ecology_questions.json');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const qData = JSON.parse(fs.readFileSync(qPath, 'utf8'));

// Helper to decode HTML entities
function decodeEntities(str) {
  if (!str) return '';
  return str
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&bull;/g, '•')
    .replace(/&middot;/g, '·')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'");
}

// Flat list of parsed questions for lookup
const parsedQMap = {};
qData.chapters.forEach(ch => {
  ch.topics.forEach(t => {
    t.questions.forEach(q => {
      parsedQMap[q.id] = q;
    });
  });
});

console.log('--- Cleaning Up Database Entities & Appending Years ---');

let cleanedCount = 0;
let appendedYearsCount = 0;

db.courses.forEach(c => {
  c.Sections.forEach(s => {
    s.Topics.forEach(t => {
      // Decode topic name entities
      t.name = decodeEntities(t.name);
      
      t.Questions.forEach(q => {
        const originalText = q.questionText;
        let text = decodeEntities(originalText);
        let answer = decodeEntities(q.answerText);
        
        // Specific logic for Course 2 (Crop Ecology)
        if (c.id === 2) {
          const refQ = parsedQMap[q.id];
          if (refQ) {
            let yearInfo = '';
            if (refQ.marks && refQ.years) {
              yearInfo = `  [${refQ.marks}]  (${refQ.years})`;
            } else if (refQ.years) {
              yearInfo = `  (${refQ.years})`;
            } else if (refQ.marks) {
              yearInfo = `  [${refQ.marks}]`;
            }
            
            // Clean up the text (strip any old year tags at the end if they exist)
            text = text.replace(/\s*\[[\d–\.]+\]\s*\([\d\s–,a-zA-Z\(\)]+\)$/, '');
            text = text.replace(/\s*\([\d\s–,a-zA-Z\(\)]+\)$/, '');
            text = text.replace(/\s*\[[\d–\.]+\]$/, '');
            
            text = text.trim() + yearInfo;
            appendedYearsCount++;
          }
        }
        
        if (text !== originalText) {
          cleanedCount++;
        }
        
        q.questionText = text;
        q.answerText = answer;
      });
    });
  });
});

console.log(`Cleaned entities in ${cleanedCount} questions.`);
console.log(`Appended years for ${appendedYearsCount} questions in Course 2.`);

// Save back to database.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('database.json updated successfully!');
