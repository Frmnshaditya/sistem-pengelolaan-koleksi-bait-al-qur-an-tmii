import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  Calendar,
  Sparkles,
  ShieldCheck,
  FileText,
  User,
  PlusCircle,
  Edit,
  Trash,
  LogIn,
  RotateCcw,
  Printer
} from 'lucide-react';
import { ActivityLog, ActivityAction } from '../../types';
import { PrintHeader, PrintFooter } from '../common/PrintHeaderFooter';

interface ActivityLogViewerProps {
  activityLogs: ActivityLog[];
  onClearLogs?: () => void;
}

export const ActivityLogViewer: React.FC<ActivityLogViewerProps> = ({
  activityLogs
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const getActionIcon = (action: ActivityAction) => {
    switch (action) {
      case 'CREATE_COLLECTION':
        return <PlusCircle className="w-4 h-4 text-[#16a34a]" />;
      case 'UPDATE_COLLECTION':
        return <Edit className="w-4 h-4 text-[#9b4500]" />;
      case 'DELETE_COLLECTION':
        return <Trash className="w-4 h-4 text-[#ba1a1a]" />;
      case 'LOGIN':
      case 'LOGOUT':
        return <LogIn className="w-4 h-4 text-[#001e15]" />;
      case 'EXPORT_REPORT':
        return <FileText className="w-4 h-4 text-[#064e3b]" />;
      default:
        return <History className="w-4 h-4 text-[#717974]" />;
    }
  };

  const getActionBadge = (action: ActivityAction) => {
    switch (action) {
      case 'CREATE_COLLECTION':
        return <span className="px-2 py-0.5 bg-[#bcedd8] text-[#064e3b] text-[10px] font-bold rounded">Tambah Koleksi</span>;
      case 'UPDATE_COLLECTION':
        return <span className="px-2 py-0.5 bg-[#ffdbc9] text-[#9b4500] text-[10px] font-bold rounded">Ubah Koleksi</span>;
      case 'DELETE_COLLECTION':
        return <span className="px-2 py-0.5 bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold rounded">Hapus Koleksi</span>;
      case 'LOGIN':
        return <span className="px-2 py-0.5 bg-[#edeeeb] text-[#001e15] text-[10px] font-bold rounded">Login Sistem</span>;
      case 'EXPORT_REPORT':
        return <span className="px-2 py-0.5 bg-[#bcedd8]/40 text-[#001e15] text-[10px] font-bold rounded">Ekspor Laporan</span>;
      default:
        return <span className="px-2 py-0.5 bg-[#f3f4f1] text-[#717974] text-[10px] font-bold rounded">{action}</span>;
    }
  };

  const filteredLogs = useMemo(() => {
    return activityLogs.filter(log => {
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          log.user_name.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q) ||
          (log.object_title && log.object_title.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (selectedAction !== 'all' && log.action !== selectedAction) {
        return false;
      }

      return true;
    });
  }, [activityLogs, searchQuery, selectedAction]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#001e15]">
            Log Aktivitas & Jejak Audit
          </h1>
          <p className="text-xs text-[#717974] mt-0.5">
            Pencatatan kronologis otomatis setiap aksi penambahan, kurasi, perubahan naskah, dan ekspor data
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#001e15] bg-white hover:bg-[#f3f4f1] rounded-xl border border-[#e2e3e0] transition-colors"
            title="Cetak Buku Log Aktivitas Sistem"
          >
            <Printer className="w-3.5 h-3.5 text-[#001e15]" />
            <span>Cetak Log</span>
          </button>
          <div className="text-xs text-[#717974] bg-white px-3 py-2 rounded-xl border border-[#e2e3e0]">
            Total Catatan Log: <strong>{activityLogs.length}</strong> entri
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2e3e0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717974]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari nama staf, tindakan, atau nomor koleksi..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#f9faf7] rounded-xl border border-[#e2e3e0] outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
          <select
            value={selectedAction}
            onChange={(e) => {
              setSelectedAction(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 text-xs bg-[#f9faf7] rounded-xl border border-[#e2e3e0] outline-none"
          >
            <option value="all">Semua Jenis Aksi</option>
            <option value="CREATE_COLLECTION">Tambah Koleksi</option>
            <option value="UPDATE_COLLECTION">Ubah Data Koleksi</option>
            <option value="DELETE_COLLECTION">Hapus Koleksi</option>
            <option value="EXPORT_REPORT">Ekspor Dokumen</option>
            <option value="LOGIN">Masuk Administrator</option>
            <option value="UPDATE_MASTER_DATA">Ubah Master Data</option>
          </select>

          {searchQuery || selectedAction !== 'all' ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedAction('all');
                setCurrentPage(1);
              }}
              className="text-xs text-[#ba1a1a] hover:underline font-semibold whitespace-nowrap"
            >
              Reset
            </button>
          ) : null}
        </div>
      </div>

      {/* Timeline Table */}
      <div className="bg-white rounded-2xl border border-[#e2e3e0] shadow-xs overflow-hidden print:border-none print:shadow-none print:p-0">
        
        {/* Official Reusable Print Letterhead Header */}
        <PrintHeader
          title="LOG AUDIT & BUKU AKTIVITAS ADMINISTRASI SISTEM"
          subtitle="Sistem Informasi Pengelolaan Data Koleksi (SIPDK) • Museum Bait Al-Qur'an TMII"
          generatedBy="Administrator Sistem"
          userRole="Seksi Teknologi Informasi & Kuratorial"
          totalRecords={activityLogs.length}
          filterInfo={`Filter Aksi: ${selectedAction === 'all' ? 'Semua Aksi' : selectedAction} | Kata Kunci: "${searchQuery || 'Semua'}"`}
          classification="DOKUMEN LOG AUDIT INTERNAL"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#001e15] text-white">
                <th className="p-3.5 font-bold uppercase tracking-wider w-44">Waktu (WIB)</th>
                <th className="p-3.5 font-bold uppercase tracking-wider w-40">Pelaksana</th>
                <th className="p-3.5 font-bold uppercase tracking-wider w-36">Tindakan</th>
                <th className="p-3.5 font-bold uppercase tracking-wider">Rincian Aktivitas</th>
                <th className="p-3.5 font-bold uppercase tracking-wider w-32">IP / User Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edeeeb]">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#717974]">
                    Tidak ada aktivitas yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#f9faf7]">
                    {/* Timestamp */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="font-mono text-[#001e15] font-semibold block">
                        {new Date(log.timestamp).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="text-[11px] text-[#717974]">
                        {new Date(log.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })} WIB
                      </span>
                    </td>

                    {/* User */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#001e15]/10 flex items-center justify-center text-[#001e15] font-bold text-[10px]">
                          {log.user_name.charAt(0)}
                        </div>
                        <span className="font-bold text-[#1a1c1b]">{log.user_name}</span>
                      </div>
                    </td>

                    {/* Action badge */}
                    <td className="p-3.5 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>

                    {/* Details */}
                    <td className="p-3.5">
                      <p className="text-[#1a1c1b] leading-relaxed">
                        {log.details}
                      </p>
                      {log.object_title && (
                        <span className="text-[11px] text-[#717974] block mt-0.5">
                          Objek: <strong>{log.object_title}</strong>
                        </span>
                      )}
                    </td>

                    {/* IP Address */}
                    <td className="p-3.5 font-mono text-[#717974] whitespace-nowrap text-[11px]">
                      {log.ip_address || '127.0.0.1'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 bg-[#f9faf7] border-t border-[#e2e3e0] flex items-center justify-between print:hidden">
            <span className="text-xs text-[#717974]">
              Halaman {currentPage} dari {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white border border-[#e2e3e0] text-xs font-semibold rounded-lg disabled:opacity-40"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white border border-[#e2e3e0] text-xs font-semibold rounded-lg disabled:opacity-40"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}

        {/* Reusable Printable Official Footer */}
        <PrintFooter
          generatedBy="Administrator Sistem"
          userRole="Admin Sistem & Keamanan Data"
          signatureRightCity="Jakarta"
          signatureRightTitle="Mengetahui,&#10;Kepala Subbag Tata Usaha & IT BQMI TMII"
          signatureRightName="Drs. H. M. Zainuri, M.Ag"
          signatureRightNIP="NIP. 19680512 199403 1 003"
          signatureLeftTitle="Petugas Administrator IT,"
          signatureLeftName="Ahmad Fauzi, S.Kom"
          signatureLeftNIP="NIP. 19880920 201402 1 003"
          signatureLeftSub="Unit Pengelola Data Digital"
          notes="Dokumen log aktivitas ini dihasilkan otomatis oleh sistem pencatatan jejak audit Museum Bait Al-Qur'an TMII."
        />
      </div>

    </div>
  );
};
