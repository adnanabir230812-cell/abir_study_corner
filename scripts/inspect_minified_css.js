const fs = require('fs');
const path = require('path');
const cssPath = path.join(__dirname, '../public/css/style.css');
const css = fs.readFileSync(cssPath, 'utf8');

console.log('Searching for minified CSS occurrences...');
const regexes = [
  /\.markdown-content\s*ul/,
  /\.markdown-content\s*ul\s*>\s*li/,
  /li:before|li::before/,
  /markdown-content/
];

regexes.forEach(r => {
  const match = css.match(r);
  if (match) {
    console.log(`- Match found for ${r}: "${match[0]}" at position ${match.index}`);
  } else {
    console.log(`- No match found for ${r}`);
  }
});

// Print a portion of style.css near ".markdown-content"
const idx = css.indexOf('.markdown-content');
if (idx !== -1) {
  console.log('\nSample CSS around .markdown-content:');
  console.log(css.substring(idx, idx + 1000));
}
