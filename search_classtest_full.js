const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch\\classtest_full.md';
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`classtest_full.md size: ${content.length}`);
  
  // Let's print occurrences of 'Q1' or 'Question' or similar headers
  const terms = ['Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5', 'Section A', 'Section B'];
  terms.forEach(term => {
    let idx = 0;
    while ((idx = content.indexOf(term, idx)) !== -1) {
      console.log(`Found "${term}" at index ${idx}`);
      console.log(content.substring(idx, idx + 400));
      console.log('----------------------------------------');
      idx += term.length + 400;
    }
  });
} else {
  console.log('File not found!');
}
