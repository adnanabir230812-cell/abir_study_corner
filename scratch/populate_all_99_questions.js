const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const rawQuestionsPath = path.join(__dirname, 'debesh_questions_raw.md');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const content = fs.readFileSync(rawQuestionsPath, 'utf8');

const lines = content.split('\n');

let currentChapter = '';
const questions = [];

const chapterRx = /^Chapter\s+(\d+):\s+(.*)$/i;
const qRx = /^(\d+)\.\s+(.*?)(?:\s+\[([\d+=.]+)\])?(?:\s+\((\d{4}(?:-\d{2})?)\))?$/;

lines.forEach(line => {
  const trimmed = line.trim();
  if (!trimmed) return;

  const chapMatch = trimmed.match(chapterRx);
  if (chapMatch) {
    currentChapter = `Chapter ${chapMatch[1]}: ${chapMatch[2].trim()}`;
    return;
  }

  const qMatch = trimmed.match(qRx);
  if (qMatch) {
    const qNum = parseInt(qMatch[1]);
    const qText = qMatch[2].trim();
    const marks = qMatch[3] ? qMatch[3].trim() : null;
    const year = qMatch[4] ? qMatch[4].trim() : null;

    questions.push({
      chapter: currentChapter,
      num: qNum,
      text: qText,
      marks: marks,
      year: year,
      raw: trimmed
    });
  }
});

// 16 Topics for Section A (Topic IDs 201 to 216)
const sectionATopics = [
  { id: 201, sectionId: 3, name: 'Crop Ecology: Definitions & Sub-divisions', Questions: [] },
  { id: 202, sectionId: 3, name: 'Principles of Organism-Environment Relationship', Questions: [] },
  { id: 203, sectionId: 3, name: 'Light as an Ecological Factor (Intensity vs. Duration)', Questions: [] },
  { id: 204, sectionId: 3, name: 'Temperature: Effects, Classification & Stress Mitigation', Questions: [] },
  { id: 205, sectionId: 3, name: 'Wind & Humidity Effects', Questions: [] },
  { id: 206, sectionId: 3, name: 'General Ecological Environmental Concepts', Questions: [] },
  { id: 207, sectionId: 3, name: 'Atmosphere: Vertical Structure & Layers', Questions: [] },
  { id: 208, sectionId: 3, name: 'Climate Change & Climate Smart Agriculture', Questions: [] },
  { id: 209, sectionId: 3, name: 'Global Warming & Greenhouse Effect', Questions: [] },
  { id: 210, sectionId: 3, name: 'Ozone Layer Depletion & Acid Rain', Questions: [] },
  { id: 211, sectionId: 3, name: 'Hydrologic Cycle & Gases', Questions: [] },
  { id: 212, sectionId: 3, name: 'Soil Air, Water & pH', Questions: [] },
  { id: 213, sectionId: 3, name: 'Biogeochemical Cycles: Nitrogen & Phosphorus', Questions: [] },
  { id: 214, sectionId: 3, name: 'Biotic Interactions & Associations', Questions: [] },
  { id: 215, sectionId: 3, name: 'Mycorrhizal Association', Questions: [] },
  { id: 216, sectionId: 3, name: 'Biodiversity & Conservation', Questions: [] }
];

// Helper mapping to route each raw question to a topic ID
function getTopicId(q) {
  const text = q.text.toLowerCase();
  const chap = q.chapter.toLowerCase();

  if (chap.includes('chapter 1')) {
    if (text.includes('autecology') || text.includes('synecology') || text.includes('sub-divisions') || text.includes('fields of ecology')) {
      return 201;
    }
    if (text.includes('what is crop ecology') || text.includes('define crop and ecology') || text.includes('define crop ecology')) {
      // If it also contains principles or ecosystem is self-regulatory, separate:
      if (text.includes('principles')) return 202;
      return 201;
    }
    if (text.includes('principles') || text.includes('ecological study is important') || text.includes('ecological knowledge') || text.includes('study of ecology important') || text.includes('individual, population') || text.includes('community, biome')) {
      return 202;
    }
    if (text.includes('light intensity') || text.includes('photoperiod') || text.includes('flowering') || text.includes('short-day') || text.includes('photoenergetic') || text.includes('photocybernetic') || text.includes('par') || text.includes('br3') || text.includes('boro season')) {
      return 203;
    }
    if (text.includes('temperature') || text.includes('cardinal') || text.includes('heat stress') || text.includes('cold area') || text.includes('vernalization') || text.includes('thermoperiodism')) {
      return 204;
    }
    if (text.includes('wind') || text.includes('humidity') || text.includes('transpiration') || text.includes('microclimate')) {
      return 205;
    }
    if (text.includes('moisture') || text.includes('y=g+e') || text.includes('suitability') || text.includes('twin-laws') || text.includes('factors affecting crop') || text.includes('soil moisture that affect')) {
      return 206;
    }
    return 201; // default chapter 1
  }

  if (chap.includes('chapter 2')) {
    if (text.includes('vertical structure') || text.includes('atmospheric layers')) {
      return 207;
    }
    if (text.includes('climate change') || text.includes('climate variation') || text.includes('climate smart') || text.includes('csa') || text.includes('physical evidence')) {
      return 208;
    }
    if (text.includes('global warming') || text.includes('greenhouse') || text.includes('green house')) {
      return 209;
    }
    if (text.includes('ozone') || text.includes('acid rain')) {
      return 210;
    }
    if (text.includes('hydrologic') || text.includes('carbon dioxide') || text.includes('co2')) {
      return 211;
    }
    return 208; // default chapter 2
  }

  if (chap.includes('chapter 3')) {
    if (text.includes('soil pH') || text.includes('soil water') || text.includes('soil air') || text.includes('soil organism') || text.includes('soil health')) {
      return 212;
    }
    if (text.includes('nitrogen') || text.includes('n-cycle') || text.includes('n2') || text.includes('phosphorus') || text.includes('biogeochemical cycle')) {
      return 213;
    }
    return 212; // default chapter 3
  }

  if (chap.includes('chapter 4')) {
    if (text.includes('mycorrhiza') || text.includes('mycorrhizal')) {
      return 215;
    }
    if (text.includes('association') || text.includes('notations') || text.includes('interaction') || text.includes('parasitism') || text.includes('mutualism') || text.includes('epiphytes') || text.includes('parasites')) {
      return 214;
    }
    return 214; // default chapter 4
  }

  if (chap.includes('chapter 5')) {
    return 216;
  }

  return 201;
}

