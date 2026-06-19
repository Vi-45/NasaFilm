import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Radio, Award, DollarSign, Zap, Search, Bell, Settings, 
  Download, Laptop, Tv, Tablet, Smartphone, Play, 
  Terminal, ShieldAlert, CalendarClock, ShieldCheck, HelpCircle, X,
  Film, Users, Sliders, ArrowLeft, Plus
} from 'lucide-react';
import { notificationService } from '../../../shared/services/notificationService';
import './OnlineStreamingManagementPage.css';

// Initial mock recent activations in Vietnamese
const INITIAL_ACTIVATIONS = [
  {
    id: 1,
    movieTitle: 'Tiếng Vọng Bóng Đêm',
    userName: 'julian.v@cinemail.com',
    activationDate: '24 Thg 10, 2023 | 14:22',
    deviceType: 'Desktop',
    status: 'ĐANG HOẠT ĐỘNG'
  },
  {
    id: 2,
    movieTitle: 'Mảnh Ghép Màu Noir',
    userName: 'eliza.sharp@web.net',
    activationDate: '24 Thg 10, 2023 | 12:05',
    deviceType: 'Smart TV',
    status: 'HẾT HẠN'
  },
  {
    id: 3,
    movieTitle: 'Giấc Mơ Celluloid',
    userName: 'mark.k@streamline.com',
    activationDate: '23 Thg 10, 2023 | 09:14',
    deviceType: 'iPad Pro',
    status: 'ĐÃ THU HỒI'
  },
  {
    id: 4,
    movieTitle: 'Ống Kính Công Nghiệp',
    userName: 'sara.curator@tpd.com',
    activationDate: '23 Thg 10, 2023 | 08:45',
    deviceType: 'iPhone 15',
    status: 'ĐANG HOẠT ĐỘNG'
  }
];

// Mock inventory for streaming movies
const INITIAL_INVENTORY = [
  { id: 1, title: 'Ánh Sáng Vĩnh Hằng (Eternal Neon)', quality: '4K HDR', activeStreams: 4210, server: 'Edge-North', status: 'Đang phát' },
  { id: 2, title: 'Bóng Đêm Neon (Shadows of the Neon)', quality: '4K', activeStreams: 3120, server: 'Edge-East', status: 'Đang phát' },
  { id: 3, title: 'Kiến Trúc Sư Lặng Lẽ (The Silent Architect)', quality: 'HDR', activeStreams: 1845, server: 'Edge-South', status: 'Đang phát' },
  { id: 4, title: 'Nghị Định Thư Monolith (Monolith Protocol)', quality: 'IMAX HD', activeStreams: 2112, server: 'Edge-West', status: 'Đang phát' },
  { id: 5, title: 'Thành Phố U SẦu (Melancholy City)', quality: 'HD', activeStreams: 1195, server: 'Edge-North', status: 'Tạm dừng' }
];

