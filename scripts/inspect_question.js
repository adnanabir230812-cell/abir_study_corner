const { Question } = require('../models');

(async () => {
  try {
    const q = await Question.findOne({
      where: {
        questionText: {
          [require('sequelize').Op.like]: '%necrotrophic parasite%'
        }
      }
    });
    if (q) {
      console.log('ID:', q.id);
      console.log('Question:', q.questionText);
      console.log('Answer Text:\n', JSON.stringify(q.answerText));
    } else {
      console.log('Not found');
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
