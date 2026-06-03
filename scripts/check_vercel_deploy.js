const http = require('https');

const urls = [
  'abir-study-corner.vercel.app',
  'abir-study-corner-adnanabir230812-cell.vercel.app',
  'abir-study-corner-adnanabir230812-cells-projects.vercel.app'
];

console.log('Pinging potential Vercel deployment URLs...');

urls.forEach(url => {
  const req = http.request({
    hostname: url,
    port: 443,
    path: '/',
    method: 'GET',
    timeout: 3000
  }, (res) => {
    console.log(`- ${url}: Responded with status code ${res.statusCode}`);
  });

  req.on('error', (e) => {
    console.log(`- ${url}: Failed with error "${e.message}"`);
  });

  req.on('timeout', () => {
    req.destroy();
    console.log(`- ${url}: Request timed out`);
  });

  req.end();
});
