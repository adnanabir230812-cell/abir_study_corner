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
        answerText: `* Research is a structured inquiry that utilizes acceptable scientific methodology to solve problems, generate new knowledge, or validate existing knowledge.
* It represents a systematic examination and a habit of questioning what you do where answers must meet certain requirements.
* The primary objectives of research are to solve specific problems and generate new knowledge.
* It aims to validate existing knowledge and improve operational agricultural practices.
* It provides empirical evidence to aid in decision-making and policy formulation.
* To establish control in exploring causality, the researcher sets up the study in a way that minimizes the effects of other external factors.
* The investigator must be scrupulous in ensuring that the procedures followed to find answers to questions are relevant, appropriate, and justified.
* The procedure adopted to undertake the investigation must follow a certain logical sequence or systematic steps.
* Whatever is concluded on the basis of the findings must be correct and capable of being verified by others to ensure validity and reliability.
* All conclusions drawn must be empirical, meaning they are based upon hard evidence collected from real-life experiences or observations.
* The process adopted and the procedures used must be able to withstand critical scrutiny.`
      },
      {
        id: 5002,
        topicId: 321,
        questionText: 'Classify and discuss different types of research on the basis of objectives. (2024, 2023, 2019-20, 2019, 2017-18)',
        answerText: `* From the viewpoint of objectives, research is classified into descriptive, correlational, explanatory, and exploratory types.
* Descriptive research attempts to systematically describe a situation, problem, phenomenon, service or program, or provide information about the conditions of a community.
* It focuses on describing the current status of the subject rather than explaining the causes.
* An example of descriptive research is a survey describing the types of agricultural inputs used by smallholder farmers in a specific district.
* Correlational research attempts to discover or establish the existence of a relationship or interdependence between two or more aspects of a situation.
* It examines how variables co-vary without manipulating them.
* An example of correlational research is assessing the relationship between the amount of rainfall received and the grain yield of a crop.
* Explanatory research attempts to clarify why and how there is a relationship between two or more aspects of a situation or phenomenon.
* It focuses on explaining the underlying cause-and-effect mechanisms.
* An example of explanatory research is explaining why excessive nitrogen fertilizer leads to lodging in cereal crops.
* Exploratory research is undertaken to explore an area where little is known, or to investigate the possibilities of undertaking a particular research study.
* It is a flexible, preliminary study to formulate hypotheses.
* An example of exploratory research is conducting a pilot study to test the viability of growing a new exotic crop in a coastal region.`
      },
      {
        id: 5003,
        topicId: 321,
        questionText: 'Compare and contrast: (i) Fundamental and applied research, (ii) Adaptive and strategic research. (2025, 2023, 2020-21)',
        answerText: `* Pure or fundamental research involves developing and testing theories and hypotheses that are intellectually challenging but may or may not have immediate practical application.
* Applied research is done to solve specific practical questions, assist in policy formulation, or understand an active phenomenon, and is almost always done on the basis of basic research.
* Strategic research is designed to address a major, widespread problem but requires developing new scientific understanding or tools, bridging basic and applied research.
* Adaptive research is aimed at adjusting and testing existing technologies or recommendations under local environmental, soil, and socio-economic conditions to fit farmers' needs.
* Fundamental research has a long-term time horizon and universal scope, while applied research has a medium-term horizon and problem-specific scope.
* Adaptive research has a short-term time horizon and is highly localized in scope to adjust technologies to local conditions.`
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
        answerText: `* Selecting and prioritizing a researchable problem is the first and most crucial step in the research process.
* The researcher must evaluate the topic to ensure it aligns with their interest to sustain motivation through the long and time-consuming process.
* The selected topic must be manageable within the time, budget, and resources available.
* The researcher must be clear about the indicators and measurement of the concepts used.
* The investigator must possess an adequate level of expertise for the proposed tasks since they must do the work themselves.
* The topic must be relevant to the profession or possess clear practical value.
* The investigator must ensure that required data are available before finalizing the topic.
* The study must not violate ethical principles or cause harm to participants or the environment.
* The first step in formulation is to identify a broad field or subject area of interest, such as weed management.
* The second step is to dissect the broad area into sub-areas, such as chemical control, manual weeding, or mechanical weeders.
* The third step is to select the sub-area of most interest, such as mechanical weeders.
* The fourth step is to raise key research questions, such as what is the efficiency and cost-benefit ratio of using a power weeder compared to hand weeding in transplanted rice.
* The fifth step is to formulate clear main and sub-objectives for the study.
* The sixth step is to assess the objectives to verify if they are achievable.
* The seventh step is to double-check to ensure all resources and data sources are available before starting.`
      },
      {
        id: 5005,
        topicId: 322,
        questionText: 'Justify the importance of ethics in research problem selection. (2025)',
        answerText: `* Ethics are critical in the selection of a research problem to ensure scientific integrity and protect subjects.
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
        answerText: `* In research management, time is a key constraint because the duration of the project determines the magnitude of the research problem.
* The researcher must select a topic that can be realistically completed within the academic term or funding cycle.
* Time and money are directly correlated, so the duration of the study dictates personnel costs, equipment rentals, and travel budgets, making proper timeline management essential to prevent cost overruns.
* Using tools like Gantt charts allows researchers to structure and sequence their study logically to ensure that each phase gets adequate attention.
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
        answerText: `* The research process consists of nine sequential steps starting with formulating the research problem and conducting an extensive literature review.
* The subsequent steps include developing the objectives, preparing the research design, collecting data, processing and analyzing data, and testing hypotheses.
* The final steps of the research process are generalization and interpretation, followed by the preparation of the report or thesis.
* Reviewing the literature is an essential preliminary task integrated throughout the entire research process to bring clarity and focus to the research problem.
* It improves the methodology by showing what procedures and methods others have used for similar investigations.
* It broadens the investigator's knowledge base in the research area, helping them become an expert in the study.
* It contextualizes the findings by placing them in the context of what others have found, showing the contribution to the existing body of knowledge.
* The procedure for reviewing the literature begins with searching library and database records using relevant keywords.
* The second step is to review the selected literature by critically reading and compiling bibliographical details.
* The third step is to develop a theoretical framework structured around established theories in the subject area.
* The fourth step is to develop a conceptual framework mapping the specific variables and relationships to be tested in the study.`
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
        answerText: `* A questionnaire is a written list of questions, the answers to which are recorded by respondents.
* Questionnaires are classified into closed-ended, open-ended, and combination types based on the structure of the questions.
* Closed-ended questions include all possible answers, and respondents are asked to choose among them.
* Closed-ended questionnaires are easy to fill out, save time for respondents, and allow quick coding, tabulation, and statistical analysis.
* They restrict the depth of responses and do not allow respondents to explain their reasoning.
* Open-ended questions allow respondents to answer in their own words in blank spaces provided.
* Open-ended questionnaires capture detailed qualitative information, personal opinions, and attitudes in depth.
* They are difficult to analyze, code, and quantify, and they require a literate population.
* Combination questionnaires contain a mix of closed-ended and open-ended questions.
* They capitalize on the strengths of both types by capturing quantitative trends while collecting qualitative reasoning through open-ended follow-up questions.`
      },
      {
        id: 5009,
        topicId: 324,
        questionText: 'Illustrate the procedure of preparation of a questionnaire. (2025, 2024, 2023, 2020-21, 2019-20, 2019, 2017-18)',
        answerText: `* Preparing a valid and reliable questionnaire requires a systematic procedure starting with deciding which questionnaire type to use.
* The researcher must formulate clear and simple questions using everyday language.
* The researcher must avoid double-barreled questions that ask two things in one question.
* The researcher must avoid negative, leading, or biased questions.
* The questionnaire should be kept as short as possible, with open-ended questions placed at the beginning or end.
* The layout must be clean and appealing so that respondents enjoy answering it.
* The questionnaire must be pre-tested via a pilot study to check for ambiguities and time requirements.
* Guidelines for drafting questions include using clear and simple language while avoiding technical jargon.
* Double-barreled questions asking two things in one sentence must be avoided to prevent confusion.
* Leading questions that guide the respondent to a specific answer must be avoided to maintain objectivity.
* Double negatives should be avoided to keep the questions positive and direct.
* Questions must be kept short to minimize respondent fatigue.`
      },
      {
        id: 5010,
        topicId: 324,
        questionText: 'Differentiate between primary and secondary data. (2019-20, 2019, 2017-18)',
        answerText: `* Primary data is the type of data the researcher directly collects from the source for the specific purpose of the study.
* Secondary data is the type of data that has already been collected and produced by previous researchers, organizations, or agencies.
* Primary data is original, fresh, and raw, whereas secondary data is second-hand and already processed or interpreted.
* Collecting primary data is highly expensive and time-consuming, while secondary data is cheap, easily accessible, and saves time.
* Primary data perfectly matches the specific objectives and variables of the study, whereas secondary data may not fully align with the specific needs of the current research.
* The researcher has full control over the collection procedures and quality of primary data, but has no control over how secondary data was gathered or checked.
* Examples of primary data include field surveys, focus group discussions, direct measurements, and interviews.
* Examples of secondary data include census reports, scientific journals, weather records, and government statistics.
* Before using secondary data, a researcher must verify the reliability of the data source to ensure it comes from a credible organization.
* The suitability of the data must be verified to ensure it covers the exact variables and regions required for the study.
* The adequacy of the data must be verified to ensure it is complete and up-to-date.`
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
        answerText: `* The population is the entire group of individuals or items of interest in a study, whereas a sample is a representative subset selected for investigation.
* Characteristics of the population are called parameters and are denoted by symbols like size $N$, mean $\mu$, and standard deviation $\sigma$.
* Characteristics of a sample are called statistics and are denoted by symbols like size $n$, mean $\\bar{X}$, and standard deviation $s$.
* Data collection for a population is called a census, whereas data collection for a sample is called a sample survey.
* Measuring the entire population is often costly, time-consuming, or impossible, whereas sample surveys are cost-effective, quick, and practical.
* The sample is the physical group of units selected from the population, such as fifty specific fields harvested in a village.
* Sampling is the process or technique utilized in selecting that representative part of the population.`
      },
      {
        id: 5012,
        topicId: 325,
        questionText: 'What does the term sampling imply? (2019-20, 2019)',
        answerText: `* The term sampling implies securing information about the universe by examining only a part of the same.
* Sampling assumes that a well-selected sample will mirror the characteristics of the entire population, allowing researchers to generalize their findings.
* It implies that complete enumeration is often impractical due to high costs, time, or limited manpower, and that sampling optimizes resource use.
* In certain destructive tests where measuring a characteristic destroys the item, sampling is the only possible method of investigation.
* It relies on probability theory and the concept of standard error to estimate how close the sample statistic is to the true population parameter.`
      },
      {
        id: 5013,
        topicId: 325,
        questionText: 'How can a sample size be determined? (2020-21, 2019-20, 2017-18)',
        answerText: `* Determining the appropriate sample size is a balance between precision, confidence, and resource constraints where the concept of standard error provides the key.
* The standard error of the mean is calculated as $SE = \\sigma/\\sqrt{n}$ for continuous variables and $SE = \\sqrt{pq/n}$ for proportions.
* For a large population, the best approximation of the sample size is determined by the formula $n_0 = (p \\cdot q)/d^2$ where $p$ is the population proportion, $q = 1 - p$, and $d$ is the error of tolerance.
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
        answerText: `* Sampling is classified into probability sampling where selection is based on chance, and non-probability sampling where selection is based on judgment or choice.
* In probability sampling, every member of the population has a known, non-zero chance of being selected, which ensures objectivity and allows for statistical generalization.
* In simple random sampling, each unit has an equal and independent chance of selection, such as drawing numbers from a hat.
* In stratified random sampling, the population is divided into non-overlapping strata and random samples are drawn from each stratum to ensure all sub-groups are represented.
* In systematic sampling, the population is arranged in an order and units are selected at a constant interval from a random starting point.
* In multi-stage sampling, the selection is done in sequential stages to reduce field costs in geographically dispersed populations.
* In sequential sampling, samples are drawn in a sequence and tested until a decision to accept or reject is made, which is widely used in quality control.
* In non-probability or purposive sampling, the selection of samples is based on convenience, judgment, or choice rather than chance.
* In convenience sampling, the researcher selects the most accessible population members, such as interviewing farmers visiting a local market.
* In judgment or purposive sampling, the researcher uses their expertise to select typical or representative cases.
* In quota sampling, the researcher interviews a prescribed number of people in specific demographic categories.`
      },
      {
        id: 5015,
        topicId: 326,
        questionText: 'Distinguish among random, stratified, systematic, multistage, and cluster sampling / Compare multistage and cluster. (2020-21, 2019-20, 2017-18)',
        answerText: `* Simple random sampling gives every unit an equal chance of selection, which is unbiased but requires a complete list of the population.
* Stratified sampling divides the population into homogeneous strata and random samples are drawn from each to ensure sub-group representation.
* Systematic sampling selects every $k$-th unit from an ordered list, which is easy to execute but prone to bias if there are periodic patterns.
* Multi-stage sampling performs selection in progressive stages and is practical for nationwide surveys, though sampling errors compound.
* Cluster sampling divides the population into groups, selects whole clusters randomly, and lowers field costs and travel time.
* Stratified sampling divides the population so that there is homogeneity within strata and heterogeneity between strata, taking samples from every stratum.
* Cluster sampling divides the population so that there is heterogeneity within clusters and homogeneity between clusters, selecting only a few clusters and studying all units in them.
* Cluster sampling is a single-stage design where all elements in the selected clusters are studied.
* Multi-stage sampling is a progressive design where secondary units are randomly sampled within the selected clusters.`
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
        answerText: `* For crop cutting experiments, Stratified Systematic Random Sampling or Multi-stage Random Sampling is used.
* Stratification is based on administrative or agro-ecological boundaries, while systematic random selection is used to choose fields and demarcate plots.
* The first step is selection of primary units where villages within a target district are selected using simple random sampling.
* The second step is selection of secondary units where two to three fields are selected in each village using systematic random sampling.
* The third step is locating the crop cutting plot by measuring the field dimensions and using random coordinates to place a plot of standard size.
* The fourth step is harvesting all crop plants falling within the demarcated boundary of the plot.
* The fifth step is threshing and cleaning the harvested crop to separate the grains from the straw and chaff.
* The sixth step is weighing the clean, wet grains immediately to record the green weight.
* The seventh step is adjusting the final yield to a standard moisture level, such as fourteen percent for rice, to report the dry grain yield per unit area.`
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
        answerText: `* Sampling error is the difference between the estimated value from the sample and the true value of the characteristics from a complete count.
* It can be reduced by increasing the sample size or using efficient probability sampling designs like stratified sampling.
* Non-sampling error represents errors that arise in a survey that do not arise from sampling itself.
* It is caused by faulty questionnaire wording, interviewer bias, non-response, or coding mistakes.
* It can be minimized through careful questionnaire pre-testing, researcher training, and double-checking entries.
* Experimental error is a measure of the variation among experimental plots treated alike, representing the variation not explained by the treatments.
* It is caused by soil heterogeneity, genetic differences in crop seeds, or minor variations in agronomic practices.
* It can be reduced by replication, randomization, and local control.
* Systematic errors are consistent, repeatable errors due to flaws in design, equipment calibration, or procedures.
* An example of a systematic error is using a weighing scale that always reads ten grams too high.
* They can be corrected with regular calibration of lab instruments and refining experimental procedures.
* Random errors are unpredictable fluctuations in measurements due to uncontrollable environmental factors.
* An example of a random error is wind gusts affecting a sensitive analytical balance.
* They can be reduced by taking multiple measurements and averaging the results.
* Human errors are outright mistakes made by the experimenter.
* An example of a human error is misreading a thermometer or making calculation errors when entering data.
* They can be minimized by careful execution, double-checking data records, and following strict protocols.`
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
        answerText: `* Scientific reports vary in length and format, ranging from a simple form filled out in the lab to a formal written report.
* They usually follow a basic structure of Title, Introduction, Methods, Results, Discussion, Conclusion, and References.
* The objectives section describes the goals of the study and must be clear, complete, and specific.
* It must be action-oriented, beginning with action verbs such as to evaluate, to determine, to ascertain, to compare, or to measure.
* It must identify the main goals of the study.
* It must identify the variables to be correlated and the expected direction of their relationship if applicable.`
      },
      {
        id: 5019,
        topicId: 329,
        questionText: 'What is a scientific report? What should be the characteristics of the title of a scientific report? (2019)',
        answerText: `* A scientific report is a structured document detailing the background, design, execution, results, and discussion of a scientific inquiry.
* The title is the first part of the report readers encounter, and it must be concise and as short as possible.
* It must omit redundant phrases like "a study on" or "an investigation into".
* It must be descriptive, clearly indicating the main subject, independent and dependent variables, and scope of the experiment.
* It must be unambiguous, using precise words and avoiding abbreviations, chemical formulas, or technical jargon.
* It must be informative, accurately reflecting the contents of the report and attracting the interest of target readers.
* An example of a good title is "Effect of Nitrogen Fertilizer Rates on the Yield and Lodging Resistance of IR8 Rice".`
      },
      {
        id: 5020,
        topicId: 329,
        questionText: 'Briefly describe the essential sections of a thesis. (2025, 2024, 2020-21, 2019-20, 2019)',
        answerText: `* The thesis is divided into preliminary pages, main chapters, and supplementary pages.
* The title page includes the project title, author's name, degree, institution, and date.
* The certificates and declaration page confirms the work is original and approved by the supervisor.
* The acknowledgments page gratefully acknowledges support from supervisors, technicians, and sponsors.
* The abstract page provides a brief summary of the background, objectives, methodology, key results, and major conclusions.
* The table of contents and lists of tables and figures act as page directories of the thesis sections.
* The introduction provides the background context, outlines the problem statement, justifies the significance, and states the objectives.
* The review of literature synthesizes previous research to establish the theoretical and conceptual framework.
* The materials and methods section details the experimental site, climate, treatments, design, layout, crop management, data collection, and statistical software.
* The results section presents the collected data neutrally using text, structured tables, and graphs.
* The discussion section interprets the results, explains cause-and-effect relationships, and compares findings with prior literature.
* The summary and conclusion section summarizes findings, draws final conclusions, and suggests recommendations.
* The references or bibliography section provides an alphabetical list of all cited works.
* The appendices include raw data, large ANOVA tables, or survey questionnaires.`
      },
      {
        id: 5021,
        topicId: 329,
        questionText: 'Distinguish between a scientific paper and a review paper. (2020-21)',
        answerText: `* A scientific paper reports original, first-hand experimental data collected by the authors, whereas a review paper synthesizes and summarizes existing research published by others.
* A scientific paper follows the strict IMRAD format consisting of Introduction, Methods, Results, and Discussion.
* A review paper is organized around thematic headings and does not contain materials and methods or results sections.
* The objective of a scientific paper is to present new findings, test a hypothesis, and add new data to the field.
* The objective of a review paper is to survey the current state of knowledge, identify research gaps, and suggest future directions.
* Scientific papers rely on primary data from laboratory, field, or survey work, while review papers rely on secondary data from previously published papers.
* Scientific papers have a moderate reference count typically ranging from twenty to forty citations, whereas review papers have extensive references often exceeding fifty to one hundred citations.`
      },
      {
        id: 5022,
        topicId: 329,
        questionText: 'Mention the general principles of writing a scientific report or the \'introduction\' section of a thesis/scientific report. (2019-20, 2019, 2017-18)',
        answerText: `* The general principles of writing a scientific report include using simple, direct, and unambiguous language to ensure clarity and precision.
* The writer must maintain a neutral, factual, and unbiased tone to preserve objectivity.
* Sentences must be kept short and active, omitting unnecessary words for conciseness.
* The author must ensure smooth transitions between sentences and paragraphs to maintain logical flow.
* Information must always be attributed to its original source using standardized citations.
* The introduction chapter must follow a funnel structure moving from a broad context to specific details.
* The introduction begins with a broad overview of the subject area to establish its context and importance.
* It briefly explains the underlying scientific theories, laws, equations, or theorems.
* It clearly identifies the specific gap in knowledge or problem that the study aims to address.
* It justifies why the study is necessary and who will benefit from its findings.
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
        answerText: `* A standard research proposal submitted for funding to the Research and Innovation Centre of Khulna University begins with a concise and descriptive project title.
* It includes investigator details listing the names, designations, departments, emails, and contact numbers of the principal investigator and co-investigators.
* An abstract of two hundred to three hundred words summarizes the background, objectives, methodology, and expected outcomes of the project.
* The background and rationale section outlines the context, identifies the problem statement, and details the significance of the study.
* The objectives section states the overall main goal along with two to four clear and measurable specific objectives beginning with action verbs.
* The research questions section lists the key questions that the project seeks to answer.
* The methodology section details the study design, data collection tools, variables, sampling design, and data analysis software.
* The timeline section contains an activity schedule structured by month to map the progress of the literature review, sampling, data processing, and report writing.
* The budget and justification section includes an itemized expense table in Bangladeshi Taka for equipment, travel, personnel, software, and miscellaneous costs.
* The expected outcomes section describes the key deliverables such as reports, maps, or policy briefs.
* The ethical considerations section outlines the ethical approvals, informed consent, and mitigation of environmental impact.
* The references section lists all cited literature using standardized styles.
* The proposal ends with a declaration page signed by the principal investigator to certify the validity of the proposal and proper use of funds.`
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
        answerText: `* Making scientific inference involves drawing logical, general conclusions from raw experimental or survey data.
* The researcher runs statistical analyses such as Analysis of Variance or t-tests to test the null hypothesis.
* The researcher compares calculated test statistics with tabulated critical values at a specific significance level to determine if treatment effects are statistically significant.
* If the calculated F-value is greater than the tabulated F-value, the null hypothesis is rejected.
* The researcher extrapolates findings from the representative sample to the wider target population.
* Standard errors and confidence intervals are factored in to define the range and precision within which the population parameters are expected to lie.
* The results are related back to the theoretical and conceptual frameworks established in the introduction.
* The investigator explains the biological, physiological, or socio-economic mechanisms of why a certain treatment succeeded or failed.
* The findings are compared with existing literature to discuss whether they confirm, contradict, or extend prior studies.
* Quantitative data are combined with qualitative observations to build a comprehensive explanation.
* The boundary conditions of the inference, such as soil type or climatic zone, must be clearly identified.
* The researcher must state any limitations or potential sources of error in the experiment.`
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
