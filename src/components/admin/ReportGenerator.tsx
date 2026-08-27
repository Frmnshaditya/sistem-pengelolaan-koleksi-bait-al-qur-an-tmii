import React, { useState, useMemo } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Filter,
  Layers,
  Sparkles,
  Building2,
  CheckCircle2,
  Table
} from 'lucide-react';
import { Collection, Category, Condition, Location, User } from '../../types';
import { exportService } from '../../services/exportService';
import { printUtils } from '../../utils/printUtils';
import { PrintHeader, PrintFooter } from '../common/PrintHeaderFooter';

interface ReportGeneratorProps {
  collections: Collection[];
  categories: Category[];
  conditions: Condition[];
  locations: Location[];
  currentUser: User | null;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  collections,
  categories,
  conditions,
  locations,
  currentUser
}) => {
  const [reportTitle, setReportTitle] = useState('LAPORAN INVENTARISASI KOLEKSI MUSEUM BAIT AL-QUR\'AN TMII');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [selectedCondition, setSelectedCondition] = useState<number | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);

  const filteredData = useMemo(() => {
    return collections.filter(item => {
      if (selectedCategory !== 'all' && item.category_id !== selectedCategory) return false;
      if (selectedCondition !== 'all' && item.condition_id !== selectedCondition) return false;
      if (selectedLocation !== 'all' && item.location_id !== selectedLocation) return false;
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
      return true;
    });
  }, [collections, selectedCategory, selectedCondition, selectedLocation, selectedStatus]);

  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      exportService.exportToPDF(filteredData, {
        title: reportTitle,
        subtitle: `Dicetak berdasarkan filter: Kategori (${selectedCategory === 'all' ? 'Semua' : categories.find(c => c.id === selectedCategory)?.name}), Kondisi (${selectedCondition === 'all' ? 'Semua' : conditions.find(c => c.id === selectedCondition)?.name})`,
        generatedBy: currentUser?.name || 'Administrator Museum',
        includeSignatures: true
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = () => {
    setIsExporting(true);
    try {
      exportService.exportToExcel(filteredData, {
        sheetName: 'Data Koleksi Museum',
        generatedBy: currentUser?.name || 'Administrator Museum'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    printUtils.printElement('report-generator-print-area', reportTitle);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#001e15]">
            Generator Laporan Inventaris
          </h1>
          <p className="text-xs text-[#717974] mt-0.5">
            Cetak dan unduh lembar kurasi resmi naskah berformat PDF berstempel atau Spreadsheet Excel
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            disabled={isExporting || filteredData.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-[#ba1a1a] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#93000a] disabled:opacity-40 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Unduh Dokumen PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            disabled={isExporting || filteredData.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-[#16a34a] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#15803d] disabled:opacity-40 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Unduh Format Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-white text-[#001e15] border border-[#e2e3e0] text-xs font-semibold rounded-xl hover:bg-[#f3f4f1] transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak</span>
          </button>
        </div>
      </div>

      {/* Filter & Customization Panel */}
      <div className="bg-white p-5 rounded-2xl border border-[#e2e3e0] shadow-xs space-y-4">
        <h3 className="font-serif text-base font-bold text-[#001e15]">
          Kustomisasi Parameter Laporan
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Judul Laporan */}
          <div className="sm:col-span-2">
            <label className="text-[10px] font-bold text-[#717974] uppercase block mb-1">Judul Dokumen Resmi</label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full p-2 text-xs bg-[#f9faf7] rounded-lg border border-[#e2e3e0] outline-none font-semibold"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="text-[10px] font-bold text-[#717974] uppercase block mb-1">Filter Kategori</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full p-2 text-xs bg-[#f9faf7] rounded-lg border border-[#e2e3e0] outline-none"
            >
              <option value="all">Semua Kategori</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Kondisi */}
          <div>
            <label className="text-[10px] font-bold text-[#717974] uppercase block mb-1">Filter Kondisi Fisik</label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full p-2 text-xs bg-[#f9faf7] rounded-lg border border-[#e2e3e0] outline-none"
            >
              <option value="all">Semua Kondisi</option>
              {conditions.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Lokasi */}
          <div>
            <label className="text-[10px] font-bold text-[#717974] uppercase block mb-1">Filter Lokasi Ruang</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full p-2 text-xs bg-[#f9faf7] rounded-lg border border-[#e2e3e0] outline-none"
            >
              <option value="all">Semua Lokasi</option>
              {locations.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Summary Badges */}
        <div className="pt-3 border-t border-[#f3f4f1] flex flex-wrap items-center justify-between text-xs text-[#717974] gap-2">
          <div className="flex items-center gap-3">
            <span>
              Total Baris Laporan: <strong>{filteredData.length}</strong> spesimen
            </span>
            <span>•</span>
            <span>
              Penyusun: <strong>{currentUser?.name || 'Administrator'}</strong>
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#064e3b] bg-[#bcedd8]/40 px-2.5 py-0.5 rounded-full">
            Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Live Table Preview for Report */}
      <div
        id="report-generator-print-area"
        className="bg-white rounded-2xl border border-[#e2e3e0] shadow-xs overflow-hidden print:shadow-none print:border-none print:p-0"
      >
        
        {/* Official Reusable Print Letterhead Header */}
        <PrintHeader
          title={reportTitle}
          subtitle="Sistem Informasi Pengelolaan Data Koleksi (SIPDK) • Laporan Rekapitulasi Inventarisasi Naskah"
          generatedBy={currentUser?.name || 'Administrator'}
          userRole={currentUser?.role_title || 'Kurator Pelaksana'}
          totalRecords={filteredData.length}
          filterInfo={
            `Kategori: ${selectedCategory === 'all' ? 'Semua Kategori' : categories.find(c => c.id === selectedCategory)?.name || '-'} | ` +
            `Kondisi: ${selectedCondition === 'all' ? 'Semua Kondisi' : conditions.find(c => c.id === selectedCondition)?.name || '-'} | ` +
            `Lokasi: ${selectedLocation === 'all' ? 'Semua Lokasi' : locations.find(l => l.id === selectedLocation)?.name || '-'}`
          }
        />

        <div className="p-4 bg-[#001e15] text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Table className="w-4 h-4 text-[#fd8a42]" />
            <span>Pratinjau Data Laporan (Live Table Preview)</span>
          </div>
          <span className="text-[11px] text-[#a0d1bc]">
            {filteredData.length} koleksi siap diekspor
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f9faf7] text-[#001e15] border-b border-[#e2e3e0]">
                <th className="p-3 font-bold uppercase w-10 text-center">No</th>
                <th className="p-3 font-bold uppercase">Kode Inventaris</th>
                <th className="p-3 font-bold uppercase">Nama Koleksi / Naskah</th>
                <th className="p-3 font-bold uppercase">Kategori</th>
                <th className="p-3 font-bold uppercase">Asal / Periode</th>
                <th className="p-3 font-bold uppercase">Bahan</th>
                <th className="p-3 font-bold uppercase">Kondisi</th>
                <th className="p-3 font-bold uppercase">Lokasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edeeeb]">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#717974]">
                    Tidak ada data koleksi yang memenuhi kriteria filter laporan.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[#f9faf7]">
                    <td className="p-3 text-center text-[#717974]">{idx + 1}</td>
                    <td className="p-3 font-mono font-bold text-[#001e15] whitespace-nowrap">{item.inventory_code}</td>
                    <td className="p-3 font-bold text-[#1a1c1b]">{item.name}</td>
                    <td className="p-3 text-[#404944] whitespace-nowrap">{item.category_name}</td>
                    <td className="p-3 text-[#404944] whitespace-nowrap">{item.origin_region} ({item.period_year})</td>
                    <td className="p-3 text-[#717974]">{item.material}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{
                          backgroundColor: `${item.condition_badge_color}20`,
                          color: item.condition_badge_color
                        }}
                      >
                        {item.condition_name}
                      </span>
                    </td>
                    <td className="p-3 text-[#404944] whitespace-nowrap">{item.location_name}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Reusable Printable Official Footer with Signatures */}
        <PrintFooter
          generatedBy={currentUser?.name || 'Ahmad Fauzi, S.Hum'}
          userRole={currentUser?.role_title || 'Kurator Pelaksana'}
          signatureRightCity="Jakarta"
          signatureRightTitle="Mengetahui,&#10;Kepala Museum Bait Al-Qur'an TMII"
          signatureRightName="Dr. H. Muchlis M. Hanafi, M.A."
          signatureRightNIP="NIP. 19710818 199803 1 002"
          signatureLeftTitle="Petugas Kurator Pelaksana,"
          signatureLeftName={currentUser?.name || 'Ahmad Fauzi, S.Hum'}
          signatureLeftNIP="NIP. 19850415 201101 1 008"
          signatureLeftSub={currentUser?.role_title || 'Kurator Naskah Kuno BQMI TMII'}
          notes="Laporan inventarisasi ini merupakan rekapitulasi data fisik naskah mushaf yang tersimpan di vitrin pamer dan ruang konservasi Museum Bait Al-Qur'an TMII."
        />

      </div>

    </div>
  );
};
