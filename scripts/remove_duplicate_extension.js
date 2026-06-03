const { Course, Section, Topic } = require('../models');

(async () => {
  try {
    console.log('Resolving duplicate extension courses...');

    // 1. Delete Course ID 5 (old duplicate "Extension")
    const oldCourse = await Course.findByPk(5);
    if (oldCourse) {
      // Find associated sections
      const oldSections = await Section.findAll({ where: { courseId: 5 } });
      for (const sec of oldSections) {
        // Find associated topics
        const oldTopics = await Topic.findAll({ where: { sectionId: sec.id } });
        for (const top of oldTopics) {
          await top.destroy();
        }
        await sec.destroy();
      }
      await oldCourse.destroy();
      console.log('- Successfully deleted old duplicate Course ID 5 and its associations.');
    } else {
      console.log('- Old duplicate Course ID 5 not found or already deleted.');
    }

    // 2. Rename Course ID 6 to "Agricultural Extension"
    const newCourse = await Course.findByPk(6);
    if (newCourse) {
      newCourse.name = 'Agricultural Extension';
      newCourse.code = 'AT-3205';
      await newCourse.save();
      console.log(`- Renamed Course ID 6 to "${newCourse.name}" (Code: "${newCourse.code}")`);
    } else {
      console.log('- Course ID 6 not found.');
    }

    // 3. Rename associated Sections of Course 6
    const sections = await Section.findAll({ where: { courseId: 6 } });
    for (const s of sections) {
      const oldName = s.name;
      s.name = s.name.replace(/Extension/g, 'Agricultural Extension');
      await s.save();
      console.log(`- Renamed Section [ID ${s.id}] to "${s.name}"`);
    }

    // 4. Rename associated Topics of Section 11 (associated with Course 6)
    const topics = await Topic.findAll({ where: { sectionId: 11 } });
    for (const t of topics) {
      if (t.name.includes('Extension') && !t.name.includes('Agricultural Extension')) {
        const oldName = t.name;
        t.name = t.name.replace(/Extension/g, 'Agricultural Extension');
        await t.save();
        console.log(`- Renamed Topic [ID ${t.id}] to "${t.name}"`);
      }
    }

    console.log('Standardization complete!');
  } catch (err) {
    console.error('Error standardizing courses:', err);
  } finally {
    process.exit(0);
  }
})();
