const { Question } = require('../models');
const { Op } = require('sequelize');

(async () => {
  try {
    const questions = await Question.findAll({
      where: {
        [Op.or]: [
          { questionText: { [Op.like]: '%necrotroph%' } },
          { answerText: { [Op.like]: '%necrotroph%' } }
        ]
      }
    });
    console.log(`Found ${questions.length} matching questions:`);
    questions.forEach(q => {
      console.log(`- ID: ${q.id}`);
      console.log(`  Question: "${q.questionText}"`);
      console.log(`  Answer length: ${q.answerText.length}`);
      console.log(`  Answer Text (first 200 chars):\n${q.answerText.substring(0, 200)}...\n`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
