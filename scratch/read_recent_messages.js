const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\.system_generated\\logs\\transcript.jsonl';

async function printRecent() {
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const recent = [];
  for await (const line of rl) {
    try {
      const data = JSON.parse(line);
      if (data.type === 'USER_INPUT' || data.type === 'PLANNER_RESPONSE') {
        recent.push({
          type: data.type,
          content: data.content ? data.content.substring(0, 500) : ''
        });
      }
    } catch (e) {}
  }

  // Print last 100 entries
  const last100 = recent.slice(-100);
  last100.forEach((item, index) => {
    console.log(`[${index + 1}] ${item.type}:`);
    console.log(item.content);
    console.log('-------------------------------------------');
  });
}

printRecent();
