import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Play, Plus, Check, Key, Star, Volume2, Clock, Film, Camera, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { STREAMING_MOVIES, CATALOG_MOVIES } from './streamingMoviesData';
import './StreamingMovieDetailPage.css';

export default function StreamingMovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [activeTrack, setActiveTrack] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const selectedMovie = STREAMING_MOVIES[id] || STREAMING_MOVIES['eternal-neon'];
    setMovie(selectedMovie);
    setIsInWatchlist(false);
    setActiveTrack(null);
    window.scrollTo(0, 0);
  }, [id]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  const toggleWatchlist = () => {
    setIsInWatchlist(prev => {
      const next = !prev;
      showToast(next ? 'Đã thêm phim vào danh sách theo dõi!' : 'Đã xóa phim khỏi danh sách theo dõi!');
      return next;
    });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const playTrack = (title) => {
    if (activeTrack === title) {
      setActiveTrack(null);
      showToast('Đã dừng nghe thử nhạc phim.');
    } else {
      setActiveTrack(title);
      showToast(`Đang phát thử: ${title}`);
    }
  };

  // Get 3 similar movies excluding the current one
  const similarMovies = CATALOG_MOVIES.filter(m => m.id !== movie.id).slice(0, 3);

  return (
    <div className="streaming-detail bg-[#060608] text-gray-100 min-h-screen flex flex-col justify-between font-sans relative overflow-hidden">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#121214] border border-red-500/30 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">{toastMessage}</span>
        </div>
      )}

      {/* Background Banner with intense blur and red radial glow */}
      <div className="absolute top-0 inset-x-0 h-[600px] select-none pointer-events-none z-0">
        <img 
          src={movie.poster} 
          alt={movie.title} 
          className="w-full h-full object-cover opacity-25 blur-[40px] scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#060608]/80 to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/10 rounded-full blur-[160px]" />
      </div>

      <main className="flex-grow max-w-[1200px] w-full mx-auto px-4 md:px-8 py-8 relative z-10 space-y-12">
        {/* Back breadcrumb */}
        <Link 
          to="/stream" 
          className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-gray-400 hover:text-red-500 transition-colors uppercase"
        >
          <ArrowLeft size={14} /> Quay lại danh mục trực tuyến
        </Link>

        {/* Hero Meta Header Info */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT: Poster Art Card */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-6">
            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <img 
                src={movie.poster} 
                alt={movie.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <span className="px-2 py-0.5 bg-red-600/90 text-white font-mono text-[9px] font-bold tracking-wider rounded border border-red-500/20">
                  {movie.tag}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-red-500 bg-[#090b11]/90 px-2 py-1 rounded border border-white/5">
                  <Star size={12} fill="currentColor" />
                  <span className="text-white">{movie.rating}</span>
                </div>
              </div>
            </div>

            {/* Tech Spec Sheet Card */}
            <div className="bg-[#12141c]/50 border border-white/5 p-5 rounded-2xl space-y-4 shadow-xl backdrop-blur-md">
              <h3 className="text-xs font-mono font-black tracking-widest text-white uppercase border-b border-white/5 pb-2 flex items-center gap-2">
                <Film size={12} className="text-red-500" /> THÔNG SỐ KỸ THUẬT
              </h3>
              
              <div className="space-y-3 font-mono text-[10px]">
                <div>
                  <span className="text-gray-500 uppercase tracking-wider block mb-0.5">Tỉ lệ khung hình</span>
                  <span className="text-gray-300 font-bold uppercase">{movie.specs.aspectRatio}</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase tracking-wider block mb-0.5">Hệ thống máy quay</span>
                  <span className="text-gray-300 font-bold uppercase leading-tight block">{movie.specs.camera}</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase tracking-wider block mb-0.5">Định dạng phim gốc</span>
                  <span className="text-gray-300 font-bold uppercase leading-tight block">{movie.specs.negativeFormat}</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase tracking-wider block mb-0.5">Ngày phát hành trực tuyến</span>
                  <span className="text-gray-300 font-bold uppercase flex items-center gap-1">
                    <Calendar size={10} className="text-red-500" /> {movie.specs.releaseDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Movie Title, Buttons, Synopsis, Soundtracks, Cast */}
          <div className="flex-1 space-y-8">
            {/* Title & Info Pills */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase font-heading">
                  {movie.title}
                </h1>
                <p className="text-xs md:text-sm text-gray-500 font-mono tracking-widest uppercase">
                  {movie.englishTitle}
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {movie.pills.map((pill, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1 bg-red-950/20 border border-red-500/20 text-[9px] font-mono font-bold tracking-widest text-[#ef4444] rounded-md uppercase"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pb-2 border-b border-white/5">
              <button 
                onClick={() => navigate(`/stream/watch/${movie.id}`)}
                className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold text-xs tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center gap-2"
              >
                <Play size={14} fill="currentColor" /> XEM NGAY CHẤT LƯỢNG CAO
              </button>
              
              <button 
                onClick={toggleWatchlist}
                className="px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold tracking-wider uppercase rounded-xl transition-all flex items-center gap-2"
              >
                {isInWatchlist ? (
                  <>
                    <Check size={14} className="text-red-500" /> TRONG DANH SÁCH
                  </>
                ) : (
                  <>
                    <Plus size={14} /> DANH SÁCH THEO DÕI
                  </>
                )}
              </button>

              <button 
                onClick={() => navigate('/stream/activate')}
                className="px-5 py-3.5 bg-red-950/30 hover:bg-red-900/40 border border-red-900/40 text-red-400 hover:text-red-300 text-xs font-bold tracking-wider uppercase rounded-xl transition-all flex items-center gap-2"
              >
                <Key size={14} /> KÍCH HOẠT MÃ SỐ VÉ
              </button>
            </div>

            {/* Movie Synopsis */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-gray-500">TÓM TẮT PHIM</h3>
              <p className="text-sm text-gray-300 leading-relaxed max-w-4xl font-sans font-medium">
                {movie.synopsis}
              </p>
            </div>

            {/* Soundtrack Section */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-gray-500">NHẠC PHIM CHÍNH</h3>
              
              <div className="bg-[#12141c]/30 border border-white/5 rounded-2xl p-4 divide-y divide-white/5 shadow-inner">
                {movie.soundtracks.map((track, idx) => (
                  <div 
                    key={idx} 
                    className="flex justify-between items-center py-3 first:pt-1 last:pb-1 group/track animate-fade-in"
                  >
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => playTrack(track.title)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                          activeTrack === track.title 
                            ? 'bg-red-650 bg-red-600 border-red-500 text-white animate-pulse' 
                            : 'bg-white/5 border-white/10 text-gray-400 group-hover/track:bg-red-600/10 group-hover/track:border-red-500/30 group-hover/track:text-red-500'
                        }`}
                      >
                        <Volume2 size={12} className={activeTrack === track.title ? 'animate-bounce' : ''} />
                      </button>
                      <div>
                        <p className="text-[11px] font-bold text-white group-hover/track:text-red-500 transition-colors">
                          {track.title}
                        </p>
                        <p className="text-[9px] font-mono text-gray-500">{track.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-mono text-gray-500">
                      <Clock size={10} />
                      <span>{track.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cast List Ensemble */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-gray-500">DÀN DIỄN VIÊN CHÍNH</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {movie.cast.map((actor, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 bg-[#12141c]/40 border border-white/5 p-3 rounded-xl hover:border-red-500/20 transition-all group/actor"
                  >
                    <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden shrink-0 group-hover/actor:border-red-500/55 transition-all">
                      <img 
                        src={actor.avatar} 
                        alt={actor.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80";
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white truncate">{actor.name}</p>
                      <p className="text-[8px] font-mono text-gray-500 uppercase tracking-wider truncate mt-0.5">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Titles Section */}
        <section className="space-y-6 pt-6 border-t border-white/5">
          <h2 className="text-lg font-black text-white font-heading tracking-wider uppercase border-l-2 border-red-600 pl-3">
            TÁC PHẨM TƯƠNG TỰ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarMovies.map(sim => (
              <div 
                key={sim.id}
                onClick={() => navigate(`/stream/movie/${sim.id}`)}
                className="bg-[#12141c]/20 border border-white/5 hover:border-red-500/20 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 group cursor-pointer shadow-md"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <img 
                    src={sim.poster} 
                    alt={sim.title} 
                    className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-black/30" />
                  <span className="absolute top-3 left-3 text-[8px] font-mono font-bold tracking-widest bg-red-600/90 text-white px-2 py-0.5 rounded border border-red-500/20">
                    {sim.tag}
                  </span>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-black/60 border border-red-500 flex items-center justify-center text-red-500">
                      <Play size={14} fill="currentColor" className="ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#090b11] flex-grow flex flex-col justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-red-500 transition-colors truncate">
                      {sim.title}
                    </h3>
                    <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">
                      {sim.category}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center text-[9px] font-mono text-gray-400">
                    <div className="flex items-center gap-0.5 text-red-500">
                      <Star size={10} fill="currentColor" />
                      <span className="font-bold text-gray-300">{sim.rating}</span>
                    </div>
                    <span>{sim.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
