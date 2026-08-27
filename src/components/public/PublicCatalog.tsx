import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  ChevronRight,
  BookOpen,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  ArrowUpDown,
  RotateCcw,
  QrCode
} from 'lucide-react';
import { Collection, Category, Condition, Location } from '../../types';
import { VitrineQrModal } from './VitrineQrModal';

interface PublicCatalogProps {
  collections: Collection[];
  categories: Category[];
  conditions: Condition[];
  locations: Location[];
  onSelectCollection: (collection: Collection) => void;
  onOpenMuseumInfo: () => void;
  globalSearchQuery: string;
}

export const PublicCatalog: React.FC<PublicCatalogProps> = ({
  collections,
  categories,
  conditions,
  locations,
  onSelectCollection,
  onOpenMuseumInfo,
  globalSearchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [selectedCondition, setSelectedCondition] = useState<number | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<number | 'all'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'period' | 'newest'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQrItem, setSelectedQrItem] = useState<Collection | null>(null);
  const itemsPerPage = 8;

  // Filter & Search Logic
  const filteredCollections = useMemo(() => {
    return collections.filter((item) => {
      // Global Search or local query
      if (globalSearchQuery.trim() !== '') {
        const q = globalSearchQuery.toLowerCase().trim();
        const matchesQuery =
          item.name.toLowerCase().includes(q) ||
          item.inventory_code.toLowerCase().includes(q) ||
          item.origin_region.toLowerCase().includes(q) ||
          item.material.toLowerCase().includes(q) ||
          item.period_year.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      if (selectedCategory !== 'all' && item.category_id !== selectedCategory) {
        return false;
      }

      if (selectedCondition !== 'all' && item.condition_id !== selectedCondition) {
        return false;
      }

      if (selectedLocation !== 'all' && item.location_id !== selectedLocation) {
        return false;
      }

      if (selectedPeriod !== 'all') {
        if (selectedPeriod === '18' && !item.period_year.includes('18')) return false;
        if (selectedPeriod === '19' && !item.period_year.includes('19')) return false;
        if (selectedPeriod === '20' && !item.period_year.includes('20')) return false;
        if (selectedPeriod === 'kuno' && !item.period_year.toLowerCase().includes('abad')) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'period') return a.period_year.localeCompare(b.period_year);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [
    collections,
    globalSearchQuery,
    selectedCategory,
    selectedCondition,
    selectedLocation,
    selectedPeriod,
    sortBy
  ]);

  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage) || 1;
  const paginatedCollections = filteredCollections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedCondition('all');
    setSelectedLocation('all');
    setSelectedPeriod('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      
      {/* Hero Welcome Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#001e15] via-[#003527] to-[#064e3b] text-white p-8 md:p-12 shadow-md border border-[#002a1e]">
        <div className="relative z-10 max-w-2xl flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fd8a42]/20 border border-[#fd8a42]/40 rounded-full text-[#fd8a42] text-xs font-bold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katalog Digital Resmi Pengunjung</span>
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight leading-tight text-white">
            Khazanah Koleksi Museum Bait Al-Qur’an
          </h1>

          <p className="text-sm md:text-base text-[#a0d1bc] leading-relaxed">
            Jelajahi keagungan manuskrip Al-Qur'an kuno, mushaf bersejarah Nusantara, dan karya seni kaligrafi Islam yang tersimpan di Kompleks Bayt Al-Qur'an & Museum Istiqlal TMII.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onOpenMuseumInfo}
              className="px-4 py-2 bg-[#fd8a42] text-[#001e15] font-bold text-xs rounded-xl shadow-sm hover:bg-[#ff914e] transition-colors"
            >
              Tentang Museum TMII
            </button>
            <div className="text-xs text-[#a0d1bc] font-medium">
              Total <strong>{collections.length}</strong> Benda Terdaftar
            </div>
          </div>
        </div>

        {/* Decorative Watermark Calligraphy Icon in background */}
        <div className="absolute right-6 -bottom-8 opacity-10 text-white pointer-events-none hidden md:block">
          <BookOpen className="w-80 h-80" />
        </div>
      </section>

      {/* Category Pills Slider */}
      <section className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => {
            setSelectedCategory('all');
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#001e15] text-white shadow-sm ring-2 ring-[#fd8a42]/40'
              : 'bg-white text-[#404944] hover:bg-[#f3f4f1] border border-[#e2e3e0]'
          }`}
        >
          Semua Kategori ({collections.length})
        </button>

        {categories.map((cat) => {
          const count = collections.filter((c) => c.category_id === cat.id).length;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#001e15] text-white shadow-sm ring-2 ring-[#fd8a42]/40'
                  : 'bg-white text-[#404944] hover:bg-[#f3f4f1] border border-[#e2e3e0]'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-[#fd8a42] text-[#001e15]' : 'bg-[#edeeeb] text-[#717974]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </section>

      {/* Controls Bar: Search feedback, Filters toggle, Sorting, View mode */}
      <section className="bg-white p-4 rounded-2xl border border-[#e2e3e0] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
              isFilterOpen || selectedCondition !== 'all' || selectedLocation !== 'all' || selectedPeriod !== 'all'
                ? 'bg-[#001e15] text-white border-[#001e15]'
                : 'bg-white text-[#404944] border-[#e2e3e0] hover:bg-[#f3f4f1]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-[#fd8a42]" />
            <span>Filter Lanjutan</span>
          </button>

          {(selectedCategory !== 'all' || selectedCondition !== 'all' || selectedLocation !== 'all' || selectedPeriod !== 'all' || globalSearchQuery) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs text-[#ba1a1a] hover:underline font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          )}

          <div className="text-xs text-[#717974]">
            Menampilkan <strong>{filteredCollections.length}</strong> koleksi
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#717974] hidden sm:inline">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-[#f3f4f1] text-[#1a1c1b] rounded-lg border border-[#e2e3e0] outline-none font-medium"
            >
              <option value="newest">Koleksi Terbaru</option>
              <option value="name">Nama Koleksi (A-Z)</option>
              <option value="period">Periode / Abad</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#edeeeb] p-0.5 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-[#001e15] shadow-xs' : 'text-[#717974]'
              }`}
              title="Tampilan Grid"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white text-[#001e15] shadow-xs' : 'text-[#717974]'
              }`}
              title="Tampilan List"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Advanced Filter Drawer if open */}
      {isFilterOpen && (
        <section className="p-5 bg-white rounded-2xl border border-[#e2e3e0] shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in duration-200">
          <div>
            <label className="text-xs font-bold text-[#001e15] block mb-1">Kondisi Koleksi</label>
            <select
              value={selectedCondition}
              onChange={(e) => {
                setSelectedCondition(e.target.value === 'all' ? 'all' : Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full p-2 text-xs bg-[#f9faf7] rounded-lg border border-[#e2e3e0] outline-none"
            >
              <option value="all">Semua Kondisi</option>
              {conditions.map((cond) => (
                <option key={cond.id} value={cond.id}>{cond.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#001e15] block mb-1">Lokasi Pamer / Galeri</label>
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value === 'all' ? 'all' : Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full p-2 text-xs bg-[#f9faf7] rounded-lg border border-[#e2e3e0] outline-none"
            >
              <option value="all">Semua Lokasi Ruang</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#001e15] block mb-1">Periode / Abad</label>
            <select
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 text-xs bg-[#f9faf7] rounded-lg border border-[#e2e3e0] outline-none"
            >
              <option value="all">Semua Periode</option>
              <option value="kuno">Manuskrip Kuno (Abad ke-14 s/d 17)</option>
              <option value="18">Abad ke-18 Masehi</option>
              <option value="19">Abad ke-19 Masehi</option>
              <option value="20">Abad ke-20 / Modern</option>
            </select>
          </div>
        </section>
      )}

      {/* Collections Grid / List View */}
      {filteredCollections.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#e2e3e0] p-8 flex flex-col items-center">
          <BookOpen className="w-16 h-16 text-[#c0c8c3] mb-3" />
          <h3 className="font-serif text-xl font-bold text-[#001e15] mb-1">Tidak Ditemukan Koleksi</h3>
          <p className="text-xs text-[#717974] max-w-md mb-4">
            Tidak ada koleksi yang sesuai dengan kata kunci atau filter yang Anda pilih. Silakan sesuaikan kriteria pencarian.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#001e15] text-white text-xs font-semibold rounded-xl hover:bg-[#003527] transition-colors"
          >
            Reset Seluruh Filter
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedCollections.map((item) => {
            const primaryImg = item.images.find(img => img.is_primary) || item.images[0];
            return (
              <div
                key={item.id}
                id={`card-koleksi-${item.id}`}
                onClick={() => onSelectCollection(item)}
                className="group bg-white rounded-2xl overflow-hidden border border-[#e2e3e0] shadow-xs hover:shadow-md hover:border-[#9b4500] transition-all cursor-pointer flex flex-col"
              >
                {/* Thumbnail Header */}
                <div className="relative aspect-4/3 bg-[#f3f4f1] overflow-hidden">
                  <img
                    src={primaryImg?.url || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600'}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 bg-[#001e15]/85 backdrop-blur-xs text-white text-[10px] font-bold rounded-md">
                      {item.inventory_code}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className="px-2 py-0.5 text-[10px] font-bold rounded-md shadow-xs"
                      style={{
                        backgroundColor: '#ffffff',
                        color: item.condition_badge_color || '#16a34a',
                        border: `1px solid ${item.condition_badge_color || '#16a34a'}`
                      }}
                    >
                      {item.condition_name?.split(' ')[0]}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9b4500]">
                      {item.category_name}
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#001e15] group-hover:text-[#9b4500] transition-colors line-clamp-2 mt-1 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#717974] line-clamp-2 leading-relaxed mb-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#f3f4f1] flex items-center justify-between text-xs text-[#717974]">
                    <span className="flex items-center gap-1 truncate max-w-[110px]">
                      <MapPin className="w-3 h-3 text-[#fd8a42] shrink-0" />
                      <span className="truncate">{item.origin_region}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedQrItem(item);
                        }}
                        className="p-1 rounded-md text-[#9b4500] hover:bg-[#fd8a42]/20 transition-colors"
                        title="Tampilkan Kode QR Vitrin"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] font-semibold text-[#001e15] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        Detail <ChevronRight className="w-3 h-3 text-[#fd8a42]" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="flex flex-col gap-3">
          {paginatedCollections.map((item) => {
            const primaryImg = item.images.find(img => img.is_primary) || item.images[0];
            return (
              <div
                key={item.id}
                onClick={() => onSelectCollection(item)}
                className="group bg-white rounded-xl p-3.5 sm:p-4 border border-[#e2e3e0] shadow-xs hover:shadow-md hover:border-[#9b4500] transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <div className="w-full sm:w-28 h-24 rounded-lg bg-[#f3f4f1] overflow-hidden shrink-0">
                  <img
                    src={primaryImg?.url || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2 py-0.5 bg-[#001e15] text-white text-[10px] font-bold rounded">
                      {item.inventory_code}
                    </span>
                    <span className="text-xs font-bold text-[#9b4500]">
                      {item.category_name}
                    </span>
                    <span className="text-xs text-[#717974]">• {item.period_year}</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#001e15] group-hover:text-[#9b4500] transition-colors truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#717974] line-clamp-1 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f3f4f1]">
                  <span
                    className="px-2.5 py-0.5 text-xs font-bold rounded-full"
                    style={{
                      backgroundColor: `${item.condition_badge_color}20`,
                      color: item.condition_badge_color
                    }}
                  >
                    {item.condition_name}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedQrItem(item);
                      }}
                      className="p-1 rounded-md text-[#9b4500] hover:bg-[#fd8a42]/20 transition-colors"
                      title="Tampilkan Kode QR Vitrin"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-[#001e15] flex items-center gap-1 group-hover:text-[#fd8a42]">
                      Lihat Spesimen <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#e2e3e0] shadow-xs">
          <div className="text-xs text-[#717974]">
            Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong> ({filteredCollections.length} item)
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-[#e2e3e0] text-xs font-semibold disabled:opacity-40 hover:bg-[#f3f4f1]"
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                  currentPage === page
                    ? 'bg-[#001e15] text-white'
                    : 'text-[#404944] hover:bg-[#f3f4f1]'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-[#e2e3e0] text-xs font-semibold disabled:opacity-40 hover:bg-[#f3f4f1]"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      {/* Vitrine QR Stand Modal */}
      <VitrineQrModal
        collection={selectedQrItem}
        isOpen={!!selectedQrItem}
        onClose={() => setSelectedQrItem(null)}
      />

    </div>
  );
};
