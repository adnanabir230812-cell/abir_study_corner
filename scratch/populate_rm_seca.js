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
        answerText: `Research is a structured inquiry that utilizes acceptable scientific methodology to solve problems and create new knowledge that is generally applicable. It is a scientific method consisting of systematic observation, classification, and interpretation of data.

Research is a process of collecting, analyzing and interpreting information to answer questions. But to qualify as research, the process must have certain characteristics. It must, as far as possible, be:
1. Controlled: In exploring causality in relation to two variables (factors), you set up your study in a way that minimizes the effects of other factors affecting the relationship.
2. Rigorous: You must be scrupulous in ensuring that the procedures followed to find answers to questions are relevant, appropriate, and justified.
3. Systematic: This implies that the procedure adopted to undertake an investigation follows a certain logical sequence. The different steps cannot be taken in a haphazard way. Some procedures must follow others.
4. Valid and verifiable: This concept implies that whatever you conclude on the basis of your findings is correct and can be verified by you and others.
5. Empirical: This means that any conclusion drawn are based upon hard evidence collected from real life experiences or observations.
6. Critical: Critical scrutiny of the procedures used and the methods employed is crucial to a research enquiry. The process of investigation must be foolproof and free from drawbacks. The process adopted and the procedures used must be able to withstand critical scrutiny.`
      },
      {
        id: 5002,
        topicId: 321,
        questionText: 'Classify and discuss different types of research on the basis of objectives. (2024, 2023, 2019-20, 2019, 2017-18)',
        answerText: `From the viewpoint of objectives, a research can be classified as:
* Descriptive
* Co relational
* Explanatory

Descriptive research attempts to describe systematically a situation, problem, phenomenon, service or program, or provides information about, say, living condition of a community, or describes attitudes towards an issue.

Co relational research attempts to discover or establish the existence of a relationship/ interdependence between two or more aspects of a situation.

Explanatory research attempts to clarify why and how there is a relationship between two or more aspects of a situation or phenomenon.

Exploratory research is undertaken to explore an area where little is known or to investigate the possibilities of undertaking a particular research study (feasibility study / pilot study).`
      },
      {
        id: 5003,
        topicId: 321,
        questionText: 'Compare and contrast: (i) Fundamental and applied research, (ii) Adaptive and strategic research. (2025, 2023, 2020-21)',
        answerText: `From the point of view of application, there are two broad categories of research:
1. Pure/ Fundamental/ Strategic research
2. Applied/ Adaptive research

Pure (Fundamental) research involves developing and testing theories and hypotheses that are intellectually challenging to the researcher but may or may not have practical application at the present time or in the future. The knowledge produced through pure research is sought in order to add to the existing body of research methods.

Applied research is done to solve specific, practical questions; for policy formulation, administration and understanding of a phenomenon. It can be explanatory, but is usually descriptive. It is almost always done on the basis of basic research. Applied research can be carried out by academic or industrial institutions.

Comparison between Fundamental and Applied Research:
* Fundamental (Pure) Research:
  * Core Goal: Developing and testing theories and hypotheses that are intellectually challenging.
  * Application: May or may not have practical application at the present time or in the future.
  * Output: Adds to the existing body of research methods and scientific knowledge.
* Applied Research:
  * Core Goal: Done to solve specific, practical questions.
  * Application: Used for policy formulation, administration and understanding of a phenomenon.
  * Foundation: Almost always done on the basis of basic (fundamental) research.

Comparison between Strategic and Adaptive Research:
* Strategic Research:
  * Designed to address a major, widespread problem requiring new scientific understanding or tools. It bridges basic and applied research.
* Adaptive Research:
  * Aimed at adjusting and testing existing technologies or recommendations under local environmental, soil, and socio-economic conditions to fit farmers' needs (short-term goals).`
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
        answerText: `Before finalizing a topic, the researcher must evaluate it against these seven considerations:
* Interest:
  * A research endeavor is usually time consuming, and involves hard work and possibly unforeseen problems.
  * One should select topic of great interest to sustain the required motivation.
* Magnitude:
  * It is extremely important to select a topic that you can manage within the time and resources available.
  * Narrow the topic down to something manageable, specific and clear.
* Measurement of concepts:
  * Make sure that you are clear about the indicators and measurement of concepts in your study.
* Level of expertise:
  * Make sure that you have adequate level of expertise for the task you are proposing since you need to do the work yourself.
* Relevance:
  * Ensure that your study adds to the existing body of knowledge, bridges current knowledge gaps and is useful in policy formulation.
  * This will help you to sustain interest in the study.
* Availability of data:
  * Before finalizing the topic, make sure that data are available.
* Ethical issues:
  * How ethical issues can affect the study population and how ethical problems can be overcome should be thoroughly examined at the problem formulating stage.

Steps in formulation of a research problem:
Step 1: Identify a broad field or subject area of interest to you.
Step 2: Dissect the broad area into sub areas.
Step 3: Select what is of most interest to you.
Step 4: Raise research questions.
Step 5: Formulate objectives.
Step 6: Assess your objectives.
Step 7: Double check.`
      },
      {
        id: 5005,
        topicId: 322,
        questionText: 'Justify the importance of ethics in research problem selection. (2025)',
        answerText: `How ethical issues can affect the study population and how ethical problems can be overcome should be thoroughly examined at the problem formulating stage. Collecting data through any of the methods may involve some ethical issues in relation to the participants and the researcher.

Ethical issues concerning research participants:
* Collecting information: Your request for information may put pressure or create anxiety on a respondent. Provided any piece of research is likely to help society directly or indirectly, it is acceptable to ask questions, if you first obtain the relevance of the research. Otherwise, you are wasting your respondents' time, which is unethical.
* Seeking consent: In every discipline it is considered unethical to collect information without the knowledge of the participant, and their expressed willingness and informed consent.
* Providing incentives: Giving a present before data collection is unethical.
* Seeking sensitive information: Certain types of information can be regarded as sensitive or confidential by some people and thus an invasion to privacy. Give them sufficient time to decide if they want to participate.
* Maintaining confidentiality: Sharing information about a respondent with others for purposes other than research is unethical. You need to ensure that after the information has been collected, the source cannot be known. It is unethical to identify an individual's responses.

Ethical issues relating to the researcher:
* Avoiding bias.
* Provision or deprivation of a treatment.
* Using inappropriate research methodology.
* Incorrect reporting.
* Inappropriate use of the information.`
      },
      {
        id: 5006,
        topicId: 322,
        questionText: 'Explain how the duration of research is important for research management. (2020-21)',
        answerText: `Duration of research is important for research management in the following ways:
* Planning and Goal Setting:
  * Helps define realistic project scope and objectives.
  * Enables phased planning and milestone setting.
* Budget Allocation:
  * Affects financial planning and phased funding.
  * Optimizes resource spending to avoid over- or under-budgeting.
* Team and Resource Utilization:
  * Ensures efficient allocation of researchers and staff.
  * Dictates the use of equipment, lab spaces, and facilities.
* Monitoring and Evaluation:
  * Facilitates regular progress reviews and milestone checks.
  * Ensures the project stays on track with clear timelines.
* Impact on Outcomes:
  * Ensures appropriate results for time-sensitive or long-term studies.
  * Balances exploratory (long-term) and adaptive (short-term) research goals.
  * Effective duration management optimizes resources, ensures timely results, and aligns research with stakeholder expectations.`
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
        answerText: `Steps in Research Process:
1. Formulating the Research Problem
2. Extensive Literature Review
3. Developing the objectives
4. Preparing the Research design including sample design.
5. Collecting the Data
6. Processing and analysing data
7. Generalization and Interpretation
8. Preparation of the Report or Thesis

Functions of Literature Review:
* Bring clarity and focus to your research problem: Helps to understand the select area better and clearly/precisely define it.
* Improve your methodology: Tells if others faced similar problems, and suggests methods which worked well.
* Broaden your knowledge base in your research area: Helps you to become an expert in your study.
* Contextualize your findings: Place your findings in the context of what others have found.

Procedure for reviewing literature:
1. Search for existing literature in your area of study.
2. Review the selected literature.
3. Develop a theoretical framework.
4. Develop a conceptual framework.`
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
        answerText: `Structured surveys/ interviews employ the use of a questionnaire. A questionnaire consists of a set of questions presented to a respondent for answers. The respondents read the questions, interpret what is expected and then write down the answers themselves. It is called an Interview Schedule when the researcher asks the questions (and if necessary explain them) and record the respondents reply on the interview schedule.

There are three basic types of questionnaire:
* Closed-ended Questionnaire: Closed ended questions include all possible answers/prewritten response categories, and respondents are asked to choose among them. Examples include multiple choice questions, scale questions. Type of questions used to generate statistics in quantitative research.
* Open-ended questionnaire: Open-ended questions allow respondents to answer in their own words. Questionnaire does not contain boxes to tick but instead leaves a blank section for the response to write in an answer. Open-ended questionnaires might be used to find out what people think about a service. As there are no standard answers to these questions, data analysis is more complex. Fewer questionnaires need to be distributed.
* Combination of both: This way it is possible to find out how many people use a service and what they think of the service in the same form. Begins with a series of closed-ended questions, with boxes to tick or scales to rank, and then finish with a section of open-ended questions or more detailed response.`
      },
      {
        id: 5009,
        topicId: 324,
        questionText: 'Illustrate the procedure of preparation of a questionnaire. (2025, 2024, 2023, 2020-21, 2019-20, 2019, 2017-18)',
        answerText: `The procedure of preparation of a questionnaire involves the following steps:
1. Deciding which questionnaire to use:
   * Closed or open ended.
   * Self or interviewer administered.
2. Wording and structure of questions:
   * Questions should be kept short and simple.
   * Avoid double barreled i.e. two questions in one – ask two Qs rather than one.
   * Avoid negative questions – which have no idea about it as it is confusing for respondent to agree or disagree.
   * Question should not contain Prestige-Bias – may cause embarrassment or force the respondent to give false answer in order to look good (e.g. educational qualification or income).
   * Use indirect questions for sensitive issues – in indirect questions respondents can relate their answer to other people.
   * Using close-ended questions – try to make sure that all possible answers are covered. "Don't Know" category also needs to be added.
   * Avoiding Leading Question – Don't lead the respondent to answer in a certain way.
3. Length and ordering of the questions:
   * Keep the questionnaire as short as possible.
   * Ask easy Qs which respondents will enjoy answering.
   * Make Qs as interesting as possible and easy to follow by varying type and length of questions.
   * If combined questionnaire, keep open ended Qs for the end.`
      },
      {
        id: 5010,
        topicId: 324,
        questionText: 'Differentiate between primary and secondary data. (2019-20, 2019, 2017-18)',
        answerText: `Primary Data:
* Definition: Primary data is the type of data the researcher directly collects from the source for the specific purpose of the study.
* Originality: It is original and fresh/raw.
* Time & Cost: Collecting and gathering of data is expensive and time-consuming.
* Suitability: It is tailored to the specific objectives and variables of the study.
* Precautions: Extra precautionary measures are needed to put it into consideration.

Secondary Data:
* Definition: Secondary data is data that is already produced by previous researchers, organizations, or agencies.
* Originality: It is already processed and interpreted (second-hand).
* Time & Cost: Collection and gathering of data is cheap and easily accessible.
* Suitability: May not fully align with the specific needs of the current research.
* Precautions: Extra precautionary measures must be put into consideration before using it (requires checking reliability, suitability, adequacy).`
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
        answerText: `Comparison between Population and Sample:
* Population:
  * Definition: The entire group of individuals or items of interest in a study is called population. It contains all members of a specified group (both animate and inanimate objects).
  * Size Symbol: Denoted by N.
  * Measures: Characteristics are called parameters.
  * Symbols: Mean by \mu, standard deviation by \sigma.
  * Collection: Complete census or complete enumeration.
* Sample:
  * Definition: The part of the population selected for investigation to get information about the entire population. It is a subset of the population.
  * Size Symbol: Denoted by n.
  * Measures: Characteristics are called statistics.
  * Symbols: Mean by \bar{X} (or m), standard deviation by s.
  * Collection: Sample survey.

Comparison between Sample and Sampling:
* Sample is a part of the population which is selected for investigation.
* Sampling is the statistical technique or method by which one can draw the sample from the population.`
      },
      {
        id: 5012,
        topicId: 325,
        questionText: 'What does the term sampling imply? (2019-20, 2019)',
        answerText: `The term sampling implies:
* Securing information about the universe by examining only a part of the same.
* Statistical Induction: Arriving at general conclusions about the population by observing individual cases in a sample.
* Cost and Time Reduction: Investigating a sample is far less costly and less time consuming than complete enumeration.
* Feasibility: In certain types of investigation (like destructive tests where items are destroyed during measurement), sampling is the only procedure that can be adopted.
* Scope and Accuracy: Sample study has got much greater scope and is likely to have a greater element of accuracy than a complete enumeration.`
      },
      {
        id: 5013,
        topicId: 325,
        questionText: 'How can a sample size be determined? (2020-21, 2019-20, 2017-18)',
        answerText: `There is no general rule to decide the sample size. It depends on individual situations. The concept of standard error provides the key in arriving at a good estimate of sample size:
* For continuous variables, standard error of mean is calculated as:
  SE = \sigma / \sqrt{n}
* For binomial proportions, standard error is calculated as:
  SE = \sqrt{p \cdot q / n}

If the population size is large, the first approximation of the sample size (usually the upper bound) is determined by the formula:
n_0 = \frac{p \cdot q \cdot t_\alpha^2}{d^2}

Where:
* p is the proportion of success in the population.
* q = 1 - p.
* t_\alpha is the abscissa of the normal curve that cuts off an area \alpha at the tail (representing the confidence level, e.g., 95% confidence).
* d is the error of tolerance in estimating P (i.e., |p - P| \le d).

Key factors in determining sample size:
* Level of confidence (1 - \alpha): Higher confidence levels require larger sample sizes.
* Error of tolerance (d): Lower errors of tolerance require larger sample sizes.
* Homogeneity/Heterogeneity of the population: Heterogeneous populations require larger samples.`
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
        answerText: `There are primarily two ways of choosing a sample: probability sampling and purposive sampling.

1. Probability Sampling (usually called random sampling): every member of the universe has a known, non-zero chance of being selected, which ensures objectivity. Types include:
* Random Sampling: Every item of the universe has an equal chance of being chosen and only the chance determines the items to be included. Selection is done using random numbers.
* Stratified Sampling: The population is first divided into sub-populations called strata to achieve a greater degree of homogeneity within each stratum. Random samples are then drawn from each stratum.
* Systematic Sampling: The universe is initially arranged in some order (geographical, alphabetical, etc.) and sample units are selected at a constant sampling interval after a random starting point.
* Multi-stage sampling: Involves the selection of the sample by stages. The population is divided into primary sampling units, and each primary unit is sub-divided into secondary sampling units. Primary units are selected at random, and from those, secondary units are selected again at random.
* Sequential Sampling: A special type of sampling having wide application in quality control where the sample size is not determined in advance. Samples are drawn in a sequence and tested until a decision is made.

2. Purposive Sampling (also called judgment sampling): the selection of samples is done by choice or judgment of the investigator and not by chance. The investigator exercises judgment to select typical or representative cases, which introduces the chance of personal bias.`
      },
      {
        id: 5015,
        topicId: 326,
        questionText: 'Distinguish among random, stratified, systematic, multistage, and cluster sampling / Compare multistage and cluster. (2020-21, 2019-20, 2017-18)',
        answerText: `Distinction among Sampling Methods:
* Simple Random Sampling: Units are selected individually from a homogeneous population by using random numbers, where each unit has an equal and independent chance of selection.
* Stratified Sampling: The population is divided into homogeneous groups called strata. Random samples are drawn from every stratum. The purpose is to achieve homogeneity within strata and heterogeneity between strata.
* Cluster Sampling: The population is divided into groups called clusters. The clusters are treated as sampling units. A random sample of clusters is drawn, and all units in the selected clusters are studied. The purpose of clustering is opposite to stratified sampling: to achieve minimum homogeneity (maximum heterogeneity) within each cluster and maximum homogeneity (minimum heterogeneity) between clusters.
* Systematic Sampling: The universe is arranged in some order (alphabetical, geographical, etc.) and sample units are selected at a constant sampling interval from a random starting point.
* Multi-stage Sampling: The sample is selected in sequential stages. The population is divided into primary units, which are sub-divided into secondary units, and so on. Samples are drawn randomly at each stage.

Comparison between Multistage and Cluster Sampling:
* Cluster sampling is a single-stage design where the population is divided into clusters, a sample of clusters is drawn, and all elements in the selected clusters are studied.
* Multi-stage sampling (or sub-sampling) is a design where the population is divided into primary units, a sample of primary units is drawn, and then a sample of secondary units is drawn from within the selected primary units, rather than studying all elements.`
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
        answerText: `The different types of errors in research and experimentation are:

1. Sampling Error:
* Definition: Sampling error is the difference between the estimated value and the true values of the characteristics, that is difference between sample results and the result of a complete count.
* Cause: Introduced by the sampling itself, as sample survey results are only estimates and not true values.

2. Non-sampling Error:
* Definition: The error not arising out of sampling.
* Cause: Arises both in sample surveys and complete censuses due to human errors, faulty questionnaire design, data entry mistakes, etc.

3. Experimental Error:
* Definition: Variation among experimental units that are treated alike.
* Cause: It is a measure of the variation not explained by the treatments.

4. Systematic Errors:
* Definition: Consistent, repeatable errors due to flaws in design, equipment, or procedures.
* Causes: Instrument calibration issues, faulty equipment, environmental factors, procedural bias.
* Examples: Ruler with a worn-off starting point, improperly zeroed balance.
* Correction: Use calibrated instruments, refine procedures, conduct control tests.

5. Random Errors:
* Definition: Unpredictable variations due to uncontrollable factors.
* Causes: Environmental fluctuations, human limitations, instrument sensitivity.
* Examples: Slight differences in measuring plant height, timing variations with a stopwatch.
* Correction: Take multiple measurements and average results.

6. Human Errors:
* Definition: Mistakes made by the experimenter.
* Causes: Misreading instruments, incorrect procedures, calculation mistakes.
* Examples: Recording 35°C as 53°C, parallax error while measuring volume.
* Correction: Double-check data, follow standardized procedures, improve training.`
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
        answerText: `Scientific Report: A scientific report is a clear and organized document that explains how a scientific investigation or experiment was done, what the results were, and what conclusions were made. It helps share findings with others in a simple and unbiased way. Scientific reports can vary in length and format, ranging from a form to fill in and submit before leaving the lab, to a formal written report, all usually following a similar basic structure.

Characteristics of the Objective Section of a Scientific Report:
* Clear and Specific: States the main purpose and specific goals of the study, avoiding ambiguity.
* Concise: Briefly outlines what the study intends to achieve without unnecessary detail.
* Measurable: Defines goals that can be evaluated or quantified, enabling tracking of progress and results.
* Relevant: Directly relates to the problem or hypothesis being studied.
* Realistic: Sets achievable and practical objectives based on available resources and time.
* Logical Flow: Lists objectives in a logical sequence that guides the research process.
* Action-Oriented: Uses verbs like "analyze," "determine," "identify," and "evaluate" to indicate actions.`
      },
      {
        id: 5019,
        topicId: 329,
        questionText: 'What is a scientific report? What should be the characteristics of the title of a scientific report? (2019)',
        answerText: `Scientific Report: A scientific report is a clear and organized document that explains how a scientific investigation or experiment was done, what the results were, and what conclusions were made. It helps share findings with others in a simple and unbiased way.

Characteristics of the Title of a Scientific Report:
* Concise and Descriptive: The title should be concise and descriptive.
* Informative and Catchy: Try to think of an informative but catchy title.
* Interest-Pricking: An effective title not only pricks the reader's interest, but also predisposes him/her favourably towards the proposal/report.
* Element Inclusion on Title Page: Should include Title (including subtitle), author, institution, department, date of delivery, research mentor(s) and advisor, their institutions and email addresses.`
      },
      {
        id: 5020,
        topicId: 329,
        questionText: 'Briefly describe the essential sections of a thesis. (2025, 2024, 2020-21, 2019-20, 2019)',
        answerText: `The essential sections of a thesis, in order, are:
* Title Page: Includes the title (including subtitle), author, institution, department, date of delivery, research mentor(s) and advisor, and their institutions and email addresses.
* Abstract: A brief summary (one or two paragraphs, approx. 400 words max) explaining why the paper is important, a summary of major results (preferably with numbers and error limits), and the major implications of the work. It has no citations and does not repeat the title.
* Table of Contents: Lists all chapters, sections, and page numbers.
* List of Figures and List of Tables: Lists page numbers and a short title for each figure and table, but not the whole caption.
* Introduction: Provides background or context, states the goal of the paper (why it was written), acknowledges previous work with references, explains the scope of the work, and provides a verbal road map. It is focused on the thesis question(s) and is not a review paper.
* Methodology (or Methods): Contains information to allow the reader to assess the believability of the results and replicate the experiment. Includes description of materials, procedure, theory, calculations, technique, equipment, calibration plots, limitations, assumptions, range of validity, and analytical/statistical methods.
* Results: Actual statements of observations, including statistics, tables, and graphs, indicating range of variation and both positive and negative results, without interpretation. Uses S.I. units.
* Discussion: A brief essay interpreting the results in terms of the background laid out in the introduction. Discusses spatial and temporal patterns, trends, generalizations, exceptions, likely causes/mechanisms, multiple hypotheses, agreement/disagreement with previous work, and the significance of the results.
* Conclusions: The strongest and most important statements from the observations, summarizing new observations, interpretations, and insights, and including broader implications.
* Recommendations: Includes remedial action to solve the problem, further research to fill in gaps, and directions for future investigations.
* Acknowledgments: Thanks advisors, and anyone who helped technically, intellectually, or financially.
* References: Cites all ideas, concepts, text, and data that are not the author's own, listed in alphabetical order.
* Appendices: Includes all raw data, large tables or calculations (more than 1-2 pages), key articles, list of additional resource materials, or list of equipment/complicated procedures.`
      },
      {
        id: 5021,
        topicId: 329,
        questionText: 'Distinguish between a scientific paper and a review paper. (2020-21)',
        answerText: `Comparison between a Scientific Paper and a Review Paper:
* Scientific Paper:
  * Definition: A paper reporting original work and interpretation/analysis by the author, presenting new, first-hand experimental or field data to address a specific research question.
  * Data Source: Primary data from laboratory, field, or survey work.
  * Structure: Follows the strict IMRAD format (Introduction, Methods, Results, and Discussion).
* Review Paper:
  * Definition: A paper that does not report new original experimental work, but instead synthesizes, summarizes, and analyzes the existing body of published literature on a subject.
  * Data Source: Secondary data from previously published papers.
  * Structure: Organized around thematic headings.`
      },
      {
        id: 5022,
        topicId: 329,
        questionText: 'Mention the general principles of writing a scientific report or the \'introduction\' section of a thesis/scientific report. (2019-20, 2019, 2017-18)',
        answerText: `General Principles of Technical Writing (Scientific Report):
* Writing is an acquired skill that must be learnt by doing it. Practice is essential.
* Transference of ideas and information: The aim in most scientific reports or technical writing must be to transfer ideas and information to other people (effective communication).
* Message must be communicated effectively: It must be much more than just scientifically accurate and grammatically correct. It must be presented in a manner that commands attention, is quickly informative, and is easily digested by the readers.
* Writer's attention must be firmly fixed on the reader (audience analysis: what do they know, what do they need to know, what are their attitudes, and physical contexts).
* Follow a structured plan: Break down writing into separate stages (identifying aim, reader analysis, making a plan, discussing with others, drafting the text, forgetting the draft, revising and editing).
* Editing in three areas: Organization of subject matter, Composition (paragraph, sentence, and word level errors), and Mechanics of format.

General Principles of Writing the Introduction Section:
* States the problem and the purpose of the study, providing the necessary background or context.
* States the goal of the paper (why the study was undertaken or why it was written).
* Provides proper acknowledgment of the previous work (literature review) on which you are building.
* Explains the scope of the work (what will and will not be included).
* Provides a verbal road map (table of contents guides the reader).
* Focused on the thesis question(s) (not a summary of everything on the subject).`
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
        answerText: `A research proposal submitted for funding to the Research and Innovation Centre, Khulna University follows this structured format:

1. Project Title: Clear and descriptive, indicating the main subject (e.g., "Assessment of apiculture techniques for increasing yield of mustard production").
2. Investigator Details: Names, designations, departments, emails, and contact numbers of Principal Investigator(s) and Co-Investigator(s).
3. Abstract: A summary (one or two paragraphs, 200-300 words max) outlining the background, objectives, methodology, and expected outcomes.
4. Background and Rationale: Problem statement, background context, and justification for the proposed study.
5. Objectives: List of main objectives and sub-objectives, stated clearly, measurably, and action-oriented.
6. Research Questions: Key questions that the project seeks to answer.
7. Literature Review: Survey of existing literature to establish context and justify study.
8. Methodology: Detailed study design, data collection procedures, variables, sampling methods, and analytical techniques.
9. Plan (Time Frame and Schedule of Activities): Tabulated schedule by month using a Gantt chart.
10. Budget and Justification: Itemized budget plan covering categories like personnel, travel, rentals, materials, special equipment, etc., with justification.
11. Expected Outcomes: List of key deliverables (reports, maps, etc.).
12. Ethical Considerations: Permissions, informed consent, minimizing environmental impact.
13. References: Standardized citation list.
14. Declaration: affirmation statement of accuracy and signatures of PIs and Co-Is.`
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
        answerText: `Drawing inferences from research results is achieved by:
* Physical separation into different sections or paragraphs (separating observations/results from interpretations/discussion).
* Quarantine observations from interpretations: Make it crystal clear which statements are observations and which are interpretations.
* Don't overlay interpretation on top of data in figures.
* Careful use of phrases such as "We infer that..." or "I infer...".
* Don't worry if "results" seem short. It is easier for readers to absorb, avoids frequent shifts of mental mode, and ensures work endures despite shifting paradigms.`
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
