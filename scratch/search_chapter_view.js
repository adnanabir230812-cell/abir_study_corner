const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, '..', 'views');
if (fs.existsSync(viewsDir)) {
  const files = fs.readdirSync(viewsDir);
  files.forEach(file => {
    const filePath = path.join(viewsDir, file);
    if (fs.statSync(filePath).isFile()) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.toLowerCase().includes('chapter') || content.toLowerCase().includes('topic')) {
        console.log(`Found in view: ${file}`);
      }
    }
  });
}
