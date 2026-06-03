const { Question, Topic } = require('../models');

async function findAllUnformatted() {
  try {
    const qs = await Question.findAll({
      include: [{ model: Topic, where: { sectionId: 1 } }]
    });

    console.log(`Scanning ${qs.length} Section A questions...`);
    
    for (const q of qs) {
      const lines = q.answerText.split(/\r?\n/);
      let listLikeLines = [];
      let currentGroup = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) {
          if (currentGroup.length > 2) {
            listLikeLines.push([...currentGroup]);
          }
          currentGroup = [];
          continue;
        }
        
        const isMarkdown = line.startsWith('#') || 
                           line.startsWith('*') || 
                           line.startsWith('-') || 
                           line.startsWith('|') || 
                           line.startsWith('>') || 
                           line.match(/^\d+\./) ||
                           line.startsWith('===') ||
                           line.startsWith('---');
                           
        // If it's a short line that is NOT markdown, and is not a header ending with ':'
        if (!isMarkdown && line.length > 0 && line.length < 100 && !line.endsWith(':')) {
          currentGroup.push({ index: i, text: line });
        } else {
          if (currentGroup.length > 2) {
            listLikeLines.push([...currentGroup]);
          }
          currentGroup = [];
        }
      }
      if (currentGroup.length > 2) {
        listLikeLines.push([...currentGroup]);
      }
      
      if (listLikeLines.length > 0) {
        console.log(`\n=====================================`);
        console.log(`ID: ${q.id} | Question: ${q.questionText}`);
        console.log(`=====================================`);
        listLikeLines.forEach(group => {
          console.log(`  Group of plain lines (starts at line ${group[0].index}):`);
          group.forEach(item => console.log(`    [Line ${item.index}]: "${item.text}"`));
        });
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

findAllUnformatted();
