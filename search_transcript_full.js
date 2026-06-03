const fs = require('fs');
const path = require('path');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\.system_generated\\logs\\transcript.jsonl';

async function main() {
  if (!fs.existsSync(transcriptPath)) {
    console.error('Transcript not found at ' + transcriptPath);
    return;
  }
  
  console.log('Reading transcript.jsonl...');
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let matchCount = 0;
  for await (const line of rl) {
    if (line.includes('qA27') || line.includes('qB14') || line.includes('disease tetrahedron') || line.includes('field sanitation') || line.includes('loose smut of wheat')) {
      // Parse JSON line
      try {
        const data = JSON.parse(line);
        console.log(`\n================== Match in Step ${data.step_index} (${data.type}) ==================`);
        // If there is tool_calls, print them!
        if (data.tool_calls) {
          console.log('Tool calls count:', data.tool_calls.length);
          data.tool_calls.forEach((tc, i) => {
            const tcStr = JSON.stringify(tc, null, 2);
            if (tcStr.includes('qA27') || tcStr.includes('qB14') || tcStr.includes('field sanitation')) {
              console.log(`\nTool call ${i}: name=${tc.name}`);
              console.log(tcStr.substring(0, 4000));
            }
          });
        }
        
        const content = data.content || '';
        if (content.includes('qA27') || content.includes('qB14') || content.includes('field sanitation')) {
          console.log('\nContent snippet:');
          console.log(content.substring(0, 4000));
        }
        
        matchCount++;
        if (matchCount > 5) {
          console.log('\nStopping after 5 matches to avoid overwhelming output.');
          break;
        }
      } catch (err) {
        console.error('Error parsing line:', err.message);
      }
    }
  }
  console.log('Search done!');
}

main();
