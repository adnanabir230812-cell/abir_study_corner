const fs = require('fs');
const path = require('path');

function searchDir(dir, query) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        searchDir(fullPath, query);
      }
    } else {
      if (file.endsWith('.md') || file.endsWith('.txt') || file.endsWith('.json') || file.endsWith('.js')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.toLowerCase().includes(query.toLowerCase())) {
            console.log(`Found "${query}" in: ${fullPath}`);
          }
        } catch (e) {
          // ignore
        }
      }
    }
  });
}

const workspaceDir = path.join(__dirname, '..');
console.log('Searching in workspace:', workspaceDir);
searchDir(workspaceDir, 'bioremediation');
searchDir(workspaceDir, 'ameliorator');
