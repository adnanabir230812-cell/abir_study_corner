const fs = require('fs');

const data = JSON.parse(fs.readFileSync('step_2507_tool_calls.json', 'utf8'));
console.log('Tool call count:', data.length);
if (data[0]) {
  console.log('Tool name:', data[0].name);
  const args = data[0].args;
  console.log('TargetFile:', args.TargetFile);
  if (args.ReplacementChunks) {
    console.log('Chunks count:', args.ReplacementChunks.length);
    args.ReplacementChunks.forEach((chunk, index) => {
      console.log(`Chunk ${index}: StartLine=${chunk.StartLine}, EndLine=${chunk.EndLine}`);
      console.log(`  TargetContent snippet: ${chunk.TargetContent.substring(0, 150)}...`);
      console.log(`  ReplacementContent length: ${chunk.ReplacementContent.length}`);
      fs.writeFileSync(`chunk_${index}_content.txt`, chunk.ReplacementContent, 'utf8');
      console.log(`  Saved to chunk_${index}_content.txt`);
    });
  }
}
