const { sequelize, Course, Section, Topic, Question } = require('../models');

async function seedExtensionCourse() {
  const transaction = await sequelize.transaction();
  try {
    console.log('Seeding Agricultural Extension (AT-3205) course...');

    // 1. Create Course
    const course = await Course.create({
      name: "Agricultural Extension",
      code: "AT-3205"
    }, { transaction });

    // 2. Create Section
    const section = await Section.create({
      name: "Section A (Fundamentals of Extension, Communication and Leadership)",
      teacherName: "Prof. Dr. Md. Matiul Islam",
      courseId: course.id
    }, { transaction });

    console.log(`Created Course ID: ${course.id}, Section ID: ${section.id}`);

    // 3. Define Topics
    const topicsData = [
      { name: "Philosophies, Principles, Objectives & Definitions" },
      { name: "NARS (National Agricultural Research System)" },
      { name: "DAE Structure, Administration & Agricultural History" },
      { name: "Extension Program Approaches & Systems" },
      { name: "Extension Educational & Teaching-Learning Process" },
      { name: "Extension Methods & Audio-Visual Aids" },
      { name: "Extension Monitoring & Evaluation" },
      { name: "Educational Psychology & Learning Theories" }
    ];

    const topics = [];
    for (const t of topicsData) {
      const topicObj = await Topic.create({
        name: t.name,
        sectionId: section.id
      }, { transaction });
      topics.push(topicObj);
    }
    console.log(`Successfully created ${topics.length} topics.`);

    // 4. Helper to insert questions
    const qCount = 0;

    // --- TOPIC 1 QUESTIONS ---
    const t1Qs = [
      {
        questionText: "Write the complete definition of agricultural extension in Bangladesh perspective.",
        answerText: `## Answer

### Definition of Agricultural Extension (Bangladesh Perspective)

**Agricultural Extension** is a professional, service-oriented educational system that translocates scientifically proven agricultural technologies, skills, and knowledge from research laboratories directly to farm families. 

In the perspective of Bangladesh, it is defined as a non-formal, out-of-school educational service designed to help smallholders, rural youth, and farm families improve their farming techniques, increase crop productivity, ensure national food security, and enhance their overall quality of life through self-reliance and active adoption of modern innovations.`
      },
      {
        questionText: "How would you prove that \"agricultural extension is an out of school education for adults and youth\"?",
        answerText: `## Answer

Agricultural extension education is characterized as a non-formal, practical, and highly flexible out-of-school educational system. We can prove this through the following core arguments:

### 1. Flexible Learning Environment (No Classroom Walls)
Unlike formal school systems, extension does not take place within rigid classroom walls or fixed timing structures. It is conducted in the farmers' natural environment—their fields, homesteads, or village meeting points—making it truly "out-of-school."

### 2. Voluntary and Non-Credit Based
Attendance is completely voluntary. There are no standard exams, grades, degrees, or formal entry requirements. Learners participate solely out of their desire to improve their livelihoods.

### 3. Learner-Centered and Action-Oriented
The curriculum is not fixed by a rigid academic board. Instead, it is highly dynamic and based strictly on the immediate problems and needs of the rural adults and youth (e.g., controlling a sudden pest outbreak or learning a new composting method).

### 4. Focused on Adults and Youth
Extension respects the prior experience of adult learners (Andragogy) and targets rural youth through clubs (such as youth clubs or crop training programs) to build the next generation of skilled farmers.`
      },
      {
        questionText: "What are the general objectives of agricultural extension?",
        answerText: `## Answer

The primary objective of agricultural extension is to raise the socio-economic status of rural families by bringing about desirable changes in their behavior (knowledge, skills, and attitudes).

### General Objectives:

* **1. Technology Dissemination:** To bring scientific agricultural research, modern crop varieties, and improved farming practices directly to farm families.
* **2. Skill Development:** To practicalize learning by training farmers in hands-on skills such as balanced fertilizer application, integrated pest management, and modern seed preservation.
* **3. Promoting Self-Reliance:** To develop the capability of rural people so they can identify, analyze, and solve their own farm problems without permanent external dependence.
* **4. Elevating Living Standards:** To increase crop yields and farm incomes, directly improving rural food security, nutrition, and general living standards.
* **5. Leader Development:** To identify and train local progressive farmers (leaders) who can influence other community members to adopt modern technologies.`
      },
      {
        questionText: "Write down the functions of agricultural extension.",
        answerText: `## Answer

Agricultural extension serves as a vital bridge between agricultural research laboratories and farm families. Its functions can be categorized into four primary dimensions:

### 1. The Educational Function
It brings about desirable changes in the behavior of rural people. This includes:
* **Change in Knowledge:** Introducing new scientific facts (e.g., optimal sowing times).
* **Change in Skills:** Teaching hands-on techniques (e.g., how to graft plants or spray biopesticides).
* **Change in Attitude:** Developing positive inclinations toward scientific practices.

### 2. The Bridging/Linkage Function
It acts as a two-way communication channel:
* Transmitting lab-proven technologies from researchers to farmers (Top-Down).
* Collecting field-level farm problems and feedback and delivering them back to researchers for further study (Bottom-Up).

### 3. The Advisory & Service Function
It provides direct technical advice on fertilizer management, crop protection, and soil health, while facilitating access to vital inputs like quality seeds and fertilizers.

### 4. The Human Resource Development Function
It mobilizes rural communities, organizes cooperative farm groups, and fosters local leadership to promote sustainable rural development.`
      },
      {
        questionText: "\"Change in confidence\" is a function of agricultural extension, state your arguments in favor of this sentence.",
        answerText: `## Answer

"Change in confidence" is indeed one of the most vital socio-psychological functions of agricultural extension. We can justify this through the following core arguments:

### 1. Eradicating Fear of the Unknown
Smallholders in developing countries like Bangladesh are highly risk-averse because their livelihoods depend on a single harvest. They are often fearful of adopting new technologies. By demonstrating positive results directly in their fields (via Result Demonstrations), extension builds trust and gives them the confidence to adopt modern methods.

### 2. Validation of Farmers' Prior Experience
Extension respects the indigenous knowledge of farmers. By combining local wisdom with scientific practices, it makes farmers feel valued, significantly boosting their self-esteem and decision-making confidence.

### 3. Fostering Independent Problem Solvers
As farmers successfully apply new skills (e.g., successfully managing a crop disease using skills learned in a Farmer Field School), their reliance on external agents drops. They develop a firm belief in their own capabilities to manage their farms.

### 4. Positive Attitude Reinforcement
Confidence acts as the catalytic agent that converts passive agricultural knowledge into active field practice. Without a "change in confidence," a farmer will never take the risk of investing in a new high-yielding variety, regardless of how much theoretical knowledge they possess.`
      },
      {
        questionText: "Discuss the \"grassroot principle\" in agricultural extension.",
        answerText: `## Answer

### The Grassroot Principle in Extension

The **Grassroot Principle** states that any agricultural extension program must start where the rural people are—meaning it must be based on their local conditions, local needs, local resources, and existing level of understanding.

### Core Pillars of the Grassroot Principle:

* **1. Starting with Existing Conditions:** Programs must align with the local socio-cultural, economic, and physical realities of the community. For example, prescribing expensive automated machinery to poor smallholders violates this principle.
* **2. Respecting Indigenous Knowledge:** Progressive extension respects and integrates local farming practices (indigenous knowledge) instead of imposing external scientific packages blindly.
* **3. Active Local Participation:** The local community must be actively involved in identifying their own problems and planning solutions. It shifts the approach from "working for the farmers" to "working with the farmers."
* **4. Tailoring to Local Language and Pace:** Communication and training must be conducted in the local dialect and at a pace that matches the educational levels of the target farmers.`
      },
      {
        questionText: "\"Extension is the science of making people innovative for the improvement in their quality of life\" — explain.",
        answerText: `## Answer

This statement captures the true essence of extension as a transformative behavioral science. Here is a detailed breakdown of the concept:

### 1. Cultivating the "Innovative Mindset"
Extension is not merely about distributing physical inputs like seeds and fertilizers. It is a behavioral science that modifies human cognitive and psychomotor domains. By exposing farmers to modern research, result demonstrations, and practical trainings, extension breaks traditional rigid mindsets and cultivates a progressive, "innovative mindset" that actively seeks and adapts to positive changes.

### 2. The Science of Behavior Modification
Extension relies on scientific theories of learning, communication, and social adoption (e.g., Rogers' Diffusion of Innovations). It systematically guides farmers through the cognitive stages of adoption—from basic awareness, interest, evaluation, and trial, to final adoption.

### 3. Ultimate Goal: Improvement in Quality of Life
Innovativeness is not the end goal; it is the means to an end. When farmers become innovative, they:
* Achieve higher crop yields and farm incomes.
* Improve family nutrition and food security.
* Can afford better health and education for their children.

**Conclusion:**
Therefore, extension is a systematic science that uses educational methods to make rural people innovative, thereby driving sustainable socio-economic development and elevating their overall quality of life.`
      },
      {
        questionText: "\"The foundation of any permanent civilization must rest on the partnership of man and land\" — explain this philosophy in the context of agricultural extension in Bangladesh.",
        answerText: `## Answer

This profound philosophical statement, originally formulated by **L.H. Bailey** (often considered the father of cooperative extension), highlights the absolute interdependence between human survival (civilization) and the sustainable stewardship of natural soil resources (land). 

In the context of agricultural extension in Bangladesh, this philosophy has critical implications:

### 1. The Challenge of Land Scarcity and Population Pressure
Bangladesh has a massive population living on a limited, depleting land area. The cultivable land is shrinking annually due to urbanization. To sustain our civilization, we must maximize crop production without destroying the soil.

### 2. Promoting Sustainable and Ecological Agriculture
Extension plays the vital role of ensuring this "partnership" remains healthy by:
* Teaching conservation agriculture and balanced organic-inorganic fertilizer use.
* Promoting Integrated Pest Management (IPM) to reduce chemical toxicity in soil and water.
* Encouraging crop rotation and green manuring to preserve soil health for future generations.

### 3. Transition from Exploitation to Stewardship
Traditional intensive cropping can exhaust soil nutrients quickly. Extension educates farmers that the land is not a resource to be exploited, but a living partner that must be nourished. Sustainable agriculture ensures a "permanent civilization" in Bangladesh.`
      },
      {
        questionText: "What is the philosophy of extension? \"Agricultural extension, research and education are interrelated\" — explain briefly.",
        answerText: `## Answer

### The Philosophy of Extension
The core philosophy of agricultural extension is **"helping people to help themselves."** It respects the dignity of rural individuals, believes in their capability to grow, and focuses on educational methods rather than coercion or direct charity to bring about sustainable socio-economic change.

### The Interrelationship: Agricultural Extension, Research, and Education

These three components form the **Agricultural Knowledge Triangle (or Trilogy)**, which is essential for national agricultural development:

\`\`\`
          [ AGRICULTURAL EDUCATION ]
                 /          \
                /            \
    [ RESEARCH ] ------------ [ EXTENSION ]
\`\`\`

* **1. Agricultural Education:** Produces skilled agricultural scientists, researchers, and extension professionals. It provides the intellectual foundation.
* **2. Research:** Investigates field problems and develops new scientific solutions (e.g., developing salt-tolerant or drought-resistant crop varieties).
* **3. Extension:** Translocates these research solutions directly to farmers. It also brings field-level problems back to researchers.

**Conclusion:**
Without *Education*, there are no researchers or extensionists. Without *Research*, extension has no new technologies to deliver. Without *Extension*, research remains locked inside laboratories. Thus, the three are completely interdependent.`
      },
      {
        questionText: "Explain the philosophies of agricultural extension along with their implication in Bangladesh perspectives.",
        answerText: `## Answer

The philosophies of agricultural extension are the basic values and beliefs that guide extension workers in their professional duties.

### Core Philosophies & Their Implications in Bangladesh:

* **1. Helping People to Help Themselves:** Instead of giving temporary financial aid or direct inputs, extension focuses on training and educating farmers so they can solve their own problems.
  * *Implication:* Helps the resource-poor farmers of Bangladesh escape aid-dependence and become independent managers of their farms.
* **2. The Individual is Supreme:** Extension believes that every rural adult and youth has immense potential and is the most valuable resource of the nation.
  * *Implication:* Promotes rural leadership and self-respect among marginalized smallholders.
* **3. Extension is Two-Way Communication:** Extension is not just a top-down instruction system. It values the feedback, problems, and indigenous knowledge of farmers.
  * *Implication:* Ensures that agricultural research at BRRI/BARI is tailored to the actual field realities of Bangladeshi farmers.
* **4. Extension is Democracy in Action:** Participation is purely voluntary, and farmers are free to make their own choices without administrative force.
  * *Implication:* Respects the democratic rights of farmers, ensuring high trust and sustainable adoption of innovations.`
      },
      {
        questionText: "Prove/explain why agricultural extension education is a non-formal type of education.",
        answerText: `## Answer

We can prove that agricultural extension is a **non-formal type of education** by analyzing its core structural features against the definition of non-formal education:

### 1. Flexible Out-of-School Structure
Unlike formal education, it does not require institutional classrooms, rigid registers, or pre-scheduled timetables. Learning takes place directly in the fields or farmers' homesteads.

### 2. Voluntary Participation
There is no compulsory enrollment, administrative enforcement, or legal age limit. Farmers and rural youth join purely out of interest in improving their yield and livelihood.

### 3. Immediate Practical Utility
Formal education is often long-term and preparatory. In contrast, extension education is highly immediate and problem-centered. A farmer learns a pest control skill today and applies it directly in the field tomorrow.

### 4. No Formal Grading or Degrees
There are no formal exams, marks sheets, or academic degrees awarded. The success of the education is measured solely by the successful field adoption of technology and improvement in yield.`
      },
      {
        questionText: "How can you differentiate non-formal education from formal education?",
        answerText: `## Answer

### Comparison: Formal Education vs. Non-Formal (Extension) Education

| Feature | Formal Education | Non-Formal (Extension) Education |
| :--- | :--- | :--- |
| **Location** | Institutional (Classrooms, Schools). | Non-institutional (Fields, Farms, homesteads). |
| **Curriculum** | Rigid, pre-planned, and highly standardized. | Flexible, dynamic, based strictly on learners' needs. |
| **Learner Type** | Homogeneous groups (homogeneous age, background). | Heterogeneous groups (varying ages, landholdings, literacy). |
| **Attendance** | Compulsory, strictly recorded. | Purely voluntary. |
| **Timeline** | Long-term, fixed duration (years/semesters). | Short-term, continuous, life-long. |
| **Evaluation** | Theoretical exams, grading, and degrees. | Field adoption, yield improvement, self-reliance. |
| **Approach** | Teacher-centered (Top-Down). | Learner-centered (Participatory, Two-Way). |`
      },
      {
        questionText: "Identify and explain the similarities and differences in agricultural extension works between India and Bangladesh.",
        answerText: `## Answer

Both Bangladesh and India share a common agricultural heritage, agro-ecological zones, and similar smallholder challenges. However, their organizational structures differ.

### Similarities:
* **1. Target Audience:** Both systems primarily target resource-poor smallholders and tenant farmers.
* **2. Central Mission:** Both prioritize food security, crop diversification, and climate-smart agricultural adoption.
* **3. Two-Way Communication:** Both systems rely on feedback loops connecting national research institutes with village levels.
* **4. Methods Used:** Both use a mix of individual, group, and mass contact methods (e.g., demonstrations, field days, and digital apps).

### Differences:

| Feature | Bangladesh Extension | Indian Extension |
| :--- | :--- | :--- |
| **Administrative Control** | Highly centralized under the Department of Agricultural Extension (DAE). | Decentralized; agriculture is a State subject, managed by individual State Departments of Agriculture. |
| **Key Local Units** | Upazila Agriculture Office and Union-level SAAO. | Block-level and District-level ATMA (Agricultural Technology Management Agency). |
| **Research Linkage** | Strong central linkage through NARS (managed by BARC). | Linked through ICAR, State Agricultural Universities (SAUs), and a vast network of **Krishi Vigyan Kendras (KVKs)**. |
| **Funding Structure** | Primarily centrally funded with international project support. | Co-funded by Central (ICAR/ATMA) and State governments. |`
      },
      {
        questionText: "List down the areas where agricultural extension has the scope to work. How could we increase the agricultural production?",
        answerText: `## Answer

### 1. Areas of Scope for Agricultural Extension:
* **Crop Production & Management:** Introducing high-yielding, saline-tolerant, and drought-resistant varieties.
* **Natural Resource Conservation:** Teaching water harvesting, soil conservation, and balanced organic farming.
* **Plant Protection:** Promoting Integrated Pest Management (IPM) and biopesticides.
* **Post-Harvest Handling & Marketing:** Reducing storage losses and linking farmers to fair markets.
* **Home Economics & Youth Mobilization:** Training rural women in homestead gardening, poultry rearing, and mobilizing youth clubs.

### 2. How to Increase Agricultural Production:
* **1. Enhancing Cropping Intensity:** Converting single-cropped land into double or triple-cropped land through better irrigation.
* **2. Quality Seed Adoption:** Promoting the use of high-quality certified seeds instead of poor farm-saved seeds.
* **3. Balanced Nutrient Management:** Implementing soil testing and the **USG (Urea Super Granules)** deep placement technology.
* **4. Efficient Water Management:** Advancing alternate wetting and drying (AWD) irrigation methods in Boro rice cultivation.
* **5. Minimizing Post-Harvest Losses:** Training farmers in modern, low-cost mechanical threshing and moisture-proof storage.`
      }
    ];

    for (const q of t1Qs) {
      await Question.create({
        questionText: q.questionText,
        answerText: q.answerText,
        topicId: topics[0].id
      }, { transaction });
    }
    console.log('Seeded Topic 1 Questions.');

    // --- TOPIC 2 QUESTIONS ---
    const t2Qs = [
      {
        questionText: "Describe the NARS concept in Bangladesh, and illustrate it with a neat diagram/layout showing the names of all the research organizations (Write a short essay on NARS in Bangladesh).",
        answerText: `## Answer

### 1. The Concept of NARS in Bangladesh
The **National Agricultural Research System (NARS)** in Bangladesh is a central network of national research institutes coordinated by the **Bangladesh Agricultural Research Council (BARC)**. 

Established to drive national agricultural development, NARS is responsible for conducting agricultural research, developing high-yielding and stress-tolerant crop varieties, designing sustainable soil management systems, and formulating strategic agricultural policies.

### 2. Structural Layout of NARS in Bangladesh

\`\`\`
                     [ BARC ] (Apex Coordinating Body)
                        |
      +-----------------+-----------------+
      |                 |                 |
  [ CROPS ]        [ LIVESTOCK ]     [ FISHERIES ]     [ FORESTRY ]
  * BARI           * BLRI            * FRI             * BFRI
  * BRRI
  * BJRI
  * BINA
  * BSRI
  * BTRI
  * SRDI
\`\`\`

### 3. Core Member Research Organizations:
* **1. BARC (Bangladesh Agricultural Research Council):** The apex body that plans, coordinates, and evaluates agricultural research.
* **2. BARI (Bangladesh Agricultural Research Institute):** The largest multi-disciplinary institute (research on wheat, tubers, pulses, oilseeds, fruits, and vegetables).
* **3. BRRI (Bangladesh Rice Research Institute):** Focused entirely on rice research (developed legendary varieties like BRRI dhan28, BRRI dhan29, and saline-tolerant strains).
* **4. BJRI (Bangladesh Jute Research Institute):** Research on jute and fiber crops.
* **5. BINA (Bangladesh Institute of Nuclear Agriculture):** Uses radiation techniques to breed high-yielding mutant crop varieties.
* **6. BSRI (Bangladesh Sugarcane Research Institute):** Focused on sugarcane and sugar crops.
* **7. BTRI (Bangladesh Tea Research Institute):** Focused on tea production and quality.
* **8. SRDI (Soil Resource Development Institute):** Soil testing, soil classification, and land mapping.
* **9. BLRI (Bangladesh Livestock Research Institute):** Research on livestock, animal health, and dairy.
* **10. FRI (Fisheries Research Institute):** Focused on aquaculture and marine fisheries.
* **11. BFRI (Bangladesh Forest Research Institute):** Research on forestry and agroforestry.`
      }
    ];

    for (const q of t2Qs) {
      await Question.create({
        questionText: q.questionText,
        answerText: q.answerText,
        topicId: topics[1].id
      }, { transaction });
    }
    console.log('Seeded Topic 2 Questions.');

    // --- TOPIC 3 QUESTIONS ---
    const t3Qs = [
      {
        questionText: "Sketch the organizational structure of the DAE along with a detailed organogram of the Field Service Wing (Focus on the information structure and flow diagram).",
        answerText: `## Answer

### 1. Organizational Structure of DAE (Department of Agricultural Extension)

The DAE is the largest public sector extension agency in Bangladesh, operating under the Ministry of Agriculture. It is led centrally by a **Director General (DG)** and structured into **eight specialized wings**, with the **Field Service Wing** being the primary vehicle for technology dissemination.

### 2. General Organogram of DAE and Field Service Wing:

\`\`\`
                    [ DIRECTOR GENERAL (DG) ]
                                |
      +-------------------------+-------------------------+
      | (Other Wings)                                     | (Field Service Wing)
  [ Wings: Training, Planning, ]                   [ DIRECTOR (FSW) ]
  [ Prot., Info., Admin., etc. ]                          |
                                                 [ ADDITIONAL DIRECTOR ]
                                                 (Region Level - 9 Regions)
                                                          |
                                                 [ DEPUTY DIRECTOR (DD) ]
                                                 (District Level - 64 Districts)
                                                          |
                                               [ UPAZILA AGRICULTURE OFFICER ]
                                               (Upazila Level - UAO / AEO)
                                                          |
                                              [ SUB-ASSISTANT AGRI. OFFICER ]
                                              (Union/Block Level - SAAO)
                                                          |
                                                  [ FARM FAMILIES ]
\`\`\`

### 3. Flow of Information in DAE:
* **Top-Down (Dissemination):** Research Findings $\\rightarrow$ DG $\\rightarrow$ Director FSW $\\rightarrow$ Region (AD) $\\rightarrow$ District (DD) $\\rightarrow$ Upazila (UAO/AEO) $\\rightarrow$ Block (SAAO) $\\rightarrow$ Farmers.
* **Bottom-Up (Feedback):** Field Problems $\\rightarrow$ SAAO $\\rightarrow$ UAO/AEO $\\rightarrow$ DD $\\rightarrow$ Director FSW $\\rightarrow$ Research Institutes (BRRI/BARI).`
      },
      {
        questionText: "Discuss the roles, technical and administrative responsibilities of a UAO and an AEO.",
        answerText: `## Answer

Within the Upazila agricultural administrative unit in Bangladesh, the **Upazila Agriculture Officer (UAO)** and the **Agriculture Extension Officer (AEO)** are the key leaders responsible for extension delivery.

### 1. Upazila Agriculture Officer (UAO)
The UAO is the administrative and technical head of the agricultural extension department at the Upazila level.

* **Administrative Responsibilities:**
  * Supervises and evaluates all agricultural extension staff in the Upazila (AEOs, SAAOs).
  * Manages government budgets, office administration, and reports.
  * Coordinates input distribution (fertilizer dealer allocations, seed distribution).
* **Technical Responsibilities:**
  * Plans, executes, and monitors agricultural rehabilitation and emergency crop production programs.
  * Organizes Upazila Agricultural fairs and coordinates input subsidies.

---

### 2. Agriculture Extension Officer (AEO)
The AEO is the primary technical officer, working directly under the UAO.

* **Administrative Responsibilities:**
  * Assists the UAO in preparing monthly progress reports and field dairy updates.
  * Keeps track of input demands and coordinates field training logistics.
* **Technical Responsibilities:**
  * Directly designs and monitors field demonstrations (Result and Method Demonstrations).
  * Evaluates SAAO diary registers and holds regular fortnightly training sessions for SAAOs.
  * Diagnoses crop pest and disease outbreaks in the field and prescribes immediate chemical/biological treatments.`
      },
      {
        questionText: "Which extension agent needs to communicate frequently with the farmers? Mention the technical responsibility of that agent.",
        answerText: `## Answer

### The Frontline Extension Agent: SAAO
The **Sub-Assistant Agriculture Officer (SAAO)** is the frontline, field-level extension agent who communicates most frequently and directly with the farmers in Bangladesh. 

Operating at the Union and Block level, the SAAO is the primary face of the DAE and serves as the immediate technical advisor to rural farm families.

### Technical Responsibilities of the SAAO:

* **1. Field Visits and Problem Identification:** Regularly walks through farm blocks to identify pest attacks, nutrient deficiencies, or irrigation failures and provides immediate solutions.
* **2. Organizing Demonstrations:** Conducts practical method demonstrations (e.g., how to line-sow crops, prepare compost, or deep-place Urea Super Granules) and result demonstrations to convince farmers of new technologies.
* **3. Organizing Farmer Groups:** Facilitates local cooperative farmer groups, IPM clubs, and holds regular courtyard meetings (Uthhan Boithok) to disseminate seasonal crop guidelines.
* **4. Crop Area and Yield Estimation:** Collects ground-level data on crop acreage, soil moisture, and conducts crop-cutting experiments to estimate actual yields.
* **5. Distribution of Extension Materials:** Distributes agricultural leaflets, bulletins, and registers farmers for input cards and agricultural subsidies.`
      },
      {
        questionText: "In 1982, a major breakthrough took place in the history of agricultural extension in Bangladesh. What was that and how did it happen?",
        answerText: `## Answer

### The 1982 Breakthrough: Administrative Reorganization and the T&V System

In **1982**, a major historic milestone took place in Bangladesh with the administrative amalgamation of five separate agricultural extension agencies into a single unified department: the **Department of Agricultural Extension (DAE)**.

### 1. How It Happened:
Prior to 1982, agricultural services were highly fragmented. Five independent directorates operated concurrently, causing overlapping duties, high administrative waste, and massive confusion among farmers:
1. Directorate of Agriculture (Extension and Management)
2. Directorate of Agriculture (Research and Education)
3. Directorate of Jute Extension
4. Directorate of Tobacco Extension
5. Horticulture Development Board

Through the **"Reorganization of Agricultural Extension Services"** reform in 1982, these five bodies were officially merged under a single Director General, creating the unified DAE.

### 2. The Core Driver: Implementation of the T&V System
This structural merger was designed to implement the **Training and Visit (T&V) system** of extension (sponsored by the World Bank). Under this system:
* Frontline extension agents (then called Union Agricultural Assistants - UAAs, now SAAOs) were organized into a strict, disciplined schedule of bi-weekly training and regular farm visits.
* Specialized Subject Matter Officers (SMOs) were introduced to provide continuous technical training to field agents, creating a direct, highly disciplined pipeline from research to the farm.`
      },
      {
        questionText: "Almost 76% of the farmers are operating 30% of the total cultivable land in Bangladesh. How is this statistic influencing the total agricultural system?",
        answerText: `## Answer

This statistic highlights the high land fragmentation, smallholder dominance, and high population-to-land ratio characteristic of Bangladeshi agriculture. It influences the entire agricultural system in several critical ways:

### 1. Limitations on Large-Scale Mechanization
Since 76% of farmers operate very small plots (averaging less than 0.5 hectares), traditional large-scale agricultural machinery like heavy tractors or combine harvesters cannot be operated efficiently or economically. Extension has had to focus on custom-hiring models and **mini-power tillers** or **portable threshers** tailored for small fields.

### 2. High Vulnerability to Economic and Climate Shocks
Smallholders and marginal tenant farmers operate on very narrow profit margins. A single crop failure due to flood, drought, or pest attack can push them into deep debt. This requires extension to prioritize low-risk, highly resilient crops and cheap organic farming techniques.

### 3. Intensive Cropping and Cropping Intensity
Because smallholders must extract their entire livelihood from small plots, they practice highly intensive farming. This has driven Bangladesh's cropping intensity up to **190%–200%** (cropping the same land twice or thrice a year), which rapidly depletes soil nutrients.

### 4. Focus on High-Yield and High-Value Crops
To survive on small holdings, farmers must prioritize high-yield crops like hybrid Boro rice and high-value cash crops like winter vegetables. Extension has had to aggressively promote crop diversification and high-yielding varieties (HYV) to maximize income per square meter.`
      },
      {
        questionText: "\"In Bangladesh cultivable land is decreasing every year, but cropping intensity is increasing gradually.\" How could this happen?",
        answerText: `## Answer

In Bangladesh, cultivable land is shrinking by approximately **0.5% to 1% annually** due to rapid urbanization, industrialization, road construction, and housing. Despite this decrease, national food production has steadily increased because **cropping intensity** (the number of times a crop is grown on the same field in a year) has risen dynamically. 

This agricultural feat has been achieved through several key factors:

### 1. Rapid Development of Irrigation Infrastructure
The widespread installation of shallow tube wells (STWs) and deep tube wells (DTWs) converted vast areas of dry, fallow land into fully irrigable zones, enabling farmers to cultivate a third crop (mostly Boro rice or winter crops) during the dry season.

### 2. Adoption of Short-Duration Crop Varieties
NARS institutes (BRRI/BARI) successfully bred high-yielding, short-duration crop varieties. For example, replacing a traditional long-duration Aman rice with a short-duration variety (like BRRI dhan71) frees up the field early, allowing farmers to insert an intermediate rabi crop (like mustard or potato) before sowing Boro rice, thereby shifting from double to triple cropping.

### 3. Widespread Agricultural Mechanization
The transition from draft animals to mechanical power tillers, tractors, and mechanical seeders has drastically reduced the time needed for land preparation between harvests, allowing rapid turnaround times for the next crop.

### 4. Promotion and Support by DAE Extension
Frontline SAAOs successfully trained farmers in multi-cropping, inter-cropping (growing two or more crops together), and balanced soil nutrient replenishment to maintain soil productivity under intensive cultivation.`
      },
      {
        questionText: "Enlist and illustrate the competencies needed by an extension agent.",
        answerText: `## Answer

An effective extension agent must possess a balanced blend of technical knowledge, communication skills, and leadership qualities to successfully influence farmers.

### Key Competencies Needed:

* **1. Technical Competency:**
  * Deep, practical knowledge of agronomy, soil science, plant protection, and modern crop varieties.
  * *Illustration:* The agent must be able to diagnose a crop disease on sight and prescribe the correct dose of biopesticide or fungicide.
* **2. Communication and Educational Competency:**
  * Ability to translate complex scientific facts into simple, local dialects and use adult learning principles (Andragogy).
  * *Illustration:* The agent must be skilled in demonstrating the AIDCAS model and using audio-visual aids to capture farmers' attention.
* **3. Social and Cultural Competency:**
  * Respecting local customs, traditions, and indigenous knowledge.
  * *Illustration:* The agent must humble themselves, listen to the farmers first, and align extension proposals with local religious and cultural practices.
* **4. Administrative & Planning Competency:**
  * Ability to organize trainings, farm fairs, manage input allocations, and write accurate field reports.
  * *Illustration:* The agent must seamlessly plan a large Upazila agricultural fair coordinating hundreds of farmers and inputs.`
      },
      {
        questionText: "Differentiate the extension role of an agricultural university from the role of a conventional extension organization.",
        answerText: `## Answer

While both agricultural universities and conventional extension organizations (like DAE) work to develop agriculture, their scopes, mandates, and operational areas differ significantly.

### Comparison: Agricultural University vs. Conventional Extension Organization (DAE)

| Feature | Agricultural University Extension | Conventional Extension Organization (DAE) |
| :--- | :--- | :--- |
| **Primary Mandate** | Higher agricultural education and research; extension is a secondary, supportive role. | Dissemination of agricultural technologies; extension is the 100% primary mandate. |
| **Operational Area** | Highly localized (usually restricted to nearby lab-to-land research villages or research farms). | Vast, nationwide coverage (from central headquarters down to every rural union and block). |
| **Extension Type** | **First-line extension** (testing, refining, and demonstrating new technologies developed by the faculty). | **Mass extension** (large-scale dissemination and adoption of approved technologies). |
| **Staffing** | University faculty, professors, and post-graduate researchers. | Vast administrative staff (Director General down to grassroots SAAOs). |
| **Key Output** | New research journals, validated methodologies, and highly trained human resources. | Large-scale technology adoption, national yield increases, and input subsidies. |`
      }
    ];

    for (const q of t3Qs) {
      await Question.create({
        questionText: q.questionText,
        answerText: q.answerText,
        topicId: topics[2].id
      }, { transaction });
    }
    console.log('Seeded Topic 3 Questions.');

    // --- TOPIC 4 QUESTIONS ---
    const t4Qs = [
      {
        questionText: "Enlist and describe the extension program approaches.",
        answerText: `## Answer

An **extension approach** is the organizational philosophy and methodology used to plan, implement, and evaluate extension work.

### Major Extension Program Approaches:

* **1. The General Agricultural Extension Approach:** A highly centralized, top-down public sector approach. Program priorities are decided centrally by the government, and grassroots SAAOs are expected to deliver the messages. It aims to increase national food production.
* **2. The Commodity-Specific Approach:** Focuses exclusively on a single high-value cash crop or commodity (e.g., jute, tobacco, or sugar crops). All extension, input supply, and marketing are managed under a single organization. Highly effective but narrow.
* **3. The Training and Visit (T&V) Approach:** A highly disciplined, scheduled approach sponsored by the World Bank. Grassroots agents undergo continuous fortnightly training by SMOs and make scheduled visits to contact farmers.
* **4. The Participatory Agricultural Extension Approach:** A highly bottom-up, decentralized approach. Farmers actively participate in identifying their own problems, planning, and executing the extension programs (e.g., Farmer Field Schools).
* **5. The Project-Based Approach:** Extension is organized under a specific, time-bound project funded by external international donors. High impact during the project timeline, but often suffers from low sustainability once funding ends.`
      },
      {
        questionText: "Sketch the emerging thoughts in extension work. Decide on the best thought and defend your decision.",
        answerText: `## Answer

### 1. Emerging Thoughts in Extension Work
Modern extension science has shifted from traditional top-down methods toward more dynamic, pluralistic, and digital paradigms. The emerging thoughts include:

* **A. Decentralized and Participatory Extension:** Shifting power from central offices to local farmers (e.g., Farmer Field Schools - FFS).
* **B. Pluralistic Extension:** Combining public extension (DAE), private input companies, and NGOs (like BRAC) to provide services.
* **C. Market-Led Extension:** Focusing not just on crop yield, but on value addition, processing, packaging, and high-profit market linkage.
* **D. Digital / E-Extension:** Utilizing mobile apps, SMS alerts, agricultural call centers, and AI diagnostics.

---

### 2. The Best Thought: Pluralistic & Market-Led Digital Extension
In the contemporary perspective of Bangladesh, a **hybrid combination of Pluralistic, Market-Led, and Digital Extension** is the absolute best approach.

### Defense of the Decision:
* **1. Reaching All Farmers through Digitalization:** Bangladesh has over 15 million farm families. grassroot SAAOs cannot visit everyone physically. Digital extension (E-Extension) bridges this gap instantly, delivering pest alerts and weather updates to millions of mobile screens at minimal cost.
* **2. Market Linkage Prevents Exploitation:** Farmers often lose profits to middle-men. Market-led extension trains them in post-harvest handling and links them directly to online agricultural platforms, ensuring fair pricing and sustainable incomes.
* **3. Pluralism Shares the Administrative Burden:** Public extension (DAE) has limited staff. By partnering with progressive NGOs and private sector seed/fertilizer companies, extension services become more diverse, competitive, and sustainable.`
      },
      {
        questionText: "Enlist the limitations of the Training and Visit (T&V) system of extension as a tool for technology dissemination.",
        answerText: `## Answer

The Training and Visit (T&V) system, introduced widely in developing countries like Bangladesh in the 1970s and 1980s, brought discipline to extension work. However, over time, several critical limitations emerged:

### Limitations of the T&V System:

* **1. High Operational and Administrative Costs:**
  * Maintaining a massive, dedicated hierarchy of field agents, Subject Matter Officers (SMOs), and supervisors required huge, unsustainable government funding.
* **2. Highly Rigid and Inflexible Schedules:**
  * SAAOs were bound by strict fortnightly calendars. This left little room to adapt to sudden, emergency situations like flash floods or localized pest outbreaks.
* **3. Top-Down Communication Bias:**
  * Information flowed primarily from research laboratories down to the farmers. There was very little genuine bottom-up feedback, and resource-poor farmers' local wisdom was often ignored.
* **4. Focus on Contact Farmers:**
  * SAAOs primarily visited designated "contact farmers," expecting the technology to "trickle down" to other farmers naturally. In reality, contact farmers were often wealthy, and the technology did not reach poorer marginal farmers.
* **5. Technology-Driven rather than Market-Driven:**
  * Focused entirely on increasing crop production, completely neglecting post-harvest handling, market prices, and farming profitability.`
      }
    ];

    for (const q of t4Qs) {
      await Question.create({
        questionText: q.questionText,
        answerText: q.answerText,
        topicId: topics[3].id
      }, { transaction });
    }
    console.log('Seeded Topic 4 Questions.');

    // --- TOPIC 5 QUESTIONS ---
    const t5Qs = [
      {
        questionText: "Diagrammatically describe/sketch and explain the phases of the extension educational process.",
        answerText: `## Answer

### The Extension Educational Process (Leagans Model)

The extension educational process is a continuous, cyclic, five-phase model designed by **J. Paul Leagans** to plan and execute successful extension programs.

\`\`\`
                  [ PHASE 1: SITUATION & PROBLEMS ]
                                 |
                                 v
                  [ PHASE 2: OBJECTIVES & GOALS ]
                                 |
                                 v
                  [ PHASE 3: TEACHING PLAN OF WORK ]
                                 |
                                 v
                  [ PHASE 4: EVALUATION OF TEACHING ]
                                 |
                                 v
                  [ PHASE 5: RECONSIDERATION ] (Loops back to Phase 1)
\`\`\`

---

### Detailed Explanation of the Phases:

* **Phase 1: Situation and Problems:**
  * Extension workers gather facts about the local community—their crops, yield, literacy, and resources. They identify local problems (e.g., low yields due to acidic soil).
* **Phase 2: Objectives and Goals:**
  * The community decides what changes they want to achieve (e.g., to increase average rice yields by 20% in the union).
* **Phase 3: Teaching Plan of Work:**
  * Designing the actual educational campaign. Selecting which extension methods to use (e.g., result demonstrations, courtyard meetings, or leaflets) and scheduling who does what.
* **Phase 4: Evaluation of Teaching:**
  * Measuring the actual results against the objectives. Did the farmers learn? Did they adopt the technology? How much did the yield increase?
* **Phase 5: Reconsideration:**
  * Analyzing the evaluation results to identify remaining gaps or new problems. This feeds directly back into Phase 1, starting the next cycle of improvement.`
      },
      {
        questionText: "Explain the steps in extension teaching with a neat diagram (following Wilson and Gallup, 1955).",
        answerText: `## Answer

### The Steps in Extension Teaching (Wilson & Gallup, 1955)

Wilson and Gallup formulated a highly logical, six-step behavioral model representing how an individual accepts and adopts a new technology. This is represented by the legendary **AIDCAS** acronym:

\`\`\`
    [ A ] --> Attention
      |
    [ I ] --> Interest
      |
    [ D ] --> Desire
      |
    [ C ] --> Conviction
      |
    [ A ] --> Action
      |
    [ S ] --> Satisfaction
\`\`\`

---

### Detailed Breakdown of the Steps:

* **1. Attention (A):**
  * Farmers are busy. The first step is to grab their attention about a new technology (e.g., using posters, displays, or mass media alerts).
* **2. Interest (I):**
  * Once attention is captured, the agent must develop their interest by linking the technology to their personal farming needs (e.g., showing them that this new variety yields double the traditional variety).
* **3. Desire (D):**
  * The agent appeals to their emotions and economic goals, converting intellectual interest into a deep personal desire to try the innovation.
* **4. Conviction (C):**
  * Farmers must believe in the technology's effectiveness. The agent provides proof through result demonstrations or farm visits, convincing them that "this will work on my farm too."
* **5. Action (A):**
  * The actual step of trial and adoption. The extension agent ensures that the inputs (seeds, fertilizer) are easily accessible so the farmer can plant the crop.
* **6. Satisfaction (S):**
  * The harvest stage. If the crop yields well and is profitable, the farmer feels immense satisfaction. This satisfaction reinforces their innovative behavior, leading to permanent adoption.`
      },
      {
        questionText: "Briefly describe/explain the elements of a learning situation with an appropriate diagram.",
        answerText: `## Answer

### The Elements of a Learning Situation

A **learning situation** is a structured environment designed by an extension educator where all essential learning elements are beautifully coordinated to facilitate effective behavior change in farmers.

### The Five Interconnected Elements:

\`\`\`
                 [ EXTENSION TEACHER ]
                       /        \\
                      /          \\
            [ LEARNER ] -------- [ SUBJECT MATTER ]
                      \\          /
                       \\        /
                 [ PHYSICAL FACILITIES ]
                            |
                 [ TEACHING MATERIALS ]
\`\`\`

---

### Explanation of the Elements:

* **1. The Learner (Farmer):**
  * The most vital element. Learners must have a need to learn, be actively involved, and have a positive attitude towards the learning event.
* **2. The Extension Teacher (Instructor):**
  * The leader who coordinates the situation. They must possess deep technical knowledge, clear communication skills, and empathy for adult learners.
* **3. The Subject Matter (Content):**
  * The specific technology or skill being taught. It must be highly relevant, practical, and aligned with the farmers' immediate needs.
* **4. Teaching Materials & Aids:**
  * Tools used to make learning clear (e.g., live crop samples, flip charts, projectors, or audio-visual aids).
* **5. Physical Facilities:**
  * The learning environment. It must be physically comfortable, have good lighting, ventilation, and seating, free from distracting village noises.`
      },
      {
        questionText: "Enlist the variables that influence learning in agricultural extension.",
        answerText: `## Answer

Learning in extension is a complex socio-psychological process influenced by several internal and external variables.

### Key Variables Influencing Learning:

* **1. Individual / Learner Variables:**
  * **Age & Experience:** Adult farmers rely heavily on their prior farming experience.
  * **Education & Literacy Level:** Influences how fast they can read leaflets or comprehend complex chemical guidelines.
  * **Motivation & Need:** A farmer suffering from a devastating crop pest will learn much faster than one with a healthy crop.
* **2. Environmental / Situational Variables:**
  * **Physical Comfort:** High heat, humidity, or loud noises during field training reduce learning retention.
  * **Social Influence:** Community peer pressure and progressive leaders adopting technologies encourage others to learn.
* **3. Teacher / Instructor Variables:**
  * **Clarity of Speech & Accent:** Using local dialects significantly enhances learning.
  * **Empathy & Professional Competency:** Teachers who respect farmers' status build trust, accelerating learning.
* **4. Subject Matter Variables:**
  * **Complexity:** Highly complex or expensive technologies are harder to learn and adopt.
  * **Immediate Economic Value:** Technologies showing instant yield increases are learned enthusiastically.`
      },
      {
        questionText: "Why is adult learning special?",
        answerText: `## Answer

Adult learning (Andragogy) is fundamentally different from child learning (Pedagogy) because adults have distinct cognitive, psychological, and social characteristics.

### Why Adult Learning is Special:

* **1. Self-Directed and Autonomous:**
  * Adults are independent. They want to be actively involved in deciding what they need to learn, rather than being passively lectured.
* **2. Rich Foundation of Prior Experience:**
  * Adults possess decades of hands-on farming experience. They evaluate new scientific ideas against their prior field wisdom. Extension must respect this experience.
* **3. Highly Problem-Centered and Practical:**
  * Children learn subjects for future utility. Adults learn to solve immediate, real-life problems. They want practical, "hands-on" skills they can apply tomorrow morning.
* **4. Motivated by Internal Factors:**
  * While children are often motivated by external grades or parental praise, adult farmers are motivated by internal factors like increasing crop profits, ensuring family food security, and improving their social status.
* **5. Higher Need for Mutual Respect:**
  * Adult learners are mature individuals with social standing. Any top-down, patronizing attitude from a young extension officer will lead to instant rejection of learning.`
      },
      {
        questionText: "Discuss the extension teaching methods that are suitable for the adverse pandemic situation.",
        answerText: `## Answer

During adverse pandemic situations (like COVID-19), traditional face-to-face mass gatherings, farm fairs, and large group meetings are highly restricted to prevent disease transmission. Extension must pivot to non-contact, highly targeted methods:

### 1. Digital and E-Extension (Primary Channel)
* **Mobile SMS & Push Notifications:** Instantly sending customized crop alerts, fertilizer doses, and weather warnings to millions of farmers' phones.
* **Agricultural Call Centers (e.g., 3331 or Krishi Call Center):** Enabling farmers to call expert agricultural officers for live, one-on-one audio-visual consultations on plant diseases.
* **Social Media & Video Streaming (YouTube/Facebook):** Creating short, highly localized video tutorials showing method demonstrations (e.g., how to prepare organic compost) that farmers can watch safely at home.

### 2. Mass Media Broadcasts
* **Radio & Television (e.g., Mati O Manush):** Broadcasting weekly programs focused on seasonal crop guidelines and emergency pest control measures.

### 3. Non-Contact Individual Methods
* **Mobile Photo Diagnostics:** Farmers take photos of infected leaves and send them via apps (such as WhatsApp or Krishi Sheba) for instant remote diagnosis by AEOs.
* **Localized Leaflets & Farm Publications:** Placing instructional posters or leaflets at local fertilizer dealer shops where farmers visit individually.`
      },
      {
        questionText: "Differentiate the online-based teaching-learning techniques from conventional extension.",
        answerText: `## Answer

### Comparison: Online-Based (Digital) Extension vs. Conventional Extension

| Feature | Online-Based (Digital) Extension | Conventional Extension |
| :--- | :--- | :--- |
| **Reach & Scalability** | Massive, instant reach to thousands of farmers simultaneously at near-zero incremental cost. | Limited reach; constrained by the physical travel capacity of SAAOs. |
| **Contact Mode** | Non-contact, virtual (SMS, Video, Mobile Apps). | Face-to-face, physical (Field visits, Courtyard meetings). |
| **Feedback Loop** | Instant digital feedback, but can sometimes lack personal detail. | Detailed, highly personal feedback directly in the field. |
| **Dependency** | High dependency on internet connectivity, smartphones, and digital literacy. | Low technology dependency; highly accessible to illiterate and marginal farmers. |
| **Cost Structure** | High initial software setup cost, but extremely low operational cost. | Continuous high operational costs (travel allowances, printed leaflets, physical logistics). |
| **Hands-On Learning** | Best suited for cognitive learning (knowledge). Hard to teach complex manual skills virtually. | Ideal for psychomotor learning (hands-on skills via method demonstrations). |`
      }
    ];

    for (const q of t5Qs) {
      await Question.create({
        questionText: q.questionText,
        answerText: q.answerText,
        topicId: topics[4].id
      }, { transaction });
    }
    console.log('Seeded Topic 5 Questions.');

    // --- TOPIC 6 QUESTIONS ---
    const t6Qs = [
      {
        questionText: "State the advantages and limitations of the mass method as an extension work.",
        answerText: `## Answer

### The Mass Contact Method
**Mass contact methods** are extension channels designed to communicate with large, diverse, and geographically dispersed populations simultaneously (e.g., radio, television, newspapers, posters, and digital SMS).

### Advantages of Mass Methods:
* **1. Massive Reach and Speed:** Can deliver critical agricultural alerts (like a sudden locust invasion warning) to millions of farmers within minutes.
* **2. Extremely Low Cost per Head:** Since it uses digital or broadcast networks, the cost of communication per farmer is virtually negligible.
* **3. Overcoming Physical Barriers:** Reaches remote, char-land, or mountainous agricultural zones where SAAOs cannot physically travel.
* **4. High Visual/Audio Appeal:** Using television or short video clips captures the attention of illiterate farmers who cannot read text.

### Limitations of Mass Methods:
* **1. No Individualized/Personal Contact:** Cannot address the unique, specific field problems of a single farmer.
* **2. One-Way Communication:** Highly top-down. There is very little direct, immediate feedback from bottom to top.
* **3. Hard to Teach Hands-On Skills:** While it is great for creating awareness, it cannot teach complex manual skills (like grafting or building a compost bin) which require hands-on practice.
* **4. Technology Dependency:** Requires electricity, mobile network coverage, or television ownership, which may be lacking in marginalized villages.`
      },
      {
        questionText: "List and explain the digital approaches used to provide extension services.",
        answerText: `## Answer

Modern agricultural extension in Bangladesh has integrated several cutting-edge digital approaches to overcome physical staff shortages and deliver instant services.

### Key Digital Approaches:

* **1. E-Krishi / Mobile Applications:**
  * Specialized Android apps (such as "Krishoker Janala" or "Krishi Batighar") provide farmers with interactive pictorial diagnostic guides to identify pests and diseases on sight.
* **2. Interactive Agricultural Call Centers:**
  * National hotlines (e.g., **16123** - Krishi Call Center) enable farmers to talk to expert crop, livestock, and fishery officers for free live advice.
* **3. SMS and Push Notification Systems:**
  * Mobile operators partner with DAE to push localized weather alerts, sowing dates, and fertilizer recommendations directly to farmers' mobile screens.
* **4. Social Media & Video Tutorials:**
  * Progressive SAAOs and agricultural universities host short, localized video demonstrations on YouTube and Facebook showing step-by-step farming skills.
* **5. Digital Smart Cards and Input Subsidies:**
  * Digital databases (like the Agriculture Input Assistance Card) ensure subsidies reach eligible farmers' mobile banking wallets directly without middleman leakage.`
      },
      {
        questionText: "Define and classify ETM (Extension Teaching Methods) with appropriate examples (and provide 5 examples from each category).",
        answerText: `## Answer

### 1. Definition of Extension Teaching Methods (ETM)
**Extension Teaching Methods** are the device-oriented educational channels and communication tools utilized by extension workers to create learning situations, capture farmers' attention, and facilitate the successful adoption of agricultural innovations.

### 2. Classification of ETMs (With 5 Examples Each)

Extension teaching methods are classified into three primary categories based on the **number and nature of the target audience reached**:

---

### A. Individual Contact Methods
Used to communicate one-on-one with a single farmer, highly effective for personal advice and building strong trust.

* **1. Farm and Home Visits:** SAAO physically visits a farmer's crop field to diagnose a disease on site.
* **2. Office Calls:** Farmer visits the Upazila Agriculture Office to consult the AEO.
* **3. Personal Letters:** Written advisory letters sent directly to a farmer.
* **4. Telephone / Audio-Visual Consultations:** Calling an expert at the Krishi Call Center.
* **5. Result Demonstration:** Setting up a trial on a single farmer's plot to prove a variety's yield.

---

### B. Group Contact Methods
Used to communicate with small, organized groups of farmers (usually 10 to 30 people). It relies on group discussion and social learning.

* **1. Courtyard Meetings (Uthhan Boithok):** SAAO holds an informal meeting with a neighborhood in a house courtyard.
* **2. Method Demonstration:** Hands-on training showing a group how to prepare compost.
* **3. Field Days / Demonstration Meetings:** Organizing a gathering of farmers to view the final high yield of a result demonstration plot.
* **4. Group Discussions & Seminars:** Brainstorming local irrigation plans with village elders.
* **5. Study Tours:** Taking a group of farmers to visit a progressive agricultural research farm at BARI.

---

### C. Mass Contact Methods
Used to communicate with vast, diverse, and geographically scattered populations simultaneously.

* **1. Radio Broadcasts:** Playing agricultural guide shows over national and community radio.
* **2. Television Programs:** Broadcasting farming shows like "Mati O Manush".
* **3. Agricultural Fairs (Krishi Mela):** Large public exhibitions showcasing crops and machinery.
* **4. Printed Materials:** Distributing agricultural leaflets, bulletins, and posters at local markets.
* **5. Digital Push Alerts (SMS):** Sending bulk mobile SMS warnings about natural disasters or crop pests.`
      },
      {
        questionText: "Elaborately classify the audio-visual aids with examples.",
        answerText: `## Answer

**Audio-Visual Aids** are instructional tools that appeal to the senses of hearing (audio) and sight (visual) to make extension teaching clear, engaging, and highly memorable for farmers.

### Detailed Classification of Audio-Visual Aids:

---

### 1. Visual Aids (Appeal strictly to the sense of Sight)
These are further sub-classified into:

* **A. Non-Projected Visual Aids:**
  * **Real Objects / Specimens:** Showing an actual diseased leaf or insect inside a transparent jar.
  * **Models:** Plastic 3D models of modern irrigation systems.
  * **Chalkboards & Whiteboards:** Used to draw diagrams during indoor classroom trainings.
  * **Printed Graphics:** Posters, charts, flip books, leaflets, and bulletins.
* **B. Projected Visual Aids:**
  * **Silent Filmstrips & Slides:** Projected static images showing crop varieties.

---

### 2. Audio Aids (Appeal strictly to the sense of Hearing)
Used to deliver verbal instruction over wide distances.

* **Radio Broadcasts:** Live or recorded agricultural news and weather warnings.
* **Audio Tapes & Podcasts:** Pre-recorded agricultural guides played over speakers.
* **Megaphones & Public Address Systems:** Used to grab attention during loud village gatherings.

---

### 3. Audio-Visual Aids (Appeal to BOTH Sight and Hearing simultaneously)
The most powerful instructional aids with the highest learning retention rates.

* **Motion Picture Films / Documentaries:** Educational films showing the complete disease lifecycle of rice blast.
* **Television Programs:** Interactive broadcasts showcasing farming successes.
* **Multimedia Projector Presentations:** Powerpoint slides combined with background audio and video clips.
* **Video Streaming (YouTube/TikTok clips):** Short instructional farming videos viewed on mobile phones.`
      }
    ];

    for (const q of t6Qs) {
      await Question.create({
        questionText: q.questionText,
        answerText: q.answerText,
        topicId: topics[5].id
      }, { transaction });
    }
    console.log('Seeded Topic 6 Questions.');

    // --- TOPIC 7 QUESTIONS ---
    const t7Qs = [
      {
        questionText: "\"Monitoring and evaluation are two sides of a coin.\" Explain this concept in the context of extension work.",
        answerText: `## Answer

### "Monitoring and Evaluation are Two Sides of a Coin"

This classic extension axiom highlights that **Monitoring (M)** and **Evaluation (E)** are two completely inseparable, complementary halves of a unified program management system. Though their methods and timings differ, one is incomplete without the other.

---

### 1. Monitoring: The "Ongoing" Side
Monitoring is the continuous, routine, and systematic collection of data during a project's implementation phase.
* **Focus:** It tracks inputs (budgets, staff, materials) and outputs (number of trainings conducted, quantity of seeds distributed) in real-time.
* **Questions asked:** "Are we on schedule?", "Is the budget being utilized correctly?"
* **Action:** It acts as an early warning system, allowing managers to make quick, ongoing adjustments to prevent project failure.

### 2. Evaluation: The "Ultimate" Side
Evaluation is the periodic, highly analytical assessment of a project's overall progress and final outcomes, conducted at key intervals (mid-term or end of project).
* **Focus:** It measures actual impact, behavioral adoption rates, and economic changes (yield increases, net profit changes).
* **Questions asked:** "Did we achieve our core goals?", "Did the farmers' lives improve?"
* **Action:** It determines the strategic success, sustainability, and replicability of the program.

---

### 3. Why they are "Two Sides of a Coin":
* **They share the same goal:** Both seek to improve program quality and guide decision-making.
* **Evaluation depends on Monitoring data:** Without continuous monitoring logs (input/output data), an evaluator cannot analyze *why* a project succeeded or failed.
* **Monitoring is guided by Evaluation criteria:** The indicators monitored daily are derived from the ultimate impact indicators set during the evaluation planning.

**Conclusion:**
Therefore, monitoring without evaluation is simply paper-pushing without knowing the final impact. Evaluation without monitoring is a post-mortem done in the dark. Together, they form a complete coin of successful project management.`
      },
      {
        questionText: "What are understood by \"monitoring\" and \"evaluation\"? Enlist the types of evaluation.",
        answerText: `## Answer

### 1. Definitions of Monitoring and Evaluation

* **Monitoring:**
  * The continuous, day-to-day, and systematic observation and collection of input-output data during a project's execution. It ensures that activities are proceeding according to the plan of work, on time, and within budget.
* **Evaluation:**
  * A highly analytical, periodic assessment that determines the efficiency, impact, effectiveness, and sustainability of a project. It measures the final outcome and behavioral changes (e.g., yield increases, technology adoption rates) against the project's original objectives.

---

### 2. Classification of Evaluation Types in Extension

Evaluation is classified into several types based on **timing, evaluator type, and scope**:

### A. Based on Timing (Implementation Stage):
* **1. Ex-ante Evaluation (Formative/Pre-project):** Conducted *before* the project starts to assess feasibility and gather baseline data.
* **2. Ongoing/Concurrent Evaluation (Mid-term):** Conducted *during* project execution to assess immediate progress and recommend corrective actions.
* **3. Ex-post Evaluation (Summative/End-project):** Conducted *after* the project ends to measure final impact, sustainability, and key lessons learned.

### B. Based on Evaluator:
* **1. Internal Self-Evaluation:** Conducted by the project staff themselves. Fast and cheap, but can suffer from subjective bias.
* **2. External Independent Evaluation:** Conducted by an outside agency or independent consultant. Highly objective and professional, but expensive.

### C. Based on Scope/Nature:
* **1. Informal Evaluation:** Based on everyday observations, discussions, and casual feedback.
* **2. Formal Evaluation:** Based on scientific research methodologies, structured surveys, statistical analysis, and rigorous report writing.`
      }
    ];

    for (const q of t7Qs) {
      await Question.create({
        questionText: q.questionText,
        answerText: q.answerText,
        topicId: topics[6].id
      }, { transaction });
    }
    console.log('Seeded Topic 7 Questions.');

    // --- TOPIC 8 QUESTIONS ---
    const t8Qs = [
      {
        questionText: "Compare among Pedagogy, Andragogy, Heutagogy, and Cyborgogy.",
        answerText: `## Answer

### Educational Models: Pedagogy, Andragogy, Heutagogy, and Cyborgogy

These four terms represent the evolutionary progression of teaching and learning paradigms, shifting from teacher-directed models to highly autonomous and digital co-learning structures.

### Comparison: Pedagogy, Andragogy, Heutagogy, and Cyborgogy

| Feature | Pedagogy | Andragogy | Heutagogy | Cyborgogy |
| :--- | :--- | :--- | :--- | :--- |
| **Locus of Control** | **Teacher-directed** (Teacher decides what, how, and when). | **Self-directed** (Learner directs the learning process). | **Self-determined** (Learner designs and determines their own path). | **Technology-mediated** (Co-learning with digital agents & AI). |
| **Target Audience** | Children (Dependent learners). | Adults (Independent, self-directed adults). | Lifelong learners (highly autonomous, interdependent). | Modern connected learners (humans integrated with digital systems). |
| **Learner's Prior Experience** | Low; teacher is the primary source of knowledge. | High; prior experience forms the foundation for new learning. | Extremely high; experience is analyzed critically to create new capabilities. | Digital; prior data and online connectivity shape personal learning networks. |
| **Learning Goal** | Subject-centered (passing exams, acquiring basic facts). | Problem-centered (solving immediate, real-life challenges). | Capability-centered (developing double-loop learning and self-growth). | Integration-centered (co-creating knowledge with technology). |
| **Application in Extension** | Limited; used only during elementary youth clubs or basic facts lectures. | The **primary model** for adult farmers (respecting their wisdom and focusing on farm issues). | Advanced; farmers designing their own trial experiments on-farm. | Modern e-extension; farmers co-learning with AI crop diagnosis apps and online forums. |`
      },
      {
        questionText: "Describe the Bloom's taxonomy of learning assessment for the cognitive domain.",
        answerText: `## Answer

### Bloom's Taxonomy: The Cognitive Domain

Formulated by **Benjamin Bloom** (and later revised by Anderson and Krathwohl), Bloom's Taxonomy classifies educational learning objectives into levels of complexity and specificity. The **Cognitive Domain** focuses on intellectual skills, knowledge acquisition, and critical thinking.

### The Six Hierarchical Levels (From Lowest to Highest Complexity):

\`\`\`
       [ 6. CREATE ] (Highest Complexity)
            ^
       [ 5. EVALUATE ]
            ^
       [ 4. ANALYZE ]
            ^
       [ 3. APPLY ]
            ^
       [ 2. UNDERSTAND ]
            ^
       [ 1. REMEMBER ] (Lowest Complexity)
\`\`\`

---

### Detailed Explanation of the Levels:

* **1. Remember (Knowledge):**
  * Recalling basic facts, terms, or concepts from memory without deep understanding.
  * *Extension Example:* A farmer memorizes the scientific name of rice blast pathogen (*Magnaporthe oryzae*).
* **2. Understand (Comprehension):**
  * Explaining ideas, facts, or concepts in one's own words.
  * *Extension Example:* A farmer explains *why* excessive nitrogen fertilizer predisposes rice crops to blast disease.
* **3. Apply (Application):**
  * Using learned information in concrete, new, and real-life field situations.
  * *Extension Example:* A farmer calculates and applies the exact recommended dose of urea and potash on their specific plot.
* **4. Analyze (Analysis):**
  * Breaking down complex information into its component parts to understand their relationships.
  * *Extension Example:* A farmer compares the symptoms of brown spot and blast on a rice leaf to diagnose the exact problem.
* **5. Evaluate (Evaluation):**
  * Making judgments, decisions, or defending a choice based on strict criteria and standards.
  * *Extension Example:* A farmer evaluates the advantages and limitations of chemical fungicides versus biological Trichoderma and decides on the best IPM strategy.
* **6. Create (Synthesis):**
  * Combining diverse elements together to form a completely new, original structure or design.
  * *Extension Example:* A progressive farmer designs a custom, low-cost organic liquid fertilizer formula using local weeds and compost.`
      },
      {
        questionText: "Draw and explain A. Maslow's open-ended need pyramid with examples from each need type. Why this pyramid is open-ended? What are the main outcomes and implications of this theory for the motivation of farmers?",
        answerText: `## Answer

### Abraham Maslow's Hierarchy of Human Needs

Abraham Maslow proposed that human motivation is driven by a hierarchy of five basic needs. A person satisfies lower-level needs before progressing to higher-level growth needs.

### 1. The Pyramid Structure and Agricultural Examples:

\`\`\`
                  [ 5. SELF-ACTUALIZATION ] (Growth Need)
                             |
                      [ 4. ESTEEM NEEDS ]
                             |
                     [ 3. SOCIAL NEEDS ]
                             |
                     [ 2. SAFETY NEEDS ]
                             |
                  [ 1. PHYSIOLOGICAL NEEDS ] (Basic Deficit Needs)
\`\`\`

* **1. Physiological Needs (Basic survival):** Food, water, shelter.
  * *Farming Example:* Having enough rice harvest to feed the family throughout the winter.
* **2. Safety and Security Needs:** Physical safety, financial security, health.
  * *Farming Example:* Secure land tenure (not being evicted by landlords) and crop insurance against droughts.
* **3. Social Needs (Belongingness):** Friendship, love, community acceptance.
  * *Farming Example:* Being a valued member of the local IPM club or cooperative farming group.
* **4. Esteem Needs (Respect and Status):** Self-respect, social recognition, prestige.
  * *Farming Example:* Winning the "Best Farmer Award" at the Upazila Agriculture Fair.
* **5. Self-Actualization (Personal Growth):** Achieving one's full potential.
  * *Farming Example:* A highly skilled progressive farmer who enjoys designing original cropping systems and teaching others for the love of agriculture.

---

### 2. Why is this Pyramid "Open-Ended"?
Lower-level needs (1 to 4) are **Deficit Needs (D-Needs)**. Once they are satisfied, the motivation to pursue them drops. 
However, **Self-Actualization** is a **Growth Need (B-Need)**. It is considered **open-ended** because it represents a continuous, life-long process of self-improvement and potential realization. It can never be fully saturated or completed. The more a person self-actualizes, the more motivated they become to continue growing.

---

### 3. Implications for the Motivation of Farmers:
* **Lower-Level Needs Must Be Met First:** A poor, starving tenant farmer facing land eviction (Physiological/Safety deficit) will never be motivated by lectures on ecological preservation or "self-actualization." Extension must first address their basic seed security and land tenure.
* **Social Motivation is Powerful:** Organizing farmers into cohesive cooperative groups satisfies their social needs, which drastically accelerates the learning and adoption of modern technologies.
* **Pride and Recognition Drive Adoption:** Recognizing progressive farmers publicly (satisfying Esteem needs) motivies them to continue adopting cutting-edge technologies, creating positive role models for the entire village.`
      },
      {
        questionText: "Which learning theories are the best for agricultural extension and why?",
        answerText: `## Answer

While multiple learning theories exist, the three most powerful and applicable learning theories in agricultural extension are **Social Cognitive Theory**, **Experiential Learning Theory**, and **Operant Conditioning**.

### 1. Social Cognitive Theory (Albert Bandura)
* **Core Concept:** People learn by observing the behaviors, actions, and consequences of others (modeling).
* **Why it's the best for Extension:** 
  * Farmers are highly peer-influenced. They rarely adopt a technology based on theoretical lectures. They want to see it work in a neighbor's field.
  * **Result Demonstrations** and **Field Days** are Bandura's modeling in action. When local farmers see a progressive neighbor achieve double yield with a new variety, they model the behavior and adopt the crop.

### 2. Experiential Learning Theory (David Kolb)
* **Core Concept:** Learning is the process whereby knowledge is created through the transformation of experience ("Learning by Doing").
* **Why it's the best for Extension:**
  * Adult farmers learn best through concrete experiences and hands-on practice.
  * **Method Demonstrations** (e.g., physically mixing composting ingredients during training) and **Farmer Field Schools (FFS)** are based on this theory. Experience leads to deep psychomotor skill adoption.

### 3. Operant Conditioning (B.F. Skinner)
* **Core Concept:** Behavior is shaped and reinforced by its consequences (positive reinforcement).
* **Why it's the best for Extension:**
  * If a farmer tries a new variety and achieves a highly profitable harvest (positive reinforcement), their innovative behavior is reinforced, leading to permanent adoption.
  * Extension uses incentives like **subsidies**, **Best Farmer Awards**, and **certificates** as positive reinforcers to encourage learning.`
      }
    ];

    for (const q of t8Qs) {
      await Question.create({
        questionText: q.questionText,
        answerText: q.answerText,
        topicId: topics[7].id
      }, { transaction });
    }
    console.log('Seeded Topic 8 Questions.');

    // Commit transaction
    await transaction.commit();
    console.log('\n===============================================');
    console.log('SUCCESS: Agricultural Extension (AT-3205) seeded!');
    console.log('===============================================');
    process.exit(0);
  } catch (error) {
    await transaction.rollback();
    console.error('Error seeding Extension course:', error);
    process.exit(1);
  }
}

seedExtensionCourse();
