const fs = require('fs');
const path = require('path');

const baseDir = 'E:\\Abir study';

function searchFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      searchFiles(fullPath);
    } else {
      const lower = file.toLowerCase();
      if (lower.includes('routine') || lower.includes('schedule') || lower.includes('exam') || lower.includes('program') || lower.includes('time') || lower.includes('date') || lower.includes('calendar')) {
        console.log(`Found: ${fullPath} (${stats.size} bytes)`);
      }
    }
  });
}

console.log('--- Searching for routine/schedule files in E:\\Abir study ---');
searchFiles(baseDir);
console.log('--- Search complete ---');
