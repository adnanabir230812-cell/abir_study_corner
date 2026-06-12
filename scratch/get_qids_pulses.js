const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pathology_qa_reference.md');
const content = fs.readFileSync(filePath, 'utf8');

const rxList = [197, 207, 206, 306, 201];

rxList.forEach(id => {
  const rx = new RegExp(`#### Q\\[ID: ${id}\\]\\.(.*?)\\n\\n\\*\\*Answer:\\*\\*\\n([\\s\\S]*?)(?=\\n---\\n|\\n### Topic:|$)`, 'g');
  let match = rx.exec(content);
  if (match) {
    console.log(`\n================ QID ${id} ================`);
    console.log(`Question: ${match[1].trim()}`);
    console.log(`Answer:\n${match[2].trim()}`);
  } else {
    console.log(`QID ${id} not found!`);
  }
});
