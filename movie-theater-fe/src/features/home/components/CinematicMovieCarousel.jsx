import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CinematicMovieCard from "./CinematicMovieCard";
import ExpandedMovieDetail from "./ExpandedMovieDetail";
import MovieCardSkeleton from "./MovieCardSkeleton";

const CinematicMovieCarousel = ({
  title,
  moviesList = [],
  isLoading = false,
  scrollSpeed = 50, // seconds for one full loop
}) => {
  const [expandedMovieId, setExpandedMovieId] = useState(null);

  if (!isLoading && moviesList.length === 0) {
    return null;
  }

  // Create list padding for marquee
  let displayMovies = [...moviesList];
  if (displayMovies.length > 0) {
    while (displayMovies.length < 8) {
      displayMovies = [...displayMovies, ...moviesList];
    }
  }

  // Double it for smooth infinite looping
  const marqueeMovies = [...displayMovies, ...displayMovies];

  const handleExpand = (movieId) => {
    if (expandedMovieId === movieId) {
      setExpandedMovieId(null);
    } else {
      setExpandedMovieId(movieId);
    }
  };

  return (
    <section className="relative my-10 px-4 md:px-8">
      {/* Title */}
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider border-l-4 border-red-600 pl-3">
          {title}
        </h2>
        <span className="text-xs text-gray-500 font-semibold tracking-widest uppercase">
          Cuộn Tự Động
        </span>
      </div>

      {/* Outer Scroller Frame */}
      <div className="relative w-full overflow-hidden py-4 select-none">
        {isLoading ? (
          <div className="flex gap-6 max-w-7xl mx-auto px-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div
            className="flex w-max"
            style={{
              animation: `marquee ${scrollSpeed}s linear infinite`,
              // Pause animation on hover or when a movie is expanded in this row
              animationPlayState: (expandedMovieId ? "paused" : "running"),
            }}
            // Added classes for hover pausing
            onMouseEnter={(e) => {
              if (!expandedMovieId) {
                e.currentTarget.style.animationPlayState = "paused";
              }
            }}
            onMouseLeave={(e) => {
              if (!expandedMovieId) {
                e.currentTarget.style.animationPlayState = "running";
              }
            }}
          >
            {marqueeMovies.map((movie, index) => {
              // Ensure key is unique
              const uniqueKey = `${movie.uuid || movie.id || index}-${index}`;
              return (
                <div key={uniqueKey} className="flex-shrink-0">
                  <CinematicMovieCard
                    movie={movie}
                    isExpanded={expandedMovieId === movie.uuid}
                    onExpand={() => handleExpand(movie.uuid)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Expanded Movie Details Render Area */}
      <AnimatePresence>
        {expandedMovieId && (
          <ExpandedMovieDetail
            movie={moviesList.find((m) => m.uuid === expandedMovieId) || displayMovies.find((m) => m.uuid === expandedMovieId)}
            onClose={() => setExpandedMovieId(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default CinematicMovieCarousel;
