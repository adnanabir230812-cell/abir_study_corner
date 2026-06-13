const http = require('http');
const app = require('../server');

const PORT = 3006;
let server;

function startServer() {
  return new Promise((resolve) => {
    server = app.listen(PORT, () => {
      resolve();
    });
  });
}

function requestUrl(pathStr) {
  return new Promise((resolve) => {
    http.get(`http://localhost:${PORT}${pathStr}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      resolve(null);
    });
  });
}

async function verify() {
  try {
    await startServer();
    const html = await requestUrl('/courses/2/qa?sec=3');
    
    console.log('MathJax script presence:', html.includes('MathJax-script'));
    
    // Find all occurrences of math indicators
    const matches = [];
    const rx = /\$[^\$]+\$/g;
    let match;
    while ((match = rx.exec(html)) !== null) {
      matches.push(match[0]);
    }
    
    console.log('Found inline math expressions:', matches.length);
    console.log('Samples of inline math:');
    matches.slice(0, 10).forEach(m => console.log('  -', m));
    
    const displayMatches = [];
    const displayRx = /\$\$.*?\$\$/g;
    while ((match = displayRx.exec(html)) !== null) {
      displayMatches.push(match[0]);
    }
    console.log('Found display math expressions:', displayMatches.length);
    console.log('Samples of display math:');
    displayMatches.slice(0, 5).forEach(m => console.log('  -', m));
    
    server.close(() => {
      process.exit(0);
    });
  } catch (error) {
    console.error('Verification failed:', error);
    process.exit(1);
  }
}

verify();
