const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
if (!fs.existsSync(dbPath)) {
  console.error("database.json not found!");
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const course = db.courses.find(c => c.id === 1);
if (!course) {
  console.error("Plant Pathology course not found in database.json");
  process.exit(1);
}

// Find max question ID
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
console.log(`Current maximum Question ID before patch: ${maxQId}`);

const missingQuestions = [
  {
    topicId: 42, // Toxins in Disease Development
    questionText: '[Session 2019-20, 2023-24] What is meant by plant toxin?',
    answerText: `## Answer

In plant pathology, a **plant toxin** (or phytotoxin) is a non-enzymatic, low molecular weight chemical substance produced by a pathogen (or by host-pathogen interactions) that is toxic to plants and plays an active role in pathogenesis. 

### 1. Key Characteristics of Plant Toxins:
* **Non-Enzymatic:** Unlike enzymes, which digest physical cell structures (like cellulose or pectin), toxins act at biochemical levels, targeting specific receptors or organelles.
* **Low Concentration Action:** They can cause severe damage or death to plant cells at extremely low concentrations.
* **Symptom Inducers:** They are responsible for inducing specific disease symptoms, such as chlorosis, necrosis, leaf spots, and wilting.

### 2. Classification of Toxins:
1. **Host-Specific Toxins (HSTs):** Toxic only to susceptible host varieties of the producing pathogen (e.g., **Victorin** produced by *Bipolaris victoriae* is toxic only to Victoria oats).
2. **Non-Host-Specific Toxins:** Toxic to a wide range of host plants, including those that are not hosts to the producing pathogen (e.g., **Wildfire toxin / Tabtoxin** produced by *Pseudomonas syringae* pv. *tabaci*).`
  },
  {
    topicId: 41, // Pathogenesis & Direct Penetration
    questionText: '[Session 2019-20] How are a plant disease cycle\'s pre-penetration phenomena signaled?',
    answerText: `## Answer

Pre-penetration phenomena, which include spore germination, germ tube growth, and appressorium differentiation, are governed by a complex set of host surface signals.

### Signals Triggering Pre-Penetration:

#### 1. Physical (Mechanical/Thigmotropic) Signals
* **Surface Topography:** The physical ridges and grooves of the leaf cuticle act as navigational cues. For example, rust fungi (*Puccinia* spp.) utilize thigmotropism to locate stomatal openings, sensing the micro-ridges of guard cells.
* **Surface Hardness and Hydrophobicity:** The mechanical touch of a hard, hydrophobic leaf surface triggers germ tube termination and the differentiation of the germ tube tip into an appressorium.

#### 2. Chemical Signals
* **Host Exudates:** Soluble compounds (such as sugars, amino acids, and organic acids) leaking from host tissues stimulate spore germination.
* **Cutin Monomers:** The presence of cutin monomers (e.g., 16-hydroxyhexadecanoic acid) released by host cuticles serves as a primary signal that activates MAP kinase cascades inside the pathogen, triggering the expression of genes involved in appressorium formation and penetration.`
  },
  {
    topicId: 41, // Pathogenesis & Direct Penetration
    questionText: '[Session 2019-20] "Successful infections always result in the appearance of symptoms." Critically judge the statement with scientific reasoning.',
    answerText: `## Answer

This statement is **incorrect (False)**. Successful infection occurs when a pathogen enters the host, establishes a parasitic relationship, and obtains nutrients. However, this does not guarantee the immediate or eventual expression of visible macro-symptoms.

### Scientific Reasoning:

#### 1. Latent Infections
Many pathogens successfully infect and colonize host tissues but remain dormant or quiescent (latent) for long periods. Symptoms only appear later when triggered by host maturity (senescence) or environmental stress.
* *Example:* *Colletotrichum gloeosporioides* infects young, green mango fruits but remains latent until the fruit ripens, at which point anthrocnose symptoms break out.

#### 2. Tolerant Hosts and Symptomless Carriers
Tolerant plant varieties can support high levels of pathogen replication and colonization (especially viruses and systemic bacteria) without showing visual disease symptoms or significant yield losses. These are termed symptomless carriers.

#### 3. The Incubation Period Lag
Directly after successful infection, there is a temporal lag (the incubation period) where the pathogen colonizes host tissues internally before any macroscopic symptoms develop.`
  },
  {
    topicId: 41, // Pathogenesis & Direct Penetration
    questionText: '[Session 2019-20] Write a note on spore germination factors of fungi.',
    answerText: `## Answer

Spore germination is the critical transition of a dormant fungal spore into an active, vegetative germ tube capable of penetrating host tissues. This process is governed by environmental and host-specific factors:

### 1. Environmental Factors (Abiotic)
* **Moisture / Free Water:** Hydration is the absolute prerequisite. Most fungal spores require a layer of free water on the leaf surface or relative humidity **above 90%** to germinate.
* **Temperature:** Fungi have strict cardinal temperatures (minimum, optimum, maximum). For example, *Pyricularia oryzae* germinates best at **25°C to 28°C**.
* **Light and UV Radiation:** Direct sunlight or UV-B can inhibit spore germination. Consequently, many pathogens germinate primarily at night under dew.
* **Oxygen:** Germination is energy-intensive and requires high respiration rates, making oxygen availability vital.

### 2. Host-Derived Factors (Biotic)
* **Exudates:** Sugars, amino acids, and cuticular waxes released by susceptible hosts stimulate spore activation.
* **Antifungal Compounds:** Resistant varieties release inhibitors (phytoanticipins) on their surfaces that halt spore germination.`
  },
  {
    topicId: 43, // Pathophysiology
    questionText: '[Session 2019-20] Explain the mechanisms through which fungal attack causes xylem and phloem blockage.',
    answerText: `## Answer

Vascular wilt fungi (such as *Fusarium oxysporum* and *Verticillium* spp.) systematically invade host vessels, leading to transpiration failure and severe wilting.

### Mechanisms of Vascular Blockage:

#### 1. Xylem Blockage (Water Transport)
* **Physical Presence of Pathogen:** Fungal mycelium, microconidia, and spores physically plug the water-conducting xylem vessels.
* **Host Defense Responses:**
  * **Tyloses:** Balloon-like outgrowths of xylem parenchyma cells protrude through pits into the vessels to wall off the pathogen, which unintentionally blocks water flow.
  * **Gums and Gels:** The host plant secretes complex pectins, gums, and callose into vessel lumens to trap the fungus, severely clogging the vascular system.
* **Pathogen Macromolecules:** Pathogens secrete high-molecular-weight Extracellular Polysaccharides (EPS) and cell-wall degrading enzymes (pectinases) that increase sap viscosity and clog pit membranes.

#### 2. Phloem Blockage (Photosynhate Transport)
Phloem blockage is less common for fungi but occurs in systemic infections where callose deposition on sieve plates or vascular necrosis prevents downward transport of photosinhates.`
  },
  {
    topicId: 44, // Dissemination of Pathogens
    questionText: '[Session 2019-20] Explain why fungal spores can easily be disseminated by air current.',
    answerText: `## Answer

Air currents (wind) are the most rapid and widespread means of fungal spore dissemination (anemochory), driving polycyclic epidemics. Fungal spores are highly adapted for wind transport:

### Adaptive Mechanisms for Wind Dissemination:

* **Physical Characteristics:** Wind-borne spores (e.g., conidia of *Pyricularia oryzae*, urediniospores of *Puccinia*) are extremely small, lightweight, and dry, allowing them to remain suspended in air currents for long periods.
* **Active Discharge Mechanisms:** Many fungi actively eject their spores into the turbulent air layer above the leaf boundary. Examples include:
  * **Buller\'s Drop:** Basidiomycetes release spores via rapid moisture condensation shifts.
  * **Ascus Shooting:** Ascomycetes build hydrostatic pressure to shoot ascospores out of asci.
* **High Reproduction Volume:** Fungal lesions produce millions of spores, compensating for the high loss rate during wind transport.
* **UV-Protection (Melanization):** Spore walls often contain dark melanin pigments that protect them from lethal solar ultraviolet radiation during long-distance transport.`
  },
  {
    topicId: 46, // Principles of Disease Control
    questionText: '[Session 2019-20] How does cross protection influence host resistance? Explain its mechanism.',
    answerText: `## Answer

**Cross protection** is a specialized form of induced systemic resistance where inoculation of a host plant with a mild, non-virulent strain of a pathogen (especially a virus) protects the plant against subsequent infection by a severe, destructive strain of the same or closely related pathogen.

### Mechanisms of Influence on Resistance:

* **RNA Interference (RNAi) / Post-Transcriptional Gene Silencing (PTGS):**
  1. The mild virus strain replicates, producing double-stranded RNA (dsRNA).
  2. The host plant recognizes this dsRNA and uses **Dicer enzymes** to cleave it into small interfering RNAs (siRNAs).
  3. These siRNAs program the host's **RISC complex** to target and destroy any matching viral RNA.
  4. When the severe strain attacks, its matching RNA is immediately degraded by the pre-activated RISC complex, conferring complete resistance.
* **Coat Protein-Mediated Protection:** The coat protein of the pre-established mild strain coats host cell receptors, preventing the incoming severe virus from uncoating and starting its replication cycle.`
  },
  {
    topicId: 46, // Principles of Disease Control
    questionText: '[Session 2019-20] Farmer field diagnostics: A farmer reports yellowing leaves at the two to three leaf stages. Explain the diagnostic protocol.',
    answerText: `## Answer

Diagnosing yellowing leaves at the early 2–3 leaf stage requires a systematic protocol to differentiate between abiotic (nutrient, environment) and biotic (pathogen, vector) factors:

### Diagnostic Protocol:

#### Step 1: Analyze Spatial Field Patterns
* **Uniform Yellowing:** If the entire field is uniformly yellowed, the cause is likely **abiotic** (e.g., Nitrogen or Iron deficiency, soil acidity, or waterlogging).
* **Patchy/Scattered Yellowing:** If symptoms appear in localized patches or scattered individual plants, the cause is likely **biotic** (e.g., seed-borne pathogens, root rot, soil nematodes, or viral infection).

#### Step 2: Inspect Root and Crown Systems
* Gently uproot affected seedlings. Inspect roots for browning, softening, or rotting.
* *Diagnostic:* Necrotic, mushy roots indicate damping-off/root rot caused by *Pythium*, *Phytophthora*, or *Rhizoctonia*.

#### Step 3: Inspect Vascular Bundles
* Cut the seedling stem longitudinally. Check the vascular bundles.
* *Diagnostic:* Brown vascular discoloration indicates early systemic vascular wilt or bacterial wilt.

#### Step 4: Examine Foliar Signs and Vectors
* Look closely for signs (spore masses, mycelium under the leaves) vs symptoms (chlorotic halos, mosaics).
* Check for insect vectors (aphids or leafhoppers) that transmit early seedling viral diseases like rice tungro.`
  },
  {
    topicId: 46, // Principles of Disease Control
    questionText: '[Session 2019-20] Why does burning crop residue serve as a control measure? Discuss its role in disease management.',
    answerText: `## Answer

Burning crop residue is a cultural sanitation control measure classified under the principle of **Eradication**.

### Role in Disease Management:

* **Eliminates Primary Inoculum ($x_0$):** Many plant pathogens (e.g., fungi causing blast, brown spot, or stem rot) survive the off-season as dormant mycelia, sclerotia, or oospores inside infected crop debris and stubble.
* **Disrupts the Disease Cycle:** By burning the residues after harvest, these survival structures are destroyed by heat. This directly reduces the initial inoculum ($x_0$) available at the start of the next season, delaying epidemic onset.

### Modern Implications (Climate-Smart Context):
While burning is highly effective at eradicating pathogens, it is considered a **last resort** in modern climate-smart agriculture because:
1. It destroys soil organic matter and beneficial microflora.
2. It contributes to air pollution and carbon emissions.
3. Conservation tillage and composting are preferred unless dealing with highly persistent quarantine pathogens.`
  },
  {
    topicId: 41, // Pathogenesis & Direct Penetration
    questionText: '[Session 2019-20] "Parasitic higher plants penetrate into the host only by forming a penetration peg." Discuss this statement with examples.',
    answerText: `## Answer

This statement is **correct**. Parasitic higher plants (such as *Cuscuta* spp., *Striga* spp., and *Orobanche* spp.) lack normal root systems and must form a specialized structures to penetrate host tissues.

### Mechanisms of Penetration:

1. **Host Recognition & Contact:** The parasite\'s germinating radicle or stem makes contact with a host.
2. **Appressorium Formation:** The parasite stem or root swells at the point of contact to form an adhesive disk (appressorium) that secures it to the host surface.
3. **Penetration Peg Differentiation:** From the center of this appressorium, a specialized tissue wedge called a **penetration peg** emerges.
4. **Mechanical & Enzymatic Invasion:** The penetration peg uses mechanical pressure coupled with the secretion of cell-wall degrading enzymes (pectinases and cellulases) to dissolve and push through the host epidermis and cortex.
5. **Haustorial Connection:** Once inside, the peg differentiates vascular connections (haustoria) that join directly with the host\'s xylem and phloem, enabling the parasite to absorb water, minerals, and photosinhates.`
  },
  {
    topicId: 48, // Wheat & Barley Diseases
    questionText: '[Session 2019-20] Distinguish between loose smut of wheat and covered smut of barley.',
    answerText: `## Answer

Loose smut of wheat and covered smut of barley are both caused by smut fungi, but they differ in symptom structure, spore dissemination, and seed transmission:

| Feature | Loose Smut of Wheat | Covered Smut of Barley |
|---|---|---|
| **Causal Agent** | *Ustilago tritici* | *Ustilago hordei* |
| **Spore Mass Membrane** | Thin, delicate silvery membrane that ruptures **immediately** upon ear emergence. | Tough, persistent membrane that remains intact until harvest/threshing. |
| **Dissemination Time** | Spores are blown away by wind during flowering, leaving a **bare rachis** at harvest. | Smutted grains (smut balls) remain intact until threshing. |
| **Transmission Mode** | **Internally seed-borne** (dormant mycelium survives inside the embryo). | **Externally seed-borne** (spores contaminate the seed coat during threshing). |
| **Control Priority** | Requires systemic seed treatment (e.g., carboxin) or solar heat treatment. | Can be controlled by external contact/protective seed fungicides. |`
  },
  {
    topicId: 42, // Toxins in Disease Development
    questionText: '[Session 2019-20] Prove that Victorin is a host-specific toxin.',
    answerText: `## Answer

Victorin is a host-specific toxin (HST) produced by the fungus **_Bipolaris victoriae_** (formerly *Helminthosporium victoriae*), which causes Victoria blight of oats. Its host-specificity is demonstrated by:

### Proofs of Host-Specificity:

* **Extreme Selective Toxicity:** Victorin is highly toxic only to oat cultivars containing the **Vb gene** (originally bred for crown rust resistance). Oat cultivars lacking this gene are completely insensitive (tolerant) to the toxin.
* **Potency Differential:** On susceptible Vb-oat cultivars, Victorin is active at picogram concentrations ($10^{-12}$ g/mL). On resistant cultivars, it causes no symptoms even at concentrations **million-fold higher**.
* **Pathogenicity Correlation:** Only isolates of *B. victoriae* that synthesize Victorin are pathogenic. Mutants that lose the ability to produce Victorin are completely non-pathogenic, showing that Victorin production is the sole driver of pathogenicity.`
  },
  {
    topicId: 42, // Toxins in Disease Development
    questionText: '[Session 2019-20] How does a non-toxic precursor chemical become toxic inside the host plant? Give an example.',
    answerText: `## Answer

A pathogen can secrete a non-toxic precursor chemical (pro-toxin) which only becomes active and toxic once it enters the host cell and undergoes host enzymatic cleavage or metabolism.

### Example: Tabtoxin (Pseudomonas syringae)

* **Precursor Production:** The bacterium *Pseudomonas syringae* pv. *tabaci* (wildfire of tobacco) produces **tabtoxin**, a dipeptide consisting of **tabtoxinine-β-lactam** linked to the amino acid **threonine**. In this intact dipeptide form, tabtoxin is non-toxic.
* **Host Enzymatic Activation:** When tabtoxin enters the host leaf tissue, host plant **peptidases** cleave the peptide bond, releasing free **tabtoxinine-β-lactam**.
* **Toxicity Effect:** Free tabtoxinine-β-lactam is the active toxin. It irreversibly inhibits the host enzyme **glutamine synthetase**, causing a toxic accumulation of ammonia within cells, leading to severe chlorosis (halos) and necrosis.`
  },
  {
    topicId: 41, // Pathogenesis & Direct Penetration
    questionText: '[Session 2019-20] Compare and contrast between propagule and inoculum.',
    answerText: `## Answer

Propagule and inoculum are related terms describing pathogen structures, but they differ in scale and capability:

### 1. Inoculum
* **Definition:** The pathogen or any of its parts (spores, mycelium, bacterial cells, virus particles, nematode eggs) that can make contact with a host plant and potentially initiate infection.
* **Scale:** Represents the total population or bulk volume of infectious units in an area.

### 2. Propagule
* **Definition:** A single, discrete unit of inoculum that is capable of independent survival and initiating an infection (e.g., a single spore, a single sclerotium, or a hyphal fragment).
* **Scale:** Represents the individual cell or organism level.

### Key Contrast:
* **All propagules are parts of inoculum, but not all parts of inoculum act as successful propagules.** For example, a fragmented, non-viable spore wall is inoculum, but it cannot act as a propagule because it cannot germinate and cause infection.`
  },
  {
    topicId: 43, // Pathophysiology
    questionText: '[Session 2019-20] "Nutrient uptake by a plant pathogen is equivalent to the damage it causes." Critically discuss this statement.',
    answerText: `## Answer

This statement is **incorrect**. The amount of nutrients physically absorbed by a plant pathogen represents only a small fraction of the total damage caused to the host. Fungal and bacterial attacks disrupt the entire physiology of the plant, causing damage far exceeding their nutritional uptake.

### Reasons Why Damage Exceeds Nutrient Uptake:

* **Toxin and Enzyme Secretion:** Pathogens secrete phytotoxins (which kill host cells) and cell-wall degrading enzymes (which cause rot and collapse of tissues). This destroys host machinery far beyond what the pathogen consumes.
* **Photosynthesis Inhibition:** Foliar pathogens cause chlorosis, destroying chlorophyll and reducing the host's overall photosynthetic rate.
* **Vascular Obstruction:** Pathogens colonize xylem (vascular wilt) and block water flow, causing death of healthy organs that the pathogen never directly feeds on.
* **Defensive Energy Diversion:** Plants redirect metabolic resources away from yield/growth to construct physical and chemical defense barriers (e.g., phytoalexin synthesis, respiration spikes).`
  },
  {
    topicId: 45, // Epidemiology & Disease Triangle
    questionText: '[Session 2019-20] Define the disease triangle and disease tetrahedron with diagrams.',
    answerText: `## Answer

Plant diseases are dynamic processes defined by host, pathogen, environmental, and temporal interactions:

### 1. Disease Triangle
* **Definition:** Plant disease occurs only when a susceptible **Host**, a virulent **Pathogen**, and a favorable **Environment** interact. If any of these three factors is missing, disease cannot develop.

### 2. Disease Tetrahedron
* **Definition:** Adds the fourth dimension of **Time** to the disease triangle. Disease is not instantaneous; it requires the host, pathogen, and environment to interact continuously over a duration for an epidemic to progress.

### Diagrams:

\`\`\`
Disease Triangle:             Disease Tetrahedron:
       Pathogen                       Pathogen
          /\\                             / \\
         /  \\                           /   \\
        /    \\                         /     \\
       /      \\                       /  Time \\
  Host ──────── Environment      Host ───────── Environment
\`\`\`

*(In modern agricultural pathology, the tetrahedron may also include **Humans** as a fifth factor, representing management, breeding, and cropping practices).*`
  },
  {
    topicId: 45, // Epidemiology & Disease Triangle
    questionText: '[Session 2019-20] Discuss how the number of propagules produced and the reproduction cycle affect epidemics.',
    answerText: `## Answer

The epidemic progress rate ($r$) is heavily determined by the pathogen\'s reproductive capacity:

* **Number of Propagules Produced:** Pathogens that produce massive quantities of asexual spores (e.g., *Pyricularia oryzae* producing thousands of conidia per leaf lesion) have high secondary inoculum potential. This triggers rapid, explosive epidemics across fields.
* **Reproduction Cycle (Latent Period):** The time required for a spore to infect, colonize, and produce a new generation of spores. 
  * A **short reproduction cycle** (e.g., 5-7 days for rice blast) allows the pathogen to complete multiple generations in a single season (polycyclic disease), resulting in exponential epidemic increase.
  * A **long reproduction cycle** (e.g., monocyclic pathogens like smuts that complete only one cycle per year) produces slow-growing epidemics.`
  },
  {
    topicId: 46, // Principles of Disease Control
    questionText: '[Session 2019-20] Explain the symplastic, apoplastic, and amphimobile movement of systemic fungicides.',
    answerText: `## Answer

Systemic fungicides are classified by their translocation pathways within the host plant tissue:

* **Apoplastic Movement (Xylem-Systemic):**
  * The fungicide moves through non-living cell walls, intercellular spaces, and water-transporting xylem vessels.
  * Translocation is upward and outward (acropetal), following the transpiration stream towards leaf tips.
* **Symplastic Movement (Phloem-Systemic):**
  * The fungicide is absorbed into living cytoplasm and translocates through plasmodesmata and phloem sieve tubes.
  * Translocation follows the photosinhate flow (source to sink), moving downward to roots and upward to shoot tips (basipetal and acropetal).
* **Amphimobile Movement:**
  * The fungicide can move through both apoplastic (xylem) and symplastic (phloem) pathways, distributing throughout the entire plant (e.g., **Fosetyl-Al**).`
  },
  {
    topicId: 46, // Principles of Disease Control
    questionText: '[Session 2019-20] Define antagonism, antagonist, and hyper-parasitism in biological control.',
    answerText: `## Answer

In plant disease biological control, these terms define the inhibitory interactions between organisms:

* **Antagonism:** The toxic, inhibitory, or destructive relationship between two organisms where one actively suppresses the growth, reproduction, or survival of the other.
* **Antagonist:** The biological agent (microorganism) that is used to suppress the growth, activity, or pathogenesis of a plant pathogen.
* **Hyper-parasitism (Mycoparasitism):** A phenomenon where a parasite is itself parasitized by another parasite. In biocontrol, it refers to an antagonist directly attacking and digesting pathogenic structures (e.g., *Trichoderma harzianum* hyphae wrapping around and lysing the hyphae of *Rhizoctonia solani*).`
  },
  {
    topicId: 46, // Principles of Disease Control
    questionText: '[Session 2019-20] Explain how antagonists act to control plant pathogens.',
    answerText: `## Answer

Biological antagonists control plant pathogens through four primary mechanisms:

* **1. Antibiosis:** The antagonist secretes low-molecular-weight antibiotics, toxic compounds, or volatile gases that inhibit or kill the pathogen.
  * *Example:* *Bacillus subtilis* produces lipopeptides (iturin, fengycin) that disrupt fungal cell membranes.
* **2. Competition:** The antagonist rapidly colonizes plant surfaces and depletes essential resources (like nutrients or space) before the pathogen can.
  * *Example:* Antagonists produce siderophores that bind iron, starving pathogens.
* **3. Mycoparasitism / Lysis:** Direct physical wrapping around pathogen hyphae, followed by secretion of lytic enzymes (chitinases, glucanases) that dissolve cell walls.
* **4. Induced Resistance:** The presence of the antagonist triggers the plant\'s systemic defenses (SAR or ISR), priming it to resist future pathogen attacks.`
  },
  {
    topicId: 47, // Rice Diseases
    questionText: '[Session 2019-20] Compare and contrast between narrow brown leaf spot and bacterial leaf streak of rice.',
    answerText: `## Answer

Narrow brown leaf spot and bacterial leaf streak are common foliar diseases of rice but differ in causal agents and symptoms:

| Feature | Narrow Brown Leaf Spot | Bacterial Leaf Streak |
|---|---|---|
| **Causal Agent** | *Cercospora janseana* (Fungus) | *Xanthomonas oryzae* pv. *oryzicola* (Bacteria) |
| **Lesion Shape** | Short, narrow, linear brown spots parallel to leaf veins. | Long, linear, water-soaked, translucent streaks between veins. |
| **Bacterial Ooze** | Absent. | Present (tiny amber-colored beads on streaks under humid conditions). |
| **Dissemination** | Wind-blown conidia. | Rain splash, water contact, or high winds. |
| **Leaf Drying** | Causes gradual leaf yellowing and death. | Streaks merge, turning whole leaves brown and papery.`
  },
  {
    topicId: 47, // Rice Diseases
    questionText: '[Session 2019-20] Compare nitrogen deficiency and tungro disease of rice.',
    answerText: `## Answer

Nitrogen deficiency and rice tungro disease both cause foliar yellowing but differ in etiology and field patterns:

| Feature | Nitrogen Deficiency | Rice Tungro Disease |
|---|---|---|
| **Causal Agent** | Abiotic (lack of soil nitrogen nutrient). | Biotic viral complex (*Rice tungro bacilliform virus* & *spherical virus*). |
| **Field Pattern** | Uniform yellowing across the entire field. | Patchy distribution (scattered infected yellow-orange pockets). |
| **Leaf Yellowing** | Starts at leaf tips of older leaves, progressing uniformly upwards. | Irregular yellowing/orange-red discoloration starting on younger leaves. |
| **Plant Growth** | Stunted stems with thin tillers. | Severe stunting with reduced tillering and leaf twisting. |
| **Vector** | None. | Transmitted by the Green Leafhopper (*Nephotettix virescens*).`
  },
  {
    topicId: 47, // Rice Diseases
    questionText: '[Session 2019-20] Enlist two seed-borne and two soil-borne diseases of rice with their causal agents.',
    answerText: `## Answer

Here are two major seed-borne and two soil-borne diseases of rice in Bangladesh:

### 1. Seed-Borne Diseases:
1. **Rice Blast:** Caused by the fungus *Pyricularia oryzae* (survives as conidia on the seed coat).
2. **Bakanae Disease (Foolish Seedling):** Caused by the fungus *Fusarium fujikuroi* (internally seed-borne in the embryo).

### 2. Soil-Borne Diseases:
1. **Sheath Blight of Rice:** Caused by the fungus *Rhizoctonia solani* (survives as sclerotia in soil/crop residues and spreads via water).
2. **Stem Rot of Rice:** Caused by the fungus *Sclerotium oryzae* (sclerotia survive in soil and float to infect plant crowns).`
  },
  {
    topicId: 50, // Jute & Cotton Diseases
    questionText: '[Session 2019-20] Discuss the control measure schedule for angular leafspot of cotton.',
    answerText: `## Answer

Angular leafspot of cotton (also known as blackarm), caused by the bacterium **_Xanthomonas citri_ pv. _malvacearum_**, requires an integrated management schedule:

### Scheduled Control Measures:

#### 1. Seed Sanitation (Pre-Sowing)
* **Acid Delinting:** Soak fuzzy seeds in concentrated sulfuric acid (100 mL/kg seed) to remove fuzz and destroy external bacterial populations on the seed coat.
* **Chemical Seed Dressing:** Dress delinted seeds with **Agrimycin-100** or streptocycline (100 ppm) combined with a fungicide (carboxin) to eliminate internal infections.

#### 2. Cultural Practices (During Sowing)
* Maintain wider plant spacing to optimize airflow and lower canopy relative humidity.
* Avoid sowing cotton in waterlogged fields. Rotate cotton with non-host crops (cereals) for 2 years.

#### 3. Foliar Spray Schedule (Post-Emergence)
* Spray the crop with a combination of **copper oxychloride (0.2%) and Streptomycin (100 ppm)** at the first sign of leaf spots. Repeat at 12–15 day intervals during rainy periods to arrest secondary bacterial spread.`
  },
  {
    topicId: 51, // Pulse & Oilseed Diseases
    questionText: '[Session 2019-20] Describe the symptoms of grey leaf spot of mustard and cercospora leaf spot of mungbean.',
    answerText: `## Answer

Here are the diagnostic symptoms of grey leaf spot of mustard and cercospora leaf spot of mungbean:

### 1. Grey Leaf Spot of Mustard (Alternaria Blight)
* **Causal Agent:** *Alternaria brassicae*
* **Symptoms:**
  * Starts as small, circular, dark brown spots on lower leaves.
  * Spots enlarge, developing greyish centers and characteristic **target-board (concentric rings)**.
  * In humid weather, circular spots merge, causing defoliation. Similar dark linear spots appear on stems and pods (leading to shriveled seeds).

### 2. Cercospora Leaf Spot of Mungbean
* **Causal Agent:** *Cercospora canescens*
* **Symptoms:**
  * Prominent on leaves as circular to sub-circular spots with **greyish-white centers and distinct reddish-brown borders**.
  * Under high humidity, dark fuzzy conidiophores and conidia cover the greyish-white spot centers.`
  },
  {
    topicId: 49, // Sugarcane Diseases
    questionText: '[Session 2019-20] Mention the suitable environmental factors for red rot of sugarcane and brown spot of rice.',
    answerText: `## Answer

Pathogens require specific microclimatic and host conditions to trigger epidemics:

### 1. Red Rot of Sugarcane (*Colletotrichum falcatum*)
* **Temperature:** Optimum temperature of **25°C to 30°C** favors mycelial growth and conidial germination.
* **Moisture:** High soil moisture, waterlogging, or continuous rainfall. Flooding or irrigation water facilitates spore transport from infected stubbles.
* **Host Stress:** Monoculture of susceptible cultivars and mechanical injuries (borer damage) that create entry points.

### 2. Brown Spot of Rice (*Bipolaris oryzae*)
* **Temperature:** Warm temperatures of **25°C to 30°C**.
* **Relative Humidity:** High relative humidity (**above 90%**) and prolonged leaf wetness (dew) are critical for spore germination.
* **Host Predisposition:** Nutrient-deficient, sandy, or poorly drained soils (low Nitrogen and Potassium) stress the host, predisposing it to severe infection.`
  },
  {
    topicId: 51, // Pulse & Oilseed Diseases
    questionText: '[Session 2019-20] Detail the control measures for grey leaf spot of mustard and mosaic of mungbean.',
    answerText: `## Answer

Integrated control strategies for grey leaf spot of mustard and mungbean yellow mosaic:

### 1. Control of Grey Leaf Spot of Mustard
* **Seed Dressing:** Dress seeds with **iprodione (Rovral 50 WP)** @ 2g/kg seed to eliminate seed-borne inoculum.
* **Chemical Sprays:** Spray the crop with **Rovral 50 WP** or Mancozeb @ 0.2% starting at 40 days after sowing. Repeat 2–3 times at 10–12 day intervals.
* **Sanitation:** Remove weed hosts (wild mustards) and plow under infected crop residue.

### 2. Control of Mungbean Yellow Mosaic (MYMV)
* **Vector Control:** Apply systemic insecticides (e.g., **imidacloprid** @ 0.5 mL/L or dimethoate) to kill the Whitefly vector (*Bemisia tabaci*).
* **Resistant Cultivars:** Grow resistant mungbean varieties.
* **Sanitation:** Rogue out and destroy infected yellow-mosaic seedlings as soon as they appear in the field.`
  },
  {
    topicId: 40, // Introduction & Pathogenicity
    questionText: '[Session 2019-20] "No correlation exists between the degree of parasitism and disease severity." Explain this statement with examples.',
    answerText: `## Answer

This statement is **correct**. In plant pathology, a pathogen with a highly specialized relationship with its host (high degree of parasitism) does not necessarily cause the most severe or destructive disease, and vice versa.

### Scientific Explanation and Examples:

#### 1. High Degree of Parasitism / Low Disease Severity
* **Biotrophs (Obligate Parasites):** Pathogens like rusts (*Puccinia* spp.) or powdery mildews (*Erysiphe* spp.) have a highly sophisticated, specialized parasitic relationship. They depend on the host cells remaining alive to absorb nutrients via haustoria.
* *Effect:* Because they keep the host alive, they cause chronic yield loss but rarely cause rapid tissue necrosis or plant death, despite their high degree of parasitism.

#### 2. Low Degree of Parasitism / High Disease Severity
* **Necrotrophs:** Pathogens like *Pythium debaryanum* (damping-off) or *Bipolaris oryzae* (brown spot) have a low degree of parasitism. They are unspecialized and quickly kill host tissues using massive doses of toxins and enzymes, feeding on the dead cellular remains.
* *Effect:* They cause rapid, severe tissue rot, lodging, and crop death in a short time, showing that lower parasitism can lead to much higher disease severity.`
  },
  {
    topicId: 45, // Chromatography/Epidemiology
    questionText: '[Session 2019-20] Explain the diagrammatic model showing how plants change their susceptibility to disease with age.',
    answerText: `## Answer

Plants change their susceptibility to specific pathogens as they grow and mature (phenological or ontogenic resistance/susceptibility).

### Susceptibility Patterns with Age:

\`\`\`
Relative Susceptibility
  ^
  │   /\\  (Pattern A: Damping-off)
  │  /  \\
  │ /    \\________________________ (Pattern B: Foliar Rusts)
  │/      \\                      /\\
  │        \\                    /  \\
  │         \\__________________/    \\
  └─────────────────────────────────────────> Crop Age (Time)
   Seedling     Vegetative    Flowering    Harvest
\`\`\`

#### 1. Seedling/Juvenile Susceptibility (Pattern A)
Young seedlings have thin, unlignified cell walls and high sugar content, making them highly susceptible to damping-off and root-rot fungi (*Pythium*, *Rhizoctonia*). As tissues mature and develop cuticles (lignification), susceptibility drops to zero.

#### 2. Adult/Mature Plant Susceptibility (Pattern B)
Foliar rusts and leaf spot fungi often colonize mature, fully expanded leaves during vegetative and flowering stages.

#### 3. Senescent Susceptibility
During grain filling, physiological defense mechanisms decline, making older tissues susceptible to weak necrotrophic pathogens.`
  }
];

let added = 0;
missingQuestions.forEach(newQ => {
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

  // Check duplicate by normalized text comparison
  const exists = targetTopic.Questions.some(q => 
    q.questionText.toLowerCase().replace(/\[.*?\]/g, '').trim() === 
    newQ.questionText.toLowerCase().replace(/\[.*?\]/g, '').trim()
  );

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
  console.log(`Successfully added ${added} new questions to database.json!`);
} else {
  console.log("No new questions added.");
}
