const fs = require('fs');
const path = require('path');

const rawPath = `C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch\\classtest_answers_raw.txt`;

if (!fs.existsSync(rawPath)) {
  console.error("rawPath does not exist!");
  process.exit(1);
}

const content = fs.readFileSync(rawPath, 'utf8');
const lines = content.split('\n');

console.log(`Total lines: ${lines.length}`);
console.log(`Total bytes: ${content.length}`);

// Let's print occurrences of key terms to see if the missing solutions are in there
const terms = ["Vanderplank's Equivalence", "Victorin", "symplastic", "antagonism", "Narrow brown leaf spot", "degree of parasitism"];
terms.forEach(term => {
  const count = (content.match(new RegExp(term, 'gi')) || []).length;
  console.log(`- '${term}': ${count} occurrences`);
});
