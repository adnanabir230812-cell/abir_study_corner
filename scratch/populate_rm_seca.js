const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dbPath = path.join(__dirname, '..', 'database.json');
if (!fs.existsSync(dbPath)) {
  console.error('database.json not found!');
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Strict course-content based answers for Research Methodology Section A
const rmSectionATopics = [
  {
    id: 321,
    sectionId: 5,
    name: 'Concept & Characteristics of Research',
    Questions: [
      {
        id: 5001,
        topicId: 321,
        questionText: 'What is research? Enlist the characteristics of a good research. (2025, 2024, 2023, 2019-20, 2019, 2017-18)',
        answerText: `Research is a structured inquiry that utilizes acceptable scientific methodology to solve problems and create new knowledge that is generally applicable. It is a habit of questioning what you do, representing a systematic examination where answers must meet certain requirements to be called research.

The primary objectives of research are to solve specific problems, generate new knowledge, validate existing knowledge, and improve operational agricultural practices by providing empirical evidence to aid in decision-making and policy formulation.

To qualify as research, a process must possess the following six characteristics:
1. In exploring causality in relation to two factors, the researcher sets up the study in a way that minimizes the effects of other external factors to establish control.
2. The investigator must be scrupulous in ensuring that the procedures followed to find answers to questions are relevant, appropriate, and justified.
3. The procedure adopted to undertake the investigation must follow a certain logical sequence or systematic steps.
4. Whatever is concluded on the basis of the findings must be correct and capable of being verified by others to ensure validity and reliability.
5. All conclusions drawn must be empirical, meaning they are based upon hard evidence collected from real-life experiences or observations.
6. The process adopted and the procedures used must be able to withstand critical scrutiny.`
      },
      {
        id: 5002,
        topicId: 321,
        questionText: 'Classify and discuss different types of research on the basis of objectives. (2024, 2023, 2019-20, 2019, 2017-18)',
        answerText: `From the viewpoint of objectives, research is classified into the following four types:

Descriptive research attempts to describe systematically a situation, problem, phenomenon, service or program, or provides information about the conditions of a community. It focuses on describing the current status of the subject rather than explaining the causes. An example is a survey describing the types of agricultural inputs used by smallholder farmers in a specific district.

Correlational research attempts to discover or establish the existence of a relationship or interdependence between two or more aspects of a situation. It examines how variables co-vary without manipulating them. An example is assessing the relationship between the amount of rainfall received and the grain yield of a crop.

Explanatory research attempts to clarify why and how there is a relationship between two or more aspects of a situation or phenomenon. It focuses on explaining the underlying cause-and-effect mechanisms. An example is explaining why excessive nitrogen fertilizer leads to lodging in cereal crops.

Exploratory research is undertaken to explore an area where little is known, or to investigate the possibilities of undertaking a particular research study. It is a flexible, preliminary study to formulate hypotheses. An example is conducting a pilot study to test the viability of growing a new exotic crop in a coastal region.`
      },
      {
        id: 5003,
        topicId: 321,
        questionText: 'Compare and contrast: (i) Fundamental and applied research, (ii) Adaptive and strategic research. (2025, 2023, 2020-21)',
        answerText: `Pure or fundamental research involves developing and testing theories and hypotheses that are intellectually challenging but may or may not have practical application at the present time or in the future. Applied research is done to solve specific, practical questions, assist in policy formulation, or understand an active phenomenon, and is almost always done on the basis of basic research.

Strategic research is designed to address a major, widespread problem but requires developing new scientific understanding or tools, bridging basic and applied research. Adaptive research is aimed at adjusting and testing existing technologies or recommendations under local environmental, soil, and socio-economic conditions to fit farmers' needs.

| Feature | Fundamental Research | Applied Research | Adaptive Research |
| :--- | :--- | :--- | :--- |
| Core Goal | Develop and test theories | Solve specific practical questions | Adjust technologies to local conditions |
| Foundation | Intellectual curiosity | Built on basic research | Built on existing technologies |
| Time Horizon | Long-term | Medium-term | Short-term |
| Scope | Universal | Problem-specific | Highly localized |`
      }
    ]
  },
  {
    id: 322,
    sectionId: 5,
    name: 'Research Problem Selection, Prioritization & Ethics',
    Questions: [
      {
        id: 5004,
        topicId: 322,
        questionText: 'Describe the process of selection and prioritization of a researchable problem. (2025, 2024, 2023, 2020-21)',
        answerText: `Selecting and prioritizing a researchable problem is the first and most crucial step in the research process.

Before finalizing a topic, the researcher must evaluate it against these seven criteria:
* The research endeavor is time-consuming and involves hard work, so the topic must align with the researcher's interest to sustain motivation.
* The researcher must select a topic that can be managed within the time, budget, and resources available.
* The researcher must be clear about the indicators and measurement of the concepts used.
* The investigator must possess an adequate level of expertise for the proposed tasks since they must do the work themselves.
* The topic must be relevant to the profession or possess clear practical value.
* The investigator must ensure that required data are available before finalizing the topic.
* The study must not violate ethical principles or cause harm to participants or the environment.

The formulation and prioritization process involves the following steps:
1. Identify a broad field or subject area of interest to you, such as weed management.
2. Dissect the broad area into sub-areas, such as chemical control, manual weeding, or mechanical weeders.
3. Select the sub-area of most interest to you, such as mechanical weeders.
4. Raise key research questions, such as what is the efficiency and cost-benefit ratio of using a power weeder compared to hand weeding in transplanted rice.
5. Formulate clear main and sub-objectives for the study.
6. Assess the objectives to verify if they are achievable.
7. Double-check to ensure all resources and data sources are available before starting.`
      },
      {
        id: 5005,
        topicId: 322,
        questionText: 'Justify the importance of ethics in research problem selection. (2025)',
        answerText: `Ethics are critical in the selection of a research problem to ensure scientific integrity and protect subjects:
* The selected research problem must not cause physical, psychological, social, or economic harm to human or animal subjects.
* The study must respect the autonomy of participants by obtaining voluntary, informed consent and safeguarding confidentiality.
* Selecting a research problem must involve the intent to produce honest, original work, preventing data fabrication, falsification, and plagiarism.
* The selection of the topic must be free from commercial or political pressure, ensuring objectivity without introducing vested interests.
* The selected research problem should aim to benefit society and preserve the environment, avoiding practices that lead to pollution or resource depletion.`
      },
      {
        id: 5006,
        topicId: 322,
        questionText: 'Explain how the duration of research is important for research management. (2020-21)',
        answerText: `In research management, time is a key constraint:
* The duration of the project determines the magnitude of the research problem, meaning the researcher must select a topic that can be realistically completed within the academic term or funding cycle.
* Time and money are directly correlated, so the duration of the study dictates personnel costs, equipment rentals, and travel budgets, making proper timeline management essential to prevent cost overruns.
* Using tools like Gantt charts allows researchers to structure and sequence their study logically, ensuring that each phase gets adequate attention.
* Agricultural research is heavily dependent on natural cycles, meaning the duration must be managed carefully to avoid missing critical crop planting windows and delaying the study by an entire year.`
      }
    ]
  },
  {
    id: 323,
    sectionId: 5,
    name: 'Steps in Research Process & Literature Review',
    Questions: [
      {
        id: 5007,
        topicId: 323,
        questionText: 'Enlist the steps in research process and explain the \'review of literature\' part of a research process. (2025, 2024, 2023, 2020-21, 2019-20, 2019, 2017-18)',
        answerText: `The research process consists of the following nine sequential steps:
1. Formulating the research problem involves identifying a subject area, raising questions, and defining the problem.
2. Extensive literature review is conducted to acquaint oneself with the existing body of knowledge.
3. Developing the objectives states the main goal and specific sub-objectives.
4. Preparing the research design involves choosing the methodology, treatments, and sampling design.
5. Collecting the data gathers information via surveys, field trials, or lab experiments.
6. Processing and analyzing data involves editing, coding, tabulating, and performing statistical tests.
7. Hypothesis testing uses statistical tests to draw valid conclusions.
8. Generalization and interpretation makes inferences about the target population.
9. Preparation of the report or thesis is the final drafting of the document.

Reviewing the literature is an essential preliminary task integrated throughout the entire research process. It serves the following functions:
* It brings clarity and focus to your research problem by helping you understand the subject area better and conceptualize the problem clearly.
* It improves your methodology by telling you if others have used procedures and methods similar to the ones you are proposing.
* It broadens your knowledge base in your research area, encouraging you to read widely and helping you to become an expert in your study.
* It contextualizes your findings by placing them in the context of what others have found, showing what contribution you have made to the body of knowledge.

The procedure for reviewing the literature involves the following steps:
1. Search library catalogs and online academic databases using relevant keywords to find existing literature.
2. Review the selected literature by reading it critically, organizing findings, and compiling bibliographical details.
3. Develop a theoretical framework by structuring the review around established theories in the subject area.
4. Develop a conceptual framework by mapping the specific variables and relationships that will be tested in the study.`
      }
    ]
  },
  {
    id: 324,
    sectionId: 5,
    name: 'Data Collection & Questionnaire Design',
    Questions: [
      {
        id: 5008,
        topicId: 324,
        questionText: 'What is a questionnaire? Briefly explain different types of questionnaires. (2025, 2024, 2023, 2020-21, 2019-20, 2019, 2017-18)',
        answerText: `A questionnaire is a written list of questions, the answers to which are recorded by respondents. Questionnaires are classified into three types based on the structure of the questions:

Closed-ended or structured questionnaires include all possible answers, and respondents are asked to choose among them. They are easy to fill out, save time for respondents, and allow quick coding, tabulation, and statistical analysis. However, they restrict the depth of responses and do not allow respondents to explain their reasoning.

Open-ended or unstructured questionnaires allow respondents to answer in their own words in blank spaces provided. They capture detailed qualitative information, personal opinions, and attitudes in depth. However, they are difficult to analyze, code, and quantify, and they require a literate population.

Combination or mixed questionnaires contain a mix of closed-ended and open-ended questions. They capitalize on the strengths of both types by capturing quantitative trends while collecting qualitative reasoning through open-ended follow-up questions.`
      },
      {
        id: 5009,
        topicId: 324,
        questionText: 'Illustrate the procedure of preparation of a questionnaire. (2025, 2024, 2023, 2020-21, 2019-20, 2019, 2017-18)',
        answerText: `Preparing a valid and reliable questionnaire requires a systematic procedure:
1. First, decide which questionnaire type to use, such as closed-ended, open-ended, or combination.
2. Second, formulate clear and simple questions using everyday language.
3. Third, ensure that you avoid double-barreled questions that ask two things in one question.
4. Fourth, ensure that you avoid negative, leading, or biased questions.
5. Fifth, keep the questionnaire as short as possible and place open-ended questions at the beginning or end.
6. Sixth, design a clean layout that respondents will enjoy answering.
7. Seventh, pre-test the questionnaire via a pilot study to check for ambiguities and time requirements.

When drafting questions, the researcher should follow these core guidelines:
* Use clear and simple language, avoiding technical jargon and ambiguous terms.
* Avoid double-barreled questions that ask two things in one sentence.
* Avoid leading questions that guide the respondent to a specific answer.
* Avoid double negatives to keep questions positive and direct.
* Keep questions short to minimize respondent fatigue and confusion.`
      },
      {
        id: 5010,
        topicId: 324,
        questionText: 'Differentiate between primary and secondary data. (2019-20, 2019, 2017-18)',
        answerText: `| Feature | Primary Data | Secondary Data |
| :--- | :--- | :--- |
| Definition | Type of data the researcher directly collects from the source for the specific purpose of the study. | Type of data that is already produced by previous researchers, organizations, or agencies. |
| Origin | Original, fresh, and raw. | Second-hand, already processed and interpreted. |
| Time & Cost | Highly expensive and time-consuming. | Cheap, easily accessible, and saves time. |
| Tailored to Study | Perfectly matches the specific objectives and variables of the study. | May not fully align with the specific needs of the current research. |
| Control | Researcher has full control over collection procedures and data quality. | No control over how the original data was gathered or checked. |
| Examples | Field surveys, focus group discussions, direct measurements, interviews. | Census reports, scientific journals, weather records, government statistics. |

Before using secondary data, a researcher must verify its reliability to ensure it comes from a credible organization, its suitability to verify that it covers the exact variables and regions required, and its adequacy to ensure it is complete and up-to-date.`
      }
    ]
  },
  {
    id: 325,
    sectionId: 5,
    name: 'Population, Sample & Sampling Concepts',
    Questions: [
      {
        id: 5011,
        topicId: 325,
        questionText: 'Distinguish between: (i) Population and sample, (ii) Sample and sampling. (2025, 2024, 2023, 2020-21, 2017-18)',
        answerText: `The population is the entire group of individuals or items of interest in a study, whereas a sample is a representative subset of the population selected for investigation.

| Feature | Population | Sample |
| :--- | :--- | :--- |
| Definition | The entire group of individuals or items of interest. | A part of the population selected for investigation. |
| Scope | Includes all members of a group. | Includes only selected members. |
| Measures | Characteristics are called Parameters. | Characteristics are called Statistics. |
| Symbols | Size is denoted by $N$, mean by $\\mu$, and standard deviation by $\\sigma$. | Size is denoted by $n$, mean by $\\bar{X}$, and standard deviation by $s$. |
| Collection | Census or complete enumeration. | Sample Survey investigating a part. |
| Feasibility | Often costly, time-consuming, or impossible. | Cost-effective, quick, and practical. |

The sample is the physical group of units selected from the population, such as fifty specific fields harvested in a village. Sampling is the process or technique utilized in selecting that representative part of the population.`
      },
      {
        id: 5012,
        topicId: 325,
        questionText: 'What does the term sampling imply? (2019-20, 2019)',
        answerText: `The term sampling implies securing information about the universe by examining only a part of the same:
* Sampling assumes that a well-selected sample will mirror the characteristics of the entire population, allowing researchers to generalize their findings.
* It implies that complete enumeration is often impractical due to high costs, time, or limited manpower, and that sampling optimizes resource use.
* In certain destructive tests where measuring a characteristic destroys the item, sampling is the only possible method of investigation.
* It relies on probability theory and the concept of standard error to estimate how close the sample statistic is to the true population parameter.`
      },
      {
        id: 5013,
        topicId: 325,
        questionText: 'How can a sample size be determined? (2020-21, 2019-20, 2017-18)',
        answerText: `Determining the appropriate sample size is a balance between precision, confidence, and resource constraints:

The concept of standard error provides the key in arriving at a good estimate of sample size. The standard error of the mean is calculated as $SE = \\sigma/\\sqrt{n}$ for continuous variables, and $SE = \\sqrt{pq/n}$ for proportions.

For a large population, the best approximation of the sample size is determined by the formula:
\\[n_0 = \\frac{p \\cdot q}{d^2}\\]
Where $p$ is the population proportion, $q = 1 - p$, and $d$ is the error of tolerance.

The sample size determination relies on the following key factors:
* Homogeneous populations require smaller samples, whereas heterogeneous populations require larger samples to ensure representation.
* Smaller margins of error and higher precision requirements necessitate larger sample sizes.
* Standard error of the mean is inversely proportional to the square root of the sample size, meaning that to double the precision, the sample size must be quadrupled.`
      }
    ]
  },
  {
    id: 326,
    sectionId: 5,
    name: 'Sampling Methods & Classification',
    Questions: [
      {
        id: 5014,
        topicId: 326,
        questionText: 'Outline the classification of sampling with examples/clarification. (2025, 2024, 2023, 2019)',
        answerText: `Probability sampling is a method where every member of the population has a known, non-zero chance of being selected, which ensures objectivity and allows for statistical generalization:
* In simple random sampling, each unit has an equal and independent chance of selection, such as drawing numbers from a hat.
* In stratified random sampling, the population is divided into non-overlapping strata and random samples are drawn from each stratum, ensuring all sub-groups are represented.
* In systematic sampling, the population is arranged in an order and units are selected at a constant interval from a random starting point.
* In multi-stage sampling, the selection is done in sequential stages to reduce field costs in geographically dispersed populations.
* In sequential sampling, samples are drawn in a sequence and tested until a decision to accept or reject is made, which is widely used in quality control.

Non-probability or purposive sampling is a method where the selection of samples is based on choice, convenience, or judgment, rather than chance:
* In convenience sampling, the researcher selects the most accessible population members, such as interviewing farmers visiting a local market.
* In judgment or purposive sampling, the researcher uses their expertise to select typical or representative cases.
* In quota sampling, the researcher interviews a prescribed number of people in specific demographic categories.`
      },
      {
        id: 5015,
        topicId: 326,
        questionText: 'Distinguish among random, stratified, systematic, multistage, and cluster sampling / Compare multistage and cluster. (2020-21, 2019-20, 2017-18)',
        answerText: `| Method | Definition | Key Advantage | Key Drawback | When to Use |
| :--- | :--- | :--- | :--- | :--- |
| Simple Random | Every unit has an equal chance of selection. | Unbiased and simple. | Requires a complete list of the population. | Homogeneous populations. |
| Stratified | Population is divided into homogeneous strata; random samples drawn from each. | Highly precise; ensures representation of sub-groups. | Strata must be clearly defined. | Heterogeneous populations. |
| Systematic | Select every $k$-th unit from an ordered list. | Easy to execute in the field. | Prone to bias if the list has periodic patterns. | Ordered populations (e.g., lists, houses). |
| Multi-stage | Selection done in progressive stages. | Highly practical for large, nationwide surveys. | Compounding sampling errors at each stage. | Spatially dispersed populations. |
| Cluster | Population divided into heterogeneous groups; whole clusters selected. | Lowers field cost and travel time. | High sampling error if clusters are too homogeneous. | Geographically grouped units (e.g., blocks). |

Stratified sampling divides the population so that there is homogeneity within each stratum and heterogeneity between strata, and samples are taken from every stratum. Cluster sampling divides the population so that there is heterogeneity within each cluster and homogeneity between clusters, selecting only a few clusters and studying all units in them.

Cluster sampling is a single-stage design where the population is divided into clusters, a random sample of clusters is drawn, and all elements in the selected clusters are studied. Multi-stage sampling is a progressive design where clusters are selected first, and then secondary units are randomly sampled within those clusters rather than studying all elements.`
      }
    ]
  },
  {
    id: 327,
    sectionId: 5,
    name: 'Agricultural Field Sampling & Crop Cutting',
    Questions: [
      {
        id: 5016,
        topicId: 327,
        questionText: 'Which sampling technique is used for crop cutting experiment? How is it implemented? (2025, 2024, 2023)',
        answerText: `For crop cutting experiments (CCE), Stratified Systematic Random Sampling or Multi-stage Random Sampling is used. Stratification is based on administrative or agro-ecological boundaries (e.g., blocks, villages), while systematic random selection is used to choose fields and demarcate plots.

The implementation procedure involves the following steps:
1. Select a sample of villages within a target district using simple random sampling.
2. In each selected village, list all fields growing the target crop and select two to three fields using systematic random sampling.
3. Measure the length and width of the selected field and use a random number table to determine the coordinates for the starting point of the crop cutting plot.
4. From the starting point, lay out a plot of standard size and shape, such as a square of five meters by five meters.
5. Harvest all crop plants falling within the demarcated boundary of the plot.
6. Thresh the harvested crop, separate the grains from the straw, and clean the grains of chaff.
7. Weigh the clean, wet grains immediately to record the green weight.
8. Take a small sample of the grain to determine the moisture content and adjust the final yield to a standard moisture level, such as fourteen percent for rice.`
      }
    ]
  },
  {
    id: 328,
    sectionId: 5,
    name: 'Errors in Research and Experimentation',
    Questions: [
      {
        id: 5017,
        topicId: 328,
        questionText: 'Discuss the different types of errors (including sampling and experimental errors). (2023, 2020-21, 2019-20, 2019, 2017-18)',
        answerText: `Sampling error is the difference between the estimated value from the sample and the true value of the characteristics from a complete count. It can be reduced by increasing the sample size or using efficient probability sampling designs like stratified sampling.

Non-sampling error represents errors that arise in a survey that do not arise from sampling itself. It is caused by faulty questionnaire wording, interviewer bias, non-response, or coding mistakes. It can be minimized through careful questionnaire pre-testing, researcher training, and double-checking entries.

Experimental error is a measure of the variation among experimental plots treated alike, representing the variation not explained by the treatments. It is caused by soil heterogeneity, genetic differences in crop seeds, or minor variations in agronomic practices. It can be reduced by replication, randomization, and local control.

Systematic errors are consistent, repeatable errors due to flaws in design, equipment calibration, or procedures. An example is using a weighing scale that always reads ten grams too high. They can be corrected with regular calibration of lab instruments and refining experimental procedures.

Random errors are unpredictable fluctuations in measurements due to uncontrollable environmental factors. An example is wind gusts affecting a sensitive analytical balance. They can be reduced by taking multiple measurements and averaging the results.

Human errors are outright mistakes made by the experimenter, such as misreading a thermometer by recording thirty-five degrees as fifty-three degrees, or calculation errors. They can be minimized by careful execution, double-checking data records, and following strict protocols.`
      }
    ]
  },
  {
    id: 329,
    sectionId: 5,
    name: 'Scientific Report, Paper & Thesis Writing',
    Questions: [
      {
        id: 5018,
        topicId: 329,
        questionText: 'Explain the term \'Scientific report\'. What should be the characteristics of the \'Objective\' section of a scientific report? (2025, 2024, 2023, 2020-21, 2019-20, 2017-18)',
        answerText: `Scientific reports can vary in length and format, ranging from a form to fill in and submit before leaving the lab, to a formal written report, all usually following a similar basic structure of Title, Introduction, Methods, Results, Discussion, Conclusion, and References.

The objectives describe the goals of the study. A well-written objectives section must have the following characteristics:
* It must be clear, complete, and specific, stating exactly what the study aims to achieve.
* It must be action-oriented, beginning with action verbs such as to evaluate, to determine, to ascertain, to compare, or to measure.
* It must identify the main goals of the study.
* It must identify the variables to be correlated and the expected direction of their relationship if applicable.`
      },
      {
        id: 5019,
        topicId: 329,
        questionText: 'What is a scientific report? What should be the characteristics of the title of a scientific report? (2019)',
        answerText: `A scientific report is a structured document detailing the background, design, execution, results, and discussion of a scientific inquiry.

The title is the first part of the report readers encounter. A good title must have the following characteristics:
* It must be concise and as short as possible, omitting redundant phrases like "a study on" or "an investigation into".
* It must be descriptive, clearly indicating the main subject, independent and dependent variables, and scope of the experiment.
* It must be unambiguous, using precise words and avoiding abbreviations, chemical formulas, or technical jargon.
* It must be informative, accurately reflecting the contents of the report and attracting the interest of target readers.
* An example of a good title is "Effect of Nitrogen Fertilizer Rates on the Yield and Lodging Resistance of IR8 Rice".`
      },
      {
        id: 5020,
        topicId: 329,
        questionText: 'Briefly describe the essential sections of a thesis. (2025, 2024, 2020-21, 2019-20, 2019)',
        answerText: `Preliminary pages of a thesis include the title page with the project title, author name, and date; the certificates and declaration page confirming original work; the acknowledgments page thanking supporters; the abstract summarizing the background, objectives, methods, and results; and the table of contents listing sections, tables, and figures.

Main chapters consist of Chapter I: Introduction providing background, problem statement, and objectives; Chapter II: Review of Literature establishing the theoretical and conceptual framework; Chapter III: Materials and Methods detailing the experimental design, treatments, crop management, and data collection; Chapter IV: Results presenting data neutrally through tables and graphs; Chapter V: Discussion interpreting findings in light of prior literature; and Chapter VI: Summary and Conclusion drawing final conclusions and recommendations.

Supplementary pages include the references or bibliography section listing all cited works in alphabetical order, and the appendices containing raw data sheets, large ANOVA tables, or sample questionnaires.`
      },
      {
        id: 5021,
        topicId: 329,
        questionText: 'Distinguish between a scientific paper and a review paper. (2020-21)',
        answerText: `| Feature | Scientific Paper (Primary Research) | Review Paper (Secondary Research) |
| :--- | :--- | :--- |
| Definition | A paper reporting original, first-hand experimental data collected by the authors. | A paper synthesizing and summarizing existing research published by others. |
| Structure | Follows the strict IMRAD format (Introduction, Methods, Results, and Discussion). | Organized around thematic headings; does not contain Methods or Results sections. |
| Objective | To present new findings, test a specific hypothesis, and add new data to the field. | To survey the current state of knowledge, identify research gaps, and suggest future directions. |
| Data Source | Primary data from lab, field, or survey work. | Secondary data from previously published papers. |
| Reference Count | Moderate (typically 20-40 citations). | Extensive (often 50-100+ citations). |`
      },
      {
        id: 5022,
        topicId: 329,
        questionText: 'Mention the general principles of writing a scientific report or the \'introduction\' section of a thesis/scientific report. (2019-20, 2019, 2017-18)',
        answerText: `The general principles of writing a scientific report include:
* Use simple, direct, and unambiguous language to ensure clarity and precision.
* Maintain a neutral, factual, and unbiased tone to preserve objectivity.
* Keep sentences short and active, omitting unnecessary words for conciseness.
* Ensure smooth transitions between sentences and paragraphs to maintain logical flow.
* Always attribute information to its original source using standardized citations.

The introduction section should follow a funnel structure moving from broad context to specific details:
* It begins with a broad overview of the subject area to establish its context and real-world importance.
* It briefly explains the underlying scientific theories, laws, equations, or theorems.
* It clearly identifies the specific gap in knowledge or problem that the study aims to address.
* It justifies why this study is necessary and who will benefit from its findings.
* It concludes by clearly stating the research questions and specific objectives of the study.`
      }
    ]
  },
  {
    id: 330,
    sectionId: 5,
    name: 'Research Proposals & Fund Hunting',
    Questions: [
      {
        id: 5023,
        topicId: 330,
        questionText: 'Prepare a format of a research proposal for hunting fund from the Research and Innovation Centre of Khulna University. (2025, 2024, 2023)',
        answerText: `A standard research proposal submitted for funding to the Research and Innovation Centre, Khulna University follows this structured format:

1. Project Title: This must be concise, descriptive, and informative, such as "Assessment of the Impact of Urbanization on the Biodiversity of the Sundarbans Ecosystem".
2. Investigator Details: This lists the names, designations, departments, emails, and contact numbers of the Principal Investigator and Co-Investigators.
3. Abstract: A summary of two hundred to three hundred words outlining the background, objectives, methodology, and expected outcomes of the project.
4. Background and Rationale: This contains the background context, problem statement, and the practical or theoretical significance of the study.
5. Objectives: This states the overall main goal along with two to four clear, measurable specific targets beginning with action verbs.
6. Research Questions: This outlines the key questions that the project seeks to answer.
7. Methodology: This details the study design, variables, data collection tools, sampling locations, and statistical analysis plans.
8. Timeline: A tabulated activity schedule by month showing the expected progress of literature review, fieldwork, data processing, and report writing.
9. Budget and Justification: An itemized expense table in Bangladeshi Taka detailing personnel, equipment, travel, software, and miscellaneous costs.
10. Expected Outcomes: This describes the key deliverables such as final reports, digital maps, or policy briefs.
11. Ethical Considerations: This outlines the ethical approvals, informed consent, and mitigation of environmental impact.
12. References: A list of cited literature using standard academic styles like APA.
13. Declaration: Signatures of the investigators certifying the validity of the proposal and proper use of funds.`
      }
    ]
  },
  {
    id: 331,
    sectionId: 5,
    name: 'Inference from Research Results',
    Questions: [
      {
        id: 5024,
        topicId: 331,
        questionText: 'How can you make inference from your research results? (2017-18)',
        answerText: `Making scientific inference involves drawing logical, general conclusions from raw experimental or survey data. It is done through the following steps:

1. Run statistical analyses (e.g., ANOVA, t-tests) to test the null hypothesis.
2. Compare calculated values with tabulated critical values at a specific significance level (usually 5% or 1%) to reject the null hypothesis if calculated values are greater.
3. Extrapolate findings from the representative sample to the wider target population using standard errors and confidence intervals to define precision.
4. Relate the results back to the theoretical and conceptual frameworks to explain the biological, physiological, or socio-economic mechanisms.
5. Compare the findings with existing literature to discuss whether they confirm, contradict, or extend prior studies, combining quantitative data with qualitative observations.
6. Identify the boundary conditions of the inference, such as specific soil types or climatic zones, and state any limitations or potential sources of error in the experiment.`
      }
    ]
  }
];

// Seed the new topics into Course ID 3, Section ID 5 (Research Methodology Section A)
const rmCourse = db.courses.find(c => c.id === 3);
if (rmCourse) {
  const secA = rmCourse.Sections.find(s => s.id === 5);
  if (secA) {
    secA.Topics = rmSectionATopics;
    
    // Save database.json
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Successfully populated database.json with Research Methodology Section A topics and questions!');
    
    // Run seed_db_from_json.js to update database.sqlite
    try {
      console.log('Running SQLite database seed script to sync changes...');
      execSync('node scripts/seed_db_from_json.js', { stdio: 'inherit' });
      console.log('SQLite database successfully synchronized with new data!');
    } catch (err) {
      console.error('Error running SQLite seed script:', err.message);
    }
  } else {
    console.error('Section A (ID 5) not found in Course ID 3!');
  }
} else {
  console.error('Course ID 3 (Research Methodology) not found!');
}
