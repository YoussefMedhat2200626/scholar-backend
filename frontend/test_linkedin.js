const https = require('https');

https.get('https://www.linkedin.com/jobs/view/4462140971/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("Status Code:", res.statusCode);
    if (data.includes('No longer accepting applications') || data.includes('Not currently accepting applications')) {
      console.log("Found closed message!");
    } else {
      console.log("Message not found.");
    }
  });
});
