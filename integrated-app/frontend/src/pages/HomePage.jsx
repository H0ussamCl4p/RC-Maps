import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Vote, TrendingUp, User, Heart } from 'lucide-react';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-green-500/5 to-red-500/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl shadow-md relative z-10 border-b border-red-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex justify-between items-center">
            {/* Left side - ADE ENSAMC */}
            <div className="text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
              ADE ENSAMC
            </div>
            
            {/* Right side - Admin Button */}
            <button
              onClick={() => navigate('/admin')}
              className="relative flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md shadow-red-500/30 hover:shadow-lg hover:shadow-red-500/40 text-xs sm:text-sm font-bold group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <User size={16} className="sm:w-4 sm:h-4 relative z-10" />
              <span className="relative z-10">Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-8 px-4 leading-tight">
            <span className="inline-block bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
              50ème Anniversaire
            </span>
            <br className="hidden sm:block" />
            <span className="inline-block bg-gradient-to-r from-red-600 via-rose-500 to-red-600 bg-clip-text text-transparent drop-shadow-2xl animate-pulse delay-1000">
              de la Marche Verte
            </span>
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-green-500 via-emerald-500 to-red-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto px-4 leading-relaxed font-semibold">
            Explorez les stands des clubs, votez pour votre favori et suivez les résultats en temps réel !
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-full px-5 sm:px-7 py-2.5 text-green-700 text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-default">
              🗺️ Carte 3D Interactive
            </div>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-400 rounded-full px-5 sm:px-7 py-2.5 text-red-700 text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-default">
              🗳️ Vote en Temps Réel
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-full px-5 sm:px-7 py-2.5 text-emerald-700 text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-default">
              📊 Résultats Live
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24 lg:pb-28 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 max-w-7xl mx-auto">
          {/* Stands Map Card */}
          <div
            onClick={() => navigate('/stands')}
            className="group relative bg-white rounded-3xl shadow-2xl p-8 sm:p-10 cursor-pointer transform hover:scale-105 hover:-rotate-1 transition-all duration-500 border-2 border-green-300 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-emerald-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/40 group-hover:shadow-2xl group-hover:shadow-green-500/60 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                <MapPin className="text-white" size={40} />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-gray-800 mb-5 text-center group-hover:text-green-600 transition-colors duration-300">
                Carte des Stands
              </h3>
              <p className="text-base sm:text-lg text-gray-600 text-center mb-8 leading-relaxed font-medium">
                Explorez notre carte 3D interactive pour localiser les 13 stands des clubs sur le site.
              </p>
              <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 sm:py-5 rounded-2xl font-bold hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-xl shadow-green-500/40 hover:shadow-2xl hover:shadow-green-500/60 text-base sm:text-lg group-hover:tracking-wide">
                Voir la Carte 3D →
              </button>
              <div className="absolute top-5 right-5 bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-500 px-4 py-1.5 rounded-full text-xs font-black text-green-700 shadow-lg">
                3D
              </div>
            </div>
          </div>

          {/* Voting Card */}
          <div
            onClick={() => navigate('/vote')}
            className="group relative bg-white rounded-3xl shadow-2xl p-8 sm:p-10 cursor-pointer transform hover:scale-105 hover:rotate-1 transition-all duration-500 border-2 border-red-300 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-100/50 to-rose-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-red-500 to-rose-600 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/40 group-hover:shadow-2xl group-hover:shadow-red-500/60 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                <Vote className="text-white" size={40} />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-gray-800 mb-5 text-center group-hover:text-red-600 transition-colors duration-300">
                Votez Maintenant
              </h3>
              <p className="text-base sm:text-lg text-gray-600 text-center mb-8 leading-relaxed font-medium">
                Utilisez votre code unique pour voter pour votre club préféré dans la compétition.
              </p>
              <button className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-4 sm:py-5 rounded-2xl font-bold hover:from-red-500 hover:to-rose-500 transition-all duration-300 shadow-xl shadow-red-500/40 hover:shadow-2xl hover:shadow-red-500/60 text-base sm:text-lg group-hover:tracking-wide">
                Voter →
              </button>
              <div className="absolute top-5 right-5 bg-gradient-to-br from-red-100 to-rose-100 border-2 border-red-500 px-4 py-1.5 rounded-full text-xs font-black text-red-700 animate-pulse shadow-lg">
                LIVE
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div
            onClick={() => navigate('/results')}
            className="group relative bg-white rounded-3xl shadow-2xl p-8 sm:p-10 cursor-pointer transform hover:scale-105 hover:-rotate-1 transition-all duration-500 border-2 border-emerald-300 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/30 md:col-span-2 lg:col-span-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-teal-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/40 group-hover:shadow-2xl group-hover:shadow-emerald-500/60 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                <TrendingUp className="text-white" size={40} />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-gray-800 mb-5 text-center group-hover:text-emerald-600 transition-colors duration-300">
                Résultats en Direct
              </h3>
              <p className="text-base sm:text-lg text-gray-600 text-center mb-8 leading-relaxed font-medium">
                Suivez la compétition en temps réel avec les résultats de vote et les graphiques live.
              </p>
              <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 sm:py-5 rounded-2xl font-bold hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 text-base sm:text-lg group-hover:tracking-wide">
                Voir les Résultats →
              </button>
              <div className="absolute top-5 right-5 bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-emerald-500 px-4 py-1.5 rounded-full text-xs font-black text-emerald-700 animate-pulse shadow-lg">
                LIVE
              </div>
            </div>
          </div>
        </div>
      </section>

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

export default HomePage;
