const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Find Course 1 (Plant Pathology)
const course = db.courses.find(c => c.id === 1);
if (!course) {
  console.error("Plant Pathology course not found in database.json");
  process.exit(1);
}

// Find max question ID in the entire database
let maxQId = 0;
db.courses.forEach(c => {
  c.Sections.forEach(s => {
    s.Topics.forEach(t => {
      t.Questions.forEach(q => {
        if (q.id > maxQId) maxQId = q.id;
      });
    });
  });
});
console.log(`Current maximum Question ID: ${maxQId}`);

// Defined new questions
const newQuestions = [
  {
    topicId: 45, // Epidemiology & Disease Triangle
    questionText: '[Session 2023-24] "Epidemiological factors that prevent an epidemic despite the presence of susceptible hosts and virulent pathogens" - analyze the statement.',
    answerText: `## Answer

This statement refers to the concept of **Disease Escape** — a phenomenon where an epidemic fails to develop even when a susceptible host population and a virulent pathogen coexist, due to **unfavorable environmental (abiotic) or temporal (time) factors**. 

For a plant disease epidemic to occur, all components of the disease triangle (host, pathogen, environment) must interact under favorable conditions over time (disease tetrahedron). If any of these are suboptimal, the epidemic is prevented.

### 1. Key Epidemiological Factors That Prevent Epidemics:

#### A. Suboptimal Environmental Factors (Microclimate)
* **Low Relative Humidity:** Most fungal pathogens (e.g., *Pyricularia oryzae*, *Alternaria* spp.) require free water or high relative humidity (>90%) for spore germination and penetration. If humidity remains low (e.g., dry wind, low dew), spores cannot infect the host even if the host is susceptible.
* **Temperature Mismatch:** Pathogens have strict optimum temperature ranges. If the temperature remains too high or too low (e.g., *Phytophthora infestans* requires cool, wet conditions; hot summer days >30°C halt its spread), infection fails completely.
* **Insufficient Leaf Wetness Duration:** Fungal spore germination often requires a continuous layer of water on leaves for 4 to 12 hours. High wind or bright sunlight dries leaves rapidly, interrupting infection.

#### B. Temporal Mismatches (Disease Tetrahedron)
* **Phenological Escape (Growth Stage Mismatch):** Plants change their susceptibility as they age (ontogenic resistance). If the crop passes through its highly susceptible stage (e.g., seedling stage or flowering stage) before the pathogen's inoculum builds up, it escapes infection.
  * *Example:* Early-maturing crop varieties complete their heading/flowering before the environment becomes favorable for the pathogen's sporulation.
* **Inoculum-Host Discontinuity:** Calm winds or dry weather may prevent wind-blown spores or insect vectors (e.g., aphids, whiteflies) from reaching susceptible plants at the right time.

#### C. Inoculum Levels Below the Epidemic Threshold
* Even if host and pathogen are present, the **initial inoculum ($x_0$)** might be so small that the rate of disease progress ($r$) is too slow to cause an epidemic before harvest.

### Conclusion:
Epidemic prevention relies heavily on breaking the disease triangle. In modern agricultural practice, disease escape is leveraged by shifting planting dates, selecting early-maturing cultivars, and managing crop spacing to modify the canopy microclimate.
*Source: Slide Notes 2.2 (Epidemiology), Pages 10-20*`
  },
  {
    topicId: 46, // Principles of Disease Control
    questionText: '[Session 2023-24] What is field sanitation? Discuss its role in disease management.',
    answerText: `## Answer

### 1. Definition of Field Sanitation
**Field sanitation** in plant pathology refers to the cultural practice of removing, destroying, or sterilizing sources of pathogen inoculum within a cropping area to prevent the introduction, survival, and spread of plant diseases. It focuses on keeping the growing environment clean of diseased materials, crop debris, alternate hosts, and contaminated farming equipment.

### 2. Core Activities of Field Sanitation:
* **Pruning and Removing Diseased Parts:** Cutting off infected leaves, twigs, or branches (e.g., pruning twigs infected with *Fire blight* of apple/pear) and safely disposing of them.
* **Crop Residue Destruction:** Burning, burying, or composting crop stubble and debris after harvest to eliminate overwintering/overseasoning fungal structures (like sclerotia, oospores, or perithecia).
* **Equipment Sterilization:** Washing and chemically sterilizing pruning shears, harvesting crates, and machinery (e.g., using bleach or alcohol to prevent the spread of *Rhizopus soft rot* or bacterial wilt).
* **Eradicating Alternate Hosts and Weeds:** Removing wild plants or weeds that harbor the pathogen or its insect vectors.

### 3. Role and Importance in Disease Management:
* **Reduces Primary Inoculum ($x_0$):** Since many pathogens survive in old debris or weed hosts, sanitation directly reduces the initial amount of inoculum available at the start of the next season. This delay in the start of disease significantly suppresses both monocyclic and polycyclic epidemics.
* **Prevents Localized Spread:** Removing infected plants ("roguing") prevents a localized infection from expanding into a field-wide epidemic.
* **Historical Lesson:** Poor sanitation (failure to destroy infected tubers in fields and storage piles) was a key driver of the devastating Late Blight outbreak in Ireland that caused the Irish Potato Famine.
*Source: Slide Notes 3.1 (Methods of Plant Disease Control), Slide 19*`
  },
  {
    topicId: 45, // Epidemiology & Disease Triangle
    questionText: '[Session 2023-24] How is plant disease development affected by "Time" as a factor in the disease tetrahedron? Explain with examples.',
    answerText: `## Answer

### 1. The Disease Tetrahedron and the Time Factor
The traditional **Disease Triangle** states that disease is the result of interaction among a susceptible **Host**, a virulent **Pathogen**, and a favorable **Environment**. 

However, disease development is not an instantaneous event. It is a dynamic process that requires the three factors to interact continuously over a period. This adds **Time** as the fourth dimension, transforming the triangle into a **Disease Tetrahedron** (or Disease Pyramid).

### 2. How Time Affects Disease Development (Key Aspects):

#### A. Season of the Year
The arrival of specific seasons governs temperature, rainfall, and day length, which dictates when a pathogen can active.
* *Example:* The outbreak of **Phytophthora wilt of betelvine** in Bangladesh is highly seasonal, becoming highly destructive specifically during the wet, humid rainy season when soil moisture remains saturated.

#### B. Duration and Frequency of Favorable Conditions
Even if host, pathogen, and environment align, infection will fail if favorable conditions do not persist long enough.
* Fungi need a specific "wetness duration" (e.g., leaves remaining wet for 6-12 hours continuously) for spores to germinate, form appressoria, and penetrate the host tissue.

#### C. Appearance of Vectors
For vector-borne pathogens (like viruses), the timing of the insect vector's lifecycle (e.g., aphids, whiteflies, leafhoppers) must coincide with the growth of susceptible young host plants.

#### D. Pathogen and Host Growth Speed
* **Pathogen Speed:** The time required for a spore to complete its infection cycle and produce new spores (incubation period) dictates how fast a polycyclic disease (e.g., rusts, blast) spreads.
* **Host Age:** Host susceptibility changes over time (ontogenic susceptibility). Some plants are susceptible only when young (e.g., damping-off), while others are susceptible at maturity.

### Conclusion:
Time represents the duration of interaction. Without sufficient time, even a virulent pathogen on a susceptible host in a perfect environment will fail to cause severe disease.
*Source: Slide Notes 2.2 (Epidemiology), Slides 49-51*`
  },
  {
    topicId: 46, // Principles of Disease Control
    questionText: '[Session 2023-24] Explain the scientific reasoning behind why resistant crop varieties break down over time.',
    answerText: `## Answer

Resistant varieties are the most cost-effective and environmentally friendly method for disease control. However, resistant crop varieties (especially those relying on **vertical/single-gene resistance**) frequently lose their effectiveness after a few years of commercial cultivation. This loss of effectiveness is scientifically referred to as the **"breakdown of resistance."**

### Scientific Reasons Behind the Breakdown:

#### 1. Selection Pressure and Pathogen Evolution
* When a single genetically resistant variety is grown over a large area (monoculture), it exerts extreme **selection pressure** on the pathogen population. 
* Any rare individual pathogen in the population that has a mutation allowing it to overcome the plant's resistance gene will survive, reproduce, and rapidly multiply, while the non-mutated pathogens die out.

#### 2. The Gene-for-Gene Relationship (Van der Plank's Concept)
* Under the **Gene-for-Gene model**, for every resistance (R) gene in the host, there is a matching avirulence (Avr) gene in the pathogen. 
* If a single nucleotide mutation occurs in the pathogen's *Avr* gene, the host's *R* gene can no longer "recognize" the pathogen. The host's defense mechanisms are not triggered, converting the resistant host into a highly susceptible one.

#### 3. The "Boom and Bust" Cycle
* **Boom:** A newly released resistant variety with a major vertical gene is highly successful and widely adopted by farmers, leading to high yields.
* **Bust:** Due to large-scale monoculture, a new virulent race of the pathogen emerges, multiplies rapidly on the crop, and causes a widespread, severe epidemic. The resistance is broken down, and the variety must be abandoned.

#### 4. High Mutation Rates in Pathogens
* Pathogens (especially fungi like *Pyricularia oryzae* or viruses) produce billions of spores or particles with fast reproduction cycles. This high reproduction rate increases the probability of genetic mutations, sexual recombination, or parasexual cycles that lead to new virulent races.

### Management Strategy:
To prevent resistance breakdown, plant breeders use **Horizontal Resistance** (governed by multiple minor genes, which is harder for the pathogen to overcome with a single mutation), **Gene Pyramiding** (combining multiple R genes), and **Multilines/Variety Mixtures** to reduce uniform selection pressure.
*Source: Slide Notes 3.1 (Methods of Plant Disease Control) & 2.2 (Epidemiology)*`
  },
  {
    topicId: 46, // Principles of Disease Control
    questionText: '[Session 2023-24] Discuss cultural measures and their mechanism in climate-smart disease management.',
    answerText: `## Answer

**Climate-smart disease management** aims to adapt cropping systems to climate change (e.g., rising temperatures, altered rainfall patterns, extreme weather events) while minimizing chemical inputs. **Cultural measures** serve as the backbone of this strategy by altering the crop microclimate, reducing pathogen survival, and boosting host health.

### Major Cultural Measures and Their Mechanisms:

#### 1. Adjusting Sowing and Planting Dates
* **Mechanism:** Avoids synchrony between the highly susceptible growth stage of the crop and peak pathogen inoculum levels or favorable weather conditions (temporal escape).
* **Climate Application:** If climate change shifts the onset of rainy seasons, adjusting planting dates ensures seedlings germinate during dry windows, escaping water-borne pathogens like damping-off.

#### 2. Crop Rotation
* **Mechanism:** Interrupts the lifecycle of soil-borne pathogens by planting non-host crops. Starved of host tissue, soil-borne resting structures (e.g., sclerotia, chlamydospores) die off naturally over 2-3 years.
* **Climate-Smart Benefit:** Helps manage persistent soil pathogens that thrive under warming soils.

#### 3. Crop Spacing and Canopy Management (Dense Planting Control)
* **Mechanism:** Wider spacing improves ventilation, increases airflow, and allows sunlight penetration. This reduces the leaf wetness duration and relative humidity inside the canopy, preventing fungal spore germination.
* **Climate Application:** Mitigates the risk of epidemics (like blast or sheath blight) that are fueled by the high humidity of dense, lush canopies.

#### 4. Balanced Nutrient Application (Nitrogen vs. Potassium)
* **Mechanism:** Excess nitrogen fertilizer makes plant tissues lush, watery, and easy for fungi to penetrate. Conversely, silicon and potassium application strengthens plant cell walls, creating a physical barrier.
* **Climate-Smart Benefit:** Prevents predisposition of plants to diseases under climate stress.

#### 5. Trap Crops and Cover Crops
* **Mechanism:** Trap crops are highly attractive to pathogens or their vectors and are planted around the main crop. They attract the vector, which is then destroyed, keeping the main crop clean.
*Source: Slide Notes 3.1 (Methods of Plant Disease Control), Slides 19-21*`
  },
  {
    topicId: 47, // Rice Diseases
    questionText: '[Session 2023-24] Enlist 6 major rice diseases in Bangladesh with their causal agents.',
    answerText: `## Answer

Here is a list of six major economically destructive rice diseases in Bangladesh with their scientific causal agents (including their biological nature):

| No. | Disease Name | Causal Agent | Pathogen Type |
|---|---|---|---|
| 1. | **Rice Blast** | *Magnaporthe oryzae* (Anamorph: *Pyricularia oryzae*) | Fungus |
| 2. | **Brown Spot of Rice** | *Bipolaris oryzae* (Synonym: *Helminthosporium oryzae*) | Fungus |
| 3. | **Bacterial Leaf Blight (BLB)** | *Xanthomonas oryzae* pv. *oryzae* | Bacteria |
| 4. | **Sheath Blight of Rice** | *Rhizoctonia solani* | Fungus |
| 5. | **Bakanae / Foolish Seedling Disease** | *Fusarium fujikuroi* (Teleomorph: *Gibberella fujikuroi*) | Fungus |
| 6. | **Rice Tungro Disease** | *Rice tungro bacilliform virus* (RTBV) and *Rice tungro spherical virus* (RTSV) | Virus (Vector: Green Leafhopper, *Nephotettix virescens*) |

*Source: Slide Notes (Section B - 1. Rice Diseases), Page 1*`
  },
  {
    topicId: 47, // Rice Diseases
    questionText: '[Session 2023-24] Illustrate and describe the disease cycle of brown spot of rice.',
    answerText: `## Answer

### 1. Overview of Brown Spot of Rice
Brown spot, caused by the fungus **_Bipolaris oryzae_** (formerly *Helminthosporium oryzae*), is historically known as a **"poor man's disease"** because it is highly destructive in nutrient-deficient, sandy, or poorly drained soils. It was the primary cause of the catastrophic Bengal Famine of 1943.

---

### 2. Detailed Disease Cycle:

#### Phase A: Survival ( Overseasoning )
* **Primary Source of Inoculum:** The fungus survives in two main ways:
  1. **Seed-borne Inoculum:** Dormant mycelium or conidia survive inside or on the seed coat (highly common).
  2. **Crop Debris:** The pathogen survives on infected crop residues, stubble, volunteer rice plants, and alternate weed hosts (*Leersia hexandra*) in the field.

#### Phase B: Primary Infection
* When infected seeds are sown, they germinate and the dormant fungus becomes active, causing **seedling blight** and circular brown lesions on the coleoptiles.
* Alternatively, wind-blown conidia from infected crop debris land on young leaves, germinate in the presence of dew/moisture, and penetrate leaf tissues.

#### Phase C: Secondary Spread ( Polycyclic Cycle )
* Under favorable weather, the initial spots on leaf surfaces develop structures called conidiophores, which produce fresh **conidia (spores)**.
* These conidia are easily detached and **disseminated by wind** to neighboring healthy leaves and panicles.
* Spores germinate, form appressoria, penetrate leaves directly or through stomata, and create new brown lesions within 5 to 7 days, repeating the cycle multiple times during the growing season.

#### Phase D: Grain Infection and Dormancy
* Late in the season, conidia infect the developing grains and glumes, causing dark brown staining ("dirty panicle" symptoms).
* The fungus invades the seed coat, where it goes into dormancy, completing the disease cycle.

---

### 3. Illustration of the Disease Cycle:

\`\`\`
          [ Overseasoning / Survival ]
    Infected Seeds  &  Crop Residues in Soil
                 │
                 ▼ (Sowing & Germination)
          [ Primary Infection ]
     Seedling Blight & Coleoptile spots
                 │
                 ▼ (Mycelial growth & sporulation)
          [ Conidia Production ]
                 │
                 ▼ (Disseminated by Wind)
          [ Secondary Infection ]
        Foliar Spots on Leaves & Sheaths
                 │   ▲
                 └───┘ (Repeats throughout season)
                 │
                 ▼ (Late season infection)
          [ Grain Discoloration ]
         Fungus enters seed coat (Dormancy)
                 │
                 └─────────► Loop back to Survival
\`\`\`

*Source: Slide Notes (Section B - 1. Rice Diseases), Page 5*`
  },
  {
    topicId: 47, // Rice Diseases
    questionText: '[Session 2023-24] Mention the favorable conditions for blast disease of rice.',
    answerText: `## Answer

Rice blast, caused by the fungus **_Pyricularia oryzae_**, is a highly destructive disease affecting leaves (leaf blast), nodes (node blast), and panicle necks (neck blast). The rapid spread and development of blast epidemics depend heavily on specific weather conditions and cultivation practices.

### Key Favorable Conditions for Rice Blast:

#### 1. Meteorological / Weather Conditions:
* **High Relative Humidity:** Relative humidity of **90% or above** is essential for spore production, release, germination, and infection. Continuous leaf wetness (dew or rain layer) for **8 to 12 hours** is critical.
* **Cool Night Temperatures:** Optimum night temperatures of **20°C to 24°C** combined with warm day temperatures favor maximum spore germination.
* **Overcast & Cloudy Skies:** Frequent cloudy days with low light intensity and light drizzling rain (which keeps leaves wet without washing off spores) are highly favorable.

#### 2. Cultivation Practices:
* **Excessive Nitrogen Fertilizer:** Heavy application of nitrogenous fertilizers makes plant tissues highly lush, soft, and succulent. This succulent growth is easily penetrated by fungal infection structures.
* **Close Plant Spacing:** High planting density creates a closed crop canopy. This traps humidity, blocks airflow, and prevents the leaves from drying, maintaining a damp microclimate ideal for the fungus.
* **Dry Soil Conditions (Drought Stress):** Blast is more severe under upland dry-bed nurseries or drought-stressed soils. Water stress reduces the plant's natural systemic resistance.

*Source: Slide Notes (Section B - 1. Rice Diseases), Pages 1-2*`
  },
  {
    topicId: 49, // Sugarcane Diseases
    questionText: '[Session 2023-24] Write short notes on sugarcane mosaic disease.',
    answerText: `## Answer

### 1. Causal Agent
Sugarcane Mosaic is a viral disease caused by the **_Sugarcane Mosaic Virus_ (SCMV)**, a member of the *Potyvirus* genus.

### 2. Characteristic Symptoms
* **Mosaic Pattern:** The most prominent symptom is the appearance of distinct patches or streaks of pale green or yellowish-green intermingled with normal dark green tissues on young leaves.
* **Streak Direction:** The chlorotic streaks run **parallel to the veins** of the leaves.
* **Stunting:** In highly susceptible varieties, the disease leads to severe chlorosis, reduction in leaf size, stunted plant growth, and thin sugarcane stalks, which severely drops biomass yield.

### 3. Transmission and Spread
* **Vector Dissemination:** SCMV is transmitted in a non-persistent manner by aphid vectors, primarily **_Rhopalosiphum maidis_** (corn leaf aphid) and **_Melanaphis sacchari_** (sugarcane aphid).
* **Vegetative Propagation (Sets):** The primary source of field spread is planting vegetative cuttings (**sets/seed cane**) taken from infected mother plants.

### 4. Management Measures
* **Healthy Seed Selection:** Use certified virus-free seed cane for new plantings.
* **Resistant Varieties:** Cultivate SCMV-resistant sugarcane cultivars.
* **Vector Control:** Apply insecticides to control aphid vector populations in and around fields.
* **Sanitation:** Remove alternate grass weed hosts that harbor both SCMV and aphids.
*Source: Slide Notes (Section B - 6. Sugarcane Mustard), Page 1*`
  },
  {
    topicId: 49, // Sugarcane Diseases
    questionText: '[Session 2019-20, 2023-24] Describe the symptoms of red rot of sugarcane and its effect on yield.',
    answerText: `## Answer

Red rot, caused by the fungus **_Colletotrichum falcatum_**, is often referred to as the **"Cancer of Sugarcane"** due to its highly destructive nature in sugarcane growing regions.

### 1. Key Symptoms:

#### A. Internal Stem Symptoms (Diagnostic Feature)
* **Red Coloration:** When an infected stalk is split open longitudinally, the internal pith tissue shows bright red discoloration.
* **White Transverse Bands:** Characteristic **white spots or bands that run crosswise (transversely)** across the red-stained tissue. This is the most reliable diagnostic symptom of red rot.
* **Pith Cavity:** In advanced stages, the pith dries up, turns brown, and forms hollow cavities.

#### B. External Canopy Symptoms
* **Leaf Yellowing:** The first visible sign on the canopy is the loss of color, yellowing, and drying up of the third or fourth leaves from the top.
* **Stem Shrinkage:** The stalk loses water, shrivels, develops longitudinal wrinkles, and the rind turns dull brown. The stems become light, brittle, and break easily.
* **Acidic Odor:** Splitting open an infected cane releases a strong **acidic or alcoholic sour odor** due to juice fermentation.

---

### 2. Effect on Yield and Sugar Production:
* **Massive Field Mortality:** Entire fields can dry up, causing 50% to **100% crop loss** in highly susceptible varieties.
* **Sucrose Destruction:** The fungus produces enzymes that convert sucrose into glucose and organic acids. This drops the sucrose recovery percentage during milling.
* **Milling Failure:** The affected juice becomes high in reducing sugars and acids, making it impossible to crystallize into white sugar.
*Source: Slide Notes (Section B - 6. Sugarcane Mustard), Page 1*`
  },
  {
    topicId: 51, // Pulse & Oilseed Diseases
    questionText: '[Session 2023-24] Describe the symptoms of mungbean yellow mosaic disease (MYMD) and mention its vector.',
    answerText: `## Answer

### 1. Causal Agent
Mungbean Yellow Mosaic is caused by the **_Mungbean Yellow Mosaic Virus_ (MYMV)**, which is a member of the *Begomovirus* genus (Geminiviridae family).

---

### 2. Key Symptoms:

* **Initial Yellow Specks:** The disease starts as tiny, scattered, round yellow spots or specks on the young leaflets of mungbean plants.
* **Bright Yellow Mosaic:** These specks rapidly enlarge and merge, forming prominent, bright yellow patches intermingled with green zones.
* **Complete Chlorosis:** In severe cases, the entire leaf blade turns bright yellow or white.
* **Leaf Distortion:** Leaves may show slight puckering, downward curling, and reduction in size.
* **Stunting & Pod Failure:** Affected plants are stunted. Flowering is drastically reduced. If pods form, they are small, distorted, turn yellow, and contain shriveled, unviable seeds.

---

### 3. Vector
MYMV is **not** mechanically transmissible. It is transmitted in nature exclusively by the **Whitefly (_Bemisia tabaci_)** in a persistent, circulative manner.

*Source: Slide Notes (Section B - 7. Scientific Names), Page 2*`
  },
  {
    topicId: 48, // Wheat & Barley Diseases
    questionText: '[Session 2018-19, 2023-24] Describe the symptoms of loose smut of wheat and its control measures.',
    answerText: `## Answer

Loose smut of wheat is caused by the systemic, internally seed-borne fungus **_Ustilago tritici_** (syn. *Ustilago nuda* var. *tritici*). The disease is highly destructive as it directly destroys the grain-producing head.

### 1. Characteristic Symptoms:
* **Ears Emerge Early:** Infected wheat heads emerge from the boot leaf slightly earlier than healthy heads.
* **Black Powder Mass:** The entire spikelet structure (grains, glumes, palea) is completely destroyed and replaced by an olive-black, dry, powdery mass of **teliospores (chlamydospores)**.
* **Silvery Membrane:** The black spore mass is initially enclosed in a thin, delicate silvery membrane.
* **Membrane Rupture:** The membrane quickly ruptures as the ear emerges, exposing the loose black powder.
* **Bare Rachis:** Wind and rain disperse the dry powdery spores, leaving behind only the central axis (**rachis**) of the ear at harvest time.

---

### 2. Control Measures:

Since the pathogen survives as dormant mycelium inside the seed embryo, external chemical dusts are ineffective. Control relies on targeting the internal infection:

#### A. Chemical Control (Systemic Fungicides)
* **Seed Treatment:** Treat wheat seeds with systemic fungicides like **Vitavax-200 (carboxin) or Provax @ 2g/kg seed**. The fungicide penetrates the seed during germination and kills the internal mycelium without harming the embryo.

#### B. Physical/Solar Control (Luthra's Solar Energy Method)
* **Procedure:** Seeds are soaked in water for 4 hours (8 am to 12 pm) on a hot summer day. Then, they are spread on a concrete courtyard under the direct blazing sun for 4 hours (12 pm to 4 pm) to dry.
* **Mechanism:** The solar heat kills the dormant mycelium inside the seed while keeping seed viability intact.

#### C. Hot Water Treatment (Jensen's Method)
* Soak seeds in water at 20-30°C for 4-5 hours to activate the fungus, then dip them in hot water at **52°C for exactly 10 minutes**, followed by rapid cooling and drying.

#### D. Regulatory and Cultivation Measures
* Use certified, disease-free seed. Rogue and burn smutted heads inside a paper bag (to prevent spore escape) as soon as they emerge.
*Source: Slide Notes (Section B - 5. Wheat and Pulse), Page 1 & 8. All Disease Differences*`
  }
];

// Inserter Logic
let added = 0;
newQuestions.forEach(newQ => {
  // Find correct topic in Course 1 Sections
  let targetTopic = null;
  for (const s of course.Sections) {
    targetTopic = s.Topics.find(t => t.id === newQ.topicId);
    if (targetTopic) break;
  }

  if (!targetTopic) {
    console.error(`Topic ID ${newQ.topicId} not found in Course 1`);
    return;
  }

  // Check duplicate
  const exists = targetTopic.Questions.some(q => q.questionText.trim() === newQ.questionText.trim());
  if (exists) {
    console.log(`Question already exists in Topic ${targetTopic.id}: "${newQ.questionText.substring(0, 50)}..."`);
  } else {
    maxQId++;
    const insertedQ = {
      id: maxQId,
      topicId: newQ.topicId,
      questionText: newQ.questionText,
      answerText: newQ.answerText
    };
    targetTopic.Questions.push(insertedQ);
    added++;
    console.log(`Added Q${maxQId} to Topic ${targetTopic.id}: "${newQ.questionText.substring(0, 50)}..."`);
  }
});

if (added > 0) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log(`Successfully added ${added} new questions. database.json updated!`);
} else {
  console.log("No new questions added (all existed already).");
}
