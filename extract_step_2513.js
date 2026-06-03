const fs = require('fs');
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
      if (data.step_index === 2513) {
        console.log('Found Step 2513!');
        fs.writeFileSync('step_2513_tool_calls.json', JSON.stringify(data.tool_calls, null, 2), 'utf8');
        console.log('Saved tool calls to step_2513_tool_calls.json');
        
        if (data.tool_calls && data.tool_calls[0] && data.tool_calls[0].args) {
          const args = data.tool_calls[0].args;
          console.log('TargetFile:', args.TargetFile);
          console.log('StartLine:', args.StartLine, 'EndLine:', args.EndLine);
          console.log('ReplacementContent length:', args.ReplacementContent ? args.ReplacementContent.length : 0);
          if (args.ReplacementContent) {
            fs.writeFileSync('step_2513_replacement.txt', args.ReplacementContent, 'utf8');
            console.log('Saved step_2513_replacement.txt');
          }
        }
        break;
      }
    } catch (err) {}
  }
}

main();
