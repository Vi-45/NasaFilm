import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, X, Play, RotateCcw, Check, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import shadowsOfTheNeonImg from '../../../shared/assets/shadows_of_the_neon.png';
import theSilentArchitectImg from '../../../shared/assets/the_silent_architect.png';
import monolithProtocolImg from '../../../shared/assets/monolith_protocol.png';
import melancholyCityImg from '../../../shared/assets/melancholy_city.png';
import './WatchHistoryPage.css';

const INITIAL_HISTORY = [
  {
    id: 'shadows-of-the-neon',
    title: 'BÓNG ĐÊM NEON (SHADOWS OF THE NEON)',
    tag: '4K',
    image: shadowsOfTheNeonImg,
    progress: 65,
    lastWatched: '24 THG 10, 2024',
    type: 'streaming'
  },
  {
    id: 'the-silent-architect',
    title: 'KIẾN TRÚC SƯ LẶNG LẼ (THE SILENT ARCHITECT)',
    tag: 'HDR',
    image: theSilentArchitectImg,
    progress: 92,
    lastWatched: '22 THG 10, 2024',
    type: 'streaming'
  },
  {
    id: 'monolith-protocol',
    title: 'NGHỊ ĐỊNH THƯ MONOLITH (MONOLITH PROTOCOL)',
    tag: 'IMAX',
    image: monolithProtocolImg,
    progress: 12,
    lastWatched: '19 THG 10, 2024',
    type: 'theatrical'
  },
  {
    id: 'melancholy-city',
    title: 'THÀNH PHỐ U SẦU (MELANCHOLY CITY)',
    tag: 'HD',
    image: melancholyCityImg,
    progress: 100, // Watched
    lastWatched: '15 THG 10, 2024',
    type: 'streaming'
  }
];

const EXTRA_ENTRIES = [
  {
    id: 'eternal-neon',
    title: 'ÁNH SÁNG VĨNH HẰNG (ETERNAL NEON)',
    tag: '4K',
    image: shadowsOfTheNeonImg, // recycling alley still
    progress: 45,
    lastWatched: '12 THG 10, 2024',
    type: 'streaming'
  },
  {
    id: 'carbon-echo',
    title: 'TIẾNG VỌNG CARBON (CARBON ECHO)',
    tag: 'HD',
    image: theSilentArchitectImg,
    progress: 100,
    lastWatched: '08 THG 10, 2024',
    type: 'theatrical'
  }
];

