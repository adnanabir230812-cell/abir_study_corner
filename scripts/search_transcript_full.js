const fs = require('fs');
const readline = require('readline');

const transcriptPath = `C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\.system_generated\\logs\\transcript.jsonl`;

async function main() {
  if (!fs.existsSync(transcriptPath)) {
    console.error("Transcript file not found");
    return;
  }
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    try {
      const data = JSON.parse(line);
      const content = data.content || "";
      if (!content) continue;
      
      // Look for large texts containing question scans / OCR results
      if (content.length > 500 && (content.includes("180830") || content.includes("180837") || content.includes("Sabiha") || content.includes("Rezaul") || content.includes("AT-3201") || content.includes("AT 3201"))) {
        if (!content.includes("search_transcript_full.js") && !content.includes("seed_pathology.js")) {
          console.log(`=== Step ${data.step_index} (${data.type}, source: ${data.source}) ===`);
          console.log(content.substring(0, 2000));
          console.log("\n----------------------------------------\n");
        }
      }
    } catch (err) {}
  }
}
main();
