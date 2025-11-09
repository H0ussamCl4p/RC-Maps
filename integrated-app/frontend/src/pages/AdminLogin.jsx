import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, ArrowLeft, X, Home, Heart, Lock } from 'lucide-react';

function AdminLogin() {
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:5000';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin/login`, {
        username,
        password
      });
      
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUsername', response.data.username);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-red-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-red-600/10 to-green-600/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900/80 via-slate-900/80 to-gray-900/80 backdrop-blur-xl shadow-2xl border-b border-red-500/30 relative z-10">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 text-sm sm:text-base font-bold shadow-lg"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Retour</span>
            </button>
            <h1 className="text-base sm:text-xl font-black bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">Admin</h1>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 text-sm sm:text-base font-bold shadow-lg shadow-green-500/50"
            >
              <Home size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Accueil</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex items-center justify-center p-4 py-12 sm:py-16 relative z-10">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-br from-red-900/40 to-rose-800/40 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-red-500/30">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/50 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-red-500 to-rose-600 p-4 sm:p-6 rounded-full shadow-lg shadow-red-500/50">
                  <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                </div>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 text-center">
              Connexion Admin
            </h2>
            <p className="text-sm sm:text-base text-gray-300 text-center mb-6 sm:mb-8">
              Entrez vos identifiants administrateur
            </p>

            {error && (
              <div className="mb-4 p-3 sm:p-4 bg-red-500/20 border border-red-400/50 rounded-xl flex items-start gap-2 backdrop-blur-sm animate-pulse">
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base text-red-200 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-2">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 sm:py-4 bg-gray-900/50 border-2 border-gray-600 text-white rounded-xl focus:border-red-400 focus:ring-2 focus:ring-red-400/50 focus:outline-none text-sm sm:text-base placeholder-gray-500 backdrop-blur-sm"
                  placeholder="Nom d'utilisateur"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 sm:py-4 bg-gray-900/50 border-2 border-gray-600 text-white rounded-xl focus:border-red-400 focus:ring-2 focus:ring-red-400/50 focus:outline-none text-sm sm:text-base placeholder-gray-500 backdrop-blur-sm"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 sm:py-4 rounded-xl hover:from-red-500 hover:to-rose-500 transition-all duration-300 font-black shadow-xl shadow-red-500/50 hover:shadow-2xl disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:shadow-none text-sm sm:text-base flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Connexion...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Se connecter →</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-gradient-to-r from-gray-950 via-slate-950 to-gray-950 text-white py-8 sm:py-10 border-t border-green-500/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-red-600/5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-3">
            <p className="text-sm sm:text-base text-gray-300 flex items-center flex-wrap justify-center gap-2">
              <span>© 2025 • Made with</span>
              <Heart className="w-5 h-5 text-red-500 fill-red-500 inline-block animate-pulse" />
              <span>by <strong className="text-white font-bold bg-gradient-to-r from-green-400 to-red-400 bg-clip-text text-transparent">CHOUBIK Houssam</strong></span>
            </p>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">
              ADE ENSAM Casablanca
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AdminLogin;
