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
      if (data.step_index === 2507) {
        console.log('Found Step 2507!');
        fs.writeFileSync('step_2507_tool_calls.json', JSON.stringify(data.tool_calls, null, 2), 'utf8');
        console.log('Saved tool calls to step_2507_tool_calls.json');
        
        // Let's print the replacement content lengths and some snippets
        if (data.tool_calls && data.tool_calls[0] && data.tool_calls[0].args && data.tool_calls[0].args.ReplacementChunks) {
          const chunks = data.tool_calls[0].args.ReplacementChunks;
          console.log('Chunks count:', chunks.length);
          chunks.forEach((chunk, i) => {
            console.log(`Chunk ${i}: StartLine=${chunk.StartLine}, EndLine=${chunk.EndLine}`);
            console.log(`  ReplacementContent length: ${chunk.ReplacementContent.length}`);
            fs.writeFileSync(`chunk_${i}_content.txt`, chunk.ReplacementContent, 'utf8');
            console.log(`  Saved to chunk_${i}_content.txt`);
          });
        }
        break;
      }
    } catch (err) {}
  }
}

main();
