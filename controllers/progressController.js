const { Question, Topic } = require('../models');

exports.updateProgress = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { solved } = req.body;
    const qId = parseInt(questionId, 10);

    const question = await Question.findByPk(qId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const sectionId = question.Topic.sectionId;

    // Retrieve current solved list from cookie
    let solvedIds = [];
    if (req.headers.cookie) {
      const match = req.headers.cookie.match(/solved_questions=([^;]+)/);
      if (match) {
        try {
          solvedIds = JSON.parse(decodeURIComponent(match[1]));
        } catch (e) {}
      }
    }

    // Update list
    if (solved) {
      if (!solvedIds.includes(qId)) {
        solvedIds.push(qId);
      }
    } else {
      solvedIds = solvedIds.filter(id => id !== qId);
    }

    // Set updated cookie for 1 year
    res.cookie('solved_questions', JSON.stringify(solvedIds), {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    // Recalculate section-level progress metrics
    const topics = await Topic.findAll({ where: { sectionId } });

    let totalCount = 0;
    let solvedCount = 0;

    topics.forEach(topic => {
      topic.Questions.forEach(q => {
        totalCount++;
        if (solvedIds.includes(q.id)) {
          solvedCount++;
        }
      });
    });

    const percentage = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

    res.json({
      success: true,
      progress: {
        solvedCount,
        totalCount,
        percentage,
        count: totalCount
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
};
