const fs = require('fs');
const readline = require('readline');
const path = require('path');

const transcriptPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\.system_generated\\logs\\transcript.jsonl';

if (!fs.existsSync(transcriptPath)) {
  console.log(`Transcript not found at: ${transcriptPath}`);
  process.exit(1);
}

const keywords = ['CT1', 'Class Test', 'CT 1', 'CT-1'];

async function search() {
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineNumber = 0;
  for await (const line of rl) {
    lineNumber++;
    const match = keywords.some(kw => line.toLowerCase().includes(kw.toLowerCase()));
    if (match) {
      // Print first 500 chars of the line to avoid flooding output
      console.log(`Line ${lineNumber} matches:`);
      console.log(line.substring(0, 500) + '...\n');
    }
  }
}

search();
