import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StandsMapPage from './pages/StandsMapPage';
import VotingPage from './pages/VotingPage';
import ResultsPage from './pages/ResultsPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stands" element={<StandsMapPage />} />
        <Route path="/vote" element={<VotingPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
