const fs = require('fs');
const path = require('path');

const db = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'database.json'), 'utf8'));
const pathology = db.courses.find(c => c.id === 1);
const secA = pathology.Sections.find(s => s.name === 'Section A');

function getTags(q) {
  const tags = [];
  const rx = /\[([^\]]+)\]/g;
  let match;
  while ((match = rx.exec(q.questionText)) !== null) {
    tags.push(match[1]);
  }
  return tags;
}

const topicsList = [
  { name: 'Introduction & Pathogenicity', id: 40 },
  { name: 'Pathogenesis & Direct Penetration', id: 41 },
  { name: 'Toxins in Disease Development', id: 42 },
  { name: 'Pathophysiology', id: 43 },
  { name: 'Dissemination of Pathogens', id: 44 },
  { name: 'Epidemiology & Disease Triangle', id: 45 },
  { name: 'Principles of Disease Control', id: 46 }
];

topicsList.forEach(topicInfo => {
  const topic = secA.Topics.find(t => t.id === topicInfo.id);
  console.log(`\n=== Topic: ${topic.name} ===`);
  
  const counts = {};
  
  topic.Questions.forEach(q => {
    const text = q.questionText.toLowerCase();
    let keys = [];
    
    // Topic 40: Introduction & Pathogenicity
    if (topicInfo.id === 40) {
      if (text.includes('kochs') || text.includes('koch\'s') || text.includes('postulates')) {
        keys.push("Koch's Postulates");
      }
      if (text.includes('biotroph') || text.includes('necrotroph') || text.includes('facultative')) {
        keys.push("Biotrophs, Necrotrophs & Hemibiotrophs");
      }
      if (text.includes('pathogenicity') || text.includes('pathogenesis') || text.includes('disease') || text.includes('infection court')) {
        keys.push("Definitions & Terms (Pathogenicity, Infection Court)");
      }
      if (keys.length === 0) keys.push("General Intro Concepts");
    }
    
    // Topic 41: Pathogenesis & Direct Penetration
    if (topicInfo.id === 41) {
      if (text.includes('stomata') || text.includes('lenticel') || text.includes('natural') || text.includes('opening') || text.includes('hydathode')) {
        keys.push("Indirect Penetration (Natural Openings/Wounds)");
      } else if (text.includes('direct') && (text.includes('indirect') || text.includes('compare') || text.includes('natural'))) {
        keys.push("Direct vs Indirect Penetration");
      } else if (text.includes('direct') || text.includes('appressorium') || text.includes('penetration peg')) {
        keys.push("Direct Penetration Mechanical/Chemical");
      }
      if (text.includes('pre-penetration') || text.includes('germination') || text.includes('spore')) {
        keys.push("Pre-penetration Activity / Spore Germination");
      }
      if (keys.length === 0) keys.push("General Pathogenesis");
    }
    
    // Topic 42: Toxins in Disease Development
    if (topicInfo.id === 42) {
      if (text.includes('host-specific') && text.includes('non-specific') || text.includes('compare') || text.includes('distinguish') || text.includes('difference')) {
        keys.push("Host-Specific vs Non-Specific Toxins");
      }
      if (text.includes('tentoxin') || text.includes('tabtoxin') || text.includes('wildfire') || text.includes('phaseolotoxin')) {
        keys.push("Non-Specific Toxins (Tentoxin, Tabtoxin)");
      }
      if (text.includes('victorin') || text.includes('hv-toxin') || text.includes('t-toxin')) {
        keys.push("Host-Specific Toxins (Victorin, HMT Toxin)");
      }
      if (keys.length === 0) keys.push("General Toxins");
    }
    
    // Topic 43: Pathophysiology
    if (topicInfo.id === 43) {
      if (text.includes('respiration')) {
        keys.push("Effect on Respiration");
      }
      if (text.includes('photosynthesis') || text.includes('chlorophyll') || text.includes('chloroplast')) {
        keys.push("Effect on Photosynthesis");
      }
      if (text.includes('translocation') || text.includes('water') || text.includes('wilt')) {
        keys.push("Translocation & Water Relations");
      }
      if (keys.length === 0) keys.push("General Pathophysiology");
    }
    
    // Topic 44: Dissemination of Pathogens
    if (topicInfo.id === 44) {
      if (text.includes('wind') || text.includes('air') || text.includes('anemochory')) {
        keys.push("Dissemination by Wind");
      }
      if (text.includes('water') || text.includes('rain') || text.includes('hydrochory')) {
        keys.push("Dissemination by Water");
      }
      if (text.includes('vector') || text.includes('insect') || text.includes('zoochory')) {
        keys.push("Dissemination by Vectors/Insects");
      }
      if (keys.length === 0 || text.includes('passive') || text.includes('autonomous') || text.includes('active')) {
        keys.push("Passive/Active Dissemination Methods");
      }
    }
    
    // Topic 45: Epidemiology & Disease Triangle
    if (topicInfo.id === 45) {
      if (text.includes('triangle') || text.includes('tetrahedron')) {
        keys.push("Disease Triangle & Tetrahedron");
      }
      if (text.includes('epiphytotics') || text.includes('epiphytotic') || text.includes('epidemic') || text.includes('development') || text.includes('factors')) {
        keys.push("Epiphytotic Development Factors");
      }
      if (text.includes('forecasting') || text.includes('forecast')) {
        keys.push("Disease Forecasting");
      }
      if (keys.length === 0) keys.push("General Epidemiology");
    }
    
    // Topic 46: Principles of Disease Control
    if (topicInfo.id === 46) {
      if (text.includes('exclusion') || text.includes('quarantine') || text.includes('legislative') || text.includes('regulatory')) {
        keys.push("Exclusion (Quarantine & Regulations)");
      }
      if (text.includes('eradication') || text.includes('sanitation') || text.includes('rotation') || text.includes('physical')) {
        keys.push("Eradication (Sanitation, Crop Rotation, Physical Control)");
      }
      if (text.includes('protection') || text.includes('chemical') || text.includes('fungicide') || text.includes('spray')) {
        keys.push("Protection (Chemical Barriers, Fungicides)");
      }
      if (text.includes('immuniz') || text.includes('resistance') || text.includes('genetic') || text.includes('systemic acquired')) {
        keys.push("Immunization & Host Resistance (SAR, Breeding)");
      }
      if (keys.length === 0) keys.push("General Principles / Integrated Management");
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
    .forEach(([subTopic, data]) => {
      console.log(`  - ${subTopic}: Asked ${data.count} times (Appeared in: ${data.papers.join(', ')})`);
    });
});
