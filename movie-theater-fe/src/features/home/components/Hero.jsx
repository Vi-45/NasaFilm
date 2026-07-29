import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useNowShowingMovies, useUpcomingMovies } from "../hooks/useHomeQueries";
import { mapApiMovies, pickPosterMediaUrl } from "../utils/movieUtils";
import {
  FALLBACK_POSTER,
  probeImageUrl,
  resolveSafePosterUrl,
} from "../../../shared/utils/mediaUrlUtils";
import HeroMovieDetailPanel from "./HeroMovieDetailPanel";
import "./Hero.css";

const DomeGallery = lazy(() => import("./DomeGallery"));

const AUTO_HIGHLIGHT_DELAY_MS = 9000;
const AUTO_HIGHLIGHT_INITIAL_MS = 7500;

const FALLBACK_POSTERS = [
  {
    src: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=480&auto=format&fit=crop",
    alt: "Cinema",
    movie: null,
  },
  {
    src: "https://images.unsplash.com/photo-1536440136627-eb85e2c5e0e4?q=80&w=480&auto=format&fit=crop",
    alt: "Movie night",
    movie: null,
  },
  {
    src: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=480&auto=format&fit=crop",
    alt: "Film reel",
    movie: null,
  },
  {
    src: "https://images.unsplash.com/photo-1517604931441-175ad6222228?q=80&w=480&auto=format&fit=crop",
    alt: "Theater seats",
    movie: null,
  },
  {
    src: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=480&auto=format&fit=crop",
    alt: "Projector light",
    movie: null,
  },
  {
    src: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=480&auto=format&fit=crop",
    alt: "Popcorn",
    movie: null,
  },
];

const toDomeItems = (payload) => {
  const list = payload?.content || payload || [];
  if (!Array.isArray(list) || !list.length) return [];

  const seen = new Set();
  return mapApiMovies(list)
    .map((movie) => {
      const raw = pickPosterMediaUrl(movie) || movie?.primaryMediaUrl || movie?.poster || "";
      const src = resolveSafePosterUrl(raw, 360);
      if (!src || src === FALLBACK_POSTER) return null;
      if (seen.has(src)) return null;
      seen.add(src);
      return {
        src,
        alt: movie?.title || "Phim",
        movie,
        raw,
      };
    })
    .filter(Boolean);
};

const Hero = () => {
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const tryPlay = () => {
      video.play().catch(() => {
        // Autoplay blocked — still show first frame once metadata loads
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
      cancelled = true;
    };
  }, [candidateItems]);

  const highlightIndices = useMemo(
    () =>
      domeItems
        .map((item, index) => (item.movie ? index : null))
        .filter((index) => index !== null)
        .slice(0, 10),
    [domeItems],
  );

  const triggerAutoHighlight = useCallback(() => {
    if (userInteractedRef.current || highlightIndices.length === 0) return;
    if (!heroInView || document.hidden || !postersReady) return;
    const cursor = highlightCursorRef.current % highlightIndices.length;
    const index = highlightIndices[cursor];
    highlightCursorRef.current = cursor + 1;
    autoHighlightingRef.current = true;
    setAutoOpenIndex(index);
    setAutoOpenSignal((n) => n + 1);
  }, [highlightIndices, heroInView, postersReady]);

  const handleImageSelect = useCallback((item) => {
    if (!autoHighlightingRef.current) {
      userInteractedRef.current = true;
    }
    autoHighlightingRef.current = false;
    setSelectedItem(item);
  }, []);

  const handleDetailClose = useCallback(() => {
    setSelectedItem(null);
  }, []);

  useEffect(() => {
    selectedRef.current = Boolean(selectedItem);
  }, [selectedItem]);

  const handleGalleryInteract = useCallback(() => {
    userInteractedRef.current = true;
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroInView(entry.isIntersecting && entry.intersectionRatio > 0.08);
      },
      { threshold: [0, 0.08, 0.25] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative min-h-[90vh] md:min-h-screen w-full flex items-center pt-24 pb-32 overflow-hidden bg-black">
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
              videoReady ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-neutral-950/25" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-20 w-full flex flex-col justify-center h-full">
        <div className="max-w-2xl text-left space-y-4 md:space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/20 bg-red-600/10 text-red-400 text-xs font-extrabold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            HỆ THỐNG RẠP CHIẾU PHIM HIỆN ĐẠI
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7.5xl font-black uppercase tracking-tight text-white leading-[1.05]">
            VŨ TRỤ ĐIỆN ẢNH <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">
              TRONG TẦM TAY
            </span>
          </h1>

          <p className="text-sm md:text-base text-gray-300 max-w-lg leading-relaxed font-medium">
            Trải nghiệm điện ảnh đỉnh cao với hệ thống rạp hiện đại, đặt vé
            nhanh chóng và thưởng thức phim bom tấn mới nhất.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
