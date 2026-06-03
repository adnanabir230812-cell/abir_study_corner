const fs = require('fs');
const css = fs.readFileSync('C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\toppr\\public\\css\\style.css', 'utf8');

console.log('Checking style.css for markdown list styles...');
const matches = [
  'markdown-content',
  'markdown-content ul',
  'markdown-content ul > li',
  '::before',
  'list-style-type'
];

matches.forEach(m => {
  const index = css.indexOf(m);
  console.log(`- String "${m}" found at index: ${index}`);
});
