const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\.system_generated\\logs\\transcript.jsonl';

if (!fs.existsSync(transcriptPath)) {
  console.log(`Transcript not found at: ${transcriptPath}`);
  process.exit(1);
}

const keywords = ['ecology', '3203', 'ct', 'test', 'class'];

async function search() {
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineNumber = 0;
  for await (const line of rl) {
    lineNumber++;
    try {
      const data = JSON.parse(line);
      if (data.type === 'USER_INPUT') {
        const text = data.content || '';
        const match = keywords.some(kw => text.toLowerCase().includes(kw.toLowerCase()));
        if (match) {
          console.log(`=== User Message at Line ${lineNumber} (Step ${data.step_index}) ===`);
          console.log(text);
          console.log('-------------------------------------------\n');
        }
      }
    } catch (e) {
      // ignore JSON parse errors
    }
  }
}

search();
