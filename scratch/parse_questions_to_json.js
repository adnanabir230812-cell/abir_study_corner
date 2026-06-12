const fs = require('fs');
const path = require('path');

const rawPath = path.join(__dirname, 'ecology_questions_raw.md');
if (!fs.existsSync(rawPath)) {
  console.error('ecology_questions_raw.md not found!');
  process.exit(1);
}

const content = fs.readFileSync(rawPath, 'utf8');
const lines = content.split('\n');

const data = {
  courseId: 2,
  courseName: 'Crop Ecology',
  courseCode: '3203',
  sectionId: 4,
  sectionName: 'Section B',
  chapters: []
};

let currentChapter = null;
let currentTopic = null;
let globalTopicId = 1;
let globalQuestionId = 1000; // Start high to avoid conflicts with Pathology

lines.forEach(line => {
  const trimmed = line.trim();
  if (trimmed === '') return;

  if (trimmed.startsWith('Chapter ')) {
    const chMatch = trimmed.match(/Chapter (\d+):\s*(.+)/);
    const num = chMatch ? parseInt(chMatch[1]) : data.chapters.length + 6;
    const name = chMatch ? chMatch[2] : trimmed;
    
    currentChapter = {
      id: num,
      name: name,
      topics: []
    };
    data.chapters.push(currentChapter);
    currentTopic = null;
  } else if (trimmed.startsWith('Topic ')) {
    const topMatch = trimmed.match(/Topic (\d+)\s*—\s*(.+)/);
    const num = topMatch ? parseInt(topMatch[1]) : (currentChapter ? currentChapter.topics.length + 1 : 1);
    const name = topMatch ? topMatch[2] : trimmed;

    currentTopic = {
      id: globalTopicId++,
      localId: num,
      name: name,
      questions: []
    };
    if (currentChapter) {
      currentChapter.topics.push(currentTopic);
    }
  } else if (/^\d+\./.test(trimmed)) {
    // It's a question
    const qMatch = trimmed.match(/^\d+\.\s*(.+?)(?:\s*\[([\d–\.]+)\])?(?:\s*\(([\d\s–,a-zA-Z\(\)]+)\))?$/);
    if (qMatch) {
      const qText = qMatch[1].trim();
      const marks = qMatch[2] ? qMatch[2].trim() : null;
      const years = qMatch[3] ? qMatch[3].trim() : null;

      const question = {
        id: globalQuestionId++,
        questionText: qText,
        marks: marks,
        years: years,
        answerText: ''
      };
      if (currentTopic) {
        currentTopic.questions.push(question);
      }
    }
  }
});

const outPath = path.join(__dirname, 'ecology_questions.json');
fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Successfully parsed question bank to JSON at: ${outPath}`);
console.log(`Parsed Chapters: ${data.chapters.length}`);
let totalTopics = 0;
let totalQs = 0;
data.chapters.forEach(ch => {
  totalTopics += ch.topics.length;
  ch.topics.forEach(t => {
    totalQs += t.questions.length;
  });
});
console.log(`Parsed Topics: ${totalTopics}`);
console.log(`Parsed Questions: ${totalQs}`);
