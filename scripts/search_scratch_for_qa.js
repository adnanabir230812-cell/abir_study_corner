const fs = require('fs');
const path = require('path');

const scratchDir = `C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch`;
const searchFiles = ["human_readable_history.md", "matched_transcripts.md", "search_results.txt"];
const terms = ["Vanderplank", "symplastic", "antagonism", "Narrow brown", "degree of parasitism", "apoplastic", "inocula"];

searchFiles.forEach(file => {
  const filePath = path.join(scratchDir, file);
  if (!fs.existsSync(filePath)) return;
  
  console.log(`\n=================== SEARCHING IN: ${file} ===================`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  terms.forEach(term => {
    let idx = -1;
    while ((idx = content.toLowerCase().indexOf(term.toLowerCase(), idx + 1)) !== -1) {
      console.log(`\n--- Match for '${term}' at index ${idx} ---`);
      // Print context (e.g. 500 characters around it)
      const start = Math.max(0, idx - 100);
      const end = Math.min(content.length, idx + 1200);
      console.log(content.substring(start, end));
      console.log("-------------------------------------------------------");
      
      // Stop after 2 matches of this term to avoid clutter
      break;
    }
  });
});
