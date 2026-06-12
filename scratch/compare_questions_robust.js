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
  s.Topics.forEach(t => {
    t.Questions.forEach(q => {
      dbQuestions.push({
        id: q.id,
        sectionName: s.name,
        topicId: t.id,
        topicName: t.name,
        text: q.questionText
      });
    });
  });
});

function getWords(str) {
  return str.toLowerCase()
    .replace(/[‘’'"".,\/#!$%\^&\*;:{}=\-_`~()—?\[\]]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2); // only keep words with length > 2
}

function wordSimilarity(str1, str2) {
  const w1 = getWords(str1);
  const w2 = getWords(str2);
  if (w1.length === 0 || w2.length === 0) return 0;
  
  const intersection = w1.filter(w => w2.includes(w));
  return intersection.length / Math.min(w1.length, w2.length);
}

console.log(`Total questions in database: ${dbQuestions.length}\n`);

const ocrLines = ocrText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

let matchedCount = 0;
let trulyMissing = [];

let currentPageHeader = '';

ocrLines.forEach(line => {
  if (line.includes('=== PAGE')) {
    currentPageHeader = line;
    return;
  }
  
  // We check lines starting with question numbers or letters
  if (/^\d+\./.test(line) || /^\([a-d]\)/.test(line) || /^[a-d]\)/.test(line)) {
    const cleanLine = line.replace(/^[5-8]\.\s*\(?[a-d]?\)?\s*/i, '')
                          .replace(/^\([a-d]\)\s*/i, '')
                          .replace(/^[a-d]\)\s*/i, '')
                          .replace(/\s+\d+(\.\d+)?$/g, '') // remove marks at the end like 4.0
                          .trim();
    if (cleanLine.length < 10) return;
    
    // Find best match in database
    let bestMatch = null;
    let bestScore = 0;
    
    dbQuestions.forEach(q => {
      const score = wordSimilarity(q.text, cleanLine);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = q;
      }
    });
    
    if (bestScore >= 0.6) {
      matchedCount++;
      // console.log(`[OK] "${cleanLine}" matches "${bestMatch.text}" (Score: ${bestScore.toFixed(2)})`);
    } else {
      trulyMissing.push({ page: currentPageHeader, raw: line, clean: cleanLine, bestMatch: bestMatch ? bestMatch.text : 'None', score: bestScore });
    }
  }
});

console.log(`\nMatched: ${matchedCount}, Missing: ${trulyMissing.length}`);
if (trulyMissing.length > 0) {
  console.log('\n--- Truly Missing Questions ---');
  trulyMissing.forEach(m => {
    console.log(`[${m.page}]`);
    console.log(`  Raw: "${m.raw}"`);
    console.log(`  Cleaned: "${m.clean}"`);
    console.log(`  Best Database Guess: "${m.bestMatch}" (Score: ${m.score.toFixed(2)})\n`);
  });
}
