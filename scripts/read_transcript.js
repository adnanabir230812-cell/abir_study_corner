const fs = require('fs');
const readline = require('readline');
const path = require('path');

const transcriptPath = `C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\.system_generated\\logs\\transcript.jsonl`;

async function main() {
  if (!fs.existsSync(transcriptPath)) {
    console.error("Transcript file not found at " + transcriptPath);
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
      
      // Look for steps containing question lists or image details
      if (content.includes("2012-2013") || content.includes("Page 1") || content.includes("pathology_q_page") || content.includes("mixed_2025")) {
        console.log(`Step ${data.step_index}:`);
        console.log(content.substring(0, 1000));
        console.log("----------------------------------------\n");
      }
    } catch (err) {
      // ignore parsing errors
    }
  }
}

main();