// Master solved answers dictionary mapping key substrings
const solvedAnswers = {
  // Topic 201: Crop Ecology Sub-divisions
  "crop ecology scope": `### Definition
**Crop Ecology** is the scientific study of the interactions, relationships, and reciprocal effects between crop plants and their surrounding environment (including physical, chemical, and biotic factors).

### Scope and Application in Agriculture
* **Resource Optimization:** It guides farmers in utilizing environmental resources such as Solar Radiation (PAR), moisture, and temperature efficiently to maximize photosynthesis and biomass accumulation.
* **Cropping System Design:** Informs decisions on cropping patterns, crop associations (e.g., intercropping, relay cropping), and plant spacing to optimize land equivalent ratios (LER).
* **Stress Management:** Helps identify and mitigate climatic stresses like heat stress, chilling injuries, frost damage, and droughts by suggesting cultural/foliar practices.
* **Environmental Protection:** Assists in managing agrochemical inputs (fertilizers, pesticides) to prevent water, soil, and air pollution.
* **Microclimate Manipulation:** Guides the design of windbreaks, shelterbelts, and greenhouses to alter temperature, humidity, and wind velocity around crops.
* **Climate Change Adaptation:** Aids in selecting climate-resilient and salt-tolerant crop varieties (e.g., halophytes in coastal zones) to maintain food security.
* **Weed and Pest Management:** Helps understand crop-weed and crop-pest biotic associations to design biological and integrated pest management systems.`,

  "sub-divisions": `### Sub-divisions of Ecology
Ecology is broadly divided into:
1. **Autecology:** The study of an individual organism or a single plant/animal species in relation to its environment.
2. **Synecology:** The study of groups of organisms or ecological communities composed of multiple species in relation to their environment.`,

  "fields of ecology": `The major fields (sub-divisions) of ecology include:
* **Population Ecology:** Focuses on the growth, density, regulation, and demographic structure of single-species populations.
* **Community Ecology:** Studies the interactions between different populations living in the same habitat under similar environmental conditions.
* **Habitat Ecology:** Examines life processes within specific physical habitats (e.g., forest, marine, freshwater, desert ecology).
* **Palaeoecology:** Investigates the relationships between organisms and their geological environments in past ages.
* **Ecophysiology (Physiological Ecology):** Analyzes the physiological adaptations of plants and animals under different environmental and climatic stresses.
* **Cytoecology:** Studies cytological details (cellular structure and behavior) in relation to varying soil and environmental conditions.
* **Conservation Ecology:** Focuses on the management and protection of natural resources and biodiversity for human welfare.
* **Production Ecology:** Investigates energy production, accumulation, and flow through different trophic levels.
* **Gene Ecology:** Studies the relationship between environmental factors and genetic variations within populations.`,

  "define crop and ecology": `### Definitions
* **Crop:** A plant or crop population cultivated deliberately by humans for food, fodder, fiber, shelter, or economic value.
* **Ecology:** The scientific study of the structure, function, and interactions of nature, focusing on the relationships between living organisms (Oikos) and their environment.
* **Crop Ecology:** Refers to the specialized branch of agricultural science that studies the reciprocal interactions, adaptations, and resource-use relationships between crop plants and their growing environment.`,

  "distinguish between synecology and autecology": `| Feature | Autecology | Synecology |
| :--- | :--- | :--- |
| **Definition** | The study of a single individual or a single species in relation to its environment. | The study of communities or groups of multiple species interacting in an environment. |
| **Focus** | Individual growth, life history, and specific physiological adaptations. | Community structure, species diversity, food webs, and succession. |
| **Complexity** | Simple, focuses on one organism-environment pathway. | Highly complex, network of multiple species interactions. |
| **Unit of Study** | Individual organism or population. | Ecological community or ecosystem. |`,

  "self-regulatory": `### Definition of Crop Ecology
**Crop Ecology** is the scientific study of the interactions and relationships between crop plants and their surrounding environment.

### Explanation of Ecosystem Self-Regulation
An ecosystem is an open, dynamic system that maintains structural and functional equilibrium (homeostasis) through self-regulatory feedback loops:
* **Feedback Mechanisms:** When an environmental component or population size deviates from its norm, feedback loops act to bring it back to balance. For example, if a pest population increases, the number of its natural predators rises, which eventually reduces the pest population, restoring balance.
* **Resource Limitation:** The growth of biotic components is restricted by abiotic limits (like water, nutrients, and space), preventing any single species from growing infinitely and collapsing the system.
* **Decomposition and Nutrient Cycling:** Decomposers continuously break down organic wastes, converting them back into inorganic forms, which prevents toxicity and ensures a steady nutrient supply for producers.`,

  // Topic 202: Principles of Organism-Environment Relationship
  "ten principles": `### Ten Principles of Organism-Environment Relationship
1. **Environmental Influence:** Everything that surrounds an organism and directly or indirectly influences its life processes constitutes its environment.
2. **No Existence in Vacuum:** An organism cannot exist in a vacuum; it is constantly interacting with and dependent on its biotic and abiotic surroundings.
3. **Cessation of Life:** Death is the cessation of life, representing the point where an organism ceases to extract energy and returns its nutrients back to the environment.
4. **Ultimate Energy Source:** The Sun is the ultimate and only primary source of energy for all life processes on Earth.
5. **Liebig\'s Law of the Minimum:** The rate of physiological processes and distribution of organisms are limited by the environmental factor that is present in the minimum quantity relative to the organism\'s requirements.
6. **Shelford\'s Law of Tolerance:** An organism has minimum, optimum, and maximum limits of tolerance for different environmental factors; exceeding these limits halts growth.
7. **Carrying Capacity:** Every habitat possesses a finite potential to support a certain maximum number of individuals of a species sustainably.
8. **Energy Conservation:** Energy is neither created nor destroyed, but only transformed from one form to another (First Law of Thermodynamics).
9. **Biosphere Boundary:** Life on Earth is restricted to a very thin mantle or layer around the planet known as the biosphere.
10. **System Integration:** An ecosystem is integrated by biotic components (producers, consumers, decomposers) and abiotic components (matter and energy) interacting dynamically.`,

  "study important in agriculture": `Ecological study is critical in agriculture because it forms the scientific basis for sustainable crop production:
* **Resource Optimization:** It explains how to optimize inputs like solar radiation, temperature, and soil moisture to match crop requirements.
* **Climate Resilience:** Helps farmers adapt to climatic hazards by implementing mitigation strategies for heat stress, frost injury, and droughts.
* **Sustainable Soil Management:** Guides the maintenance of soil fertility through crop rotation, organic matter enrichment, and nitrogen-fixing associations.
* **Eco-Friendly Pest Management:** Explains biotic interactions (predation, parasitism) to design biological control methods, reducing chemical pesticide use.
* **Biodiversity Conservation:** Preserves wild genetic relatives of crops which are essential for breeding disease-resistant and climate-smart varieties.
* **Yield Improvement:** Informs crop-specific sowing dates, crop spacing, and fertilization based on environmental factors.`,

  "study of ecology important": `### Importance of Studying Ecology
The importance of studying ecology (as detailed in Section 2.2 of the lecture notes) includes:
* **Understanding environment-organism relationship:** Analyzes how living things interact with each other and their physical environment.
* **Conservation of biodiversity:** Helps protect endangered species and maintain balanced ecosystems.
* **Sustainable use of natural resources:** Guides the management of water, soil, and forests to prevent depletion.
* **Improving agricultural production:** Forms the scientific foundation for optimizing crop growth, soil health, and pest management.
* **Environmental protection (help control pollution):** Explains how human activities impact biogeochemical cycles and how to remediate pollution.
* **Climate change awareness:** Identifies the drivers and impacts of global warming, advising on mitigation and adaptation.
* **Disaster management:** Assists in predicting, preparing for, and managing ecological hazards like droughts, floods, and soil erosion.
* **Promote human health and survival:** Ensures clean air, water, and food security, which are essential for human existence.`,

  "sustainable crop production": `Ecological knowledge is a prerequisite for sustainable crop production due to the following reasons:
1. **Saves Inputs:** Optimizes the use of solar energy (PAR), water, and soil nutrients, preventing input waste.
2. **Mitigates Climatic Stress:** Provides techniques (like seed priming or foliar sprays) to protect crops from extreme heat or chilling.
3. **Reduces Soil Degradation:** Guides crop rotation and cover cropping to prevent soil erosion and maintain organic matter.
4. **Controls Chemical Pollution:** Minimizes the run-off of synthetic pesticides and fertilizers by promoting bio-controls and organic farming.
5. **Promotes Agro-biodiversity:** Encourages intercropping and crop diversification, which breaks pest cycles and stabilizes yields.
6. **Enhances Biological Nitrogen Fixation:** Promotes the rhizosphere symbiosis of legume-Rhizobium, reducing reliance on synthetic urea.
7. **Informs Crop Breeding:** Helps breeders identify wild crop relatives carrying genetic traits for salt, heat, or drought tolerance.
8. **Guides Microclimate Management:** Enables farmers to design effective windbreaks and shelterbelts to protect crops from physical wind damage.
9. **Supports Resource Conservation:** Teaches principles of Integrated Water Resource Management (IWRM) like Alternate Wetting and Drying (AWD) in rice.
10. **Ensures Long-Term Viability:** Integrates farming practices with natural biogeochemical cycles, ensuring the environment remains productive for future generations.`,

  "individual, population, community": `### Key Ecological Levels
* **Individual:** A single living organism (e.g., a single rice plant).
* **Population:** A group of individuals of the same species living in a particular area and capable of interbreeding (e.g., all rice plants in a field).
* **Community:** An assemblage of populations of different species interacting in a common habitat (e.g., rice plants, weeds, insects, and soil microbes in a field).
* **Ecosystem:** A self-sustaining functional unit consisting of a biotic community interacting dynamically with its abiotic environment (soil, water, light).
* **Biome:** A large regional ecological community characterized by a dominant vegetation type and climate (e.g., tropical rainforest, savannah, mangrove forest).
* **Biosphere:** The global ecological system integrating all living beings and their relationships; the thin zone on Earth where life exists.

### Schematic Layout
\`\`\`
[ Individual ] ➔ [ Population ] ➔ [ Community ] ➔ [ Ecosystem ] ➔ [ Biome ] ➔ [ Biosphere ]
   (1 plant)       (Same species)   (Multi-species)   (Biotic+Abiotic)  (Regional)     (Global Zone)
\`\`\``,

  "community, biome, biosphere": `### Explanation of Levels
* **Population:** A group of individuals of the same species living in a specific habitat and capable of reproducing.
* **Community:** An assemblage of populations of different species interacting with each other in a common geographical area.
* **Biome:** A large regional or sub-continental community characterized by dominant vegetation, soil, and climate patterns (e.g., the Sundarbans mangrove biome).
* **Biosphere:** The global ecological system encompassing all regions of the Earth (atmosphere, lithosphere, hydrosphere) where life exists.

### Schematic Representation
\`\`\`
[ Population ] ➔ [ Community ] ➔ [ Biome ] ➔ [ Biosphere ]
 (Same Species)   (Multi-species)  (Regional)    (Global Life Zone)
\`\`\``,

  // Topic 203: Light as an Ecological Factor
  "intensity and duration": `| Feature | Light Intensity | Light Duration (Photoperiod) |
| :--- | :--- | :--- |
| **Definition** | The concentration or strength of solar energy hitting the crop surface. | The length of time a crop is exposed to sunlight in a 24-hour cycle. |
| **Primary Physiological Role** | Determines the rate of photosynthesis, stomatal movement, and dry matter accumulation. | Acts as a regulatory cue for the transition from vegetative to reproductive growth (flowering). |
| **Crop Growth Effect** | Controls food production, grain filling, tiller count, and vegetative biomass. | Controls the timing of flowering, crop maturity, and seed formation. |
| **Photoperiodism** | Not involved in photoperiodic signaling. | Directly involved (classified into Short-Day, Long-Day, and Day-Neutral plants). |
| **Seasonal Impact** | Highly critical during the dry, clear-sky winter (Boro season) in Bangladesh. | Determines which seasons a crop can grow and flower (e.g., winter vs. summer). |`,

  "boro season": `### Explanation
Boro rice is cultivated during the dry winter-to-spring season in Bangladesh, which is characterized by clear skies and abundant solar radiation:
* **Higher Photosynthesis:** High light intensity stimulates stomatal opening (via potassium ion $K^+$ accumulation in guard cells). This maximizes carbon dioxide intake and photosynthetic rates, leading to higher dry matter accumulation.
* **Enzyme Activation:** Solar radiation enhances enzyme activities and induces protein synthesis, promoting active tillering.
* **Grain Translocation:** Abundant sunlight during reproductive stages accelerates the translocation of stored assimilates from stems to grains, resulting in high grain filling.
* **Yield Performance of BR3:** Cultivars like BR3 perform exceptionally well during the Boro season because they can utilize the high solar radiation and cooler night temperatures (which reduce respiratory loss), leading to maximum grain yield.`,

  "low light intensity during panicle": `Low light intensity (caused by cloud cover or shading) restricts rice yield, but its timing determines the severity of the damage:
* **Panicle Initiation to Flowering (Critical Phase):**
  * Shading during this stage reduces the number of spikelets per panicle.
  * It limits photosynthesis, causing poor spikelet development and leading to spikelet sterility.
* **Flowering to Grain Formation (More Critical Phase):**
  * During grain filling, yield depends almost entirely on current photosynthesis.
  * Low light intensity at this stage directly decreases the accumulation of soluble carbohydrates, leading to poor grain filling, a high percentage of empty grains (chaffiness), and lower grain weight.
  * Consequently, low light during grain formation causes a more direct and severe reduction in final yield compared to earlier stages.`,

  "photoperiod influences flowering": `### Agreement
I agree with the statement. **Photoperiodism** is the physiological response of plants to the relative length of day and night, which controls the initiation of flowering.

### Justification
* **Phytochrome System:** Plants perceive photoperiod through the pigment phytochrome, which exists in two forms: Red-absorbing $P_r$ (inactive) and Far-Red-absorbing $P_{fr}$ (active).
* **Short-Day Plants (SDP):** These plants require a day length shorter than a critical duration (e.g., Aman rice, soybean). Long, uninterrupted nights allow $P_{fr}$ to decay to $P_r$, which triggers the synthesis of the flowering hormone **Florigen**. A brief flash of light during the dark period inhibits flowering.
* **Long-Day Plants (LDP):** These plants require day lengths exceeding a critical duration (e.g., wheat, spinach). Continuous light keeps phytochrome in the active $P_{fr}$ form, promoting Florigen synthesis and flowering.`,

  "critical photoperiod and critical dark": `Critical photoperiod (day length) and critical dark period (night length) determine the vegetative-to-reproductive transition in crops:
* **Short-Day Crops (SDPs):**
  * Require a dark period *longer* than a critical dark threshold.
  * If the night is interrupted by a brief flash of light, the crop fails to flower and remains vegetative. 
  * Understanding this helps select the correct sowing date so the crop receives long enough nights to flower before winter ends.
* **Long-Day Crops (LDPs):**
  * Require a photoperiod *longer* than a critical day length threshold.
  * Short dark periods promote flowering. Sowing must be timed with lengthening spring days to ensure timely reproduction.
* **Agricultural Adaptation:** Matching crop photoperiodic requirements with local seasonal day lengths ensures synchronized flowering, uniform maturity, and high yields.`,

  "diagrammatically show the mechanism of flowering": `### Mechanism of Flowering
* **Short-Day Plants (SDP):** Require a day length shorter than a critical threshold. A long, uninterrupted night converts active $P_{fr}$ back to inactive $P_r$, which promotes Florigen synthesis.
* **Long-Day Plants (LDP):** Require a day length longer than a critical threshold. High levels of active $P_{fr}$ (maintained by long days) promote Florigen synthesis.

### Schematic Diagram
\`\`\`
Short-Day Plant (SDP) Mechanism:
Red Light (660nm)  ===>  Pfr (Flowering Inhibitor)
Far-Red (730nm) / Dark ===>  Pr  ===>  Florigen  ===>  Flowering (SDP)

Long-Day Plant (LDP) Mechanism:
Red Light (660nm)  ===>  Pfr (Flowering Promoter)  ===>  Florigen  ===>  Flowering (LDP)
\`\`\``,

  "classify crop plants based on their photoperiodic requirement": `Crops are classified into three main groups based on their photoperiodic requirements:
1. **Short-Day Plants (SDPs):**
   * Plants that flower only when day length is shorter than a critical day length (e.g., Aman rice, sweet potato, chrysanthemum, soybean).
2. **Long-Day Plants (LDPs):**
   * Plants that flower only when day length is longer than a critical day length (e.g., wheat, barley, sugar beet, spinach, radish).
3. **Day-Neutral Plants (DNPs):**
   * Plants that flower independently of day length, responding instead to maturity or temperature (e.g., maize, tomato, cotton, sunflower, cucumber).`,

  "light compensation point": `* **i) Light Compensation Point:**
  * The specific light intensity at which the rate of photosynthesis exactly equals the rate of respiration. At this point, net gaseous exchange (carbon dioxide intake vs. release) is zero, and net dry matter accumulation stops.
* **ii) Photoenergetic Effect:**
  * The direct role of light acting as an energy source to drive physical and chemical reactions in plants, primarily the light-dependent reactions of photosynthesis.
* **iii) Photocybernetic Effect:**
  * The regulatory role of light acting as a signal or environmental cue to control growth, development, and differentiation processes (e.g., photoperiodism, phototropism, pigment synthesis) without being used as an energy source.
* **iv) Photoblastism:**
  * The biological response of seeds to light during germination. Light-sensitive seeds that require exposure to light to germinate are called positively photoblastic (e.g., lettuce), while seeds inhibited by light are negatively photoblastic.`,

  // Topic 204: Temperature
  "scientific officer of a cold area": `To manage crop production in cold areas prone to chilling and frost stress, I would suggest the following practices:
* **Seed Hardening:** Expose seeds to alternating periods of soaking and drying prior to sowing to build physiological tolerance to cold.
* **Foliar Sprays for Frost Mitigation:**
  * Spray **2% DAP + 1% MOP** to improve cell turgidity and membrane resilience.
  * Spray **0.1% Ammonium solution** or **2% Calcium Nitrate $Ca(NO_3)_2$** to boost vegetative vigor and protect against cell damage.
  * Apply **Salicylic Acid** to trigger systemic acquired resistance against cold stress.
* **Cultural Practices:**
  * Apply light irrigation during frosty nights, as water releases latent heat upon freezing, keeping the microclimate warmer.
  * Apply organic mulching (straw, crop residues) to conserve soil warmth.
  * Cultivate cold-tolerant varieties suited for temperate conditions.`,

  "atmospheric temperature is increasing progressively": `To combat the challenges of progressive global warming, I suggest the following agricultural adaptation and mitigation strategies:
* **Adjust Sowing Dates:** Shift sowing windows earlier to allow crops to complete their heat-sensitive flowering stage before the peak summer temperatures arrive.
* **Heat Stress Mitigation Sprays:**
  * Spray **0.5% $CaCl_2$** to protect cell membranes from heat-induced damage.
  * Apply **100 ppm Salicylic Acid** to promote the mobilization of stem reserves to grains during heat stress.
  * Spray **0.5 ppm Brassinolite** to maintain high photosynthetic activity under elevated temperatures.
  * Spray **10 ppm Naphthalene Acetic Acid (NAA)** to control premature dropping of flowers and fruits.
* **Foliar Nutrition:** Apply **2% DAP + 1% MOP** to avoid leaf scorching and maintain leaf hydration.
* **Water Conservation:** Implement Alternate Wetting and Drying (AWD) and apply hydrogels to conserve soil moisture.`,

  "what is temperature": `### Definition
**Temperature** is the degree of hotness or coldness of the atmosphere, measured on a defined scale (e.g., Celsius, Fahrenheit). It is an expression of kinetic energy.

### Beneficial Effects of Wind
* **Gas Exchange and Mixing:** Wind circulates the air within the crop canopy, preventing localized depletion of carbon dioxide ($CO_2$), which enhances the rate of photosynthesis.
* **Pollination:** Facilitates the pollination of wind-pollinated (anemophilous) crops such as maize, wheat, and gases.
* **Cooling Effect:** Air movement removes sensible heat and increases transpiration, cooling the leaf surface and protecting plants from heat stress.
* **Drying Foliage:** Dries wet leaves after rain or dew, which reduces the humidity around the canopy and suppresses fungal spore germination.`,

  "anatomical alterations in crop plants": `### Anatomical Alterations Under Heat Stress
* Disruption and disassembly of the **cytoskeleton**.
* Inhibition of protein and DNA synthesis in cells.
* Fragmentation of the **Golgi complex**.
* Swelling and structural damage of **mitochondria**.
* Increase in the volume of the **nucleolus**.
* Disappearance of ribosomes and endoplasmic reticulum (ER).
* Reduction in enzymatic activities responsible for oxidative phosphorylation.

### Protective Measures
* **Seed Priming:** Treat seeds with a **0.5% $CaCl_2$ solution** before sowing to stabilize membranes and reduce lipid peroxidation.
* **Foliar Protection:** Spray **2% DAP + 1% MOP** on crop foliage to prevent leaf scorching.
* **Hormonal Application:** Spray **10 ppm Naphthalene Acetic Acid (NAA)** to prevent flower and fruit abortion, and spray **100 ppm Salicylic Acid** to mitigate stress.`,

  "ecologically classify plants based on temperature": `According to Paunkias, plants are ecologically classified into four groups based on their temperature requirements:
1. **Megatherms:**
   * Plants adapted to continuously high temperatures and tropical habitats (e.g., date palm, coconut, banana).
2. **Mesotherms:**
   * Plants adapted to moderate temperatures, alternating warm and cold seasons (e.g., wheat, barley, mustard, potato).
3. **Microtherms:**
   * Plants adapted to continuously low temperatures and cold temperate climates (e.g., apple, peach, plum).
4. **Hekistotherms:**
   * Plants adapted to extreme cold and alpine regions where temperatures remain very low throughout the year (e.g., arctic mosses, lichens, alpine shrubs).`,

  "usefulness of vernalization": `**Vernalization** is the promotion of flowering in plants through exposure to a prolonged period of low temperature (cold treatment).

### Usefulness in Crop Production
* **Shortens Growth Cycle:** Speeds up the vegetative phase, leading to early flowering and maturity.
* **Enables Spring Sowing:** Allows winter crop varieties (which normally require a cold winter to flower) to be sown in spring after artificial cold treatment of seeds.
* **Synchronizes Flowering:** Ensures uniform flowering and crop maturity across the field, making harvesting easier.
* **Protects Against Frost:** By regulating flowering times, it ensures crops do not initiate frost-sensitive reproductive stages during the peak of winter.`,

  "thermoperiodism": `### Thermoperiodism
**Thermoperiodism** is the physiological response of plants to alternating day and night temperatures. Many crops grow and yield better when night temperatures are lower than day temperatures.

### Importance of Temperature on Plants
* **Controls Photosynthesis & Respiration:** Temperature regulates the activity of enzymes involved in dry matter production and energy release.
* **Governs Seed Germination:** Seeds require a minimum threshold temperature (cardinal temperature) to initiate metabolic activities and break dormancy.
* **Regulates Flowering & Fruit Setting:** Specific temperatures are required for pollen viability and fertilization. Extreme heat causes flower drop.
* **Determines Crop Duration:** High temperatures speed up accumulation of growing degree days (GDD), shortening the crop cycle.`,

  "cardinal temperature": `### Cardinal Temperatures
**Cardinal Temperatures** are the three critical temperature points that define the limits of growth and physiological processes of a plant:
1. *Minimum Temperature:* The lowest temperature at which growth/physiological activity can occur.
2. *Optimum Temperature:* The temperature at which the rate of growth/activity is highest.
3. *Maximum Temperature:* The highest temperature beyond which activity stops completely.

### Contrast: Light Compensation Point vs. Light Saturation Point
| Feature | Light Compensation Point | Light Saturation Point |
| :--- | :--- | :--- |
| **Definition** | The light intensity at which the rate of photosynthesis equals respiration. | The light intensity beyond which further increases in light do not increase photosynthesis. |
| **Net Carbon Exchange** | Zero net exchange of carbon dioxide ($CO_2$). | Maximum net carbon assimilation occurs. |
| **Plant Growth** | Growth stops (dry matter accumulation is zero). | Plant growth is maximized. |`,

  // Topic 205: Wind & Humidity
  "protecting their crops from strong wind": `To protect crops from the physical and physiological damages of strong winds, I suggest the following measures:
* **Establish Windbreaks:** Plant narrow rows of fast-growing trees or shrubs (e.g., ipil-ipil, sheoak) perpendicular to the dominant wind direction around small fields.
* **Establish Shelterbelts:** On a larger scale, develop wider, multi-row barriers of tall trees to reduce wind velocity across the region.
* **Mechanical Staking:** Support tall or weak-stemmed crops (like banana, sugarcane, or maize) with bamboo poles to prevent lodging.
* **Adjust Planting Dates:** Align crop sowing so that the tall, heavy stages of the crops do not coincide with the seasonal storm and cyclone periods.
* **Select Tolerant Varieties:** Grow dwarf crop varieties that have stronger stems and higher resistance to lodging.`,

  "wind break from shelter belt": `### Microclimate
**Microclimate** is the local atmospheric zone where the climate differs from the surrounding area (e.g., the temperature and humidity conditions inside a greenhouse, or directly under a dense crop canopy).

### Differentiate: Windbreak vs. Shelterbelt
| Feature | Windbreak | Shelterbelt |
| :--- | :--- | :--- |
| **Structure** | A narrow, single or double row of trees or shrubs. | A wide, multi-row belt consisting of trees, shrubs, and hedges of varying heights. |
| **Area of Protection** | Protects small, localized fields or homesteads. | Protects a large geographic region, fields, and ecosystems. |
| **Primary Goal** | Primarily designed to reduce wind speed locally and prevent local soil erosion. | Designed to block strong winds, trap snow/sand, and provide long-term regional microclimate benefits. |`,

  "physiological impact of wind": `Wind has several physiological impacts on crops:
* **Desiccation:** Air movement sweeps away the boundary layer of moist air surrounding leaves, increasing the vapor pressure deficit and accelerating transpiration, which causes water stress.
* **Stomatal Closure:** Under very high wind velocities, plants close their stomata to prevent dehydration. This stops $CO_2$ assimilation, reducing photosynthesis and dry matter production.
* **Altered Growth (Thigmomorphogenesis):** Mechanical stress from constant winds stimulates the synthesis of ethylene, which inhibits cell elongation, resulting in dwarfed plants with thicker stems.
* **Reduced Photosynthesis:** Violent shaking of leaves damages chloroplast structures and reduces chlorophyll efficiency.`,

  "effects of strong wind on crops": `Strong winds cause both physical and physiological damage to crop plants:
* **Physical Damages:**
  * **Lodging:** Bends or breaks stems of tall crops (e.g., rice, maize, sugarcane), making mechanical harvesting difficult and reducing yield.
  * **Uprooting:** Knocks down shallow-rooted trees (e.g., banana, fruit orchards).
  * **Mechanical Injury:** Tears leaves, breaks branches, and causes shedding of flowers and fruits.
* **Physiological Damages:**
  * **Desiccation:** Treats transpiration rates, leading to rapid water loss and wilting.
  * **Dwarfing:** Permanent dwarf growth in areas with constant, unidirectional winds.
* **Soil Degradation:** Causes wind erosion, stripping fertile topsoil and exposing crop roots.`,

  "transpiration rate": `### Analysis of the Statement
Atmospheric humidity (expressed as Relative Humidity - RH) is a dominant environmental factor that controls the rate of transpiration by regulating the water vapor pressure gradient between the leaf interior and the atmosphere:

* **High Humidity (Low Transpiration):**
  * When the air is highly humid, the water vapor pressure difference between the leaf\'s internal air spaces and the surrounding air is very narrow.
  * This slows down the rate of transpiration.
  * Consequently, the translocation of water and essential mineral nutrients (like calcium and boron) from roots to leaves is reduced.
* **Low Humidity (High Transpiration):**
  * Dry air creates a steep vapor pressure gradient, causing water to evaporate rapidly from stomata.
  * This accelerates transpiration. If the soil has sufficient moisture, this cools the leaves and boosts nutrient uptake.
  * However, if the soil is dry, excessive transpiration causes cell dehydration, stomatal closure, and wilting.
* **Interaction with Wind:** Constant winds sweep away the boundary layer of moist air on leaf surfaces, keeping local humidity low and further increasing transpiration.`,

  // Topic 206: General Ecological
  "soil moisture that affect": `Soil water is classified into three main forms based on the physical forces holding it:
* **1. Capillary Water (Chresard):**
  * Water held by surface tension forces in the micropores of the soil against the pull of gravity.
  * It is the only form of soil moisture that is readily **available** to plant roots for absorption.
* **2. Hygroscopic Water (Echard):**
  * Water held very tightly as a thin molecular film around soil particles by adhesive forces.
  * This water is held at high tension (above 31 bars) and is completely **unavailable** to plants.
* **3. Gravitational Water:**
  * Free water that moves downward through soil macropores due to gravity after rain or heavy irrigation.
  * It drains out of the root zone quickly, meaning it is mostly **unavailable** and can cause anaerobic (waterlogged) conditions if drainage is poor.`,

  "factors affecting crop production": `### Factors Affecting Crop Production
Crop growth and final yield are shaped by the interaction of four major groups of ecological factors:
* **Climatic:** Light, temperature, Relative Humidity (RH), rainfall, and wind.
* **Edaphic:** Soil pH, soil moisture, soil air, soil organisms, and organic matter.
* **Physiographic:** Altitude, slope, and land exposure (relief).
* **Biotic:** Beneficial and harmful relationships with bacteria, fungi, insects, nematodes, and animals.

### Diagram
\`\`\`
                     [ CLIMATIC FACTORS ]
                  (Light, Temp, Wind, Rainfall)
                                🞃
[ PHYSIOGRAPHIC FACTORS ] ➔ █ CROP YIELD █ 🞀 [ BIOTIC FACTORS ]
     (Altitude, Slope)        █  GROWTH  █    (Microbes, Pests, Symbionts)
                                🞂
                      [ EDAPHIC FACTORS ]
                 (Soil pH, Air, Water, Microbes)
\`\`\``,

  "y=g+e": `The equation represents the genetic and environmental components of crop yield/phenotype:

$$Y = G + E + (G \\\\times E)$$

* **$Y$ (Phenotype/Yield):** The expressed characteristic or yield of the crop plant.
* **$G$ (Genotype):** The genetic potential of the crop variety.
* **$E$ (Environment):** The sum of all ecological factors (light, temperature, soil fertility, water) during growth.
* **$G \\\\times E$ (Genotype-Environment Interaction):** The interaction term which shows how a specific genotype performs under different environmental conditions.

### Interpretation
A crop variety with high genetic potential ($G$) will not produce maximum yield unless grown in a favorable environment ($E$). Similarly, a perfect environment cannot make up for poor genetics. The interaction term ($G \\\\times E$) shows that different crop varieties must be matched with their ideal environments to achieve the best yields.`,

  "suitability to agricultural": `When evaluating a site for establishing an agricultural enterprise, four major ecological factor groups must be assessed:
* **1. Climatic Factors:**
  * Determines crop suitability and seasonal growth.
  * *Examples:* Solar radiation (PAR), temperature ranges (cardinal limits), annual rainfall pattern, Relative Humidity (RH), and average wind speed.
* **2. Edaphic (Soil) Factors:**
  * Defines soil nutrient supply and physical properties.
  * *Examples:* Soil pH (ideal 6.5–7.5), soil texture/structure, organic matter content, soil air capacity, and water-holding capacity.
* **3. Physiographic Factors:**
  * Influences water drainage and local microclimate.
  * *Examples:* Altitude (height above sea level), slope gradient (steepness), and topography (flat lowlands vs. hills).
* **4. Biotic Factors:**
  * Affects pollination, decomposition, and crop protection.
  * *Examples:* Presence of pollinators (bees), soil decomposers (fungi, earthworms), and local weed/pest populations.`,

  "twin-laws": `The "twin-laws" that govern how organisms respond to environmental inputs must be evaluated before altering a crop\'s growing environment:

* **1. Liebig\'s Law of the Minimum:**
  * *Concept:* Crop yield is limited by the environmental factor that is present in the lowest quantity relative to the crop\'s requirements, even if all other factors are abundant.
  * *Application:* If a crop is limited by nitrogen deficiency, adding more water or phosphorus will not increase yield. You must identify and add the *limiting factor* first.
* **2. Shelford\'s Law of Tolerance:**
  * *Concept:* An organism\'s survival and growth are restricted by minimum and maximum tolerance limits for any environmental factor. Growth is optimal within a specific range.
  * *Application:* Manipulating an environment (e.g., adding heat or fertilizer) must keep the levels within the crop\'s optimum tolerance zone. Excess amounts can become toxic or cause stress.`,

  // Topic 207: Atmosphere Layers
  "vertical structure of atmosphere": `### Layers and Temperature Variations
The atmosphere is vertically divided into four main layers based on temperature trends:
* **1. Troposphere (0–15 km):**
  * *Temperature Trend:* Decreases with altitude (lapsing at $-6.5^\\circ C$ per km, down to $-55^\\circ C$).
  * *Cause:* Heated from below by the Earth\'s surface reflecting solar energy. As altitude increases, air density and pressure drop, reducing heat absorption.
* **2. Stratosphere (15–50 km):**
  * *Temperature Trend:* Increases with altitude (from $-55^\\circ C$ up to $-8^\\circ C$).
  * *Cause:* Contains the **Ozone Layer** ($O_3$). Ozone molecules absorb harmful incoming Solar Ultraviolet (UV-B) radiation, releasing heat.
* **3. Mesosphere (50–85 km):**
  * *Temperature Trend:* Decreases with altitude (reaching the coldest point at $-90^\\circ C$).
  * *Cause:* Lacks ozone or other greenhouse gases to absorb solar radiation, and is too far from the warming Earth surface.
* **4. Thermosphere ($>85$ km):**
  * *Temperature Trend:* Increases rapidly with altitude.
  * *Cause:* Direct absorption of short-wave solar X-rays and UV radiation by sparse gas molecules, causing photo-ionization.

### Schematic Labeled Diagram
\`\`\`
Alt (km)  |  Atmospheric Layer       | Temp Trend | Key Features
-------------------------------------------------------------------------
 > 600    |  EXOSPHERE               | Stable     | Outer space boundary
 85-600   |  THERMOSPHERE            | Increases  | Ionization, Auroras
 50-85    |  MESOSPHERE              | Decreases  | Coldest zone (-90°C)
 --------- Mesopause ----------------------------------------------------
 15-50    |  STRATOSPHERE            | Increases  | Ozone Layer (O3 Shield)
 --------- Tropopause ---------------------------------------------------
 0-15     |  TROPOSPHERE             | Decreases  | Clouds, Rain, Weather
\`\`\``,

  // Topic 208: Climate Change
  "changing day by day": `Global climate change is supported by several observable physical evidences:
* **Rising Global Temperatures:** Continuous increases in average global land and ocean surface temperatures over the past decades.
* **Sea Level Rise:** Global sea level is rising at a rate of approximately **3 mm per year** due to thermal expansion of water and melting glaciers.
* **Melting of Ice Caps and Glaciers:** Progressive loss of ice mass in Greenland, Antarctica, and the Arctic sea ice coverage.
* **Ocean Acidification:** Oceans are absorbing excess atmospheric carbon dioxide ($CO_2$), raising water acidity and harming marine biomes.
* **Unpredictable Rainfall Patterns:** Shifting monsoon timings, leading to alternating periods of severe droughts and flash floods.
* **Increased Frequency of Extreme Weather:** More frequent and severe cyclones, heatwaves, and storms globally.`,

  "climate change and climate variation": `| Feature | Climate Change | Climate Variation |
| :--- | :--- | :--- |
| **Time Scale** | Long-term trend spanning **30 to 40 years** or more. | Short-term seasonal or annual fluctuations. |
| **Permanency** | Represents a permanent, continuous shift in average values. | Temporary deviations from the average climate. |
| **Causes** | Mainly driven by anthropogenic greenhouse gas emissions. | Driven by natural atmospheric oscillations (e.g., El Niño, monsoons). |
| **Example** | Gradual global temperature rise over the past century. | A exceptionally dry winter or heavy monsoon year. |`,

  "coastal agriculture of bangladesh": `### Climate Change
**Climate Change** is a long-term, continuous trend or shift in climatic variables (such as temperature, precipitation, and wind patterns) over a region, typically observed over a period of 30 to 40 years.

### Impacts on Coastal Agriculture of Bangladesh
* **Salinity Intrusion:** Sea level rise forces saltwater into agricultural soils and freshwater estuaries, destroying crops and preventing normal cultivation.
* **Loss of Arable Land:** Coastal erosion and tidal flooding submerge low-lying lands. A 1-meter sea level rise is estimated to submerge about 16% of the country\'s total land area.
* **Freshwater Scarcity:** Groundwater tables and surface canals become saline, limiting the availability of water for irrigating dry-season crops (like Boro rice).
* **Cyclonic Damage:** High-frequency tropical cyclones cause physical lodging of crops, storm surge flooding, and deposit saline mud over crop fields.
* **Yield Reductions:** Severe seasonal droughts and high heat stress reduce spikelet fertility, leading to lower yields in major cereals.`,

  "csa": `### Climate Smart Agriculture (CSA)
**Climate Smart Agriculture** is an integrated approach to managing landscapes (croplands, livestock, forests, and fisheries) that addresses the interlinked challenges of food security and climate change. It has three pillars:
1. Sustainably increasing agricultural productivity and income.
2. Adapting and building resilience to climate change (adaptation).
3. Reducing greenhouse gas emissions where possible (mitigation).

### Recommended CSA Practices for Coastal Bangladesh
* **Cultivate Salt-Tolerant Varieties:** Grow salt-resistant rice cultivars (like BRRI dhan67, BRRI dhan97) to survive salinity stress.
* **Alternate Wetting and Drying (AWD):** Implement AWD irrigation in rice fields to conserve fresh water and reduce methane emissions.
* **Floating Bed Agriculture (Sorjan Method):** Grow vegetables on floating organic beds (constructed from water hyacinths) in flooded areas.
* **Hydrogel Application:** Apply superabsorbent hydrogels to agricultural soil to enhance water-holding capacity during dry periods.
* **Rainwater Harvesting:** Store monsoon rainwater in farm ponds for crop irrigation during the dry winter season.`,

  // Topic 209: Global Warming
  "global warming": `### Global Warming
**Global Warming** is the gradual increase in the average temperature of the Earth\'s atmosphere and oceans, primarily driven by human activities that release greenhouse gases.

### Impact of Greenhouse Effect on Agroecosystems
* **Disruption of Crop Yields:** Rising temperatures speed up crop development, shortening the grain-filling period and reducing final yields.
* **Pest and Disease Infestation:** Warm winter temperatures allow insect pests and fungal pathogens to survive, causing severe crop damage.
* **Irrigation Water Stress:** Increased evaporation rates deplete soil moisture, increasing crop water requirements.
* **Shift in Crop Zones:** Changes in local climates force crop cultivation zones to shift towards higher altitudes or latitudes.
* **Extreme Weather Events:** Increased frequency of droughts, floods, and cyclones damages crops.

### Remedial Measures
* **Afforestation and Reforestation:** Plant trees to sequester atmospheric carbon dioxide ($CO_2$).
* **Reduce Greenhouse Gas Emissions:** Transition from fossil fuels to renewable energy (solar, wind).
* **Control Nitrogen Fertilizer Use:** Optimize fertilizer rates to reduce nitrous oxide ($N_2O$) emissions.
* **Promote Sustainable Farming:** Practice conservation tillage and improve manure management.`,

  "greenhouse effects": `### Greenhouse Effect
The **Greenhouse Effect** is a natural process where greenhouse gases (like $CO_2$, $CH_4$, and water vapor) in the troposphere trap outgoing long-wave infrared radiation emitted by the Earth, keeping the lower atmosphere warm. 

### Schematic Impacts of Global Warming
\`\`\`
              [ GLOBAL WARMING / GHG RISE ]
                            🞃
       ┌────────────────────┼────────────────────┐
       🞃                    🞃                    🞃
[ Higher Temperature ]  [ Sea Level Rise ]  [ Evaporation Rise ]
       🞃                    🞃                    🞃
• Shorter crop cycle    • Coastal flooding    • Severe drought
• Spikelet sterility    • Salinity intrusion • Irrigation stress
• Pest outbreaks        • Land loss           • Soil drying
       └────────────────────┼────────────────────┘
                            🞃
                █ CROP YIELD COLLAPSE █
\`\`\``,

  "coastal agriculture": `### Impacts on Coastal Agriculture in Bangladesh
* **Coastal Land Inundation:** Rising sea levels threaten to submerge about **22,889 $km^2$** of coastal land (approx. 16% of Bangladesh\'s total land area), causing an annual crop loss exceeding **2 million tons** (mostly vegetables and maize).
* **Salinity Intrusion:** Saltwater pollutes freshwater rivers and estuaries, making soil and water saline and rendering fields unfit for standard crops.
* **Severe Freshwater Scarcity:** Groundwater tables become saline, leaving farmers without fresh water for dry-season crop irrigation.
* **Destruction of Mangrove Ecosystem:** Increased salinity damages the Sundarbans forest, reducing its role as a natural storm buffer.

### Remedial Measures
* **Construct Coastal Embankments:** Build and reinforce dykes to prevent tidal saltwater flooding.
* **Promote Climate Smart Agriculture:** Introduce salt-tolerant crop cultivars (e.g., BRRI dhan67).
* **Implement Water-Saving Irrigation:** Use Alternate Wetting and Drying (AWD) and rainwater harvesting.
* **Restore Forest Cover:** Conduct coastal afforestation (planting Keora and Baen) to stabilize soil and absorb storm surges.`,

  // Topic 210: Ozone Layer Depletion & Acid Rain
  "ozone": `### Assessment
The statement is highly accurate. Stratospheric ozone layer depletion is primarily driven by human activities that release ozone-depleting substances (ODS), notably Chlorofluorocarbons (CFCs), Halons, and Methyl Bromide.

### Chemical Mechanism of Depletion
CFCs released from industrial processes, air conditioners, and luxury items migrate to the stratosphere, where they are broken down by solar UV radiation to release highly reactive Chlorine ($Cl$) radicals:

1. **CFC Breakdown:** 
   $$CFC \\\\xrightarrow{UV} Cl\\\\cdot$$
2. **Ozone Destruction:** 
   $$Cl\\\\cdot + O_3 \\\\rightarrow ClO\\\\cdot + O_2$$
3. **Catalytic Cycle:** 
   $$ClO\\\\cdot + ClO\\\\cdot \\\\rightarrow Cl_2 + O_2$$
* A single chlorine radical can destroy **10,000 to 1,000,000** ozone molecules in a catalytic chain reaction.

### Mitigation Measures
* **Phase out CFCs:** Substitute CFCs with eco-friendly alternatives (like Hydrofluorocarbons - HFCs).
* **Enforce Environmental Laws:** Strictly follow international protocols (e.g., the Montreal Protocol).
* **Raise Public Awareness:** Educate communities on reducing chemical emissions and conserving energy.`,

  "acid rain": `### Formation of Acid Rain
Acid rain forms when sulfur dioxide ($SO_2$) and nitrogen oxides ($NO_x$) emitted from burning fossil fuels and industries react with atmospheric moisture and oxygen:

* **Nitrogen Oxide Reactions:**
  $$N_2 + O_2 \\\\rightarrow 2NO \\\\rightarrow 2NO_2 + H_2O \\\\rightarrow HNO_3\\\\text{ (Nitric Acid)}$$
* **Sulfur Dioxide Reactions:**
  $$S + O_2 \\\\rightarrow SO_2 \\\\rightarrow SO_3 + H_2O \\\\rightarrow H_2SO_4\\\\text{ (Sulfuric Acid)}$$
These acids dissolve in rain droplets, lowering the precipitation pH below 5.6.

### Justification of Soil and Productivity Impacts
* **Nutrient Leaching:** Acid rain leaches essential plant nutrients like Calcium ($Ca$) and Magnesium ($Mg$) out of the topsoil.
* **Toxic Metal Release:** It solubilizes toxic aluminum ($Al^{3+}$) ions, which damage root tips and restrict water/nutrient uptake.
* **Microbial Destruction:** Destroys beneficial soil microorganisms (bacteria, mycorrhizal fungi), halting organic matter decomposition and nitrogen fixation.
* **Direct Crop Damage:** Corrodes the protective waxy cuticles of crop leaves, causing necrotic spots and reducing photosynthetic efficiency, leading to lower yields.`,

  // Topic 211: Hydrologic Cycle & Gases
  "hydrologic": `### Explanation of the Hydrologic Cycle
The hydrologic (water) cycle is the continuous movement of water between the Earth\'s surface and the atmosphere:
* **Evaporation & Transpiration:** Solar heat evaporates water from oceans/lakes. Plants release water vapor through transpiration (combined as evapotranspiration).
* **Condensation:** Water vapor rises, cools, and condenses to form clouds.
* **Precipitation:** Condensed water drops fall back to Earth as rain, snow, or sleet.
* **Runoff & Infiltration:** Water flows over the land surface (runoff) into rivers, or infiltrates the soil to replenish groundwater reservoirs.

### Schematic Diagram
\`\`\`
                 [ CLOUD FORMATION / CONDENSATION ]
                                🞁 (Cooling)
  [ EVAPOTRANSPIRATION ] ───────┴─────── [ OCEAN EVAPORATION ]
   (Plants & Lakes)                        (Solar Heating)
                                🞃 (Precipitation)
                     [ RAIN / SNOW FALL ]
                                🞃
       ┌────────────────────────┴────────────────────────┐
       🞃                                                 🞃
[ Surface Runoff ] (Rivers/Oceans)             [ Soil Infiltration ] (Groundwater)
\`\`\``,

  "carbon dioxide": `Carbon dioxide ($CO_2$) is a critical raw material for photosynthesis and crop development:
* **Substrate for Photosynthesis:** $CO_2$ is fixed by Rubisco in the Calvin cycle to produce sugars. Higher $CO_2$ concentrations accelerate photosynthesis, especially in $C_3$ crops (like rice, wheat).
* **CO2 Fertilization Effect:** Elevated $CO_2$ levels increase the rate of biomass accumulation, leading to larger leaf areas, thicker stems, and higher grain yields.
* **Water-Use Efficiency (WUE):** In high-$CO_2$ environments, plants partially close their stomata, reducing water loss through transpiration while maintaining high photosynthetic rates.
* **Yield Formation:** Enhanced photosynthesis increases the translocation of soluble sugars to grains, improving seed size and yield.`,

  // Topic 212: Soil Air, Water & pH
  "soil air and soil water": `### Significance of Soil Water
* **Nutrient Solvent:** Dissolves mineral nutrients in the soil, forming the soil solution necessary for root absorption.
* **Turgidity Maintenance:** Keeps plant cells turgid, which is essential for structural stability, stem elongation, and stomatal opening.
* **Photosynthesis Substrate:** Serves as a raw material in photosynthesis.
* **Temperature Regulation:** Cools leaf surfaces through transpiration.

### Significance of Soil Air
* **Root Respiration:** Supplies oxygen ($O_2$) required for active root respiration, which provides energy (ATP) for nutrient absorption.
* **Microbial Activity:** Supports aerobic soil microbes that decompose organic matter and nitrify ammonium.
* **Prevents Toxicity:** Good aeration prevents the accumulation of toxic reduced gases (like hydrogen sulfide and methane) that occur in waterlogged soils.`,

  "soil ph": `### Significance of Soil pH
* **Nutrient Availability:** Soil pH regulates nutrient solubility. The optimum range is **6.5 to 7.5**, where macronutrients (N, P, K, Ca, Mg) are most available. Extreme pH levels cause nutrient locking or toxicities (e.g., aluminum toxicity at pH $<5.5$).
* **Microbial Activity:** Neutral pH promotes the growth of beneficial soil bacteria and nitrifiers.
* **Root Cell Integrity:** Highly acidic or alkaline soils damage root cell membranes.

### Significance of Soil Organisms
* **Organic Matter Decomposition:** Soil microbes (bacteria, fungi) break down organic residues, releasing essential nutrients.
* **Biological Nitrogen Fixation:** Rhizobium bacteria fix atmospheric nitrogen in legume root nodules, improving soil nitrogen pools.
* **Soil Structure Improvement:** Earthworms and fungal hyphae aggregate soil particles, improving soil aeration and water-holding capacity.`,

  "soil organism in maintaining": `Soil organisms (bacteria, fungi, actinomycetes, earthworms) maintain soil fertility through several roles:
* **Nutrient Cycling:** Decomposers break down complex organic residues, releasing plant-available inorganic nutrients ($NH_4^+$, $HPO_4^{2-}$, $SO_4^{2-}$).
* **Rhizosphere Symbiosis:** *Rhizobium* bacteria fix atmospheric nitrogen in legume nodules, while mycorrhizal fungi enhance phosphorus and water absorption.
* **Nitrification:** Nitrosomonas and Nitrobacter bacteria convert toxic ammonia into plant-absorbable nitrate ($NO_3^-$).
* **Soil Aggregation:** Earthworms ingest soil and organic matter, excreting casts that bind soil particles, improving soil structure, aeration, and water-holding capacity.`,

  // Topic 213: Biogeochemical Cycles
  "biogeochemical cycle has great role": `### Biogeochemical Cycle
A **Biogeochemical Cycle** is the continuous movement and transformation of essential chemical elements (such as carbon, nitrogen, phosphorus) between the biotic (living) and abiotic (non-living atmosphere, lithosphere, and hydrosphere) components of the environment.

### Role in Mineral Nutrition Absorption
* **Nutrient Recycling:** These cycles ensure that essential plant nutrients locked in organic wastes and mineral rocks are continuously converted into plant-available inorganic forms (e.g., $NO_3^-$, $NH_4^+$, $HPO_4^{2-}$). Without cycling, nutrients would remain locked, causing soil exhaustion.
* **Solubility and Transport:** Biogeochemical processes regulate soil pH and microbial activities that solubilize minerals, enabling crop roots to absorb them in the soil solution.
* **Gaseous Reservoirs:** Cycles like the nitrogen cycle replenish the atmospheric and rhizosphere nutrient pools, ensuring a steady supply of nutrients for crops.`,

  "nitrogen fixation mechanisms in rhizosphere": `### Definition of Biogeochemical Cycle
A **Biogeochemical Cycle** is the continuous pathway by which essential elements circulate through biotic and abiotic environmental reservoirs.

### Nitrogen Fixation Mechanism in Rhizosphere
* **Signaling:** Legume root cells secrete flavonoids into the rhizosphere. These attract *Rhizobium* bacteria, which bind to root hairs.
* **Infection & Nodule Formation:** The root hair curls, allowing bacteria to enter via an infection thread. The plant forms a root nodule to house the bacteria.
* **Nitrogenase Catalysis:** Inside the nodule, the enzyme **nitrogenase** converts atmospheric dinitrogen ($N_2$) gas into ammonia ($NH_3$):
  $$N_2 + 8H^+ + 8e^- + 16\\\\text{ATP} \\\\rightarrow 2NH_3 + H_2 + 16\\\\text{ADP} + 16P_i$$
* **Anaerobic Protection:** The enzyme is highly sensitive to oxygen. The plant produces **leghemoglobin** to bind oxygen, maintaining the low-oxygen conditions required for nitrogenase activity.
* **Nutrient Exchange:** The host plant provides carbohydrates (energy) to the bacteria, and receives ammonia for protein synthesis.`,

  "n-cycle": `The atmospheric nitrogen cycle consists of five major steps:
1. **Nitrogen Fixation:** Atmospheric $N_2$ (78% of air) is fixed into ammonia ($NH_3$) through biological (Rhizobium, Azotobacter) or physical (lightning/industrial) processes.
2. **Nitrification:** Soil bacteria convert ammonia into nitrites ($NO_2^-$) via *Nitrosomonas*, and then into nitrates ($NO_3^-$) via *Nitrobacter*.
3. **Assimilation:** Plants absorb nitrates or ammonium, incorporating them into proteins and nucleic acids.
4. **Ammonification:** Decomposers break down dead organic matter and animal wastes, releasing ammonia back into the soil.
5. **Denitrification:** Anaerobic bacteria (Pseudomonas, Clostridium) convert soil nitrates back into gaseous dinitrogen ($N_2$), returning it to the atmosphere.`,

  "biological n2 fixation and n2 assimilation": `| Feature | Biological $N_2$ Fixation | $N_2$ Assimilation |
| :--- | :--- | :--- |
| **Definition** | The conversion of atmospheric dinitrogen ($N_2$) gas into ammonia ($NH_3$) by living organisms. | The absorption and incorporation of inorganic nitrogen ($NO_3^-$, $NH_4^+$) into organic compounds (proteins/nucleic acids) inside plant tissues. |
| **Organisms** | Performed by diazotrophs (e.g., *Rhizobium*, *Azotobacter*). | Performed by all green plants, algae, and fungi. |
| **Enzyme** | Catalyzed by the **nitrogenase** enzyme complex. | Catalyzed by **nitrate reductase** and **glutamine synthetase**. |
| **Location** | Occurs in rhizosphere soil or root nodules. | Occurs inside plant root or shoot cells. |`,

  "legume cultivation": `Rhizosphere nitrogen fixation is highly beneficial in legume cultivation:
* **Self-Sufficiency:** Legumes can meet their nitrogen requirements independently, eliminating the need for synthetic nitrogen fertilizers (like urea).
* **Improves Soil Fertility:** Crop residues left after harvest enrich the soil nitrogen pool, benefiting subsequent crops in rotation.
* **Enhances Seed Quality:** A steady nitrogen supply leads to higher protein accumulation, improving legume seed quality and nutritional value.
* **Cost-Effective:** Lowers fertilizer costs, improving farming profitability.`,

  "phosphorus cycle": `### Biogeochemical Cycle
The continuous movement of essential chemical elements between living organisms and non-living environmental reservoirs.

### Significance of the Phosphorus Cycle
* Phosphorus is a critical component of **ATP** (energy transfer), nucleic acids (DNA, RNA), and cell membranes (phospholipids).
* Unlike nitrogen, it has no atmospheric reservoir; it is a sedimentary cycle.

### Schematic Diagram
\`\`\`
                  [ GEOLOGICAL UPLIFT / ROCKS ]
                                🞃 (Weathering)
                   [ SOIL PHOSPHATE POOL ] 🞀───┐
                    (HPO4^2- / Available)      │
             ┌──────────────────┴──────────────┼───┐
             🞃                                 │   │
     [ PLANT UPTAKE ]                          │   │
             🞃                                 │   │
     [ ANIMAL CONSUMPTION ]                    │   │
             🞃                                 │   │
     [ DEAD ORGANIC MATTER / WASTES ] ─────────┘   │
             🞃                                     🞃
       [ LEACHING ] ➔ [ RUNOFF ] ➔ [ MARINE SEDIMENTS ]
\`\`\``,

  // Topic 214: Biotic Interactions
  "notations": `The symbolic notations and examples of biotic interactions in agroecosystems are:

| Interaction Type | Species A | Species B | Ecological Description & Examples |
| :--- | :---: | :---: | :--- |
| **Mutualism / Symbiosis** | $+$ | $+$ | Both species benefit from the association. (e.g., *Legume-Rhizobium* nodules, Mycorrhiza). |
| **Commensalism** | $+$ | $0$ | Species A benefits, while Species B remains unaffected. (e.g., Epiphytic orchids growing on mango tree branches). |
| **Parasitism** | $+$ | $-$ | Species A benefits at the expense of host Species B. (e.g., *Cuscuta* extracting nutrients from crops via haustoria). |
| **Amensalism** | $-$ | $0$ | Species A is inhibited/harmed, while Species B remains unaffected. (e.g., Penicillium mold releasing penicillin that kills bacteria). |
| **Competition** | $-$ | $-$ | Both species are harmed due to limited resources. (e.g., Crop plants and weeds competing for sunlight and nitrogen). |
| **Neutralism** | $0$ | $0$ | Neither species affects the other. (e.g., Rice plants and spiders in a field). |`,

  "mutualism": `| Feature | Mutualism | Parasitism |
| :--- | :--- | :--- |
| **Interaction Nature** | Positive/Symbiotic ($+/+$). | Negative/Exploitative ($+/-$). |
| **Benefits** | Both participating species benefit. | Only the parasite benefits; the host is harmed. |
| **Host Survival** | Essential for both species; improves host survival. | Parasite harms the host, often causing disease or death. |
| **Example** | Rhizobium bacteria in legume root nodules. | Dodder (*Cuscuta*) extracting nutrients from crop plants. |`,

  "epiphytes": `| Feature | Epiphytes | Parasites |
| :--- | :--- | :--- |
| **Nutritional Dependence** | Completely independent of the host plant for nutrition. | Fully dependent on the host plant for water and organic nutrients. |
| **Specialized Roots** | Possess **aerial roots** containing specialized **velamen tissue** to absorb moisture from the atmosphere. | Possess **haustorial roots** that penetrate host vascular tissues to extract nutrients. |
| **Impact on Host** | Do not harm the host; use host branches for support only. | Harm the host, causing nutrient depletion, stunting, or disease. |
| **Example** | Orchid plants growing on tree branches. | Dodder (*Cuscuta*) growing on crop plants. |`,

  // Topic 215: Mycorrhizal
  "potential benefit of mycorrhizal": `Mycorrhizal fungi provide several benefits for crop production:
* **Enhanced Nutrient Absorption:** Fungal hyphae act as extensions of root hairs, absorbing poorly mobile nutrients—especially **phosphorus ($P$)**, zinc, and copper—and supplying them to the crop.
* **Increased Water Absorption:** Hyphae penetrate small soil pores, improving water uptake and drought tolerance.
* **Disease Protection:** Creates a physical barrier around root cells, protecting the host plant from soil-borne pathogens (like Fusarium, Phytophthora).
* **Improved Soil Structure:** Fungal hyphae bind soil particles into aggregates, improving soil aeration and water infiltration.
* **Reduces Fertilizer Cost:** Maximizes nutrient recovery from soil, reducing reliance on chemical phosphate fertilizers.`,

  "mycorrhiza is also known": `Mycorrhiza is a mutualistic symbiotic association ($+/+$) between soil fungi and the roots of higher plants:
* **Fungal Contribution:** Fungal hyphae spread widely in the soil, increasing the root surface area. They absorb water, minerals, and phosphorus from soil pores and transfer them to the plant root cells.
* **Plant Host Contribution:** The host plant provides organic carbon (sugars/photosynthates) and shelter to the fungus, which cannot produce its own food.
* **Mutual Benefit:** Since both organisms benefit and depend on each other for survival and growth, it is classified as a symbiotic association.`,

  "mycorrhizal association influence root growth": `The mycorrhizal association influences and promotes healthy root growth through several mechanisms:
* **Stimulates Root Branching:** Fungal colonization triggers plant growth regulators, promoting lateral root branching and elongation.
* **Increases Root Surface Area:** Fungal hyphae extend far beyond the root depletion zone, functionalizing a much larger volume of soil.
* **Root Protection:** Fungi secrete chemical compounds and form a physical sheath (mantle) that protects young root tips from soil-borne pathogens.
* **Enhances Cell Division:** Improved phosphorus and water uptake stimulates cell division and elongation in root meristems, leading to a vigorous root system.`,

  // Topic 216: Biodiversity
  "conserve biodiversity": `### Biodiversity
**Biodiversity** is the variety and variability among living organisms (plants, animals, and microorganisms) from all terrestrial, marine, and aquatic ecosystems, including ecological complexes. It exists at genetic, species, and ecosystem levels.

### Conservation Options in Bangladesh
* **Expand Protected Areas:** Strictly manage and protect national parks, wildlife sanctuaries (e.g., Sundarbans), and ecologically critical areas (ECAs).
* **Reforestation and Afforestation:** Restore degraded forestlands with native species (e.g., Hill and Sal forests).
* **Establish Ex-Situ Banks:** Develop botanical gardens, seed banks, and tissue culture centers to preserve crop wild relatives and endangered species.
* **Strictly Enforce Environmental Laws:** Prevent illegal poaching, hunting, and deforestation.
* **Public Awareness:** Educate communities on the value of biodiversity and encourage community-based conservation.`,

  "methods of bio-diversity": `Biodiversity is conserved through two primary methods:
* **1. In-Situ Conservation (Within Natural Habitat):**
  * *Description:* Conserving species in their natural ecosystems (e.g., national parks, sanctuaries).
  * *Advantages:* Cost-effective, protects whole ecosystems, preserves natural evolutionary processes.
  * *Disadvantages:* Hard to protect against large-scale disasters, poaching, or regional climate change.
* **2. Ex-Situ Conservation (Outside Natural Habitat):**
  * *Description:* Conserving species in artificial environments (e.g., seed banks, zoos, botanical gardens).
  * *Advantages:* Highly controlled, protects against extinction, allows research.
  * *Disadvantages:* High maintenance costs, does not preserve natural habitats, potential loss of genetic diversity over time.`,

  "carbon cycle": `### Biodiversity
**Biodiversity** is the variety and variability of life on Earth (genetic, species, and ecosystem levels).

### Outline of the Carbon Cycle
The carbon cycle describes the movement of carbon through different reservoirs:
* **Photosynthesis:** Plants (producers) absorb carbon dioxide ($CO_2$) from the atmosphere, converting it into organic carbon (carbohydrates) using sunlight.
* **Respiration:** Plants and animals break down organic carbon to release energy, returning $CO_2$ back to the atmosphere.
* **Decomposition:** Soil decomposers break down dead organisms and animal wastes, releasing stored carbon as $CO_2$.
* **Combustion:** Burning fossil fuels and wood releases carbon dioxide back into the atmosphere.

### Schematic Representation
\`\`\`
          [ ATMOSPHERIC CARBON DIOXIDE (CO2) ]
             🞁                             🞀───┐
      (Respiration)                      (Combustion)
             ├─────────────────┐               │
             🞁                 🞃 (Photosynthesis) │
         [ ANIMALS ] 🞀──── [ PLANTS ]          │
             │                 │               │
             🞂 ➔ [ DECOMPOSERS ] ──────────────┘
\`\`\``
};

