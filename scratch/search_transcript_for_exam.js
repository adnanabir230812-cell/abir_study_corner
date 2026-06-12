const fs = require('fs');
const path = require('path');

const transcriptPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\.system_generated\\logs\\transcript.jsonl';

if (fs.existsSync(transcriptPath)) {
  const content = fs.readFileSync(transcriptPath, 'utf8');
  const lines = content.split('\n');
  console.log(`Searching transcript.jsonl (${lines.length} lines)...`);
  lines.forEach((line, idx) => {
    if (line.trim() === '') return;
    try {
      const obj = JSON.parse(line);
      const text = JSON.stringify(obj).toLowerCase();
      if (text.includes('routine') || text.includes('schedule') || text.includes('exam') || text.includes('ecology') || text.includes('date') || text.includes('june') || text.includes('july') || text.includes('routine')) {
        // Log user inputs or model responses that contain this
        if (obj.source === 'USER_EXPLICIT' || obj.type === 'USER_INPUT') {
          console.log(`[Line ${idx+1} - USER] ${obj.content || JSON.stringify(obj.tool_calls)}`);
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
  });
} else {
  console.log(`Transcript not found at ${transcriptPath}`);
}
