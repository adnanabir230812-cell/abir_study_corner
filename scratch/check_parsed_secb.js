const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '..', 'extracted_raw_secb');
if (!fs.existsSync(dirPath)) {
  console.log('extracted_raw_secb directory does not exist at ' + dirPath);
  process.exit(1);
}

const files = fs.readdirSync(dirPath);
console.log(`Found ${files.length} files in extracted_raw_secb:`);

files.forEach(file => {
  const filePath = path.join(dirPath, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  console.log(`- ${file}: size=${content.length} bytes, lines=${lines.length}`);
  console.log(`  First 3 lines:`);
  lines.slice(0, 3).forEach(l => console.log(`    ${l}`));
});
