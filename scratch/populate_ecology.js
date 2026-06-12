const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const qPath = path.join(__dirname, 'ecology_questions.json');

if (!fs.existsSync(dbPath)) {
  console.error('database.json not found!');
  process.exit(1);
}
if (!fs.existsSync(qPath)) {
  console.error('ecology_questions.json not found!');
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const qData = JSON.parse(fs.readFileSync(qPath, 'utf8'));

// Dictionary of solved answers for Crop Ecology (Section B - Sarwar Sir)
const solvedAnswers = {
  // Topic 1: Ecosystem: Definition & Classification
  1000: `An ecosystem is the self-sustaining structural and functional interaction between living (biotic) and non-living (abiotic) components of the environment in a geographic location.

Ecosystems are classified into two main types:
* Natural Ecosystems:
  * Terrestrial Ecosystems: Grasslands, forests, and desert ecosystems.
  * Aquatic Ecosystems:
    * Lentic (Stagnant water): Lakes, ponds, and swamps.
    * Lotic (Flowing water): Rivers, streams, and oceans.
* Artificial (Man-made) Ecosystems:
  * Examples: Croplands (paddy fields, cornfields), gardens, aquariums, parks, and kitchen gardens.`,

  1001: `Ecosystems are classified as follows:
* Natural Ecosystems:
  * Terrestrial: Forests, grasslands, deserts.
  * Aquatic:
    * Lentic (Stagnant water): Ponds, lakes.
    * Lotic (Flowing water): Rivers, streams, oceans.
* Artificial (Man-made) Ecosystems:
  * Examples: Croplands, gardens, aquariums, parks, and kitchen gardens.`,

  1002: `The major ecosystems of the world are:
* Terrestrial Ecosystems:
  * Forest ecosystems
  * Grassland ecosystems
  * Desert ecosystems
* Aquatic Ecosystems:
  * Lentic ecosystems (stagnant water bodies, e.g., lakes, ponds)
  * Lotic ecosystems (flowing water bodies, e.g., rivers, streams)
  * Marine ecosystems (oceans and seas)`,

  // Topic 2: Ecosystem as the Basic Structural & Functional Unit
  1003: `An ecosystem is considered the basic structural and functional unit of ecology because it encompasses all the living components and physical factors, along with their dynamic interactions, required to sustain life.

* Structural Unit:
  * Biotic Components: Comprises living organisms (producers, consumers, and decomposers) that maintain ecological balance.
  * Abiotic Components: Includes non-living factors (sunlight, water, soil, air, and nutrients) that create the physical environment for living beings.
* Functional Unit:
  * Energy Flow: Energy enters the system via photosynthesis (by producers), flows through food chains to consumers, and exits as heat (following thermodynamic laws).
  * Nutrient Cycling: Essential nutrients (carbon, nitrogen, phosphorus) are continuously recycled between abiotic and biotic components.
  * Self-Sustenance: Ecosystems are self-regulating systems capable of maintaining stability (homeostasis) through feedback mechanisms.`,

  1004: `An ecosystem is considered the basic structural and functional unit of ecology because it encompasses all the living components and physical factors, along with their dynamic interactions, required to sustain life.

* Structural Unit:
  * Biotic Components: Comprises living organisms (producers, consumers, and decomposers) that maintain ecological balance.
  * Abiotic Components: Includes non-living factors (sunlight, water, soil, air, and nutrients) that create the physical environment for living beings.
* Functional Unit:
  * Energy Flow: Energy enters the system via photosynthesis (by producers), flows through food chains to consumers, and exits as heat (following thermodynamic laws).
  * Nutrient Cycling: Essential nutrients (carbon, nitrogen, phosphorus) are continuously recycled between abiotic and biotic components.
  * Self-Sustenance: Ecosystems are self-regulating systems capable of maintaining stability (homeostasis) through feedback mechanisms.`,

  // Topic 3: Components of Ecosystem (Crop Field)
  1005: `A maize field ecosystem consists of biotic and abiotic components structured specifically for agricultural production:

* Abiotic Components:
  * Soil: Acts as a nutrient pool and anchors crop roots.
  * Water: Crucial for crop growth and nutrient transport.
  * Climate and Solar Radiation: Sunlight drives photosynthesis; temperature regulates growth rates.
  * Inorganic Nutrients: Nitrogen, phosphorus, potassium, and carbon dioxide in the air.
* Biotic Components:
  * Primary Producers: The main crop (maize plants) and weeds growing alongside.
  * Consumers (Heterotrophs):
    * Primary Consumers (Herbivores): Insects (stem borers, leafhoppers), snails, birds, and small rodents feeding on crops.
    * Secondary Consumers (Carnivores): Frogs, spiders, predatory insects, and snakes feeding on herbivores.
  * Decomposers (Saprotrophs): Soil microorganisms (bacteria, actinomycetes, fungi) and nematodes that break down crop residues and organic matter.`,

  1006: `A rice field ecosystem consists of biotic and abiotic components structured specifically for agricultural production:

* Abiotic Components:
  * Soil: Acts as a nutrient pool and anchors crop roots.
  * Water: Crucial for crop growth and nutrient transport.
  * Climate and Solar Radiation: Sunlight drives photosynthesis; temperature regulates growth rates.
  * Inorganic Nutrients: Nitrogen, phosphorus, potassium, and carbon dioxide in the air.
* Biotic Components:
  * Primary Producers: The main crop (rice plants) and weeds growing alongside.
  * Consumers (Heterotrophs):
    * Primary Consumers (Herbivores): Insects (stem borers, leafhoppers), snails, birds, and small rodents feeding on crops.
    * Secondary Consumers (Carnivores): Frogs, spiders, predatory insects, and snakes feeding on herbivores.
  * Decomposers (Saprotrophs): Soil microorganisms (bacteria, actinomycetes, fungi) and nematodes that break down crop residues and organic matter.`,

  1007: `A crop field ecosystem consists of biotic and abiotic components structured specifically for agricultural production:

* Abiotic Components:
  * Soil: Acts as a nutrient pool and anchors crop roots.
  * Water: Crucial for crop growth and nutrient transport.
  * Climate and Solar Radiation: Sunlight drives photosynthesis; temperature regulates growth rates.
  * Inorganic Nutrients: Nitrogen, phosphorus, potassium, and carbon dioxide in the air.
* Biotic Components:
  * Primary Producers: The main crop (plants) and weeds growing alongside.
  * Consumers (Heterotrophs):
    * Primary Consumers (Herbivores): Insects (stem borers, leafhoppers), snails, birds, and small rodents feeding on crops.
    * Secondary Consumers (Carnivores): Frogs, spiders, predatory insects, and snakes feeding on herbivores.
  * Decomposers (Saprotrophs): Soil microorganisms (bacteria, actinomycetes, fungi) and nematodes that break down crop residues and organic matter.`,

  1008: `A crop field ecosystem consists of biotic and abiotic components structured specifically for agricultural production:

* Abiotic Components:
  * Soil: Acts as a nutrient pool and anchors crop roots.
  * Water: Crucial for crop growth and nutrient transport.
  * Climate and Solar Radiation: Sunlight drives photosynthesis; temperature regulates growth rates.
  * Inorganic Nutrients: Nitrogen, phosphorus, potassium, and carbon dioxide in the air.
* Biotic Components:
  * Primary Producers: The main crop (plants) and weeds growing alongside.
  * Consumers (Heterotrophs):
    * Primary Consumers (Herbivores): Insects (stem borers, leafhoppers), snails, birds, and small rodents feeding on crops.
    * Secondary Consumers (Carnivores): Frogs, spiders, predatory insects, and snakes feeding on herbivores.
  * Decomposers (Saprotrophs): Soil microorganisms (bacteria, actinomycetes, fungi) and nematodes that break down crop residues and organic matter.`,

  // Topic 4: Agroecosystem: Attributes & Properties
  1009: `An agroecosystem is an ecological system modified by humans to produce agricultural products. It has four main properties/attributes:

* Productivity: The net increment of valued products per unit of resources (land, labor, energy, capital). It is commonly measured as annual yield per hectare.
* Stability: The degree to which productivity remains constant despite normal small-scale fluctuations in environmental variables (such as climate) or market conditions.
* Sustainability: The ability of the system to maintain its productivity when subjected to stress or perturbation.
  * Stress: Regular, predictable, relatively small, and continuous disturbance (e.g., rising soil salinity).
  * Perturbation: Irregular, infrequent, relatively large, and unpredictable disturbance (e.g., drought or flood).
* Equitability: A measure of how evenly the produce of the agroecosystem is distributed among its human beneficiaries.`,

  1010: `Energy flow in an agroecosystem is an open, managed pathway driven by solar energy and human inputs:

* Sunlight: The primary source of energy, captured by crop plants (producers) via photosynthesis.
* Human Energy Inputs: Additional energy is introduced by the farmer (in the form of tillage, fossil fuels, fertilizers, irrigation, and seeds) to maximize crop output.
* Crop Harvesting: Unlike natural systems where energy stays within, energy in an agroecosystem is exported out of the system in the form of harvested crop yield (food/fodder) for human consumption.
* Energy Loss: At each energy transfer step, a large portion of energy (around 90%) is lost as heat due to respiration and metabolic work (second law of thermodynamics), meaning only about 10% is transferred to herbivores or decomposers.`,

  1011: `An agroecosystem represents an open, managed pathway where inputs and outputs are highly manipulated:

* Inputs: Includes solar energy, seed selection, and human inputs (fertilizers, pesticides, fuel, irrigation) to maximize the growth of selected crop varieties.
* Energy Flow: Follows the laws of thermodynamics, where solar energy is fixed by crops (producers). Energy is exported out of the system in the form of harvested crop yield (food/fodder).
* Loss of Energy: At each trophic transfer level, 90% of the energy is dissipated as heat, leaving only 10% for the next level. Minimizing weeds and non-target herbivores keeps energy focused on crop yields.`,

  // Topic 5: Energy Flow & Laws of Thermodynamics
  1012: `The flow of energy through an ecosystem strictly follows the first and second laws of thermodynamics:

* First Law of Thermodynamics (Law of Energy Conservation):
  * Energy cannot be created or destroyed, only transformed from one form to another.
  * In an ecosystem, solar energy is captured by green plants and converted into chemical energy (carbohydrates) via photosynthesis.
* Second Law of Thermodynamics (Law of Energy Degradation):
  * During energy transfers, some energy is degraded and lost as heat, making the transfer inefficient.
  * In a food chain, as energy passes from producers to primary consumers and then to secondary consumers, about 90% of the energy is lost as respiratory heat and work at each level.
  * Only about 10% of the energy is transferred to the next level (10% Rule). This loss of energy degrades the energy potential and limits the length of food chains to 4 or 5 levels.`,

  // Topic 6: Food Chain & Food Web
  1013: `A food chain is a single, linear pathway showing the flow of energy from one organism to another. A food web is a complex network of interconnected food chains showing all feeding relationships in an ecosystem.

* Comparison Table:
  | Basic Terms | Food Chain | Food Web |
  | :--- | :--- | :--- |
  | **Definition** | A linear series of organisms in which each feeds on the one at the next lower level. | Numerous interconnections of food chains in an ecosystem. |
  | **Number of Chains** | Consists of a single linear chain. | Comprised of numerous interconnected chains. |
  | **Energy Flow** | Unidirectional, linear pathway. | Multidirectional pathway. |
  | **Trophic Levels** | Consists of 4-6 trophic levels. | Contains many numerous trophic levels. |
  | **Feeding Habit** | Organisms feed on a single type of organism. | Organisms feed on several types of organisms. |
  | **Stability** | Decreases the stability of the ecosystem. | Increases the stability of the ecosystem. |
  | **Adaptability** | Does not improve adaptability. | Improves adaptability and competitiveness. |`,

  1014: `A food chain is a single, linear pathway showing the flow of energy from one organism to another. A food web is a complex network of interconnected food chains showing all feeding relationships in an ecosystem.

* Comparison Table:
  | Basic Terms | Food Chain | Food Web |
  | :--- | :--- | :--- |
  | **Definition** | A linear series of organisms in which each feeds on the one at the next lower level. | Numerous interconnections of food chains in an ecosystem. |
  | **Number of Chains** | Consists of a single linear chain. | Comprised of numerous interconnected chains. |
  | **Energy Flow** | Unidirectional, linear pathway. | Multidirectional pathway. |
  | **Trophic Levels** | Consists of 4-6 trophic levels. | Contains many numerous trophic levels. |
  | **Feeding Habit** | Organisms feed on a single type of organism. | Organisms feed on several types of organisms. |
  | **Stability** | Decreases the stability of the ecosystem. | Increases the stability of the ecosystem. |
  | **Adaptability** | Does not improve adaptability. | Improves adaptability and competitiveness. |

* Diagrams:
  * Food Chain:
    \`Sun -> Green Grass (Producer) -> Grasshopper (Primary Consumer) -> Frog (Secondary Consumer) -> Snake (Tertiary Consumer) -> Hawk (Top Predator)\`
  * Food Web:
    \`\`\`
       /--> Grasshopper --> Frog ---\\
    Grass                   |---> Snake ---> Hawk
       \\--> Rabbit -----------------/
    \`\`\``,

  1015: `* Food Chain Schematic:
  \`Sun -> Green Grass (Producer) -> Grasshopper (Primary Consumer) -> Frog (Secondary Consumer) -> Snake (Tertiary Consumer) -> Hawk (Top Predator)\`

* Food Web Schematic:
  \`\`\`
     /--> Grasshopper --> Frog ---\\
  Grass                   |---> Snake ---> Hawk
     \\--> Rabbit -----------------/
  \`\`\``,

  1016: `The importance of food chains in an ecosystem include:
* Energy Flow: They serve as the primary pathways for transferring energy from the sun (via producers) to consumers.
* Nutrient Cycling: They facilitate the movement of essential nutrients through the biotic components of the ecosystem and back to the soil via decomposers.
* Population Regulation: They help maintain ecological balance by regulating the populations of prey and predators.
* Ecosystem Stability: They aid in assessing the overall health and stability of the environment. If any link is broken, it can disrupt the entire ecosystem.`,

  1017: `The significance and importance of food chains in an ecosystem include:
* Energy Flow: They serve as the primary pathways for transferring energy from the sun (via producers) to consumers.
* Nutrient Cycling: They facilitate the movement of essential nutrients through the biotic components of the ecosystem and back to the soil via decomposers.
* Population Regulation: They help maintain ecological balance by regulating the populations of prey and predators.
* Ecosystem Stability: They aid in assessing the overall health and stability of the environment. If any link is broken, it can disrupt the entire ecosystem.`,

  // Topic 7: Ecological Pyramids (Eltonian Pyramids)
  1018: `* Comparison:
  * Pyramid of Number: Represents the total number of individual organisms at each trophic level. It can be upright (in grasslands) or inverted (in parasitic or detritus food chains where many organisms feed on a single host).
  * Pyramid of Biomass: Represents the total weight of living organic matter (biomass) at each level. It is upright in terrestrial systems but inverted in marine ecosystems (where small phytoplankton biomass supports larger zooplankton and fish biomass).

* Schematic Representation:
  * Upright Pyramid (Numbers/Biomass):
    \`\`\`
         [ Carnivores ]
       [   Herbivores   ]
     [     Producers      ]
    \`\`\`
  * Inverted Pyramid (Marine Biomass / Parasitic Numbers):
    \`\`\`
     [     Consumers      ]
       [   Herbivores   ]
         [ Producers  ]
    \`\`\``,

  1019: `An ecological pyramid is a graphical representation of the relationship between organisms at different trophic levels. The three types of Eltonian pyramids are:
* Pyramid of Number: Shows the total number of individual organisms at each level. Usually upright (e.g., grassland), but can be inverted in detritus/parasitic systems.
* Pyramid of Biomass: Shows the total living weight (biomass) at each level. Upright in terrestrial systems, but inverted in oceans (phytoplankton vs. zooplankton).
* Pyramid of Energy: Shows the total energy present at each level. It is **always upright** because energy flow is unidirectional and about 90% is lost as heat at each transfer.`,

  1020: `The three types of Eltonian pyramids can be schematically represented as follows:

* Pyramid of Number (Upright grassland type):
  \`\`\`
       [ Carnivores ]
     [   Herbivores   ]
   [     Producers      ]
  \`\`\`
* Pyramid of Biomass (Inverted aquatic type):
  \`\`\`
   [  Zooplankton / Fish  ]
     [  Phytoplankton  ]
  \`\`\`
* Pyramid of Energy (Always upright):
  \`\`\`
       [ Carnivores (10 J) ]
     [   Herbivores (100 J)   ]
   [     Producers (1000 J)     ]
  \`\`\``,

  1021: `The three types of Eltonian pyramids can be drawn and labeled as follows:

* Pyramid of Number (Upright grassland type):
  \`\`\`
       [ Carnivores ]
     [   Herbivores   ]
   [     Producers      ]
  \`\`\`
* Pyramid of Biomass (Inverted aquatic type):
  \`\`\`
   [  Zooplankton / Fish  ]
     [  Phytoplankton  ]
  \`\`\`
* Pyramid of Energy (Always upright):
  \`\`\`
       [ Carnivores (10 J) ]
     [   Herbivores (100 J)   ]
   [     Producers (1000 J)     ]
  \`\`\``,

  // Topic 8: Trophic Level & Productivity
  1022: `* Trophic Level: It refers to each feeding level in a food chain or ecosystem (e.g., Producers, Herbivores, Carnivores).
* Differences:
  * Gross Primary Productivity (GPP): The total amount of carbon dioxide reduced to organic carbon (chemical energy) by plants per unit time during photosynthesis.
  * Net Primary Productivity (NPP): The rate at which organic carbon is accumulated as plant biomass. It is calculated as GPP minus Autotrophic Respiration ($R_A$):
    $$\\text{NPP} = \\text{GPP} - R_A$$`,

  1023: `Primary productivity in ecosystems is limited and controlled by several key environmental factors:
* Temperature: Regulates enzymatic and chemical reaction rates. Higher temperatures double reaction rates, increasing productivity in tropical regions compared to arctic ones.
* Water (Precipitation): Crucial for terrestrial ecosystems. High soil moisture and rainfall increase transpiration and photosynthesis, boosting primary productivity.
* Light: Sunlight is the source of energy. While terrestrial systems are rarely light-limited (except under dense canopies), aquatic systems are heavily limited by light attenuation with depth.
* Nutrients: Terrestrial productivity is primarily limited by nitrogen availability, whereas aquatic systems are limited by phosphorus. Increased nutrients result in higher productivity.`,

  1024: `Primary productivity in ecosystems is limited and controlled by several key environmental factors:
* Temperature: Regulates enzymatic and chemical reaction rates. Higher temperatures double reaction rates, increasing productivity in tropical regions compared to arctic ones.
* Water (Precipitation): Crucial for terrestrial ecosystems. High soil moisture and rainfall increase transpiration and photosynthesis, boosting primary productivity.
* Light: Sunlight is the source of energy. While terrestrial systems are rarely light-limited (except under dense canopies), aquatic systems are heavily limited by light attenuation with depth.
* Nutrients: Terrestrial productivity is primarily limited by nitrogen availability, whereas aquatic systems are limited by phosphorus. Increased nutrients result in higher productivity.`,

  // Topic 9: Methods of Measuring Productivity
  1025: `Methods for measuring primary productivity in ecosystems include:
* Satellite Sensors (NDVI): Measures reflected visible and near-infrared light off vegetation to estimate terrestrial autotroph productivity.
* $CO_2$ Method: Measures net consumption of $CO_2$ in the light (to determine NPP) and production of $CO_2$ in the dark (to determine Respiration).
* Harvest Method: Measures standing crop biomass at two different times. The difference between the two measurements represents the NPP.
* Light/Dark Bottle (Oxygen) Method (for aquatic systems): Measures oxygen production in a light bottle (NPP) and oxygen consumption in a dark bottle (Respiration) to compute GPP.

* Description of the Harvest Method:
  This method is commonly used in terrestrial agriculture. Biomass of the standing crop is harvested and measured in a unit area at time $T_1$ and again at a later time $T_2$. The difference in dry weight between these two time points ($\\text{Biomass}_{T2} - \\text{Biomass}_{T1}$) represents the Net Primary Production (NPP) accumulated over that period.`,

  // Topic 10: Eutrophication & Dead Zones
  1026: `* Eutrophication: It is the enrichment of water bodies with nutrients (principally nitrogen and phosphorus), often from sewage discharge or agricultural fertilizer runoff. This excess of nutrients leads to rapid growth of algae (algal blooms). When the algae die, decomposers (bacteria) multiply and consume large amounts of dissolved oxygen (D.O.) to break down the organic matter.
* Dead Zones: As oxygen levels deplete sharply (hypoxia or anoxia), the aquatic environment becomes inhabitable. Fish and other active marine animals either migrate or suffocate and die. These oxygen-deprived regions are called dead zones.`,

  // Topic 11: Crop Association: Definition & Forms
  1027: `Crop association is the simultaneous production of a number of crops at the same time in the same farming area to maximize the synergies and biological interactions among them. It is the planting of two or more species in the same space and time. Crop cycles are parallel or overlapping, and these associations harmonize depending on their configuration in space and time.`,

  1028: `Crop association is the simultaneous production of a number of crops at the same time in the same farming area to maximize the synergies and biological interactions among them.

The forms of crop association include:
* Mixed Crops: A mixture of several crops grown at the same time without a specific spatial configuration but with specific densities (e.g., amaranth, cabbage).
* Strip Crops: A mixture of several cropsArranged in alternating rows or strips (e.g., lines of zucchinis + strips of onions).
* Intercalated Crops: Planting a short-cycle crop under cover or between the main crop (e.g., radish + onion + lettuce).
* Intercropping (Relay): Sowing a second crop when the first has reached its reproductive stage but has not yet been harvested (e.g., alfalfa + turnip).
* Satellite Crops: Sowing a few plants of one specific crop in or around the main crop as trap plants (e.g., eggplants around potatoes to attract Colorado beetles).`,

  1029: `Crop association is the simultaneous production of a number of crops at the same time in the same farming area to maximize the synergies and biological interactions among them.

The principles of mixed cropping are:
* Sowing mixtures should consist of crops with different durations (short and long duration).
* Crops attacked by similar insects, pests, and diseases should not be sown together.
* Bushy crops should be sown with erect-growing crops to share sunlight.
* Legumes should be sown with non-legumes (e.g., arhar with jowar, or gram with wheat) to improve soil nitrogen levels.`,

  1030: `The basic principles of crop association are:
* Avoid cultivating plants of the same family twice consecutively to reduce pest/disease pressure.
* Avoid cultivating plants for the same harvested part (fruit, leaf, root) twice consecutively to prevent soil nutrient depletion.
* Plant nutrient-demanding crops at the beginning of the succession to exploit organic matter.
* Wait 3-4 years before cultivating the same plant on the same farming area.
* Combine crops with complementary root depths (e.g., cabbage + lettuce) and light requirements (e.g., ginger under papaya).
* Plant legume crops with non-legumes to improve soil nitrogen levels.
* Group crops with similar water needs.`,

  1031: `The limitations of crop association include:
* Labor Difficulty: It increases the complexity of hand labor, weeding, and seedbed preparation for multiple crop types.
* Mechanization Limits: It is difficult or impossible to use heavy agricultural machinery for sowing, cultivating, and harvesting.
* Resource Competition: If poor combinations are chosen, crops can compete intensely for nutrients, water, and sunlight, leading to yield loss.
* Disease and Pest Spread: Some insect pests and diseases can spread more easily across different species in a mixed habitat if wrong choices are made.`,

  // Topic 12: Types of Intercropping
  1032: `Intercropping is the practice of growing two or more crops in proximity to utilize resources that would otherwise not be utilized in monoculture.

The four forms of intercropping are:
* Mixed Intercropping: Growing crops together with no distinct row arrangement (e.g., maize and pigeon pea grown together).
* Row Intercropping: Growing crops simultaneously where one or more crops are planted in specific rows (e.g., jute in one row and sesame/blackgram in alternate rows).
* Strip Intercropping: Growing crops in alternating strips wide enough for independent cultivation but narrow enough to interact (e.g., alternating strips of rice and lentils).
* Relay Intercropping: Planting a second crop into a standing first crop after it has reached its reproductive stage but before harvest (e.g., planting mustard in Aman rice fields before harvest).`,

  1033: `| Features | Mixed Intercropping | Row Intercropping |
| :--- | :--- | :--- |
| **Row Arrangement** | Crops are grown simultaneously with no distinct row pattern. | One or more crops are sown in clear, specific rows. |
| **Management** | Difficult to perform weeding, spraying, and harvesting. | Sowing in rows facilitates weeding, interculture, and spraying. |
| **Examples** | Maize and pigeon pea broadcasted or mixed randomly. | Alternate rows of Jute and Blackgram / Jute and Sesame. |`,

  1034: `Row intercropping involves growing two or more crops simultaneously in specific row arrangements:
* Alternate Row Intercropping: Planting one row of crop A followed by one row of crop B (e.g., Jute and Sesame in alternate rows).
* Multiple Row Intercropping: Planting multiple rows of the main crop followed by one or more rows of the intercrop (e.g., 2 rows of groundnut between alternate rows of arhar).
* Alley Cropping: Growing food crops in alleys formed by rows of trees or shrubs.`,

  // Topic 13: Relay Cropping vs Ratoon Cropping
  1035: `* Relay Cropping: Involves growing two or more crops simultaneously during part of their life cycles, where the second crop is sown into the standing first crop when the first reaches its reproductive stage (e.g., mustard sown in Aman rice before harvest).
* Ratoon Cropping: Involves harvesting the main crop but leaving the roots and lower parts in the soil to grow a new crop (ratoon) from the stubble (e.g., sugarcane ratooning, where a second harvest is gathered from the same root system).`,

  // Topic 14: Intercropping vs Mixed Cropping
  1036: `| Features | Intercropping | Mixed Cropping |
| :--- | :--- | :--- |
| **Sowing Pattern** | Crops are grown in specific row arrangements/patterns. | Seeds are mixed together and sown with no row configuration. |
| **Main Objective** | To utilize space left between rows of the main crop. | To secure at least one crop harvest under risky, unfavorable conditions. |
| **Crop Focus** | More emphasis and care is given to the main crop. | All crops are cared for and treated equally. |
| **Competition** | Minimized by choosing non-competing growth architectures. | High competition exists among all mixed crops. |
| **Crop Duration** | Intercrops have shorter duration and are harvested early. | Mixed crops have almost the same duration. |
| **Management** | Fertilizer and pesticide applications can be targeted. | The entire field receives identical applications. |`,

  1037: `| Features | Intercropping | Mixed Cropping |
| :--- | :--- | :--- |
| **Sowing Pattern** | Crops are grown in specific row arrangements/patterns. | Seeds are mixed together and sown with no row configuration. |
| **Main Objective** | To utilize space left between rows of the main crop. | To secure at least one crop harvest under risky, unfavorable conditions. |
| **Crop Focus** | More emphasis and care is given to the main crop. | All crops are cared for and treated equally. |
| **Competition** | Minimized by choosing non-competing growth architectures. | High competition exists among all mixed crops. |
| **Crop Duration** | Intercrops have shorter duration and are harvested early. | Mixed crops have almost the same duration. |
| **Management** | Fertilizer and pesticide applications can be targeted. | The entire field receives identical applications. |`,

  1038: `For better yields and resource use efficiency, **intercropping** is preferred over mixed cropping:
* Row Arrangement: Sowing in rows facilitates standard agricultural operations (weeding, irrigation, crop protection) and harvesting.
* Reduced Competition: Intercropping matches plants with different growth architectures and root depths, preventing direct competition.
* Targeted Inputs: It allows applying different fertilizers and pesticides to specific rows as needed, unlike mixed cropping where inputs are broadcasted uniformly.`,

  // Topic 15: Principles & Management of Intercropping
  1039: `The principles of crop selection for intercropping include:
* Growth Habit: Combine tall, erect-growing crops with shorter, wide-spreading canopy crops (e.g., maize + beans).
* Rooting Depth: Match shallow-rooted crops with deep-rooted ones to minimize nutrient competition in the soil profile (e.g., wheat + gram).
* Maturity: Select species with different maturity times so they do not compete for resources during peak growth phases.
* Nutrient Complementarity: Plant nitrogen-fixing legumes alongside non-legumes (e.g., cereal + legume).
* Pest and Disease Mitigation: Choose crop families that do not share the same pests or diseases.`,

  1040: `Key management practices in intercropping are:
* Space and Row Arrangement: Implement strict spatial configurations (e.g., 1:1 or 2:1 row arrangements) to allow space for both crops.
* Water Management: Select crops with similar water requirements to avoid waterlogging one or drying the other.
* Pest Management: Utilize trap crops (e.g., eggplant to attract beetles away from potatoes) and ban joint-host crops.
* Weed Control: Ensure intercrops are planted at optimal densities to naturally suppress weeds.
* Fertilizer Application: Apply fertilizers specifically to rows of the target crop rather than broadcasting.`,

  // Topic 16: Multiple Cropping & Cropping Intensity
  1041: `Multiple cropping is the most viable option to increase cropping intensity in Bangladesh:
* Limited Arable Land: Bangladesh has high population density and declining agricultural land. Expanding horizontal land area is impossible.
* Vertical Expansion: Multiple cropping (growing two or more crops on the same land within a year) maximizes the use of space and time.
* Land Use Efficiency: Using relay cropping, intercropping, and short-duration crops (e.g., mustard between Aman and Boro rice) allows farmers to grow three or four crops annually on a single plot.
* Climate Suitability: Year-round sunshine and favorable water resources enable continuous cropping cycles.`,

  // Topic 17: LER & RYT: Interpretation
  1042: `An LER of 1.76 means there is a significant land-use advantage in intercropping mungbean and potato over growing them as monocultures:
* It implies that the intercrop mixture produces a yield that would require 1.76 hectares of land under monoculture (sole cropping) to achieve.
* In other words, intercropping mungbean and potato results in a **76% increase in land-use efficiency**, saving 76% more land compared to sole cropping.`,

  1043: `An LER of 1.45 indicates a land-use advantage:
* It means that growing sugarcane and potato together as a mixture requires 1.0 hectare of land to produce the same yield that would require 1.45 hectares of land if they were grown as sole crops (monocultures).
* This represents a **45% land-use advantage** or efficiency gain.`,

  1044: `Relative Yield Total (RYT) is conceptually equivalent to LER. An RYT of 1.45 means that growing maize and mungbean together in an intercrop mixture requires 45% less land area than growing them separately as sole crops to produce the same quantity of yield. It indicates a significant resource-use and land efficiency advantage.`,

  1045: `Relative Yield Total (RYT) of 1.48 indicates a land-use advantage. It means that growing maize and blackgram together in an intercrop mixture requires 48% less land area than growing them separately as sole crops to achieve the same yield. This represents a 48% increase in land productivity.`,

  // Topic 18: Food Chain & Food Web [Cross-listed]
  1046: `A food chain is a single, linear pathway showing the flow of energy from one organism to another. A food web is a complex network of interconnected food chains showing all feeding relationships in an ecosystem.

* Comparison Table:
  | Basic Terms | Food Chain | Food Web |
  | :--- | :--- | :--- |
  | **Definition** | A linear series of organisms in which each feeds on the one at the next lower level. | Numerous interconnections of food chains in an ecosystem. |
  | **Number of Chains** | Consists of a single linear chain. | Comprised of numerous interconnected chains. |
  | **Energy Flow** | Unidirectional, linear pathway. | Multidirectional pathway. |
  | **Trophic Levels** | Consists of 4-6 trophic levels. | Contains many numerous trophic levels. |
  | **Feeding Habit** | Organisms feed on a single type of organism. | Organisms feed on several types of organisms. |
  | **Stability** | Decreases the stability of the ecosystem. | Increases the stability of the ecosystem. |
  | **Adaptability** | Does not improve adaptability. | Improves adaptability and competitiveness. |`,

  // Topic 19: Pollution & Pollutants: Definitions & Classification
  1047: `* Definitions:
  * Pollution: An undesirable physical, chemical, or biological change in our air, water, and land that harmfully affects human life, desirable species, industrial processes, and cultural assets.
  * Pollutants: Harmful materials or substances introduced into the environment that cause pollution.
* Remedial Measures for Bangladesh:
  * Standardize industrial siting through Environmental Impact Assessment (EIA) studies.
  * Reduce agricultural runoff by adopting Integrated Pest Management (IPM) and reducing chemical fertilizer/pesticide usage.
  * Establish proper municipal and industrial wastewater treatment plants to reduce BOD/COD levels.
  * Ban dumping of toxic hazardous wastes and promote the 3Rs (Reduce, Reuse, Recycle).
  * Implement massive afforestation along coastal and river basins.`,

  // Topic 20: Air Pollution
  1048: `Air pollutants have severe impacts on human health:
* Particulate Matter/Dust: Causes respiratory diseases like silicosis (cough, cold, sneezing), asbestosis, byssinosis, and lung tissue damage.
* Carbon Monoxide (CO): Binds to hemoglobin, causing carbon monoxide poisoning, oxygen deprivation, and cardiovascular stress.
* Nitrogen Dioxide ($NO_2$): Causes lung irritation, bronchitis, and pulmonary edema.
* Sulfur Dioxide ($SO_2$): Triggers throat/eye irritation, suffocation, and chronic respiratory diseases.
* Hydrogen Sulfide ($H_2S$): Causes respiratory passage irritation, with risks of paralysis and asphyxiation.
* Heavy Metals (Lead/Cadmium): Causes brain damage, retards brain activity, and interferes with liver/kidney enzyme functions.`,

  1049: `Measures to check air pollution in Khulna city include:
* Relocate brick kilns and heavy industries away from residential areas after EIA studies.
* Transition vehicles to cleaner fuels (such as Compressed Natural Gas - CNG, or electric vehicles).
* Mandate electrostatic precipitators, cyclone separators, and scrubbers on industrial chimneys.
* Carry out regular vehicle emission testing and tune-up engines.
* Carry out massive roadside and urban tree plantation to absorb gaseous pollutants.`,

  1050: `Air is polluted by natural and anthropogenic sources:
* Natural Sources: Volcanic eruptions, forest fires, dust storms, and cosmic rays.
* Anthropogenic Sources:
  * Domestic: Cooking (releasing fats and odors) and space heating (burning fossil fuels releasing $CO$, $CO_2$, $SO_x$, $NO_x$, soot).
  * Industrial: Chemical fertilizer plants (releasing $NO_x$), paper plants, natural gas processing, oil refineries, and synthetic fiber plants ($H_2S$).
  * Transportation-related: Vehicles emit volatile organic compounds (VOCs), lead, nitrogen oxides, and carbon monoxide.
  * Agricultural: Pesticide/insecticide sprays, cotton processing particles, and livestock emissions.`,

  1051: `Air is polluted by natural and anthropogenic sources:
* Natural Sources: Volcanic eruptions, forest fires, dust storms, and cosmic rays.
* Anthropogenic Sources:
  * Domestic: Cooking (releasing fats and odors) and space heating (burning fossil fuels releasing $CO$, $CO_2$, $SO_x$, $NO_x$, soot).
  * Industrial: Chemical fertilizer plants (releasing $NO_x$), paper plants, natural gas processing, oil refineries, and synthetic fiber plants ($H_2S$).
  * Transportation-related: Vehicles emit volatile organic compounds (VOCs), lead, nitrogen oxides, and carbon monoxide.
  * Agricultural: Pesticide/insecticide sprays, cotton processing particles, and livestock emissions.`,

  // Topic 21: Water Pollution: Sources, Effects & Control
  1052: `Unnecessary use of agrochemicals (pesticides, herbicides, fertilizers) contaminates water bodies through two main pathways:
* Surface Runoff: Heavy rainfall or irrigation washes excess fertilizers (containing nitrogen and phosphorus) and pesticides from fields into nearby rivers, canals, and ponds.
* Leaching: Highly soluble agrochemicals (such as nitrates) percolate down through the soil profile into groundwater aquifers, contaminating drinking water sources.
* Eutrophication: Excess nitrogen and phosphorus runoff acts as plant nutrients in water bodies, triggering rapid algal blooms which deplete oxygen and kill aquatic life.`,

  1053: `Yes, water pollution is a major cause of freshwater scarcity:
* Quality Degradation: Although the total volume of water on Earth remains constant, pollution by municipal sewage, industrial effluents, and agrochemicals makes fresh water unsafe and unusable for human consumption, agriculture, and industry.
* Groundwater Contamination: Toxic chemicals and nitrates leach into aquifers. Once an aquifer is polluted, reclamation is extremely difficult and expensive.
* Resource Depletion: Eutrophication and heavy metal contamination destroy local freshwater ecosystems (lakes and rivers), forcing communities to seek distant or expensive treated water sources.`,

  1054: `* Eutrophication: The nutrient enrichment of water bodies (via nitrogen and phosphorus runoff from agricultural fertilizers and municipal sewage) that stimulates excessive growth of algae (algal blooms).
* Effects on Aquatic Animals: Dead algae are decomposed by bacteria, which consumes dissolved oxygen (D.O.), leading to hypoxia. This suffocates fish and other aquatic organisms, creating "dead zones."
* Effects on Humans: Waterborne pathogens in sewage cause diseases like cholera, typhoid, and dysentery. Heavy metals (mercury, lead) biomagnify and cause toxicity.`,

  1055: `The causes and impacts of water pollution on agroecosystems are:
* Causes:
  * Agricultural runoff containing pesticides, herbicides, and excess synthetic fertilizers.
  * Leaching of nitrates into shallow groundwater reservoirs.
  * Discharge of untreated industrial effluents and sewage containing heavy metals and pathogens into irrigation canals.
* Impacts:
  * Crop Contamination: Irrigation with polluted water accumulates heavy metals (mercury, lead, cadmium) and pathogens in crop tissues, reducing yields and poisoning food chains.
  * Soil Degradation: Saline or chemical-laden water harms soil microbiology (bacteria, fungi) and structure.
  * Eutrophication: Runoff from fields alters aquatic nutrient cycles in surrounding bodies, killing fish.`,

  1056: `Sources and causes of water pollution in Khulna region:
* Point Sources:
  * Untreated municipal wastewater and sewage dumped directly into local rivers.
  * Industrial effluents from jute mills, shrimp processing plants, and small-scale industries (metals, chemicals).
* Non-Point Sources:
  * Agricultural runoff carrying fertilizers and pesticides from surrounding crop fields.
  * Saline water intrusion from aquaculture (shrimp farms) and tidal floods.
  * Washing clothes and dumping municipal rubbish along rivers.`,

  1057: `Eutrophication is the nutrient enrichment of water bodies (principally nitrogen and phosphorus), often from sewage discharge or agricultural fertilizer runoff. This excess of nutrients leads to rapid growth of algae (algal blooms). When the algae die, decomposers (bacteria) multiply and consume large amounts of dissolved oxygen (D.O.) to break down the organic matter, suffocating fish and creating dead zones.`,

  // Topic 22: Key Terms: Bioaccumulation, Biomagnification, BOD, DO
  1058: `* Bioaccumulation: The accumulation of a toxic chemical (such as DDT or methylmercury) in the tissues of a single organism over its lifetime because it is lipid-soluble and cannot be easily excreted.
* Biomagnification: The progressive increase in concentration of non-biodegradable toxic substances at successive, higher trophic levels of a food chain (e.g., from plankton to fish to fish-eating birds/humans).`,

  1059: `Minamata disease is a severe neurological syndrome caused by methylmercury poisoning:
* It was first discovered in 1953 in Minamata Bay, Japan, where industrial effluents containing mercury were discharged into the bay.
* The mercury was converted by bacteria into organic methylmercury, which accumulated in fish.
* Symptoms in humans who consumed the contaminated fish included numbness of body parts, vision and hearing loss, abnormal mental behavior, paralysis, and death.`,

  1060: `Itai-Itai disease is a painful bone-softening disease caused by chronic cadmium poisoning:
* It occurred in Japan due to the consumption of cadmium-contaminated rice.
* The rice fields were irrigated with mining drainage water containing cadmium.
* The disease targets the bones (causing severe joint and spine pain, and fractures), liver, kidneys, lungs, pancreas, and thyroid.`,

  // Topic 23: Soil & Land Pollution
  1061: `Measures to reduce soil pollution in our country include:
* Adopt the 3Rs (Reduce, Reuse, Recycle) for municipal solid wastes to minimize landfill loads.
* Reduce reliance on chemical inputs in farming by adopting crop rotation, organic manures, and Integrated Pest Management (IPM).
* Treat industrial and mining wastes to remove heavy metals before land application.
* Enforce strict regulations against air/water-borne toxic chemical discharge.
* Restore vegetation cover and plant grass/trees to prevent soil erosion and land degradation.`,

  // Topic 24: Agricultural Pollution & Agrochemicals
  1062: `Strategies to reduce environmental pollution caused by agrochemicals:
* Judicious Application: Train farmers to apply the right quantity of fertilizers and pesticides based on soil tests.
* Buffer Strips: Plant grasses, shrubs, or trees along field borders and near water bodies to filter out chemicals from surface runoff.
* Integrated Pest Management (IPM): Combine biological controls, mechanical traps, and crop rotation to reduce chemical pesticide use.
* Cover Crops: Plant cover crops (e.g., oats, vetch, cowpeas) during fallow periods to stabilize soil and prevent nutrient leaching.
* Nitrogen-fixing Plants: Integrate legumes (e.g., mungbean, lentil) into crop rotations to naturally enrich soil nitrogen.`,

  1063: `Improper use of agrochemicals (fertilizers and pesticides) poses severe threats to human health:
* Direct Exposure: Farmers spraying chemicals without protective gear inhale toxins, leading to acute poisoning, skin diseases, and respiratory disorders.
* Food Contamination: Pesticide residues remain on harvested crops. When consumed, they can act as carcinogens and cause endocrine disruptions.
* Water Contamination: Soluble nitrates leach into drinking water wells, causing Blue Baby Syndrome (methemoglobinemia) in infants, and forming cancer-causing compounds in the stomach.
* Biomagnification: Non-biodegradable chemicals like DDT build up in lipid tissues and bioaccumulate, causing long-term damage to the liver, kidneys, and nervous system.`,

  1064: `Improper use of agrochemicals (fertilizers and pesticides) poses severe threats to human health in Bangladesh:
* Direct Exposure: Farmers spraying chemicals without protective gear inhale toxins, leading to acute poisoning, skin diseases, and respiratory disorders.
* Food Contamination: Pesticide residues remain on harvested crops. When consumed, they can act as carcinogens and cause endocrine disruptions.
* Water Contamination: Soluble nitrates leach into drinking water wells, causing Blue Baby Syndrome (methemoglobinemia) in infants, and forming cancer-causing compounds in the stomach.
* Biomagnification: Non-biodegradable chemicals like DDT build up in lipid tissues and bioaccumulate, causing long-term damage to the liver, kidneys, and nervous system.`,

  1065: `Improper use of insecticides is a great threat to human health:
* Direct Exposure: Farmers spraying chemicals without protective gear inhale toxins, leading to acute poisoning, skin diseases, and respiratory disorders.
* Food Contamination: Pesticide residues remain on harvested crops. When consumed, they can act as carcinogens and cause endocrine disruptions.
* Water Contamination: Soluble nitrates leach into drinking water wells, causing Blue Baby Syndrome (methemoglobinemia) in infants, and forming cancer-causing compounds in the stomach.
* Biomagnification: Non-biodegradable chemicals like DDT build up in lipid tissues and bioaccumulate, causing long-term damage to the liver, kidneys, and nervous system.`,

  1066: `Agrochemicals can severely degrade soil quality and long-term productivity:
* Destruction of Soil Biota: Excess chemical pesticides and fertilizers kill beneficial soil microorganisms (bacteria, fungi, actinomycetes) and earthworms, disrupting natural decomposition and nutrient cycling.
* Soil Acidification/Salinization: Continuous use of synthetic nitrogenous fertilizers alters soil pH (causing acidification) and leaves salt residues that hinder root absorption.
* Organic Matter Depletion: Crops are harvested and removed, leaving soil poor in organic matter. Without natural manure replenishment, soil structures degrade, causing compaction and erosion.`,

  1067: `Remedial measures to reduce the detrimental effects of agrochemicals on environment:
* Judicious Application: Train farmers to apply the right quantity of fertilizers and pesticides based on soil tests.
* Buffer Strips: Plant grasses, shrubs, or trees along field borders and near water bodies to filter out chemicals from surface runoff.
* Integrated Pest Management (IPM): Combine biological controls, mechanical traps, and crop rotation to reduce chemical pesticide use.
* Cover Crops: Plant cover crops (e.g., oats, vetch, cowpeas) during fallow periods to stabilize soil and prevent nutrient leaching.
* Nitrogen-fixing Plants: Integrate legumes (e.g., mungbean, lentil) into crop rotations to naturally enrich soil nitrogen.`,

  1068: `Key options to reduce environmental pollution in Bangladesh:
* Standardize industrial zoning and enforce Environmental Impact Assessments (EIA) for all new factories.
* Promote the 3Rs (Reduce, Reuse, Recycle) for municipal solid wastes.
* Implement municipal sewage and industrial effluent treatment plants (ETPs).
* Encourage farmers to adopt Integrated Pest Management (IPM) and organic farming.
* Undertake massive coastal afforestation and urban tree planting.`,

  // Topic 25: Bioremediation
  1069: `Bioremediation is the use of living organisms (such as bacteria, fungi, or plants) to break down, remove, or neutralize hazardous environmental pollutants:
* Microbial Action: Specialized soil and water bacteria digest organic pollutants (such as hydrocarbons, oil spills, and pesticides), converting them into harmless substances like water and carbon dioxide.
* Phytoremediation: Plants are used to absorb, accumulate, and concentrate heavy metals (such as lead, cadmium, and arsenic) or organic contaminants from polluted soils and water.
* Cost-effectiveness: It is a natural, less disruptive, and highly cost-effective alternative to mechanical soil excavation or chemical cleanup.`,

  // Topic 26: Plants as Ameliorators of Environment
  1070: `Plants act as natural cleaners and ameliorators of environmental quality in several ways:
* Air Purification: Plants absorb carbon dioxide and release oxygen during photosynthesis. They also filter out airborne particulates (dust, soot) and absorb gaseous pollutants like $SO_2$ and $NO_x$.
* Phytoremediation: Many plant species absorb and stabilize toxic heavy metals and chemical pollutants in contaminated soil and water.
* Riparian Buffer Zones: Trees and grasses planted along water bodies act as natural filters, intercepting agricultural nutrient runoff and preventing eutrophication.
* Indoor Air Quality: Specific indoor plants (e.g., spider plant, peace lily, English ivy) absorb indoor volatile organic compounds (VOCs) and solvents.
* Soil and Water Conservation: Plant roots bind soil, preventing erosion and runoff, while promoting water infiltration into aquifers.`,

  // Topic 27: Halophytes & Salinity Tolerance
  1071: `Halophytes are specialized plants adapted to survive in highly saline environments through several mechanisms:
* Salt Exclusion: Root membranes filter and exclude salt ions ($Na^+$, $Cl^-$) from entering the vascular system while absorbing water.
* Salt Secretion: Some halophytes possess specialized salt glands on their leaves that actively secrete excess salts.
* Salt Accumulation (Succulence): Excess salt is stored in vacuoles of fleshy leaves or stems, diluting the internal salt concentration.
* Osmotic Adjustment: Accumulation of organic solutes (like proline) inside cells maintains a lower osmotic potential, allowing water uptake from saline soil.`,

  // Topic 28: Ecological Hazard & Disaster Management [2016-17 specific]
  1072: `The geographical location of Bangladesh makes it highly vulnerable to ecological hazards:
* Deltaic Lowlands: Located on the active Ganges-Brahmaputra-Meghna delta, a vast portion of the country is low-lying and flat, making it prone to riverine flooding during monsoons.
* Funnel-shaped Bay of Bengal: The coastline funnels tidal waters, which intensifies wind speed and storm surges during tropical cyclones.
* Hilly Borders: Hilly regions in the east and northeast experience heavy rainfall, causing flash floods and landslides.
* Climate Vulnerability: Positioned in the monsoon belt, it experiences extreme seasonal rainfall variations, leading to alternating floods and dry-season droughts.`,

  1073: `The disaster management cycle consists of key continuous phases:
* Pre-Disaster Phase:
  * Mitigation: Actions taken to prevent or reduce the risk and impact of a disaster (e.g., building embankments and cyclone shelters).
  * Preparedness: Planning how to respond, including early warning systems, training, and stockpiling supplies.
* During-Disaster Phase:
  * Response: Immediate search and rescue, evacuation, and emergency relief operations.
* Post-Disaster Phase:
  * Recovery: Restoring essential services and medical care.
  * Reconstruction/Rehabilitation: Rebuilding homes and infrastructure to be more resilient ("Build Back Better").`,

  1074: `* (i) Hazard vs. Disaster:
  * Hazard: A threat or potentially dangerous event (natural or man-made) that could cause harm (e.g., an active cyclone over the ocean, or an earthquake fault line).
  * Disaster: The actual occurrence of a hazard that causes widespread destruction of lives, property, and livelihoods exceeding a community's capacity to cope.
* (ii) Cyclone vs. Tropical Storm:
  * Tropical Storm: A rotating low-pressure weather system with organized thunderstorms and sustained wind speeds between 39 and 73 mph.
  * Cyclone: A fully developed, severe tropical system with sustained wind speeds exceeding 74 mph (119 km/h) and a prominent central "eye."`,

  // Topic 29: Mangrove: Environmental Conditions & Characteristics
  1075: `The environmental and ecological conditions essential for mangrove development are:
* Saline/Brackish Water: Regular inundation by tidal seawater mixed with freshwater discharge from rivers.
* Tropical and Subtropical Latitudes: Warm climates near the equator; mangroves cannot tolerate freezing temperatures.
* Fine Sedimentary Soil: Low-oxygen (anaerobic), muddy, and unstable soil deposits in deltaic estuaries.
* Tidal Activity: Periodic flooding to distribute seeds/propagules and wash away salt residues.
* Protection from High Waves: Low-energy coastlines (estuaries, bays) where silt sediments can settle.`,

  1076: `The environmental and ecological conditions essential for mangrove development are:
* Saline/Brackish Water: Regular inundation by tidal seawater mixed with freshwater discharge from rivers.
* Tropical and Subtropical Latitudes: Warm climates near the equator; mangroves cannot tolerate freezing temperatures.
* Fine Sedimentary Soil: Low-oxygen (anaerobic), muddy, and unstable soil deposits in deltaic estuaries.
* Tidal Activity: Periodic flooding to distribute seeds/propagules and wash away salt residues.
* Protection from High Waves: Low-energy coastlines (estuaries, bays) where silt sediments can settle.`,

  // Topic 30: Root Modifications in Halophytes
  1077: `Halophytes (mangroves) develop specialized root modifications to survive in unstable, low-oxygen, and waterlogged coastal soils:
* Pneumatophores (Breathing Roots): Upward-growing vertical roots that emerge from the mud. They contain pores (lenticels) that allow gas exchange (respiration) during low tide.
* Stilt or Prop Roots: Roots emerging from the lower trunk or branches that grow downwards into the mud, providing strong physical anchorage against tides and winds (e.g., in *Rhizophora*).
* Buttress Roots: Flanged, wall-like extensions at the base of the trunk that distribute weight and stabilize tall trees on soft mud.`,

  1078: `Halophytes (mangroves) develop specialized root modifications to survive in unstable, low-oxygen, and waterlogged coastal soils:
* Pneumatophores (Breathing Roots): Upward-growing vertical roots that emerge from the mud. They contain pores (lenticels) that allow gas exchange (respiration) during low tide.
* Stilt or Prop Roots: Roots emerging from the lower trunk or branches that grow downwards into the mud, providing strong physical anchorage against tides and winds (e.g., in *Rhizophora*).
* Buttress Roots: Flanged, wall-like extensions at the base of the trunk that distribute weight and stabilize tall trees on soft mud.`,

  // Topic 31: Vivipary in Halophytes
  1079: `* Vivipary is the phenomenon where seeds germinate and develop into seedlings (propagules) while still attached to the parent plant.
* Survival Mechanism: In unstable tidal muds, normal seeds would either drown in low-oxygen water or be swept away by tides.
* Viviparous propagules grow to a substantial length on the parent tree. When they drop, they either plunge directly into the soft mud to anchor immediately, or float horizontally in tidal water until they settle upright in shallow mud, ensuring successful establishment.`,

  // Topic 32: How Halophytes Cope with Saline Soil
  1080: `Halophytes survive in saline soils through key physiological adaptations:
* Salt Exclusion: Root membranes act as physical filters that exclude salt ions ($Na^+$, $Cl^-$) from the vascular stream while absorbing water.
* Salt Secretion: Excreting excess absorbed salts via active transport through specialized salt glands on leaf surfaces.
* Vacuum Storage (Succulence): Fleshy tissues store water to dilute internal salt concentrations within vacuoles.
* Osmotic Regulation: Accumulating organic solutes (e.g., proline) to lower root water potential, enabling water absorption from salty ground.`,

  1081: `Halophytes survive in saline soils through key physiological adaptations:
* Salt Exclusion: Root membranes act as physical filters that exclude salt ions ($Na^+$, $Cl^-$) from the vascular stream while absorbing water.
* Salt Secretion: Excreting excess absorbed salts via active transport through specialized salt glands on leaf surfaces.
* Vacuum Storage (Succulence): Fleshy tissues store water to dilute internal salt concentrations within vacuoles.
* Osmotic Regulation: Accumulating organic solutes (e.g., proline) to lower root water potential, enabling water absorption from salty ground.`,

  // Topic 33: Ecological Significance of Mangrove Vegetation
  1082: `Mangrove forests in Bangladesh (such as the Sundarbans) play a vital dual role in ecological protection and livelihood support:
* Ecological Significance:
  * Natural Shield: Protects inland populations and crops by absorbing wind energy and reducing storm surges during cyclones.
  * Shoreline Stabilization: Dense root systems trap sediment, preventing coastal soil erosion and accelerating land reclamation.
  * Biodiversity Sanctuary: Serves as a rich breeding ground and habitat for terrestrial and aquatic wildlife (fish, crabs, Royal Bengal Tigers).
* Livelihood Development:
  * Natural Resource Harvesting: Provides timber, poles, and firewood.
  * Non-timber Forest Products: Supports local gatherers who collect Golpata (for roofing), wild honey, wax, and medicinal leaves.
  * Estuarine Fisheries: Provides crabs, shrimp fry, and fish that sustain thousands of coastal fishermen.`,

  1083: `Mangrove forests in Bangladesh (such as the Sundarbans) play a vital dual role in ecological protection and livelihood support:
* Ecological Significance:
  * Natural Shield: Protects inland populations and crops by absorbing wind energy and reducing storm surges during cyclones.
  * Shoreline Stabilization: Dense root systems trap sediment, preventing coastal soil erosion and accelerating land reclamation.
  * Biodiversity Sanctuary: Serves as a rich breeding ground and habitat for terrestrial and aquatic wildlife (fish, crabs, Royal Bengal Tigers).
* Livelihood Development:
  * Natural Resource Harvesting: Provides timber, poles, and firewood.
  * Non-timber Forest Products: Supports local gatherers who collect Golpata (for roofing), wild honey, wax, and medicinal leaves.
  * Estuarine Fisheries: Provides crabs, shrimp fry, and fish that sustain thousands of coastal fishermen.`,

  1084: `Mangrove forests in Bangladesh (such as the Sundarbans) play a vital dual role in ecological protection and livelihood support:
* Ecological Significance:
  * Natural Shield: Protects inland populations and crops by absorbing wind energy and reducing storm surges during cyclones.
  * Shoreline Stabilization: Dense root systems trap sediment, preventing coastal soil erosion and accelerating land reclamation.
  * Biodiversity Sanctuary: Serves as a rich breeding ground and habitat for terrestrial and aquatic wildlife (fish, crabs, Royal Bengal Tigers).
* Livelihood Development:
  * Natural Resource Harvesting: Provides timber, poles, and firewood.
  * Non-timber Forest Products: Supports local gatherers who collect Golpata (for roofing), wild honey, wax, and medicinal leaves.
  * Estuarine Fisheries: Provides crabs, shrimp fry, and fish that sustain thousands of coastal fishermen.`,

  // Topic 34: The Sundarbans: Ecological Significance & Biodiversity
  1085: `The Sundarbans (571,508 ha) is of immense ecological significance to Bangladesh's environment:
* Storm Protection: It serves as a natural green barrier, absorbing the wind force and storm surges of tropical cyclones from the Bay of Bengal, protecting millions of coastal lives.
* Carbon Sequestration: The dense biomass acts as a massive sink for atmospheric carbon dioxide, mitigating global climate change.
* Biodiversity Hotspot: It supports high floral and faunal diversity, including 245 plant genera (e.g., Sundari, Gewa, Goran, Golpata), 234 terrestrial faunal species, and 219 aquatic species.`,

  1086: `The Sundarbans is a vital alternative livelihood option for the coastal communities of Khulna, Bagerhat, and Satkhira:
* Non-Timber Forest Products (NTFP): Provides honey and wax collected by local honey gatherers (Mawali) and Golpata leaves (*Nypa fruticans*) used for thatch roofing.
* Forestry Produce: Source of timber, construction poles, and wood pulp.
* Fishery Support: The estuarine networks of channels and creeks support crab harvesting and shrimp fry collection, providing income for coastal families.`,

  1087: `The Sundarbans is a vital alternative livelihood option for the coastal communities of Khulna, Bagerhat, and Satkhira:
* Non-Timber Forest Products (NTFP): Provides honey and wax collected by local honey gatherers (Mawali) and Golpata leaves (*Nypa fruticans*) used for thatch roofing.
* Forestry Produce: Source of timber, construction poles, and wood pulp.
* Fishery Support: The estuarine networks of channels and creeks support crab harvesting and shrimp fry collection, providing income for coastal families.`,

  1088: `The Sundarbans is a vital alternative livelihood option for the coastal communities of Khulna, Bagerhat, and Satkhira:
* Non-Timber Forest Products (NTFP): Provides honey and wax collected by local honey gatherers (Mawali) and Golpata leaves (*Nypa fruticans*) used for thatch roofing.
* Forestry Produce: Source of timber, construction poles, and wood pulp.
* Fishery Support: The estuarine networks of channels and creeks support crab harvesting and shrimp fry collection, providing income for coastal families.`,

  1089: `The Sundarbans represents a crucial livelihood and ecological protection shield for the coastal community.

To conserve the biodiversity of this forest, several strategies must be implemented:
* Strictly Enforced Sanctuaries: Establish and patrol wildlife sanctuaries and reserve boundaries, banning illegal logging and poaching.
* Sustainable Harvesting: Regulate the seasonal harvesting of Golpata, honey, and crabs with strict quotas.
* Community-Based Forestry: Involve local communities (co-management) in conservation, providing alternative income sources to reduce extraction pressure.
* Limit Agricultural/Industrial Runoff: Regulate upstream chemical waste discharge and pesticide runoff to protect water courses.
* Control Salinity: Manage freshwater flows through river basins to prevent high soil salinity that causes Sundari "top-dying" disease.`,

  // Topic 35: Succession of Mangrove Vegetation in Sea Coast
  1090: `Mangrove succession in coastal regions is significantly affected by the gradual elevation of the sea coast due to silt deposition:
* Changing Salinity & Firmness: Silt accumulation elevates the land, reducing tidal flooding frequency. This lowers soil salinity and makes the mudflats firmer.
* Species Replacement: Pioneer light-demanding species like Keora (*Sonneratia apetala*) and Baen (*Avicennia officinalis*) stabilize the mudflats first. As land elevates, they are replaced by intermediate species like Gewa (*Excoecaria agallocha*), and eventually by the climax species Sundari (*Heritiera fomes*).
* Succession Disruption: If land elevation occurs too rapidly or is artificially blocked (e.g., embankments), tidal inundation ceases completely. This dry, saline-depleted environment halts mangrove regeneration, causing them to die and be replaced by land shrubs.`,

  1091: `Mangrove succession is the progressive transition of plant species as sea coasts gradually elevate due to silt deposition:
* Pioneer Stage: Newly accreted soft mudflats are colonized by strongly light-demanding, salt-tolerant pioneer species like Keora (*Sonneratia apetala*) and Baen (*Avicennia officinalis*). These develop aerial roots within 1–2 years to stabilize the soil.
* Consolidation Stage: As the land elevates, tidal inundation frequency reduces. Silt accumulation makes the soil firmer and less saline, allowing intermediate species like Gewa (*Excoecaria agallocha*) and Goran (*Ceriops decandra*) to establish.
* Climax Stage: In fully elevated zones with minimal tidal flooding, the climax vegetation dominated by Sundari (*Heritiera fomes*) takes over.`,

  // Topic 36: Coastal Vegetation of Bangladesh
  1092: `The distribution of coastal vegetation along Bangladesh's shoreline is structured as follows:
* Unstable Coastline: Historically, the 710 km coastline was virtually barren and exposed.
* Artificial Afforestation: Mangrove plantations were artificially established on newly accreted tidal muds starting in 1966.
* Pioneer Dominance: Keora (*Sonneratia apetala*) is the most dominant planted species, representing 94.4% of successful mangrove plantations.
* Regional Preference: Keora grows successfully all along the coastline, whereas Baen (*Avicennia officinalis*) represents 4.8% and is most successful in the eastern coastal belt. Other minor species include Gewa, Goran, and Golpata.
* Embankments: 37 non-mangrove tree and shrub species are planted on the dry slopes of embankments and roadsides.`,

  1093: `The coastal vegetation of Bangladesh consists of man-made and natural species:
* Historic Context: The 710 km coastline was barren. In 1966, the Forest Department initiated a massive afforestation program.
* Major Objectives: Protect coastal dwellers from cyclones and storm surges (primary), stabilize newly accreted land, and generate local livelihoods (secondary).
* Dominant Species: Keora (*Sonneratia apetala*) represents 94.4% of the successful plantations. Baen (*Avicennia officinalis*) represents 4.8%, thriving mostly in the eastern part. Other species include Gewa, Goran, Kankra, and Golpata.
* Non-Mangroves: 37 species are planted on the slopes of coastal embankments and roadsides.`,

  1094: `### Introduction
Bangladesh has a long, dynamic coastline of 710 km along the Bay of Bengal, which is highly vulnerable to tropical cyclones and tidal surges. Historically barren, the coastal belt has been transformed through the world's largest man-made mangrove afforestation program.

### Objectives of Coastal Afforestation
* Primary Objective: Save lives and properties of the coastal population from devastating cyclones.
* Secondary Objectives: 
  * Reclamation and stabilization of newly accreted char lands.
  * Production of timber and fuelwood.
  * Creation of employment opportunities for coastal communities.

### Species Composition and Distribution
* Mangrove Species: Planted on newly accreted lands periodically inundated by tides.
  * *Sonneratia apetala* (Keora): The most successful pioneer species, accounting for 94.4% of the plantations due to its soft-mud preference.
  * *Avicennia officinalis* (Baen): Accounts for 4.8%, showing high success in the eastern coastal belt.
  * Other minor species: Gewa, Goran, Kankra, and Golpata (*Nypa fruticans*).
* Non-Mangrove Species: 37 different species are planted on dry slopes of embankments, roadsides, and raised lands to serve as windbreaks.

### Ecological and Economic Value
Coastal vegetation stabilizes newly accreted soil sediments, speeds up land accretion, acts as a green shield absorbing cyclonic wind energy, and generates direct income through timber and estuarine fisheries.`
};

// Start transforming topics
const finalTopics = [];
let topicCounter = 100; // Start Topic IDs from 100 to avoid conflicts

qData.chapters.forEach(ch => {
  ch.topics.forEach(t => {
    const newTopicId = topicCounter++;
    
    // Process questions inside the topic, skipping the estratégico guide items
    const filteredQuestions = [];
    t.questions.forEach(q => {
      // Skip the strategic suggestions questions (Q1095 - Q1098)
      if (q.id >= 1095 && q.id <= 1098) {
        return;
      }
      
      const answer = solvedAnswers[q.id] || "No answer provided yet.";
      
      filteredQuestions.push({
        id: q.id,
        topicId: newTopicId,
        questionText: q.questionText,
        answerText: answer
      });
    });

    // Skip topics that end up with no questions (in case any existed)
    if (filteredQuestions.length === 0) {
      return;
    }

    finalTopics.push({
      id: newTopicId,
      sectionId: 4,
      name: t.name,
      Questions: filteredQuestions
    });
  });
});

console.log(`Prepared ${finalTopics.length} topics and all associated questions.`);

// Update database.json
const ecology = db.courses.find(c => c.id === 2);
if (ecology) {
  const secB = ecology.Sections.find(s => s.id === 4);
  if (secB) {
    secB.Topics = finalTopics;
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Successfully updated database.json with resolved Section B crop ecology questions!');
  } else {
    console.error('Section B not found in course ID 2!');
  }
} else {
  console.error('Course ID 2 not found in database!');
}
