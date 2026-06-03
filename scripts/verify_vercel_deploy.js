const http = require('https');

const url = 'abir-study-corner.vercel.app';
console.log(`Checking deployment status of ${url}...`);

const checkUrl = () => {
  const req = http.request({
    hostname: url,
    port: 443,
    path: '/',
    method: 'GET',
    timeout: 5000
  }, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log('✅ Success! The website is successfully running on Vercel.');
    } else {
      console.log(`⚠️ Status is ${res.statusCode}. Check Vercel logs.`);
    }
  });

  req.on('error', (e) => {
    console.log(`Error: ${e.message}`);
  });

  req.end();
};

// Wait 15 seconds to give Vercel build process time to complete
console.log('Waiting 15 seconds for Vercel build to complete...');
setTimeout(checkUrl, 15000);
