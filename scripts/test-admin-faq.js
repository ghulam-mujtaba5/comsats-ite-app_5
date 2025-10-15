const http = require('http');

// Test the admin FAQ page data fetching
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/guidance/faq',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const faqs = JSON.parse(data);
      console.log(`Successfully fetched ${faqs.length} FAQ items`);
      console.log('First FAQ item:', faqs[0]);
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();