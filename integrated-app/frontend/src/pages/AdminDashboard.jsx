import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, Trophy, Plus, Download, Trash2, LogOut, RefreshCw, BarChart3, UserPlus, Heart } from 'lucide-react';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('clubs'); // 'clubs', 'students', 'stats'
  const [clubs, setClubs] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [stands, setStands] = useState([]);
  const [loading, setLoading] = useState(false);

  // Club form
  const [clubName, setClubName] = useState('');
  const [clubDescription, setClubDescription] = useState('');
  
  // Student form
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  
  // Bulk forms
  const [bulkStudents, setBulkStudents] = useState('');
  const [bulkClubs, setBulkClubs] = useState('');

  // Batch generation
  const [batchCount, setBatchCount] = useState('10');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    fetchClubs();
    fetchStudents();
    fetchStats();
    fetchStands();
  }, []);

  const API_BASE_URL = 'http://localhost:5000';
  
  const axiosConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
  });

  const fetchClubs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/clubs`);
      setClubs(response.data);
    } catch (err) {
      console.error('Error fetching clubs:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/students`, axiosConfig());
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching students:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/admin/login');
      }
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/statistics`, axiosConfig());
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchStands = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/stands`);
      setStands(response.data);
    } catch (err) {
      console.error('Error fetching stands:', err);
    }
  };

  const handleAssignStand = async (clubId, standId) => {
    try {
      await axios.put(`${API_BASE_URL}/api/admin/clubs/${clubId}/stand`, { stand_id: standId }, axiosConfig());
      fetchClubs();
      alert('Stand assigned successfully!');
    } catch (err) {
      alert('Failed to assign stand');
    }
  };

  const handleAddClub = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/api/admin/clubs`, {
        name: clubName,
        description: clubDescription
      }, axiosConfig());
      
      setClubName('');
      setClubDescription('');
      fetchClubs();
      alert('Club added successfully!');
    } catch (err) {
      alert('Failed to add club');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClub = async (id) => {
    if (!confirm('Are you sure you want to delete this club?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/clubs/${id}`, axiosConfig());
      fetchClubs();
      alert('Club deleted successfully!');
    } catch (err) {
      alert('Failed to delete club');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin/students`, {
        name: studentName
      }, axiosConfig());
      
      setStudentName('');
      fetchStudents();
      
      // Show the generated ticket code
      alert(`Student added!\nTicket Code: ${response.data.ticket_code}`);
    } catch (err) {
      alert('Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAddStudents = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Parse CSV format: name,class (class is optional)
      const lines = bulkStudents.trim().split('\n');
      const studentsList = lines
        .filter(line => line.trim())
        .map(line => {
          const parts = line.split(',').map(s => s.trim());
          const name = parts[0];
          const studentClass = parts[1] || null; // class is optional
          return { name, class: studentClass };
        });

      const response = await axios.post(`${API_BASE_URL}/api/admin/students/bulk`, {
        students: studentsList
      }, axiosConfig());
      
      setBulkStudents('');
      fetchStudents();
      alert(`Added ${response.data.count} students successfully!`);
    } catch (err) {
      alert('Failed to add students');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAddClubs = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Parse CSV format: name,description
      const lines = bulkClubs.trim().split('\n');
      const clubsList = lines
        .filter(line => line.trim())
        .map(line => {
          const [name, description] = line.split(',').map(s => s.trim());
          return { name, description: description || '' };
        });

      const response = await axios.post(`${API_BASE_URL}/api/admin/clubs/bulk`, {
        clubs: clubsList
      }, axiosConfig());
      
      setBulkClubs('');
      fetchClubs();
      alert(`Added ${response.data.count} clubs successfully!`);
    } catch (err) {
      alert('Failed to add clubs');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const count = parseInt(batchCount);
      if (count < 1 || count > 50) {
        alert('Please enter a count between 1 and 50');
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/api/admin/students/batch-generate`, {
        count
      }, axiosConfig());
      
      setBatchCount('10');
      fetchStudents();
      alert(`Generated ${response.data.count} student tickets successfully!`);
    } catch (err) {
      alert('Failed to generate student tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchGenerateAndPrint = async () => {
    setLoading(true);

    try {
      const count = parseInt(batchCount);
      if (count < 1 || count > 50) {
        alert('Please enter a count between 1 and 50');
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/api/admin/students/batch-generate`, {
        count
      }, axiosConfig());
      
      setBatchCount('10');
      fetchStudents();

      // Print all generated tickets
      const students = response.data.students;
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>ENSAM Event Tickets</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .ticket { border: 2px solid #333; padding: 15px; margin: 10px; width: 350px; display: inline-block; vertical-align: top; page-break-inside: avoid; }
              .qr-code { margin: 10px 0; text-align: center; }
              .code { font-size: 18px; font-weight: bold; letter-spacing: 2px; margin: 8px 0; text-align: center; }
              .info { margin: 8px 0; text-align: center; }
              .page-break { page-break-before: always; }
              @media print { .no-print { display: none; } }
            </style>
          </head>
          <body>
            <h1 style="text-align: center;">ENSAM Event Tickets</h1>
      `);

      students.forEach((student, index) => {
        if (index > 0 && index % 6 === 0) {
          printWindow.document.write('<div class="page-break"></div>');
        }
        printWindow.document.write(`
          <div class="ticket">
            <h2>ENSAM Event Ticket</h2>
            <div class="info">
              <strong>Name:</strong> ${student.name}<br>
              <strong>Class:</strong> ${student.class || 'N/A'}
            </div>
            <div class="code">${student.ticket_code}</div>
            <div class="qr-code">
              <img src="${student.qr_code}" alt="QR Code" style="max-width: 120px;">
            </div>
            <p style="text-align: center; font-size: 12px;">Present this ticket at the voting station</p>
          </div>
        `);
      });

      printWindow.document.write(`
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
      `);
      printWindow.document.close();

      alert(`Generated and opened print window for ${response.data.count} student tickets!`);
    } catch (err) {
      alert('Failed to generate student tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/students/${id}`, axiosConfig());
      fetchStudents();
      alert('Student deleted successfully!');
    } catch (err) {
      alert('Failed to delete student');
    }
  };

  const handlePrintSingleTicket = (student) => {
    const printWindow = window.open('', '_blank');
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Student Ticket - ${student.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
          .ticket { 
            border: 2px solid #333;
            padding: 20px;
            margin: 20px auto;
            max-width: 400px;
          }
          .qr-code { max-width: 200px; margin: 15px auto; }
          h2 { margin: 10px 0; }
          .info { margin: 10px 0; }
          .code { 
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
            font-family: monospace;
            margin: 15px 0;
          }
          @media print {
            body { padding: 0; }
            .ticket { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <h2>ENSAM Event Ticket</h2>
          <div class="info">
            <strong>Name:</strong> ${student.name}<br>
            <strong>Class:</strong> ${student.class || 'N/A'}
          </div>
          <div class="code">${student.ticket_code}</div>
          <img src="${student.qr_code}" class="qr-code" />
          <p style="font-size: 12px; color: #666;">Present this ticket at the voting station</p>
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleExportQRCodes = () => {
    const printWindow = window.open('', '_blank');
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Student Tickets</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .ticket { 
            page-break-inside: avoid;
            border: 2px solid #333;
            padding: 20px;
            margin: 10px 0;
            text-align: center;
          }
          .qr-code { max-width: 200px; margin: 10px auto; }
          h3 { margin: 10px 0; }
          .code { 
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
            font-family: monospace;
          }
          @media print {
            .ticket { page-break-after: always; }
          }
        </style>
      </head>
      <body>
        <h1 style="text-align: center;">School Voting System - Student Tickets</h1>
        ${students.map(student => `
          <div class="ticket">
            <h3>${student.name}</h3>
            <p>Class: ${student.class || 'N/A'}</p>
            <img src="${student.qr_code}" class="qr-code" />
            <div class="code">${student.ticket_code}</div>
            <p style="font-size: 12px; color: #666;">Scan QR code or enter code to vote</p>
          </div>
        `).join('')}
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const handleResetVotes = async () => {
    if (!confirm('Are you sure you want to reset ALL votes? This cannot be undone!')) return;

    try {
      await axios.post(`${API_BASE_URL}/api/admin/reset-votes`, {}, axiosConfig());
      fetchClubs();
      fetchStudents();
      fetchStats();
      alert('All votes have been reset!');
    } catch (err) {
      alert('Failed to reset votes');
    }
  };

  const handleDeleteAllClubs = async () => {
    if (!confirm('Are you sure you want to delete ALL clubs? This will also unassign all stands and cannot be undone!')) return;

    setLoading(true);
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/admin/clubs/all`, axiosConfig());
      // Optimistically clear UI, then refetch to confirm
      setClubs([]);
      fetchStats();
      fetchClubs();
      const deletedCount = res.data?.deleted?.clubs;
      alert(`All clubs have been deleted${typeof deletedCount === 'number' ? ` (deleted: ${deletedCount})` : ''}!`);
    } catch (err) {
      alert('Failed to delete all clubs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllStudents = async () => {
    if (!confirm('Are you sure you want to delete ALL students? This will also reset all votes and cannot be undone!')) return;

    setLoading(true);
    try {
      console.log('Calling delete all students API...');
      const response = await axios.delete(`${API_BASE_URL}/api/admin/students/all`, axiosConfig());
      console.log('Delete response:', response);
      // Optimistically clear UI, then refetch to confirm
      setStudents([]);
      fetchStats();
      await fetchStudents();
      const deletedStudents = response.data?.deleted?.students;
      const deletedVotes = response.data?.deleted?.votes;
      const detail =
        typeof deletedStudents === 'number'
          ? ` (deleted students: ${deletedStudents}${typeof deletedVotes === 'number' ? `, deleted votes: ${deletedVotes}` : ''})`
          : '';
      alert(`All students have been deleted${detail}!`);
    } catch (err) {
      console.error('Delete error:', err);
      console.error('Error response:', err.response);
      alert('Failed to delete all students: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 p-4 py-6 sm:py-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg mb-4 sm:mb-6 border-t-4 border-red-600">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tableau de Bord Admin</h1>
              <p className="text-sm sm:text-base text-gray-700 font-medium mt-1">Bienvenue, {localStorage.getItem('adminUsername')}</p>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate('/results')}
                className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-initial font-semibold shadow-md"
              >
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Voir Résultats</span>
                <span className="sm:hidden">Résultats</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-initial font-semibold shadow-md"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Déconnexion</span>
                <span className="sm:hidden">Sortir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border-l-4 border-red-600">
              <p className="text-gray-600 text-xs sm:text-sm font-semibold">Total Étudiants</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">{stats.totalStudents}</p>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border-l-4 border-green-600">
              <p className="text-gray-600 text-xs sm:text-sm font-semibold">Ont Voté</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.votedStudents}</p>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border-l-4 border-red-500">
              <p className="text-gray-600 text-xs sm:text-sm font-semibold">Total Clubs</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-500">{stats.totalClubs}</p>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border-l-4 border-green-500">
              <p className="text-gray-600 text-xs sm:text-sm font-semibold">Taux de Participation</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-500">{stats.votingPercentage}%</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-green-600">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('clubs')}
              className={`flex-1 min-w-[120px] px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base ${
                activeTab === 'clubs'
                  ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
              Clubs
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex-1 min-w-[120px] px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base ${
                activeTab === 'students'
                  ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
              Students
            </button>
          </div>

          <div className="p-4 sm:p-6">
            {/* Clubs Tab */}
            {activeTab === 'clubs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Manage Clubs</h2>
                  <button
                    onClick={handleDeleteAllClubs}
                    disabled={clubs.length === 0 || loading}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete All Clubs
                  </button>
                </div>
                
                {/* Add Club Form */}
                <form onSubmit={handleAddClub} className="bg-gray-50 p-6 rounded-xl mb-6">
                  <h3 className="font-bold text-gray-800 mb-4">Add New Club</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      value={clubName}
                      onChange={(e) => setClubName(e.target.value)}
                      placeholder="Club Name"
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      value={clubDescription}
                      onChange={(e) => setClubDescription(e.target.value)}
                      placeholder="Description"
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300"
                  >
                    <Plus className="w-5 h-5" />
                    Add Club
                  </button>
                </form>

                {/* Bulk Add Clubs Form */}
                <form onSubmit={handleBulkAddClubs} className="bg-blue-50 p-6 rounded-xl mb-6">
                  <h3 className="font-bold text-gray-800 mb-4">Bulk Import Clubs (CSV)</h3>
                  <div className="mb-4">
                    <textarea
                      value={bulkClubs}
                      onChange={(e) => setBulkClubs(e.target.value)}
                      placeholder="Enter clubs in CSV format (one per line):&#10;Club Name,Description&#10;Robotics Club,Learn about robots&#10;Art Club,Painting and drawing&#10;Science Club,Experiments and discoveries"
                      rows={6}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-mono text-sm"
                      required
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      Format: <code className="bg-gray-100 px-1 rounded">Club Name,Description</code> (description is optional)
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
                  >
                    <Plus className="w-5 h-5" />
                    Import Clubs
                  </button>
                </form>

                {/* Clubs List */}
                <div className="space-y-2 sm:space-y-3">
                  {clubs.map((club) => (
                    <div key={club.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                      <div className="flex-1 w-full">
                        <h4 className="text-base sm:text-lg font-bold text-gray-800">{club.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">{club.description || 'No description'}</p>
                        <p className="text-xs sm:text-sm text-primary-600 font-medium mt-1">Votes: {club.vote_count}</p>
                        
                        {/* Stand Assignment */}
                        <div className="flex items-center gap-2 mt-2 sm:mt-3">
                          <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Stand:</label>
                          <select
                            value={club.stand_id || ''}
                            onChange={(e) => handleAssignStand(club.id, e.target.value || null)}
                            className="flex-1 px-2 sm:px-3 py-1 text-xs sm:text-sm border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                          >
                            <option value="">Unassigned</option>
                            {stands.map((stand) => (
                              <option key={stand.id} value={stand.id}>
                                {stand.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteClub(club.id)}
                        className="self-end sm:self-auto p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  ))}
                  {clubs.length === 0 && (
                    <p className="text-center text-gray-500 py-6 sm:py-8 text-sm sm:text-base">No clubs added yet</p>
                  )}
                </div>
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-2 mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Manage Students</h2>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleExportQRCodes}
                      disabled={students.length === 0}
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 text-sm sm:text-base flex-1 sm:flex-initial"
                    >
                      <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Export Tickets</span>
                      <span className="sm:hidden">Export</span>
                    </button>
                    <button
                      onClick={handleResetVotes}
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base flex-1 sm:flex-initial"
                    >
                      <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Reset Votes</span>
                      <span className="sm:hidden">Reset</span>
                    </button>
                    <button
                      onClick={handleDeleteAllStudents}
                      disabled={students.length === 0 || loading}
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 disabled:bg-gray-300 text-sm sm:text-base flex-1 sm:flex-initial"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Delete All Students</span>
                      <span className="sm:hidden">Delete All</span>
                    </button>
                  </div>
                </div>

                {/* Quick Registration */}
                <div className="bg-green-50 p-4 sm:p-6 rounded-xl mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Quick Registration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Quick Add Single */}
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">Add Single Student</h4>
                      <form onSubmit={handleAddStudent} className="space-y-2 sm:space-y-3">
                        <input
                          type="text"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="Student Name"
                          className="w-full px-3 py-2 sm:py-2.5 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-sm sm:text-base"
                          required
                        />
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 text-sm sm:text-base"
                        >
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="hidden sm:inline">Add & Generate Ticket</span>
                          <span className="sm:hidden">Add Student</span>
                        </button>
                      </form>
                    </div>

                    {/* Batch Generation */}
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">Batch Generate Students</h4>
                      <form onSubmit={handleBatchGenerate} className="space-y-2 sm:space-y-3">
                        <input
                          type="number"
                          value={batchCount}
                          onChange={(e) => setBatchCount(e.target.value)}
                          placeholder="Number of students"
                          min="1"
                          max="50"
                          className="w-full px-3 py-2 sm:py-2.5 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-sm sm:text-base"
                          required
                        />
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 text-sm sm:text-base"
                          >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                            Generate {batchCount || 0}
                          </button>
                          <button
                            type="button"
                            onClick={handleBatchGenerateAndPrint}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 text-sm sm:text-base"
                          >
                            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Generate & Print</span>
                            <span className="sm:hidden">Print</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Bulk Add Students */}
                <form onSubmit={handleBulkAddStudents} className="bg-gray-50 p-4 sm:p-6 rounded-xl mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-4">Bulk Add Students (CSV)</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Format: name,class (class is optional - one per line)</p>
                  <textarea
                    value={bulkStudents}
                    onChange={(e) => setBulkStudents(e.target.value)}
                    placeholder="John Doe,10A&#10;Jane Smith&#10;Bob Johnson,11A&#10;Alice Brown"
                    className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none font-mono text-sm sm:text-base"
                    rows={5}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-3 sm:mt-4 w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 text-sm sm:text-base"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    Bulk Add Students
                  </button>
                </form>

                {/* Students List */}
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Name</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700 hidden sm:table-cell">Class</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Code</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Status</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id} className="border-t">
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">{student.name}</td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base hidden sm:table-cell">{student.class || 'N/A'}</td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs sm:text-sm">{student.ticket_code}</td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3">
                              {student.has_voted ? (
                                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 text-green-800 rounded text-xs">Voted</span>
                              ) : (
                                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-800 rounded text-xs">Pending</span>
                              )}
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3">
                              <div className="flex gap-1 sm:gap-2">
                                <button
                                  onClick={() => handlePrintSingleTicket(student)}
                                  className="p-1 sm:p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                  title="Print Ticket"
                                >
                                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteStudent(student.id)}
                                  className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 rounded"
                                  title="Delete Student"
                                >
                                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {students.length === 0 && (
                      <p className="text-center text-gray-500 py-6 sm:py-8 text-sm sm:text-base">No students added yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6 sm:py-8 mt-12 border-t-4 border-red-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-sm sm:text-base text-gray-300 flex items-center flex-wrap justify-center gap-1">
              <span>© 2025 • Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 inline-block" />
              <span>by <strong className="text-white">CHOUBIK Houssam</strong></span>
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              ADE ENSAM Casablanca
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AdminDashboard;
