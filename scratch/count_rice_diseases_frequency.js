const fs = require('fs');
const path = require('path');

const db = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'database.json'), 'utf8'));
const pathology = db.courses.find(c => c.id === 1);
const riceTopic = pathology.Sections.find(s => s.name === 'Section B').Topics.find(t => t.name === 'Rice Diseases');

const diseaseCounts = {};

// Helper to classify which disease the question is about
function classify(text) {
  const t = text.toLowerCase();
  const diseases = [];
  if (t.includes('blast')) diseases.push('Blast of Rice');
  if (t.includes('brown spot')) diseases.push('Brown Spot');
  if (t.includes('bacterial leaf blight') || t.includes('blb') || t.includes('kresek')) diseases.push('Bacterial Leaf Blight (BLB)');
  if (t.includes('stem rot')) diseases.push('Stem Rot');
  if (t.includes('bakanae')) diseases.push('Bakanae');
  if (t.includes('ufra') || t.includes('nemic') || t.includes('nematode')) diseases.push('Nematode / Ufra');
  if (t.includes('tungro')) diseases.push('Tungro');
  if (t.includes('sheath blight')) diseases.push('Sheath Blight');
  if (t.includes('false smut')) diseases.push('False Smut');
  
  if (diseases.length === 0) {
    if (t.includes('major diseases') || t.includes('rice diseases') || t.includes('list')) {
      return ['General Lists'];
    }
    return ['Others'];
  }
  return diseases;
}

riceTopic.Questions.forEach(q => {
  // Extract paper/session tags
  const tags = [];
  const rx = /\[([^\]]+)\]/g;
  let match;
  while ((match = rx.exec(q.questionText)) !== null) {
    tags.push(match[1]);
  }
  
  const diseases = classify(q.questionText);
  diseases.forEach(d => {
    if (!diseaseCounts[d]) {
      diseaseCounts[d] = {
        count: 0,
        papers: []
      };
    }
    diseaseCounts[d].count++;
    tags.forEach(tagGroup => {
      const parts = tagGroup.split(/[,;]/);
      parts.forEach(p => {
        const cleaned = p.trim();
        if (cleaned && !cleaned.toLowerCase().includes('repeated') && !diseaseCounts[d].papers.includes(cleaned)) {
          diseaseCounts[d].papers.push(cleaned);
        }
      });
    });
  });
});

console.log('=== Rice Diseases Question Frequency ===');
Object.entries(diseaseCounts)
  .sort((a, b) => b[1].count - a[1].count)
  .forEach(([disease, data]) => {
    console.log(`- ${disease}:`);
    console.log(`  Frequency: Asked ${data.count} times`);
    console.log(`  Appeared in: ${data.papers.length > 0 ? data.papers.join(', ') : 'No specific session tag'}`);
  });
