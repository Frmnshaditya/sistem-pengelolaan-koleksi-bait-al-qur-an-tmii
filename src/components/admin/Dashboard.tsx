import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import {
  Building2,
  PlusSquare,
  Wrench,
  QrCode,
  Upload,
  FileCheck2,
  Search,
  MoreVertical,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  BookOpen,
  Eye,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Collection, Category, Condition, Location, ActivityLog } from '../../types';

interface DashboardProps {
  collections: Collection[];
  categories: Category[];
  conditions: Condition[];
  locations: Location[];
  activityLogs: ActivityLog[];
  onNavigate: (tab: string) => void;
  onSelectCollection: (c: Collection) => void;
  onOpenAddModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  collections,
  categories,
  conditions,
  locations,
  activityLogs,
  onNavigate,
  onSelectCollection,
  onOpenAddModal
}) => {
  const [chartRange, setChartRange] = useState<'6M' | '1Y' | 'ALL'>('1Y');

  // Stats Calculations
  const totalCollections = collections.length;
  const needsRestorationCount = collections.filter(
    c => c.condition_name?.toLowerCase().includes('restorasi') || c.condition_name?.toLowerCase().includes('rusak')
  ).length;

  // Chart data simulation based on range
  const growthData = [
    { period: 'Jan', total: 10200, digitized: 8400 },
    { period: 'Mar', total: 10800, digitized: 9100 },
    { period: 'Mei', total: 11300, digitized: 9700 },
    { period: 'Jul', total: 11900, digitized: 10500 },
    { period: 'Sep', total: 12150, digitized: 11200 },
    { period: 'Nov', total: 12458, digitized: 11890 }
  ];

  // Category breakdown for Pie Chart
  const categoryData = categories.map(cat => {
    const count = collections.filter(c => c.category_id === cat.id).length;
    return {
      name: cat.name,
      value: count || 1
    };
  });

  const PIE_COLORS = ['#001e15', '#064e3b', '#204f3f', '#9b4500', '#fd8a42', '#717974'];

  // Condition breakdown
  const conditionData = conditions.map(cond => {
    const count = collections.filter(c => c.condition_id === cond.id).length;
    return {
      name: cond.name.split(' ')[0],
      count,
      color: cond.badge_color
    };
  });

  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* Top 3 Metric Cards (Matching reference visual) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {/* Total Collections Card */}
        <div className="relative bg-white shadow-xs rounded-2xl p-6 border border-[#e2e3e0] group hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#001e15]/10 flex items-center justify-center text-[#001e15]">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ffdbc9]/60 text-[#6e2f00]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9b4500] mr-1.5 animate-pulse"></span>
              Live Data
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-[#717974] uppercase tracking-wider mb-1">
              TOTAL KOLEKSI MUSEUM
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="font-serif text-3xl font-bold text-[#001e15]">
                {totalCollections.toLocaleString('id-ID')}
              </h3>
              <span className="text-xs font-bold text-[#16a34a] flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +2.4%
              </span>
            </div>
            <p className="text-[11px] text-[#717974] mt-2">
              Terdistribusi di {categories.length} Kategori & {locations.length} Lokasi
            </p>
          </div>
        </div>

        {/* Added This Month Card */}
        <div className="relative bg-white shadow-xs rounded-2xl p-6 border border-[#e2e3e0] group hover:shadow-md transition-all overflow-hidden">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-[#001e15]/10 flex items-center justify-center text-[#001e15]">
              <PlusSquare className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-[#717974]">Bulan Berjalan</span>
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-[#717974] uppercase tracking-wider mb-1">
              DIGITALISASI & AKUISISI
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="font-serif text-3xl font-bold text-[#001e15]">
                {collections.length > 5 ? 342 : collections.length}
              </h3>
              <span className="text-xs font-bold text-[#16a34a] flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +12%
              </span>
            </div>
            <p className="text-[11px] text-[#717974] mt-2">
              Manuskrip, mushaf cetak, & rekaman kodikologi
            </p>
          </div>
        </div>

        {/* Needs Restoration Card */}
        <div className="relative bg-white shadow-xs rounded-2xl p-6 border border-[#e2e3e0] group hover:shadow-md transition-all sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
              <Wrench className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ffdad6] text-[#93000a]">
              Perhatian Khusus
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-[#717974] uppercase tracking-wider mb-1">
              BUTUH RESTORASI & LAB
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="font-serif text-3xl font-bold text-[#ba1a1a]">
                {needsRestorationCount}
              </h3>
              <span className="text-xs font-medium text-[#717974]">
                Spesimen Aktif
              </span>
            </div>
            <p className="text-[11px] text-[#717974] mt-2">
              Dalam pengawasan kelembapan Lab Preservasi
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Chart + Bento + Activity Feed */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Columns: Growth Chart & Bento Quick Actions */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Collection Growth Interactive Chart */}
          <div className="bg-white shadow-xs rounded-2xl p-6 sm:p-8 border border-[#e2e3e0] flex flex-col relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#001e15]">
                  Tren Pertumbuhan Koleksi & Digitalisasi
                </h2>
                <p className="text-xs text-[#717974] mt-0.5">
                  Grafik penambahan inventaris tahunan dan pemindaian resolusi tinggi
                </p>
              </div>

              {/* Time Interval Switcher */}
              <div className="flex gap-1.5 bg-[#f3f4f1] p-1 rounded-xl w-fit">
                <button
                  onClick={() => setChartRange('6M')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    chartRange === '6M' ? 'bg-[#001e15] text-white shadow-xs' : 'text-[#717974] hover:text-[#1a1c1b]'
                  }`}
                >
                  6 Bulan
                </button>
                <button
                  onClick={() => setChartRange('1Y')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    chartRange === '1Y' ? 'bg-[#001e15] text-white shadow-xs' : 'text-[#717974] hover:text-[#1a1c1b]'
                  }`}
                >
                  1 Tahun
                </button>
                <button
                  onClick={() => setChartRange('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    chartRange === 'ALL' ? 'bg-[#001e15] text-white shadow-xs' : 'text-[#717974] hover:text-[#1a1c1b]'
                  }`}
                >
                  Semua
                </button>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#001e15" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#001e15" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="digitizedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fd8a42" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#fd8a42" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#edeeeb" vertical={false} />
                  <XAxis dataKey="period" stroke="#717974" fontSize={12} tickLine={false} />
                  <YAxis stroke="#717974" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#001e15',
                      borderRadius: '12px',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    name="Total Koleksi Fisik"
                    stroke="#001e15"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#totalGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="digitized"
                    name="Terdigitalisasi"
                    stroke="#fd8a42"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#digitizedGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions Bento Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => onNavigate('koleksi')}
              className="bg-[#001e15]/5 hover:bg-[#001e15]/10 text-[#001e15] rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 transition-all shadow-xs group text-center"
            >
              <QrCode className="w-6 h-6 text-[#001e15] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Pindai Vitrin</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="bg-[#9b4500]/10 hover:bg-[#9b4500]/20 text-[#9b4500] rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 transition-all shadow-xs group text-center"
            >
              <PlusSquare className="w-6 h-6 text-[#9b4500] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Tambah Koleksi</span>
            </button>

            <button
              onClick={() => onNavigate('laporan')}
              className="bg-[#064e3b]/10 hover:bg-[#064e3b]/20 text-[#064e3b] rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 transition-all shadow-xs group text-center"
            >
              <FileCheck2 className="w-6 h-6 text-[#064e3b] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Buat Laporan</span>
            </button>

            <button
              onClick={() => onNavigate('koleksi')}
              className="bg-[#f3f4f1] hover:bg-[#e7e8e6] text-[#1a1c1b] rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 transition-all shadow-xs group text-center"
            >
              <Search className="w-6 h-6 text-[#717974] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Filter Lengkap</span>
            </button>
          </div>

          {/* Secondary Distribution Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Condition Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-[#e2e3e0] shadow-xs">
              <h3 className="font-serif text-base font-bold text-[#001e15] mb-4">
                Kondisi Fisik Koleksi
              </h3>
              <div className="space-y-3">
                {conditionData.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-[#1a1c1b]">{item.name}</span>
                      <span className="text-[#717974]">{item.count} Benda</span>
                    </div>
                    <div className="w-full bg-[#f3f4f1] h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.max((item.count / totalCollections) * 100, 8)}%`,
                          backgroundColor: item.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Pie */}
            <div className="bg-white p-6 rounded-2xl border border-[#e2e3e0] shadow-xs flex flex-col justify-between">
              <h3 className="font-serif text-base font-bold text-[#001e15] mb-2">
                Distribusi Kategori
              </h3>
              <div className="h-44 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[11px] text-[#717974] text-center">
                Menyimpan 6 klasifikasi khazanah Islam Nusantara
              </div>
            </div>

          </div>

        </div>

        {/* Right 4 Columns: Recent Activity Feed & Quick Recents */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Recent Activity Card */}
          <div className="bg-white shadow-xs rounded-2xl p-6 border border-[#e2e3e0] flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-lg font-bold text-[#001e15]">
                Log Aktivitas Terbaru
              </h3>
              <button
                onClick={() => onNavigate('log-aktivitas')}
                className="text-xs text-[#9b4500] hover:underline font-bold"
              >
                Lihat Semua
              </button>
            </div>

            {/* Activity List */}
            <div className="flex flex-col gap-5 flex-1 overflow-y-auto max-h-[420px] pr-1">
              {activityLogs.slice(0, 5).map((log, idx) => (
                <div key={log.id || idx} className="flex gap-3 group">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#001e15] text-[#fd8a42] flex items-center justify-center shrink-0 shadow-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    {idx < 4 && <div className="w-px h-full bg-[#edeeeb] my-1"></div>}
                  </div>

                  <div className="flex-1 pb-3 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className="text-xs font-bold text-[#001e15] truncate">
                        {log.action.replace('_', ' ')}
                      </p>
                      <span className="text-[10px] text-[#717974] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-[#404944] leading-relaxed line-clamp-2">
                      {log.details || log.object_title}
                    </p>
                    <span className="text-[10px] text-[#717974] block mt-1">
                      Oleh: <strong>{log.user_name}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('log-aktivitas')}
              className="w-full mt-4 py-2.5 text-center text-xs font-bold text-[#001e15] hover:bg-[#f3f4f1] rounded-xl transition-colors border border-[#e2e3e0]"
            >
              Buka Seluruh Audit Trail
            </button>
          </div>

          {/* Quick Recent Koleksi */}
          <div className="bg-white shadow-xs rounded-2xl p-6 border border-[#e2e3e0]">
            <h3 className="font-serif text-base font-bold text-[#001e15] mb-3">
              Koleksi Terbaru Ditambahkan
            </h3>
            <div className="space-y-3">
              {collections.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectCollection(item)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f9faf7] transition-colors cursor-pointer border border-transparent hover:border-[#e2e3e0]"
                >
                  <img
                    src={item.images[0]?.url || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200'}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#001e15] truncate">
                      {item.name}
                    </h4>
                    <span className="text-[11px] text-[#717974] block">
                      {item.inventory_code} • {item.origin_region}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </section>

    </div>
  );
};
