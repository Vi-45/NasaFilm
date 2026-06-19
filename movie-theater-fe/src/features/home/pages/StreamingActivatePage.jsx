import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Key, ArrowRight, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import shadowsOfTheNeonImg from '../../../shared/assets/shadows_of_the_neon.png';
import './StreamingActivatePage.css';

export default function StreamingActivatePage() {
  const navigate = useNavigate();
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [code3, setCode3] = useState('');
  
  const [isActivating, setIsActivating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  // Handle character input and auto focus shifting
  const handleInputChange = (e, setVal, nextRef, prevRef) => {
    const val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (val.length <= 4) {
      setVal(val);
    }
    if (val.length === 4 && nextRef) {
      nextRef.current.focus();
    }
  };

  // Handle backspace focus shifting
  const handleKeyDown = (e, val, prevRef) => {
    if (e.key === 'Backspace' && val.length === 0 && prevRef) {
      prevRef.current.focus();
    }
  };

  const handleActivate = (e) => {
    e.preventDefault();
    const fullCode = `${code1}${code2}${code3}`;
    
    if (fullCode.length < 12) {
      setErrorMsg('Vui lòng nhập đầy đủ mã kích hoạt gồm 12 ký tự.');
      return;
    }

    setErrorMsg('');
    setIsActivating(true);

    // Simulate validation check
    setTimeout(() => {
      setIsActivating(false);
      setIsSuccess(true);
      // Automatically redirect to player page after 2 seconds
      setTimeout(() => {
        navigate('/stream/watch/eternal-neon');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="streaming-activate bg-[#060608] text-white min-h-screen flex flex-col justify-between font-mono">
      <Navbar />

      <main className="flex-grow max-w-[1200px] w-full mx-auto px-4 md:px-8 py-16 flex flex-col lg:flex-row gap-12 items-center justify-center">
        
        {/* LEFT COLUMN: Title & Form */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-[0.25em] text-red-500 font-mono">
              EST. 2024
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-none">
              KÍCH HOẠT TRUY CẬP SỐ
            </h1>
            <p className="text-xs text-gray-400 font-sans leading-relaxed max-w-lg">
              Đổi vé xem phim vật lý của bạn thành trải nghiệm truyền phát điện ảnh cao cấp tại nhà. Nhập mã kích hoạt gồm 12 ký tự ở mặt sau vé của bạn để bắt đầu hành trình.
            </p>
          </div>

          {/* Activation Form Card */}
          <div className="bg-[#121826]/30 border border-white/5 p-6 rounded-2xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/5 rounded-full blur-[60px] pointer-events-none" />
            
            <form onSubmit={handleActivate} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[9px] tracking-wider text-gray-400 font-bold uppercase block">
                  NHẬP MÃ SỐ TRUY CẬP (12 KÝ TỰ)
                </label>
                
                {/* 3 Block input layout matching code style */}
                <div className="flex items-center gap-3 justify-start py-2">
                  <input
                    ref={ref1}
                    type="text"
                    maxLength={4}
                    value={code1}
                    onChange={(e) => handleInputChange(e, setCode1, ref2, null)}
                    placeholder="0000"
                    className="w-20 md:w-24 bg-[#0F1322] border border-[#1A2238] focus:border-red-500 text-center font-mono font-bold text-lg md:text-xl py-2.5 text-white focus:outline-none rounded-lg tracking-widest"
                  />
                  <span className="text-gray-600 text-xl font-bold font-sans">-</span>
                  <input
                    ref={ref2}
                    type="text"
                    maxLength={4}
                    value={code2}
                    onChange={(e) => handleInputChange(e, setCode2, ref3, ref1)}
                    onKeyDown={(e) => handleKeyDown(e, code2, ref1)}
                    placeholder="0000"
                    className="w-20 md:w-24 bg-[#0F1322] border border-[#1A2238] focus:border-red-500 text-center font-mono font-bold text-lg md:text-xl py-2.5 text-white focus:outline-none rounded-lg tracking-widest"
                  />
                  <span className="text-gray-600 text-xl font-bold font-sans">-</span>
                  <input
                    ref={ref3}
                    type="text"
                    maxLength={4}
                    value={code3}
                    onChange={(e) => handleInputChange(e, setCode3, null, ref2)}
                    onKeyDown={(e) => handleKeyDown(e, code3, ref2)}
                    placeholder="0000"
                    className="w-20 md:w-24 bg-[#0F1322] border border-[#1A2238] focus:border-red-500 text-center font-mono font-bold text-lg md:text-xl py-2.5 text-white focus:outline-none rounded-lg tracking-widest"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-xs text-red-500 bg-red-500/10 border border-red-500/20 p-3 rounded-lg font-sans">
                  <AlertCircle size={14} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {isSuccess && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg font-sans">
                  <CheckCircle2 size={14} />
                  <span>Kích hoạt mã thành công! Đang chuyển hướng bạn tới phòng chiếu...</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isActivating || isSuccess}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-black tracking-widest uppercase rounded-lg transition-all shadow-lg shadow-red-600/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isActivating ? (
                  <>
                    <span className="spinner w-3.5 h-3.5 border-t-2 border-white animate-spin rounded-full block" />
                    ĐANG XÁC THỰC MÃ...
                  </>
                ) : (
                  <>
                    XÁC THỰC & KÍCH HOẠT VÉ <ArrowRight size={13} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: How it works & currently screening */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="bg-[#121826]/10 border border-white/5 p-6 rounded-2xl space-y-6">
            <h2 className="font-heading text-lg font-bold text-white tracking-widest uppercase border-b border-white/5 pb-2">
              CÁCH THỨC HOẠT ĐỘNG
            </h2>
            
            <div className="space-y-5">
              {/* Step 1 */}
              <div className="flex items-start gap-4 font-sans">
                <span className="font-mono text-xs font-bold text-red-500 border border-red-500/30 px-2 py-0.5 rounded-sm bg-red-500/5">
                  01
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">TÌM VÉ CỦA BẠN</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">Xác định mã kích hoạt gồm 12 chữ số được in chìm hoặc mã hóa ở mặt sau của vé vật lý NASAFilm premiere.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 font-sans">
                <span className="font-mono text-xs font-bold text-red-500 border border-red-500/30 px-2 py-0.5 rounded-sm bg-red-500/5">
                  02
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">XÁC THỰC MÃ SỐ</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">Nhập mã số vào cổng kích hoạt an toàn của chúng tôi. Hệ thống sẽ ngay lập tức khóa và đặt chỗ ghế số của bạn trên đám mây.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 font-sans">
                <span className="font-mono text-xs font-bold text-red-500 border border-red-500/30 px-2 py-0.5 rounded-sm bg-red-500/5">
                  03
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">BẮT ĐẦU XEM PHIM</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">Nhận quyền truy cập xem phim trực tiếp độ phân giải 4K, cùng các nội dung hậu trường phim và phiên bản cắt của đạo diễn.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Currently screening promotion */}
          <div className="bg-[#121826]/30 border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4 relative overflow-hidden group hover:border-red-500/20 transition-all cursor-pointer" onClick={() => navigate('/stream/movie/shadows-of-the-neon')}>
            <div className="w-24 aspect-[16/10] overflow-hidden rounded-lg shrink-0">
              <img src={shadowsOfTheNeonImg} alt="Currently Screening" className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-all duration-500" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <span className="text-[8px] font-bold tracking-widest text-red-500 font-mono">ĐANG PHÁT TRỰC TUYẾN</span>
              <h4 className="font-heading text-xs font-bold text-white group-hover:text-red-500 transition-colors leading-tight">BÓNG ĐÊM NEON (SHADOWS OF THE NEON)</h4>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors shrink-0">
              <Play size={10} fill="currentColor" className="ml-0.5" />
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
