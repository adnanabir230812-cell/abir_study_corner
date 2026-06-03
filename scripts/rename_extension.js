const { Course, Section, Topic } = require('../models');

(async () => {
  try {
    console.log('Renaming course/section/topic names from "Extension" to "Agricultural Extension"...');

    // 1. Rename Course
    const courses = await Course.findAll();
    for (const c of courses) {
      if (c.name.toLowerCase() === 'extension') {
        const oldName = c.name;
        c.name = 'Agricultural Extension';
        await c.save();
        console.log(`- Renamed Course [ID ${c.id}] from "${oldName}" to "${c.name}"`);
      }
    }

    // 2. Rename Section
    const sections = await Section.findAll();
    for (const s of sections) {
      if (s.name.toLowerCase().includes('extension') && !s.name.toLowerCase().includes('agricultural extension')) {
        const oldName = s.name;
        // Replace "Extension" or "extension" with "Agricultural Extension"
        s.name = s.name.replace(/extension/ig, 'Agricultural Extension');
        await s.save();
        console.log(`- Renamed Section [ID ${s.id}] from "${oldName}" to "${s.name}"`);
      }
    }

    // 3. Rename Topics
    const topics = await Topic.findAll();
    for (const t of topics) {
      if (t.name.toLowerCase().includes('extension') && !t.name.toLowerCase().includes('agricultural extension')) {
        const oldName = t.name;
        t.name = t.name.replace(/extension/ig, 'Agricultural Extension');
        await t.save();
        console.log(`- Renamed Topic [ID ${t.id}] from "${oldName}" to "${t.name}"`);
      }
    }

    console.log('Renaming complete! All names standardized successfully.');
  } catch (err) {
    console.error('Error during renaming:', err);
  } finally {
    process.exit(0);
  }
})();
