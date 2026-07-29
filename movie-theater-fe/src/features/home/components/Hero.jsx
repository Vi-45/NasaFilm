import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Play, Ticket, Star, Clock } from "lucide-react";
import { useNowShowingMovies } from "../hooks/useHomeQueries";
import { mapApiMovies, pickPosterMediaUrl, getMovieTrailerUrl, getMovieDetailPath } from "../utils/movieUtils";
import TrailerModal from "./TrailerModal";

const HERO_TRAILER_SRC = "/Interstellar-Trailer.mp4";

const FALLBACK_MOVIE = {
  uuid: "interstellar-featured",
  title: "Interstellar",
  description: "Khi Trái Đất dần trở nên kiệt quệ và không còn là nơi sinh sống thích hợp cho nhân loại, một nhóm nhà du hành vũ trụ đã thực hiện chuyến hành trình vĩ đại vượt qua lỗ sâu để tìm kiếm một hành tinh mới có thể duy trì sự sống.",
  genres: ["Khoa học Viễn tưởng", "Kịch tính", "Phiêu lưu"],
  rating: 8.7,
  durationMinutes: 169,
  ageRestriction: "T13",
  posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600",
  trailerUrl: "https://www.youtube.com/watch?v=zSWdZAWr3Tk",
};

const Hero = () => {
  const navigate = useNavigate();
  const { data, isError } = useNowShowingMovies();
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const videoRef = useRef(null);

  // 3D Card Hover Perspective Values
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const rotateX = useTransform(cardY, [-100, 100], [15, -15]);
  const rotateY = useTransform(cardX, [-100, 100], [-15, 15]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const tryPlay = () => {
      video.play().catch(() => {
        setVideoReady(true);
      });
    };

    const onCanPlay = () => {
      setVideoReady(true);
      tryPlay();
    };

    const onError = () => setVideoFailed(true);

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onError);

    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      onCanPlay();
    }

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onError);
    };
  }, []);

  const featuredMovie = useMemo(() => {
    try {
      if (data?.content && data.content.length > 0) {
        const mapped = mapApiMovies(data.content);
        const first = mapped[0];
        if (first && first.title) {
          return {
            uuid: first.uuid,
            title: first.title,
            description: first.description || FALLBACK_MOVIE.description,
            genres: first.genres || [first.genre] || FALLBACK_MOVIE.genres,
            rating: first.reviewAverageRating || FALLBACK_MOVIE.rating,
            durationMinutes: first.durationMinutes || 120,
            ageRestriction: first.ageRestriction || "T13",
            posterUrl: pickPosterMediaUrl(first) || FALLBACK_MOVIE.posterUrl,
            trailerUrl: getMovieTrailerUrl(first) || FALLBACK_MOVIE.trailerUrl,
          };
        }
      }
    } catch (e) {
      // Safe fallback on mapping error
    }
    return FALLBACK_MOVIE;
  }, [data]);

  const displayDuration = useMemo(() => {
    const mins = featuredMovie.durationMinutes;
    if (!mins) return "";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }, [featuredMovie.durationMinutes]);

  const handleMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    cardX.set(mouseX);
    cardY.set(mouseY);
  };

  const handleMouseLeave = () => {
    cardX.set(0);
    cardY.set(0);
  };

  const handleBookTicket = () => {
    const path = getMovieDetailPath(featuredMovie.uuid, { online: false });
    navigate(path);
  };

  return (
    <section className="relative min-h-[95vh] md:min-h-screen w-full flex items-center pt-24 pb-32 overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {!videoFailed && (
          <video
            ref={videoRef}
            src={HERO_TRAILER_SRC}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              videoReady ? "opacity-45" : "opacity-0"
            }`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Movie Info */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/25 bg-red-600/10 text-red-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Phim Hot Đang Chiếu
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-300">
              {featuredMovie.rating && (
                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/5 font-semibold text-yellow-400">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {Number(featuredMovie.rating).toFixed(1)}
                </div>
              )}
              {displayDuration && (
                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/5 font-semibold">
                  <Clock className="h-4 w-4 text-gray-400" />
                  {displayDuration}
                </div>
              )}
              {featuredMovie.ageRestriction && (
                <span className="bg-red-600/90 text-white text-[11px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  {featuredMovie.ageRestriction}
                </span>
              )}
              {featuredMovie.genres && (
                <span className="text-gray-400 font-medium">
                  {featuredMovie.genres.join(" · ")}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7.5xl font-black uppercase tracking-tight text-white leading-[1.05]">
              {featuredMovie.title}
            </h1>

            <p className="text-sm md:text-base text-gray-300/90 max-w-xl leading-relaxed font-medium line-clamp-4">
              {featuredMovie.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleBookTicket}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:brightness-110 text-white font-bold py-3.5 px-7 rounded-xl transition-all duration-300 shadow-[0_8px_30px_rgba(220,38,38,0.3)] active:scale-95 group"
              >
                <Ticket className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                Đặt Vé Ngay
              </button>
              
              {featuredMovie.trailerUrl && (
                <button
                  onClick={() => setIsTrailerOpen(true)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold py-3.5 px-7 rounded-xl backdrop-blur-md transition-all duration-300 active:scale-95 group"
                >
                  <Play className="h-5 w-5 fill-white group-hover:scale-110 transition-transform duration-300" />
                  Xem Trailer
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Standalone 3D Interactive Hero Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              className="relative w-72 h-[420px]"
              style={{ perspective: "1000px" }}
            >
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleBookTicket}
                whileHover={{ scale: 1.06 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full h-full rounded-2xl overflow-hidden cursor-pointer select-none bg-neutral-900 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_60px_rgba(229,9,20,0.25)] hover:border-red-500/50 transition-shadow duration-300 relative group flex flex-col justify-between"
              >
                {/* Poster Area */}
                <div className="relative w-full h-[330px] overflow-hidden bg-neutral-950">
                  <img
                    src={featuredMovie.posterUrl}
                    alt={featuredMovie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                  
                  {/* Subtle Glow Overlay */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Info Bar */}
                <div className="p-4 flex-1 flex flex-col justify-center bg-neutral-900 border-t border-white/5">
                  <h3 className="text-white font-black text-sm uppercase tracking-wide truncate group-hover:text-red-500 transition-colors">
                    {featuredMovie.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1 font-semibold">
                    <span className="truncate">{featuredMovie.genres?.[0] || "Phim Hay"}</span>
                    {featuredMovie.rating && (
                      <span className="text-yellow-400 flex items-center gap-0.5">
                        ⭐ {Number(featuredMovie.rating).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>

      {/* Trailer Modal */}
      {featuredMovie.trailerUrl && (
        <TrailerModal
          open={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
          title={featuredMovie.title}
          trailerUrl={featuredMovie.trailerUrl}
        />
      )}
    </section>
  );
};

export default Hero;
