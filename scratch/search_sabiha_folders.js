const fs = require('fs');
const path = require('path');

const searchRoots = [
  'C:\\Users\\Lenovo\\Documents',
  'C:\\Users\\Lenovo\\Downloads',
  'C:\\Users\\Lenovo\\Desktop',
  'C:\\Users\\Lenovo',
  'D:\\',
  'E:\\',
  'F:\\'
];

function findFolder(startDir, targetName) {
  try {
    const items = fs.readdirSync(startDir);
    for (const item of items) {
      const fullPath = path.join(startDir, item);
      let stats;
      try {
        stats = fs.statSync(fullPath);
      } catch (e) {
        continue; // Skip files with permission issues
      }
      
      if (stats.isDirectory()) {
        if (item.toLowerCase() === targetName.toLowerCase()) {
          console.log(`FOUND TARGET FOLDER: ${fullPath}`);
          return fullPath;
        }
        
        // Don't search too deep into system or node_modules directories
        if (['$recycle.bin', 'system volume information', 'node_modules', 'appdata', 'microsoft', 'windows'].includes(item.toLowerCase())) {
          continue;
        }
        
        const found = findFolder(fullPath, targetName);
        if (found) return found;
      }
    }
  } catch (err) {
    // ignore directory read errors
  }
  return null;
}

console.log('Searching for "Sabiha Madame" folder...');
let foundPath = null;
for (const root of searchRoots) {
  if (fs.existsSync(root)) {
    console.log(`Searching in root: ${root}...`);
    foundPath = findFolder(root, 'Sabiha Madame');
    if (foundPath) break;
  }
}

if (foundPath) {
  console.log(`\nSuccessfully located Sabiha Madame at: ${foundPath}`);
  // List the contents of Sabiha Madame / 21 Batch
  const batchPath = path.join(foundPath, '21 Batch');
  if (fs.existsSync(batchPath)) {
    console.log('\nContents of 21 Batch:');
    fs.readdirSync(batchPath).forEach(file => console.log(` - ${file}`));
  } else {
    console.log('\n21 Batch subfolder not found, listing Sabiha Madame:');
    fs.readdirSync(foundPath).forEach(file => console.log(` - ${file}`));
  }
} else {
  console.log('\nFolder "Sabiha Madame" not found. Searching for "21 Batch" direct folder...');
  for (const root of searchRoots) {
    if (fs.existsSync(root)) {
      foundPath = findFolder(root, '21 Batch');
      if (foundPath) break;
    }
  }
  if (foundPath) {
    console.log(`\nSuccessfully located 21 Batch at: ${foundPath}`);
    fs.readdirSync(foundPath).forEach(file => console.log(` - ${file}`));
  } else {
    console.log('\nFailed to locate the folder on common drives.');
  }
}
