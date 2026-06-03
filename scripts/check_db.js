const { sequelize, Course, Section, Topic, Question, Progress } = require('../models');

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    
    const courses = await Course.findAll({
      include: [{
        model: Section,
        include: [{
          model: Topic,
          include: [Question]
        }]
      }]
    });

    console.log('=== Database Status ===');
    for (const course of courses) {
      console.log(`Course: ${course.name} (${course.code})`);
      for (const sec of course.Sections) {
        let questionCount = 0;
        for (const topic of sec.Topics) {
          questionCount += topic.Questions.length;
        }
        console.log(`  - ${sec.name} (${sec.teacherName}): ${questionCount} questions`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
