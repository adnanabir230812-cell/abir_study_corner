const fs = require('fs');

const data = JSON.parse(fs.readFileSync('step_764_tool_calls.json', 'utf8'));
console.log('Tool call name:', data[0].name);
const args = data[0].args;
console.log('Target file:', args.TargetFile);
console.log('Instruction:', args.Instruction);

if (args.ReplacementChunks) {
  console.log('Number of chunks:', args.ReplacementChunks.length);
  args.ReplacementChunks.forEach((chunk, index) => {
    console.log(`\n--- Chunk ${index} (Lines ${chunk.StartLine} to ${chunk.EndLine}) ---`);
    console.log('Target content snippet:', chunk.TargetContent.substring(0, 100) + '...');
    console.log('Replacement content length:', chunk.ReplacementContent.length);
    // Let's write each chunk's replacement content to a separate file so we can read it easily!
    fs.writeFileSync(`chunk_${index}_replacement.txt`, chunk.ReplacementContent, 'utf8');
    console.log(`Saved chunk_${index}_replacement.txt`);
  });
}
