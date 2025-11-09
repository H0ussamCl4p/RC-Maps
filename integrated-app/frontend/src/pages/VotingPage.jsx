import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Ticket, CheckCircle, X, ArrowLeft, Home, Heart, Vote as VoteIcon } from 'lucide-react';

function VotingPage() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const [step, setStep] = useState('enter-code'); // 'enter-code', 'select-club', 'success'
  const [ticketCode, setTicketCode] = useState('');
  const [student, setStudent] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/clubs`);
      setClubs(response.data);
    } catch (err) {
      console.error('Error fetching clubs:', err);
    }
  };

  const handleVerifyTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/vote/verify`, {
        ticketCode: ticketCode.trim().toUpperCase()
      });
      
      if (response.data.valid) {
        setStudent(response.data.student);
        setStep('select-club');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid ticket code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedClub) return;

    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_BASE_URL}/api/vote/submit`, {
        ticketCode: ticketCode.trim().toUpperCase(),
        clubId: selectedClub.id
      });
      
      setStep('success');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="max-w-md w-full bg-white rounded-2xl p-6 sm:p-8 shadow-2xl text-center border-2 border-green-500 relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/30 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-4 sm:p-6 rounded-full shadow-lg shadow-green-500/30">
                <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Merci d'avoir voté !
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-2 font-medium">
            Votre vote pour <span className="font-bold text-green-600">{selectedClub?.name}</span> a été enregistré.
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8">
            Vous pouvez consulter les résultats en direct à tout moment !
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/results')}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 sm:py-4 rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 font-bold text-sm sm:text-base shadow-lg shadow-green-500/30 hover:shadow-xl"
            >
              Voir les Résultats →
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 sm:py-4 rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 font-bold text-sm sm:text-base shadow-lg"
            >
              Retour à l'Accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'select-club') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Header */}
        <header className="bg-white/95 backdrop-blur-xl shadow-lg border-b-2 border-red-500 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <div className="flex justify-between items-center gap-2">
              <button
                onClick={() => setStep('enter-code')}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 text-sm sm:text-base font-bold shadow-lg"
              >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Retour</span>
              </button>
              <div className="flex flex-col items-center gap-1">
                <div className="text-xs sm:text-sm font-black bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                  ADE ENSAMC
                </div>
                <h1 className="text-base sm:text-xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Votez Maintenant</h1>
              </div>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 text-sm sm:text-base font-bold shadow-lg shadow-green-500/30"
              >
                <Home size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Accueil</span>
              </button>
            </div>
          </div>
        </header>

        <div className="container mx-auto p-4 py-6 sm:py-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl mb-4 sm:mb-6 border-2 border-green-500">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg shadow-lg shadow-green-500/30">
                  <VoteIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900">
                  Bienvenue, {student?.name}!
                </h2>
              </div>
              <p className="text-sm sm:text-base text-green-600 font-bold ml-12">
                Classe: {student?.class}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border-2 border-red-500">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 mb-4 sm:mb-6">
                Sélectionnez votre club préféré
              </h3>

              {error && (
                <div className="mb-4 p-3 sm:p-4 bg-red-50 border-2 border-red-300 rounded-xl flex items-start gap-2">
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-red-800 font-medium">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {clubs.map((club) => (
                  <div
                    key={club.id}
                    onClick={() => setSelectedClub(club)}
                    className={`group p-4 sm:p-6 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                      selectedClub?.id === club.id
                        ? 'border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-xl shadow-red-500/20 scale-105'
                        : 'border-gray-300 bg-white hover:border-green-500 hover:shadow-lg hover:shadow-green-500/10'
                    }`}
                  >
                    <h4 className={`text-base sm:text-lg lg:text-xl font-bold mb-2 transition-colors ${
                      selectedClub?.id === club.id ? 'text-red-600' : 'text-gray-800 group-hover:text-green-600'
                    }`}>
                      {club.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {club.description || 'No description available'}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleVote}
                disabled={!selectedClub || loading}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 sm:py-4 rounded-xl hover:from-red-500 hover:to-rose-500 transition-all duration-300 font-black text-base sm:text-lg shadow-xl shadow-red-500/30 hover:shadow-2xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? 'Envoi du vote...' : 'Soumettre le vote →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-green-500/5 to-red-500/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl shadow-lg border-b-2 border-red-500 relative z-10">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 text-sm sm:text-base font-bold shadow-lg"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Retour</span>
            </button>
            <div className="flex flex-col items-center gap-1">
              <div className="text-xs sm:text-sm font-black bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                ADE ENSAMC
              </div>
              <h1 className="text-base sm:text-xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Entrez votre code</h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 text-sm sm:text-base font-bold shadow-lg shadow-green-500/30"
            >
              <Home size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Accueil</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex items-center justify-center p-4 py-12 sm:py-16 relative z-10">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-red-500">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-red-500 to-rose-600 p-4 sm:p-6 rounded-full shadow-lg shadow-red-500/30">
                  <Ticket className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                </div>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 text-center">
              Entrez votre code
            </h2>
            <p className="text-sm sm:text-base text-gray-700 text-center mb-6 sm:mb-8">
              Saisissez le code de votre billet de vote
            </p>

            {error && (
              <div className="mb-4 p-3 sm:p-4 bg-red-50 border-2 border-red-300 rounded-xl flex items-start gap-2 animate-pulse">
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base text-red-800 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleVerifyTicket}>
              <input
                type="text"
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
                placeholder="ex: A1B2C3D4"
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 text-gray-900 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none text-center text-base sm:text-lg font-mono mb-4 sm:mb-6 uppercase placeholder-gray-400"
                maxLength={8}
                required
              />

              <button
                type="submit"
                disabled={loading || ticketCode.length < 4}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-4 rounded-xl hover:from-red-500 hover:to-rose-500 transition-all duration-300 font-black text-base sm:text-lg shadow-xl shadow-red-500/30 hover:shadow-2xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? 'Vérification...' : 'Continuer →'}
              </button>
            </form>

            <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600">
              <p className="mb-1">Don't have a ticket code?</p>
              <p className="text-gray-500">Contact the competition organizers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-white border-t-2 border-red-500 text-gray-800 py-8 sm:py-10 overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-red-50/50"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-3">
            <p className="text-sm sm:text-base text-gray-700 flex items-center flex-wrap justify-center gap-2">
              <span>© 2025 • Made with</span>
              <Heart className="w-5 h-5 text-red-600 fill-red-600 inline-block animate-pulse" />
              <span>by <strong className="text-gray-900 font-bold bg-gradient-to-r from-green-600 to-red-600 bg-clip-text text-transparent">CHOUBIK Houssam</strong></span>
            </p>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              ADE ENSAM Casablanca
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default VotingPage;
