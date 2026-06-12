const fs = require('fs');
const path = require('path');

const files = [
  'ecosystems_slides_text.md',
  'productivity_slides_text.md',
  'food_chain_slides_text.md',
  'agro_ecosystem_slides_text.md',
  'crop_association_slides_text.md',
  'pollution_slides_text.md',
  'vegetations_slides_text.md'
];

files.forEach(f => {
  const filePath = path.join(__dirname, '..', 'scratch', f);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.toLowerCase().includes('bioremediation') || content.toLowerCase().includes('ameliorator')) {
      console.log(`Found in: ${f}`);
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.toLowerCase().includes('bioremediation') || line.toLowerCase().includes('ameliorator')) {
          console.log(`  Line ${idx + 1}: ${line}`);
        }
      });
    }
  }
});
