import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Plus, Check, Star, Video, Tv, Key, ShieldCheck, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Asset imports
import shadowsOfTheNeonImg from '../../../shared/assets/shadows_of_the_neon.png';
import theSilentArchitectImg from '../../../shared/assets/the_silent_architect.png';
import monolithProtocolImg from '../../../shared/assets/monolith_protocol.png';
import melancholyCityImg from '../../../shared/assets/melancholy_city.png';
import eternalNeonImg from '../../../shared/assets/eternal_neon.png';

import './StreamingHomePage.css';

// Movie Database for Catalog
const CATALOG_MOVIES = [
  {
    id: 'eternal-neon',
    title: 'ÁNH SÁNG VĨNH HẰNG',
    englishTitle: 'ETERNAL NEON',
    tag: '4K HDR',
    rating: '8.9',
    category: 'VIỄN TƯỞNG / NOIR',
    image: eternalNeonImg,
    duration: '2h 12m'
  },
  {
    id: 'shadows-of-the-neon',
    title: 'BÓNG ĐÊM NEON',
    englishTitle: 'SHADOWS OF THE NEON',
    tag: '4K',
    rating: '8.7',
    category: 'NOIR / GIẬT GÂN',
    image: shadowsOfTheNeonImg,
    duration: '1h 56m'
  },
  {
    id: 'the-silent-architect',
    title: 'KIẾN TRÚC SƯ LẶNG LẼ',
    englishTitle: 'THE SILENT ARCHITECT',
    tag: 'HDR',
    rating: '9.1',
    category: 'TÀI LIỆU / NGHỆ THUẬT',
    image: theSilentArchitectImg,
    duration: '2h 05m'
  },
  {
    id: 'monolith-protocol',
    title: 'NGHỊ ĐỊNH THƯ MONOLITH',
    englishTitle: 'MONOLITH PROTOCOL',
    tag: 'IMAX HD',
    rating: '8.5',
    category: 'VIỄN TƯỞNG / HÀNH ĐỘNG',
    image: monolithProtocolImg,
    duration: '2h 18m'
  },
  {
    id: 'melancholy-city',
    title: 'THÀNH PHỐ U SẦU',
    englishTitle: 'MELANCHOLY CITY',
    tag: 'HD',
    rating: '9.3',
    category: 'CHÍNH KỊCH / LÃNG MẠN',
    image: melancholyCityImg,
    duration: '1h 48m'
  }
];

// Mock watch history preview
const MOCK_HISTORY = [
  { id: 'shadows-of-the-neon', title: 'Bóng Đêm Neon', image: shadowsOfTheNeonImg, progress: 65, tag: '4K' },
  { id: 'the-silent-architect', title: 'Kiến Trúc Sư Lặng Lẽ', image: theSilentArchitectImg, progress: 92, tag: 'HDR' }
];

