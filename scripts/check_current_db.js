const { sequelize, Topic, Question, Progress, Section, Course } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    
    const sections = await Section.findAll({ include: [Course] });
    console.log('\n=== SECTIONS ===');
    sections.forEach(s => {
      console.log(`  Section ID: ${s.id} | ${s.Course.name} - ${s.name} (${s.teacherName})`);
    });

    const topics = await Topic.findAll({
      include: [{ model: Question, include: [Progress] }]
    });
    
    console.log('\n=== TOPICS & QUESTIONS ===');
    topics.forEach(t => {
      console.log(`\nTopic ID: ${t.id} | "${t.name}" | sectionId: ${t.sectionId}`);
      t.Questions.forEach(q => {
        const solved = q.Progress ? q.Progress.solved : 'N/A';
        console.log(`  Q${q.id}: ${q.questionText.substring(0, 80)}... | solved: ${solved}`);
      });
    });

    console.log(`\nTotal Topics: ${topics.length}`);
    console.log(`Total Questions: ${topics.reduce((acc, t) => acc + t.Questions.length, 0)}`);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
