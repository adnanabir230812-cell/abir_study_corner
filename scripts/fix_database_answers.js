const { sequelize, Question } = require('../models');

async function fixDatabaseAnswers() {
  try {
    console.log('Connecting to SQLite database to fix answers...');

    // 1. Fix Biotrophs vs Necrotrophs (ID: 102)
    const q102 = await Question.findByPk(102);
    if (q102) {
      q102.answerText = `## Answer

### Comparison: Biotrophs vs. Necrotrophs

| Feature | Biotrophs | Necrotrophs |
| :--- | :--- | :--- |
| **Host cell killing** | Not rapidly killed | Rapidly killed |
| **Toxins & enzymes** | Few or none produced | Toxins and cytolytic enzymes produced |
| **Special structures** | Haustoria formed | No special structures |
| **Host range** | Narrow | Wide |
| **Growth away from host** | Unable | Able (saprophytic) |
| **Penetration** | Direct or natural openings | Wounds or natural openings |
| **Host attacked** | Healthy hosts at all stages | Juvenile, debilitated or senescing tissues |`;
      await q102.save();
      console.log('Fixed Question 102 (Biotrophs vs Necrotrophs).');
    }

    // 2. Fix Infection vs Invasion (ID: 107)
    const q107 = await Question.findByPk(107);
    if (q107) {
      q107.answerText = `## Answer

### Comparison: Infection vs. Invasion

| Feature | Infection | Invasion |
| :--- | :--- | :--- |
| **Definition** | Establishment of contact by the pathogen with the host plant. | Spread of the pathogen into the host after infection. |
| **Process** | Pathogen grows/multiplies, colonizes host. | Pathogen moves through host tissues. |
| **Result** | Appearance of symptoms (or latent infection). | Systemic or local spread. |
| **Example** | *Phytophthora infestans* infects potato | *Apple scab* (*Venturia inaequalis*) grows between cuticle and epidermis. |`;
      await q107.save();
      console.log('Fixed Question 107 (Infection vs Invasion).');
    }

    // 3. Fix Vivotoxin, Pathotoxin, Phytotoxin (ID: 110)
    const q110 = await Question.findByPk(110);
    if (q110) {
      q110.answerText = `## Answer

### Comparison: Vivotoxin, Pathotoxin, and Phytotoxin

| Feature | Vivotoxin | Pathotoxin | Phytotoxin |
| :--- | :--- | :--- | :--- |
| **Definition** | Substance produced in infected host by pathogen/host that functions in disease but is not the initial inciting agent. | Chemical of biological origin; host-specific toxin producing almost all disease symptoms even in the absence of the causal organism. | Poisonous substances synthesized by plants or plant pathogens through biochemical reactions. |
| **Host Specificity** | Non-specific | Host specific | Defensive agent / Non-specific |
| **Role in Disease** | Partial role | Causal/primary role | Defensive/protective role |
| **Examples** | Fusaric acid, Pyricularin | T-toxin, Victorin, HC-toxin, Wildfire toxin | Against pests, insects, environmental stress |`;
      await q110.save();
      console.log('Fixed Question 110 (Toxin Types).');
    }

    // 4. Fix Systemic vs Contact Fungicides (ID: 132)
    const q132 = await Question.findByPk(132);
    if (q132) {
      q132.answerText = `## Answer

### Comparison: Systemic vs. Contact (Non-systemic) Fungicides

| Feature | Systemic Fungicides | Contact (Non-systemic) Fungicides |
| :--- | :--- | :--- |
| **Movement** | Moves inside plant through vascular bundles (xylem/phloem). | Remains on the plant surface where applied. |
| **Mode** | Effective at sites other than where sprayed (translocation). | Only effective where directly applied. |
| **Action** | Curative and protective. | Mainly protective/preventative. |
| **Mobility Types** | Apoplastic, Symplastic, Amphimobile, Translaminar. | No translocation. |
| **Examples** | Benomyl, Propiconazole, Carbendazim, Tricyclazole. | Bordeaux mixture, Mancozeb, Captan, Zineb, Thiram. |`;
      await q132.save();
      console.log('Fixed Question 132 (Systemic vs Contact Fungicides).');
    }

    // 5. Fix Vertical vs Horizontal Resistance (ID: 137)
    const q137 = await Question.findByPk(137);
    if (q137) {
      q137.answerText = `## Answer

### Comparison: Vertical vs. Horizontal Resistance

| Feature | Vertical Resistance (VR) | Horizontal Resistance (HR) |
| :--- | :--- | :--- |
| **Definition** | Complete resistance to some races of a pathogen but not to others. | Partial resistance equally effective against all races of a pathogen. |
| **Gene Basis** | Monogenic or oligogenic (major genes). | Polygenic (minor genes). |
| **Host Specificity** | Race-specific / Host specific. | Race non-specific / Host non-specific. |
| **Effect on Pathogen** | VR does not allow the pathogen to establish in the host — no increase of disease. | HR allows the pathogen to establish but decreases the rate of disease increase. |
| **Epidemiological Implication** | Epidemic cannot develop until breakdown by a new pathogen race. | Epidemic development depends on the level of HR and environmental conditions. |
| **Durability** | Less durable — can be rapidly overcome by new virulent races. | More durable. |

### Preference & Justification:
We strongly prefer **Horizontal Resistance (HR)** in broad-scale agricultural systems for the following reasons:
1. **Durability:** Since it is governed by multiple minor genes (polygenic), the pathogen cannot overcome it with a single nucleotide mutation. Thus, it lasts much longer in the field.
2. **Stability:** It provides stable, race-non-specific protection. Unlike the "boom and bust" cycle of Vertical Resistance, there is no threat of sudden complete crop failure when new pathogen races evolve.
3. **Epidemic Suppression:** Although it allows the pathogen to establish at minor, non-damaging levels, it directly slows down the rate of epidemic progress ($r$), keeping disease severity below economic injury levels.`;
      await q137.save();
      console.log('Fixed Question 137 (Vertical vs Horizontal Resistance).');
    }

    // 6. Fix Missing Bullet Points in ID 125 (Moisture importance)
    const q125 = await Question.findByPk(125);
    if (q125) {
      q125.answerText = `## Answer

Moisture is the predominant factor in the development of most epidemics caused by fungi (blights, downy mildews, leaf spots, rusts, anthracnoses), bacteria (leaf spots, blights, soft rots), and nematodes.

### Major Effects of Moisture:

* **Effects on Host:** Moisture promotes succulent, lush growth of the host, making it physically more susceptible to pathogen penetration.
* **Effects on Pathogen:**
  * Increases sporulation of fungi and rapid multiplication of bacteria.
  * Favors spore release by many fungi and oozing of bacterial cells.
  * Enables fungal spores to germinate and allows motile zoospores, bacteria, and nematodes to move through water films to reach hosts.
  * High soil moisture directly increases the activity and survival of soil-borne pathogens like *Pythium*, *Phytophthora*, *Rhizoctonia*, and *Plasmodiophora brassicae*.
* **Effects on Disease Cycle:** Different moisture levels influence different events — e.g., *Pyricularia oryzae* sporulates at moderate moisture (85–90%) but release of spores, dissemination, and infections require high moisture (92–100%).
* **Effects on Vector:** High humidity reduces the activity of insect vectors but enhances the activity of fungal and nematode vectors.`;
      await q125.save();
      console.log('Fixed Question 125 (Moisture effects with bullets).');
    }

    // 7. Fix Missing Bullet Points in ID 128 (Temperature fluctuation)
    const q128 = await Question.findByPk(128);
    if (q128) {
      q128.answerText = `## Answer

Temperature directly dictates the geographic distribution and seasonal occurrence of plant disease epidemics.

### Key Temperature Fluctuation Effects:

* **Effects of Temperature on Hosts:**
  * Temperatures higher or lower than the optimum range for the host plant reduce the plant's metabolic activity, making it stressed and predisposed to disease infection.
* **Effects on Pathogen:**
  * Favorable temperature helps polycyclic pathogens complete their lifecycle within a very short time, exponentially increasing inoculum production.
  * Low temperature reduces the viability of fungi and bacteria.
  * High temperature reduces the viability of viruses and mycoplasmas.
  * *Pyricularia oryzae* produces spores more rapidly at 28°C; in *Phytophthora infestans*, zoospore germination occurs at 10–12°C while direct conidial germination occurs at 24°C.
* **Effects of Day/Night Temperature Cycles:**
  * Sporulation of *Pyricularia oryzae* occurs primarily during the daytime and decreases with the reduction of light.
  * Dissemination of spores begins at night and ceases at sunrise.
  * This day/night temperature and light cycle creates periodic peaks of inoculum that drive epidemic cycles.`;
      await q128.save();
      console.log('Fixed Question 128 (Temperature effects with bullets).');
    }

    // 8. Fix Missing Bullet Points in ID 134 (Biological control)
    const q134 = await Question.findByPk(134);
    if (q134) {
      q134.answerText = `## Answer

### 1. Definition of Biological Control
**Biological control** is the suppression of a plant pathogen population by another organism (referred to as the antagonist/biocontrol agent). It is a population-leveling process in which the population of the antagonist lowers the survival or density of the pathogen. First coined by **Harry Smith**.

### 2. Why Biological Control is Prioritized:
* **Eco-friendly:** Chemical pesticides are highly toxic to non-target beneficial organisms, leave residues, and cause massive soil/water pollution. Biocontrol agents are non-toxic and biodegradable.
* **Pathogen Resistance:** Pathogens frequently develop rapid resistance to single-site chemical fungicides. Development of resistance to multi-site biocontrol mechanisms is highly unlikely.
* **Sustainability:** Chemical pesticides require repeated treatments, while established biocontrol populations can self-replicate and persist in the rhizosphere for years.

### 3. Mechanisms of Antagonism (How BCA Suppresses Pathogen):
* **A. Antibiosis:** Inhibition of one organism by another through the secretion of antibiotics or toxic metabolites.
  * *Example:* *Bacillus cereus* produces *Zwittermicin A* against *Phytophthora* root rot in alfalfa; *Bacillus subtilis* produces *Iturin A* against *Botrytis cinerea*.
* **B. Nutrient Competition:** Direct competition between BCA and pathogen for vital resources like Carbon, Nitrogen, Oxygen, or Iron.
  * *Example:* *Pseudomonas fluorescens* prevents bacterial blotch by competing with *Pseudomonas tolaasii*.
* **C. Mycoparasitism / Hyperparasitism:** The antagonist directly invades and feeds on the pathogen hyphae.
  * *Example:* *Trichoderma harzianum* coils around host hyphae, secretes cell-wall-degrading enzymes (chitinases, glucanases), and penetrates *Fusarium culmorum*.
* **D. Lytic Enzymes:** Release of enzymes (chitinase, β-1,3-glucanase, protease) that directly hydrolyze and rupture pathogen cell walls.
* **E. Siderophore Secretion:** BCA releases high-affinity iron chelators (**siderophores**) that bind free Fe³⁺, making it unavailable to rhizosphere pathogens.
* **F. Induced Systemic Resistance (ISR):** Colonization of roots by PGPRs (*Pseudomonas*, *Trichoderma*) induces plant systemic resistance depending on ethylene and jasmonic acid pathways.
* **G. Cross Protection:** Inoculation with a mild virus strain protects the host against severe virulent strains of the same virus (e.g., Citrus Tristeza Virus).`;
      await q134.save();
      console.log('Fixed Question 134 (Biological control with bullets).');
    }

    console.log('All DB comparison tables and missing bullet points have been beautifully formatted!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing database answers:', error);
    process.exit(1);
  }
}

fixDatabaseAnswers();
