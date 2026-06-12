const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

function cleanAndNormalize(text) {
  // Strip any brackets globally, e.g. [Paper 1] or [Session 2023-24] or [✦ Repeated ×2]
  let cleaned = text.replace(/\[[^\]]+\]/g, '').trim();
  // Remove extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Normalize for comparison
  const normalized = cleaned.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
  
  return { cleaned, normalized };
}

// Group by course and normalized text
db.courses.forEach(course => {
  console.log(`\n=== Course: ${course.name} ===`);
  const duplicateGroups = {};
  
  course.Sections.forEach(sec => {
    sec.Topics.forEach(topic => {
      topic.Questions.forEach(q => {
        const { cleaned, normalized } = cleanAndNormalize(q.questionText);
        // Include section ID to group within section
        const key = `${sec.name}_${normalized}`;
        if (!duplicateGroups[key]) {
          duplicateGroups[key] = [];
        }
        duplicateGroups[key].push({
          id: q.id,
          original: q.questionText,
          cleaned,
          topic: topic.name,
          section: sec.name,
          qObj: q
        });
      });
    });
  });

  let dupCount = 0;
  Object.entries(duplicateGroups).forEach(([key, items]) => {
    if (items.length > 1) {
      dupCount++;
      console.log(`Group ${dupCount} (Section: ${items[0].section}, Topic: ${items[0].topic}):`);
      items.forEach(item => {
        console.log(`  - [ID: ${item.id}]: "${item.original}"`);
      });
    }
  });
});
