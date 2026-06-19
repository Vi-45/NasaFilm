import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Plus, Check, Star, Video, Eye, Award } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Asset imports
import avatarMarcus from '../../../shared/assets/avatar_marcus.png';
import avatarElena from '../../../shared/assets/avatar_elena.png';
import avatarSasha from '../../../shared/assets/avatar_sasha.png';
import avatarJulian from '../../../shared/assets/avatar_julian.png';
import eternalNeonImg from '../../../shared/assets/eternal_neon.png';
import shadowsOfTheNeonImg from '../../../shared/assets/shadows_of_the_neon.png';
import theSilentArchitectImg from '../../../shared/assets/the_silent_architect.png';
import monolithProtocolImg from '../../../shared/assets/monolith_protocol.png';
import melancholyCityImg from '../../../shared/assets/melancholy_city.png';

// Video imports
import interstellarTrailer from '../../../shared/assets/Interstellar-Trailer.mp4';
import swordTrailer from '../../../shared/assets/Sword-Trailer.mp4';

import './StreamPlayerPage.css';

// Movie Database for streaming in Vietnamese
const STREAMING_MOVIES = {
  'eternal-neon': {
    id: 'eternal-neon',
    title: 'ÁNH SÁNG VĨNH HẰNG (ETERNAL NEON)',
    rating: '8.9',
    votes: '24.5k Lượt đánh giá',
    pills: ['VIỄN TƯỞNG / NOIR', 'NĂM 2024', '2h 12m', 'HẠN CHẾ KHÁN GIẢ (R)'],
    synopsis: "Tại một đô thị đổ nát nơi ánh sáng ban ngày chỉ còn là ký ức xa xôi, một người vận chuyển dữ liệu đơn độc tình cờ phát hiện ra một tín hiệu mã hóa bí ẩn trong nhịp đập của thành phố. Khi ranh giới giữa trí tuệ nhân tạo và ý thức con người dần mờ nhạt, cô phải điều hướng qua mê cung của lòng tham tập đoàn và những bóng ma ba chiều để bảo tồn mảnh ký ức hữu cơ cuối cùng.",
    video: interstellarTrailer,
    poster: eternalNeonImg,
    director: 'Elias Thorne',
    cinematography: 'Sarah Vancore',
    cast: [
      { name: 'Marcas Sterling', character: 'NGƯỜI VẬN CHUYỂN', avatar: avatarMarcus },
      { name: 'Elena Rostova', character: 'ARIA-7', avatar: avatarElena }
    ]
  },
  'shadows-of-the-neon': {
    id: 'shadows-of-the-neon',
    title: 'BÓNG ĐÊM NEON (SHADOWS OF THE NEON)',
    rating: '8.7',
    votes: '18.9k Lượt đánh giá',
    pills: ['NOIR / GIẬT GÂN', 'NĂM 2024', '1h 56m', 'HẠN CHẾ KHÁN GIẢ (R)'],
    synopsis: "Dưới cơn mưa bất tận của một thành phố rực rỡ ánh đèn neon, một thám tử tư hoài nghi nhận một vụ mất tích thông thường, để rồi vô tình vạch trần một âm mưu kỹ thuật số tiếp cận đến tận các văn phòng cao cấp nhất của các siêu tập đoàn mạng.",
    video: swordTrailer,
    poster: shadowsOfTheNeonImg,
    director: 'Elias Thorne',
    cinematography: 'Sarah Vancore',
    cast: [
      { name: 'Marcas Sterling', character: 'THÁM TỬ VANCE', avatar: avatarMarcus },
      { name: 'Sasha Petrova', character: 'KHÁCH HÀNG', avatar: avatarSasha }
    ]
  },
  'the-silent-architect': {
    id: 'the-silent-architect',
    title: 'KIẾN TRÚC SƯ LẶNG LẼ (THE SILENT ARCHITECT)',
    rating: '9.1',
    votes: '14.2k Lượt đánh giá',
    pills: ['PHIM TÀI LIỆU / NGHỆ THUẬT', 'NĂM 2023', '2h 05m', 'DÀNH CHO MỌI ĐỐI TƯỢNG (G)'],
    synopsis: "Một cuộc khám phá sâu sắc về người kiến trúc sư đã xây dựng các môi trường sống dưới nước hoàn toàn tự động đầu tiên trên thế giới, chi tiết hóa những thách thức tâm lý và cấu trúc khi xây dựng bên dưới vực thẳm đại dương.",
    video: interstellarTrailer,
    poster: theSilentArchitectImg,
    director: 'Julius Vance',
    cinematography: 'Marcus Aurelius',
    cast: [
      { name: 'Julian Vance', character: 'BẢN THÂN', avatar: avatarJulian },
      { name: 'Elena Rostova', character: 'NGƯỜI DẪN CHUYỆN', avatar: avatarElena }
    ]
  },
  'monolith-protocol': {
    id: 'monolith-protocol',
    title: 'NGHỊ ĐỊNH THƯ MONOLITH (MONOLITH PROTOCOL)',
    rating: '8.5',
    votes: '32.1k Lượt đánh giá',
    pills: ['VIỄN TƯỞNG / HÀNH ĐỘNG', 'NĂM 2024', '2h 18m', 'KHÁN GIẢ TRÊN 13 TUỔI (PG-13)'],
    synopsis: "Khi một đài tưởng niệm ngoài hành tinh kích hoạt trên quỹ đạo, một nhóm các nhà khoa học và chuyên gia quân sự được cử đi giải mã thông điệp của nó trước khi sự hoảng loạn toàn cầu châm ngòi cho một cuộc chiến tranh hủy diệt Trái Đất.",
    video: swordTrailer,
    poster: monolithProtocolImg,
    director: 'Denis Villeneuve',
    cinematography: 'Roger Deakins',
    cast: [
      { name: 'Marcas Sterling', character: 'ĐẠI TÁ STEELE', avatar: avatarMarcus },
      { name: 'Sasha Petrova', character: 'BÁC SĨ ARIS', avatar: avatarSasha }
    ]
  },
  'melancholy-city': {
    id: 'melancholy-city',
    title: 'THÀNH PHỐ U SẦU (MELANCHOLY CITY)',
    rating: '9.3',
    votes: '8.4k Lượt đánh giá',
    pills: ['CHÍNH KỊCH / LÃNG MẠN', 'NĂM 2024', '1h 48m', 'HẠN CHẾ KHÁN GIẢ (R)'],
    synopsis: "Một bức chân dung sâu sắc về hai tâm hồn lạc lối giao nhau tại một ga trung chuyển mịt mù mưa, tìm thấy sự an ủi và kết nối trong sự chia ly chung của họ giữa một cảnh quan siêu đô thị hoang vắng.",
    video: interstellarTrailer,
    poster: melancholyCityImg,
    director: 'Wong Kar-wai',
    cinematography: 'Christopher Doyle',
    cast: [
      { name: 'Sasha Petrova', character: 'LỆ NA', avatar: avatarSasha },
      { name: 'Julian Vance', character: 'KENJI', avatar: avatarJulian }
    ]
  },
  // Up Next candidates
  'carbon-echo': {
    id: 'carbon-echo',
    title: 'Tiếng Vọng Carbon (Carbon Echo)',
    rating: '8.2',
    votes: '9.2k Lượt đánh giá',
    pills: ['VIỄN TƯỞNG', '2023', '1h 45m', 'R'],
    synopsis: "Trong một thế giới nơi ký ức được lưu trữ trong chip carbon, một kẻ buôn lậu ký ức thị trường đen bị săn đuổi sau khi có được một con chip chứa thông tin về một vụ ám sát chính trị chưa bao giờ xảy ra.",
    video: swordTrailer,
    poster: shadowsOfTheNeonImg,
    director: 'Elias Thorne',
    cinematography: 'Sarah Vancore',
    cast: [
      { name: 'Marcas Sterling', character: 'KẺ CHẠY TRỐN', avatar: avatarMarcus }
    ]
  },
  'silent-frame': {
    id: 'silent-frame',
    title: 'Khung Hình Lặng Lẽ (Silent Frame)',
    rating: '9.1',
    votes: '11.8k Lượt đánh giá',
    pills: ['PHIM TÀI LIỆU', '2024', '2h 05m', 'G'],
    synopsis: "Cái nhìn điện ảnh đằng sau hậu trường bảo tồn phim cổ điển, ghi lại những cuộc chiến thầm lặng chống lại hội chứng giấm, nguy cơ hỏa hoạn và sự suy tàn kỹ thuật số.",
    video: interstellarTrailer,
    poster: theSilentArchitectImg,
    director: 'Julius Vance',
    cinematography: 'Marcus Aurelius',
    cast: [
      { name: 'Julian Vance', character: 'NHÀ BẢO TỒN', avatar: avatarJulian }
    ]
  },
  'the-last-reel': {
    id: 'the-last-reel',
    title: 'Cuộn Phim Cuối Cùng (The Last Reel)',
    rating: '8.5',
    votes: '15.6k Lượt đánh giá',
    pills: ['CHÍNH KỊCH', '2023', '1h 58m', 'PG-13'],
    synopsis: "Một người vận hành rạp chiếu phim lâu năm suy ngẫm về sự suy tàn của máy chiếu phim nhựa và sự trỗi dậy của rạp chiếu kỹ thuật số trong khi chuẩn bị rạp chiếu phim độc lập của mình cho suất chiếu cuối cùng.",
    poster: monolithProtocolImg,
    video: swordTrailer,
    director: 'Sarah Vancore',
    cinematography: 'Elias Thorne',
    cast: [
      { name: 'Elena Rostova', character: 'CHÁU GÁI', avatar: avatarElena }
    ]
  }
};

