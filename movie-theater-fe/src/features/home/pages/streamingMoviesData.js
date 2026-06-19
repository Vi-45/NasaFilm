import shadowsOfTheNeonImg from '../../../shared/assets/shadows_of_the_neon.png';
import theSilentArchitectImg from '../../../shared/assets/the_silent_architect.png';
import monolithProtocolImg from '../../../shared/assets/monolith_protocol.png';
import melancholyCityImg from '../../../shared/assets/melancholy_city.png';
import eternalNeonImg from '../../../shared/assets/eternal_neon.png';

import avatarMarcus from '../../../shared/assets/avatar_marcus.png';
import avatarElena from '../../../shared/assets/avatar_elena.png';
import avatarSasha from '../../../shared/assets/avatar_sasha.png';
import avatarJulian from '../../../shared/assets/avatar_julian.png';

import interstellarTrailer from '../../../shared/assets/Interstellar-Trailer.mp4';
import swordTrailer from '../../../shared/assets/Sword-Trailer.mp4';

export const STREAMING_MOVIES = {
  'eternal-neon': {
    id: 'eternal-neon',
    title: 'ÁNH SÁNG VĨNH HẰNG',
    englishTitle: 'ETERNAL NEON',
    rating: '8.9',
    votes: '24.5k Lượt đánh giá',
    pills: ['VIỄN TƯỞNG / NOIR', 'NĂM 2024', '2h 12m', 'HẠN CHẾ KHÁN GIẢ (R)'],
    synopsis: 'Tại một đô thị đổ nát nơi ánh sáng ban ngày chỉ còn là ký ức xa xôi, một người vận chuyển dữ liệu đơn độc tình cờ phát hiện ra một tín hiệu mã hóa bí ẩn trong nhịp đập của thành phố. Khi ranh giới giữa trí tuệ nhân tạo và ý thức con người dần mờ nhạt, cô phải điều hướng qua mê cung của lòng tham tập đoàn và những bóng ma ba chiều để bảo tồn mảnh ký ức hữu cơ cuối cùng.',
    video: interstellarTrailer,
    poster: eternalNeonImg,
    director: 'Elias Thorne',
    cinematography: 'Sarah Vancore',
    tag: '4K HDR',
    category: 'VIỄN TƯỞNG / NOIR',
    duration: '2h 12m',
    specs: {
      aspectRatio: '2.39:1 (Anamorphic)',
      camera: 'Arri Alexa LF, Panavision C-Series Lenses',
      negativeFormat: '65mm Digital (Source), Redcode RAW',
      releaseDate: '20 tháng 3, 2024'
    },
    soundtracks: [
      { title: 'Neon Pulse (Chủ Đề Chính)', artist: 'Elias Thorne & Orbit Grid', duration: '4:12' },
      { title: 'Rain on Chrome', artist: 'Sarah Vancore', duration: '3:45' },
      { title: 'The Last Organic Memory', artist: 'Vance Echoes', duration: '5:02' },
      { title: 'Cybernetic Solitude', artist: 'Hologram Symphony', duration: '2:58' }
    ],
    cast: [
      { name: 'Marcus Sterling', character: 'NGƯỜI VẬN CHUYỂN', avatar: avatarMarcus },
      { name: 'Elena Rostova', character: 'ARIA-7', avatar: avatarElena },
      { name: 'Hiroshi Tanaka', character: 'KỸ SƯ GEN', avatar: avatarSasha },
      { name: 'Sofia Chen', character: 'TRƯỞNG CẤP CAO', avatar: avatarJulian }
    ],
    episodes: [
      { episodeNum: 1, title: 'Phần 1: Tín Hiệu Lạ', duration: '40 phút', id: 'eternal-neon-ep1' },
      { episodeNum: 2, title: 'Phần 2: Mê Cung Số', duration: '45 phút', id: 'eternal-neon-ep2' },
      { episodeNum: 3, title: 'Phần 3: Ánh Sáng Cuối Cùng', duration: '47 phút', id: 'eternal-neon-ep3' }
    ],
    trivia: [
      'Bộ phim được quay hoàn toàn bằng máy quay kỹ thuật số đặc biệt trong môi trường thiếu sáng, chỉ sử dụng ánh đèn neon thực tế từ bối cảnh.',
      'Nhạc nền của phim kết hợp giữa dàn nhạc giao hưởng truyền thống và nhạc cụ điện tử analog thập niên 80 để tạo cảm giác vừa cổ kính vừa tương lai.',
      'Đạo diễn Elias Thorne đã dành 6 tháng để thiết kế kiến trúc 3D cho thành phố giả tưởng trước khi bắt đầu quay phim.'
    ]
  },
  'shadows-of-the-neon': {
    id: 'shadows-of-the-neon',
    title: 'BÓNG ĐÊM NEON',
    englishTitle: 'SHADOWS OF THE NEON',
    rating: '8.7',
    votes: '18.9k Lượt đánh giá',
    pills: ['NOIR / GIẬT GÂN', 'NĂM 2024', '1h 56m', 'HẠN CHẾ KHÁN GIẢ (R)'],
    synopsis: 'Dưới cơn mưa bất tận của một thành phố rực rỡ ánh đèn neon, một thám tử tư hoài nghi nhận một vụ mất tích thông thường, để rồi vô tình vạch trần một âm mưu kỹ thuật số tiếp cận đến tận các văn phòng cao cấp nhất của các siêu tập đoàn mạng.',
    video: swordTrailer,
    poster: shadowsOfTheNeonImg,
    director: 'Elias Thorne',
    cinematography: 'Sarah Vancore',
    tag: '4K',
    category: 'NOIR / GIẬT GÂN',
    duration: '1h 56m',
    specs: {
      aspectRatio: '1.85:1 (Spherical)',
      camera: 'Sony Venice 2, Cooke Anamorphic/i Lenses',
      negativeFormat: 'X-OCN XT (8K Source)',
      releaseDate: '12 tháng 5, 2024'
    },
    soundtracks: [
      { title: 'The Rain That Kills', artist: 'Sarah Vancore', duration: '3:20' },
      { title: 'Detective Blues', artist: 'Jazz Noir Project', duration: '4:15' },
      { title: 'Data Stream Hunt', artist: 'Orbit Grid', duration: '2:40' }
    ],
    cast: [
      { name: 'Marcus Sterling', character: 'THÁM TỬ VANCE', avatar: avatarMarcus },
      { name: 'Sasha Petrova', character: 'KHÁCH HÀNG', avatar: avatarSasha },
      { name: 'Elena Rostova', character: 'MẬT THÁM', avatar: avatarElena },
      { name: 'Sofia Chen', character: 'ĐỐI TÁC', avatar: avatarJulian }
    ],
    episodes: [
      { episodeNum: 1, title: 'Phần 1: Người Mất Tích', duration: '35 phút', id: 'shadows-ep1' },
      { episodeNum: 2, title: 'Phần 2: Cơn Mưa Bất Tận', duration: '40 phút', id: 'shadows-ep2' },
      { episodeNum: 3, title: 'Phần 3: Văn Phòng Tầng 99', duration: '41 phút', id: 'shadows-ep3' }
    ],
    trivia: [
      'Bộ phim được quay chủ yếu tại các con hẻm cổ kính ở Châu Á vào ban đêm để tái hiện hoàn hảo không khí Noir nguyên bản.',
      'Hơn 10.000 lít nước mỗi giờ đã được sử dụng để tạo hiệu ứng mưa nhân tạo trong suốt các cảnh quay ngoài trời.'
    ]
  },
  'the-silent-architect': {
    id: 'the-silent-architect',
    title: 'KIẾN TRÚC SƯ LẶNG LẼ',
    englishTitle: 'THE SILENT ARCHITECT',
    rating: '9.1',
    votes: '14.2k Lượt đánh giá',
    pills: ['TÀI LIỆU / NGHỆ THUẬT', 'NĂM 2023', '2h 05m', 'DÀNH CHO MỌI ĐỐI TƯỢNG (G)'],
    synopsis: 'Một cuộc khám phá sâu sắc về người kiến trúc sư đã xây dựng các môi trường sống dưới nước hoàn toàn tự động đầu tiên trên thế giới, chi tiết hóa những thách thức tâm lý và cấu trúc khi xây dựng bên dưới vực thẳm đại dương.',
    video: interstellarTrailer,
    poster: theSilentArchitectImg,
    director: 'Julius Vance',
    cinematography: 'Marcus Aurelius',
    tag: 'HDR',
    category: 'TÀI LIỆU / NGHỆ THUẬT',
    duration: '2h 05m',
    specs: {
      aspectRatio: '2.20:1 (70mm Style)',
      camera: 'Panavision Millennium DXL2',
      negativeFormat: 'Redcode RAW (8K), 70mm Print (Selected Rạp)',
      releaseDate: '15 tháng 11, 2023'
    },
    soundtracks: [
      { title: 'Abyssal Silence', artist: 'Hologram Symphony', duration: '6:12' },
      { title: 'The Undersea Dome', artist: 'Julius Vance', duration: '4:30' },
      { title: 'Pressure & Mind', artist: 'Sola Ocean', duration: '3:50' }
    ],
    cast: [
      { name: 'Julian Vance', character: 'BẢN THÂN', avatar: avatarJulian },
      { name: 'Elena Rostova', character: 'NGƯỜI DẪN CHUYỆN', avatar: avatarElena },
      { name: 'Marcus Sterling', character: 'KỸ SƯ TRƯỞNG', avatar: avatarMarcus },
      { name: 'Sasha Petrova', character: 'THỢ LẶN', avatar: avatarSasha }
    ],
    episodes: [
      { episodeNum: 1, title: 'Phần 1: Ý Tưởng Dưới Đáy Biển', duration: '60 phút', id: 'architect-ep1' },
      { episodeNum: 2, title: 'Phần 2: Áp Suất Khổng Lồ', duration: '65 phút', id: 'architect-ep2' }
    ],
    trivia: [
      'Bộ phim được thực hiện trong suốt 5 năm, ghi nhận trực tiếp quá trình xây dựng trạm thí nghiệm dưới độ sâu 400m.',
      'Máy quay đã được bọc trong các vỏ titan chống áp lực nước được chế tạo riêng bởi các kỹ sư hàng hải.'
    ]
  },
  'monolith-protocol': {
    id: 'monolith-protocol',
    title: 'NGHỊ ĐỊNH THƯ MONOLITH',
    englishTitle: 'MONOLITH PROTOCOL',
    rating: '8.5',
    votes: '32.1k Lượt đánh giá',
    pills: ['VIỄN TƯỞNG / HÀNH ĐỘNG', 'NĂM 2024', '2h 18m', 'KHÁN GIẢ TRÊN 13 TUỔI (PG-13)'],
    synopsis: 'Khi một đài tưởng niệm ngoài hành tinh kích hoạt trên quỹ đạo, một nhóm các nhà khoa học và chuyên gia quân sự được cử đi giải mã thông điệp của nó trước khi sự hoảng loạn toàn cầu châm ngòi cho một cuộc chiến tranh hủy diệt Trái Đất.',
    video: swordTrailer,
    poster: monolithProtocolImg,
    director: 'Denis Villeneuve',
    cinematography: 'Roger Deakins',
    tag: 'IMAX HD',
    category: 'VIỄN TƯỞNG / HÀNH ĐỘNG',
    duration: '2h 18m',
    specs: {
      aspectRatio: '1.43:1 (IMAX)',
      camera: 'Arri Alexa LF, Zeiss Master Prime Lenses',
      negativeFormat: 'ArriRaw (4.5K Source)',
      releaseDate: '05 tháng 2, 2024'
    },
    soundtracks: [
      { title: 'Monolith Activation', artist: 'Jesper Kyd', duration: '5:45' },
      { title: 'First Contact Ritual', artist: 'Jesper Kyd', duration: '4:10' },
      { title: 'Decryption Urgency', artist: 'Orbit Grid', duration: '3:30' }
    ],
    cast: [
      { name: 'Marcus Sterling', character: 'ĐẠI TÁ STEELE', avatar: avatarMarcus },
      { name: 'Sasha Petrova', character: 'BÁC SĨ ARIS', avatar: avatarSasha },
      { name: 'Elena Rostova', character: 'NHÀ TOÁN HỌC', avatar: avatarElena },
      { name: 'Julian Vance', character: 'CHUYÊN GIA MẬT MÃ', avatar: avatarJulian }
    ],
    episodes: [
      { episodeNum: 1, title: 'Phần 1: Vật Thể Lạ', duration: '45 phút', id: 'monolith-ep1' },
      { episodeNum: 2, title: 'Phần 2: Nỗ Lực Giải Mã', duration: '45 phút', id: 'monolith-ep2' },
      { episodeNum: 3, title: 'Phần 3: Giờ Phán Quyết', duration: '48 phút', id: 'monolith-ep3' }
    ],
    trivia: [
      'Vật thể Monolith trong phim được thiết kế theo tỷ lệ toán học Fibonacci để tạo cảm giác siêu nhiên hoàn hảo.',
      'Thiết kế âm thanh của vật thể ngoài hành tinh sử dụng tần số hạ âm cực thấp, tạo cảm giác chấn động nhẹ trong lồng ngực người xem ở các rạp IMAX.'
    ]
  },
  'melancholy-city': {
    id: 'melancholy-city',
    title: 'THÀNH PHỐ U SẦU',
    englishTitle: 'MELANCHOLY CITY',
    rating: '9.3',
    votes: '8.4k Lượt đánh giá',
    pills: ['CHÍNH KỊCH / LÃNG MẠN', 'NĂM 2024', '1h 48m', 'HẠN CHẾ KHÁN GIẢ (R)'],
    synopsis: 'Một bức chân dung sâu sắc về hai tâm hồn lạc lối giao nhau tại một ga trung chuyển mịt mù mưa, tìm thấy sự an ủi và kết nối trong sự chia ly chung của họ giữa một cảnh quan siêu đô thị hoang vắng.',
    video: interstellarTrailer,
    poster: melancholyCityImg,
    director: 'Wong Kar-wai',
    cinematography: 'Christopher Doyle',
    tag: 'HD',
    category: 'CHÍNH KỊCH / LÃNG MẠN',
    duration: '1h 48m',
    specs: {
      aspectRatio: '1.66:1 (European Flat)',
      camera: 'Arriflex 535B, Zeiss Super Speed Lenses',
      negativeFormat: '35mm Film (Kodak Vision3 500T)',
      releaseDate: '14 tháng 2, 2024'
    },
    soundtracks: [
      { title: 'Melancholy Waltz', artist: 'Wong Kar-wai Ensemble', duration: '3:50' },
      { title: 'Rain and Neon Reflection', artist: 'Sola Ocean', duration: '4:20' },
      { title: 'The Solitary Station', artist: 'Christopher Doyle', duration: '2:15' }
    ],
    cast: [
      { name: 'Sasha Petrova', character: 'LỆ NA', avatar: avatarSasha },
      { name: 'Julian Vance', character: 'KENJI', avatar: avatarJulian },
      { name: 'Marcus Sterling', character: 'NGƯỜI LÁI TÀU', avatar: avatarMarcus },
      { name: 'Elena Rostova', character: 'HÀNH KHÁCH', avatar: avatarElena }
    ],
    episodes: [
      { episodeNum: 1, title: 'Phần 1: Ga Tàu Mưa Mịt Mù', duration: '54 phút', id: 'melancholy-ep1' },
      { episodeNum: 2, title: 'Phần 2: Lời Chưa Nói', duration: '54 phút', id: 'melancholy-ep2' }
    ],
    trivia: [
      'Bộ phim được ghi hình hoàn toàn trên phim nhựa 35mm để lấy hạt màu tự nhiên (film grain) và độ bão hòa màu cổ điển đặc trưng.',
      'Hầu hết các lời thoại của diễn viên là ứng biến ngay tại trường quay theo cảm xúc của mưa và không khí.'
    ]
  }
};

export const CATALOG_MOVIES = Object.values(STREAMING_MOVIES);
