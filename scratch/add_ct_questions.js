const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const course = db.courses.find(c => c.id === 2);
if (!course) {
  console.error('Course 2 not found');
  process.exit(1);
}

const sectionB = course.Sections.find(s => s.name === 'Section B');
if (!sectionB) {
  console.error('Section B not found');
  process.exit(1);
}

// Find topics
const topicAgrochemicals = sectionB.Topics.find(t => t.id === 123); // Agricultural Pollution & Agrochemicals
const topicAirPollution = sectionB.Topics.find(t => t.id === 119);   // Air Pollution

if (!topicAgrochemicals || !topicAirPollution) {
  console.error('Topics not found');
  process.exit(1);
}

// New questions
const q1 = {
  id: 1095,
  topicId: 123,
  questionText: "Briefly describe the effects of agrochemicals on ecosystem.  [10]  (Class Test)",
  answerText: `Once applied, pesticides as well as fertilizers do not disappear completely: some are absorbed by the plants, while the rest must be processed by the environment. This leads to several detrimental effects on the ecosystem:
* **Water Pollution**: Soluble fertilizers (nitrates and phosphates) and pesticides are washed into nearby water bodies via surface runoff, leading to eutrophication (rapid algal blooms) which depletes dissolved oxygen (DO) and suffocates aquatic life.
* **Groundwater Contamination**: Nitrates and chemical residues leach through the soil profile into groundwater reservoirs, contaminating drinking water sources and causing health hazards (e.g., methemoglobinemia or blue baby syndrome).
* **Soil Degradation**: Excessive use of agrochemicals leads to the accumulation of heavy metals (such as arsenic, cadmium, mercury, and lead) in the soil. This taints crop resources and disrupts beneficial soil microflora (bacteria, fungi) and fauna.
* **Biomagnification**: Non-biodegradable pesticide residues enter food chains and progressively increase in concentration at higher trophic levels (bioaccumulation), causing severe toxicity in birds, animals, and humans.
* **Air Pollution & Climate Change**: Production and application of chemical fertilizers release greenhouse gases (such as nitrous oxide), contributing to global warming and climate change.`
};

const q2 = {
  id: 1096,
  topicId: 119,
  questionText: "Enlist the sources of air pollution. How can you mitigate the adverse effect of environmental pollution?  [10]  (Class Test)",
  answerText: `### Sources of Air Pollution
* **Natural Sources**: Volcanic eruptions, forest fires, dust storms, and cosmic rays.
* **Anthropogenic Sources**:
  * **Domestic**: Space heating (releasing CO, CO2, NOx, SOx, soot) and cooking (fats, particles, odors).
  * **Commercial**: Service industries e.g., dry cleaning, printing, painting, hotels, and restaurants.
  * **Agricultural**: Animal feeding operations, cotton dust during harvesting, and pesticide/insecticide spraying.
  * **Industrial**: Chemical fertilizer manufacturing (releasing NOx), paper plants, oil refineries, synthetic fibers manufacturing (H2S), and metallurgical processes (CO).
  * **Transportation**: Vehicles emit volatile organic compounds (VOCs), nitrogen oxides, lead, and carbon monoxide.

### Mitigation of Environmental Pollution
* **Industrial Control**:
  * Siting of industries away from residential areas after proper Environmental Impact Assessment (EIA) studies.
  * Mandating air pollution control equipment such as electrostatic precipitators, cyclone separators, bag-house filters, and scrubbers on industrial chimneys.
  * Establishing municipal and industrial wastewater treatment plants to reduce BOD and COD levels before discharge.
* **Agricultural Mitigation**:
  * Practicing Judicious Agrochemical Application: Applying fertilizers and pesticides based on soil tests to minimize runoff.
  * Adopting Integrated Pest Management (IPM) to reduce chemical pesticide dependency.
  * Planting buffer strips of trees and grass near water courses to filter chemical runoff.
* **Vehicular Mitigation**:
  * Shifting to cleaner fuels (e.g., CNG, hydrogen gas, electric vehicles).
  * Regular vehicle emission testing and engine tuning.
  * Installing catalytic converters on exhaust systems.
* **General Measures**:
  * Promoting massive afforestation (planting trees) to absorb gaseous pollutants.
  * Utilizing non-conventional, renewable energy sources (solar, wind).
  * Adopting waste recycling and proper hazardous waste management.`
};

// Check if already added to avoid duplicates
if (!topicAgrochemicals.Questions.some(q => q.id === 1095)) {
  topicAgrochemicals.Questions.push(q1);
  console.log('Added Q1095 to Topic 123');
} else {
  console.log('Q1095 already exists in Topic 123');
}

if (!topicAirPollution.Questions.some(q => q.id === 1096)) {
  topicAirPollution.Questions.push(q2);
  console.log('Added Q1096 to Topic 119');
} else {
  console.log('Q1096 already exists in Topic 119');
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('database.json updated successfully!');
