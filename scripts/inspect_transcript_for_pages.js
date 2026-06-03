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
      if (content.includes("page_1") || content.includes("page_2") || content.includes("page_3") || content.includes("page_4") || content.includes("page_5")) {
        if (content.includes("Pathology") || content.includes("Question") || content.includes("questionText")) {
          console.log(`Step ${data.step_index}:`);
          console.log(content.substring(0, 1500));
          console.log("========================================\n");
        }
      }
    } catch (err) {}
  }
}
main();
