const { Course, Section, Topic } = require('../models');

(async () => {
  try {
    console.log('Standardizing names for Course ID 7 and Section ID 12...');

    // 1. Course 7 Name Check
    const course = await Course.findByPk(7);
    if (course) {
      course.name = 'Agricultural Extension';
      course.code = 'AT-3205';
      await course.save();
      console.log(`- Confirmed Course ID 7 is named "${course.name}" (Code: "${course.code}")`);
    }

    // 2. Rename Section 12
    const sections = await Section.findAll({ where: { courseId: 7 } });
    for (const s of sections) {
      s.name = s.name.replace(/Extension/g, 'Agricultural Extension');
      await s.save();
      console.log(`- Standardized Section [ID ${s.id}] to "${s.name}"`);
    }

    // 3. Rename Topics of Section 12
    const topics = await Topic.findAll({ where: { sectionId: 12 } });
    for (const t of topics) {
      if (t.name.includes('Extension') && !t.name.includes('Agricultural Extension')) {
        const oldName = t.name;
        t.name = t.name.replace(/Extension/g, 'Agricultural Extension');
        await t.save();
        console.log(`- Standardized Topic [ID ${t.id}] to "${t.name}"`);
      }
    }

    console.log('Standardization complete!');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
