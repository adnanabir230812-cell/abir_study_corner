const { sequelize, Question } = require('../models');

async function autoFormatAnswers() {
  try {
    console.log('Fetching all questions from database...');
    const questions = await Question.findAll();
    console.log(`Found ${questions.length} questions in database.`);

    let fixedCount = 0;

    for (const q of questions) {
      const originalText = q.answerText;
      const lines = originalText.split(/\r?\n/);
      let updatedLines = [];
      let modified = false;
      
      let inListZone = false;
      let consecutivePlainLines = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        if (trimmed === '') {
          // If we had consecutive plain lines, flush them
          if (consecutivePlainLines.length > 1) {
            // Convert them to bullet points!
            for (const idx of consecutivePlainLines) {
              updatedLines[idx] = `* ${updatedLines[idx].trim()}`;
            }
            modified = true;
          }
          consecutivePlainLines = [];
          inListZone = false;
          updatedLines.push(line);
          continue;
        }

        const isMarkdown = trimmed.startsWith('#') || 
                           trimmed.startsWith('*') || 
                           trimmed.startsWith('-') || 
                           trimmed.startsWith('+') || 
                           trimmed.startsWith('|') || 
                           trimmed.startsWith('>') || 
                           trimmed.match(/^\d+\./) ||
                           trimmed.startsWith('===') ||
                           trimmed.startsWith('---') ||
                           trimmed.startsWith('`');

        // Check if it's a list header (ends with ':')
        const isListHeader = trimmed.endsWith(':') && !isMarkdown && trimmed.length > 3 && !trimmed.toLowerCase().startsWith('http');

        if (isListHeader) {
          // Flush any existing plain lines
          if (consecutivePlainLines.length > 1) {
            for (const idx of consecutivePlainLines) {
              updatedLines[idx] = `* ${updatedLines[idx].trim()}`;
            }
            modified = true;
          }
          consecutivePlainLines = [];
          
          // Make the header bold for a premium look!
          const headerText = trimmed.slice(0, -1).replace(/^\*\*|\*\*$/g, '').trim();
          updatedLines.push(`### ${headerText}:`);
          inListZone = true;
          modified = true;
          continue;
        }

        if (inListZone) {
          if (!isMarkdown) {
            updatedLines.push(`* ${trimmed}`);
            modified = true;
          } else {
            updatedLines.push(line);
            inListZone = false; // exited list zone
          }
        } else {
          if (!isMarkdown && trimmed.length > 0 && trimmed.length < 180) {
            consecutivePlainLines.push(updatedLines.length);
            updatedLines.push(line);
          } else {
            // Flush plain lines
            if (consecutivePlainLines.length > 1) {
              for (const idx of consecutivePlainLines) {
                updatedLines[idx] = `* ${updatedLines[idx].trim()}`;
              }
              modified = true;
            }
            consecutivePlainLines = [];
            updatedLines.push(line);
          }
        }
      }

      // Final flush at end of file
      if (consecutivePlainLines.length > 1) {
        for (const idx of consecutivePlainLines) {
          updatedLines[idx] = `* ${updatedLines[idx].trim()}`;
        }
        modified = true;
      }

      if (modified) {
        const newText = updatedLines.join('\n');
        q.answerText = newText;
        await q.save();
        fixedCount++;
        console.log(`Auto-formatted Q-${q.id}: "${q.questionText.substring(0, 50)}..."`);
      }
    }

    console.log(`\nSuccessfully auto-formatted ${fixedCount} questions in the database! 🚀`);
    process.exit(0);
  } catch (error) {
    console.error('Error during auto-formatting:', error);
    process.exit(1);
  }
}

autoFormatAnswers();