export default function WatchHistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [activeTab, setActiveTab] = useState('TẤT CẢ');
  const [sortOption, setSortOption] = useState('recently-watched');
  const [isSortingOpen, setIsSortingOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Remove single entry
  const handleRemoveEntry = (id, e) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  // Clear all entries
  const handleClearHistory = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử xem phim?")) {
      setHistory([]);
    }
  };

  // Load more mock data
  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setHistory(prev => [...prev, ...EXTRA_ENTRIES]);
      setLoadingMore(false);
      setHasMore(false); // No more extra mock entries
    }, 800);
  };

  // Filter history
  const filteredHistory = history.filter(item => {
    if (activeTab === 'TẤT CẢ') return true;
    if (activeTab === 'XEM ONLINE') return item.type === 'streaming';
    if (activeTab === 'XEM TẠI RẠP') return item.type === 'theatrical';
    return true;
  });

  return (
    <div className="watch-history-wrapper bg-[#0D0B0A] text-[#E5D4C0] min-h-screen flex flex-col justify-between font-mono">
      <Navbar />

      <main className="flex-grow max-w-[1280px] w-full mx-auto px-4 md:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="breadcrumbs text-[10px] tracking-[0.2em] font-mono text-[#A49382] mb-6 uppercase">
          <Link to="/profile" className="hover:text-[#E6C594] transition-colors">THÔNG TIN</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-[#E6C594]">LỊCH SỬ XEM PHIM</span>
        </div>

        {/* Title & Clear Action */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="watch-history-title font-heading text-4xl md:text-5xl font-black text-[#E6C594] tracking-tight uppercase">
              LỊCH SỬ XEM PHIM
            </h1>
            <p className="text-xs text-[#A49382] mt-2 max-w-xl font-sans leading-relaxed">
              Kho lưu trữ phim cá nhân của bạn. Tiếp tục xem các bộ phim đang dang dở hoặc thưởng thức lại những tác phẩm điện ảnh yêu thích.
            </p>
          </div>
          
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="clear-history-btn flex items-center gap-2 px-4 py-2 border border-[#A49382]/30 hover:border-[#E6C594] hover:text-[#E6C594] text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-300 rounded-sm"
            >
              <Trash2 size={13} />
              XÓA LỊCH SỬ
            </button>
          )}
        </div>

        {/* Toolbar: Filter & Sort */}
        <div className="toolbar flex flex-col sm:flex-row justify-between items-stretch sm:items-center border-b border-[#2A241E] pb-4 mb-8 gap-4">
          {/* Tabs */}
          <div className="tabs flex gap-2">
            {['TẤT CẢ', 'XEM ONLINE', 'XEM TẠI RẠP'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-btn px-5 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-sm ${
                  activeTab === tab
                    ? 'bg-[#E6C594] text-[#0D0B0A] shadow-md shadow-[#E6C594]/10'
                    : 'bg-[#181512] text-[#A49382] hover:text-[#E5D4C0] hover:bg-[#201D19]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative sort-container self-end sm:self-auto">
            <button
              onClick={() => setIsSortingOpen(!isSortingOpen)}
              className="sort-trigger flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] text-[#A49382] hover:text-[#E6C594] uppercase transition-colors"
            >
              SẮP XẾP: <span className="text-[#E6C594]">XEM GẦN ĐÂY</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${isSortingOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSortingOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsSortingOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-[#181512] border border-[#2A241E] shadow-2xl z-25 rounded-sm p-1">
                  <button
                    onClick={() => {
                      setSortOption('recently-watched');
                      setIsSortingOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-[10px] tracking-[0.1em] font-bold hover:bg-[#2A241E] hover:text-[#E6C594] text-[#A49382] uppercase transition-colors rounded-sm"
                  >
                    Xem Gần Đây
                  </button>
                  <button
                    onClick={() => {
                      setSortOption('completion');
                      setIsSortingOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-[10px] tracking-[0.1em] font-bold hover:bg-[#2A241E] hover:text-[#E6C594] text-[#A49382] uppercase transition-colors rounded-sm"
                  >
                    Tiến Độ Xem %
                  </button>
                  <button
                    onClick={() => {
                      setSortOption('title');
                      setIsSortingOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-[10px] tracking-[0.1em] font-bold hover:bg-[#2A241E] hover:text-[#E6C594] text-[#A49382] uppercase transition-colors rounded-sm"
                  >
                    Tên Phim
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Grid */}
        {filteredHistory.length === 0 ? (
          <div className="empty-state py-20 flex flex-col items-center justify-center text-center border border-dashed border-[#2A241E] rounded-md bg-[#13110E]/40">
            <p className="text-[#A49382] text-sm mb-4">Không có mục nào trong danh sách lịch sử xem phim của bạn.</p>
            <button
              onClick={() => setHistory(INITIAL_HISTORY)}
              className="px-6 py-2 bg-[#E6C594] text-[#0D0B0A] text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:scale-105 rounded-sm"
            >
              KHÔI PHỤC LỊCH SỬ
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {filteredHistory.map(movie => {
              const isWatched = movie.progress >= 100;
              return (
                <div key={movie.id} className="movie-card bg-[#13110E] border border-[#2A241E] hover:border-[#E6C594]/30 rounded-sm overflow-hidden flex flex-col transition-all duration-300 group shadow-md hover:shadow-xl hover:-translate-y-1">
                  {/* Image & Overlay */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-black">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-95"
                    />

                    {/* Progress Info Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-6 flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[9px] font-bold tracking-wider font-mono">
                        <span className="text-[#E6C594]">
                          {isWatched ? 'ĐÃ XEM XONG' : `ĐÃ XEM ${movie.progress}%`}
                        </span>
                        <span>
                          {isWatched ? <Check size={12} className="text-[#E6C594]" /> : <Play size={10} className="text-[#A49382]" />}
                        </span>
                      </div>
                      
                      {/* Golden Progress Bar */}
                      <div className="w-full h-[3px] bg-[#2A241E] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#E6C594]" 
                          style={{ width: `${movie.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="p-4 flex-grow flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <h3 className="movie-title font-heading text-xs font-bold tracking-wider text-[#E5D4C0] group-hover:text-[#E6C594] transition-colors leading-tight">
                          {movie.title}
                        </h3>
                        <span className="text-[8px] font-bold tracking-widest bg-[#2A241E] text-[#E6C594] px-1.5 py-0.5 rounded-sm shrink-0 border border-[#E6C594]/20 font-mono">
                          {movie.tag}
                        </span>
                      </div>
                      <div className="text-[9px] font-mono text-[#A49382] flex items-center gap-1.5">
                        <span>XEM GẦN NHẤT:</span>
                        <span className="text-[#E5D4C0]/80">{movie.lastWatched}</span>
                      </div>
                    </div>

                    {/* Buttons Row */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/stream/watch/${movie.id}`)}
                        className="flex-grow py-2 bg-[#2A241E] hover:bg-[#E6C594] text-[#E6C594] hover:text-[#0D0B0A] text-[9px] font-extrabold tracking-[0.2em] uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-1.5"
                      >
                        {isWatched ? <RotateCcw size={11} /> : <Play size={10} />}
                        {isWatched ? 'XEM LẠI' : 'TIẾP TỤC'}
                      </button>

                      <button
                        onClick={(e) => handleRemoveEntry(movie.id, e)}
                        className="px-3 border border-[#2A241E] hover:border-[#ef4444] text-[#A49382] hover:text-[#ef4444] hover:bg-[#ef4444]/5 transition-all duration-300 rounded-sm flex items-center justify-center"
                        title="Xóa khỏi lịch sử"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && history.length > 0 && (
          <div className="flex justify-center mt-12 mb-8">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="load-more-btn px-8 py-3 border border-[#E6C594]/40 hover:border-[#E6C594] text-[#E6C594] text-[10px] font-bold tracking-[0.25em] uppercase hover:bg-[#E6C594]/5 transition-all duration-300 rounded-sm disabled:opacity-50 flex items-center gap-2"
            >
              {loadingMore ? (
                <>
                  <span className="spinner w-3 h-3 border-t-2 border-[#E6C594] animate-spin rounded-full block" />
                  ĐANG TẢI...
                </>
              ) : (
                'TẢI THÊM PHIM ĐÃ XEM'
              )}
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
