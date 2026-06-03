const { sequelize, Course, Section, Topic, Question, Progress } = require('../models');

async function seedSectionB() {
  try {
    console.log('Starting Section B (Rezaul Sir) complete seeding...');

    // Find Course
    const course = await Course.findOne({ where: { code: '3201' } });
    if (!course) {
      throw new Error('Course 3201 (Plant Pathology) not found. Run seed.js first.');
    }
    console.log(`Found Course: ${course.name}`);

    // Find Section B
    const secB = await Section.findOne({ where: { courseId: course.id, name: 'Section B' } });
    if (!secB) {
      throw new Error('Section B not found.');
    }
    console.log(`Found Section B (ID: ${secB.id})`);

    // Clean existing Section B topics, questions, and progress
    const existingTopics = await Topic.findAll({ where: { sectionId: secB.id } });
    const topicIds = existingTopics.map(t => t.id);

    if (topicIds.length > 0) {
      const existingQuestions = await Question.findAll({ where: { topicId: topicIds } });
      const questionIds = existingQuestions.map(q => q.id);

      if (questionIds.length > 0) {
        console.log(`Deleting ${questionIds.length} existing Section B progress rows...`);
        await Progress.destroy({ where: { questionId: questionIds } });

        console.log(`Deleting ${questionIds.length} existing Section B questions...`);
        await Question.destroy({ where: { id: questionIds } });
      }

      console.log(`Deleting ${topicIds.length} existing Section B topics...`);
      await Topic.destroy({ where: { id: topicIds } });
    }

    // Recreate Section B Topics
    const tRice = await Topic.create({ sectionId: secB.id, name: 'Rice Diseases' });
    const tWheat = await Topic.create({ sectionId: secB.id, name: 'Wheat & Barley Diseases' });
    const tSugar = await Topic.create({ sectionId: secB.id, name: 'Sugarcane Diseases' });
    const tJute = await Topic.create({ sectionId: secB.id, name: 'Jute & Cotton Diseases' });
    const tPulse = await Topic.create({ sectionId: secB.id, name: 'Pulse & Oilseed Diseases' });

    console.log('Seeded Section B Topics.');

    const questions = [];

    // ==========================================
    // RICE DISEASES (topicId: tRice.id)
    // ==========================================
    questions.push({
      topicId: tRice.id,
      questionText: 'List six major diseases of rice with causal agents. [Paper 1]',
      answerText: `## Answer

Here are six major diseases of rice along with their causal agents and taxonomic groups:

| # | Disease Name | Causal Agent (Scientific Name) | Pathogen Type |
| :--- | :--- | :--- | :--- |
| 1 | **Rice Blast** | *Pyricularia oryzae* (syn. *Magnaporthe oryzae*) | Fungus |
| 2 | **Brown Spot of Rice** | *Bipolaris oryzae* (syn. *Drechslera oryzae*) | Fungus |
| 3 | **Bacterial Leaf Blight (BLB)** | *Xanthomonas oryzae* pv. *oryzae* | Bacteria |
| 4 | **Sheath Blight** | *Rhizoctonia solani* | Fungus |
| 5 | **Bakanae / Foot Rot** | *Fusarium moniliforme* (syn. *Gibberella fujikuroi*) | Fungus |
| 6 | **Ufra Disease** | *Ditylenchus angustus* | Nematode |
| 7 | **Rice Tungro Disease** | *Rice tungro spherical virus* (RTSV) & *Rice tungro bacilliform virus* (RTBV) | Virus |

*Source: Lecture notes — 7. Scientific Names, Page 1*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'Draw and describe the symptoms of bacterial leaf blight and brown spot of rice. [Paper 1, 5, 6]',
      answerText: `## Answer

### 1. Bacterial Leaf Blight (BLB) of Rice
* **Causal Agent:** *Xanthomonas oryzae* pv. *oryzae* (formerly *Xanthomonas campestris* pv. *oryzae*)
* **Symptoms:**
  * **Leaf Lesions:** Symptoms usually start near the leaf tips or margins as water-soaked stripes. These stripes enlarge, turn pale yellow to straw-colored, and eventually turn dry and greyish-white.
  * **Wavy Margins:** The edges of the active lesions are distinct, characteristically **irregular and wavy**.
  * **Bacterial Ooze:** In humid conditions, milky or turbid droplets of bacterial ooze (exudate) may form on young lesions, drying up into tiny amber-colored crusts.
  * **Cresek Stage (Systemic Infection):** If infection occurs in young seedlings (tillering stage), it leads to systemic wilting where leaves roll, wither, and the entire seedling dies.

### 2. Brown Spot of Rice
* **Causal Agent:** *Bipolaris oryzae* (syn. *Drechslera oryzae* / *Helminthosporium oryzae*)
* **Symptoms:**
  * **Leaf Spots:** Numerous small, circular to oval spots (resembling sesame seeds) appear on the leaves.
  * **Coloration:** The center of the spots is **dark brown to light brown**, surrounded by a distinct **light yellow halo**.
  * **Plant Stages:** Attacks the rice crop at all growth stages (seedling to maturity).
  * **Glume Infection:** Also attacks glumes, producing dark brown to black spots (grain discoloration), which severely reduces seed viability and quality (historically led to the **Bengal Famine of 1943**).

*Source: Lecture notes — 3. Rice, Pages 1-2; 8. All Disease Differences, Page 1*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'Illustrate and describe the disease cycle of brown spot of rice. [Paper 1, 5, 6, 8]',
      answerText: `## Answer

### Disease Cycle of Brown Spot of Rice (*Bipolaris oryzae*)

The disease cycle describes the overwintering, primary infection, dissemination, and secondary cycles of the fungus.

#### 1. Overwintering (Survival)
* **Primary Inoculum:** The pathogen overwinter/survives as **dormant mycelium** or **conidia** inside or on the seed (seed-borne) and in infected crop residues/stubbles in the field (soil-borne).
* **Collateral Hosts:** It can also survive on wild grasses and weeds surrounding the rice fields.

#### 2. Primary Infection
* When contaminated seeds are sown, germinating mycelium infects the coleoptile and young leaves, causing seedling blight and rot.
* Sclerotia or mycelium in plant debris germinate in warm, moist conditions to infect low-lying foliage.

#### 3. Secondary Infection (Dissemination)
* **Conidia Production:** The primary lesions produce numerous conidiophores that bear conidia (spores) in succession.
* **Dissemination:** The conidia are easily detached and disseminated by wind, light rain, and air currents to healthy foliage.
* **Secondary Cycle:** Under high humidity (>90% RH) and warm temperatures (25-30°C), conidia germinate, penetrate the host tissue through stomata or directly, and produce new spots within 6-8 days. This repeating cycle continues throughout the growing season.

#### 4. Grain Infection
* During flowering and milk stages, wind-borne conidia land on the glumes, infecting the grain coat and embedding mycelium, completing the cycle.

\`\`\`mermaid
graph TD
    A[Infected Seeds / Crop Residues] -->|Primary Infection| B[Seedling Germination & Blight]
    B -->|Mycelial Invasion| C[Leaf Lesions / Sesame spots on Leaves]
    C -->|Conidiophores produce Conidia| D[Conidia Disseminated by Wind & Rain]
    D -->|Secondary Infection| E[Healthy Rice Leaves Infected]
    E --> C
    C -->|Infection at Heading Stage| F[Glume / Grain Infection]
    F -->|Harvesting| A
\`\`\`

*Source: Lecture notes — 3. Rice, Pages 1, 3, 4*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'Describe the symptoms of blast disease at different growth stages of rice. [Paper 2, 8]',
      answerText: `## Answer

Rice Blast (*Pyricularia oryzae*) is highly destructive because it attacks the plant at almost all growth stages, presenting four distinct symptom phases:

### 1. Leaf Blast Stage (Vegetative Stage)
* **Lesions:** Typical spindle-shaped or **eye-shaped spots** (tapering at both ends) appear on the leaves.
* **Coloration:** The center of the spot is **grey or ash-colored**, while the margins are dark brown or reddish-brown.
* **Blighting:** In highly susceptible varieties, the leaf spots enlarge rapidly, coalesce, and cause the entire leaf to dry up and die, giving the field a burnt look.

### 2. Collar Blast Stage
* **Location:** The pathogen infects the junction of the leaf blade and the leaf sheath (the collar).
* **Effect:** A dark brown lesion forms around the collar. This cuts off nutrient flow to the leaf blade, killing the entire leaf blade and causing it to drop off.

### 3. Node Blast Stage (Tillering/Flowering)
* **Location:** The pathogen attacks the nodal joints of the stem.
* **Symptoms:** The infected node turns black, dry, and necrotic.
* **Lodging:** The infected nodal tissue becomes weak and fragile, breaking easily under wind pressure or grain weight, causing the plants to fall over (lodge).

### 4. Neck Blast / Panicle Blast Stage (Heading Stage)
* **Location:** The pathogen infects the neck of the panicle (just below the grain head).
* **Symptoms:** The neck tissue turns brown to black, rots, and is covered with greyish mycelial growth.
* **Effects:**
  * **Early Infection (Milk stage):** The neck rots before grains fill. The panicle remains erect, but the grains are completely empty and light-colored (**white head / chaffy grains**).
  * **Late Infection (Dough stage):** Grains are partially filled, but the rotten neck breaks under the weight of the panicles, causing them to hang down or drop off.

*Source: Lecture notes — 3. Rice, Pages 1-2*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'Analyze the favorable conditions of blast disease of rice. [Paper 2]',
      answerText: `## Answer

The development and epidemic spread of Rice Blast (*Pyricularia oryzae*) are highly dependent on specific environmental and agronomic factors:

### 1. High Relative Humidity
* Saturated atmospheric humidity (**90% or higher**) is extremely favorable. Free moisture or water droplets on the leaf surface are essential for conidial germination and appressorium formation.

### 2. High Nitrogenous Fertilization
* Excessive application of Nitrogen (N) fertilizer makes the host plant tissues succulent and soft, drastically reducing cell wall thickness and making them highly susceptible to fungal penetration.

### 3. Low Silica Content
* Inadequate silica (Si) in the soil weakens the physical barrier of the leaf epidermis, facilitating direct fungal penetration.

### 4. Wet Weather and Low Temperature
* Cool night temperatures (**25-28°C** or slightly lower) combined with a long dew period (**10 hours or more**), light drizzle, cloudy skies, and mist create perfect conditions for spore germination and colonization.

### 5. High Planting Density (Close Planting)
* High plant population creates a dense canopy that traps humidity, reduces sunlight penetration, and prolongs leaf wetness, accelerating pathogen multiplication.

*Source: Lecture notes — 3. Rice, Page 3*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'Suggest the measures to be taken to grow blast disease free rice crop. [Paper 2, 5]',
      answerText: `## Answer

Growing a blast-free (*Pyricularia oryzae*) rice crop requires an Integrated Disease Management (IDM) strategy:

### 1. Cultivate Resistant Varieties
* Grow locally recommended blast-resistant varieties such as **BR-3, BR-4, BR-6, BR-8, IR-22**, etc.

### 2. Balanced Fertilization
* **Avoid excessive nitrogenous fertilizers.** Apply nitrogen in split doses.
* Apply adequate Potash (K) and Silica (Si) fertilizers, which strengthen plant cell walls and increase natural physical resistance.

### 3. Clean Cultivation & Sanitation
* Burn or destroy crop residues (straw and stubble) after harvest to eliminate overwintering mycelium.
* Keep fields and borders free of wild grass weeds, which act as collateral hosts.

### 4. Seed and Seedbed Management
* Raise seedlings under wetland conditions instead of dry seedbeds, as dry soil increases susceptibility.
* Sow healthy, clean seeds from certified disease-free fields.

### 5. Chemical / Seed Treatment
* **Seed Treatment:** Treat seeds with fungicides like **Vitavax-200** or Homai @ 0.25% of seed weight to eliminate seed-borne inoculum.
* **Foliar Spray:** Spray systemic fungicides such as **Tricyclazole (Trooper)** or **Hinosan / Edifenphos** @ 0.2% on leaves at the boot stage and panicle emergence if early leaf spots appear.

*Source: Lecture notes — 3. Rice, Page 4*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'List two fungal, two bacterial, two nematode and two viral diseases of rice with their causal agents. [Paper 3, 6]',
      answerText: `## Answer

Here is a list of major rice diseases categorized by pathogen type, along with their causal agents:

### 1. Fungal Diseases
1. **Rice Blast:** *Pyricularia oryzae* (syn. *Magnaporthe oryzae*)
2. **Brown Spot of Rice:** *Bipolaris oryzae* (syn. *Drechslera oryzae*)

### 2. Bacterial Diseases
1. **Bacterial Leaf Blight (BLB):** *Xanthomonas oryzae* pv. *oryzae*
2. **Bacterial Leaf Streak (BLS):** *Xanthomonas oryzae* pv. *oryzicola* (syn. *Xanthomonas campestris* pv. *oryzicola*)

### 3. Nematode Diseases
1. **Ufra Disease:** *Ditylenchus angustus*
2. **White Tip Disease:** *Aphelenchoides besseyi*

### 4. Viral Diseases
1. **Rice Tungro Disease:** *Rice tungro spherical virus* (RTSV) & *Rice tungro bacilliform virus* (RTBV) (co-infection)
2. **Rice Grassy Stunt:** *Rice grassy stunt virus* (RGSV)

*Source: Lecture notes — 7. Scientific Names, Page 1*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'Write down the symptoms of brown spot and sheath blight of rice. [Paper 3]',
      answerText: `## Answer

### 1. Symptoms of Brown Spot of Rice (*Bipolaris oryzae*)
* **Attacked Parts:** Attacks all stages of growth. Spots occur on leaves, leaf sheaths, glumes, and stems.
* **Lesions:** Spots are **more or less round or oval**, typical size of sesame seeds.
* **Coloration:** Center of the spot is dark brown surrounded by a **distinct yellow halo**.
* **Grains:** Maturing grains are discolored with dark brown spots on glumes.

### 2. Symptoms of Sheath Blight of Rice (*Rhizoctonia solani*)
* **Location:** Lesions first develop on the leaf sheaths near the water level.
* **Lesions:** Spots are large, **oval or elliptical**, greyish-green in color.
* **Center & Margin:** Center of the lesion turns straw-colored or off-white, while the margins are dark reddish-brown.
* **Cobra Skin Pattern:** The lesions enlarge, coalesce, and cover large areas of the sheath, resembling the **skin of a cobra snake**.
* **Sclerotia:** Under humid conditions, large, brownish-black globose sclerotia form loosely on the infected sheaths and drop into water.

*Source: Lecture notes — 3. Rice, Page 1; 8. All Disease Differences, Page 1*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'How can you distinguish between brown spot and blast diseases of rice in the field? [Paper 3]',
      answerText: `## Answer

Rice Blast and Brown Spot can be distinguished in the field using the following criteria:

| Feature | Rice Blast (*Pyricularia oryzae*) | Brown Spot (*Bipolaris oryzae*) |
| :--- | :--- | :--- |
| **Lesion Shape** | **Spindle-shaped or eye-shaped** (narrowing at both ends). | **Round or oval-shaped** (like sesame seeds). |
| **Lesion Center** | Light grey or **ash-colored** center. | **Dark brown** center. |
| **Lesion Margin** | Dark brown or reddish-brown border. | Surrounded by a **bright yellow halo**. |
| **Lesion Growth** | Enlarge rapidly, coalesce, blighting the entire leaf. | Spots remain localized and circular. |
| **Socio-Economic Link**| **"Rich man's disease"** (prefers high nitrogen, high fertility fields). | **"Poor man's disease"** (prefers nutrient-deficient, low nitrogen soils). |
| **Crop Growth Stage** | Most destructive at heading/flowering stage (neck blast). | Destructive at all stages, especially seedling and grain filling. |

*Source: Lecture notes — 8. All Disease Differences, Page 1*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'Enumerate the symptoms of blast and bacterial leaf blight of rice with diagram. [Paper 4]',
      answerText: `## Answer

### 1. Symptoms of Rice Blast (*Pyricularia oryzae*)
* **Leaf Phase:** Spindle-shaped or eye-shaped spots with ash-grey centers and dark brown margins.
* **Nodal Phase:** Nodal joints turn black, rot, and lodge (break).
* **Neck Phase:** Rotting at the base of the panicle (neck turns brown/black). Grains remain empty ("white heads") or neck breaks.

### 2. Symptoms of Bacterial Leaf Blight (BLB) (*Xanthomonas oryzae* pv. *oryzae*)
* **Leaf Lesions:** Starts as water-soaked lesions near the leaf tip or margins. Enlarges and turns straw-colored or greyish-white.
* **Margins:** Characterized by **irregular, wavy margins** along the lesion edge.
* **Cresek Stage:** Systemic infection leading to wilting of the whole seedling.
* **Exudate:** Milky bacterial ooze drops appear on the leaves in humid mornings, drying to amber crusts.

*(For exam diagrams: Draw a spindle-shaped spot with ash center/brown border for blast; draw a leaf showing a straw-colored blighted tip with wavy, irregular side margins for BLB).*

*Source: Lecture notes — 3. Rice, Pages 1-2; 8. All Disease Differences, Page 1*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'Prescribe the control measures of stem rot and brown spot of rice. [Paper 4, 7]',
      answerText: `## Answer

Prescription for managing Stem Rot and Brown Spot of Rice:

### 1. Prescription for Stem Rot (*Sclerotium oryzae*)
* **Resistant Varieties:** Grow resistant cultivars like **Biplob, Borishal, Progoti, Mukta**, etc.
* **Sanitation:** Burn stubbles and crop residues after harvest to destroy soil-borne sclerotia.
* **Water Management:** Drain out stagnant water from infected fields. Allow the soil to dry and crack completely before re-watering.
* **Fertilization:** Avoid excess nitrogen. Maintain balanced fertilization with a high ratio of Potash (K).
* **Foliar Spray:** Spray **Benlate, Homai, or Topsin-M** @ 0.2% at the booting stage and repeat before flowering at 9-15 days interval.

### 2. Prescription for Brown Spot (*Bipolaris oryzae*)
* **Resistant Varieties:** Grow cultivars like **Biplob, Brrisail, Progoti, Mukta**, etc.
* **Seed Selection:** Sow clean, healthy seeds from disease-free fields.
* **Seed Treatment:** Perform **Hot Water Treatment** (soak seeds at 50°C for 30 minutes) or treat seeds with **Vitavax-200** @ 0.25% seed weight.
* **Fertilization:** Apply balanced fertilizers. Brown spot is a "poor man's disease", so ensure adequate Nitrogen (N), Potash (K), Magnesium (Mg), and Silica (Si) are applied to deficient soils.
* **Foliar Spray:** Spray **Benlate or Hinosan** @ 0.2% at 10-15 days interval starting from 60 days of seedling.

*Source: Lecture notes — 3. Rice, Page 4*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'Describe the symptoms of brown spot and bacterial leaf blight of rice with labeled diagram. [Paper 5]',
      answerText: `## Answer

Refer to the comparative descriptions of Brown Spot and BLB:

### 1. Brown Spot (*Bipolaris oryzae*)
* Small, circular or oval dark brown spots (sesame seed size) on leaves.
* Spots have a light brown/greyish center and are surrounded by a **distinct yellow halo**.
* Spots are localized and appear at all growth stages.
* Maturing grains show dark brown spots on glumes.

### 2. Bacterial Leaf Blight (BLB) (*Xanthomonas oryzae* pv. *oryzae*)
* Yellowish, straw-colored lesions starting from the tip or edges of the leaf.
* The edges of the lesions are characteristically **irregular and wavy**.
* Systemic seedling wilting (**Cresek stage**).
* Droplets of milky bacterial ooze under humid conditions.

*(Labeled diagram guide: Draw a leaf showing multiple small oval brown spots with yellow halos for brown spot. Draw a leaf with a blighted yellow-white margin extending from the tip downwards with a wavy boundary for BLB).*

*Source: Lecture notes — 3. Rice, Pages 1-2; 8. All Disease Differences, Page 1*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'How can you control blast and stem rot of rice? [Paper 5]',
      answerText: `## Answer

### 1. Control Measures for Rice Blast (*Pyricularia oryzae*)
* **Resistant Cultivars:** Use blast-resistant varieties such as **BR-3, BR-4, BR-6, BR-8, IR-22**, etc.
* **Agronomic Practices:** Avoid dry seedbeds. Avoid excess application of nitrogenous fertilizers. Split nitrogen applications. Apply potassium and silicon.
* **Sanitation:** Burn stubbles and crop residues to destroy overwintering inoculum.
* **Seed Treatment:** Treat seeds with **Vitavax-200** @ 0.25% of seed weight.
* **Foliar Fungicides:** Spray systemic fungicides like **Tricyclazole (Trooper)** or **Hinosan / Edifenphos** @ 0.2% at booting and panicle emergence.

### 2. Control Measures for Stem Rot (*Sclerotium oryzae*)
* **Resistant Cultivars:** Cultivate resistant varieties like **Biplob, Borishal, Progoti, Mukta**, etc.
* **Water Management:** Stem rot is favored by stagnant water. Drain fields, allow the soil to dry and crack before re-watering.
* **Fertilization:** Balanced fertilization (avoid excessive N, apply adequate K).
* **Sanitation:** Burn infected crop stubble and trash immediately after harvest.
* **Chemical Spray:** Spray foliar fungicides like **Benlate, Homai, or Topsin-M** @ 0.2% at the booting stage and before flowering.

*Source: Lecture notes — 3. Rice, Page 4*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'Describe the symptoms of brown spot and false smut of rice with clear diagram. [Paper 6]',
      answerText: `## Answer

### 1. Symptoms of Brown Spot (*Bipolaris oryzae*)
* Localized round or oval spots (sesame seed size) on leaves, glumes, and leaf sheaths.
* Distinct dark brown center surrounded by a **yellow halo**.

### 2. Symptoms of False Smut of Rice (*Ustilaginoidea virens*)
* **Affected Parts:** The pathogen attacks only the individual grains of the panicle during the flowering stage.
* **Smut Balls:** Individual grains are transformed into **large, velvety, globose, orange-green or dark-green spore balls** (smut balls).
* **Scale:** The smut balls can grow to twice the size of a normal grain, enclosing the floral parts.
* **Color progression:** The spore ball is initially orange-yellow, covered by a membrane, which later ruptures, turning olive-green to chalky black.
* **Yield Loss:** Only a few grains per panicle are affected, but adjacent grains fail to fill due to pathogen toxins.

*(Diagram guide: For brown spot, draw oval spots with concentric zones on leaf. For false smut, draw a rice panicle where 2-3 grains are replaced by large, puffy, globose velvety balls).*

*Source: Lecture notes — 3. Rice, Page 1; 7. Scientific Names, Page 1*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'What are the suitable factors of disease development of stem rot and bacterial leaf blight of rice? [Paper 6, 5]',
      answerText: `## Answer

### 1. Favorable Factors for Stem Rot (*Sclerotium oryzae*)
* **Stagnant Water:** Constant presence of stagnant irrigation water in the field allows sclerotia to float, germinate, and infect leaf sheaths at the water level.
* **High Nitrogenous Fertilizer:** High N fertilizer yields succulent host tissues; low Potash (K) weakens structural cell walls.
* **Insect Injury:** Infestation by **stem borers** creates wounds, facilitating pathogen entry into the culm.

### 2. Favorable Factors for Bacterial Leaf Blight (BLB) (*Xanthomonas oryzae* pv. *oryzae*)
* **High Temperature:** Warm temperatures between **25-30°C** are highly favorable.
* **High Nitrogenous Fertilizer:** Encourages rapid vegetative growth and soft succulent tissue.
* **Nutrient Imbalance:** Deficiency in Potash (K) and Phosphorus (P), and excess Silicon and Magnesium.
* **Heavy Rainfall & Flooding:** Heavy rains and flooding disseminate bacterial cells across fields.
* **Severe Winds:** Strong winds cause leaves to rub against each other, creating micro-wounds that allow bacterial entry.

*Source: Lecture notes — 3. Rice, Page 3*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'Enumerate the importance of balance fertilizer application for rice disease control. [Paper 6]',
      answerText: `## Answer

Balanced fertilizer application is a core pillar of cultural disease management in rice. The ratio of macronutrients and micronutrients directly alters host physiology and structural resistance:

### 1. Nitrogen (N) — The Promoter of Susceptibility
* **Effect of Excess N:** Excessive application of Nitrogen makes plant tissues highly succulent and soft, reduces cell wall thickness, and increases the size of stomata.
* **Resulting Diseases:** Greatly increases susceptibility to **Rice Blast, Sheath Blight, Stem Rot, and Bacterial Leaf Blight (BLB)**.
* **Control:** Splitting N applications and applying recommended doses prevents succulent growth.

### 2. Potash (K) — The Disease Suppressor
* **Effect of K:** Potash strengthens cell walls, accelerates the synthesis of phenols, lignin, and phytoalexins (natural defense chemicals), and promotes rapid wound healing.
* **Resulting Diseases:** High K application directly reduces the severity of **Stem Rot, Sheath Blight, and Brown Spot** (which is a nutrient-deficiency "poor man's disease").

### 3. Silica (Si) — The Physical Barrier
* **Effect of Si:** Rice is a silicon-accumulator. Silica deposits in the epidermal cells of leaves, forming a rigid **silicon-cellulose membrane barrier**.
* **Resulting Diseases:** This physical layer prevents direct penetration by fungal appressoria (**Rice Blast, Sheath Blight**) and reduces insect wounding.

### 4. Phosphorus (P), Magnesium (Mg) & Micronutrients
* Balanced application prevents nutrient deficiency stresses that trigger opportunistic pathogens (e.g. **Brown Spot of Rice** thrives in low N, low K, low Mg soils).

*Source: Lecture notes — 3. Rice, Page 3*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'How can you control stem rot and ufra of rice? [Paper 6]',
      answerText: `## Answer

### 1. Control of Stem Rot (*Sclerotium oryzae*)
* **Resistant Cultivars:** Grow resistant varieties like **Biplob, Borishal, Progoti, Mukta**, etc.
* **Field Drainage:** Drain out standing water from infected fields. Allow the soil to dry and crack before re-watering to destroy floating sclerotia.
* **Sanitation:** Burn stubble and plant residues post-harvest to reduce soil-borne sclerotia.
* **Fertilization:** Split N applications and balance with Potash (K).
* **Fungicides:** Spray **Benlate or Homai** @ 0.2% at the booting stage and repeat before flowering.

### 2. Control of Ufra Disease (*Ditylenchus angustus* - Nematode)
* **Resistant Cultivars:** Use cultivars with tolerance or resistance, such as **Digha**.
* **Field Sanitation:** Burn the stubble of the previous infected crop completely during the dry summer.
* **Summer Tillage:** Perform deep summer ploughing to expose soil nematodes to direct solar heat.
* **Water Management & Rotation:** Practice crop rotation and avoid planting in low-lying, permanently flooded areas.
* **Chemical Nematicide:** Apply granular nematicide **Furadan (Carbofuran) @ 5 kg/bigha** to infected fields.
* **Seed Treatment:** Soak seeds in a solution of **Carbofuran** at the rate of 0.3 kg/80 kg seeds.

*Source: Lecture notes — 3. Rice, Page 4*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'Draw and describe the symptoms of blast and bakanae of rice. [Paper 7]',
      answerText: `## Answer

### 1. Rice Blast (*Pyricularia oryzae*)
* Spindle or eye-shaped leaf lesions with grey/ash-grey centers and dark brown margins.
* Black, rotting nodal joints that lodge (break) easily.
* Rotting neck of the panicle (neck blast) leading to erect empty "white heads" (early) or broken panicles (late).

### 2. Bakanae / Foot Rot of Rice (*Fusarium moniliforme* / *Gibberella fujikuroi*)
* **"Bakanae" means "foolish seedling" in Japanese.**
* **Abnormal Height:** Infected plants are **several inches taller** than normal, healthy plants in the seedbed or field.
* **Appearance:** Plants are thin, lean, pale green to yellowish-green in color, and support few tillers.
* **Adventitious Roots:** The infected plants characteristically produce **adventitious roots at the lower nodes** above the soil level.
* **Lodging/Discoloration:** The lower stem shows straw-colored discoloration. Infected tillers usually die before reaching maturity, and surviving plants produce light, empty, or poor panicles.

*(Diagram guide: Draw a normal rice seedling, and next to it draw a bakanae seedling that is much taller, thin, yellow-green, with small adventitious roots emerging from the lower above-ground nodes).*

*Source: Lecture notes — 3. Rice, Page 2; 7. Scientific Names, Page 1*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'Draw and describe the disease cycle of stem rot of rice. [Paper 7]',
      answerText: `## Answer

### Disease Cycle of Stem Rot of Rice (*Sclerotium oryzae*)

#### 1. Survival Stage (Overwintering)
* The pathogen is soil-borne and survives in the field as **black, spherical, minute sclerotia** inside infected rice stubbles, crop residues, or loose in the soil.
* These sclerotia can survive in dry soil for up to 6 years and can float on water.

#### 2. Primary Infection
* **Dissemination:** During field preparation and irrigation, the sclerotia float on stagnant water.
* **Penetration:** Floating sclerotia come into contact with the leaf sheaths of rice plants at the water level. Under favorable warm conditions, they germinate and penetrate the leaf sheath directly or through wounds (often caused by stem borers).

#### 3. Disease Development (Mycelial Stage)
* The mycelium invades the leaf sheath, producing black lesions.
* It penetrates the stem (culm) wall, rotting the vascular bundles and parenchyma tissues. The inside of the culm becomes hollow and turns black.

#### 4. Reproduction & Completion of Cycle
* As the crop matures and the tissues dry, the fungus produces **numerous tiny black sclerotia** inside the hollow culm and leaf sheaths.
* The weakened stems collapse (lodge), and during harvest, stubbles containing sclerotia remain in the soil, completing the cycle.

\`\`\`mermaid
graph TD
    A[Sclerotia in Stubbles / Soil] -->|Irrigation Water| B[Floating Sclerotia at Water Level]
    B -->|Contact & Germination| C[Penetration of Leaf Sheath]
    C -->|Mycelial Invasion| D[Lesions expand, Culm rot]
    D -->|Fungal Multiplication| E[Hollow black culm / Lodging]
    E -->|Harvest / Crop residue| A
\`\`\`

*Source: Lecture notes — 3. Rice, Pages 1, 3, 4*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'Write down the control measures of brown spot and stem rot of rice. [Paper 7]',
      answerText: `## Answer

Refer to the prescription for Brown Spot and Stem Rot:

### 1. Control of Brown Spot (*Bipolaris oryzae*)
* **Cultivar Selection:** Cultivate resistant varieties such as **Biplob, Brrisail, Progoti, Mukta**, etc.
* **Clean Seeds:** Use certified, healthy seeds from disease-free areas.
* **Seed Disinfection:** Perform Hot Water Treatment (50°C for 30 minutes) or treat seeds with **Vitavax-200** @ 0.25% seed weight.
* **Balanced Nutrition:** Apply recommended doses of Nitrogen, Potash, Magnesium, and Silica. Keep the soil wet.
* **Chemical Spray:** Foliar spray of **Benlate or Hinosan** @ 0.2% starting from 60 days of seedling.

### 2. Control of Stem Rot (*Sclerotium oryzae*)
* **Cultivar Selection:** Cultivate resistant varieties like **Biplob, Borishal, Progoti, Mukta**, etc.
* **Water Management:** Drain standing water from infected fields. Keep fields dry and cracked before re-watering.
* **Residue Management:** Burn infected rice stubble and trash immediately after harvest to destroy soil-borne sclerotia.
* **Balanced Fertilization:** Balanced nitrogen and high Potash (K) fertilizer.
* **Chemical Spray:** Foliar spray of **Benlate, Homai, or Topsin-M** @ 0.2% at booting and pre-flowering stages.

*Source: Lecture notes — 3. Rice, Page 4*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'Draw and label the symptoms of Blast, Sheath blight, Bacterial leaf blight, and Bakanae of rice with their causal organisms. [Paper 8]',
      answerText: `## Answer

Here are the causal organisms and key visual diagnostic features of these four major rice diseases:

| Disease Name | Causal Organism | Diagnostic Symptoms | Labeled Diagram Features |
| :--- | :--- | :--- | :--- |
| **Rice Blast** | *Pyricularia oryzae* | Spindle/eye-shaped leaf spots (ash center, dark brown border); black neck rot. | **Spindle-shaped spot** with ash-grey center and dark margins tapering at both ends. |
| **Sheath Blight** | *Rhizoctonia solani* | Large oval/elliptical grey-green lesions near water level, resembling **cobra snake skin** with brownish sclerotia. | **Cobra skin lesions** on leaf sheaths near water line with tiny round sclerotia. |
| **Bacterial Leaf Blight (BLB)** | *Xanthomonas oryzae* pv. *oryzae* | Yellowish/straw-colored leaf blight starting from tip/margins with **irregular, wavy borders**. | Leaf with **wavy-margined necrotic blight** extending downwards from the tip. |
| **Bakanae** | *Fusarium moniliforme* | **"Foolish seedling"**: abnormally tall, thin, yellow-green plants with **adventitious roots at lower nodes**. | **Abnormally tall, thin seedling** with roots emerging from the lower nodes above the ground. |

*Source: Lecture notes — 3. Rice, Pages 1-2; 7. Scientific Names, Page 1; 8. All Disease Differences, Page 1*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'Write down the control measures of stem rot and tungro disease of rice. [Paper 8]',
      answerText: `## Answer

### 1. Control Measures for Stem Rot (*Sclerotium oryzae*)
* **Resistant Cultivars:** Use varieties like **Biplob, Borishal, Progoti, Mukta**, etc.
* **Water Management:** Drain out standing water. Dry the soil completely until it cracks before re-watering.
* **Crop Hygiene:** Burn stubble and plant residues post-harvest. Practice crop rotation.
* **Chemicals:** Foliar spray of **Benlate, Homai, or Topsin-M** @ 0.2% at booting and before flowering.

### 2. Control Measures for Rice Tungro Disease (RTSV & RTBV)
* **Resistant Cultivars:** Grow resistant varieties such as **Mala, BR-5, BR-8, BR-10, BR-12, Kalojira**, etc.
* **Vector Control:** Tungro is transmitted by the Green Leafhopper (*Nephotettix virescens*). Apply systemic insecticides like **Malathion** @ 0.2% or Mipcin to control the leafhopper population in the field.
* **Field Sanitation:** Uproot and destroy infected plants immediately at the early stage. Keep fields free of weeds and wild grasses that harbor the virus and vector.
* **Simultaneous Planting:** Practice synchronized planting in the community to disrupt vector migration.

*Source: Lecture notes — 3. Rice, Page 4*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'How can you manage nemic disease(s) of rice? [Paper 4]',
      answerText: `## Answer

The major nematode (nemic) diseases of rice include **Ufra** (caused by *Ditylenchus angustus*) and **White Tip** (caused by *Aphelenchoides besseyi*).

### Management Strategy for Rice Nematode Diseases:

#### 1. Cultural and Physical Controls
* **Deep Summer Ploughing:** Plough fields deeply during dry summer months. Exposing the soil to hot sun destroys nematodes and their eggs.
* **Stubble Burning:** Burn crop residues and stubbles completely after harvest, as *Ditylenchus angustus* survives in dry stubbles.
* **Crop Rotation:** Rotate rice with non-host crops like pulses, mustard, or fallow periods to break the nematode life cycle.
* **Sowing Date Adjustments:** Adjust sowing dates to avoid favorable moist/warm conditions that accelerate nematode multiplication.

#### 2. Host Plant Resistance
* Cultivate locally resistant or tolerant varieties such as **Digha** (for Ufra).

#### 3. Chemical Control (Nematicides)
* **Soil Application:** Apply granular nematicides like **Furadan (Carbofuran) @ 5 kg/bigha** into the soil of standing water.
* **Seed Treatment:** Soak seeds in a Carbofuran solution @ 0.3 kg per 80 kg of seed weight prior to sowing.

*Source: Lecture notes — 3. Rice, Page 4*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'Give the suitable factors for disease development of bakanae of rice. [Paper 4]',
      answerText: `## Answer

Bakanae / Foot Rot of Rice (caused by *Fusarium moniliforme*) is favored by the following environmental and agronomic conditions:

### 1. High Soil Temperature
* Warm soil temperatures around **35°C** are highly favorable for fungal germination, growth, and secretion of gibberellic acid (which causes abnormal plant elongation).

### 2. Damp Soil Conditions
* Constant dampness or excessive soil moisture encourages rapid growth and systemic colonization of the fungus inside the coleoptile and root tissues.

### 3. Excessive Nitrogenous Fertilization
* Applying high amounts of nitrogenous fertilizers creates soft, succulent plants that are easily penetrated by the fungus.

### 4. Heavy Rainfall and Flooding
* Disseminates the soil-borne conidia and crop residues carrying the fungus across the nursery beds and main fields.

*Source: Lecture notes — 3. Rice, Page 3*`
    });

    questions.push({
      topicId: tRice.id,
      questionText: 'Write about the suitable factors for disease development of stem rot and BLB of rice. [Paper 5]',
      answerText: `## Answer

### 1. Favorable Factors for Stem Rot (*Sclerotium oryzae*)
* **Stagnant Water:** Sclerotia float on stagnant field water, germinating at the water level to infect leaf sheaths.
* **Excessive Nitrogen & Low Potash:** High N yields succulent host tissues; low K reduces the plant's structural strength.
* **Insect Wounds:** Wounds created by **stem borers** provide easy entry ports for the fungus.

### 2. Favorable Factors for Bacterial Leaf Blight (BLB) (*Xanthomonas oryzae* pv. *oryzae*)
* **Warm Temperature:** Favorable temperatures between **25-30°C**.
* **Excess Nitrogen:** Promotes lush, succulent leaf canopy susceptible to bacterial entry.
* **Nutrient Imbalance:** Deficiency of Potash (K) and Phosphorus (P); excess Silicon and Magnesium.
* **Heavy Rainfall & Severe Winds:** Strong winds cause leaves to rub and sustain micro-wounds; heavy rain splashes disperse bacterial cells across the crop canopy.

*Source: Lecture notes — 3. Rice, Page 3*`
    });


    // ==========================================
    // WHEAT & BARLEY DISEASES (topicId: tWheat.id)
    // ==========================================
    questions.push({
      topicId: tWheat.id,
      questionText: 'List different spores produced by the stem rust of wheat. [Paper 4, 5]',
      answerText: `## Answer

Black Rust / Stem Rust of wheat (caused by the heteroecious, macrocyclic fungus *Puccinia graminis* f. sp. *tritici*) produces **five distinct types of spores** in a strict chronological sequence during its life cycle:

| Spore Stage | Spore Name | Ploidy State | Host Plant | Functional Role |
| :--- | :--- | :--- | :--- | :--- |
| **Stage 0** | **Pycniospores** (Spermatia) | Haploid ($n$) | Barberry (*Berberis vulgaris*) | Involved in sexual reproduction (spermatization). |
| **Stage I** | **Aeciospores** | Dikaryotic ($n+n$) | Barberry (*Berberis vulgaris*) | Formed on barberry leaves; carried by wind to infect **wheat**. |
| **Stage II** | **Urediniospores** (Uredospores) | Dikaryotic ($n+n$) | Wheat (*Triticum aestivum*) | Repeating spore stage. Disseminates and multiplies rust on wheat in summer. |
| **Stage III**| **Teliospores** | Dikaryotic to Diploid ($2n$) | Wheat (*Triticum aestivum*) | Overwintering survival stage on dry wheat straw. Undergoes karyogamy. |
| **Stage IV** | **Basidiospores** | Haploid ($n$) | Soil / Wheat Straw | Formed from germinating teliospores in spring; wind-blown to infect **barberry**. |

*Source: Lecture notes — 5. Wheat and Pulse, Pages 1, 3; 7. Scientific Names, Page 3*`
    });

    questions.push({
      topicId: tWheat.id,
      questionText: 'Write six diseases of wheat with their causal agents. [Paper 4]',
      answerText: `## Answer

Here are six major diseases of wheat along with their causal agents:

| # | Disease Name | Causal Agent (Scientific Name) | Pathogen Type |
| :--- | :--- | :--- | :--- |
| 1 | **Black Rust / Stem Rust** | *Puccinia graminis* var. *tritici* | Fungus |
| 2 | **Leaf Rust / Brown Rust** | *Puccinia recondita* (syn. *Puccinia triticina*) | Fungus |
| 3 | **Stripe Rust / Yellow Rust** | *Puccinia striiformis* | Fungus |
| 4 | **Loose Smut of Wheat** | *Ustilago tritici* (syn. *Ustilago nuda*) | Fungus |
| 5 | **Bipolaris Leaf Blotch / Spot** | *Bipolaris sorokiniana* (Perfect: *Cochliobolus sativus*) | Fungus |
| 6 | **Black Point / Seed Smut** | *Bipolaris sorokiniana* / *Fusarium* spp. | Fungal complex |

*Source: Lecture notes — 7. Scientific Names, Page 3*`
    });

    questions.push({
      topicId: tWheat.id,
      questionText: 'List four diseases of wheat with their causal agents. [Paper 5, 6]',
      answerText: `## Answer

Here are four common diseases of wheat along with their causal organisms:

1. **Loose Smut of Wheat:** *Ustilago tritici* (Fungus)
2. **Black Rust / Stem Rust:** *Puccinia graminis* var. *tritici* (Fungus)
3. **Bipolaris Leaf Blotch / Spot:** *Bipolaris sorokiniana* (Fungus)
4. **Leaf Rust / Brown Rust:** *Puccinia recondita* (Fungus)

*Source: Lecture notes — 7. Scientific Names, Page 3*`
    });

    questions.push({
      topicId: tWheat.id,
      questionText: 'Distinguish between loose smut of wheat/barley and covered smut of barley. [Paper 4]',
      answerText: `## Answer

Loose Smut and Covered Smut are major fungal diseases of small grain cereals, distinguished by symptoms and pathogen behavior:

| Feature | Loose Smut (*Ustilago tritici* / *U. nuda*) | Covered Smut (*Ustilago hordei*) |
| :--- | :--- | :--- |
| **Ear Emergence** | Smutted ears emerge **slightly earlier** than healthy ones. | Smutted ears emerge **later or at the same time** as healthy ones. |
| **Sorus/Spore Mass** | Grain is replaced by a **loose, dusty, olive-black mass** of spores. | Grain is replaced by a **hard, enclosed black smut sorus**. |
| **Membrane Cover** | Covered by a **delicate, silvery membrane** that ruptures rapidly. | Covered by a **persistent, tough, grey membrane** that resists easy rupturing. |
| **Spore Dispersal** | Spores are blown away by wind during flowering, leaving a bare rachis. | Spores remain enclosed until harvest and threshing. |
| **Infection Mode** | **Internally seed-borne** (mycelium invades embryonic tissues). | **Externally seed-borne** (spores stick to seed coat during threshing). |
| **Causal Agent** | *Ustilago tritici* (Wheat) / *Ustilago nuda* (Barley). | *Ustilago hordei* (Barley). |

*Source: Lecture notes — 4. Barley,Maize, Cotton and Jute, Pages 1, 3; 8. All Disease Differences, Page 1*`
    });

    questions.push({
      topicId: tWheat.id,
      questionText: 'Write down the importance of barberry plant for black rust of wheat. List the different types of spores produced by Puccinia graminis tritici in its disease cycle. [Paper 3, 8]',
      answerText: `## Answer

### 1. Importance of Barberry Plant (*Berberis vulgaris*) for Black Rust of Wheat
* **Alternate Host:** *Puccinia graminis* is heteroecious (needs two hosts to complete its life cycle). The barberry plant is the vital **alternate host**, while wheat is the primary host.
* **Sexual Reproduction:** The sexual stage (karyogamy and meiosis) of the rust fungus occurs exclusively on the leaves of the barberry plant.
* **Genetic Variation:** Plasmogamy between different mating types occurs on barberry, giving rise to new virulent races of rust through genetic recombination.
* **Primary Inoculum Source:** Aeciospores developed on barberry leaves in spring are blown by wind to infect nearby wheat crops. Discarding barberry plants disrupts this life cycle.

### 2. Spores Produced by *Puccinia graminis* var. *tritici*:
1. **Pycniospores** (Spermatia) - Haploid ($n$), formed on barberry.
2. **Aeciospores** - Dikaryotic ($n+n$), formed on barberry; infects wheat.
3. **Urediniospores** - Dikaryotic ($n+n$), formed on wheat; repeating cycle.
4. **Teliospores** - Dikaryotic to Diploid ($2n$), formed on wheat straw; overwintering.
5. **Basidiospores** - Haploid ($n$), formed on soil/straw; infects barberry.

*Source: Lecture notes — 5. Wheat and Pulse, Pages 1, 3*`
    });

    questions.push({
      topicId: tWheat.id,
      questionText: 'How can you control bipolaris spot/blotch of wheat? [Paper 5]',
      answerText: `## Answer

Control measures for Bipolaris Leaf Blotch / Spot of Wheat (*Bipolaris sorokiniana*):

### 1. Host Resistance
* Cultivate locally recommended resistant wheat varieties.

### 2. Crop Sanitation and Cultural Control
* Burn crop residues, straw, and stubbles after harvest to destroy soil-borne inoculum.
* Practice **Crop Rotation** with non-host crops (e.g. mustard, pulses) for 2-3 years.
* Apply balanced fertilizers. Maintain adequate soil moisture to prevent water stress.

### 3. Seed Management
* Select healthy, clean seeds from certified disease-free fields.
* **Seed Treatment:** Treat seeds with systemic fungicides like **Vitavax-200** @ 0.25% of seed weight to eliminate seed-borne mycelium.

### 4. Foliar Fungicide Spray
* Spray systemic triazole fungicides such as **Tilt (Propiconazole) @ 0.04%** or Companion upon first appearance of leaf spots, and repeat at 15-day intervals if wet/cloudy weather persists.

*Source: Lecture notes — 5. Wheat and Pulse, Page 4*`
    });

    questions.push({
      topicId: tWheat.id,
      questionText: 'Draw and describe the symptoms of bipolaris spot/blotch of wheat. [Paper 8]',
      answerText: `## Answer

### Symptoms of Bipolaris Leaf Blotch / Spot of Wheat (*Bipolaris sorokiniana*)
* **Attacked Stages:** Attacks the wheat plant at all growth stages (seedling to grain filling).
* **Seedling Stage (Rot):** Causes pre-emergence and post-emergence rot. Yellowish oval to oblong spots appear on coleoptiles and young leaves. Spots enlarge and turn dark brown.
* **Leaf Spot Phase:**
  * Small, yellowish-brown spots appear on leaves.
  * Spots enlarge, turning into **oval to oblong spots with dark brown centers**, often surrounded by a light yellow halo.
  * In mature crops, leaf lesions merge, forming large **straw-colored necrotic patches** that dry out leaves completely.
* **Black Point (Grain Phase):** The pathogen infects maturing seeds, causing **black point symptoms** (dark brown to black discoloration) on the embryo end of the grain, reducing germination viability.

*(Diagram guide: Draw a wheat leaf showing multiple oval-oblong dark spots with yellow margins coalescing to form large dry patches. Also draw a wheat grain showing black discoloration at the lower embryo end).*

*Source: Lecture notes — 5. Wheat and Pulse, Page 1; 7. Scientific Names, Page 3*`
    });

    questions.push({
      topicId: tWheat.id,
      questionText: 'Write down the suitable factors for disease development of sheath blight of rice and brown spot of mustard. [Paper 8]',
      answerText: `## Answer

Environmental and cultural factors that promote disease development:

### 1. Sheath Blight of Rice (*Rhizoctonia solani*)
* **Warm Temperature and High Humidity:** Temperatures around **28-32°C** and relative humidity of **95% or higher** are highly favorable.
* **Excessive Nitrogenous Fertilization:** High N fertilizer produces dense, soft, and succulent foliage that the fungus easily penetrates.
* **High Planting Density (Close Spacing):** Traps humidity and moisture inside the crop canopy, prolonging leaf wetness.

### 2. Brown Spot / Alternaria Blight of Mustard (*Alternaria brassicae*)
* **Foggy and Wet Weather:** Cool temperatures (**15-20°C**), dense morning fog, high moisture, and cloudy skies are highly favorable.
* **Long Dew Period:** Prolonged leaf wetness (>10 hours) is critical for conidial germination.
* **Excessive Nitrogen:** Softens leaf tissue, making it susceptible.
* **Sowing Date:** Crops sown late (after November 25) are highly vulnerable to peak fog periods.

*Source: Lecture notes — 3. Rice, Page 3; 6. Sugarcane, Mustard, Sunflower, Groundnut, Page 3*`
    });


    // ==========================================
    // SUGARCANE DISEASES (topicId: tSugar.id)
    // ==========================================
    questions.push({
      topicId: tSugar.id,
      questionText: 'Draw and describe the symptoms of red rot and smut of sugarcane. [Paper 3, 4, 5, 7, 8]',
      answerText: `## Answer

### 1. Symptoms of Red Rot of Sugarcane (*Colletotrichum falcatum*)
* **Attacked Stage:** Recognized when canes are nearing maturity.
* **Foliar Symptoms:** The third or fourth leaf from the top turns pale, yellow, and drops slightly. The margins dry up, and eventually the entire crown dries.
* **Midrib Spots:** Dark reddish elongated lesions appear on the **leaf midribs**, which develop grey centers.
* **Internal Stalk Symptoms:** Splitting the cane longitudinally reveals the primary diagnostic feature: **bright red internal tissues with distinctive white spots or transverse bands** across the red area.
* **Cane Quality:** Canes shrink, shrivel, lose weight, and become hollow.
* **Odour:** Emits a sour, acidic, fermented alcoholic odor when split.

### 2. Symptoms of Smut of Sugarcane (*Ustilago scitaminea*)
* **Whip-like Shoot:** The terminal bud/growing apex of the sugarcane stalk is transformed into a **long, curved, black whip-like structure**, several feet in length.
* **Silvery Membrane:** The whip is initially covered by a thin, silvery-white membrane which soon ruptures, releasing a dusty, black cloud of chlamydospores.
* **Tillering:** Excessive tillering occurs, producing numerous slender, thin, grassy shoots that are flexible and devoid of leaves.

*(Diagram guide: For Red Rot, draw a split sugarcane stem showing red-stained tissues with distinct white horizontal/transverse bands. For Smut, draw a grass-like cane stool where the main shoot terminates in a long, black curved whip).*

*Source: Lecture notes — 6. Sugarcane, Mustard, Sunflower, Groundnut, Pages 1, 4*`
    });

    questions.push({
      topicId: tSugar.id,
      questionText: 'What are the suitable factors for the disease development of red rot and smut of sugarcane? [Paper 3]',
      answerText: `## Answer

### 1. Favorable Factors for Red Rot of Sugarcane (*Colletotrichum falcatum*)
* **Poor Soil Drainage:** Soil waterlogging and high moisture favor fungal spore survival and primary infection.
* **Unfavorable Temperatures:** Bud germination in cold, damp soil conditions slows growth and increases infection.
* **Insect Injuries:** Wounds caused by **stalk borers, moth borers, and sugarcane weevils** provide easy entry points for fungal spores.
* **Mechanical Damage:** Injuries to setts during cutting, handling, or planting.
* **Monoculture:** Continuous cultivation of susceptible cultivars.

### 2. Favorable Factors for Smut of Sugarcane (*Ustilago scitaminea*)
* **Warm and Dry Climate:** Dry windy conditions followed by rains facilitate spore release and wind dispersal.
* **Temperature:** Temperatures between **25-35°C** favor chlamydospore germination.
* **Infested Seed Setts:** Planting sugarcane setts harvested from smut-infected fields.
* **Ratoon Cropping:** Ratooning an infected field keeps the mycelium active in stubbles.

*Source: Lecture notes — 6. Sugarcane, Mustard, Sunflower, Groundnut, Page 3*`
    });

    questions.push({
      topicId: tSugar.id,
      questionText: 'Describe symptoms of red rot of sugarcane and its effect on yield. [Paper 2]',
      answerText: `## Answer

### 1. Symptoms of Red Rot of Sugarcane (*Colletotrichum falcatum*)
* Pale, yellow, and drooping upper leaves (third and fourth leaves). Canes wither and shrivel.
* Red elongated lesions on leaf midribs.
* **Longitudinal Split:** Splitting the stalk reveals **red internal tissues showing white transverse spots or bands**.
* **Sour Alcoholic Odour:** Fermented smell due to sugars rotting.

### 2. Effect of Red Rot on Yield (Socio-Economic Impact)
Red rot is called the "cancer of sugarcane" due to its devastating economic impacts:
* **Sucrose Destruction:** The fungus breaks down sucrose into glucose and fructose, drastically **reducing sugar content** and rendering juice unfit for sugar extraction.
* **Tonnage Loss:** Stalks shrivel, turn hollow, dry up, and lose weight, leading to massive tonnage losses (up to 100% loss in susceptible cultivars).
* **Ratoon Failure:** Ratoon crops fail completely as the pathogen kills the underground stubble.
* **Famine-like Impact:** Causes complete crop failure over large areas, forcing sugar mills to shut down.

*Source: Lecture notes — 6. Sugarcane, Mustard, Sunflower, Groundnut, Pages 1, 4*`
    });

    questions.push({
      topicId: tSugar.id,
      questionText: 'Write short notes on mosaic diseases of sugarcane. [Paper 2]',
      answerText: `## Answer

### Short Notes: Sugarcane Mosaic Disease

#### 1. Etiology (Pathogen)
* **Causal Agent:** *Sugarcane Mosaic Virus* (SCMV), a Potyvirus.

#### 2. Symptoms
* **Leaf Patches:** Typical symptoms appear on young leaves as **oval to elongated pale-yellow/chlorotic patches** of irregular size.
* **Mosaic Pattern:** The patches alternate with green areas, forming a mosaic pattern. It is most visible on young, rapidly unfolding leaves.
* **Internodes & Growth:** Infected canes turn thin, internodes are shortened, and plants are stunted. Red-brown necrotic stripes may appear on stems in severe cases.

#### 3. Transmission (Dissemination)
* **Primary:** Primarily transmitted through **infected seed setts** (cuttings).
* **Secondary:** Transmitted mechanically by sap and by insect vectors, mainly **aphids** (e.g. *Aphis maidis*).

#### 4. Control Measures
* Cultivate virus-free setts from certified nurseries.
* Grow resistant sugarcane varieties.
* Rogue out and destroy infected sugarcane clumps.
* Control insect vectors (aphids) using timely insecticide sprays.

*Source: Lecture notes — 6. Sugarcane, Mustard, Sunflower, Groundnut, Pages 1, 4; 7. Scientific Names, Page 2*`
    });

    questions.push({
      topicId: tSugar.id,
      questionText: 'Name the cause of sugarcane smut. Describe the symptoms and explain hot water treatment for its control. [Paper 2]',
      answerText: `## Answer

### 1. Causal Agent of Sugarcane Smut
* **Pathogen:** *Ustilago scitaminea* (Fungus).

### 2. Symptoms
* The growing apex is transformed into a **long, curved, black whip-like structure**, which can grow several feet.
* Dusty black spore mass (chlamydospores) is released when the enclosing silvery membrane ruptures.
* Excessive tillering occurs, producing thin, flexible, grassy shoots.

### 3. Hot Water Treatment (HWT) for Control
Hot Water Treatment is a physical method used to eradicate internally seed-borne smut mycelium from sugarcane setts.

#### Procedure of HWT:
1. **Sett Selection:** Harvest healthy setts from certified, smut-free nurseries.
2. **Water Bath Preparation:** Set up a hot water treatment tank equipped with temperature regulators.
3. **Submersion:** Immerse the setts into the water bath.
4. **Treatment Schedule:** Keep setts submerged at a constant **54°C for 4 hours**. (Note: This long duration completely kills internal smut mycelium without destroying the sugarcane buds).
5. **Post-treatment:** Cool the treated setts and plant them in well-prepared, disease-free soil.

*Source: Lecture notes — 6. Sugarcane, Mustard, Sunflower, Groundnut, Pages 1, 4*`
    });

    questions.push({
      topicId: tSugar.id,
      questionText: 'How can you prevent/control red rot of sugarcane? [Paper 5, 7]',
      answerText: `## Answer

Preventative and curative control measures for Red Rot of Sugarcane (*Colletotrichum falcatum*):

### 1. Host Resistance
* Cultivate locally recommended resistant sugarcane varieties, such as **Iswardi-2/54, Iswardi-16, and Iswardi-17**.

### 2. Crop Sanitation and Hygiene
* Rogue out infected clumps, carry them away, and **burn them completely** to destroy soil-borne inoculum.
* Avoid ratooning in fields that had red rot.

### 3. Healthy Seed Setts
* Collect setts only from healthy, disease-free nursery plants.
* **Coal-tar Dip:** Dip the cut ends of sugarcane setts in **coal-tar** prior to planting to prevent fungal entry through open wounds.

### 4. Insect Control
* Apply insecticides to control stalk and shoot borers, preventing borer injury wounds that serve as entry points.

### 5. Physical Seed Treatment
* Subject setts to Hot Water Treatment (HWT) at **55°C for 10 minutes** before planting to eradicate superficial fungal spores.

*Source: Lecture notes — 6. Sugarcane, Mustard, Sunflower, Groundnut, Page 4*`
    });

    questions.push({
      topicId: tSugar.id,
      questionText: 'How can you control the red rot and smut of sugarcane? [Paper 7]',
      answerText: `## Answer

### 1. Control of Red Rot (*Colletotrichum falcatum*)
* Cultivate resistant varieties (**Iswardi-2/54, Iswardi-16, Iswardi-17**).
* Collect setts from certified disease-free fields.
* Dip the cut ends of setts in coal-tar.
* Burn infected crop debris and stubbles.
* Control insect borers with insecticides.
* HWT at **55°C for 10 minutes**.

### 2. Control of Smut (*Ustilago scitaminea*)
* Cultivate resistant sugarcane cultivars.
* Rogue out and destroy smut-infected plants carefully (cover whips with paper bags before uprooting to prevent spore dispersal).
* Collect seed setts from healthy crops.
* **Hot Water Treatment:** Soak setts at **54°C for 4 hours** prior to planting.
* Avoid ratooning infected fields.
* Destroy weed hosts and wild cane grasses.

*Source: Lecture notes — 6. Sugarcane, Mustard, Sunflower, Groundnut, Page 4*`
    });

    questions.push({
      topicId: tSugar.id,
      questionText: 'How can you control smut of sugarcane and mosaic of mungbean? [Paper 6]',
      answerText: `## Answer

### 1. Control of Sugarcane Smut (*Ustilago scitaminea*)
* **Resistant Varieties:** Grow smut-resistant sugarcane cultivars.
* **Hot Water Treatment:** Subject seed setts to **HWT at 54°C for 4 hours** to kill internal mycelium.
* **Sanitation:** Uproot and burn infected cane stools immediately. Avoid ratoon cropping in infected fields.
* **Healthy Seed:** Collect setts from certified nurseries.

### 2. Control of Mosaic of Mungbean (Mungbean Yellow Mosaic Virus - MYMV)
* **Resistant Varieties:** Cultivate high-yielding resistant cultivars such as **BARI Mung-5, BARI Mung-6, BARI Mash-1, 2, 3**.
* **Vector Control:** The virus is transmitted by Whitefly (*Bemisia tabaci*). Spray systemic insecticides like **Malathion @ 0.2%** or Dimethoate to control the whitefly vector.
* **Uprooting (Roguing):** Uproot and burn virus-infected mungbean plants at the early seedling stage to prevent disease spread.
* **Weed Control:** Destroy wild weed hosts (e.g. *Croton sparsiflorus*) around the field borders.

*Source: Lecture notes — 5. Wheat and Pulse, Page 4; 6. Sugarcane, Mustard, Sunflower, Groundnut, Page 4*`
    });

    questions.push({
      topicId: tSugar.id,
      questionText: 'How can you control the mosaic and smut of sugarcane? [Paper 8]',
      answerText: `## Answer

### 1. Control of Sugarcane Mosaic (SCMV)
* **Healthy Setts:** Collect seed setts only from certified, virus-free nurseries.
* **Vector Management:** Spray insecticides timely to control the aphid vectors (*Aphis maidis*) that transmit SCMV.
* **Sanitation:** Rogue out and destroy infected sugarcane clumps. Clean field borders of wild weed grasses.
* **Resistance:** Cultivate mosaic-resistant sugarcane varieties.

### 2. Control of Sugarcane Smut (*Ustilago scitaminea*)
* **Seed Treatment:** Subject sugarcane setts to **HWT at 54°C for 4 hours** prior to planting.
* **Sanitation:** Carefully bag and remove smut-whip stools and burn them. Avoid ratoon cropping in infested fields.
* **Host Resistance:** Plant smut-resistant varieties.

*Source: Lecture notes — 6. Sugarcane, Mustard, Sunflower, Groundnut, Page 4*`
    });

    questions.push({
      topicId: tSugar.id,
      questionText: 'List two diseases of sugarcane with their causal organisms. [Paper 7]',
      answerText: `## Answer

Two major sugarcane diseases and their causal agents:

1. **Red Rot of Sugarcane:** *Colletotrichum falcatum* (Fungus)
2. **Sugarcane Smut:** *Ustilago scitaminea* (Fungus)

*Source: Lecture notes — 7. Scientific Names, Page 2*`
    });


    // ==========================================
    // JUTE & COTTON DISEASES (topicId: tJute.id)
    // ==========================================
    questions.push({
      topicId: tJute.id,
      questionText: 'List four diseases of jute and two diseases of cotton with their causal agents. [Paper 3, 6, 7]',
      answerText: `## Answer

Here is a list of major fiber crop diseases along with their causal pathogens:

### 1. Jute Diseases (Four Diseases)
1. **Stem Rot of Jute:** *Macrophomina phaseolina* (Fungus)
2. **Black Band of Jute:** *Botryodiplodia theobromae* (syn. *Diplodia corchori*) (Fungus)
3. **Anthracnose of Jute:** *Colletotrichum corchorum* (Fungus)
4. **Jute Mosaic Disease:** *Jute Mosaic Virus* (JMV)

### 2. Cotton Diseases (Two Diseases)
1. **Angular Leaf Spot of Cotton:** *Xanthomonas malvacearum* (syn. *Xanthomonas axonopodis* pv. *malvacearum*) (Bacteria)
2. **Fusarium Wilt of Cotton:** *Fusarium oxysporum* f. sp. *vasinfectum* (Fungus)

*Source: Lecture notes — 7. Scientific Names, Pages 1-2*`
    });

    questions.push({
      topicId: tJute.id,
      questionText: 'Describe the symptoms of stem rot and black band of jute. [Paper 3, 5, 7]',
      answerText: `## Answer

### 1. Symptoms of Stem Rot of Jute (*Macrophomina phaseolina*)
* **Growth Stages:** Plants are infected at all growth stages (damping-off in seedlings to mature rotting).
* **Seedling Stage:** Causes pre- and post-emergence damping-off.
* **Mature Stem spots:** Buff-colored to dark-brown lesions appear along the apex, margins, midrib, and petioles of leaves, moving to the stem.
* **Lesions:** Spots on the stem show **irregular margins**. The bark rots and is easily stripped off.
* **Exposed Fibres:** Stem rotting exposes the underlying inner wood and fibers, which decay (canker).
* **Frictional Rub Test:** Rubbing the infected stem between hands **does not** stain fingers black with spores.
* **Spore Type:** Fructification yields single-celled pycnidiospores.

### 2. Symptoms of Black Band of Jute (*Diplodia corchori* / *Botryodiplodia theobromae*)
* **Dense Black Band:** Characterized by a **dense black band** around the stem, usually 2-3 feet above the ground level.
* **Lesions:** Spots have characteristically **regular margins**.
* **Leaves & Stem:** Plants lose all leaves, dry up, and remain standing in the field as black stems.
* **Spherical Pycnidia:** The black band is covered with minute spherical pycnidia.
* **Frictional Rub Test:** On rubbing fingers up and down on the infected stem, the **fingers become stained black** with smutty pycnidiospore powder.
* **Spore Type:** Fructification yields double-celled pycnidiospores.

*Source: Lecture notes — 4. Barley,Maize, Cotton and Jute, Pages 2, 4; 8. All Disease Differences, Page 1*`
    });

    questions.push({
      topicId: tJute.id,
      questionText: 'How can you control anthracnose of jute? [Paper 3, 5]',
      answerText: `## Answer

Anthracnose of Jute is caused by the fungus *Colletotrichum corchorum*. Recommended control measures:

### 1. Seed Sanitation
* Collect seeds from healthy, anthracnose-free jute crops.
* **Seed Treatment:** Treat seeds with systemic fungicides like **Vitavax-200** or Homai @ 0.25% of seed weight to eliminate seed-borne inoculum.

### 2. Agronomic & Cultural Practices
* Burn and destroy infected crop residues (stems, leaves, pods) after harvest.
* Practice **Crop Rotation** with non-susceptible crops for 2-3 years.
* Balance nitrogenous fertilization with adequate Potash (K).

### 3. Foliar Fungicide Spray
* Spray the crop with **Dithane M-45** or Mancozeb @ 0.2% at 15-day intervals starting from the first appearance of yellowish-brown depressed cankers.

### 4. Resistant Cultivars
* Grow resistant varieties recommended for the species:
  * For *C. capsularies*: D154, CVL-1, CVE-3, CC-45.
  * For *C. olitorius*: O-4, O-9897.

*Source: Lecture notes — 4. Barley,Maize, Cotton and Jute, Page 4*`
    });

    questions.push({
      topicId: tJute.id,
      questionText: 'Describe the symptoms of angular leaf spot of cotton. How does this disease disseminate? What are the favourable conditions? [Paper 3, 8]',
      answerText: `## Answer

### 1. Symptoms of Angular Leaf Spot of Cotton (*Xanthomonas malvacearum*)
* **Cotyledon spots:** Round to irregular water-soaked spots appear on germinating cotyledons.
* **Angular Leaf spots:** Small, water-soaked, light-green spots appear on the underside of leaves. These spots enlarge, turn brown to black, and are strictly bounded by veinlets, giving them a distinct **angular shape**.
* **Black Arm Stage:** Lesions extend along the petioles and stems, turning them black. The stem rots and breaks easily (stem dieback).
* **Boll Rot:** Water-soaked lesions appear on bolls, causing boll rot, rotting of seeds, and staining of cotton lint.

### 2. Dissemination (Spread)
* **Seed lint/fuzz:** The primary source of inoculum is internally/externally seed-borne bacteria on lint and fuzz.
* **Wind-blown Rain splash:** The main method of secondary spread within the field.
* **Irrigation Water:** Carries bacteria from infected plant debris to healthy roots.
* **Machinery & Cultivation:** Human contact and machinery during weeding.

### 3. Favorable Conditions
* High temperature (**above 30°C**).
* High relative humidity, persistent morning fog, and wet weather.
* Furrow irrigation or stagnant water in the field.
* Close planting spacing creating a dense humid canopy.

*Source: Lecture notes — 4. Barley,Maize, Cotton and Jute, Pages 1-3*`
    });

    questions.push({
      topicId: tJute.id,
      questionText: 'How can you control the angular leaf spot of cotton? [Paper 4, 5, 7]',
      answerText: `## Answer

Control measures for Angular Leaf Spot of Cotton (*Xanthomonas malvacearum*):

### 1. Healthy Seeds & Sanitation
* Collect seeds only from certified disease-free cotton plants.
* **Acid Delinting:** Treat cotton seeds with concentrated sulfuric acid to destroy external lint-borne bacteria.

### 2. Cultural Practices
* Burn and decompose all infected plant residues, leaves, and bolls after harvest.
* Practice **Crop Rotation** with non-host crops for at least 2 years.
* Space rows properly to allow sunlight and airflow, reducing canopy humidity.

### 3. Host Resistance
* Plant locally recommended resistant cotton varieties.

### 4. Chemical / Defoliation Measures
* Use chemical defoliants late in the season to drop leaves early, which reduces late boll rot and prevents lint staining by bacterial ooze.
* Spray copper fungicides (e.g. Copper Oxychloride @ 0.3%) combined with Streptomycin if symptoms appear early.

*Source: Lecture notes — 4. Barley,Maize, Cotton and Jute, Page 3*`
    });

    questions.push({
      topicId: tJute.id,
      questionText: 'Compare and contrast between stem rot and black band of jute. [Paper 4, 7]',
      answerText: `## Answer

Comparative diagnostic features:

| Diagnostic Feature | Stem Rot (*Macrophomina phaseolina*) | Black Band (*Botryodiplodia theobromae*) |
| :--- | :--- | :--- |
| **Lesion Margin** | Spots have an **irregular margin**. | Spots have a **regular margin**. |
| **Frictional Rub Test**| Rubbing the stem **does not** stain fingers black. | Rubbing the stem **stains fingers black** with dusty spores. |
| **Lesion Shape/Band** | Irregular rotting patches along the stem. | Forms a continuous **dense black band** around the stem. |
| **Foliar signs** | Leaves wilt, bark rots, plant falls over. | Plants shed leaves, stem turns charcoal dry, stands erect. |
| **Causal Agent** | *Macrophomina phaseolina* | *Botryodiplodia theobromae* (syn. *Diplodia corchori*) |
| **Pycnidiospores** | **Single-celled** pycnidiospores. | **Double-celled** pycnidiospores. |
| **Infection Mode** | Soil-borne and seed-borne. | Soil-borne, wound invader. |

*Source: Lecture notes — 8. All Disease Differences, Page 1*`
    });

    questions.push({
      topicId: tJute.id,
      questionText: 'Draw and describe the disease cycle of stem rot of jute. [Paper 4, 7]',
      answerText: `## Answer

### Disease Cycle of Stem Rot of Jute (*Macrophomina phaseolina*)

#### 1. Survival Stage (Primary Inoculum)
* The pathogen is soil-borne and seed-borne.
* It survives as **tiny black sclerotia** in infected crop stubbles/residues in the soil or as dormant mycelium/sclerotia inside the seed coat.

#### 2. Primary Infection
* **Sowing:** When infected seeds germinate, the mycelium infects the radicle and plumule, causing pre-emergence damping-off.
* **Soil Infection:** Sclerotia in the soil germinate under warm, moist conditions (>30°C) and infect the collar region of seedlings, producing basal lesions.

#### 3. Disease Development & Secondary Spread
* **Multiplication:** The mycelium invades the cortical tissues and vascular bundles of the stem. The bark decays, exposing the inner wood.
* **Pycnidia formation:** The pathogen produces numerous spherical fruiting structures called **pycnidia** on stem lesions.
* **Secondary Inoculum:** Pycnidia release single-celled pycnidiospores.
* **Dissemination:** Rain splashes and wind carry pycnidiospores to infect the leaves and stems of healthy adjacent jute plants.

#### 4. Seed and Soil Contamination
* The fungus infects the seed pods (capsules), contaminating the seeds.
* As the infected plants lodge and rot, millions of sclerotia are released back into the soil, completing the cycle.

\`\`\`mermaid
graph TD
    A[Sclerotia in Soil / Infected Seed] -->|Germination| B[Basal Rot / Seedling Damping-off]
    B -->|Mycelial Colonization| C[Irregular Rotting on Stem & Leaves]
    C -->|Fructification| D[Pycnidia produce Pycnidiospores]
    D -->|Rain Splash & Wind| E[Secondary Infection on Healthy Plants]
    E --> C
    C -->|Pod Infection| F[Contaminated Seeds]
    C -->|Decomposition| A
\`\`\`

*Source: Lecture notes — 4. Barley,Maize, Cotton and Jute, Pages 2, 4*`
    });

    questions.push({
      topicId: tJute.id,
      questionText: 'Illustrate the symptoms of stem rot and anthracnose of jute. [Paper 6]',
      answerText: `## Answer

Both diseases cause stem lesions but have distinct diagnostic features:

### 1. Symptoms of Stem Rot of Jute (*Macrophomina phaseolina*)
* Irregular margins on stem lesions.
* Decay of bark, causing the fibers to be exposed and rot.
* Rubbing the stem does not turn fingers black.

### 2. Symptoms of Anthracnose of Jute (*Colletotrichum corchorum*)
* **Stalk Spots:** Characterized by **yellowish-brown, water-soaked, depressed spots (cankers)** on the stem.
* **Cankerous Crack:** The spots darken to brown and finally black. The center of the lesion develops distinct cracks, exposing the fibers (**cankerous symptoms**).
* **Foliar Spots:** Necrotic brown spots develop on leaves, and pods (capsules) develop sunken necrotic lesions.

*(Diagram guide: For stem rot, draw irregular rotting patches stripping the bark. For anthracnose, draw a stem showing clean-edged depressed oval cankers that are cracked in the center to expose internal fibers).*

*Source: Lecture notes — 4. Barley,Maize, Cotton and Jute, Pages 2, 4*`
    });

    questions.push({
      topicId: tJute.id,
      questionText: 'How can you control the stem rot of jute and angular leaf spot of cotton? [Paper 6]',
      answerText: `## Answer

### 1. Control of Stem Rot of Jute (*Macrophomina phaseolina*)
* **Healthy Seeds:** Collect seeds from healthy, disease-free plants.
* **Seed treatment:** Treat seeds with **Vitavax-200** or Homai @ 0.25% of seed weight.
* **Agronomy:** Rotate crops (especially with *C. olitorius*). Burn infected residues and stubbles. Use balanced fertilizers (avoid excess N, apply adequate K).
* **Fungicides:** Spray the crop with **Dithane M-45** or Mancozeb @ 0.2% at 15-day intervals.
* **Resistant Cultivars:** Use BRRI-released resistant varieties (e.g. CVL-1, O-4).

### 2. Control of Angular Leaf Spot of Cotton (*Xanthomonas malvacearum*)
* **Clean Seeds:** Use certified disease-free seeds.
* **Seed Delinting:** Treat cotton seeds with concentrated sulfuric acid to destroy external lint-borne bacteria.
* **Sanitation:** Burn and destroy all infected plant residues, leaves, and bolls post-harvest.
* **Crop Rotation:** Practice crop rotation for 2-3 years.
* **Spray:** Spray copper fungicides (e.g., Copper Oxychloride @ 0.3%) combined with Streptomycin upon first appearance.

*Source: Lecture notes — 4. Barley,Maize, Cotton and Jute, Pages 3, 4*`
    });

    questions.push({
      topicId: tJute.id,
      questionText: 'List four diseases of fibre crops with their causal agents. [Paper 7]',
      answerText: `## Answer

Four major diseases of fiber crops (Jute and Cotton) along with their causal agents:

1. **Stem Rot of Jute:** *Macrophomina phaseolina* (Fungus)
2. **Black Band of Jute:** *Botryodiplodia theobromae* (syn. *Diplodia corchori*) (Fungus)
3. **Anthracnose of Jute:** *Colletotrichum corchorum* (Fungus)
4. **Angular Leaf Spot of Cotton:** *Xanthomonas malvacearum* (Bacteria)

*Source: Lecture notes — 7. Scientific Names, Pages 1-2*`
    });


    // ==========================================
    // PULSE & OILSEED DISEASES (topicId: tPulse.id)
    // ==========================================
    questions.push({
      topicId: tPulse.id,
      questionText: 'Enlist two major diseases each of oilseeds and pulses with causal agents. [Paper 2, 7, 8]',
      answerText: `## Answer

Major diseases of oilseeds and pulses along with their scientific causal pathogens:

### 1. Major Diseases of Oilseeds (Mustard, Groundnut, Sunflower)
1. **Grey Blight / Alternaria Leaf Spot of Mustard:**
   * **Causal Agent:** *Alternaria brassicae* (Fungus)
2. **Leaf Spot of Groundnut (Tikka):**
   * **Causal Agent:** *Cercospora arachidicola* (Early stage) & *Cercosporidium personatum* (Late stage) (Fungi)
3. **Leaf Spots of Sunflower:**
   * **Causal Agent:** *Alternaria helianthi* (Fungus)

### 2. Major Diseases of Pulses (Mungbean, Lentil, Chickpea)
1. **Mungbean Yellow Mosaic:**
   * **Causal Agent:** *Mungbean Yellow Mosaic Virus* (MYMV) (Virus)
2. **Botrytis Gray Mould of Gram:**
   * **Causal Agent:** *Botrytis cinerea* (Fungus)
3. **Foot and Root Rot of Pulses:**
   * **Causal Agent:** *Sclerotium rolfsii* or *Fusarium oxysporum* (Fungi)

*Source: Lecture notes — 7. Scientific Names, Page 2*`
    });

    questions.push({
      topicId: tPulse.id,
      questionText: 'Describe the symptoms of mungbean mosaic disease. [Paper 2]',
      answerText: `## Answer

### Symptoms of Mungbean Yellow Mosaic Disease

Mungbean Yellow Mosaic is caused by the *Mungbean Yellow Mosaic Virus* (MYMV) and is characterized by distinct foliar symptoms:

* **Attacked Stages:** Attacks mungbean plants at all growth stages (seedling to maturity).
* **Mosaic Patches:** Typical symptoms appear on young leaf blades as **bright yellow patches** intercepted by normal green areas.
* **Complete Yellowing:** In highly susceptible cultivars or severe systemic infections, the entire leaf blade becomes completely yellow.
* **Stunting:** Infected plants are shortened (stunted), and their leaf size is reduced.
* **Flower & Pod Loss:** Diseased plants produce smaller and fewer flowers. There is a severe **lack of pod setting**; if pods do develop, they are small, deformed, and contain shrivelled seeds.

*Source: Lecture notes — 5. Wheat and Pulse, Page 2*`
    });

    questions.push({
      topicId: tPulse.id,
      questionText: 'Distinguish between symptoms of cercospora leaf spot and rust of groundnut. [Paper 2]',
      answerText: `## Answer

Diagnostic differences between Cercospora Leaf Spot (Tikka) and Rust of Groundnut:

| Diagnostic Feature | Tikka / Cercospora Leaf Spot | Groundnut Rust |
| :--- | :--- | :--- |
| **Causal Agent** | *Cercospora arachidicola* (Early) / *Cercosporidium personatum* (Late). | *Puccinia arachidis* (Fungus). |
| **Lesion Type** | Necroticspots (tissue death). | Pustules (uredinia) containing powdery spores. |
| **Visual Appearance**| **Circular dark-brown spots** with/without yellow halos. | Small, raised, **orange-brown powdery pustules** on leaves. |
| **Location of Spores**| Conidiophores formed on upper leaf surface (early) or lower leaf surface (late). | Powdery orange urediniospores break through the epidermis, mostly on the **lower leaf surface**. |
| **Leaf Behavior** | Foliage turns yellow and drops off (defoliation). | Leaves curl, dry up, and remain attached to the plant. |
| **Stem & Pod** | Spots also appear on petioles and stems. | Pustules appear on leaf petioles, stems, and pods. |

*Source: Lecture notes — 6. Sugarcane, Mustard, Sunflower, Groundnut, Page 2; 8. All Disease Differences, Page 1*`
    });

    questions.push({
      topicId: tPulse.id,
      questionText: 'Suggest control measures for foot and root rot of pulses. [Paper 2]',
      answerText: `## Answer

Foot and Root Rot of Pulses (caused by soil-borne pathogens like *Sclerotium rolfsii* or *Fusarium oxysporum*) requires an integrated control strategy:

### 1. Cultural Controls
* **Deep Summer Ploughing:** Plough fields deeply during summer. Solar heat destroys resting structures (sclerotia and chlamydospores) in the soil.
* **Crop Rotation:** Rotate pulses with non-host crops like wheat, barley, or mustard for 2-3 years.
* **Soil Liming:** Apply lime (Calcium carbonate) to acidic soils to raise pH, as *Fusarium* species thrive in acidic soils.
* **Sanitation:** Collect and burn infected plant roots and debris post-harvest.

### 2. Biological Control
* Apply **Trichoderma harzianum** composted with organic manures into the soil prior to sowing to suppress soil pathogens via mycoparasitism.

### 3. Chemical Seed Treatment
* Treat seeds with systemic fungicides like **Vitavax-200** or Provax @ 0.25% of seed weight (2.5 g/kg seed) to protect germinating seedlings.

*Source: Lecture notes — 5. Wheat and Pulse, Pages 2, 4*`
    });

    questions.push({
      topicId: tPulse.id,
      questionText: 'Draw and describe symptoms of tikka of groundnut and leaf spot of sunflower. [Paper 3]',
      answerText: `## Answer

### 1. Tikka (Leaf Spot) of Groundnut
* **Causal Agents:** *Cercospora arachidicola* (Early spot) & *Cercosporidium personatum* (Late spot).
* **Early Spot Symptoms:** Reddish-brown, irregular circular spots surrounded by a **prominent, bright yellow halo** on the upper leaf surface.
* **Late Spot Symptoms:** Smaller, darker brown or carbon-black circular spots with **no yellow halo**, with spores forming in concentric rings on the lower leaf surface.

### 2. Leaf Spot of Sunflower (*Alternaria helianthi*)
* **Lesions:** Typical spots are **circular to irregular** in shape, dark brown to black.
* **Target Board Pattern:** Spots develop **concentric rings surrounded by a yellow halo**.
* **Coalescence:** Spots coalesce, causing leaf blighting, complete drying, and shedding of leaves. In severe cases, the entire leaf canopy is destroyed.

*(Diagram guide: For Tikka, draw early spots with large yellow rings around brown dots. For Sunflower leaf spot, draw large circular spots showing concentric ring patterns similar to a target board).*

*Source: Lecture notes — 6. Sugarcane, Mustard, Sunflower, Groundnut, Page 2*`
    });

    questions.push({
      topicId: tPulse.id,
      questionText: 'How can you control the leaf spot of sunflower? [Paper 3]',
      answerText: `## Answer

Leaf Spot of Sunflower is caused by the fungus *Alternaria helianthi*. Recommended control measures:

### 1. Clean Seed Source
* Collect seeds only from healthy, disease-free sunflower crops.

### 2. Seed Disinfection
* Soak seeds in hot water or treat them with chemical fungicides like **Vitavax-200** @ 0.25% seed weight to eradicate seed-borne conidia.

### 3. Cultural & Sanitation Practices
* Uproot and burn infected crop residues and trash immediately after harvest.
* Practice proper crop spacing (avoid close planting) to reduce microclimate humidity.

### 4. Foliar Chemical Spray
* Spray the crop with **0.2% Dithane M-45 (Mancozeb)** or Rovral upon the first appearance of concentric ring leaf spots, and repeat 2-3 times at 15-day intervals.

*Source: Lecture notes — 6. Sugarcane, Mustard, Sunflower, Groundnut, Page 4*`
    });

    questions.push({
      topicId: tPulse.id,
      questionText: 'Diagrammatically describe the symptoms of alternaria blight of mustard and cercospora leaf spot of mungbean. [Paper 4]',
      answerText: `## Answer

### 1. Symptoms of Alternaria Blight / Grey Blight of Mustard (*Alternaria brassicae*)
* **Foliar Spots:** Small, circular spots appear on leaves. Spots enlarge and develop **concentric rings (target board pattern)**. Lesions turn greyish-brown.
* **Stem & Pod Spots:** Dark brown to black circular lesions appear on stems and pods.
* **Sunken Pods:** Spots on pods become sunken.
* **Grain Damage:** Maturing seeds inside pods shrivel and become discolored.

### 2. Symptoms of Cercospora Leaf Spot of Mungbean (*Cercospora canescens*)
* **Foliar Spots:** Initial spots appear as small, water-soaked, **pin-headed spots** on leaves.
* **Spot Coloration:** Spots turn brown to reddish-brown, expanding to 1.5 cm in diameter.
* **Center & Halo:** Depending on the cultivar, spots develop a **greyish-white center surrounded by a brown halo**.
* **Defoliation:** Severe infections cause leaves to dry up and drop off.

*(Diagram guide: Draw a mustard leaf showing large spots with concentric rings like a target board. Draw a mungbean leaf with multiple tiny pin-head reddish spots, some expanding with white centers).*

*Source: Lecture notes — 5. Wheat and Pulse, Page 2; 6. Sugarcane, Mustard, Sunflower, Groundnut, Page 2*`
    });

    questions.push({
      topicId: tPulse.id,
      questionText: 'Name six diseases of pulse crops with their causal agents. [Paper 4]',
      answerText: `## Answer

Here are six common diseases of pulse crops along with their causal agents:

| # | Disease Name | Causal Agent (Scientific Name) | Pathogen Type |
| :--- | :--- | :--- | :--- |
| 1 | **Foot and Root Rot** | *Sclerotium rolfsii* or *Fusarium oxysporum* | Fungus |
| 2 | **Cercospora Leaf Spot** | *Cercospora canescens* | Fungus |
| 3 | **Mungbean Yellow Mosaic** | *Mungbean Yellow Mosaic Virus* (MYMV) | Virus |
| 4 | **Botrytis Gray Mould** | *Botrytis cinerea* | Fungus |
| 5 | **Rust of Pulse** | *Uromyces ciceris-arietini* | Fungus |
| 6 | **Anthracnose of Pulse** | *Colletotrichum lindemuthianum* | Fungus |

*Source: Lecture notes — 7. Scientific Names, Page 2*`
    });

    questions.push({
      topicId: tPulse.id,
      questionText: 'Enumerate the symptoms and control measures of stemphylium blight of lentil. [Paper 4]',
      answerText: `## Answer

### 1. Symptoms of Stemphylium Blight of Lentil
* **Causal Agent:** *Stemphylium botryosum* (syn. *Stemphylium vesicarium*) (Fungus).
* **Foliar Spots:** Initial symptoms appear as small, water-soaked, light-brown spots on the leaves.
* **Rapid Blighting:** Leaves quickly turn pale green to yellow, dry up, and drop off.
* **Progression:** Blighting starts from the lower branches and rapidly progresses upwards.
* **Defoliation:** In severe cases, massive defoliation occurs, leaving only bare stems, giving the field a **burnt or scorched appearance**.
* **Pods:** Pod setting is severely reduced; if pods form, they contain shrivelled, low-viability seeds.

### 2. Control Measures
* **Resistant Varieties:** Grow recommended resistant lentil varieties such as **BARI Masur-4, BARI Masur-5, BARI Masur-6**.
* **Sanitation:** Burn crop residues and stubbles. Practice crop rotation.
* **Seed Treatment:** Treat seeds with systemic fungicides like **Provax-200** or Vitavax-200 @ 0.25% seed weight.
* **Chemical Spray:** Foliar spray of fungicides like **Rovral-50 WP** or Companion @ 0.2% upon first appearance of leaf spots, repeating at 10-15 day intervals.

*Source: Lecture notes — 5. Wheat and Pulse, Pages 2, 4; 7. Scientific Names, Page 2*`
    });

    questions.push({
      topicId: tPulse.id,
      questionText: 'Draw and describe the symptoms of early and late tikka diseases of groundnut. [Paper 5]',
      answerText: `## Answer

Tikka (Cercospora Leaf Spot) is composed of two distinct fungal phases:

### 1. Early Tikka Disease (*Cercospora arachidicola*)
* **Timeline:** Symptoms appear early in the season, about 3-4 weeks after planting.
* **Spots:** Spots are sub-circular or irregular, reddish-brown to dark brown on the upper leaf surface.
* **Yellow Halo:** Characterized by a **prominent, bright yellow halo** surrounding each spot.
* **Conidia:** Fungal conidiophores form mostly on the **upper leaf surface**.

### 2. Late Tikka Disease (*Cercosporidium personatum*)
* **Timeline:** Symptoms appear later in the season, about 6-8 weeks after planting.
* **Spots:** Spots are smaller, more circular, and much darker brown or carbon-black.
* **Yellow Halo:** Yellow halo is **usually absent** or very faint.
* **Conidia:** Fungal conidiophores and black spore cushions form mostly on the **lower leaf surface** in concentric rings.

*(Diagram guide: Draw two groundnut leaflets. On one leaflet, draw large brown spots with distinct broad yellow halos (Early). On the other leaflet, draw small, solid black spots clustered closely on the lower side without halos (Late)).*

*Source: Lecture notes — 6. Sugarcane, Mustard, Sunflower, Groundnut, Page 2*`
    });

    questions.push({
      topicId: tPulse.id,
      questionText: 'How can you control the cercospora leaf spot and mosaic of pulses? [Paper 7]',
      answerText: `## Answer

### 1. Control of Cercospora Leaf Spot of Pulses (*Cercospora canescens*)
* **Sanitation:** Burn crop residues and weed hosts after harvest.
* **Crop Rotation:** Rotate pulses with non-host crops for at least 2 years.
* **Chemical Spray:** Spray foliar fungicides like **Bavistin (Carbendazim) @ 0.1%** at 7-10 day intervals for 2-3 times starting from early spotting.
* **Resistant Cultivars:** Sow locally recommended resistant pulse varieties.

### 2. Control of Mungbean Yellow Mosaic (MYMV)
* **Resistant Cultivars:** Cultivate resistant varieties such as **BARI Mung-5, BARI Mung-6, BARI Mash-1, 2, 3**.
* **Vector Control:** Spray systemic insecticides like **Malathion @ 0.2%** to kill the Whitefly (*Bemisia tabaci*) vector.
* **Roguing:** Uproot and burn infected plants at the early seedling stage.
* **Weed Management:** Clean fields of weed hosts around borders.

*Source: Lecture notes — 5. Wheat and Pulse, Page 4*`
    });

    questions.push({
      topicId: tPulse.id,
      questionText: 'How can you control botrytis grey mould of gram and cercospora leaf spot of mungbean? [Paper 8]',
      answerText: `## Answer

### 1. Control of Botrytis Grey Mould of Gram (*Botrytis cinerea*)
* **Cultural Measures:** Avoid excessive vegetative growth by balancing nitrogen. Avoid excessive irrigation. Spacing rows properly to reduce humidity.
* **Deep Summer Ploughing:** Exposes sclerotia to solar heat.
* **Intercropping:** Intercrop chickpea (gram) with linseed or mustard to disrupt canopy wetness.
* **Biological Control:** Apply **Trichoderma** spp. composts to the soil.
* **Chemicals:**
  * Treat seeds with Thiram + Carbendazim (1:1) @ 3g/kg.
  * Spray the crop with **Captan** @ 5-6 kg/ha at 15-day intervals.

### 2. Control of Cercospora Leaf Spot of Mungbean (*Cercospora canescens*)
* **Foliar Spray:** Spray systemic fungicide **Bavistin @ 0.1%** at 7-10 day intervals for 2-3 times.
* **Sanitation:** Burn crop debris.
* **Host Resistance:** Plant resistant mungbean varieties.

*Source: Lecture notes — 5. Wheat and Pulse, Page 4*`
    });

    questions.push({
      topicId: tPulse.id,
      questionText: 'List six diseases of oil seed crops with their causal organisms. [Paper 8]',
      answerText: `## Answer

Six major diseases of oilseed crops along with their scientific causal pathogens:

1. **Grey Blight / Alternaria Leaf Spot of Mustard:** *Alternaria brassicae* (Fungus)
2. **Leaf Spot of Sunflower:** *Alternaria helianthi* (Fungus)
3. **Early Tikka of Groundnut:** *Cercospora arachidicola* (Fungus)
4. **Late Tikka of Groundnut:** *Cercosporidium personatum* (Fungus)
5. **Rust of Sunflower:** *Puccinia helianthi* (Fungus)
6. **Sclerotinia Rot of Mustard:** *Sclerotinia sclerotiorum* (Fungus)

*Source: Lecture notes — 7. Scientific Names, Page 2*`
    });

    questions.push({
      topicId: tPulse.id,
      questionText: 'Prescribe to control Alternaria leaf spot of mustard and Cercospora leaf spot of mungbean. [Paper 5]',
      answerText: `## Answer

Prescription for managing these two major diseases:

### 1. Prescription for Alternaria Leaf Spot of Mustard (*Alternaria brassicae*)
* **Early Sowing:** Sow mustard early (before **November 25**) so that the vegetative stage matures before peak winter fog.
* **Sanitation:** Burn and destroy all infected crop residues post-harvest.
* **Crop Rotation:** Practice crop rotation with non-cruciferous crops for 2 years.
* **Seed Treatment:** Treat seeds with **Vitavax-200** @ 0.25% of seed weight before sowing.
* **Vector Control:** Spray **Malathion @ 0.2%** to control aphids, which cause injuries that facilitate fungal entry.
* **Cultural Practice:** Plant in areas that receive early morning sun to accelerate dew drying.

### 2. Prescription for Cercospora Leaf Spot of Mungbean (*Cercospora canescens*)
* **Chemical Spray:** Foliar spray **Bavistin (Carbendazim) @ 0.1%** at 7-10 day intervals for 2-3 times starting from early spotting.
* **Hygiene:** Collect and burn infected plant debris. Destroy weed hosts around borders.
* **Resistance:** Plant resistant mungbean varieties (e.g. BARI Mung-5, 6).

*Source: Lecture notes — 5. Wheat and Pulse, Page 4; 6. Sugarcane, Mustard, Sunflower, Groundnut, Page 4*`
    });


    console.log(`Prepared ${questions.length} Section B questions for seeding.`);

    // Insert Questions and Progress in a single transaction/block
    for (const qData of questions) {
      const createdQ = await Question.create({
        topicId: qData.topicId,
        questionText: qData.questionText,
        answerText: qData.answerText
      });
      await Progress.create({
        questionId: createdQ.id,
        solved: false
      });
    }

    console.log('Seeding completed successfully!');
    
    // Verification Count Check
    const countTopics = await Topic.count({ where: { sectionId: secB.id } });
    const countQuestions = await Question.count({
      include: [{
        model: Topic,
        where: { sectionId: secB.id }
      }]
    });

    console.log(`=== VERIFICATION ===`);
    console.log(`Seeded Section B Topics count: ${countTopics}`);
    console.log(`Seeded Section B Questions count: ${countQuestions}`);
    console.log('All Section B questions have been seeded beautifully! 🚀');

    process.exit(0);
  } catch (error) {
    console.error('Error during Section B seeding:', error);
    process.exit(1);
  }
}

seedSectionB();
