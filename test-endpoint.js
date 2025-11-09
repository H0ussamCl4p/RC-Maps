const http = require('http');

// Function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function test() {
  try {
    console.log('Testing login...');
    const loginRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'admin', password: 'admin123' });

    console.log('Login status:', loginRes.status);
    if (loginRes.status !== 200) {
      console.error('Login failed:', loginRes.data);
      return;
    }

    const token = loginRes.data.token;
    console.log('Login successful');

    console.log('Testing delete all students...');
    const deleteRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/students/all',
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });

    console.log('Delete status:', deleteRes.status);
    console.log('Delete response:', deleteRes.data);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();