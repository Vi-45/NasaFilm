import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Plus, Check, Star, Share2, Download, ChevronDown, MessageSquare, Volume2, Info, Users, Clock, AlertTriangle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { STREAMING_MOVIES } from './streamingMoviesData';
import './StreamPlayerPage.css';

export default function StreamPlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const defaultMovieId = id && STREAMING_MOVIES[id] ? id : 'eternal-neon';
  const [currentMovie, setCurrentMovie] = useState(STREAMING_MOVIES[defaultMovieId]);
  const [activeEpisode, setActiveEpisode] = useState(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBufferLoading, setIsBufferLoading] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Download Simulator State
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Audio & Subtitle State
  const [audioTrack, setAudioTrack] = useState('vi-goc');
  const [subtitleTrack, setSubtitleTrack] = useState('vi');

  useEffect(() => {
    if (id && STREAMING_MOVIES[id]) {
      const selected = STREAMING_MOVIES[id];
      setCurrentMovie(selected);
      setIsPlaying(false);
      setIsInWatchlist(false);
      setDownloadProgress(null);
      setIsDownloading(false);
      
      // Set first episode as default if available
      if (selected.episodes && selected.episodes.length > 0) {
        setActiveEpisode(selected.episodes[0]);
      } else {
        setActiveEpisode(null);
      }

      if (videoRef.current) {
        videoRef.current.load();
      }
      window.scrollTo(0, 0);
    }
  }, [id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsBufferLoading(true);
      setTimeout(() => {
        setIsBufferLoading(false);
        videoRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => {
            console.error("Lỗi phát video:", err);
          });
      }, 800); // Simulate network buffer glow
    }
  };

  const handleWatchlistToggle = () => {
    setIsInWatchlist(prev => {
      const next = !prev;
      showToast(next ? 'Đã lưu vào danh sách của tôi!' : 'Đã xóa khỏi danh sách của tôi!');
      return next;
    });
  };

  const handleShare = () => {
    const playUrl = window.location.href;
    navigator.clipboard.writeText(playUrl)
      .then(() => {
        showToast('Đã sao chép liên kết xem phim vào bộ nhớ tạm!');
      })
      .catch(() => {
        showToast('Không thể tự sao chép. Hãy copy thanh địa chỉ!');
      });
  };

  // Simulating Offline Download
  const startDownload = () => {
    if (isDownloading) return;
    if (downloadProgress === 100) {
      showToast('Phim đã được tải xuống ngoại tuyến!');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);
    showToast('Bắt đầu tải phim ngoại tuyến...');

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          showToast('Tải phim ngoại tuyến thành công!');
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  // Select another Episode
  const selectEpisode = (ep) => {
    if (activeEpisode && activeEpisode.id === ep.id) return;
    setActiveEpisode(ep);
    setIsPlaying(false);
    setIsBufferLoading(true);
    
    // Simulate content buffer load
    setTimeout(() => {
      setIsBufferLoading(false);
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.log(e));
      }
      showToast(`Đang phát: ${ep.title}`);
    }, 1000);
  };

  const handleAudioChange = (e) => {
    const val = e.target.value;
    setAudioTrack(val);
    const audioLabels = {
      'vi-goc': 'Tiếng Việt (Gốc) - Dolby Atmos 7.1',
      'en-dub': 'Tiếng Anh - DTS-HD Master Audio',
      'vi-tm': 'Thuyết minh Tiếng Việt - Stereo'
    };
    showToast(`Đã chuyển kênh âm thanh sang: ${audioLabels[val]}`);
  };

  const handleSubtitleChange = (sub) => {
    setSubtitleTrack(sub);
    const subLabels = {
      'off': 'Tắt phụ đề',
      'vi': 'Tiếng Việt',
      'en': 'Tiếng Anh',
      'cn': 'Tiếng Trung'
    };
    showToast(`Đã đổi phụ đề: ${subLabels[sub]}`);
  };

  return (
    <div className="stream-player-wrapper bg-[#060608] text-gray-100 min-h-screen flex flex-col justify-between font-sans">
      <Navbar />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#121214] border border-red-500/30 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">{toastMessage}</span>
        </div>
      )}

      {/* CINEMATIC 21:9 WIDESCREEN PLAYER AT THE TOP */}
      <section className="w-full bg-black border-b border-white/5 relative z-10 flex justify-center items-center">
        <div className="w-full max-w-[1600px] aspect-[21/9] bg-[#020203] relative overflow-hidden group">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={currentMovie.video}
            controls={isPlaying}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Buffering/Loading State spinner */}
          {isBufferLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
              <span className="text-[10px] font-mono tracking-widest text-red-500 uppercase animate-pulse">
                Đang giải mã luồng phát...
              </span>
            </div>
          )}

          {/* Custom Pause overlay & Poster */}
          {!isPlaying && !isBufferLoading && (
            <div 
              onClick={handlePlayToggle}
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 cursor-pointer transition-all duration-500 hover:bg-black/40"
            >
              {/* Blur backdrop overlay */}
              <img
                src={currentMovie.poster}
                alt={currentMovie.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 scale-102 blur-[2px]"
              />
              
              {/* Radial gradient shadow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

              {/* Play HUD info overlay */}
              <div className="absolute top-6 left-6 text-left">
                <span className="px-2 py-0.5 bg-red-600/90 text-white font-mono text-[9px] font-bold tracking-wider rounded border border-red-500/20">
                  {currentMovie.tag}
                </span>
                <h3 className="text-white font-extrabold text-sm tracking-wide mt-2 font-mono uppercase">
                  {activeEpisode ? `Đang chọn: ${activeEpisode.title}` : `Phát phim: ${currentMovie.title}`}
                </h3>
              </div>

              {/* Big Play Button */}
              <div className="relative w-20 h-20 rounded-full border-2 border-red-500 flex items-center justify-center bg-black/75 text-red-500 hover:scale-110 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-2xl">
                <Play size={32} fill="currentColor" className="ml-1.5" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* TWO COLUMN GRID BELOW PLAYER */}
      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 md:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: Metadata info & Episodes (Up Next) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header section with title and quick actions */}
            <div className="border-b border-white/5 pb-6 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-white font-heading tracking-tight uppercase leading-none">
                    {currentMovie.title}
                  </h1>
                  <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-gray-500 uppercase">
                    <div className="flex items-center gap-0.5 text-red-500 font-bold">
                      <Star size={11} fill="currentColor" />
                      <span>{currentMovie.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{currentMovie.votes}</span>
                    {activeEpisode && (
                      <>
                        <span>•</span>
                        <span className="text-red-400 font-bold">{activeEpisode.title}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick actions block */}
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={handleWatchlistToggle}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[10px] font-bold tracking-widest uppercase transition-all rounded-xl"
                  >
                    {isInWatchlist ? (
                      <>
                        <Check size={12} className="text-red-500" /> ĐÃ THÊM
                      </>
                    ) : (
                      <>
                        <Plus size={12} /> LƯU DANH SÁCH
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[10px] font-bold tracking-widest uppercase transition-all rounded-xl"
                  >
                    <Share2 size={12} /> CHIA SẺ
                  </button>

                  <button
                    onClick={startDownload}
                    className="relative flex items-center gap-2 px-4 py-2 bg-red-950/20 hover:bg-red-900/30 text-[#ef4444] border border-red-500/20 hover:border-red-500/40 text-[10px] font-bold tracking-widest uppercase transition-all rounded-xl overflow-hidden"
                  >
                    {isDownloading ? (
                      <span className="relative z-10">ĐANG TẢI {downloadProgress}%</span>
                    ) : downloadProgress === 100 ? (
                      <>
                        <Check size={12} /> ĐÃ TẢI XUỐNG
                      </>
                    ) : (
                      <>
                        <Download size={12} /> TẢI NGOẠI TUYẾN
                      </>
                    )}
                    {isDownloading && (
                      <div 
                        className="absolute bottom-0 left-0 h-1 bg-red-500/50 transition-all duration-200" 
                        style={{ width: `${downloadProgress}%` }}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Pills */}
              <div className="flex flex-wrap gap-2">
                {currentMovie.pills.map((pill, idx) => (
                  <span 
                    key={idx} 
                    className="px-2.5 py-0.5 bg-white/3 border border-white/5 text-[9px] font-mono tracking-wider text-gray-400 rounded"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            {/* Synopsis paragraph */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-mono tracking-widest font-bold text-gray-500 uppercase">
                TÓM TẮT TẬP PHIM
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed font-sans font-medium">
                {currentMovie.synopsis}
              </p>
            </div>

            {/* HORIZONTAL SCROLLABLE EPISODES ROW (TẬP TIẾP THEO) */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase border-l-2 border-red-600 pl-3">
                DANH SÁCH CÁC PHẦN / TẬP TIẾP THEO
              </h3>
              
              <div className="flex overflow-x-auto gap-4 pb-3 scrollbar-thin scrollbar-thumb-red-600/30 scrollbar-track-transparent">
                {currentMovie.episodes && currentMovie.episodes.map((ep) => {
                  const isActive = activeEpisode && activeEpisode.id === ep.id;
                  return (
                    <div
                      key={ep.id}
                      onClick={() => selectEpisode(ep)}
                      className={`min-w-[220px] max-w-[220px] bg-[#12141c]/40 border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group ${
                        isActive 
                          ? 'border-red-500 shadow-lg shadow-red-600/5 bg-[#1a1215]/50' 
                          : 'border-white/5 hover:border-red-500/20 hover:bg-[#12141c]/60'
                      }`}
                    >
                      {/* Fake Thumbnail using main poster but zoomed/cropped */}
                      <div className="relative aspect-video bg-black overflow-hidden">
                        <img 
                          src={currentMovie.poster} 
                          alt={ep.title} 
                          className="w-full h-full object-cover opacity-60 scale-110 group-hover:scale-115 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-transparent" />
                        
                        {isActive && (
                          <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-red-600 text-white font-mono text-[7px] font-bold uppercase tracking-wider rounded">
                            ĐANG PHÁT
                          </span>
                        )}
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                          <Play size={14} fill="#ef4444" className="text-red-500" />
                        </div>
                      </div>

                      {/* Episode details */}
                      <div className="p-3 space-y-1">
                        <p className={`text-[10px] font-bold truncate transition-colors ${isActive ? 'text-red-400' : 'text-white'}`}>
                          {ep.title}
                        </p>
                        <div className="flex justify-between items-center text-[8px] font-mono text-gray-500 uppercase">
                          <span>Tập {ep.episodeNum}</span>
                          <span className="flex items-center gap-0.5">
                            <Clock size={8} /> {ep.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Trivia, Audio & Subtitles */}
          <div className="space-y-6">
            
            {/* Box 1: DIỄN VIÊN & THÔNG TIN BÊN LỀ (Trivia & Cast) */}
            <div className="bg-[#12141c]/50 border border-white/5 p-5 rounded-2xl space-y-5 shadow-xl backdrop-blur-md">
              <div className="space-y-1.5 border-b border-white/5 pb-3">
                <h3 className="text-xs font-mono font-black tracking-widest text-white uppercase flex items-center gap-2">
                  <Info size={13} className="text-red-500" /> THÔNG TIN BÊN LỀ & DIỄN VIÊN
                </h3>
                <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest leading-none">
                  TRIVIA & PRODUCTION NOTE
                </p>
              </div>

              {/* Trivia list */}
              <ul className="space-y-3 font-sans text-[11px] text-gray-400 leading-relaxed list-disc pl-4 marker:text-red-500">
                {currentMovie.trivia ? currentMovie.trivia.map((triv, idx) => (
                  <li key={idx} className="hover:text-gray-300 transition-colors">
                    {triv}
                  </li>
                )) : (
                  <li className="hover:text-gray-300 transition-colors">
                    Bộ phim được ghi hình bằng máy quay tiêu chuẩn rạp kỹ thuật số ban đêm cao cấp.
                  </li>
                )}
              </ul>

              {/* Quick specs */}
              <div className="pt-2 border-t border-white/5 space-y-2 font-mono text-[10px]">
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase tracking-wider">Đạo diễn:</span>
                  <span className="text-gray-300 font-bold">{currentMovie.director}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase tracking-wider">Quay phim:</span>
                  <span className="text-gray-300 font-bold">{currentMovie.cinematography}</span>
                </div>
              </div>

              {/* Cast grid */}
              <div className="pt-3 border-t border-white/5 space-y-3">
                <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1">
                  <Users size={10} /> Dàn nhân sự chính:
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  {currentMovie.cast && currentMovie.cast.map((actor, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#090b11]/60 p-2 rounded-lg border border-white/3">
                      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-white/10">
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
                        <p className="text-[9px] font-bold text-white truncate leading-tight">{actor.name}</p>
                        <p className="text-[7px] font-mono text-gray-500 uppercase tracking-wider truncate mt-0.5">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Box 2: ÂM THANH & PHỤ ĐỀ (Audio & Subtitles) */}
            <div className="bg-[#12141c]/50 border border-white/5 p-5 rounded-2xl space-y-4 shadow-xl backdrop-blur-md">
              <div className="space-y-1 border-b border-white/5 pb-2">
                <h3 className="text-xs font-mono font-black tracking-widest text-white uppercase flex items-center gap-2">
                  <Volume2 size={13} className="text-red-500" /> THIẾT LẬP ÂM THANH & PHỤ ĐỀ
                </h3>
                <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                  AUDIO TRACKS & SUBTITLES SELECTOR
                </p>
              </div>

              {/* Audio Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">
                  Kênh âm thanh (Audio Track)
                </label>
                <div className="relative">
                  <select 
                    value={audioTrack}
                    onChange={handleAudioChange}
                    className="w-full bg-[#090b11] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-500/50 appearance-none cursor-pointer"
                  >
                    <option value="vi-goc">Tiếng Việt (Gốc) - Dolby Atmos 7.1</option>
                    <option value="en-dub">Tiếng Anh - DTS-HD Master Audio</option>
                    <option value="vi-tm">Thuyết minh Tiếng Việt - Stereo</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-3.5 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Subtitles Buttons Grid */}
              <div className="space-y-2 pt-1">
                <label className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">
                  Phụ đề phim (Subtitles)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'off', label: 'TẮT PHỤ ĐỀ' },
                    { id: 'vi', label: 'TIẾNG VIỆT' },
                    { id: 'en', label: 'TIẾNG ANH' },
                    { id: 'cn', label: 'TIẾNG TRUNG' }
                  ].map(sub => {
                    const isSelected = subtitleTrack === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleSubtitleChange(sub.id)}
                        className={`py-2 text-[9px] font-mono font-bold tracking-wider rounded-xl border transition-all ${
                          isSelected 
                            ? 'bg-red-600 border-red-500 text-white shadow-md shadow-red-600/10' 
                            : 'bg-white/5 border-white/5 hover:border-red-500/20 text-gray-400 hover:text-white'
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Warning Notice */}
            <div className="bg-red-950/10 border border-red-900/20 p-4 rounded-2xl flex items-start gap-3">
              <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[9px] font-bold font-mono text-red-400 uppercase tracking-wider">Lưu ý bản quyền DRM</p>
                <p className="text-[9px] text-gray-500 leading-normal font-sans">
                  NASAFilm sử dụng luồng phát mã hóa động. Mọi hoạt động chia sẻ tài khoản hoặc ghi màn hình sẽ bị chấm dứt quyền phát ngay lập tức.
                </p>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
