const fs = require('fs');
const path = require('path');
const { sequelize, Course, Section, Topic, Question, Note, Exam } = require('../models');

(async () => {
  try {
    console.log('Loading database models...');
    await sequelize.authenticate();

    console.log('Fetching courses...');
    const coursesRaw = await Course.findAll({
      include: [
        {
          model: Section,
          include: [
            {
              model: Topic,
              include: [
                {
                  model: Question
                }
              ]
            },
            {
              model: Note
            }
          ]
        }
      ]
    });

    console.log('Fetching exams...');
    const examsRaw = await Exam.findAll({
      order: [['examDate', 'ASC']]
    });

    // Structure data cleanly
    const courses = coursesRaw.map(c => {
      const courseJson = c.toJSON();
      return {
        id: courseJson.id,
        name: courseJson.name,
        code: courseJson.code,
        Sections: courseJson.Sections.map(s => ({
          id: s.id,
          courseId: s.courseId,
          name: s.name,
          teacherName: s.teacherName,
          Note: s.Note ? {
            id: s.Note.id,
            sectionId: s.Note.sectionId,
            content: s.Note.content,
            imageRefs: s.Note.imageRefs
          } : null,
          Topics: s.Topics.map(t => ({
            id: t.id,
            sectionId: t.sectionId,
            name: t.name,
            Questions: t.Questions.map(q => ({
              id: q.id,
              topicId: q.topicId,
              questionText: q.questionText,
              answerText: q.answerText
            }))
          }))
        }))
      };
    });

    const exams = examsRaw.map(e => {
      const examJson = e.toJSON();
      return {
        id: examJson.id,
        subjectName: examJson.subjectName,
        examDate: examJson.examDate
      };
    });

    const exportData = {
      courses,
      exams
    };

    const targetPath = path.join(__dirname, '..', 'database.json');
    fs.writeFileSync(targetPath, JSON.stringify(exportData, null, 2), 'utf8');
    console.log(`Successfully exported SQLite database to ${targetPath}`);

  } catch (err) {
    console.error('Failed to export database:', err);
  } finally {
    process.exit(0);
  }
})();
