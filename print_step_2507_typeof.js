const fs = require('fs');

const data = JSON.parse(fs.readFileSync('step_2507_tool_calls.json', 'utf8'));
const args = data[0].args;
console.log('Type of ReplacementChunks:', typeof args.ReplacementChunks);
let chunks = args.ReplacementChunks;
if (typeof chunks === 'string') {
  try {
    chunks = JSON.parse(chunks);
    console.log('Successfully parsed string to array!');
  } catch (err) {
    console.error('Failed to parse string to array:', err.message);
  }
}

if (Array.isArray(chunks)) {
  console.log('Parsed Chunks count:', chunks.length);
  chunks.forEach((chunk, index) => {
    console.log(`\nChunk ${index}: StartLine=${chunk.StartLine}, EndLine=${chunk.EndLine}`);
    console.log(`  TargetContent snippet: ${chunk.TargetContent.substring(0, 100)}...`);
    console.log(`  ReplacementContent length: ${chunk.ReplacementContent.length}`);
    fs.writeFileSync(`chunk_${index}_content.txt`, chunk.ReplacementContent, 'utf8');
    console.log(`  Saved to chunk_${index}_content.txt`);
  });
} else {
  console.log('Chunks is still not an array:', chunks);
}