export default function OnlineStreamingManagementPage() {
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState('dashboard');
  const [activations, setActivations] = useState(INITIAL_ACTIVATIONS);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  
  // Stats states (simulating live fluctuations)
  const [activeStreams, setActiveStreams] = useState(12482);
  const [bandwidthLoad, setBandwidthLoad] = useState(4.2);

  // Form states
  const [campaignName, setCampaignName] = useState('Liên hoan phim Noir 2024');
  const [quantity, setQuantity] = useState('50 Mã');
  const [expiration, setExpiration] = useState('2026-12-31');

  // Dialog / popup states
  const [showLogs, setShowLogs] = useState(false);
  const [logsList, setLogsList] = useState([]);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Settings states
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [streamQuality, setStreamQuality] = useState('4K');
  const [edgeCaching, setEdgeCaching] = useState(true);

  const logsEndRef = useRef(null);

  // Fluctuating stats
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStreams(prev => prev + Math.floor(Math.random() * 21) - 10);
      setBandwidthLoad(prev => {
        const val = prev + (Math.random() * 0.4 - 0.2);
        return parseFloat(val.toFixed(1));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Real-time logs simulation
  useEffect(() => {
    if (showLogs) {
      setLogsList([
        '[HỆ THỐNG] Kết nối Edge Gateway: ỔN ĐỊNH',
        '[XÁC THỰC] Chief Curator làm mới phiên đăng nhập - IP: 10.92.0.12',
        '[STREAM] Định tuyến lại cụm nút hoạt động: THÀNH CÔNG',
        '[BẢN QUYỀN] Xác minh khóa tài sản kỹ thuật số 849.2K'
      ]);

      const logInterval = setInterval(() => {
        const timestamp = new Date().toLocaleTimeString();
        const logs = [
          `[STREAM] Đã thiết lập kết nối từ khách_hàng_${Math.floor(Math.random() * 900) + 100}@nasafilm.vn`,
          `[BẢN QUYỀN] Đã tạo mã xác thực kỹ thuật số token_${Math.floor(Math.random() * 9000) + 1000}`,
          `[SYS] Kiểm tra tải phân phối Edge: OK (Độ trễ: ${Math.floor(Math.random() * 20) + 5}ms)`,
          `[STREAM] Điều chuyển băng thông: Nút-${Math.floor(Math.random() * 4) + 1} băng thông: ${bandwidthLoad} TB/s`
        ];
        const randomLog = logs[Math.floor(Math.random() * logs.length)];
        setLogsList(prev => [...prev, `[${timestamp}] ${randomLog}`].slice(-40));
      }, 2000);

      return () => clearInterval(logInterval);
    }
  }, [showLogs, bandwidthLoad]);

  // Scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logsList]);

  // Device type helper to render icon
  const getDeviceIcon = (device) => {
    switch (device) {
      case 'Desktop': return <Laptop size={14} className="text-gray-400" />;
      case 'Smart TV': return <Tv size={14} className="text-gray-400" />;
      case 'iPad Pro': return <Tablet size={14} className="text-gray-400" />;
      case 'iPhone 15': return <Smartphone size={14} className="text-gray-400" />;
      default: return <Laptop size={14} className="text-gray-400" />;
    }
  };

  // Generate codes submit
  const handleGenerateBatchSubmit = (e) => {
    e.preventDefault();
    if (!campaignName.trim()) {
      notificationService.error('Vui lòng nhập tên chiến dịch.');
      return;
    }
    
    // Create mock row
    const newRow = {
      id: Date.now(),
      movieTitle: campaignName,
      userName: `operator.${Math.floor(Math.random() * 99)}@nasafilm.com`,
      activationDate: new Date().toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      }) + ' | ' + new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      deviceType: ['Desktop', 'Smart TV', 'iPad Pro', 'iPhone 15'][Math.floor(Math.random() * 4)],
      status: 'ĐANG HOẠT ĐỘNG'
    };

    setActivations(prev => [newRow, ...prev]);
    notificationService.success(`Đã khởi tạo thành công ${quantity} cho chiến dịch "${campaignName}"!`);
  };

  // Revoke status action
  const handleRevokeStatus = (id) => {
    setActivations(prev => 
      prev.map(item => item.id === id ? { ...item, status: 'ĐA THU HỒI' } : item)
    );
    notificationService.info('Đã thu hồi giấy phép xem phim trực tuyến.');
  };

  // Toggle Inventory Status
  const handleToggleInventoryStatus = (id) => {
    setInventory(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newStatus = item.status === 'Đang phát' ? 'Tạm dừng' : 'Đang phát';
          notificationService.info(`Đã chuyển trạng thái phim sang: ${newStatus}`);
          return { ...item, status: newStatus };
        }
        return item;
      })
    );
  };

  // Export CSV mock download
  const handleExportCSV = (e) => {
    e.preventDefault();
    const headers = 'ID,Ten Phim,Nguoi Dung,Ngay Kich Hoat,Thiet Bi,Trang Thai\n';
    const rows = activations.map(a => `${a.id},"${a.movieTitle}",${a.userName},"${a.activationDate}",${a.deviceType},${a.status}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nasafilm_streaming_activations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notificationService.success('Đã xuất báo cáo CSV thành công.');
  };

  // Search filter
  const filteredActivations = activations.filter(a => {
    const q = searchQuery.toLowerCase();
    return a.movieTitle.toLowerCase().includes(q) || a.userName.toLowerCase().includes(q) || a.status.toLowerCase().includes(q);
  });

  return (
    <div className="streaming-console-page flex bg-[#0f172a] border border-[#1e293b]/60 rounded-xl text-gray-150 p-0 overflow-hidden min-h-[750px] shadow-2xl">
      
      {/* 1. Local Sub-Sidebar (styled to match standard admin sidebar layout) */}
      <aside className="streaming-sub-sidebar w-56 border-r border-[#1E293B]/20 bg-[#0f172a] flex flex-col justify-between shrink-0">
        <div className="p-4 py-5 border-b border-[#1E293B]/20 flex flex-col items-start gap-1">
          <span className="text-white font-black text-sm tracking-[0.1em]">NASAFILM</span>
          <span className="text-[7px] text-red-500 font-bold tracking-[0.15em] uppercase">QUẢN LÝ PHÁT TRỰC TUYẾN</span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
          <button
            onClick={() => setActiveSubTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              activeSubTab === 'dashboard'
                ? 'bg-red-655 bg-red-600 text-white shadow-md shadow-red-600/10'
                : 'text-gray-400 hover:text-white hover:bg-[#1E293B]/40'
            }`}
          >
            <Sliders size={14} className={activeSubTab === 'dashboard' ? 'text-white' : 'text-sky-400'} />
            Bảng điều khiển
          </button>
          
          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              activeSubTab === 'inventory'
                ? 'bg-red-655 bg-red-600 text-white shadow-md shadow-red-600/10'
                : 'text-gray-400 hover:text-white hover:bg-[#1E293B]/40'
            }`}
          >
            <Film size={14} className={activeSubTab === 'inventory' ? 'text-white' : 'text-rose-455 text-rose-400'} />
            Kho phim online
          </button>
          
          <button
            onClick={() => setActiveSubTab('licenses')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              activeSubTab === 'licenses'
                ? 'bg-red-655 bg-red-600 text-white shadow-md shadow-red-600/10'
                : 'text-gray-400 hover:text-white hover:bg-[#1E293B]/40'
            }`}
          >
            <Award size={14} className={activeSubTab === 'licenses' ? 'text-white' : 'text-amber-455 text-amber-400'} />
            Bản quyền phát
          </button>
          
          <button
            onClick={() => setActiveSubTab('users')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              activeSubTab === 'users'
                ? 'bg-red-655 bg-red-600 text-white shadow-md shadow-red-600/10'
                : 'text-gray-400 hover:text-white hover:bg-[#1E293B]/40'
            }`}
          >
            <Users size={14} className={activeSubTab === 'users' ? 'text-white' : 'text-cyan-455 text-cyan-400'} />
            Quyền người dùng
          </button>
          
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              activeSubTab === 'settings'
                ? 'bg-red-655 bg-red-600 text-white shadow-md shadow-red-600/10'
                : 'text-gray-400 hover:text-white hover:bg-[#1E293B]/40'
            }`}
          >
            <Settings size={14} className={activeSubTab === 'settings' ? 'text-white' : 'text-gray-400'} />
            Cấu hình hệ thống
          </button>
        </nav>

        {/* Back link to main admin */}
        <div className="p-3 border-t border-[#1E293B]/20">
          <button
            onClick={() => navigate('/admin')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#1E293B]/60 hover:bg-white/5 text-gray-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <ArrowLeft size={13} />
            Quay lại Admin
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto no-scrollbar bg-[#0f172a]">
        
        {/* Local Header */}
        <header className="terminal-sub-header border-b border-[#1E293B]/20 pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold tracking-widest text-red-500 bg-red-500/10 px-2.5 py-1 border border-red-500/20 rounded-md">
              TRẠM ĐIỀU HÀNH STREAM
            </span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
              <input
                type="text"
                placeholder="Tra cứu bản quyền hoặc người dùng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#121826]/40 border border-[#1E293B]/40 focus:border-red-500 text-xs px-8 py-1.5 w-64 text-white placeholder-gray-500 focus:outline-none transition-colors rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center gap-5 text-[10px] font-bold tracking-wider">
            <div className="flex items-center gap-1.5 text-red-500">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-400">TRẠNG THÁI: TỐT NHẤT</span>
            </div>
          </div>
        </header>

        {/* Dynamic Panels */}
        
        {/* SUBTAB 1: DASHBOARD */}
        {activeSubTab === 'dashboard' && (
          <div className="space-y-6 flex-1">
            {/* Metric Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="metric-box bg-[#121826]/70 border border-[#1A2238] p-4 relative rounded-xl shadow-sm flex justify-between items-start">
                <div>
                  <p className="text-[9px] tracking-widest text-gray-400 font-bold uppercase">LƯỢT PHÁT HOẠT ĐỘNG</p>
                  <h2 className="text-2xl font-black text-white tracking-tight mt-1 font-sans">{activeStreams.toLocaleString()}</h2>
                  <p className="text-[8px] text-gray-500 mt-1"><span className="text-emerald-500 font-bold">+18.4%</span> so với giờ trước</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 text-red-500 shrink-0">
                  <Radio size={16} className="animate-pulse" />
                </div>
              </div>

              <div className="metric-box bg-[#121826]/70 border border-[#1A2238] p-4 relative rounded-xl shadow-sm flex justify-between items-start">
                <div>
                  <p className="text-[9px] tracking-widest text-gray-400 font-bold uppercase">BẢN QUYỀN TRỰC TUYẾN</p>
                  <h2 className="text-2xl font-black text-white tracking-tight mt-1 font-sans">849.2K</h2>
                  <p className="text-[8px] text-gray-500 mt-1">Tổng tài sản số được bảo vệ</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 text-red-500 shrink-0">
                  <Award size={16} />
                </div>
              </div>

              <div className="metric-box bg-[#121826]/70 border border-[#1A2238] p-4 relative rounded-xl shadow-sm flex justify-between items-start">
                <div>
                  <p className="text-[9px] tracking-widest text-gray-400 font-bold uppercase">DOANH THU SỐ</p>
                  <h2 className="text-2xl font-black text-white tracking-tight mt-1 font-sans">$2.8M</h2>
                  <p className="text-[8px] text-gray-500 mt-1">Dự báo Q4: <span className="text-red-500 font-bold">$3.5M</span></p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 text-red-500 shrink-0">
                  <DollarSign size={16} />
                </div>
              </div>

              <div className="metric-box bg-[#121826]/70 border border-[#1A2238] p-4 relative rounded-xl shadow-sm flex justify-between items-start">
                <div>
                  <p className="text-[9px] tracking-widest text-gray-400 font-bold uppercase">TỶ LỆ KÍCH HOẠT MÃ</p>
                  <h2 className="text-2xl font-black text-white tracking-tight mt-1 font-sans">94.2%</h2>
                  <p className="text-[8px] text-gray-500 mt-1">Điểm hiệu suất: <span className="text-emerald-500 font-bold">A+</span></p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 text-red-500 shrink-0">
                  <Zap size={16} />
                </div>
              </div>
            </div>

            {/* Charts & Generator Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {/* Bandwidth Load chart */}
              <div className="lg:col-span-2 bg-[#121826]/70 border border-[#1A2238] p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-[10px] font-bold tracking-widest text-white uppercase flex justify-between items-center">
                    <span>TẢI BĂNG THÔNG HỆ THỐNG</span>
                    <span className="text-[9px] text-emerald-400 font-bold font-mono">LIVE • {bandwidthLoad} TB/s</span>
                  </h3>
                  <p className="text-[8px] text-gray-400 uppercase mt-0.5">Lưu lượng biên toàn cầu thời gian thực</p>
                </div>

                <div className="h-32 flex items-end justify-between gap-1.5 border-b border-l border-[#1A2238] px-3 pt-6 pb-2 my-2 relative">
                  <div className="absolute left-0 right-0 top-1/4 h-[1px] bg-white/5 border-dashed" />
                  <div className="absolute left-0 right-0 top-2/4 h-[1px] bg-white/5 border-dashed" />
                  <div className="absolute left-0 right-0 top-3/4 h-[1px] bg-white/5 border-dashed" />
                  
                  {[40, 55, 48, 85, 35, 60, 50, 38, 45, 78, 72, 58, 65].map((val, idx) => (
                    <div key={idx} className="flex-grow flex flex-col items-center">
                      <div 
                        className={`w-full transition-all duration-500 rounded-t-xs ${idx === 3 ? 'bg-red-655 bg-red-600' : 'bg-white/10'}`}
                        style={{ height: `${val}px` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-[7px] text-gray-500 font-mono px-1">
                  <span>00:00</span>
                  <span>04:00</span>
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                  <span>NOW</span>
                </div>
              </div>

              {/* Code Generator */}
              <div className="bg-[#121826]/70 border border-[#1A2238] p-5 rounded-xl flex flex-col justify-between">
                <h3 className="text-[10px] font-bold tracking-widest text-white uppercase">TẠO MÃ HÀNG LOẠT</h3>
                
                <form onSubmit={handleGenerateBatchSubmit} className="space-y-3 my-2">
                  <div className="space-y-0.5">
                    <label className="text-[8px] text-gray-400 font-bold uppercase block">TÊN CHIẾN DỊCH</label>
                    <input 
                      type="text" 
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full bg-[#0F1322] border border-[#1A2238] focus:border-red-500 text-[10px] px-3 py-2 text-white placeholder-gray-600 focus:outline-none rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-0.5">
                      <label className="text-[8px] text-gray-400 font-bold uppercase block">SỐ LƯỢNG MÃ</label>
                      <select 
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full bg-[#0F1322] border border-[#1A2238] focus:border-red-500 text-[10px] px-2 py-1.5 text-white focus:outline-none rounded-lg"
                      >
                        <option value="10 Mã">10 Mã</option>
                        <option value="50 Mã">50 Mã</option>
                        <option value="100 Mã">100 Mã</option>
                      </select>
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[8px] text-gray-400 font-bold uppercase block">HẠN SỬ DỤNG</label>
                      <input 
                        type="date"
                        value={expiration}
                        onChange={(e) => setExpiration(e.target.value)}
                        className="w-full bg-[#0F1322] border border-[#1A2238] focus:border-red-500 text-[10px] px-2 py-1 text-white focus:outline-none rounded-lg font-sans"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-[9px] font-black tracking-[0.2em] uppercase rounded-lg transition-all shadow-md shadow-red-600/10">
                    TẠO MÃ HOẠT ĐỘNG
                  </button>
                </form>
              </div>
            </div>

            {/* Bottom Row: Recent activations & actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              
              {/* Table */}
              <div className="lg:col-span-2 bg-[#121826]/70 border border-[#1A2238] p-5 rounded-xl">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#1A2238]">
                  <h3 className="text-[10px] font-bold tracking-widest text-white uppercase">KÍCH HOẠT GẦN ĐÂY</h3>
                  <button onClick={handleExportCSV} className="text-[8px] font-bold text-gray-400 hover:text-red-500 flex items-center gap-1">
                    Xuất file CSV <Download size={10} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-[8px] text-gray-400 border-b border-[#1A2238] uppercase font-bold tracking-wider">
                        <th className="py-2.5 pr-2">TÊN PHIM / CHIẾN DỊCH</th>
                        <th className="py-2.5 px-2">NGƯỜI DÙNG</th>
                        <th className="py-2.5 px-2">NGÀY KÍCH HOẠT</th>
                        <th className="py-2.5 px-2">THIẾT BỊ</th>
                        <th className="py-2.5 px-2">TRẠNG THÁI</th>
                        <th className="py-2.5 pl-2 text-right">HÀNH ĐỘNG</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A2238]/30">
                      {filteredActivations.map(act => (
                        <tr key={act.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 pr-2 font-bold text-white truncate max-w-[130px]">{act.movieTitle}</td>
                          <td className="py-3 px-2 text-gray-400 truncate max-w-[130px]">{act.userName}</td>
                          <td className="py-3 px-2 text-gray-400 font-mono text-[10px]">{act.activationDate}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-1.5 text-gray-400">
                              {getDeviceIcon(act.deviceType)}
                              <span>{act.deviceType}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 text-[7px] font-bold tracking-wider rounded-sm ${
                              act.status === 'ĐANG HOẠT ĐỘNG'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : act.status === 'HẾT HẠN'
                                ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {act.status}
                            </span>
                          </td>
                          <td className="py-3 pl-2 text-right">
                            {act.status === 'ĐANG HOẠT ĐỘNG' ? (
                              <button onClick={() => handleRevokeStatus(act.id)} className="text-[9px] text-red-400 hover:text-red-300 font-bold hover:underline">
                                THU HỒI
                              </button>
                            ) : (
                              <span className="text-gray-700">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick actions panel */}
              <div className="flex flex-col justify-between gap-4">
                <div className="bg-[#121826]/70 border border-[#1A2238] p-5 rounded-xl">
                  <h3 className="text-[10px] font-bold tracking-widest text-white uppercase mb-4 pb-2 border-b border-[#1A2238]">THAO TÁC NHANH</h3>
                  <div className="space-y-2.5">
                    <button onClick={() => setShowRevokeModal(true)} className="w-full flex items-center justify-between px-4 py-3 bg-[#121826] hover:bg-[#1E293B] border border-[#1A2238] hover:border-red-500/30 text-left text-xs font-bold transition-all rounded-lg text-white hover:text-red-500">
                      <span className="flex items-center gap-2.5"><ShieldAlert size={13} className="text-red-500" /> Thu hồi giấy phép</span>
                      <span>&rsaquo;</span>
                    </button>
                    <button onClick={() => setShowExtendModal(true)} className="w-full flex items-center justify-between px-4 py-3 bg-[#121826] hover:bg-[#1E293B] border border-[#1A2238] hover:border-red-500/30 text-left text-xs font-bold transition-all rounded-lg text-white hover:text-red-500">
                      <span className="flex items-center gap-2.5"><CalendarClock size={13} className="text-red-500" /> Gia hạn quyền truy cập</span>
                      <span>&rsaquo;</span>
                    </button>
                    <button onClick={() => setShowLogs(true)} className="w-full flex items-center justify-between px-4 py-3 bg-[#121826] hover:bg-[#1E293B] border border-[#1A2238] hover:border-red-500/30 text-left text-xs font-bold transition-all rounded-lg text-white hover:text-red-500">
                      <span className="flex items-center gap-2.5"><Terminal size={13} className="text-red-500" /> Xem nhật ký vận hành</span>
                      <span>&rsaquo;</span>
                    </button>
                  </div>
                </div>

                <div className="bg-[#121826]/70 border border-[#1A2238] p-5 rounded-xl flex-grow flex flex-col justify-center text-center relative overflow-hidden group">
                  <p className="text-[9px] text-gray-400 leading-relaxed italic">
                    "Chất lượng phát trực tuyến của các bản quét 4K hoàn chỉnh là không thể so sánh. Chiến dịch quảng bá Noir đã thúc đẩy mạnh tỷ lệ người xem trung thành."
                  </p>
                  <p className="text-[8px] font-black text-red-500 mt-2.5 tracking-widest uppercase">BỘ PHẬN TÌNH BÁO TIẾP THỊ</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SUBTAB 2: MOVIE INVENTORY */}
        {activeSubTab === 'inventory' && (
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold tracking-wider text-white uppercase">DANH MỤC PHIM STREAMING TRỰC TUYẾN</h3>
              <button 
                onClick={() => notificationService.info('Tính năng thêm phim mới trực tuyến sẽ được cập nhật.')} 
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-[10px] font-black uppercase rounded-lg transition-all shadow-md shadow-red-600/10"
              >
                <Plus size={13} /> Thêm phim phát
              </button>
            </div>

            <div className="bg-[#121826]/70 border border-[#1A2238] p-5 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-[9px] text-gray-400 border-b border-[#1A2238] uppercase font-bold tracking-wider">
                    <th className="py-2.5">TÊN BỘ PHIM</th>
                    <th className="py-2.5 px-2">ĐỊNH DẠNG</th>
                    <th className="py-2.5 px-2">LƯỢT PHÁT HIỆN TẠI</th>
                    <th className="py-2.5 px-2">MÁY CHỦ BIÊN (NODE)</th>
                    <th className="py-2.5 px-2">TRẠNG THÁI KHẢ DỤNG</th>
                    <th className="py-2.5 pl-2 text-right">ĐIỀU KHIỂN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2238]/30">
                  {inventory.map(item => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 font-bold text-white">{item.title}</td>
                      <td className="py-3 px-2 text-red-500 font-bold">{item.quality}</td>
                      <td className="py-3 px-2 font-mono text-[10px]">{item.activeStreams.toLocaleString()}</td>
                      <td className="py-3 px-2 text-gray-400">{item.server}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 text-[8px] font-bold rounded-sm ${
                          item.status === 'Đang phát' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {item.status === 'Đang phát' ? 'ĐANG STREAMING' : 'TẠM NGƯNG'}
                        </span>
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <button 
                          onClick={() => handleToggleInventoryStatus(item.id)}
                          className={`text-[9px] font-bold px-3 py-1 rounded-lg border ${
                            item.status === 'Đang phát'
                              ? 'border-amber-500/40 text-amber-500 hover:bg-amber-500/5'
                              : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/5'
                          }`}
                        >
                          {item.status === 'Đang phát' ? 'TẠM DỪNG' : 'BẮT ĐẦU'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 3: STREAMING LICENSES */}
        {activeSubTab === 'licenses' && (
          <div className="space-y-4 flex-1">
            <h3 className="text-xs font-bold tracking-wider text-white uppercase">QUẢN LÝ THẤT THOÁT GIẤY PHÉP VÀ KEY PHÁT</h3>
            <div className="bg-[#121826]/70 border border-[#1A2238] p-5 rounded-xl space-y-4 text-xs">
              <div className="p-3 bg-red-500/5 border border-red-500/20 text-gray-300 rounded-lg leading-relaxed">
                <span className="font-bold text-red-500">LƯU Ý VẬN HÀNH:</span> Giấy phép stream trực tuyến (Digital Licenses) là các khóa mã hóa một chiều được cấp phát cho thiết bị người dùng cuối. Mỗi khóa có thời hạn sử dụng 48 giờ kể từ lúc kích hoạt. Hệ thống sẽ tự động hủy các khóa bị phát hiện sử dụng đồng thời trên nhiều địa chỉ IP khác dải địa hạt.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs text-center">
                <div className="p-4 bg-[#0F1322]/60 border border-[#1A2238] rounded-lg">
                  <p className="text-gray-400 text-[8px] font-bold tracking-widest">TỔNG KHÓA ĐÃ CẤP</p>
                  <p className="text-xl font-bold text-white mt-1">1,248,920</p>
                </div>
                <div className="p-4 bg-[#0F1322]/60 border border-[#1A2238] rounded-lg">
                  <p className="text-gray-400 text-[8px] font-bold tracking-widest">KHÓA ĐANG DÙNG</p>
                  <p className="text-xl font-bold text-emerald-400 mt-1">12,482</p>
                </div>
                <div className="p-4 bg-[#0F1322]/60 border border-[#1A2238] rounded-lg">
                  <p className="text-gray-400 text-[8px] font-bold tracking-widest">KHÓA BỊ THU HỒI</p>
                  <p className="text-xl font-bold text-red-400 mt-1">1,421</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: USER ACCESS */}
        {activeSubTab === 'users' && (
          <div className="space-y-4 flex-1">
            <h3 className="text-xs font-bold tracking-wider text-white uppercase">GIÁM SÁT KẾT NỐI TẬP TRUNG KHÁCH HÀNG</h3>
            <div className="bg-[#121826]/70 border border-[#1A2238] p-5 rounded-xl">
              <div className="flex items-center gap-2.5 text-xs text-gray-400 mb-3">
                <Terminal size={14} className="text-red-500" />
                <span>Hoạt động kết nối trực tuyến của các tài khoản...</span>
              </div>
              <div className="space-y-2 text-[10px] font-mono bg-[#0F1322]/60 p-3 rounded-lg border border-[#1E293B]/20 max-h-56 overflow-y-auto text-emerald-400">
                <div>[12:53:11] Người dùng hoang.nguyen@gmail.com kết nối thành công từ IP 113.190.21.4 (Hà Nội, VN) - Thiết bị: Desktop (Vivaldi Browser)</div>
                <div>[12:54:02] Nút Edge-North phân phối băng thông 4.5 MB/s đến luồng Ánh Sáng Vĩnh Hằng (client_9011) - Ping: 12ms</div>
                <div>[12:55:12] Khởi tạo mã giải mã khóa bản quyền DRM cho phim "Giấc Mơ Celluloid" - Người dùng: mark.k@streamline.com</div>
                <div>[12:55:40] [CẢNH BÁO] Phát hiện địa chỉ IP thay đổi bất thường đối với khóa client_8422. Tiến hành giám sát gói tin...</div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 5: SYSTEM SETTINGS */}
        {activeSubTab === 'settings' && (
          <div className="space-y-4 flex-1">
            <h3 className="text-xs font-bold tracking-wider text-white uppercase">CÀI ĐẶT MÃ HÓA & TRUYỀN PHÁT BIÊN EDGE</h3>
            
            <div className="bg-[#121826]/70 border border-[#1A2238] p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[#1E293B]/20">
                <div>
                  <p className="text-xs font-bold text-white">Mã hóa luồng phát (AES-256-GCM)</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">Bảo vệ tín hiệu video phát tránh ghi màn hình và trích lọc tệp tin gốc.</p>
                </div>
                <button 
                  onClick={() => {
                    setEncryptionEnabled(!encryptionEnabled);
                    notificationService.info(`Đã ${!encryptionEnabled ? 'bật' : 'tắt'} mã hóa AES-256.`);
                  }}
                  className={`px-3.5 py-1.5 text-[9px] font-bold uppercase rounded-lg border ${
                    encryptionEnabled ? 'bg-emerald-500/10 border-emerald-500 text-emerald-450' : 'bg-red-500/10 border-red-500 text-red-400'
                  }`}
                >
                  {encryptionEnabled ? 'KÍCH HOẠT' : 'VÔ HIỆU HÓA'}
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-[#1E293B]/20">
                <div>
                  <p className="text-xs font-bold text-white">Chất lượng định dạng mặc định</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">Tự động ưu tiên độ phân giải phát tối đa cho kết nối người dùng.</p>
                </div>
                <select 
                  value={streamQuality} 
                  onChange={(e) => {
                    setStreamQuality(e.target.value);
                    notificationService.info(`Độ phân giải ưu tiên: ${e.target.value}`);
                  }}
                  className="bg-[#0F1322] border border-[#1A2238] text-[10px] px-2.5 py-1.5 text-white rounded-lg focus:outline-none"
                >
                  <option value="4K">4K UHD</option>
                  <option value="1080p">1080p Full HD</option>
                  <option value="720p">720p HD</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-xs font-bold text-white">Bộ nhớ đệm Edge Node Caching</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">Đẩy nhanh tốc độ phân phối dữ liệu bằng việc lưu đệm tạm thời tại nút cục bộ gần người dùng nhất.</p>
                </div>
                <button 
                  onClick={() => {
                    setEdgeCaching(!edgeCaching);
                    notificationService.info(`Edge Caching đã được thiết lập sang trạng thái: ${!edgeCaching ? 'BẬT' : 'TẤT'}`);
                  }}
                  className={`px-3.5 py-1.5 text-[9px] font-bold uppercase rounded-lg border ${
                    edgeCaching ? 'bg-emerald-500/10 border-emerald-500 text-emerald-450' : 'bg-red-500/10 border-red-500 text-red-400'
                  }`}
                >
                  {edgeCaching ? 'ĐANG BẬT' : 'ĐANG TẮT'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer info bar */}
        <footer className="terminal-sub-footer border-t border-[#1E293B]/20 pt-4 mt-6 flex flex-col md:flex-row justify-between items-center text-[7px] text-gray-500 tracking-wider uppercase font-bold gap-3">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span>GIAO THỨC: <span className="text-gray-300">HTTPS/V3</span></span>
            <span>MÃ HÓA HỆ THỐNG: <span className="text-gray-300">AES-256-GCM</span></span>
            <span>NODE QUỸ ĐẠO: <span className="text-gray-300">VN-EDGE-1</span></span>
          </div>
          <span>© 2024 NASAFILM DIGITAL EDGE CONSOLE</span>
        </footer>

      </div>

      {/* MODALS */}
      {/* 1. Logs Modal */}
      {showLogs && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0f172a] border border-[#1e293b] w-full max-w-[650px] h-[400px] flex flex-col justify-between shadow-2xl rounded-xl overflow-hidden">
            <div className="flex justify-between items-center border-b border-[#1e293b]/60 p-3 bg-[#0B0F19]/90">
              <span className="text-[10px] font-bold text-red-500 tracking-wider uppercase flex items-center gap-2">
                <Terminal size={13} className="animate-pulse" />
                NHẬT KÝ EDGE SERVER PHÂN PHỐI THỜI GIAN THỰC
              </span>
              <button onClick={() => setShowLogs(false)} className="text-gray-400 hover:text-red-500">
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-grow bg-black/80 p-4 font-mono text-[10px] leading-relaxed text-emerald-450 overflow-y-auto no-scrollbar space-y-0.5">
              {logsList.map((log, idx) => (
                <div key={idx} className="whitespace-pre-wrap font-mono">{log}</div>
              ))}
              <div ref={logsEndRef} />
            </div>

            <div className="border-t border-[#1e293b]/60 p-3.5 bg-[#0B0F19]/90 flex justify-between items-center text-[8px] text-gray-500 font-bold uppercase tracking-wider">
              <span>NODE LOGGER ID: MON_VN_LOG_01</span>
              <span>ĐỊNH KỲ QUÉT: 2000MS</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Revoke License Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#121826] border border-[#1A2238] w-full max-w-[360px] shadow-2xl rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-[#1A2238] pb-3">
              <span className="text-xs font-bold text-red-500 tracking-wider uppercase">THU HỒI GIẤY PHÉP STREAM</span>
              <button onClick={() => setShowRevokeModal(false)} className="text-gray-400 hover:text-red-500">
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-2">
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Nhập địa chỉ email người dùng hoặc khóa giải mã giấy phép để tiến hành thu hồi quyền phát trực tuyến ngay lập tức.
              </p>
              <input 
                type="text" 
                placeholder="Email hoặc Mã giấy phép (License Key)"
                className="w-full bg-[#0F1322] border border-[#1A2238] focus:border-red-500 text-xs px-3 py-2 text-white placeholder-gray-600 focus:outline-none rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 text-[10px] font-bold uppercase">
              <button onClick={() => setShowRevokeModal(false)} className="px-3.5 py-2 text-gray-400 hover:text-white">Hủy</button>
              <button 
                onClick={() => {
                  setShowRevokeModal(false);
                  notificationService.success('Đã tiến hành thu hồi khóa giải mã của khách hàng.');
                }} 
                className="px-4 py-2 bg-red-655 bg-red-600 text-white hover:bg-red-700 rounded-lg"
              >
                XÁC NHẬN THU HỒI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Extend Access Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#121826] border border-[#1A2238] w-full max-w-[360px] shadow-2xl rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-[#1A2238] pb-3">
              <span className="text-xs font-bold text-red-500 tracking-wider uppercase">GIA HẠN THỜI GIAN TRUY CẬP</span>
              <button onClick={() => setShowExtendModal(false)} className="text-gray-400 hover:text-red-500">
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-3.5">
              <div className="space-y-0.5">
                <label className="text-[8px] text-gray-400 font-bold uppercase block">EMAIL KHÁCH HÀNG</label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: julian.v@cinemail.com"
                  className="w-full bg-[#0F1322] border border-[#1A2238] focus:border-red-500 text-xs px-3 py-2 text-white placeholder-gray-600 focus:outline-none rounded-lg"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[8px] text-gray-400 font-bold uppercase block">THỜI GIAN GIA HẠN</label>
                <select className="w-full bg-[#0F1322] border border-[#1A2238] text-xs px-2.5 py-1.5 text-white focus:outline-none rounded-lg">
                  <option value="7">Gia hạn thêm 7 ngày</option>
                  <option value="30">Gia hạn thêm 30 ngày</option>
                  <option value="90">Gia hạn thêm 90 ngày</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 text-[10px] font-bold uppercase">
              <button onClick={() => setShowExtendModal(false)} className="px-3.5 py-2 text-gray-400 hover:text-white">Hủy</button>
              <button 
                onClick={() => {
                  setShowExtendModal(false);
                  notificationService.success('Quyền truy cập trực tuyến đã được gia hạn thành công.');
                }} 
                className="px-4 py-2 bg-red-655 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md shadow-red-600/10"
              >
                GIA HẠN NGAY
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
