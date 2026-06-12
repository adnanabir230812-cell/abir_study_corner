const fs = require('fs');
const path = require('path');

const db = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'database.json'), 'utf8'));
const pathology = db.courses.find(c => c.id === 1);
const secB = pathology.Sections.find(s => s.name === 'Section B');

function getTags(q) {
  const tags = [];
  const rx = /\[([^\]]+)\]/g;
  let match;
  while ((match = rx.exec(q.questionText)) !== null) {
    tags.push(match[1]);
  }
  return tags;
}

const cropTopics = [
  { name: 'Wheat & Barley Diseases', id: 48 },
  { name: 'Sugarcane Diseases', id: 49 },
  { name: 'Jute & Cotton Diseases', id: 50 },
  { name: 'Pulse & Oilseed Diseases', id: 51 }
];

cropTopics.forEach(topicInfo => {
  const topic = secB.Topics.find(t => t.id === topicInfo.id);
  console.log(`\n=== Topic: ${topic.name} ===`);
  
  const counts = {};
  
  topic.Questions.forEach(q => {
    const text = q.questionText.toLowerCase();
    let keys = [];
    
    // Wheat classification
    if (topicInfo.id === 48) {
      if (text.includes('loose smut') && text.includes('covered smut')) {
        keys.push('Loose Smut vs Covered Smut');
      } else if (text.includes('loose smut')) {
        keys.push('Loose Smut of Wheat');
      } else if (text.includes('covered smut')) {
        keys.push('Covered Smut of Barley');
      } else if (text.includes('smut')) {
        keys.push('Loose & Covered Smut (General)');
      }
      if (text.includes('bipolaris') || text.includes('blotch')) {
        keys.push('Bipolaris Spot/Blotch');
      }
      if (text.includes('rust') || text.includes('puccinia') || text.includes('barberry')) {
        keys.push('Black/Stem Rust of Wheat');
      }
      if (text.includes('sheath blight')) {
        keys.push('Sheath Blight / Mustard Brown Spot');
      }
      if (text.includes('list') || text.includes('four diseases') || text.includes('six diseases')) {
        keys.push('General Lists');
      }
    }
    
    // Sugarcane classification
    if (topicInfo.id === 49) {
      if (text.includes('red rot') && text.includes('smut')) {
        keys.push('Red Rot & Smut of Sugarcane');
      } else if (text.includes('red rot')) {
        keys.push('Red Rot of Sugarcane');
      } else if (text.includes('smut')) {
        keys.push('Smut of Sugarcane');
      }
      if (text.includes('mosaic') || text.includes('mungbean')) {
        keys.push('Mosaic of Sugarcane / Mungbean');
      }
      if (keys.length === 0) keys.push('Others');
    }
    
    // Jute & Cotton classification
    if (topicInfo.id === 50) {
      if (text.includes('stem rot') && text.includes('black band')) {
        keys.push('Jute Stem Rot vs Black Band');
      } else if (text.includes('stem rot')) {
        keys.push('Jute Stem Rot');
      } else if (text.includes('black band')) {
        keys.push('Black Band of Jute');
      }
      if (text.includes('anthracnose')) {
        keys.push('Anthracnose of Jute');
      }
      if (text.includes('angular') || text.includes('cotton') || text.includes('disseminate')) {
        keys.push('Angular Leaf Spot of Cotton');
      }
      if (keys.length === 0) keys.push('Others');
    }
    
    // Pulse & Oilseed classification
    if (topicInfo.id === 51) {
      if (text.includes('tikka') || text.includes('groundnut')) {
        keys.push('Tikka of Groundnut');
      }
      if (text.includes('alternaria') || text.includes('mustard') || text.includes('blight')) {
        keys.push('Alternaria Blight of Mustard');
      }
      if (text.includes('mungbean') || text.includes('mosaic')) {
        keys.push('Mungbean Mosaic');
      }
      if (text.includes('sunflower') || text.includes('leaf spot')) {
        keys.push('Sunflower Leaf Spot');
      }
      if (keys.length === 0) keys.push('Others');
    }
    
    const tags = getTags(q);
    
    keys.forEach(k => {
      if (!counts[k]) {
        counts[k] = { count: 0, papers: [] };
      }
      counts[k].count++;
      tags.forEach(tagGroup => {
        const parts = tagGroup.split(/[,;]/);
        parts.forEach(p => {
          const cleaned = p.trim();
          if (cleaned && !cleaned.toLowerCase().includes('repeated') && !counts[k].papers.includes(cleaned)) {
            counts[k].papers.push(cleaned);
          }
        });
      });
    });
  });
  
  Object.entries(counts)
    .sort((a, b) => b[1].count - a[1].count)
    .forEach(([disease, data]) => {
      console.log(`  - ${disease}: Asked ${data.count} times (Appeared in: ${data.papers.join(', ')})`);
    });
});
