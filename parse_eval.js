const fs = require('fs');

const data = JSON.parse(fs.readFileSync('step_2507_tool_calls.json', 'utf8'));
const args = data[0].args;
const chunksStr = args.ReplacementChunks;

try {
  // Let's use eval to parse the string since it represents a JS array literal with possible backticks and raw newlines
  const chunks = eval(chunksStr);
  console.log('Successfully evaluated ReplacementChunks! Array size:', chunks.length);
  
  chunks.forEach((chunk, index) => {
    console.log(`\n================== Chunk ${index} ==================`);
    console.log(`StartLine: ${chunk.StartLine}, EndLine: ${chunk.EndLine}`);
    console.log(`TargetContent length: ${chunk.TargetContent.length}`);
    console.log(`ReplacementContent length: ${chunk.ReplacementContent.length}`);
    
    // Save to file
    fs.writeFileSync(`chunk_${index}_replacement.txt`, chunk.ReplacementContent, 'utf8');
    console.log(`Saved chunk_${index}_replacement.txt`);
  });
} catch (err) {
  console.error('Error evaluating ReplacementChunks:', err.message);
}
