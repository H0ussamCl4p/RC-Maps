// Test delete all students endpoint
const https = require('http');

// Step 1: Login
const loginData = JSON.stringify({
  username: 'admin',
  password: 'admin123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/admin/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

console.log('Step 1: Logging in...');
const loginReq = https.request(loginOptions, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Login response:', data);
    const loginResult = JSON.parse(data);
    const token = loginResult.token;
    
    if (!token) {
      console.error('Failed to get token');
      process.exit(1);
    }
    
    console.log('Got token:', token.substring(0, 20) + '...');
    
    // Step 2: Delete all students
    console.log('\nStep 2: Deleting all students...');
    const deleteOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/students/all',
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    const deleteReq = https.request(deleteOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Delete response status:', res.statusCode);
        console.log('Delete response:', data);
        
        // Step 3: Verify count
        setTimeout(() => {
          console.log('\nStep 3: Verifying count...');
          const countOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/admin/students/count',
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          };
          
          const countReq = https.request(countOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
              console.log('Count response:', data);
              process.exit(0);
            });
          });
          
          countReq.on('error', (e) => {
            console.error('Count request error:', e);
            process.exit(1);
          });
          
          countReq.end();
        }, 1000);
      });
    });
    
    deleteReq.on('error', (e) => {
      console.error('Delete request error:', e);
      process.exit(1);
    });
    
    deleteReq.end();
  });
});

loginReq.on('error', (e) => {
  console.error('Login request error:', e);
  process.exit(1);
});

loginReq.write(loginData);
loginReq.end();
