const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const ejsPath = path.join(__dirname, '..', 'views', 'course.ejs');
const headerPath = path.join(__dirname, '..', 'views', 'partials', 'header.ejs');
const footerPath = path.join(__dirname, '..', 'views', 'partials', 'footer.ejs');

// Mock data as returned by getCourse
const course = {
  id: 1,
  name: "Plant Pathology",
  code: "3201",
  Sections: [
    {
      id: 1,
      name: "Section A",
      teacherName: "Sabiha Mam",
      totalCount: 72,
      solvedCount: 0,
      percentage: 0,
      analysis: {
        teacher: "Sabiha Mam",
        style: "Conceptual & Mechanism-Oriented",
        desc: "Sabiha Mam focuses heavily...",
        examStructure: "Section A: 4 questions total...",
        teacherPersona: "Sabiha Mam appreciates precise...",
        importantTopics: [
          { name: "Entry Mechanisms", weight: "Critical", typicalQuestions: "...", scoringTips: "..." }
        ],
        chronologicalTrends: ["Trend 1"],
        prepTips: ["Tip 1"]
      }
    },
    {
      id: 2,
      name: "Section B",
      teacherName: "Rezaul Sir",
      totalCount: 82,
      solvedCount: 0,
      percentage: 0,
      analysis: {
        teacher: "Rezaul Sir",
        style: "Structured & Cycle-Oriented",
        desc: "Rezaul Sir's section covers...",
        examStructure: "Section B: 4 questions total...",
        teacherPersona: "Rezaul Sir looks for...",
        importantTopics: [
          { name: "Rice Diseases", weight: "Critical", typicalQuestions: "...", scoringTips: "..." }
        ],
        chronologicalTrends: ["Trend 2"],
        prepTips: ["Tip 2"]
      }
    }
  ]
};

// Mock Express render locals
const locals = {
  title: 'Plant Pathology',
  course: course,
  // Mock include functionality or use paths
  filename: ejsPath
};

try {
  console.log('Compiling EJS template course.ejs...');
  const template = fs.readFileSync(ejsPath, 'utf8');
  
  // We mock the include resolver by substituting mock empty views for header/footer to isolate course.ejs errors
  // EJS supports passing include paths using filename option
  const html = ejs.render(template, locals, { filename: ejsPath });
  console.log('EJS compilation success! No errors.');
} catch (err) {
  console.error('EJS Compilation Error:');
  console.error(err);
}
