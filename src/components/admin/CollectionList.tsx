import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  CheckSquare,
  Square,
  AlertCircle,
  QrCode
} from 'lucide-react';
import { Collection, Category, CollectionType, Condition, Location, User } from '../../types';
import { exportService } from '../../services/exportService';
import { printUtils } from '../../utils/printUtils';
import { PrintHeader, PrintFooter } from '../common/PrintHeaderFooter';
import { VitrineQrModal } from '../public/VitrineQrModal';

interface CollectionListProps {
  collections: Collection[];
  categories: Category[];
  collectionTypes: CollectionType[];
  conditions: Condition[];
  locations: Location[];
  currentUser: User | null;
  onSelectCollection: (c: Collection) => void;
  onEditCollection: (c: Collection) => void;
  onDeleteCollection: (id: number) => void;
  onOpenAddModal: () => void;
}

export const CollectionList: React.FC<CollectionListProps> = ({
  collections,
  categories,
  collectionTypes,
  conditions,
  locations,
  currentUser,
  onSelectCollection,
  onEditCollection,
  onDeleteCollection,
  onOpenAddModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<number | 'all'>('all');
  const [selectedCondition, setSelectedCondition] = useState<number | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'inventory_code' | 'created_at' | 'period_year'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [selectedQrCollection, setSelectedQrCollection] = useState<Collection | null>(null);

  // Cascading types based on category
  const availableTypes = useMemo(() => {
    if (selectedCategory === 'all') return collectionTypes;
    return collectionTypes.filter(t => t.category_id === selectedCategory);
  }, [collectionTypes, selectedCategory]);

  // Filtering & Sorting
  const filteredCollections = useMemo(() => {
    return collections.filter(item => {
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.inventory_code.toLowerCase().includes(q) ||
          item.origin_region.toLowerCase().includes(q) ||
          item.material.toLowerCase().includes(q) ||
          item.period_year.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (selectedCategory !== 'all' && item.category_id !== selectedCategory) return false;
      if (selectedType !== 'all' && item.collection_type_id !== selectedType) return false;
      if (selectedCondition !== 'all' && item.condition_id !== selectedCondition) return false;
      if (selectedLocation !== 'all' && item.location_id !== selectedLocation) return false;
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;

      return true;
    }).sort((a, b) => {
      let valA: string = (a[sortBy] || '').toString().toLowerCase();
      let valB: string = (b[sortBy] || '').toString().toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [
    collections,
    searchQuery,
    selectedCategory,
    selectedType,
    selectedCondition,
    selectedLocation,
    selectedStatus,
    sortBy,
    sortOrder
  ]);

  const totalPages = Math.ceil(filteredCollections.length / pageSize) || 1;
  const paginatedData = filteredCollections.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map(c => c.id));
    }
  };

  const toggleSelectId = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleExportSelectedPDF = () => {
    const targets = selectedIds.length > 0
      ? collections.filter(c => selectedIds.includes(c.id))
      : filteredCollections;
    exportService.exportToPDF(targets, {
      title: "LAPORAN INVENTARISASI DATA KOLEKSI",
      generatedBy: currentUser?.name || 'Administrator'
    });
  };

  const handleExportSelectedExcel = () => {
    const targets = selectedIds.length > 0
      ? collections.filter(c => selectedIds.includes(c.id))
      : filteredCollections;
    exportService.exportToExcel(targets, {
      generatedBy: currentUser?.name || 'Administrator'
    });
  };

  const handleSortChange = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedCondition('all');
    setSelectedLocation('all');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#001e15]">
            Pengelolaan Data Koleksi
          </h1>
          <p className="text-xs text-[#717974] mt-0.5">
            Manajemen inventaris, verifikasi kodikologi, status kurasi, dan riwayat preservasi
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Print Quick Document */}
          <button
            onClick={() => printUtils.printElement('collection-inventory-print-table', 'Daftar_Koleksi_BQMI_TMII')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#001e15] bg-[#f3f4f1] hover:bg-[#e7e8e6] rounded-xl border border-[#e2e3e0] transition-colors"
            title="Cetak tabel data koleksi (Format Kertas / PDF)"
          >
            <Printer className="w-3.5 h-3.5 text-[#001e15]" />
            <span>Cetak</span>
          </button>

          {/* Export PDF */}
          <button
            onClick={handleExportSelectedPDF}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#001e15] bg-[#f3f4f1] hover:bg-[#e7e8e6] rounded-xl border border-[#e2e3e0] transition-colors"
            title="Export data terpilih atau terfilter ke PDF"
          >
            <FileText className="w-3.5 h-3.5 text-[#ba1a1a]" />
            <span>PDF</span>
          </button>

          {/* Export Excel */}
          <button
            onClick={handleExportSelectedExcel}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#001e15] bg-[#f3f4f1] hover:bg-[#e7e8e6] rounded-xl border border-[#e2e3e0] transition-colors"
            title="Export data terpilih atau terfilter ke Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Excel</span>
          </button>

          {/* Add New Collection */}
          <button
            id="btn-tambah-koleksi-main"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#001e15] hover:bg-[#003527] rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 text-[#fd8a42]" />
            <span>Tambah Koleksi</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e2e3e0] shadow-xs flex flex-col gap-4">
        
        {/* Search row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717974]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari kode inventaris, nama naskah, asal daerah, bahan..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#f9faf7] rounded-xl border border-[#e2e3e0] focus:border-[#9b4500] outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#717974]"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs text-[#ba1a1a] hover:underline font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <span className="text-xs text-[#717974]">
              Hasil: <strong>{filteredCollections.length}</strong> data
            </span>
          </div>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-[#f3f4f1]">
          {/* Category */}
          <div>
            <label className="text-[10px] font-bold text-[#717974] uppercase block mb-1">Kategori</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value === 'all' ? 'all' : Number(e.target.value));
                setSelectedType('all');
                setCurrentPage(1);
              }}
              className="w-full p-2 text-xs bg-[#f9faf7] rounded-lg border border-[#e2e3e0] outline-none"
            >
              <option value="all">Semua Kategori</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="text-[10px] font-bold text-[#717974] uppercase block mb-1">Jenis Naskah</label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value === 'all' ? 'all' : Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full p-2 text-xs bg-[#f9faf7] rounded-lg border border-[#e2e3e0] outline-none"
            >
              <option value="all">Semua Jenis</option>
              {availableTypes.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="text-[10px] font-bold text-[#717974] uppercase block mb-1">Kondisi</label>
            <select
              value={selectedCondition}
              onChange={(e) => {
                setSelectedCondition(e.target.value === 'all' ? 'all' : Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full p-2 text-xs bg-[#f9faf7] rounded-lg border border-[#e2e3e0] outline-none"
            >
              <option value="all">Semua Kondisi</option>
              {conditions.map(cd => (
                <option key={cd.id} value={cd.id}>{cd.name}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="text-[10px] font-bold text-[#717974] uppercase block mb-1">Lokasi Ruang</label>
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value === 'all' ? 'all' : Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full p-2 text-xs bg-[#f9faf7] rounded-lg border border-[#e2e3e0] outline-none"
            >
              <option value="all">Semua Lokasi</option>
              {locations.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-[10px] font-bold text-[#717974] uppercase block mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 text-xs bg-[#f9faf7] rounded-lg border border-[#e2e3e0] outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="dipamerkan">Dipamerkan</option>
              <option value="disimpan">Disimpan di Depot</option>
              <option value="restorasi">Dalam Restorasi</option>
              <option value="dipinjam">Dipinjamkan</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main Table with Contained Horizontal Scrolling */}
      <div
        id="collection-inventory-print-table"
        className="bg-white rounded-2xl border border-[#e2e3e0] shadow-xs overflow-hidden print:border-none print:shadow-none print:p-0"
      >
        
        {/* Official Reusable Print Letterhead Header */}
        <PrintHeader
          title="DAFTAR INVENTARISASI KOLEKSI MUSEUM"
          subtitle="Sistem Informasi Pengelolaan Data Koleksi (SIPDK) • Museum Bait Al-Qur'an TMII"
          generatedBy={currentUser?.name || "Administrator Sistem"}
          userRole={currentUser?.role_title || "Staf Kurator"}
          totalRecords={filteredCollections.length}
          filterInfo={
            `Pencarian: "${searchQuery || 'Semua'}" | ` +
            `Kategori: ${selectedCategory === 'all' ? 'Semua' : categories.find(c => c.id === selectedCategory)?.name || '-'} | ` +
            `Kondisi: ${selectedCondition === 'all' ? 'Semua' : conditions.find(c => c.id === selectedCondition)?.name || '-'} | ` +
            `Lokasi: ${selectedLocation === 'all' ? 'Semua' : locations.find(l => l.id === selectedLocation)?.name || '-'}`
          }
        />

        {/* Table wrapper with overflow-x-auto */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse">
            
            {/* Header */}
            <thead>
              <tr className="bg-[#001e15] text-white border-b-2 border-[#fd8a42]">
                <th className="p-3.5 w-10 text-center">
                  <button onClick={toggleSelectAll} className="p-1 text-[#a0d1bc] hover:text-white">
                    {selectedIds.length === paginatedData.length && paginatedData.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-[#fd8a42]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3.5 font-bold uppercase tracking-wider whitespace-nowrap">
                  Foto
                </th>
                <th
                  onClick={() => handleSortChange('inventory_code')}
                  className="p-3.5 font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-[#fd8a42] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Kode Inventaris</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSortChange('name')}
                  className="p-3.5 font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-[#fd8a42] transition-colors min-w-[200px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Nama Koleksi</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5 font-bold uppercase tracking-wider whitespace-nowrap">
                  Kategori & Jenis
                </th>
                <th className="p-3.5 font-bold uppercase tracking-wider whitespace-nowrap">
                  Asal / Periode
                </th>
                <th className="p-3.5 font-bold uppercase tracking-wider whitespace-nowrap">
                  Kondisi Fisik
                </th>
                <th className="p-3.5 font-bold uppercase tracking-wider whitespace-nowrap">
                  Lokasi Simpan
                </th>
                <th className="p-3.5 font-bold uppercase tracking-wider text-center whitespace-nowrap w-28">
                  Aksi
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-[#edeeeb]">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-[#717974]">
                    Tidak ada data koleksi yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => {
                  const isSelected = selectedIds.includes(item.id);
                  const isEven = idx % 2 === 1;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-[#f3f4f1] transition-colors ${
                        isSelected ? 'bg-[#bcedd8]/20' : isEven ? 'bg-[#f9faf7]' : 'bg-white'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => toggleSelectId(item.id)}
                          className="p-1 text-[#717974] hover:text-[#001e15]"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#001e15]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Photo Thumbnail */}
                      <td className="p-3.5">
                        <img
                          src={item.images[0]?.url || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=120'}
                          alt=""
                          className="w-12 h-10 rounded-md object-cover shadow-xs border border-[#e2e3e0]"
                        />
                      </td>

                      {/* Kode Inv */}
                      <td className="p-3.5 font-mono font-bold text-[#001e15] whitespace-nowrap">
                        {item.inventory_code}
                      </td>

                      {/* Nama Koleksi */}
                      <td className="p-3.5">
                        <button
                          onClick={() => onSelectCollection(item)}
                          className="font-bold text-[#001e15] hover:text-[#9b4500] hover:underline text-left block"
                        >
                          {item.name}
                        </button>
                        <span className="text-[11px] text-[#717974] line-clamp-1">
                          {item.material}
                        </span>
                      </td>

                      {/* Kategori & Jenis */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="font-semibold text-[#1a1c1b] block">
                          {item.category_name}
                        </span>
                        <span className="text-[11px] text-[#717974]">
                          {item.collection_type_name || '-'}
                        </span>
                      </td>

                      {/* Asal & Periode */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="text-[#1a1c1b] font-medium block">
                          {item.origin_region}
                        </span>
                        <span className="text-[11px] text-[#717974]">
                          {item.period_year}
                        </span>
                      </td>

                      {/* Kondisi Badge */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className="px-2.5 py-1 text-[11px] font-bold rounded-full inline-block"
                          style={{
                            backgroundColor: `${item.condition_badge_color}18`,
                            color: item.condition_badge_color || '#16a34a'
                          }}
                        >
                          {item.condition_name}
                        </span>
                      </td>

                      {/* Lokasi */}
                      <td className="p-3.5 whitespace-nowrap text-[#404944]">
                        {item.location_name}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedQrCollection(item)}
                            className="p-1.5 text-[#001e15] bg-[#fd8a42]/20 hover:bg-[#fd8a42]/40 rounded-lg transition-colors"
                            title="Buat & Cetak Label QR Vitrin Akrilik"
                          >
                            <QrCode className="w-4 h-4 text-[#9b4500]" />
                          </button>
                          <button
                            onClick={() => onSelectCollection(item)}
                            className="p-1.5 text-[#001e15] hover:bg-[#bcedd8]/40 rounded-lg transition-colors"
                            title="Lihat Detail & Foto"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditCollection(item)}
                            className="p-1.5 text-[#9b4500] hover:bg-[#ffdbc9]/60 rounded-lg transition-colors"
                            title="Edit Data Koleksi"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="p-1.5 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-colors"
                            title="Hapus Koleksi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>

        {/* Pagination & Page Size */}
        <div className="p-4 bg-[#f9faf7] border-t border-[#e2e3e0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-[#717974]">
            <span>
              Menampilkan {filteredCollections.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{' '}
              {Math.min(currentPage * pageSize, filteredCollections.length)} dari {filteredCollections.length} total
            </span>
            <div className="flex items-center gap-1.5">
              <span>Baris per halaman:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="p-1 bg-white rounded border border-[#e2e3e0] text-xs font-semibold"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-[#e2e3e0] text-xs font-semibold disabled:opacity-40 hover:bg-white bg-white"
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                  currentPage === page
                    ? 'bg-[#001e15] text-white'
                    : 'bg-white text-[#404944] hover:bg-[#edeeeb] border border-[#e2e3e0]'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-[#e2e3e0] text-xs font-semibold disabled:opacity-40 hover:bg-white bg-white"
            >
              Selanjutnya
            </button>
          </div>
        </div>

        {/* Reusable Printable Official Footer */}
        <PrintFooter
          generatedBy={currentUser?.name || "Administrator Sistem"}
          userRole={currentUser?.role_title || "Staf Kurator"}
          signatureRightCity="Jakarta"
          signatureRightTitle="Mengetahui,&#10;Kepala Unit Registrasi & Kurasi BQMI TMII"
          signatureRightName="Dr. H. Muchlis M. Hanafi, M.A."
          signatureRightNIP="NIP. 19710818 199803 1 002"
          signatureLeftTitle="Petugas Pencatat Inventaris,"
          signatureLeftName={currentUser?.name || "Ahmad Fauzi, S.Hum"}
          signatureLeftNIP="NIP. 19850415 201101 1 008"
          signatureLeftSub="Seksi Pengelolaan Arsip & Koleksi"
        />

      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#e2e3e0] space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-serif text-lg font-bold text-[#001e15]">
                Hapus Data Koleksi Ini?
              </h3>
              <p className="text-xs text-[#717974] mt-1">
                Tindakan ini akan menghapus data spesimen dan foto terkait dari sistem inventaris.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 text-xs font-semibold bg-[#f3f4f1] text-[#404944] rounded-xl hover:bg-[#e7e8e6]"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteCollection(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2 text-xs font-bold bg-[#ba1a1a] text-white rounded-xl hover:bg-[#93000a]"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vitrine QR Modal */}
      <VitrineQrModal
        collection={selectedQrCollection}
        isOpen={!!selectedQrCollection}
        onClose={() => setSelectedQrCollection(null)}
      />

    </div>
  );
};