export default function StreamingHomePage() {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState({});

  const toggleWatchlist = (id, e) => {
    e.stopPropagation();
    setWatchlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="streaming-home bg-[#060608] text-white min-h-screen flex flex-col justify-between font-sans">
      <Navbar />

      {/* Hero Featured Movie Section */}
      <section className="relative w-full aspect-[21/9] md:aspect-[25/9] overflow-hidden bg-black border-b border-white/5">
        {/* Background poster with glow */}
        <div className="absolute inset-0 select-none">
          <img 
            src={eternalNeonImg} 
            alt="Ánh sáng vĩnh hằng" 
            className="w-full h-full object-cover opacity-60 scale-102 blur-[1px]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-black/30" />
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#060608] via-[#060608]/70 to-transparent" />
          {/* Radial Red Glow to match web theme */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8 flex flex-col items-start gap-4">
            <span className="px-2.5 py-0.5 bg-red-600/15 border border-red-500/35 text-[9px] font-black tracking-widest text-[#ef4444] rounded-md font-mono">
              PHIM NỔI BẬT HÔM NAY
            </span>
            <h1 className="font-heading text-3xl md:text-5xl font-black tracking-tight text-white leading-none">
              ÁNH SÁNG VĨNH HẰNG
            </h1>
            <p className="text-[10px] md:text-xs text-gray-400 font-mono tracking-widest uppercase">
              ETERNAL NEON • VIỄN TƯỞNG / NOIR • 2H 12M
            </p>
            <p className="max-w-xl text-xs text-gray-300 leading-relaxed font-sans line-clamp-3 hidden sm:block">
              Tại một đô thị đổ nát nơi ánh sáng ban ngày chỉ còn là ký ức xa xôi, một người vận chuyển dữ liệu đơn độc tình cờ phát hiện ra một tín hiệu mã hóa bí ẩn trong nhịp đập của thành phố...
            </p>
            <div className="flex gap-3 mt-2">
              <button 
                onClick={() => navigate('/stream/movie/eternal-neon')}
                className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold text-xs tracking-widest uppercase rounded-xl transition-all shadow-md shadow-red-600/20 flex items-center gap-2"
              >
                <Play size={13} fill="currentColor" /> XEM NGAY
              </button>
              <button 
                onClick={(e) => toggleWatchlist('eternal-neon', e)}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold tracking-wider uppercase rounded-xl transition-all"
              >
                {watchlist['eternal-neon'] ? '✓ TRONG DANH SÁCH' : '+ DANH SÁCH THEO DÕI'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Catalog */}
      <main className="max-w-[1280px] w-full mx-auto px-4 md:px-8 py-10 space-y-12">

        {/* 1. Quick Activation Card (Image 5 inspiration, styled to fit web theme) */}
        <section className="bg-gradient-to-r from-red-950/20 to-[#121826]/30 border border-red-900/20 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="space-y-2">
            <span className="flex items-center gap-2 text-xs font-bold text-red-500 font-mono">
              <Key size={14} />
              KÍCH HOẠT VÉ SỐ TRỰC TUYẾN
            </span>
            <h3 className="font-heading text-lg md:text-xl font-bold text-white tracking-tight uppercase leading-tight">
              ĐỔI VÉ VẬT LÝ LẤY QUYỀN TRUY CẬP TRỰC TUYẾN
            </h3>
            <p className="text-xs text-gray-400 max-w-xl font-sans leading-relaxed">
              Bạn đang sở hữu vé xem phim vật lý của rạp chiếu phim NASAFilm? Nhập mã kích hoạt gồm 12 ký tự để bắt đầu thưởng thức phim trực tuyến độ phân giải 4K ngay hôm nay.
            </p>
          </div>

          <button
            onClick={() => navigate('/stream/activate')}
            className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-black tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-red-600/10 flex items-center gap-2 group-hover:scale-102 shrink-0"
          >
            NHẬP MÃ BẮT ĐẦU <ArrowRight size={13} />
          </button>
        </section>

        {/* 2. Streaming Catalog Row */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg md:text-xl font-black text-white tracking-wider uppercase flex items-center gap-2 border-l-2 border-red-600 pl-3">
            DANH MỤC PHIM ONLINE CAO CẤP
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {CATALOG_MOVIES.map(movie => (
              <div 
                key={movie.id} 
                onClick={() => navigate(`/stream/movie/${movie.id}`)}
                className="bg-[#13110E]/30 border border-white/5 hover:border-red-500/20 rounded-xl overflow-hidden flex flex-col transition-all duration-300 group shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                  {/* Quality tag overlay */}
                  <span className="absolute top-2.5 left-2.5 text-[8px] font-bold tracking-widest bg-red-600/90 text-white px-1.5 py-0.5 rounded-sm border border-red-500/20 font-mono">
                    {movie.tag}
                  </span>
                  
                  {/* Play Hover state */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity duration-300">
                    <div className="w-10 h-10 rounded-full border border-red-500 flex items-center justify-center bg-black/60 text-red-500 shadow-2xl">
                      <Play size={14} fill="currentColor" className="ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Info details */}
                <div className="p-3.5 flex-grow flex flex-col justify-between gap-3 bg-[#0d0d11]">
                  <div>
                    <h3 className="font-heading text-xs font-bold tracking-wide text-white group-hover:text-red-500 transition-colors truncate">
                      {movie.title}
                    </h3>
                    <p className="text-[8px] font-mono text-gray-500 mt-1 uppercase truncate">{movie.category}</p>
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-mono text-gray-400 mt-1">
                    <div className="flex items-center gap-0.5 text-red-500">
                      <Star size={10} fill="currentColor" />
                      <span className="font-bold text-gray-300">{movie.rating}</span>
                    </div>
                    <span>{movie.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. History Preview and Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* History card widget */}
          <div className="md:col-span-2 bg-[#121826]/30 border border-white/5 p-5 rounded-2xl flex flex-col justify-between gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="text-xs font-bold tracking-wider font-mono text-white uppercase flex items-center gap-2">
                <Tv size={14} className="text-red-500" />
                TIẾP TỤC XEM PHIM
              </h3>
              <Link to="/stream/history" className="text-[9px] font-bold text-gray-400 hover:text-red-500 transition-colors">
                LỊCH SỬ XEM PHIM
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_HISTORY.map(hist => (
                <div 
                  key={hist.id}
                  onClick={() => navigate(`/stream/watch/${hist.id}`)}
                  className="flex gap-3 bg-white/3 border border-white/5 p-2 hover:border-red-500/20 cursor-pointer transition-all duration-300 rounded-xl group"
                >
                  <div className="w-28 aspect-video rounded-lg overflow-hidden bg-black shrink-0 relative">
                    <img src={hist.image} alt={hist.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                      <Play size={10} fill="#ef4444" className="text-red-500" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
                    <p className="text-[10px] font-bold text-white group-hover:text-red-500 transition-colors truncate">{hist.title}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] font-mono text-gray-400">
                        <span>Đã xem {hist.progress}%</span>
                        <span className="text-red-500 font-bold">{hist.tag}</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-red-655 bg-red-600" style={{ width: `${hist.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Service info */}
          <div className="bg-[#121826]/30 border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
            <h3 className="text-xs font-bold tracking-wider font-mono text-white uppercase flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              BẢO MẬT BẢN QUYỀN
            </h3>
            <p className="text-[10px] text-gray-400 leading-relaxed font-sans mt-2">
              NASAFilm sử dụng công nghệ mã hóa DRM mã nguồn mở tiên tiến giúp bảo mật tuyệt đối luồng phát. Mọi hành vi sao chép lậu video sẽ bị tự động khóa tài khoản truy cập.
            </p>
            <div className="text-[8px] font-mono text-red-500/80 mt-4 uppercase">
              Hỗ trợ 24/7: support@nasafilm.vn
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
