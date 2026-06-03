const fs = require('fs');
const path = require('path');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\.system_generated\\logs\\transcript.jsonl';

async function main() {
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  for await (const line of rl) {
    try {
      const data = JSON.parse(line);
      if (data.step_index === 764) {
        console.log(`Found step 764!`);
        console.log('Type:', data.type);
        console.log('Source:', data.source);
        if (data.tool_calls) {
          console.log('Tool calls count:', data.tool_calls.length);
          fs.writeFileSync('step_764_tool_calls.json', JSON.stringify(data.tool_calls, null, 2), 'utf8');
          console.log('Saved tool calls to step_764_tool_calls.json');
        }
        break;
      }
    } catch (err) {}
  }
}

main();
