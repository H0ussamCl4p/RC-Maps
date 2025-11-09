const API_BASE_URL = 'http://localhost:5000';

// Test login and delete all students
async function testDeleteAllStudents() {
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
    console.log('Login successful, token:', token.substring(0, 20) + '...');

    // Check current student count
    console.log('Checking current student count...');
    const studentsResponse = await fetch(`${API_BASE_URL}/api/admin/students`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const studentsData = await studentsResponse.json();
    console.log(`Current students: ${studentsData.length}`);

    // Delete all students
    console.log('Calling delete all students...');
    const deleteResponse = await fetch(`${API_BASE_URL}/api/admin/students/all`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const deleteData = await deleteResponse.json();
    console.log('Delete response status:', deleteResponse.status);
    console.log('Delete response:', deleteData);

    if (!deleteResponse.ok) {
      throw new Error(`Delete failed: ${deleteResponse.status} ${JSON.stringify(deleteData)}`);
    }

    // Wait a bit for the operation to complete
    console.log('Waiting for delete operation to complete...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check student count after deletion
    console.log('Checking student count after deletion...');
    const studentsAfterResponse = await fetch(`${API_BASE_URL}/api/admin/students`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const studentsAfterData = await studentsAfterResponse.json();
    console.log(`Students after deletion: ${studentsAfterData.length}`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testDeleteAllStudents();