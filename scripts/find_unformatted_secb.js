const { Question, Topic } = require('../models');

async function scanSectionB() {
  try {
    const qs = await Question.findAll({
      include: [{ model: Topic, where: { sectionId: 2 } }]
    });

    console.log(`Scanning ${qs.length} Section B questions...`);
    let unformattedCount = 0;
    
    for (const q of qs) {
      const lines = q.answerText.split(/\r?\n/);
      let plainLinesGroup = [];
      let listLikeGroups = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) {
          if (plainLinesGroup.length > 2) {
            listLikeGroups.push([...plainLinesGroup]);
          }
          plainLinesGroup = [];
          continue;
        }
        
        const isMarkdown = line.startsWith('#') || 
                           line.startsWith('*') || 
                           line.startsWith('-') || 
                           line.startsWith('+') || 
                           line.startsWith('|') || 
                           line.startsWith('>') || 
                           line.match(/^\d+\./) ||
                           line.startsWith('===') ||
                           line.startsWith('---') ||
                           line.startsWith('`');
                           
        if (!isMarkdown && line.length > 0 && line.length < 120 && !line.endsWith(':')) {
          plainLinesGroup.push({ index: i, text: line });
        } else {
          if (plainLinesGroup.length > 2) {
            listLikeGroups.push([...plainLinesGroup]);
          }
          plainLinesGroup = [];
        }
      }
      if (plainLinesGroup.length > 2) {
        listLikeGroups.push([...plainLinesGroup]);
      }
      
      if (listLikeGroups.length > 0) {
        unformattedCount++;
        console.log(`\n=====================================`);
        console.log(`ID: ${q.id} | Topic: "${q.Topic.name}" | Question: ${q.questionText}`);
        console.log(`=====================================`);
        listLikeGroups.forEach(group => {
          console.log(`  Group of plain lines (starts at line ${group[0].index}):`);
          group.forEach(item => console.log(`    [Line ${item.index}]: "${item.text}"`));
        });
      }
    }
    
    console.log(`\nScan completed. Found ${unformattedCount} potentially unformatted Section B questions.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

scanSectionB();
