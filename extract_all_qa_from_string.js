const fs = require('fs');

const data = JSON.parse(fs.readFileSync('step_2507_tool_calls.json', 'utf8'));
const args = data[0].args;
const chunksStr = args.ReplacementChunks;

console.log('chunksStr length:', chunksStr.length);

// Let's write the entire chunksStr as a text file so we can view it, search it, or inspect it easily!
fs.writeFileSync('step_2507_raw_string.txt', chunksStr, 'utf8');
console.log('Saved step_2507_raw_string.txt');

// Let's write a robust parser to find all occurrences of Question.create
// Each Question.create has:
// questionText: '...' or "[...]" or `...`
// answerText: `...`

let index = 0;
let qCount = 0;
while (true) {
  index = chunksStr.indexOf('Question.create', index);
  if (index === -1) break;
  
  console.log(`\n--- Question Found at index ${index} ---`);
  // Let's print the next 2000 characters from here
  const snippet = chunksStr.substring(index, index + 2000);
  console.log(snippet.substring(0, snippet.indexOf('});') + 3 || 1000));
  console.log('========================================');
  
  index += 15;
  qCount++;
}
console.log(`Total questions found: ${qCount}`);
