const https = require('https');

const options = {
  hostname: 'abirporbe.vercel.app',
  port: 443,
  path: '/',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
};

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Body snippet (first 1000 chars):');
    console.log(body.substring(0, 1000));
  });
});

req.on('error', (e) => {
  console.error('Request Error:', e);
});

req.end();
