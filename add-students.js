const API_BASE_URL = 'http://localhost:5000';

// Add some test students
async function addTestStudents() {
  try {
    console.log('Logging in as admin...');

    // Login
    const loginResponse = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    }

    const token = loginData.token;
    console.log('Login successful');

    // Add some test students
    console.log('Adding test students...');
    for (let i = 1; i <= 5; i++) {
      const response = await fetch(`${API_BASE_URL}/api/admin/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: `Test Student ${i}`
        })
      });

      if (!response.ok) {
        console.error(`Failed to add student ${i}`);
      } else {
        console.log(`Added student ${i}`);
      }
    }

    // Check final count
    const studentsResponse = await fetch(`${API_BASE_URL}/api/admin/students`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const studentsData = await studentsResponse.json();
    console.log(`Total students: ${studentsData.length}`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

addTestStudents();