export default function StreamPlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  // Determine current active movie, fallback to eternal-neon
  const defaultMovieId = id && STREAMING_MOVIES[id] ? id : 'eternal-neon';
  const [currentMovie, setCurrentMovie] = useState(STREAMING_MOVIES[defaultMovieId]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  // Sync state if URL id changes
  useEffect(() => {
    if (id && STREAMING_MOVIES[id]) {
      setCurrentMovie(STREAMING_MOVIES[id]);
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.load();
      }
    }
  }, [id]);

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error("Phát video thất bại", err);
        });
    }
  };

  const handleWatchlistToggle = () => {
    setIsInWatchlist(prev => !prev);
  };

  // Play a specific video source (e.g. promo featurette)
  const handlePlayFeaturette = () => {
    setCurrentMovie({
      ...STREAMING_MOVIES['eternal-neon'],
      title: 'HẬU TRƯỜNG CẢNH QUAY: NOIR (PHIM NGẮN)',
      video: swordTrailer,
      synopsis: "Phỏng vấn độc quyền với Đạo diễn Elias Thorne về các quyết định sáng tạo, ánh sáng và kỹ thuật quay phim nhằm tái hiện thế giới kỳ ảo đầy mê hoặc của Ánh Sáng Vĩnh Hằng."
    });
    setIsPlaying(false);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.log(e));
      }
    }, 100);
  };

  return (
    <div className="stream-player-wrapper bg-[#0A0908] text-[#E5D4C0] min-h-screen flex flex-col justify-between font-mono">
      <Navbar />

      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 md:px-8 py-8">
        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: Video Player and Movie Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Custom Video Player Container */}
            <div className="relative aspect-video bg-black border border-[#2A241E] rounded-sm overflow-hidden group">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src={currentMovie.video}
                controls={isPlaying}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Pause Cover Overlay */}
              {!isPlaying && (
                <div 
                  onClick={handlePlayToggle}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition-opacity duration-300"
                >
                  {/* Poster cover */}
                  <img
                    src={currentMovie.poster}
                    alt={currentMovie.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                  />
                  
                  {/* Play Button Icon */}
                  <div className="relative z-10 w-16 h-16 rounded-full border-2 border-[#E6C594] flex items-center justify-center bg-black/60 text-[#E6C594] hover:scale-110 hover:bg-[#E6C594] hover:text-[#0D0B0A] transition-all duration-300 shadow-2xl">
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </div>
                </div>
              )}
            </div>

            {/* Movie Info Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#2A241E] pb-5">
              <div>
                <h1 className="movie-watch-title font-heading text-3xl md:text-4xl font-black text-[#E6C594] tracking-tight uppercase">
                  {currentMovie.title}
                </h1>
                
                {/* Ratings block */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star size={16} fill="#E6C594" className="text-[#E6C594]" />
                    <span className="text-sm font-bold font-mono text-[#E5D4C0]">{currentMovie.rating}</span>
                  </div>
                  <span className="text-[10px] tracking-wider font-mono text-[#A49382] uppercase">
                    {currentMovie.votes}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleWatchlistToggle}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#E6C594]/10 hover:bg-[#E6C594] text-[#E6C594] hover:text-[#0D0B0A] border border-[#E6C594]/40 hover:border-[#E6C594] text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-sm"
              >
                {isInWatchlist ? (
                  <>
                    <Check size={14} />
                    ĐÃ LƯU
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    DANH SÁCH THEO DÕI
                  </>
                )}
              </button>
            </div>

            {/* Info Pills */}
            <div className="flex flex-wrap gap-2">
              {currentMovie.pills.map((pill, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 bg-[#181512] border border-[#2A241E] text-[10px] font-bold tracking-widest text-[#E6C594] rounded-sm font-mono uppercase"
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <div className="space-y-2">
              <h4 className="text-[10px] tracking-[0.25em] font-mono text-[#A49382] uppercase font-bold">TÓM TẮT PHIM</h4>
              <p className="text-xs text-[#C8B8A6] leading-relaxed font-sans max-w-3xl">
                {currentMovie.synopsis}
              </p>
            </div>

            {/* Cast & Crew Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              
              {/* Cast */}
              <div className="space-y-4">
                <h4 className="text-[10px] tracking-[0.25em] font-mono text-[#A49382] uppercase font-bold">DIỄN VIÊN</h4>
                
                <div className="flex gap-4">
                  {currentMovie.cast && currentMovie.cast.map((c, idx) => (
                    <div key={idx} className="cast-card flex items-center gap-3 bg-[#13110E] border border-[#2A241E] p-2.5 rounded-sm flex-1 max-w-[220px]">
                      <div className="w-10 h-10 rounded-full border border-[#E6C594]/30 overflow-hidden shrink-0">
                        <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-[#E5D4C0] truncate">{c.name}</p>
                        <p className="text-[8px] font-mono text-[#A49382] uppercase tracking-wider mt-0.5">{c.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crew */}
              <div className="space-y-4">
                <h4 className="text-[10px] tracking-[0.25em] font-mono text-[#A49382] uppercase font-bold">ĐOÀN LÀM PHIM</h4>
                
                <div className="space-y-2.5">
                  <div className="flex items-center text-[11px]">
                    <span className="w-28 font-mono text-[#A49382] uppercase tracking-wider">ĐẠO DIỄN</span>
                    <span className="font-bold text-[#E5D4C0]">{currentMovie.director}</span>
                  </div>
                  <div className="flex items-center text-[11px]">
                    <span className="w-28 font-mono text-[#A49382] uppercase tracking-wider">QUAY PHIM</span>
                    <span className="font-bold text-[#E5D4C0]">{currentMovie.cinematography}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT: Up Next and Promo Featurette */}
          <div className="space-y-8">
            
            {/* UP NEXT Section */}
            <div className="bg-[#13110E] border border-[#2A241E] p-5 rounded-sm">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#2A241E]">
                <h3 className="text-[11px] font-bold tracking-[0.2em] font-mono text-[#E6C594] uppercase flex items-center gap-2">
                  <Video size={14} />
                  PHIM TIẾP THEO
                </h3>
                <Link to="/stream" className="text-[9px] font-bold tracking-wider text-[#A49382] hover:text-[#E6C594] transition-colors font-mono">
                  XEM TẤT CẢ
                </Link>
              </div>

              {/* Cards list */}
              <div className="space-y-3">
                {[
                  { id: 'carbon-echo', title: 'Tiếng Vọng Carbon', genre: 'VIỄN TƯỞNG', duration: '1H 45M', rating: '8.2', img: shadowsOfTheNeonImg },
                  { id: 'silent-frame', title: 'Khung Hình Lặng Lẽ', genre: 'TÀI LIỆU', duration: '2H 05M', rating: '9.1', img: theSilentArchitectImg },
                  { id: 'the-last-reel', title: 'Cuộn Phim Cuối Cùng', genre: 'CHÍNH KỊCH', duration: '1H 58M', rating: '8.5', img: monolithProtocolImg }
                ].map(item => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      setCurrentMovie(STREAMING_MOVIES[item.id]);
                      setIsPlaying(false);
                      if (videoRef.current) {
                        videoRef.current.load();
                      }
                      navigate(`/stream/watch/${item.id}`);
                    }}
                    className="flex gap-3 bg-[#181512] border border-[#2A241E] p-2 hover:border-[#E6C594]/30 cursor-pointer transition-all duration-300 rounded-sm group"
                  >
                    <div className="w-20 aspect-video rounded-sm overflow-hidden bg-black shrink-0 relative">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                        <Play size={10} fill="#E6C594" className="text-[#E6C594]" />
                      </div>
                    </div>
                    
                    <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
                      <p className="text-[10px] font-bold text-[#E5D4C0] group-hover:text-[#E6C594] transition-colors truncate">{item.title}</p>
                      
                      <div className="flex items-center gap-1.5 text-[8px] font-mono text-[#A49382] uppercase tracking-wider">
                        <span>{item.genre}</span>
                        <span>•</span>
                        <span>{item.duration}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[8px] font-mono text-[#E6C594]">
                        <Star size={10} fill="#E6C594" />
                        <span className="font-bold">{item.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NASAFilm ORIGINAL Promo Card */}
            <div className="original-promo-card bg-[#13110E] border border-[#2A241E] rounded-sm overflow-hidden relative group">
              {/* background vector art placeholder / logo watermark */}
              <div className="absolute bottom-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none scale-150 transform translate-x-4 translate-y-4">
                <Award size={180} className="text-[#E6C594]" />
              </div>
              
              <div className="p-5 space-y-4">
                <span className="px-2 py-0.5 bg-[#E6C594]/15 border border-[#E6C594]/45 text-[8px] font-bold tracking-widest text-[#E6C594] rounded-sm font-mono uppercase">
                  NASAFILM ORIGINAL
                </span>

                <div className="space-y-1.5">
                  <h3 className="font-heading text-lg font-black text-[#E5D4C0] tracking-tight uppercase leading-none">
                    HẬU TRƯỜNG: NOIR
                  </h3>
                  <p className="text-[10px] text-[#A49382] leading-relaxed max-w-[240px]">
                    Phỏng vấn độc quyền với Đạo diễn Elias Thorne về quá trình thực hiện Ánh Sáng Vĩnh Hằng.
                  </p>
                </div>

                <button
                  onClick={handlePlayFeaturette}
                  className="w-full py-2.5 border border-[#E6C594]/40 hover:border-[#E6C594] text-[#E6C594] text-[9px] font-extrabold tracking-[0.25em] uppercase hover:bg-[#E6C594]/5 transition-all duration-300 rounded-sm flex items-center justify-center gap-2"
                >
                  <Eye size={12} />
                  XEM HẬU TRƯỜNG PHIM
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
