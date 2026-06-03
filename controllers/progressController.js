const { Question, Topic, Progress, Section } = require('../models');

exports.updateProgress = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { solved } = req.body;

    const question = await Question.findByPk(questionId, {
      include: {
        model: Topic,
        include: [Section]
      }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const sectionId = question.Topic.sectionId;

    // Find or create Progress row
    let progressRow = await Progress.findOne({ where: { questionId } });
    if (!progressRow) {
      progressRow = await Progress.create({
        questionId,
        solved: solved || false,
        solvedDate: solved ? new Date() : null
      });
    } else {
      progressRow.solved = solved || false;
      progressRow.solvedDate = solved ? new Date() : null;
      await progressRow.save();
    }

    // Recalculate section-level progress metrics
    const topics = await Topic.findAll({
      where: { sectionId },
      include: [
        {
          model: Question,
          include: [Progress]
        }
      ]
    });

    let totalCount = 0;
    let solvedCount = 0;

    topics.forEach(topic => {
      topic.Questions.forEach(q => {
        totalCount++;
        if (q.Progress && q.Progress.solved) {
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
