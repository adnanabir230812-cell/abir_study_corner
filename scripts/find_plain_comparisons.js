const { Question } = require('../models');
const { Op } = require('sequelize');

(async () => {
  try {
    const questions = await Question.findAll({
      where: {
        [Op.or]: [
          { questionText: { [Op.like]: '%distinguish%' } },
          { questionText: { [Op.like]: '%differentiate%' } },
          { questionText: { [Op.like]: '%compare%' } },
          { questionText: { [Op.like]: '%difference%' } }
        ]
      }
    });
    
    console.log(`Found ${questions.length} comparison/distinction questions in database:`);
    
    let plainTextComparisons = [];
    for (const q of questions) {
      const hasTable = q.answerText.includes('|') && q.answerText.includes('---');
      console.log(`- ID: ${q.id} | Has Table: ${hasTable ? 'YES' : 'NO'}`);
      console.log(`  Question: "${q.questionText}"`);
      if (!hasTable) {
        plainTextComparisons.push(q);
      }
    }
    
    console.log(`\nFound ${plainTextComparisons.length} comparison questions without a markdown table.`);
    plainTextComparisons.forEach(q => {
      console.log(`\n--- Q${q.id} ---`);
      console.log(`Question: ${q.questionText}`);
      console.log(`Answer:\n${q.answerText.substring(0, 500)}...\n`);
    });
    
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
