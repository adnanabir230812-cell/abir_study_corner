const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'seed_extension_3205.js');
let code = fs.readFileSync(file, 'utf8');

// We want to find markdown code blocks starting with ``` and replace with \`\`\`
// But we must be careful not to touch valid JS backticks.
// A simple regex to replace three consecutive backticks with three escaped backticks
code = code.replace(/```/g, '\\`\\`\\`');

fs.writeFileSync(file, code, 'utf8');
console.log('Successfully escaped all markdown code block backticks in seed_extension_3205.js!');
