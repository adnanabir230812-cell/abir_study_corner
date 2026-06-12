const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const course = db.courses.find(c => c.id === 1);

// List of some unique query keys from all questions in Images 1-4
const imageQuestions = [
  // Image 1
  { ref: "Img1 Q1.a", key: "plant toxin", text: "What is meant by plant toxin?" },
  { ref: "Img1 Q1.c", key: "pre-penetration", text: "How a disease cycle's pre-penetration phenomena are signaled?" },
  { ref: "Img1 Q2.b", key: "Vanderplank's Equivalence", text: "Critically analyze Vanderplank's Equivalence Theorem" },
  { ref: "Img1 Q2.c", key: "Successful infections always result in the appearance of symptoms", text: "Successful infections always result in the appearance of symptoms - Give judgment" },
  { ref: "Img1 Q2.d", key: "spore germination factors", text: "Write a note on spore germination factors of fungi" },
  { ref: "Img1 Q3.a", key: "Presence of susceptible plants", text: "Presence of susceptible plants and virulent pathogens doesn't guarantee epidemic" },
  { ref: "Img1 Q3.c", key: "xylem and phloem blockage", text: "Fungal attack causes xylem and phloem blockage" },
  { ref: "Img1 Q3.d", key: "disseminated by air current", text: "Fungal spores can easily be disseminated by air current" },
  { ref: "Img1 Q4.a", key: "cross protection", text: "How does cross protection influence resistance?" },
  { ref: "Img1 Q4.b", key: "two-acre vegetable crop", text: "Farmer field diagnostics: yellowing leaves at two to three leaf stages" },
  { ref: "Img1 Q4.c", key: "Burning crop residue", text: "Burning crop residue contributes to disease outbreak" },
  { ref: "Img1 Q4.d", key: "penetration peg", text: "Parasitic higher plants penetrate into the host only by forming penetration peg" },
  { ref: "Img1 Q5.a", key: "loose smut disease of wheat and covered smut", text: "Distinguish between loose smut of wheat and covered smut of barley" },
  { ref: "Img1 Q5.c", key: "disease cycle of brown spot of rice", text: "Diagrammatically show the disease cycle of brown spot of rice" },

  // Image 2
  { ref: "Img2 Q1.b", key: "Victorin", text: "Prove that Victorin is a host-specific toxin" },
  { ref: "Img2 Q1.e", key: "non-toxic chemical become toxic", text: "How does a non-toxic chemical become toxic? Example" },
  { ref: "Img2 Q2.a", key: "propagule and inoculum", text: "Compare and contrast between propagule and inoculum" },
  { ref: "Img2 Q2.b", key: "Nutrient uptake by pathogen", text: "Nutrient uptake by pathogen is equivalent to the damage" },
  { ref: "Img2 Q3.b", key: "disease triangle and disease tetrahedron", text: "Define disease triangle and disease tetrahedron with diagram" },
  { ref: "Img2 Q3.c", key: "Number of propagules produced at a time", text: "Number of propagules and reproduction cycle affect epidemic" },
  { ref: "Img2 Q3.d", key: "day and night temperature", text: "How does the fluctuation of day and night temperature affect epidemics?" },
  { ref: "Img2 Q4.a", key: "symplastic, apoplastic", text: "Symplastic, apoplastic and amphimobile movement of fungicides" },
  { ref: "Img2 Q4.c", key: "antagonism, antagonist and hyper-parasitism", text: "Define antagonism, antagonist and hyper-parasitism" },
  { ref: "Img2 Q4.d", key: "antagonists act", text: "How do antagonists act?" },

  // Image 3
  { ref: "Img3 Q5.a.i", key: "Narrow brown leaf spot and bacterial leaf streak", text: "Compare Narrow brown leaf spot and bacterial leaf streak" },
  { ref: "Img3 Q5.a.ii", key: "Nitrogen deficiency and tungro disease", text: "Compare Nitrogen deficiency and tungro disease of rice" },
  { ref: "Img3 Q5.b", key: "two seed borne and two soil borne", text: "List two seed borne and two soil borne diseases of rice" },
  { ref: "Img3 Q6.a", key: "stem rot and black band of jute", text: "Compare stem rot and black band of jute" },
  { ref: "Img3 Q6.c", key: "anthracnose of jute", text: "How can you control anthracnose of jute?" },
  { ref: "Img3 Q7.b", key: "red rot and smut of sugarcane", text: "Draw and describe symptoms of red rot and smut of sugarcane" },
  { ref: "Img3 Q7.c", key: "angular leafspot of cotton", text: "Control measure schedule for angular leafspot of cotton" },
  { ref: "Img3 Q8.a", key: "grey leaf spot of mustard and cercospora", text: "Describe symptoms of grey leaf spot of mustard and cercospora" },
  { ref: "Img3 Q8.b", key: "red rot of sugarcane and brown spot of rice", text: "Suitable factors of red rot of sugarcane and brown spot of rice" },
  { ref: "Img3 Q8.c", key: "grey leaf spot of mustard and mosaic of mungbean", text: "Control measures for grey leaf spot of mustard and mosaic of mungbean" },

  // Image 4
  { ref: "Img4 Q1.b", key: "obligate parasite", text: "Write a note on obligate parasite" },
  { ref: "Img4 Q1.c", key: "degree of parasitism", text: "No correlation exists between degree of parasitism and disease severity" },
  { ref: "Img4 Q1.d", key: "Symbiotic relationship is a parasitism", text: "Symbiotic relationship is a parasitism - explain" },
  { ref: "Img4 Q2.a", key: "epidemic and endemic", text: "Define epidemic and endemic with example" },
  { ref: "Img4 Q2.c", key: "changes its susceptibility to disease with age", text: "Plant changes its susceptibility to disease with age - diagram" },
  { ref: "Img4 Q2.d", key: "pathotoxin and vivotoxin", text: "Distinguish between pathotoxin and vivotoxin" },
  { ref: "Img4 Q3.b", key: "monocyclic model and polycyclic model", text: "Differentiate between monocyclic and polycyclic models" }
];

console.log('Checking database matches...\n');

imageQuestions.forEach(imgQ => {
  let matchedQ = null;
  
  // Search for the keyword inside all questions of course 1
  for (const s of course.Sections) {
    for (const t of s.Topics) {
      matchedQ = t.Questions.find(q => {
        const textLower = q.questionText.toLowerCase();
        const keyLower = imgQ.key.toLowerCase();
        return textLower.includes(keyLower);
      });
      if (matchedQ) break;
    }
    if (matchedQ) break;
  }
  
  if (matchedQ) {
    console.log(`[FOUND] ${imgQ.ref} ("${imgQ.text}") is matched in Database as:`);
    console.log(`   -> Q${matchedQ.id}: "${matchedQ.questionText}"`);
  } else {
    console.log(`[MISSING/NEW] ${imgQ.ref} ("${imgQ.text}") could not be matched directly!`);
  }
});
