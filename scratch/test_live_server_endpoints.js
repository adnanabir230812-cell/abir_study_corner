const http = require('http');
const app = require('../server');

const PORT = 3005;
let server;

function startServer() {
  return new Promise((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`Test server started on port ${PORT}`);
      resolve();
    });
  });
}

function requestUrl(pathStr) {
  return new Promise((resolve) => {
    http.get(`http://localhost:${PORT}${pathStr}`, (res) => {
      console.log(`- GET ${pathStr}: Status Code ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, bodyLength: data.length });
      });
    }).on('error', (err) => {
      console.log(`- GET ${pathStr}: Failed with error "${err.message}"`);
      resolve({ statusCode: 500, error: err.message });
    });
  });
}

async function runTests() {
  try {
    await startServer();
    
    console.log('\nRunning endpoint tests...');
    
    const results = [];
    results.push(await requestUrl('/'));
    results.push(await requestUrl('/courses/2'));
    results.push(await requestUrl('/courses/2/topics?sectionId=3'));
    results.push(await requestUrl('/courses/2/topics?sectionId=4'));
    results.push(await requestUrl('/courses/2/qa?sec=3'));
    results.push(await requestUrl('/courses/2/qa?sec=4'));
    
    console.log('\nClosing server...');
    server.close(() => {
      console.log('Test server stopped.');
      
      const allPassed = results.every(r => r.statusCode === 200);
      if (allPassed) {
        console.log('\n✅ ALL ENDPOINT TESTS PASSED SUCCESSFULLY!');
        process.exit(0);
      } else {
        console.error('\n❌ SOME ENDPOINT TESTS FAILED!');
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

runTests();
