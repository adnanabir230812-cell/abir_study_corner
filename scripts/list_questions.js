const fs = require('fs');
const path = require('path');

const dir = 'E:\\Abir study\\3.2 1st Part\\3.2 1st Part\\1. Questions';
if (fs.existsSync(dir)) {
  console.log(`Contents of ${dir}:`);
  fs.readdirSync(dir).forEach(file => {
    console.log(`  - ${file}`);
  });
} else {
  console.log(`Directory does not exist: ${dir}`);
}
