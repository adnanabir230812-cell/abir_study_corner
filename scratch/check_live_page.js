const https = require('https');

const checkUrl = (url) => {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log(`- ${url}: Status Code ${res.statusCode}`);
      resolve(res.statusCode);
    }).on('error', (err) => {
      console.log(`- ${url}: Request failed with error "${err.message}"`);
      resolve(500);
    });
  });
};

(async () => {
  console.log('Checking all live routes for Course 1...');
  await checkUrl('https://abirporbe.vercel.app/courses/1');
  await checkUrl('https://abirporbe.vercel.app/courses/1/notes?sectionId=1');
  await checkUrl('https://abirporbe.vercel.app/courses/1/notes?sectionId=2');
  await checkUrl('https://abirporbe.vercel.app/courses/1/qa?sec=1');
  await checkUrl('https://abirporbe.vercel.app/courses/1/qa?sec=2');
  
  console.log('\nChecking all live routes for Course 2 (Crop Ecology)...');
  await checkUrl('https://abirporbe.vercel.app/courses/2');
  await checkUrl('https://abirporbe.vercel.app/courses/2/topics?sectionId=4');
  await checkUrl('https://abirporbe.vercel.app/courses/2/qa?sec=4');
  console.log('Check completed!');
})();
