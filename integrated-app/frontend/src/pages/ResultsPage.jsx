import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, ArrowLeft, RefreshCw, Home, Heart, Sparkles } from 'lucide-react';

function ResultsPage() {
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:5000';
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#10B981', '#EF4444', '#059669', '#DC2626', '#F97316'];

  useEffect(() => {
    fetchResults();
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchResults, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/results`);
      setResults(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching results:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-red-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/50 rounded-full blur-xl animate-pulse"></div>
            <div className="relative animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-red-500 border-t-transparent mx-auto mb-6"></div>
          </div>
          <p className="text-gray-300 font-bold text-lg">Chargement des résultats...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-red-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 font-bold text-lg">Aucun résultat disponible</p>
        </div>
      </div>
    );
  }

  const chartData = results.clubs.map(club => ({
    name: club.name,
    votes: club.vote_count,
    percentage: parseFloat(club.percentage)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-red-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900/80 via-slate-900/80 to-gray-900/80 backdrop-blur-xl shadow-2xl border-b border-green-500/30 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 text-sm sm:text-base font-bold shadow-lg"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Retour</span>
            </button>
            <h1 className="text-base sm:text-xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Résultats en Direct</h1>
            <div className="flex gap-2">
              <button
                onClick={fetchResults}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 text-sm sm:text-base font-bold shadow-lg shadow-green-500/50"
              >
                <RefreshCw size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Actualiser</span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-500 hover:to-rose-500 transition-all duration-300 text-sm sm:text-base font-bold shadow-lg shadow-red-500/50"
              >
                <Home size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Accueil</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 py-6 sm:py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-800/40 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl mb-4 sm:mb-6 text-center border border-green-500/30">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/50 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-4 sm:p-6 rounded-full shadow-lg shadow-green-500/50">
                  <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">Résultats du Vote</h1>
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
            <div className="inline-block bg-red-600/30 backdrop-blur-sm border border-red-400/50 rounded-full px-6 py-2">
              <p className="text-xl sm:text-2xl text-white font-black">
                Total des Votes: <span className="text-red-400">{results.totalVotes}</span>
              </p>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-4 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Auto-actualisation toutes les 5 secondes
            </p>
          </div>

          {/* Bar Chart */}
          <div className="bg-gradient-to-br from-slate-900/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl mb-4 sm:mb-6 border border-gray-700/50">
            <h2 className="text-xl sm:text-2xl font-black text-white mb-4 sm:mb-6">Votes par Club</h2>
            <div className="w-full overflow-x-auto">
              <div className="min-w-[300px]">
                <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 12, fill: '#D1D5DB' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#D1D5DB' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                    <Legend wrapperStyle={{ fontSize: '14px', color: '#D1D5DB' }} />
                    <Bar dataKey="votes" fill="#0ea5e9" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-gradient-to-br from-slate-900/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-gray-700/50">
            <h2 className="text-xl sm:text-2xl font-black text-white mb-4 sm:mb-6">Résultats Détaillés</h2>
            <div className="space-y-3 sm:space-y-4">
              {results.clubs.map((club, index) => (
                <div
                  key={club.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl hover:from-green-900/40 hover:to-red-900/40 transition-all duration-300 border border-gray-700 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/20"
                >
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-br from-red-600 to-green-600 rounded-full shadow-lg">
                    <span className="text-lg sm:text-xl font-black text-white">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-white truncate">{club.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">{club.description || 'Aucune description'}</p>
                  </div>
                  <div className="w-full sm:w-auto flex items-center gap-3 sm:gap-4">
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-green-400 to-red-400 bg-clip-text text-transparent">{club.vote_count}</p>
                      <p className="text-xs sm:text-sm text-gray-400 font-medium">votes ({club.percentage}%)</p>
                    </div>
                    <div className="w-24 sm:w-32 flex-shrink-0">
                      <div className="w-full bg-gray-700 rounded-full h-2.5 sm:h-3 overflow-hidden">
                        <div
                          className="h-2.5 sm:h-3 rounded-full transition-all duration-500 shadow-lg"
                          style={{
                            width: `${club.percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {results.clubs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-base sm:text-lg font-medium">Aucun vote pour le moment. Soyez le premier à voter !</p>
              </div>
            )}
          </div>

          {/* Winner */}
          {results.clubs.length > 0 && results.clubs[0].vote_count > 0 && (
            <div className="mt-4 sm:mt-6 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded-2xl p-6 sm:p-8 shadow-2xl text-center transform hover:scale-105 transition-transform duration-300">
              <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-white mx-auto mb-4 animate-bounce" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">🏆 Champion Actuel 🏆</h2>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 break-words drop-shadow-lg">{results.clubs[0].name}</p>
              <p className="text-lg sm:text-xl lg:text-2xl text-white font-semibold">
                {results.clubs[0].vote_count} votes ({results.clubs[0].percentage}%)
              </p>
            </div>
          )}
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

export default ResultsPage;