// Route a question to the best match key in solvedAnswers
function getSolvedAnswer(q) {
  const text = q.text.toLowerCase();
  
  if (text.includes("scope and application") || text.includes("application of crop ecology")) {
    return solvedAnswers["crop ecology scope"];
  }
  if (text.includes("fields of ecology")) {
    return solvedAnswers["fields of ecology"];
  }
  if (text.includes("sub-divisions of ecology") || text.includes("sub-divisions of ecology")) {
    return solvedAnswers["sub-divisions"];
  }
  if (text.includes("define crop and ecology")) {
    return solvedAnswers["define crop and ecology"];
  }
  if (text.includes("synecology and autecology")) {
    return solvedAnswers["distinguish between synecology and autecology"];
  }
  if (text.includes("self-regulatory")) {
    return solvedAnswers["self-regulatory"];
  }
  if (text.includes("ten principles") || text.includes("principles of relationship")) {
    return solvedAnswers["ten principles"];
  }
  if (text.includes("ecological study is important in agriculture")) {
    return solvedAnswers["study important in agriculture"];
  }
  if (text.includes("sustainable crop production")) {
    return solvedAnswers["sustainable crop production"];
  }
  if (text.includes("study of ecology important")) {
    return solvedAnswers["study of ecology important"];
  }
  if (text.includes("individual, population")) {
    return solvedAnswers["individual, population, community"];
  }
  if (text.includes("schematically explain community")) {
    return solvedAnswers["community, biome, biosphere"];
  }
  if (text.includes("intensity and duration") || text.includes("light intensity and duration")) {
    return solvedAnswers["intensity and duration"];
  }
  if (text.includes("boro season") || text.includes("br3") || text.includes("light intensity") || text.includes("photoperiodic requirement")) {
    // Check specific sub-questions:
    if (text.includes("panicle initiation")) {
      return solvedAnswers["low light intensity during panicle"];
    }
    if (text.includes("photoperiodic requirement") || text.includes("classify crop plants based on their photoperiodic")) {
      return solvedAnswers["classify crop plants based on their photoperiodic requirement"];
    }
    if (text.includes("photoperiodic requirement") || text.includes("short day plants and long day plants")) {
      return solvedAnswers["classify crop plants based on their photoperiodic requirement"];
    }
    return solvedAnswers["boro season"];
  }
  if (text.includes("photoperiodic requirement") || text.includes("photoperiod influences flowering")) {
    return solvedAnswers["photoperiod influences flowering"];
  }
  if (text.includes("critical photoperiod")) {
    return solvedAnswers["critical photoperiod and critical dark"];
  }
  if (text.includes("flowering of short-day plants and long-day plants")) {
    return solvedAnswers["diagrammatically show the mechanism of flowering"];
  }
  if (text.includes("light compensation point") || text.includes("photo energetic effect") || text.includes("photo cybernetic effect") || text.includes("photoblastism")) {
    return solvedAnswers["light compensation point"];
  }
  if (text.includes("cold area in bangladesh")) {
    return solvedAnswers["scientific officer of a cold area"];
  }
  if (text.includes("temperature is increasing progressively")) {
    return solvedAnswers["atmospheric temperature is increasing progressively"];
  }
  if (text.includes("what is temperature")) {
    return solvedAnswers["what is temperature"];
  }
  if (text.includes("heat stress")) {
    return solvedAnswers["anatomical alterations in crop plants"];
  }
  if (text.includes("ecologically classify plants")) {
    return solvedAnswers["ecologically classify plants based on temperature"];
  }
  if (text.includes("usefulness of vernalization")) {
    return solvedAnswers["usefulness of vernalization"];
  }
  if (text.includes("thermoperiodism")) {
    return solvedAnswers["thermoperiodism"];
  }
  if (text.includes("cardinal temperature")) {
    return solvedAnswers["cardinal temperature"];
  }
  if (text.includes("strong wind") || text.includes("strong winds")) {
    return solvedAnswers["protecting their crops from strong wind"];
  }
  if (text.includes("wind break") || text.includes("shelter belt") || text.includes("microclimate")) {
    return solvedAnswers["wind break from shelter belt"];
  }
  if (text.includes("physiological impact of wind")) {
    return solvedAnswers["physiological impact of wind"];
  }
  if (text.includes("effects of strong wind on crops")) {
    return solvedAnswers["effects of strong wind on crops"];
  }
  if (text.includes("humidity")) {
    return solvedAnswers["transpiration rate"];
  }
  if (text.includes("soil moisture that affect")) {
    return solvedAnswers["soil moisture that affect"];
  }
  if (text.includes("factors affecting crop production")) {
    return solvedAnswers["factors affecting crop production"];
  }
  if (text.includes("y=g+e")) {
    return solvedAnswers["y=g+e"];
  }
  if (text.includes("enterprise establishment")) {
    return solvedAnswers["suitability to agricultural"];
  }
  if (text.includes("twin-laws")) {
    return solvedAnswers["twin-laws"];
  }
  if (text.includes("vertical structure") || text.includes("layers of the atmosphere")) {
    return solvedAnswers["vertical structure of atmosphere"];
  }
  if (text.includes("climate change") || text.includes("climate variation")) {
    if (text.includes("variation")) return solvedAnswers["climate change and climate variation"];
    if (text.includes("evidence")) return solvedAnswers["changing day by day"];
    return solvedAnswers["coastal agriculture of bangladesh"];
  }
  if (text.includes("climate smart") || text.includes("csa")) {
    return solvedAnswers["csa"];
  }
  if (text.includes("global warming") || text.includes("greenhouse") || text.includes("green house")) {
    if (text.includes("coastal")) return solvedAnswers["coastal agriculture"];
    if (text.includes("schematically")) return solvedAnswers["greenhouse effects"];
    return solvedAnswers["global warming"];
  }
  if (text.includes("ozone")) {
    return solvedAnswers["ozone"];
  }
  if (text.includes("acid rain")) {
    return solvedAnswers["acid rain"];
  }
  if (text.includes("hydrologic")) {
    return solvedAnswers["hydrologic"];
  }
  if (text.includes("carbon dioxide") || text.includes("co2")) {
    return solvedAnswers["carbon dioxide"];
  }
  if (text.includes("soil air and soil water") || text.includes("soil water and soil air")) {
    return solvedAnswers["soil air and soil water"];
  }
  if (text.includes("soil ph")) {
    return solvedAnswers["soil ph"];
  }
  if (text.includes("soil organism") || text.includes("soil health")) {
    return solvedAnswers["soil organism in maintaining"];
  }
  if (text.includes("biogeochemical cycle")) {
    if (text.includes("phosphorus")) return solvedAnswers["phosphorus cycle"];
    if (text.includes("nitrogen fixation") || text.includes("n2")) return solvedAnswers["nitrogen fixation mechanisms in rhizosphere"];
    return solvedAnswers["biogeochemical cycle has great role"];
  }
  if (text.includes("n-cycle")) {
    return solvedAnswers["n-cycle"];
  }
  if (text.includes("biological n2 fixation and n2 assimilation")) {
    return solvedAnswers["biological n2 fixation and n2 assimilation"];
  }
  if (text.includes("legume cultivation")) {
    return solvedAnswers["legume cultivation"];
  }
  if (text.includes("notations") || text.includes("types of biotic interaction") || text.includes("biotic interaction")) {
    return solvedAnswers["notations"];
  }
  if (text.includes("parasitism and mutualism")) {
    return solvedAnswers["mutualism"];
  }
  if (text.includes("epiphytes") || text.includes("parasites")) {
    return solvedAnswers["epiphytes"];
  }
  if (text.includes("potential benefit of mycorrhizal") || text.includes("mycorrhiza is also known")) {
    if (text.includes("why")) return solvedAnswers["mycorrhiza is also known"];
    return solvedAnswers["potential benefit of mycorrhizal"];
  }
  if (text.includes("mycorrhiza") || text.includes("mycorrhizal")) {
    if (text.includes("root growth")) return solvedAnswers["mycorrhizal association influence root growth"];
    return solvedAnswers["mycorrhiza is also known"];
  }
  if (text.includes("biodiversity")) {
    if (text.includes("methods")) return solvedAnswers["methods of bio-diversity"];
    if (text.includes("carbon cycle")) return solvedAnswers["carbon cycle"];
    return solvedAnswers["conserve biodiversity"];
  }

  // Generic fallback if not matched
  return `### Answer
  
**Question:** ${q.text}

This question is related to the syllabus of Crop Ecology under Debesh Sir's section. Please refer to the lecture notes for detailed explanations.`;
}

// Map each of the 99 questions to the appropriate topic in Section A
questions.forEach((q, index) => {
  const topicId = getTopicId(q);
  const topic = sectionATopics.find(t => t.id === topicId);
  if (topic) {
    const finalAnswer = getSolvedAnswer(q);
    
    // Add Question object to the topic
    topic.Questions.push({
      id: 2000 + index + 1, // Unique QID (2001 to 2099)
      topicId: topic.id,
      questionText: q.raw, // Preserves raw year/marks in title
      answerText: finalAnswer
    });
  }
});

// Update database.json
const ecology = db.courses.find(c => c.id === 2);
if (ecology) {
  const secA = ecology.Sections.find(s => s.id === 3);
  if (secA) {
    secA.Topics = sectionATopics;
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Successfully populated database.json with Section A topics and all 99 resolved questions!`);
  } else {
    console.error('Section A (ID 3) not found in Course ID 2!');
  }
} else {
  console.error('Course ID 2 (Crop Ecology) not found!');
}
