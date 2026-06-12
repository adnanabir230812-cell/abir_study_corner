const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\.system_generated\\logs\\transcript.jsonl';

async function printRecent() {
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineNumber = 0;
  for await (const line of rl) {
    lineNumber++;
    if (lineNumber > 4928) {
      try {
        const data = JSON.parse(line);
        if (data.type === 'USER_INPUT') {
          console.log(`=== User Message at Line ${lineNumber} ===`);
          console.log(data.content);
          console.log('-------------------------------------------\n');
        }
      } catch (e) {}
    }
  }
}

printRecent();
