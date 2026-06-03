const fs = require('fs');
const readline = require('readline');

const transcriptPath = `C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\.system_generated\\logs\\transcript.jsonl`;

async function main() {
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    try {
      const data = JSON.parse(line);
      const content = data.content || "";
      if (content.includes("2012-2013") && (content.includes("Define") || content.includes("Causal") || content.includes("symptom"))) {
        console.log(`Step ${data.step_index}:`);
        console.log(content.substring(0, 2000));
        console.log("========================================\n");
      }
    } catch (err) {}
  }
}
main();
