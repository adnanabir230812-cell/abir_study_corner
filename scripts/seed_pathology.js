const { sequelize, Course, Section, Topic, Question, Progress, Note, Pdf } = require('../models');
const fs = require('fs');
const path = require('path');

async function seedPathology() {
  try {
    console.log('Starting Plant Pathology Q&A seeding...');
    
    // Find Course
    const course = await Course.findOne({ where: { code: '3201' } });
    if (!course) {
      throw new Error('Course 3201 (Plant Pathology) not found. Please run seed.js first.');
    }
    console.log(`Found Course: ${course.name} (ID: ${course.id})`);

    // Find Sections
    const secA = await Section.findOne({ where: { courseId: course.id, name: 'Section A' } });
    const secB = await Section.findOne({ where: { courseId: course.id, name: 'Section B' } });
    
    if (!secA || !secB) {
      throw new Error('Sections not found. Please make sure Section A and Section B exist for Plant Pathology.');
    }
    console.log(`Found Section A (ID: ${secA.id}) and Section B (ID: ${secB.id})`);

    // Delete existing pathology topics, questions and progress to prevent duplicates
    const sectionIds = [secA.id, secB.id];
    const existingTopics = await Topic.findAll({ where: { sectionId: sectionIds } });
    const topicIds = existingTopics.map(t => t.id);
    
    if (topicIds.length > 0) {
      const existingQuestions = await Question.findAll({ where: { topicId: topicIds } });
      const questionIds = existingQuestions.map(q => q.id);
      
      if (questionIds.length > 0) {
        console.log(`Deleting ${questionIds.length} existing progress rows...`);
        await Progress.destroy({ where: { questionId: questionIds } });
        
        console.log(`Deleting ${questionIds.length} existing questions...`);
        await Question.destroy({ where: { id: questionIds } });
      }
      
      console.log(`Deleting ${topicIds.length} existing topics...`);
      await Topic.destroy({ where: { id: topicIds } });
    }

    // Delete stale PDFs
    const stalePdfs = await Pdf.findAll({ where: { sectionId: sectionIds } });
    if (stalePdfs.length > 0) {
      console.log(`Deleting ${stalePdfs.length} stale PDF records...`);
      for (const p of stalePdfs) {
        if (fs.existsSync(p.filePath)) {
          try {
            fs.unlinkSync(p.filePath);
            console.log(`Deleted file: ${p.filePath}`);
          } catch (e) {
            console.error(`Error deleting PDF file: ${e.message}`);
          }
        }
      }
      await Pdf.destroy({ where: { sectionId: sectionIds } });
    }

    // ========================================================
    // SECTION A TOPICS & QUESTIONS (Sabiha Mam)
    // ========================================================
    console.log('Seeding Section A (Sabiha Mam) topics and questions...');

    // 1. Topic: Introduction & Pathogenicity
    const tIntro = await Topic.create({ sectionId: secA.id, name: 'Introduction & Pathogenicity' });
    
    const qA1 = await Question.create({
      topicId: tIntro.id,
      questionText: '[Session 2019-20] What is parasitism? "Symbiotic relationship is a parasitism" - explain with an example.',
      answerText: `## Answer

### 1. Definition of Parasitism
**Parasitism** is a specific type of symbiotic relationship where one organism, the **parasite**, lives in or on another organism (the **host**) and derives its nutrients, water, or shelter from it, causing varying degrees of harm or suffering to the host.

### 2. "Symbiotic Relationship is a Parasitism" Explanation
A **symbiotic relationship** refers broadly to any close and long-term biological interaction between two different organisms. This includes:
* **Mutualism:** Both benefit.
* **Commensalism:** One benefits, the other is unaffected.
* **Parasitism:** One benefits at the expense of the other.

Therefore, **parasitism is indeed a form of symbiosis** because it represents a close, long-term physical association between host and pathogen. 
* **Example:** The biotrophic rust fungus *Puccinia graminis* establishes a symbiotic (parasitic) relationship with wheat plants. It attaches to, infects, and invades host cells, drawing out nutrients through specialized structures (haustoria) and causing rust symptoms like leaf necrosis and reduced yield, directly harming the wheat host.

> 📝 **Key Note:** While all parasitism is symbiotic, not all symbiosis is parasitic (e.g., mycorrhizal fungi or rhizobial root nodules are mutualistic, not parasitic, as they do not harm the host).
*Source: Slide Notes 1.1 (Pathogenesis), Page 8*`
    });

    const qA2 = await Question.create({
      topicId: tIntro.id,
      questionText: '[Session 2017-18] What is meant by disease cycle, parasitism and obligate parasite?',
      answerText: `## Answer

### 1. Disease Cycle (Pathogenesis)
The **disease cycle** or **pathogenesis** is the chain of events involved in disease development. It encompasses the stages of development of the pathogen (such as survival, inoculation, penetration, infection, and reproduction) and the resulting physical and physiological effects of the disease on the host plant.

### 2. Parasitism
**Parasitism** is a close, long-term biological relationship between a parasite and its host where the parasite exploits the host for nutrients and shelter, causing physiological distress, damage, or death to the host.

### 3. Obligate Parasite (Biotroph)
An **obligate parasite** is an organism that can only grow, multiply, and complete its life cycle on a living host plant. It cannot live or replicate saprophytically on dead organic matter or artificial media.
* **Key Characteristics:** 
  - They do not rapidly kill host cells.
  - They produce few or no toxins or cytolytic enzymes.
  - They form specialized structures (e.g., **haustoria**) to absorb nutrients from living host cells.
  - **Examples:** Rust fungi (*Puccinia* spp.), Powdery mildew fungi (*Erysiphe* spp.).
*Source: Slide Notes 1.1 (Pathogenesis), Pages 3, 10, 14*`
    });

    const qA3 = await Question.create({
      topicId: tIntro.id,
      questionText: '[Session 2023-24] Define infection and colonization of pathogenesis. Differentiate their role in disease development.',
      answerText: `## Answer

### 1. Definitions
* **Infection:** The establishment of contact by the pathogen with the host plant's tissues. It is the phase where the pathogen begins to extract nutrients and establishes itself within the host.
* **Colonization:** The successful establishment, growth, and multiplication of the pathogen within the host tissues after infection has occurred.

### 2. Difference in Roles in Disease Development

| Aspect | Infection | Colonization |
| :--- | :--- | :--- |
| **Stage** | The entry and initial contact stage. | The subsequent expansion and multiplication stage. |
| **Function** | Triggers the host's recognition and initial defense response. It is the threshold of disease. | Invades surrounding tissues, spreads locally or systemically, and extracts major crop reserves. |
| **Symptom Link** | May remain latent (showing no symptoms initially). | Direct cause of visible disease symptoms (e.g., necrosis, wilt, spots). |
| **Survival Role** | Ensures the pathogen gets inside the host surface safely. | Crucial for the growth, reproduction, and completion of the pathogen's life cycle. |

> 📝 **Note:** Without colonization, the infection remains restricted, the pathogen cannot reproduce, and the disease cycle is broken.
*Source: Slide Notes 1.1 (Pathogenesis), Pages 19, 57*`
    });

    // 2. Topic: Pathogenesis & Direct Penetration
    const tPatho = await Topic.create({ sectionId: secA.id, name: 'Pathogenesis & Direct Penetration' });

    const qA4 = await Question.create({
      topicId: tPatho.id,
      questionText: '[Session 2019-20] Explain the mechanism of using physical weapons by fungi and nematodes to penetrate directly into the host surface.',
      answerText: `## Answer

Both fungi and nematodes utilize mechanical force (physical weapons) to directly pierce intact plant protective barriers (like the cuticle and cell wall).

### 1. Fungal Mechanism of Direct Penetration
* **Adhesion:** Fungal spores land and adhere to the plant surface using a sticky **mucilaginous substance** secreted by the propagule and germ tube.
* **Appressorium Formation:** The germ tube tip swells to form a specialized dome-like structure called an **appressorium**.
* **Penetration Peg:** A fine, needle-like hypha called a **penetration peg** emerges from the flat base of the appressorium in contact with the host surface.
* **Mechanical Force & Chemical Softening:** The appressorium exerts enormous mechanical pressure. Combined with the localized secretion of cell-wall degrading enzymes (cutinases, cellulases), the penetration peg mechanically punctures the cuticle and epidermal cell wall to enter.

### 2. Nematode Mechanism of Direct Penetration
* **Stylet Activity:** Plant parasitic nematodes possess a sharp, hollow, spear-like mouthpart called a **stylet**.
* **Mechanical Thrusting:** The nematode positions itself against the host root surface and repeatedly thrusts its stylet back and forth against the plant cell wall.
* **Entry:** This mechanical boring punctures the cell wall, allowing the nematode to inject salivary secretions and either enter the cell with its entire body or feed on the cell contents.
*Source: Slide Notes 1.1 (Pathogenesis), Pages 46-49*`
    });

    const qA5 = await Question.create({
      topicId: tPatho.id,
      questionText: '[Session 2017-18] Differentiate between infection and invasion with examples.',
      answerText: `## Answer

### Comparison: Infection vs. Invasion

| Feature | Infection | Invasion |
| :--- | :--- | :--- |
| **Definition** | The establishment of contact by the pathogen with the host plant. | The spread of the pathogen into and throughout the host tissues. |
| **Chronology** | Occurs immediately after successful penetration. | Follows infection; represents the colonization phase. |
| **Extent** | Localized to the site of initial entry. | Can be intercellular, intracellular, local, or systemic. |
| **Example** | Germinated *Puccinia* rust spore forming the first haustorium in an epidermal cell. | Fungal hyphae growing extensively through the mesophyll cells of a wheat leaf. |

### Pathogen Invasion Examples:
* **Intercellular Invasion:** Fungi grow between host cells (e.g., apple scab growing between cuticle and epidermis).
* **Intracellular Invasion:** Fungi grow directly through cells (e.g., smut fungus *Ustilago* hyphae inside cells).
* **Vascular Invasion:** Wilt pathogens (*Fusarium*, *Xanthomonas*) invade and block xylem vessels.
*Source: Slide Notes 1.1 (Pathogenesis), Pages 57, 62-65, 70*`
    });

    const qA6 = await Question.create({
      topicId: tPatho.id,
      questionText: '[Session 2018-19] Describe the methods of penetration of pathogens through natural openings with labeled diagram.',
      answerText: `## Answer

Pathogens (primarily fungi and bacteria) frequently exploit natural plant openings to gain entry into host tissues since they cannot all directly penetrate the cuticle.

### Major Natural Openings Explored:

1. **Stomata:**
   * These are tiny pores on leaves and stems used for gas exchange.
   * **Mechanism:** Fungi germinate on wet leaf surfaces and their germ tubes grow towards and enter stomatal openings (e.g., rust uredospores). Bacteria swim through stomata in a film of water.
2. **Hydathodes:**
   * These are specialized pores found at leaf margins and tips that exude liquid droplets (guttation).
   * **Mechanism:** Since hydathodes are directly connected to the xylem vessel endings, bacteria (and occasionally fungi) swim in through these water droplets to gain direct vascular entry (e.g., *Xanthomonas campestris* pv. *campestris*).
3. **Lenticels:**
   * Openings on stems, tubers, and fruits filled with loosely packed cells to allow air passage.
   * **Mechanism:** Pathogens utilize these loose cellular arrangements to slowly grow into the inner tissues (e.g., potato scab bacterium *Streptomyces scabies*).
4. **Nectarthodes:**
   * Openings on flower blossoms that secrete nectar, allowing entry of pathogens to floral organs.

> 📊 **Note on Direct Openings:** Bacteria enter *only* through wounds or natural openings; they never directly penetrate intact host surfaces.
*Source: Slide Notes 1.1 (Pathogenesis), Pages 51-55*`
    });

    // 3. Topic: Dissemination of Pathogens
    const tDissem = await Topic.create({ sectionId: secA.id, name: 'Dissemination of Pathogens' });

    const qA7 = await Question.create({
      topicId: tDissem.id,
      questionText: '[Session 2018-19] "Dissemination is an important phenomenon of disease spread" - explain.',
      answerText: `## Answer

**Dissemination** is the transfer of the pathogen's inocula (spores, bacterial cells, viral particles) from their source to the infection court on healthy host plants. It is a critical component of epidemiology for several reasons:

### 1. Pathogen Mobility Limitation
Most plant pathogens (fungi, bacteria, viruses) have no or extremely limited means of active movement. They rely on external forces to reach new hosts.

### 2. Modes of Dissemination:
* **Air (Wind):** The most common and effective method for long-distance transport. Air currents carry light spores (like rust uredospores, powdery mildew conidia) over hundreds of kilometers, initiating massive, explosive regional epidemics (e.g., wheat stem rust).
* **Water (Rain/Irrigation):** Rain splash and running water disperse bacteria and heavy conidia locally, spreading them down-row and within the plant canopy.
* **Insects/Vectors:** Actively carry viruses, viroids, and fastidious bacteria directly into healthy plant tissues during feeding.
* **Humans & Machinery:** Seeds, soil, tools, and agricultural machinery transport pathogens across continents, breaching geographic barriers (quarantine).

### Conclusion
Without dissemination, diseases would remain restricted to individual plants or small localized foci. Dissemination enables localized infections to expand into devastating field-wide, regional, or continental epidemics.
*Source: Slide Notes 2.1 (Dissemination), Pages 2-5*`
    });

    const qA8 = await Question.create({
      topicId: tDissem.id,
      questionText: '[Session 2023-24] Discuss a scenario with example where irrigation water contributes to pathogen dissemination.',
      answerText: `## Answer

### Scenario of Irrigation Water Dissemination
In furrow or overhead irrigation systems, running water acts as an active transport medium for soil-borne and foliar pathogens.

### Mechanism:
1. **Soil-borne Oomycetes:** Zoospores of pathogens like *Pythium* and *Phytophthora* are motile and possess flagella.
2. **Transport:** When irrigation water flows through the furrows, it carries fungal mycelium fragments, oospores, and swimming zoospores from an infected plant root zone down the entire irrigation row.
3. **Chemotaxis:** Zoospores detect chemicals (amino acids, CO2) exuded by the roots of downstream healthy plants, swim towards them, and initiate new infections.
4. **Foliar splashing:** Overhead sprinkler irrigation splashes water droplets containing bacterial cells (e.g., citrus canker) or fungal spores (e.g., anthracnose) from infected upper leaves onto neighboring healthy foliage.

* **Example:** *Phytophthora* damping-off in vegetable nurseries or black shank of tobacco. The pathogen spreads rapidly along the direction of water flow in the irrigation channels.
*Source: Slide Notes 2.2 (Epidemiology), Page 46; 1.3 (Physiological Functions), Page 6*`
    });

    // 4. Topic: Toxins in Disease Development
    const tToxin = await Topic.create({ sectionId: secA.id, name: 'Toxins in Disease Development' });

    const qA9 = await Question.create({
      topicId: tToxin.id,
      questionText: '[Session 2019-20] Note down the target site of toxins in plant cells to create disease.',
      answerText: `## Answer

Toxins act at the sub-cellular level on specific host cellular structures to initiate disease symptoms. The primary target sites include:

### 1. Cell Membrane (Plasma Membrane)
* **Action:** Toxins alter the permeability of the plasma membrane, disabling the $H^+/K^+$ exchange transport systems.
* **Result:** Uncontrolled loss of water, leakage of vital electrolytes ($Na^+, Ca^{2+}, K^+, Cl^-$), and entry of toxic substances.
* **Example:** **Victorin** (produced by *Cochliobolus victoriae*) and **Fusaric acid**.

### 2. Key Host Enzymes
* **Action:** Toxins bind to and permanently inactivate crucial metabolic enzymes, causing toxic substrate accumulation or metabolic collapse.
* **Examples:**
  - **Tabtoxin:** Inactivates **Glutamine Synthetase**, causing ammonia toxicity and chloroplast destruction.
  - **Phaseolotoxin:** Inactivates **Ornithine Carbamoyl Transferase**, depleting citrulline and arginine.
  - **Tentoxin:** Inhibits **Polyphenol Oxidase** and chloroplast coupling factor.

### 3. Chloroplasts and Thylakoid Membranes
* **Action:** Direct disruption of light-harvesting apparatus and photophosphorylation.
* **Example:** **Tentoxin** and **Tabtoxin** destroy thylakoid membranes, causing severe chlorosis.

### 4. Mitochondria
* **Action:** Uncoupling of oxidative phosphorylation, halting ATP production.
* **Example:** **T-toxin** (from *Bipolaris maydis*) targets the inner mitochondrial membrane of Texas male-sterile (Tms) cytoplasm corn.
*Source: Slide Notes 1.2 (Toxin), Pages 10-24*`
    });

    const qA10 = await Question.create({
      topicId: tToxin.id,
      questionText: '[Session 2017-18] State the criteria of vivotoxin.',
      answerText: `## Answer

### Definition of Vivotoxin
A **vivotoxin** (term proposed by Dimond and Waggoner in 1953) is a substance produced in the infected host by the pathogen and/or its host, which functions in the production of disease but is not itself the initial inciting agent of the disease.

### Criteria to Classify a Toxin as a Vivotoxin:
To establish that a toxic metabolite is a vivotoxin, it must satisfy the following three criteria:
1. **Separation:** The toxin must be reproducibly isolated/separated from the diseased (sick) host tissue.
2. **Characterization:** The isolated substance must be chemically purified and characterized.
3. **Symptom Reproduction:** The introduction of the purified toxin into a healthy host plant must induce at least a portion of the characteristic symptoms of the disease.

* **Typical Examples:** 
  - **Fusaric acid** (isolated from plants infected with *Fusarium oxysporum*).
  - **Pyricularin** (isolated from rice plants infected with *Magnaporthe oryzae*).
*Source: Slide Notes 1.2 (Toxin), Page 5*`
    });

    const qA11 = await Question.create({
      topicId: tToxin.id,
      questionText: '[Session 2023-24] "Host-specific toxins play a key role in disease selectivity" - justify with examples.',
      answerText: `## Answer

### Concept of Host-Specific Toxins (HSTs)
**Host-specific toxins** are metabolic products of pathogens that are toxic *only* to host plants susceptible to the producing pathogen. They exhibit the same host specificity as the pathogen itself.

### Justification of Disease Selectivity
Host-specific toxins act as primary determinants of pathogenicity. Plants lacking the specific receptor site or sensitivity to the toxin are completely immune to both the toxin and the pathogen.

### Key Examples:
1. **Victorin (HV-toxin):**
   * Produced by *Cochliobolus victoriae* (causing Victoria blight of oats).
   * **Selectivity:** It is highly toxic only to oat varieties containing the *Vb* gene (susceptible). Resistant varieties lacking this gene are 100,000 times less sensitive to the toxin and are completely immune to the pathogen.
2. **T-toxin:**
   * Produced by *Bipolaris maydis* race T (Southern corn leaf blight).
   * **Selectivity:** Only affects corn plants with Texas male-sterile (Tms) cytoplasm. Corn with normal cytoplasm is resistant because its mitochondria lack the specific receptor protein (URF13) targeted by T-toxin.
3. **HC-toxin:**
   * Produced by *Bipolaris zeicola* (northern leaf spot of corn).
   * **Selectivity:** Toxic only to specific corn lines lacking the Hm1 gene (which encodes an enzyme that detoxifies the toxin).
*Source: Slide Notes 1.2 (Toxin), Pages 4, 6-7*`
    });

    // 5. Topic: Pathophysiology
    const tPhysio = await Topic.create({ sectionId: secA.id, name: 'Pathophysiology' });

    const qA12 = await Question.create({
      topicId: tPhysio.id,
      questionText: '[Session 2019-20] "Pathogens interfere with the normal mechanism of photosynthesis of a plant" - explain the ways of interference with examples.',
      answerText: `## Answer

Photosynthesis is the fundamental physiological process of green plants. Pathogens impair it through several mechanisms:

### Ways of Pathogen Interference with Photosynthesis:

1. **Reduction of Photosynthetic Area (Necrosis & Blights):**
   * Foliar pathogens kill leaf cells, causing spots, lesions, and blights, which reduces the active green surface area.
   * *Example:* Rice blast (*Pyricularia oryzae*) and Cercospora leaf spot of groundnut.
2. **Destruction of Chloroplasts & Chlorophyll Pigments:**
   * Some pathogens cause rapid disintegration of chloroplasts, leading to chlorosis.
   * *Example:* Rusts, downy mildews, and viral infections (e.g., sugarcane mosaic).
3. **Production of Photosynthetic Inhibitor Toxins:**
   * Pathogens release toxins that block enzymes or chemical steps in the light or dark reactions.
   * *Example:* **Tentoxin** inhibits photophosphorylation; **Tabtoxin** inhibits glutamine synthetase, causing toxic ammonia accumulation that destroys thylakoid membranes.
4. **Vascular Plugging (Wilts):**
   * Vascular wilt pathogens block xylem vessels, preventing water and nutrient transport. Stomata close to prevent water loss, halting gas exchange ($CO_2$) and stopping photosynthesis before the plant wilts.
   * *Example:* *Fusarium oxysporum* in crops.
*Source: Slide Notes 1.3 (Physiology), Page 4; 1.2 (Toxin), Pages 22-24*`
    });

    const qA13 = await Question.create({
      topicId: tPhysio.id,
      questionText: '[Session 2023-24] Provide examples of fungal diseases that result in vascular obstruction and explain their effects on plant physiology.',
      answerText: `## Answer

### Examples of Fungal Vascular Diseases:
* **Fusarium Wilt** (*Fusarium oxysporum* - affects tomato, banana, cotton).
* **Verticillium Wilt** (*Verticillium dahliae* - affects cotton, potato).

### Physiological Effects of Vascular Obstruction:

1. **Physical Vessel Plugging:**
   * The physical presence of fungal mycelium, microconidia, and bacterial cells inside the xylem vessels mechanically blocks the passage of upward-bound water.
2. **Macromolecular Blockage (Polysaccharides):**
   * Pathogens release high-molecular-weight extracellular polysaccharides (mucilages) into the vessels, drastically increasing water viscosity and plugging vessel endings.
3. **Host Defense Overreaction (Tyloses & Gums):**
   * In response to the pathogen, the host parenchyma cells protrude into xylem vessels, forming balloon-like structures called **tyloses**. The plant also secretes gums. These defense structures permanently seal the vessels.
4. **Loss of Turgor and Wilting:**
   * When transpiration water loss from leaves exceeds xylem water uptake, leaves lose turgor pressure, leading to drooping (wilting), chlorosis, and eventual death.
*Source: Slide Notes 1.3 (Physiology), Pages 6, 9, 11*`
    });

    // 6. Topic: Epidemiology & Disease Triangle
    const tEpi = await Topic.create({ sectionId: secA.id, name: 'Epidemiology & Disease Triangle' });

    const qA14 = await Question.create({
      topicId: tEpi.id,
      questionText: '[Session 2017-18] Differentiate among disease triangle, disease tetrahedron and disease pyramid with neat labeled diagram.',
      answerText: `## Answer

Epidemiological concepts representing host-pathogen-environment relationships are modeled using geometrical shapes:

### 1. Disease Triangle
* **Concept:** Represents the interaction of three primary factors necessary for an infectious disease to occur:
  1. **Susceptible Host Plant**
  2. **Virulent Pathogen**
  3. **Conducive Environment**
* **Significance:** Disease cannot occur if any one of these three components is absent.

### 2. Disease Tetrahedron
* **Concept:** Formed by adding **Time** as the fourth dimension (base) to the disease triangle.
* **Significance:** A pathogen requires time to infect, colonize, reproduce, and spread.

### 3. Disease Pyramid
* **Concept:** A five-sided pyramid representing the complex interactions of:
  1. **Host**
  2. **Pathogen**
  3. **Environment**
  4. **Time**
  5. **Humans** (Human management, monoculture, fertilizer application, etc.)
* **Significance:** Explains how modern agriculture and human actions directly drive or mitigate epidemics.

### Visual Representation (ASCII Diagram):
\`\`\`
   [Disease Triangle]            [Disease Pyramid]
          Host                         Host
         /    \\                       / |  \\
        /      \\                     /  |   \\
    Pathogen---Environment       Pathogen--Environment
                                    \\   |   /
                                     \\  |  /
                                      Humans  <--- Base: Time
\`\`\`
*Source: Slide Notes 2.2 (Epidemiology), Pages 15, 238-252*`
    });

    const qA15 = await Question.create({
      topicId: tEpi.id,
      questionText: '[Session 2023-24] How do dense planting and excessive nitrogen application modify epidemiological factors? Give judgement.',
      answerText: `## Answer

Both dense planting and excessive nitrogen application heavily modify the epidemiological components of the **Disease Triangle** (Host and Environment), accelerating epidemics:

### 1. Epidemiological Modifications:
* **Dense Planting (Environmental Modification):**
  - **Humidity:** Creates a dense canopy that traps moisture, raising relative humidity to nearly 100%.
  - **Drying:** Blocks wind and sunlight, keeping leaves wet for longer periods after rain or dew.
  - **Inoculum Travel:** Reduces physical distance between plants, making spore dissemination (by splash or contact) incredibly easy.
* **Excessive Nitrogen (Host Modification):**
  - **Succulence:** Nitrogen stimulates rapid vegetative growth with thin cell walls and high water content, making host tissues tender and easily penetrable.
  - **Extended Juvenility:** Delays plant maturity, keeping the host in a juvenile, highly susceptible stage for longer.

### 2. Judgement / Verdict:
Excessive nitrogen and dense planting alter the microclimate and host physiology in favor of the pathogen. This drastically increases the rate of infection ($r$), transforming mild endemics into explosive, crop-destroying epidemics (e.g., rice blast or sheath blight).
*Source: Slide Notes 2.2 (Epidemiology), Pages 20, 48*`
    });

    // 7. Topic: Disease Progress & Models
    const tModel = await Topic.create({ sectionId: secA.id, name: 'Disease Progress & Models' });

    const qA16 = await Question.create({
      topicId: tModel.id,
      questionText: '[Session 2018-19] Analyze the equation X = X0 * e^(rt) of polycyclic disease.',
      answerText: `## Answer

### The Polycyclic Disease Model
The equation $X = X_0 e^{rt}$ is the mathematical representation of a **polycyclic disease** progress curve over time (modeled as compound interest):
* $X$: Disease incidence (proportion of disease) at time $t$ (ranges from 0 to 1).
* $X_0$: Initial disease incidence at the start of the epidemic (proportional to initial inoculum $x_0$).
* $r$: Apparent rate of infection (growth rate of the epidemic).
* $t$: Duration of the epidemic (time).

### Key Analytical Insights:
1. **Exponential Progress:** Because $r$ and $t$ are in the exponent, any increase in the infection rate ($r$) leads to a massive, exponential rise in disease ($X$).
2. **Pathogen Characteristics:** Polycyclic pathogens complete multiple cycles (2-30) per season (e.g., late blight, rusts). Secondary inoculum (asexual spores) multiplies rapidly.
3. **Control Strategy Implications:**
   - Reducing $X_0$ (e.g., seed treatment, sanitation) only *delays* the epidemic but does not stop it if $r$ is high.
   - Reducing $r$ (e.g., systemic fungicides, horizontal host resistance) is far more effective in controlling polycyclic epidemics.
*Source: Slide Notes 2.2 (Epidemiology), Pages 33, 37, 560*`
    });

    const qA17 = await Question.create({
      topicId: tModel.id,
      questionText: '[Session 2019-20] In epidemiological study the prevalence of disease development differs by monocyclic and polycyclic model - explain with example.',
      answerText: `## Answer

The progress of plant disease epidemics depends heavily on the cyclic reproduction of the pathogen:

### 1. Monocyclic Disease Model (Simple Interest)
* **Concept:** Pathogens complete only one (or part of one) disease cycle per year.
* **Inoculum:** The **primary inoculum** is the only inoculum available for the entire season. There is **no secondary inoculum** and no secondary infection.
* **Progress Curve:** Graphically represents a **saturation curve**. Disease increases slowly and linearly.
* **Example:** Loose smut of wheat (*Ustilago tritici*), Verticillium wilt, cereal cyst nematode.

### 2. Polycyclic Disease Model (Compound Interest)
* **Concept:** Pathogens go through multiple disease cycles (2 to 30) within a single growing season.
* **Inoculum:** Primary inoculum initiates initial infections. Asexual spores produced on these lesions act as **secondary inoculum**, causing new infections which multiply exponentially.
* **Progress Curve:** Graphically represents a **sigmoid (S-shaped) curve**.
* **Example:** Late blight of potato (*Phytophthora infestans*), stem rust of wheat, rice blast.
*Source: Slide Notes 2.2 (Epidemiology), Pages 23, 25, 33, 35*`
    });

    // 8. Topic: Principles of Disease Control
    const tControl = await Topic.create({ sectionId: secA.id, name: 'Principles of Disease Control' });

    const qA18 = await Question.create({
      topicId: tControl.id,
      questionText: '[Session 2017-18] "Crop rotation is considered as ancient preventive measure of plant disease management" - explain with examples.',
      answerText: `## Answer

### Why Crop Rotation Works as a Preventive Measure:
**Crop rotation** is the practice of growing different crops in a sequential season on the same land. It controls soil-borne pathogens by:
1. **Host Deprivation:** Soil-borne pathogens (fungi, bacteria, nematodes) often have a specific host range. Growing a non-host crop deprives them of food.
2. **Inoculum Starvation:** In the absence of a host, the pathogen's resting structures (sclerotia, chlamydospores) germinate or die out naturally over time, reducing the soil inoculum below economic damage thresholds.

### Key Examples:
* **Late Blight of Potato:** Rotating potato with non-solanaceous crops (e.g., legumes or cereals) prevents the survival of *Phytophthora infestans* residues.
* **Root-knot Nematodes (*Meloidogyne* spp.):** Rotating susceptible vegetable crops with resistant crops or trap crops.
* **Fusarium Wilt:** Rotating cotton or solanaceous crops with grass crops like maize or wheat.
*Source: Slide Notes 3.1 (Control Methods), Page 3.0 (Slide 27/28)*`
    });

    const qA19 = await Question.create({
      topicId: tControl.id,
      questionText: '[Session 2019-20] Suggest the best cultural technique with its mechanism for the control of late blight of potato when it appears every year in a same piece of land.',
      answerText: `## Answer

When **late blight of potato** (*Phytophthora infestans*) occurs repeatedly in the same field year after year, it indicates the persistence of local inoculum (infected tubers or plant debris). The best cultural techniques and their mechanisms are:

### 1. Crop Rotation (Host Deprivation)
* **Technique:** Rotate potato with non-solanaceous crops (e.g., mustard, wheat, rice, legumes) for at least 3-4 years.
* **Mechanism:** Deprives the obligate/hemibiotrophic pathogen of its host, forcing the survival spores (zoospores/mycelium in debris) to die out naturally.

### 2. Sanitation and Removal of Volunteer Plants
* **Technique:** Completely harvest all potato tubers and destroy volunteer potato plants emerging in off-seasons.
* **Mechanism:** Removes the "green bridge" that allows *Phytophthora* mycelium to survive the summer/winter.

### 3. Wide Spacing and Row Orientation
* **Technique:** Increase spacing between plants and align rows parallel to prevailing wind direction.
* **Mechanism:** Lowers relative humidity within the crop canopy and speeds up leaf drying, preventing the 4-6 hours of free water required for zoospore germination.
*Source: Slide Notes 3.1 (Control Methods); 2.2 (Epidemiology), Page 47*`
    });

    // 9. Topic: Biological & Chemical Control
    const tBiochem = await Topic.create({ sectionId: secA.id, name: 'Biological & Chemical Control' });

    const qA20 = await Question.create({
      topicId: tBiochem.id,
      questionText: '[Session 2017-18] Differentiate between systemic and contact fungicides.',
      answerText: `## Answer

### Comparison: Systemic vs. Contact Fungicides

| Feature | Systemic Fungicides | Contact (Protective) Fungicides |
| :--- | :--- | :--- |
| **Absorption** | Absorbed by plant tissues and translocated throughout the plant system. | Remain on the surface of the plant where they are applied. |
| **Action Mode** | **Therapeutic / Curative:** Can cure an infection that has already started inside. | **Protective:** Must be applied before the spore lands/germinates to prevent entry. |
| **Residue Washoff**| Weather-resistant after absorption; cannot be washed off by rain. | Easily washed off by rain, requiring reapplication. |
| **Selectivity** | Often highly specific, targeting specific biochemical pathways. | Broad-spectrum; inhibits many fungal metabolic sites. |
| **Examples** | Carbendazim (Bavistin), Metalaxyl, Vitavax. | Mancozeb (Dithane M-45), Copper Oxychloride. |
*Source: Slide Notes 3.3 (Chemical Control), Page 1.5*`
    });

    const qA21 = await Question.create({
      topicId: tBiochem.id,
      questionText: '[Session 2023-24] List two advantages and limitations of biological control agents in plant disease control.',
      answerText: `## Answer

**Biological control** utilizes beneficial microorganisms (antagonists) to suppress pathogen populations.

### 1. Advantages:
1. **Eco-Friendly and Safe:** Non-toxic to humans, animals, and non-target organisms. No chemical residues left on crops.
2. **Long-Term Sustainability:** Some biocontrol agents (like *Trichoderma*) can colonize the rhizosphere and establish a self-sustaining protective barrier, reducing the need for frequent reapplications.

### 2. Limitations:
1. **Slow Action:** Unlike chemical fungicides which kill immediately, biocontrol agents take time to establish and suppress pathogens.
2. **Environmental Sensitivity:** Highly dependent on weather. Extreme temperature, drought, or UV light can kill the biocontrol organisms, rendering them ineffective in the field.
*Source: Slide Notes 3.2 (Biological Control), Page 2*`
    });

    const qA22 = await Question.create({
      topicId: tEpi.id,
      questionText: '[Class Test] Plant change their susceptibility to disease with age - how? Explain with diagram.',
      answerText: `## Answer

Plants naturally change their susceptibility to specific pathogens as they grow and mature. This age-related susceptibility or resistance is known as **Ontogenic Resistance** (or age-related resistance). 

According to Sabiha Mam's lecture notes (Slide 20), plant susceptibility changes across three distinct patterns:

### 1. The Three Patterns of Ontogenic Resistance

* **Pattern I (Bell-shaped curve):** 
  - **Description:** The host plant is highly susceptible during its early growth (juvenile) period, becomes increasingly resistant as it matures, and then loses resistance, becoming susceptible again during senescence (aging).
  - **Susceptibility Curve:** Bell-shaped or U-shaped depending on whether we plot susceptibility or resistance.
* **Pattern II (Botrytis/Penicillium type):**
  - **Description:** Some pathogens only attack aging tissues or senescent organs (e.g., ripe fruits, dying leaves). The young tissues of the plant are completely resistant.
  - **Example:** *Botrytis cinerea* (grey mould) and *Penicillium* spp. which attack senescing floral parts or ripening fruits.
* **Pattern III (Phytophthora/Alternaria solani type):**
  - **Description:** Plants are highly susceptible to these pathogens only during their early growth period. As the plants mature, their resistance increases rapidly, but it may drop slightly during extreme senescence.
  - **Example:** *Phytophthora* spp. causing damping-off of seedlings, and *Alternaria solani* causing early blight of potato.

---

### Student Notes & Perspectives

#### 🧑‍🎓 Student 180837 Notes:
* **Genetic vs Apparent Resistance:** Susceptibility changes with plant age. True resistance is genetically controlled (Vertical and Horizontal resistance), whereas apparent resistance is non-genetic (comprising Disease Escape and Disease Tolerance).
* **Reference:** Refers to Agrios (Plant Pathology textbook) pages 268-269, highlighting that morphological and biochemical changes during plant development directly alter the host-pathogen recognition interface.

#### 🧑‍🎓 Student 180830 Notes:
* **Ontogenic Resistance Graphical Models:** Formulated the relationship using three diagrammatic curves:
  - **Fig 1-Ia & Fig 1-Ib:** Represents Pattern I, demonstrating a bell-shaped susceptibility curve over the vegetative and reproductive phases.
  - **Fig 1-II:** Illustrates Pattern II, where susceptibility remains near zero during young stages and spikes sharply as organs enter senescence.
  - **Fig 1-III:** Illustrates Pattern III, where susceptibility is maximum during seedling stages, drops close to zero during mature vegetative growth, and rises slightly at senescence.
*Source: Slide Notes 2.2 (Epidemiology), Slide 20*`
    });

    const qA23 = await Question.create({
      topicId: tModel.id,
      questionText: '[Class Test] How can you control epidemic rate of stem rust of wheat by applying Van der Plank theory? Explain.',
      answerText: `## Answer

Wheat stem rust (*Puccinia graminis* f. sp. *tritici*) is a classic **polycyclic disease** (compound interest disease). Its progress is represented by Van der Plank's exponential growth model:
$$X = X_0 e^{rt}$$
Where:
* $X$ = disease incidence at time $t$
* $X_0$ = initial disease incidence (proportional to initial inoculum $x_0$)
* $r$ = apparent infection rate
* $t$ = time duration of the epidemic

### 1. Controlling the Epidemic Rate ($r$) of Stem Rust

According to Van der Plank's theory, polycyclic pathogens multiply rapidly through multiple asexual cycles (2-30 cycles per season) via airborne urediniospores. Consequently, the apparent infection rate ($r$) is extremely high.

* **Reducing $X_0$ is insufficient:** In polycyclic diseases with a high $r$, reducing the initial inoculum $X_0$ (e.g., through sanitation, seed treatment, or eradicating alternate hosts like barberry) only **delays** the onset of the epidemic. Because the infection rate is exponential, the disease level will quickly catch up and reach devastating proportions.
* **Focus on reducing $r$:** To effectively control stem rust, management strategies must focus on **reducing the apparent infection rate ($r$)** during the crop season. 
  - **Horizontal (Polygenic) Resistance:** Slows down the rate of pathogen reproduction and spore development on the host.
  - **Systemic Fungicides:** Applying systemic fungicides (e.g., triazoles/propiconazole) directly kills active leaf infections, drastically lowering $r$.
  - **Cultural microclimate modification:** Adjusting row spacing to reduce humidity, which slows down spore germination and infection rate.

---

### Student Notes & Perspectives

#### 🧑‍🎓 Student 180837 Notes:
* **Polycyclic Model Application:** Stem rust of wheat is polycyclic. Reducing $r$ (by systemic fungicides or horizontal/non-specific resistance) is far more effective than reducing $X_0$ because of the compounding nature of asexual spore multiplication.

#### 🧑‍🎓 Student 180830 Notes:
* **Strategic Judgement:** If the infection rate $r$ is high, reducing $X_0$ (sanitation, seed treatment) only shifts the disease progress curve to the right (delaying it). Reducing $r$ flattens the curve. Therefore, reducing $X_0$ is only strategic if $r$ is also reduced simultaneously.
*Source: Slide Notes 2.2 (Epidemiology), Slides 12, 28, 37, 56*`
    });

    const qA24 = await Question.create({
      topicId: tModel.id,
      questionText: '[Class Test] Draw and discuss a disease progress curve caused by Colletotrichum gloeosporioides.',
      answerText: `## Answer

*Colletotrichum gloeosporioides* is the fungal pathogen responsible for anthracnose in many crops (such as mango and papaya). It exhibits a unique **Bimodal Disease Progress Curve** over the growing season.

### 1. The Bimodal Disease Progress Curve

Unlike standard sigmoidal curves, a bimodal progress curve has two distinct peaks of disease intensity:

    Disease Severity (X)
      ^
      |      /\ (Peak 1: Blossom)
      |     /  \             /\ (Peak 2: Ripening)
      |    /    \           /  \
      |   /      \_________/    \
      |  /      (Latent Period)  \
      +------------------------------> Time (t)
        Bud-Break            Harvest

* **First Peak (Blossom Stage):** The first spike in disease severity occurs during bud-breaking and flowering (around 20-60 days). The pathogen attacks highly susceptible floral parts, panicles, and young leaves, causing blossom blight.
* **Latent/Quiescent Period:** As flowers set into young, green fruits, the disease progress curve drops or flattens. The pathogen infects the green fruit but remains latent (quiescent) because immature fruits contain high levels of antifungal compounds and lack nutrients.
* **Second Peak (Fruit Ripening Stage):** As the fruit matures and ripens (around 60-120 days), chemical changes occur (sugar content rises, pH changes, and defense compounds decrease). The latent infections quickly reactivate, causing severe anthracnose spots and rot on the ripening fruit, creating the second peak in the curve.

---

### Student Notes & Perspectives

#### 🧑‍🎓 Student 180837 Notes:
* **Bimodal Nature:** Anthracnose caused by *Colletotrichum gloeosporioides* shows two distinct infection periods: the blossom blight stage (early vegetative/flowering) and the fruit ripening stage (late harvest phase).

#### 🧑‍🎓 Student 180830 Notes:
* **Time Scale & Phenology:** The curve is bimodal. During the first 20-60 days (bud breaking and panicle development), disease severity peaks. Between 60 and 90 days, there is a latent period where green fruits show no symptoms. From 90 to 120 days, during fruit ripening and storage, disease severity spikes again.
*Source: Slide Notes 2.2 (Epidemiology), Slide 62, 65, 69*`
    });

    const qA25 = await Question.create({
      topicId: tModel.id,
      questionText: '[Class Test] "The epidemic rate for polycyclic disease is much greater than the rate of epidemic increase for monocyclic disease" Explain with an example.',
      answerText: `## Answer

An epidemic's rate of increase depends heavily on whether the pathogen completes one or multiple life cycles within a single crop growing season.

### 1. Comparison of Monocyclic and Polycyclic Epidemic Rates

* **Monocyclic Diseases (Simple Interest Model):**
  - **Epidemic Rate ($r_m$):** Very low (typically around $0.01$ to $0.02$ units/day).
  - **Characteristics:** The pathogen completes only one cycle per season. The **primary inoculum** is the only source of infection. No secondary spread occurs within the season. The disease progress curve is a **saturation curve**.
  - **Example:** **Loose smut of wheat** (*Ustilago tritici*) or Verticillium wilt. Smutted spikes emerge from infected seeds, wind carries spores to infect healthy flowers, but these infections remain dormant inside the seed until the next year.
* **Polycyclic Diseases (Compound Interest Model):**
  - **Epidemic Rate ($r$):** Extremely high (typically $0.1$ to $0.5$ units/day).
  - **Characteristics:** The pathogen completes multiple cycles (2-30 cycles) per season. Primary inoculum causes initial lesions, which produce massive amounts of asexual spores (**secondary inoculum**). These spores spread through the air or vectors, multiplying the disease exponentially. The disease progress curve is **sigmoidal (S-shaped)**.
  - **Example:** **Late blight of potato** (*Phytophthora infestans*) or wheat stem rust. A single lesion on a potato leaf can produce millions of sporangia, which splash or blow to infect adjacent leaves, causing field-wide destruction in a few days.

---

### Student Notes & Perspectives

#### 🧑‍🎓 Student 180837 Notes:
* **Mathematical Difference:** Polycyclic pathogens produce secondary inoculum (asexual conidia/spores) that spreads exponentially ($r = 0.3 - 0.5$ units/day, e.g., potato late blight). Monocyclic diseases rely solely on primary inoculum and grow slowly like simple interest ($r_m = 0.02$ units/day, e.g., Verticillium wilt).

#### 🧑‍🎓 Student 180830 Notes:
* **Cycle Limitations:** Monocyclic pathogens complete one cycle per year (e.g. loose smut of wheat), progress curve is a saturation curve. Polycyclic completes 2-30 cycles (grain rusts, late blight), spreading explosively due to airborne asexual spores.
*Source: Slide Notes 2.2 (Epidemiology), Slide 23, 31, 33, 38*`
    });

    const qA26 = await Question.create({
      topicId: tDissem.id,
      questionText: '[Class Test] Write down the importance of dissemination of pathogen in epidemic.',
      answerText: `## Answer

**Dissemination** is the physical transport of spores or infectious propagules (acting as inoculum) from a source of origin to a healthy host surface (the infection court) over varying distances. It is a critical link in the disease cycle and epidemic development.

### 1. Key Reasons for the Importance of Dissemination:

* **Pathogen Mobility Limitation:** Most plant pathogens (fungi, bacteria, viruses) have no or extremely limited active mobility. They must disseminate passively using environmental forces to survive.
* **Expanding Disease Foci:** Without dissemination, a disease would remain confined to a single plant or leaf where the initial infection occurred. Dissemination spreads the inoculum, turning a localized spot into field-wide, regional, or continental epidemics.
* **Reaching New Hosts:** Dissemination ensures the pathogen reaches susceptible hosts, secures nutrition, completes its life cycle, and reproduces.
* **Primary and Secondary Dispersal:**
  - **Primary Dispersal:** Disperses primary inoculum to start initial infections (e.g., wind carrying ascospores).
  - **Secondary Dispersal:** Disperses secondary asexual inoculum during the season, driving the exponential phase of polycyclic epidemics (e.g., wind-blown rust urediniospores or rain-splashed bacteria).

---

### Student Notes & Perspectives

#### 🧑‍🎓 Student 180837 Notes:
* **Epidemic Expansion:** Dissemination is essential for disease spread. Since pathogens have limited active movement, wind/water/vectors disperse inocula to healthy hosts, turning localized infections into field-wide epidemics.

#### 🧑‍🎓 Student 180830 Notes:
* **Inoculum Delivery:** Dissemination distributes the primary/secondary inoculum to the infection court. Wind dispersal (rust urediniospores) causes regional/continental epidemics, while water/splash spreads pathogens locally.
*Source: Slide Notes 2.1 (Dissemination of the Pathogen), Slide 10*`
    });

    // Create progress rows for Section A questions
    const qIdsA = [qA1.id, qA2.id, qA3.id, qA4.id, qA5.id, qA6.id, qA7.id, qA8.id, qA9.id, qA10.id, qA11.id, qA12.id, qA13.id, qA14.id, qA15.id, qA16.id, qA17.id, qA18.id, qA19.id, qA20.id, qA21.id, qA22.id, qA23.id, qA24.id, qA25.id, qA26.id];
    for (const id of qIdsA) {
      await Progress.create({ questionId: id, solved: false });
    }


    // ========================================================
    // SECTION B TOPICS & QUESTIONS (Rezaul Sir)
    // ========================================================
    console.log('Seeding Section B (Rezaul Sir) topics and questions...');

    // 1. Topic: Rice Diseases
    const tRice = await Topic.create({ sectionId: secB.id, name: 'Rice Diseases' });

    const qB1 = await Question.create({
      topicId: tRice.id,
      questionText: '[Session 2019-20] How can you distinguish between brown spot and blast diseases of rice in the field?',
      answerText: `## Answer

Rice Blast (*Pyricularia oryzae*) and Brown Spot (*Bipolaris oryzae*) both cause leaf spots, but they can be distinguished in the field using the following criteria:

| Diagnostic Feature | Rice Blast | Brown Spot of Rice |
| :--- | :--- | :--- |
| **Lesion Shape** | **Spindle or eye-shaped** (tapering at both ends). | **Round or oval** spots. |
| **Lesion Center** | **Greyish-white or ash-colored** center. | **Dark brown** center. |
| **Lesion Margin** | Dark brown or reddish-brown margin. | Bright **yellow halo** surrounding the brown spot. |
| **Lesion Behavior** | Lesions quickly enlarge and coalesce, blighting the leaf. | Spots remain localized and circular. |
| **Socio-Economic Nickname**| Known as **"Rich man's disease"** (associated with high nitrogen and high fertility). | Known as **"Poor man's disease"** (associated with nutrient-deficient, poorly managed soil). |
*Source: Slide Notes (Section B - All Disease Differences), Page 1*`
    });

    const qB2 = await Question.create({
      topicId: tRice.id,
      questionText: '[Session 2019-20] Write down the symptoms of brown spot and sheath blight of rice.',
      answerText: `## Answer

### 1. Symptoms of Brown Spot of Rice (*Bipolaris oryzae*)
* **Leaf Spots:** The disease is characterized by numerous small, circular or oval, dark brown spots on the leaves.
* **Yellow Halo:** The spots have a dark brown center surrounded by a distinct light yellow halo.
* **Size:** Spots are usually the size of sesame seeds.
* **Grain Infection:** Dark brown spots also appear on glumes (grain discoloration), reducing seed viability.
* **Famine link:** Historically caused the devastating **Bengal Famine of 1943**.

### 2. Symptoms of Sheath Blight of Rice (*Rhizoctonia solani*)
* **Location:** Lesions start on leaf sheaths near the water level.
* **Appearance:** Large, oval or ellipsoidal, greyish-green lesions develop on the sheath.
* **Cobra Skin:** The lesions enlarge, turn off-white with purple-brown borders, resembling the **skin of a cobra snake**.
* **Sclerotia:** Large, globose, brownish-black **sclerotia** form on the lesions and drop into the water.
*Source: Slide Notes (Section B - Symptoms of Important Diseases); All Disease Differences, Page 1*`
    });

    const qB3 = await Question.create({
      topicId: tRice.id,
      questionText: '[Session 2023-24] Describe the symptoms of blast disease at different growth stages of rice.',
      answerText: `## Answer

Rice Blast (*Pyricularia oryzae*) attacks the rice plant at various growth stages, producing distinct symptoms:

### 1. Leaf Blast Stage (Vegetative Stage)
* Spindle or eye-shaped spots appear on leaves.
* Center of the spot is grey or ash-colored, and the margin is dark brown.
* In susceptible varieties, spots coalesce, causing leaves to dry up and die (blighting).

### 2. Node Blast Stage (Tillering/Flowering Stage)
* Nodes of the stem turn black and become necrotic.
* The infected node becomes weak and easily breaks, causing the plant to fall over (lodging).

### 3. Neck Blast / Panicle Blast Stage (Heading Stage)
* The neck of the panicle just below the grain head is attacked, turning black and rotting.
* **Effect:** If neck blast occurs early, the panicle remains erect but grains are completely empty (chaffy). If it occurs late, grains are partially filled but the neck breaks under the weight.
*Source: Slide Notes (Section B - 1. Rice Diseases), Page 4*`
    });

    const qB4 = await Question.create({
      topicId: tRice.id,
      questionText: '[Session 2023-24] Suggest the measures to be taken to grow blast disease free rice crop.',
      answerText: `## Answer

To grow a blast-free (*Pyricularia oryzae*) rice crop, an Integrated Disease Management (IDM) approach is required:

### 1. Host Resistance
* Grow blast-resistant varieties recommended for the region.

### 2. Balanced Fertilization
* **Avoid excessive Nitrogen (N) fertilizer.** High nitrogen makes the leaf tissue succulent, accelerating blast penetration.
* Apply potassium (K) and silicon (Si) fertilizers, which strengthen cell walls and increase resistance.

### 3. Clean Cultivation and Sanitation
* Burn or destroy crop residues (straw and stubble) from previous infected crops to eliminate the overwintering pathogen.
* Keep fields weed-free to eliminate wild grass hosts.

### 4. Chemical / Seed Treatment
* Treat seeds with fungicides (e.g., Carbendazim/Bavistin or Vitavax-200) to kill seed-borne inoculum.
* Spray systemic fungicides like **Tricyclazole** (Trooper) or **Edifenphos** (Hinosan) upon the first appearance of blast lesions.
*Source: Slide Notes (Section B - 1. Rice Diseases), Page 6*`
    });

    // 2. Topic: Wheat & Barley Diseases
    const tWheat = await Topic.create({ sectionId: secB.id, name: 'Wheat & Barley Diseases' });

    const qB5 = await Question.create({
      topicId: tWheat.id,
      questionText: '[Session 2019-20] Write down the importance of barberry plant for black rust of wheat? List the different types of spores produced by Puccinia graminis tritici in its disease cycle.',
      answerText: `## Answer

### 1. Importance of Barberry Plant (*Berberis vulgaris*)
The barberry plant is the **alternate host** for the heteroecious rust fungus *Puccinia graminis* f. sp. *tritici*.
* **Sexual Reproduction:** The sexual phase of the rust life cycle occurs exclusively on barberry leaves.
* **Genetic Recombination:** Plasmogamy and karyogamy take place on barberry, generating new virulent races of the pathogen through genetic recombination.
* **Primary Source:** Pycniospores and Aeciospores are formed on barberry; Aeciospores are carried by wind to infect nearby wheat crops in spring.
* **Management:** Eradicating barberry plants near wheat fields disrupts the life cycle and reduces primary inoculum.

### 2. Spores Produced by *Puccinia graminis tritici* (Macrocyclic Rust):
*Puccinia graminis* is macrocyclic (produces 5 distinct spore stages):
1. **Urediniospores (Uredospores):** Dikaryotic. Repeats infection on wheat (secondary cycle).
2. **Teliospores:** Dikaryotic to Diploid. Overwintering survival stage on wheat straw.
3. **Basidiospores:** Haploid. Produced from germinating teliospores; infects barberry.
4. **Pycniospores (Spermatia):** Haploid. Involved in spermatization on barberry.
5. **Aeciospores:** Dikaryotic. Formed on barberry; infects wheat.
*Source: Slide Notes (Section B - 2. Wheat Field Crop Diseases)*`
    });

    const qB6 = await Question.create({
      topicId: tWheat.id,
      questionText: '[Session 2018-19] Distinguish between loose smut of wheat/barley and covered smut of barley.',
      answerText: `## Answer

Smut diseases are caused by *Ustilago* species and exhibit distinct visual symptoms at ear emergence:

| Diagnostic Feature | Loose Smut (*Ustilago nuda* / *U. tritici*) | Covered Smut (*Ustilago hordei*) |
| :--- | :--- | :--- |
| **Ear Emergence** | Smutted ears emerge **slightly earlier** than healthy ones. | Smutted ears emerge **later or at same time** as healthy ones. |
| **Sorus Structure** | Grain is completely replaced by a **dusty black mass of spores**. | Grain is replaced by **hard black smut sori**. |
| **Membrane Cover** | Covered by a **delicate, silvery membrane** that breaks quickly. | Covered by a **persistent, tough, grey membrane**. |
| **Spore Dispersal** | Spores are blown away by wind, leaving a bare rachis. | Spores remain enclosed until harvest/threshing. |
| **Causal Agent** | *Ustilago nuda* (Barley) / *U. tritici* (Wheat). | *Ustilago hordei* (Barley). |
*Source: Slide Notes (Section B - All Disease Differences), Page 1*`
    });

    // 3. Topic: Sugarcane Diseases
    const tSugar = await Topic.create({ sectionId: secB.id, name: 'Sugarcane Diseases' });

    const qB7 = await Question.create({
      topicId: tSugar.id,
      questionText: '[Session 2019-20] Draw and describe the symptoms of red rot and smut of sugarcane.',
      answerText: `## Answer

### 1. Symptoms of Red Rot of Sugarcane (*Colletotrichum falcatum*)
* **Canes:** Paler top leaves turn yellow and drop slightly. Canes shrivel, lose weight, and become hollow.
* **Internal Stalk:** Splitting the infected cane longitudinally reveals **bright red internal tissues with distinctive white spots or transverse bands** across the red area.
* **Odour:** The split cane emits a sour, acidic, alcoholic odour due to fermentation.
* **Leaf Midrib:** Red, elongated lesions develop on the midrib of leaves.

### 2. Symptoms of Smut of Sugarcane (*Ustilago scitaminea*)
* **Whip-like Shoot:** The terminal bud of the infected cane is transformed into a **long, black, whip-like structure**, several feet in length.
* **Spore Mass:** The whip is initially covered by a thin, silvery membrane which ruptures to release a dusty mass of black chlamydospores.
* **Shoots:** Excessive tillering occurs, producing slender, flexible, grassy shoots.
*Source: Slide Notes (Section B - 6. Sugarcane Mustard), Page 1*`
    });

    const qB8 = await Question.create({
      topicId: tSugar.id,
      questionText: '[Session 2023-24] Name the cause of sugarcane smut. Describe the symptoms of sugarcane smut and explain the procedure of hot water treatment for its control.',
      answerText: `## Answer

### 1. Causal Agent of Sugarcane Smut
* **Pathogen:** *Ustilago scitaminea* (fungus).

### 2. Symptoms
* Transformation of the growing apex into a **long, curved, black whip-like structure**.
* Silvery-white thin membrane covers the whip initially, later rupturing to release dusty black spores.
* Stunted growth and thin canes.

### 3. Procedure of Hot Water Treatment (HWT)
Hot water treatment is highly effective in destroying internally seed-borne smut mycelium inside the sugarcane setts (seed cuttings).

**Steps:**
1. **Selection:** Select healthy setts from disease-free crop nurseries.
2. **Treatment Bath:** Submerge the sugarcane setts in a temperature-controlled hot water bath.
3. **Temperature & Duration:** 
   * **For Smut Control:** Treat setts at **54°C for 4 hours** (as per slides for Smut/RSD). 
   * *Alternative HWT schedule:* **50°C for 2 hours** or **52°C for 30 minutes** depending on the specific variety tolerance.
4. **Cooling & Planting:** Cool the setts and plant them immediately in well-drained soil.
*Source: Slide Notes (Section B - 6. Sugarcane Mustard), Pages 1, 4*`
    });

    // 4. Topic: Jute & Cotton Diseases
    const tJute = await Topic.create({ sectionId: secB.id, name: 'Jute & Cotton Diseases' });

    const qB9 = await Question.create({
      topicId: tJute.id,
      questionText: '[Session 2019-20] Describe the symptoms of stem rot and black band of jute. Compare and contrast them.',
      answerText: `## Answer

Both Stem Rot and Black Band are major fungal diseases of Jute, but they have distinct symptoms:

### 1. Symptoms of Stem Rot (*Macrophomina phaseolina*)
* **Lesions:** Brownish-black lesions develop on the stem, showing **irregular margins**.
* **Effect:** Lesion expands, girdling the stem, causing stem rot. The plant sheds leaves, the bark rots, and the plant eventually dies.
* **Microscopic:** Single-celled pycnidiospores.

### 2. Symptoms of Black Band (*Diplodia corchori*)
* **Lesions:** Regular-margined black lesions start on the stem, forming a continuous **dense black band** around it.
* **Physical Sign:** On rubbing the infected stem with fingers, the fingers become stained black with smutty spore powder.
* **Microscopic:** Double-celled pycnidiospores.

### Comparison Table:

| Diagnostic Feature | Stem Rot of Jute | Black Band of Jute |
| :--- | :--- | :--- |
| **Lesion Margin** | Irregular margin. | Regular margin. |
| **Frictional Rub Test**| Rubbing the stem **does not** stain fingers black. | Rubbing the stem **stains fingers black** with spores. |
| **Causal Agent** | *Macrophomina phaseolina* | *Diplodia corchori* |
| **Pycnidiospores** | Single-celled. | Double-celled. |
*Source: Slide Notes (Section B - All Disease Differences), Page 1*`
    });

    const qB10 = await Question.create({
      topicId: tJute.id,
      questionText: '[Session 2019-20] Describe the symptoms of angular leaf spot of cotton. How does this disease disseminate? What are the favourable conditions for the development of this disease?',
      answerText: `## Answer

### 1. Symptoms of Angular Leaf Spot of Cotton (*Xanthomonas axonopodis* pv. *malvacearum*)
* **Leaf Spot:** Small, water-soaked, light green spots appear on the underside of the leaves first, which later turn brown and necrotic.
* **Angular Shape:** The spots are bounded by veinlets, giving them a characteristic **angular shape**.
* **Black Arm:** Black lesions extend along the petioles and stems (causing dieback or "black arm").
* **Boll Rot:** Water-soaked lesions on bolls, causing boll rot and lint staining.

### 2. Dissemination
* **Seed-borne:** Pathogen survives on seed lint and fuzz (primary source).
* **Wind-blown Rain splash:** Primary dispersal method within the field.
* **Insects & Machinery:** Physical contact during cultivation.

### 3. Favourable Conditions
* High temperature (above 30°C).
* High relative humidity and wet weather.
* Heavy rains followed by hot sunny days.
* Close crop canopy.
*Source: Slide Notes (Section B - 2. Field Crop Diseases)*`
    });

    // 5. Topic: Pulse & Oilseed Diseases
    const tPulse = await Topic.create({ sectionId: secB.id, name: 'Pulse & Oilseed Diseases' });

    const qB11 = await Question.create({
      topicId: tPulse.id,
      questionText: '[Session 2023-24] Distinguish between symptoms of cercospora leaf spot and rust of groundnut.',
      answerText: `## Answer

### Tikka (Cercospora Leaf Spot) vs. Groundnut Rust

| Feature | Cercospora Leaf Spot (Tikka) | Groundnut Rust |
| :--- | :--- | :--- |
| **Causal Agent** | *Cercospora arachidicola* (Early) & *Cercosporidium personatum* (Late). | *Puccinia arachidis*. |
| **Symptom Type** | Necrotic spots on leaf surfaces. | Pustules (uredinia) on leaf surfaces. |
| **Visual Appearance**| Circular, dark brown spots, often surrounded by a distinct **yellow halo** (especially early spot). | Small, raised, **orange-brown pustules** on the lower leaf surface. |
| **Host Tissue** | Causes tissue death (necrosis). Leaf remains intact but drops. | Pustules rupture, releasing orange powder. Epidermis is destroyed, leaf curls and dries. |
*Source: Slide Notes (Section B - 6. Sugarcane Mustard), Page 2*`
    });

    const qB12 = await Question.create({
      topicId: tPulse.id,
      questionText: '[Session 2023-24] Suggest control measures for foot and root rot of pulses.',
      answerText: `## Answer

Foot and root rot of pulses (caused by *Fusarium* spp. or *Sclerotium rolfsii*) are soil-borne diseases. Recommended control measures include:

### 1. Seed Treatment
* Treat seeds with Vitavax-200 or Provax @ 0.25% of seed weight to eliminate seed-borne inoculum and protect germinating seedlings.

### 2. Cultural Control
* **Crop Rotation:** Rotate pulses with non-susceptible crops like wheat, barley, or mustard for 2-3 years.
* **Deep Ploughing:** Deep summer ploughing exposes soil-borne resting structures (sclerotia) to solar heat, destroying them.
* **Liming:** Apply lime to raise soil pH (as *Fusarium* prefers acidic soils).

### 3. Biological Control
* Soil application of *Trichoderma harzianum* composted with organic matter to parasitize soil pathogens (mycoparasitism).
*Source: Slide Notes (Section B - Rezaul Final/Consolidated Guide)*`
    });

    const qB13 = await Question.create({
      topicId: tPulse.id,
      questionText: '[Session 2023-24] Enlist two major diseases each of oilseeds and pulses with causal agents.',
      answerText: `## Answer

### 1. Major Diseases of Oilseeds:
1. **Alternaria Leaf Spot/Blight of Mustard:**
   * **Causal Agent:** *Alternaria brassicae* (Fungus)
2. **Leaf Spot of Sunflower:**
   * **Causal Agent:** *Alternaria helianthi* (Fungus)

### 2. Major Diseases of Pulses:
1. **Foot and Root Rot of Pulses:**
   * **Causal Agent:** *Sclerotium rolfsii* or *Fusarium oxysporum* (Fungus)
2. **Mungbean Yellow Mosaic:**
   * **Causal Agent:** *Mungbean Yellow Mosaic Virus* (MYMV)
*Source: Slide Notes (Section B - 6. Sugarcane Mustard), Page 2*`
    });

    // Create progress rows for Section B questions
    const qIdsB = [qB1.id, qB2.id, qB3.id, qB4.id, qB5.id, qB6.id, qB7.id, qB8.id, qB9.id, qB10.id, qB11.id, qB12.id, qB13.id];
    for (const id of qIdsB) {
      await Progress.create({ questionId: id, solved: false });
    }

    console.log(`Successfully seeded ${qIdsA.length} Section A questions and ${qIdsB.length} Section B questions!`);
    console.log('Verification count check...');
    
    const countTopics = await Topic.count({ where: { sectionId: sectionIds } });
    const countQuestions = await Question.count({ where: { topicId: topicIds } });
    
    console.log(`Seeded Topics count for Pathology: ${countTopics}`);
    console.log(`Seeded Questions count for Pathology: ${countQuestions}`);
    
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Plant Pathology data:', error);
    process.exit(1);
  }
}

seedPathology();
