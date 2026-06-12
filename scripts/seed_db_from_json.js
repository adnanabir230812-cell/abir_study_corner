const fs = require('fs');
const path = require('path');
const { sequelize, Course, Section, Topic, Question, Note, Exam, Progress } = require('../models');

(async () => {
  try {
    console.log('Loading database.json...');
    const dbPath = path.join(__dirname, '..', 'database.json');
    if (!fs.existsSync(dbPath)) {
      console.error('database.json not found!');
      process.exit(1);
    }
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    console.log('Force-syncing SQLite database (dropping existing tables)...');
    await sequelize.sync({ force: true });
    console.log('SQLite database reset.');

    // 1. Seed Exams
    if (dbData.exams) {
      console.log(`Seeding ${dbData.exams.length} exams...`);
      for (const e of dbData.exams) {
        await Exam.create({
          id: e.id,
          subjectName: e.subjectName,
          examDate: new Date(e.examDate)
        });
      }
    }

    // 2. Seed Courses, Sections, Notes, Topics, Questions
    if (dbData.courses) {
      console.log(`Seeding ${dbData.courses.length} courses...`);
      for (const c of dbData.courses) {
        const course = await Course.create({
          id: c.id,
          name: c.name,
          code: c.code
        });

        if (c.Sections) {
          for (const s of c.Sections) {
            const section = await Section.create({
              id: s.id,
              courseId: course.id,
              name: s.name,
              teacherName: s.teacherName
            });

            // Seed Note for Section
            if (s.Note) {
              await Note.create({
                id: s.Note.id,
                sectionId: section.id,
                content: s.Note.content,
                imageRefs: s.Note.imageRefs || []
              });
            }

            // Seed Topics and Questions
            if (s.Topics) {
              for (const t of s.Topics) {
                const topic = await Topic.create({
                  id: t.id,
                  sectionId: section.id,
                  name: t.name
                });

                if (t.Questions) {
                  for (const q of t.Questions) {
                    const question = await Question.create({
                      id: q.id,
                      topicId: topic.id,
                      questionText: q.questionText,
                      answerText: q.answerText
                    });

                    // Create progress entry
                    await Progress.create({
                      questionId: question.id,
                      solved: false
                    });
                  }
                }
              }
            }
          }
        }
      }
    }

    console.log('Successfully seeded SQLite database from database.json!');

  } catch (err) {
    console.error('Failed to seed database from JSON:', err);
  } finally {
    process.exit(0);
  }
})();
