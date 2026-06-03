const fs = require('fs');
const { sequelize, Question, Topic, Section } = require('./models');

// HTML entity decoder helper
function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
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

async function main() {
  await sequelize.authenticate();
  console.log('Database connected.');

  const content = fs.readFileSync('extracted_docx_text.txt', 'utf8');
  const lines = content.split('\n').map(l => decodeEntities(l.trim()));

  const parsedQuestions = [];
  let currentQuestion = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if it's a topic header
    if (line.toUpperCase().startsWith('TOPIC ')) {
      continue;
    }

    // Check if it's a question header, e.g., "Q1. What is..." or "Q12. ..."
    const qMatch = line.match(/^Q\d+\.\s*(.+)$/i) || line.match(/^Q\d+\s+\.\s*(.+)$/i);
    if (qMatch) {
      if (currentQuestion) {
        parsedQuestions.push(currentQuestion);
      }
      currentQuestion = {
        rawHeader: line,
        questionText: qMatch[1].trim(),
        repeats: null,
        answerLines: []
      };
      continue;
    }

    if (currentQuestion) {
      // Check if it's repeat metadata
      if (line.includes('✦ Repeated') || line.includes('✦  Repeated')) {
        currentQuestion.repeats = line.trim();
        continue;
      }
      currentQuestion.answerLines.push(line);
    }
  }

  if (currentQuestion) {
    parsedQuestions.push(currentQuestion);
  }

  console.log(`Parsed ${parsedQuestions.length} questions from the Word document.\n`);

  // Load all DB questions
  const dbQuestions = await Question.findAll({
    include: [{ model: Topic, include: [Section] }]
  });
  console.log(`Loaded ${dbQuestions.length} questions from database.`);

  let updatedCount = 0;
  let unmatchedCount = 0;

  for (const pq of parsedQuestions) {
    const pqTextClean = pq.questionText.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Find matching question in the database
    let bestMatch = null;
    let bestScore = 0;

    for (const dbq of dbQuestions) {
      const dbTextClean = dbq.questionText.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Compute simple overlap or containment
      if (dbTextClean.includes(pqTextClean) || pqTextClean.includes(dbTextClean)) {
        bestMatch = dbq;
        bestScore = 1.0;
        break;
      }

      // Check prefix similarity (first 40 characters)
      const pqPrefix = pqTextClean.substring(0, 40);
      const dbPrefix = dbTextClean.substring(0, 40);
      if (pqPrefix === dbPrefix && pqPrefix.length > 10) {
        bestMatch = dbq;
        bestScore = 0.9;
        break;
      }

      // Check keyword intersection
      const pqWords = new Set(pq.questionText.toLowerCase().split(/\s+/).filter(w => w.length > 3));
      const dbWords = new Set(dbq.questionText.toLowerCase().split(/\s+/).filter(w => w.length > 3));
      let intersection = 0;
      pqWords.forEach(w => { if (dbWords.has(w)) intersection++; });
      const score = intersection / Math.max(pqWords.size, dbWords.size);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = dbq;
      }
    }

    if (bestMatch && bestScore > 0.4) {
      // Build clean answer markdown
      // We filter out consecutive empty lines
      const cleanAnswerLines = [];
      let lastWasEmpty = false;
      pq.answerLines.forEach(al => {
        if (al === '') {
          if (!lastWasEmpty) {
            cleanAnswerLines.push('');
            lastWasEmpty = true;
          }
        } else {
          cleanAnswerLines.push(al);
          lastWasEmpty = false;
        }
      });

      const rawAnswer = cleanAnswerLines.join('\n').trim();
      const finalAnswer = `## Answer\n\n${rawAnswer}`;

      // Update in DB!
      bestMatch.answerText = finalAnswer;
      await bestMatch.save();
      
      console.log(`Matched (Score: ${bestScore.toFixed(2)}):`);
      console.log(`  Word: "${pq.questionText.substring(0, 60)}..."`);
      console.log(`  DB:   "${bestMatch.questionText.substring(0, 60)}..."`);
      updatedCount++;
    } else {
      console.log(`❌ UNMATCHED Word Question: "${pq.questionText.substring(0, 80)}..."`);
      unmatchedCount++;
    }
  }

  console.log(`\nImport complete! Updated ${updatedCount} questions. Unmatched: ${unmatchedCount}`);
  process.exit(0);
}

main();
