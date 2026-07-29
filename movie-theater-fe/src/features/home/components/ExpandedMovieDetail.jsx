import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Clock, Calendar, Film, Languages, Play, Ticket, Heart, Share2, X, Volume2 } from "lucide-react";
import FavoriteIconButton from "./FavoriteIconButton";
import { getMovieDetailPath, pickPosterMediaUrl, getMovieTrailerUrl } from "../utils/movieUtils";
import ShareButton from "../../../shared/components/ShareButton";

const getYoutubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const ExpandedMovieDetail = ({ movie, onClose }) => {
  const navigate = useNavigate();
  const [playTrailer, setPlayTrailer] = useState(false);

  const posterSrc = pickPosterMediaUrl(movie) || "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=400";
  const trailerUrl = getMovieTrailerUrl(movie);
  const youtubeId = getYoutubeId(trailerUrl);

  const handleBookTicket = () => {
    // Zoom transition
    const path = getMovieDetailPath(movie.uuid, { online: false });
    const zoomOverlay = document.createElement("div");
    zoomOverlay.style.position = "fixed";
    zoomOverlay.style.inset = "0";
    zoomOverlay.style.zIndex = "9999";
    zoomOverlay.style.background = "black";
    zoomOverlay.style.opacity = "0";
    zoomOverlay.style.transition = "opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
    document.body.appendChild(zoomOverlay);

    setTimeout(() => {
      zoomOverlay.style.opacity = "1";
    }, 10);

    setTimeout(() => {
      navigate(path);
      setTimeout(() => {
        document.body.removeChild(zoomOverlay);
      }, 100);
    }, 700);
  };

  const displayGenres = movie.genres?.length ? movie.genres.join(", ") : movie.genre || "Phim Điện Ảnh";
  const displayDuration = movie.durationMinutes ? `${movie.durationMinutes} phút` : movie.duration || "N/A";
  const displayDate = movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }) : "Chưa xác định";

  // Mock formats & languages if missing in backend
  const formats = movie.formats || ["IMAX 3D", "2D Dolby Atmos"];
  const languages = movie.languages || ["Tiếng Anh (Phụ đề Tiếng Việt)", "Thuyết minh Tiếng Việt"];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-[#0d0d12]/95 border-y border-white/10 my-8 overflow-hidden relative"
    >
      {/* Detail Container */}
      <div className="max-w-7xl mx-auto px-6 py-10 md:px-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 relative z-10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-8 md:right-8 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white hover:text-red-500 p-2.5 rounded-full backdrop-blur-md transition-all z-20"
          aria-label="Đóng chi tiết"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left: Poster / Trailer Player (md: 4 columns) */}
        <div className="md:col-span-4 flex justify-center items-start">
          <div className="relative w-full max-w-[340px] aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.8)] border border-white/10 group bg-neutral-950">
            <AnimatePresence mode="wait">
              {playTrailer && trailerUrl ? (
                <motion.div
                  key="trailer-player"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full absolute inset-0"
                >
                  {youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={trailerUrl} controls autoPlay className="w-full h-full object-contain" />
                  )}
                  <button
                    onClick={() => setPlayTrailer(false)}
                    className="absolute bottom-4 left-4 bg-black/80 hover:bg-black text-white hover:text-red-500 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 z-20 transition-all border border-white/10"
                  >
                    <X className="h-3 w-3" />
                    Đóng Video
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="poster-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full relative"
                >
                  <img
                    src={posterSrc}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Play Hover Overlay */}
                  {trailerUrl && (
                    <div
                      onClick={() => setPlayTrailer(true)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-300"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="bg-red-600/90 text-white p-4 rounded-full shadow-2xl flex items-center justify-center border border-red-500/50"
                      >
                        <Play className="h-8 w-8 fill-white ml-1" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Detailed Text & Metadata (md: 8 columns) */}
        <div className="md:col-span-8 space-y-6 flex flex-col justify-center">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-semibold text-gray-400 mb-2">
              {movie.reviewAverageRating > 0 && (
                <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-2.5 py-1 rounded-md">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {Number(movie.reviewAverageRating).toFixed(1)} / 5.0
                </div>
              )}
              {movie.ageRestriction && (
                <span className="bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded tracking-wide uppercase">
                  {movie.ageRestriction}
                </span>
              )}
              <span className="text-gray-300">{displayGenres}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">
              {movie.title}
            </h2>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-white/5 text-sm font-medium">
            <div className="space-y-1">
              <span className="text-gray-500 block text-xs uppercase tracking-wider">Thời lượng</span>
              <div className="flex items-center gap-1.5 text-white">
                <Clock className="h-4 w-4 text-red-500" />
                <span>{displayDuration}</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-gray-500 block text-xs uppercase tracking-wider">Khởi chiếu</span>
              <div className="flex items-center gap-1.5 text-white">
                <Calendar className="h-4 w-4 text-red-500" />
                <span>{displayDate}</span>
              </div>
            </div>
            {movie.director && (
              <div className="space-y-1">
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Đạo diễn</span>
                <span className="text-white block truncate">{movie.director}</span>
              </div>
            )}
            {movie.cast && (
              <div className="space-y-1">
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Diễn viên</span>
                <span className="text-white block truncate">{movie.cast}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block">Tóm tắt nội dung</span>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-3xl">
              {movie.description || "Nội dung phim đang được cập nhật chi tiết."}
            </p>
          </div>

          {/* Dynamic Technical Formats */}
          <div className="flex flex-col sm:flex-row gap-6 text-sm">
            <div className="space-y-2">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block">Định dạng chiếu</span>
              <div className="flex flex-wrap gap-2">
                {formats.map((f, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white font-semibold text-xs tracking-wider">
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block">Ngôn ngữ</span>
              <div className="flex flex-wrap gap-2">
                {languages.map((l, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white text-xs font-semibold">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
            <button
              onClick={handleBookTicket}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:brightness-110 text-white font-bold py-3 px-6 rounded-xl shadow-lg active:scale-95 transition-all"
            >
              <Ticket className="h-5 w-5" />
              Đặt Vé Xem Phim
            </button>
            {trailerUrl && (
              <button
                onClick={() => setPlayTrailer(!playTrailer)}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 px-6 rounded-xl active:scale-95 transition-all"
              >
                <Play className="h-5 w-5 fill-white" />
                {playTrailer ? "Xem Poster" : "Xem Trailer"}
              </button>
            )}
            {movie.uuid && (
              <div className="flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 cursor-pointer transition-all">
                <FavoriteIconButton movieUuid={movie.uuid} />
              </div>
            )}
            <ShareButton
              className="flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white transition-all cursor-pointer"
              title={movie.title}
              text={movie.description}
            />
          </div>
        </div>
      </div>
      
      {/* Blurred background image behind expanded details */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none opacity-20">
        <img
          src={posterSrc}
          alt=""
          className="w-full h-full object-cover blur-3xl scale-125"
        />
        <div className="absolute inset-0 bg-[#0d0d12]/90" />
      </div>
    </motion.div>
  );
};

export default ExpandedMovieDetail;
