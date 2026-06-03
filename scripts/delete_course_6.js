const { Course, Section, Topic } = require('../models');

(async () => {
  try {
    console.log('Deleting Course ID 6 and all its associated sections/topics/questions...');
    const course = await Course.findByPk(6);
    if (course) {
      const sections = await Section.findAll({ where: { courseId: 6 } });
      for (const sec of sections) {
        const topics = await Topic.findAll({ where: { sectionId: sec.id } });
        for (const top of topics) {
          await top.destroy(); // Cascade deletes associated questions via foreign key constraint or manually if needed
        }
        await sec.destroy();
      }
      await course.destroy();
      console.log('Successfully deleted Course ID 6.');
    } else {
      console.log('Course ID 6 not found.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
