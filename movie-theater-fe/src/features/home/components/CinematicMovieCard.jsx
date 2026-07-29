import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Clock, Play, Ticket, Heart, Share2, VolumeX } from "lucide-react";
import { useCinematicBackdrop } from "../context/CinematicBackdropContext";
import { getMovieDetailPath, pickPosterMediaUrl, getMovieTrailerUrl, formatAgeRestrictionBadge, resolveAgeRestrictionClass } from "../utils/movieUtils";
import FavoriteIconButton from "./FavoriteIconButton";

const getYoutubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const CinematicMovieCard = ({ movie, onExpand, isExpanded }) => {
  const navigate = useNavigate();
  const { setActiveBackdrop, setActiveMovieId } = useCinematicBackdrop();
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const hoverTimerRef = useRef(null);
  const cardRef = useRef(null);

  const posterSrc = pickPosterMediaUrl(movie) || "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=400";
  const trailerUrl = getMovieTrailerUrl(movie);
  const youtubeId = getYoutubeId(trailerUrl);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setActiveMovieId(movie.uuid);
    
    const backdropImg = movie.primaryMediaUrl || posterSrc;
    setActiveBackdrop(backdropImg);

    // Trigger muted trailer preview after 1 second
    hoverTimerRef.current = setTimeout(() => {
      if (trailerUrl) {
        setShowPreview(true);
      }
    }, 1000);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowPreview(false);
    setMousePos({ x: 0, y: 0 });
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2); // -1 to 1
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2); // -1 to 1
    setMousePos({ x, y });
  };

  const handleBookTicket = (e) => {
    e.stopPropagation();
    
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

    if (cardRef.current) {
      cardRef.current.style.transition = "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
      cardRef.current.style.transform = "scale(2.5) rotateY(0deg)";
      cardRef.current.style.zIndex = "999";
    }

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

  // Format details
  const displayGenres = movie.genres?.length ? movie.genres.join(", ") : movie.genre || "Phim Điện Ảnh";
  const displayDuration = movie.durationMinutes ? `${movie.durationMinutes} phút` : movie.duration || "";

  return (
    <div className="relative p-3">
      <motion.div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={onExpand}
        className="relative w-64 h-[420px] rounded-2xl overflow-hidden cursor-pointer select-none bg-neutral-900 border border-white/5 shadow-2xl flex flex-col justify-between group transition-all duration-300"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: isHovered ? 1.12 : 1,
          y: isHovered ? -12 : 0,
          boxShadow: isHovered 
            ? "0 20px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(229, 9, 20, 0.25)" 
            : "0 10px 20px rgba(0, 0, 0, 0.5)",
          borderColor: isHovered ? "rgba(229, 9, 20, 0.5)" : "rgba(255, 255, 255, 0.05)",
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        {/* Poster & Video Frame (~80% height) */}
        <div className="relative w-full h-[320px] overflow-hidden bg-neutral-950">
          <AnimatePresence mode="wait">
            {showPreview && trailerUrl ? (
              <motion.div
                key="preview-video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 w-full h-full"
              >
                {youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&modestbranding=1&iv_load_policy=3&rel=0`}
                    className="w-full h-full pointer-events-none scale-125 object-cover"
                    allow="autoplay"
                    frameBorder="0"
                  />
                ) : (
                  <video
                    src={trailerUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Audio indicators */}
                <div className="absolute bottom-2 right-2 bg-black/60 p-1 rounded backdrop-blur-md z-20">
                  <VolumeX className="h-3 w-3 text-white/80" />
                </div>
              </motion.div>
            ) : (
              <motion.img
                key="poster"
                src={posterSrc}
                alt={movie.title}
                className="w-full h-full object-cover"
                style={{
                  x: isHovered ? mousePos.x * 6 : 0,
                  y: isHovered ? mousePos.y * 6 : 0,
                }}
                transition={{ type: "tween", ease: "easeOut", duration: 0.1 }}
              />
            )}
          </AnimatePresence>

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent z-10" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
            {movie.reviewAverageRating > 0 && (
              <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-yellow-400 font-extrabold text-[10px]">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {Number(movie.reviewAverageRating).toFixed(1)}
              </div>
            )}
            {movie.ageRestriction && (
              <span className="bg-red-600/90 text-white font-black text-[9px] px-1.5 py-0.5 rounded w-max uppercase">
                {formatAgeRestrictionBadge(movie.ageRestriction)}
              </span>
            )}
          </div>

          {/* Favorite button */}
          {movie.uuid && (
            <div className="absolute top-3 right-3 z-30" onClick={(e) => e.stopPropagation()}>
              <FavoriteIconButton movieUuid={movie.uuid} />
            </div>
          )}
        </div>

        {/* Info Area (~20% height) */}
        <div className="p-4 flex-1 flex flex-col justify-between bg-neutral-900 z-10">
          <div className="space-y-0.5">
            <h3
              className="text-white font-bold text-sm tracking-wide line-clamp-1 group-hover:text-red-500 transition-colors"
              style={{
                x: isHovered ? mousePos.x * 10 : 0,
                y: isHovered ? mousePos.y * 2 : 0,
              }}
            >
              {movie.title}
            </h3>
            <p className="text-gray-400 text-[11px] font-medium line-clamp-1">{displayGenres}</p>
          </div>

          <div className="flex items-center justify-between mt-1 text-[10px] text-gray-500 font-semibold border-t border-white/5 pt-2">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{displayDuration || "N/A"}</span>
            </div>
            {movie.releaseDate && (
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
            )}
          </div>
        </div>

        {/* Hover metadata & Quick Actions expansion */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.22, duration: 0.2 }}
              className="absolute inset-x-0 bottom-0 bg-neutral-900/95 border-t border-white/5 p-4 z-30 flex flex-col gap-3 shadow-[0_-5px_15px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={handleBookTicket}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:brightness-110 text-white font-bold text-xs py-2 px-3 rounded-lg shadow-md active:scale-95 transition-all"
                >
                  <Ticket className="h-3.5 w-3.5" />
                  Đặt Vé
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onExpand();
                  }}
                  className="flex items-center justify-center bg-white/10 hover:bg-white/15 text-white font-bold text-xs p-2 rounded-lg backdrop-blur-md active:scale-95 transition-all"
                  title="Chi tiết phim"
                >
                  <Info className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CinematicMovieCard;
