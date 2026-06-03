const { Question } = require('../models');

(async () => {
  try {
    const questions = await Question.findAll();
    console.log(`Total questions fetched: ${questions.length}`);
    
    let listOrBulletCandidates = [];
    
    for (const q of questions) {
      const lines = q.answerText.split(/\r?\n/);
      let plainLines = [];
      let listsDetected = false;
      let hasMarkdownLists = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const isMarkdownList = line.startsWith('* ') || line.startsWith('- ') || line.startsWith('+ ') || line.match(/^\d+\.\s/);
        if (isMarkdownList) {
          hasMarkdownLists = true;
        }
        
        // Lines starting with bullet indicators but without correct spaces, or custom indicators
        const hasPlainBulletIndicator = line.startsWith('•') || 
                                        line.startsWith('*') && !line.startsWith('* ') && !line.startsWith('**') || 
                                        line.startsWith('-') && !line.startsWith('- ') && !line.startsWith('---') || 
                                        line.startsWith('o ') || 
                                        line.startsWith('➢') ||
                                        line.startsWith('✔');
                                        
        if (hasPlainBulletIndicator) {
          listsDetected = true;
          plainLines.push({ index: i, text: line, reason: 'Plain/custom bullet indicator' });
        }
      }
      
      // Also look for questions where answers have lists but maybe the styling doesn't show them
      if (listsDetected || (hasMarkdownLists && q.answerText.includes('\n*'))) {
        listOrBulletCandidates.push({
          id: q.id,
          questionText: q.questionText,
          hasMarkdownLists,
          listsDetected,
          plainLinesCount: plainLines.length,
          samplePlainLines: plainLines.slice(0, 3)
        });
      }
    }
    
    console.log(`\nFound ${listOrBulletCandidates.length} questions that contain lists or bullet candidate patterns:`);
    listOrBulletCandidates.forEach(c => {
      console.log(`- Q${c.id}: "${c.questionText.substring(0, 60)}..."`);
      console.log(`  hasMarkdownLists: ${c.hasMarkdownLists}, listsDetected: ${c.listsDetected}`);
      if (c.samplePlainLines.length > 0) {
        console.log(`  Sample plain bullet lines:`);
        c.samplePlainLines.forEach(l => console.log(`    Line ${l.index}: "${l.text}"`));
      }
    });
    
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
