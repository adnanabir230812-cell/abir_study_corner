const fs = require('fs');
const path = require('path');

const popContent = fs.readFileSync(path.join(__dirname, 'populate_all_99_questions.js'), 'utf8');
const rawQuestionsPath = path.join(__dirname, 'debesh_questions_raw.md');
const rawContent = fs.readFileSync(rawQuestionsPath, 'utf8');
const rawLines = rawContent.split('\n');

const chapterRx = /^Chapter\s+(\d+):\s+(.*)$/i;
const qRx = /^(\d+)\.\s+(.*?)(?:\s+\[([\d+=.]+)\])?(?:\s+\((\d{4}(?:-\d{2})?)\))?$/;

const rawQuestions = [];
let currentChapter = 'Chapter 1';

rawLines.forEach(line => {
  const trimmed = line.trim();
  if (!trimmed) return;

  const chapMatch = trimmed.match(chapterRx);
  if (chapMatch) {
    currentChapter = `Chapter ${chapMatch[1]}: ${chapMatch[2].trim()}`;
    return;
  }

  const qMatch = trimmed.match(qRx);
  if (qMatch) {
    rawQuestions.push({
      chapter: currentChapter,
      num: parseInt(qMatch[1]),
      text: qMatch[2].trim(),
      raw: trimmed
    });
  }
});

const vm = require('vm');
const sandbox = { console, module: { exports: {} }, require, __dirname: path.join(__dirname, '..', 'scratch'), path };
vm.createContext(sandbox);
vm.runInContext(popContent, sandbox);

const getTopicId = sandbox.getTopicId;
const getSolvedAnswer = sandbox.getSolvedAnswer;

console.log('Testing all 99 questions sequentially...');
let undefCount = 0;
rawQuestions.forEach((q, idx) => {
  const topicId = getTopicId(q);
  const ans = getSolvedAnswer(q);
  if (!ans) {
    console.log(`❌ Q [${idx+1}] (ID in DB: ${2000+idx+1}): "${q.text}" -> Topic: ${topicId}, Answer: UNDEFINED/NULL`);
    undefCount++;
  }
});

console.log(`Test complete. Undefined answers: ${undefCount}`);
process.exit(undefCount > 0 ? 1 : 0);
