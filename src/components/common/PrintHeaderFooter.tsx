import React from 'react';
import { BookOpen, ShieldCheck, QrCode } from 'lucide-react';

export interface PrintHeaderProps {
  title?: string;
  subtitle?: string;
  documentNumber?: string;
  generatedDate?: Date | string;
  generatedBy?: string;
  userRole?: string;
  categoryName?: string;
  totalRecords?: number;
  filterInfo?: string;
  classification?: string;
  className?: string;
}

export interface PrintFooterProps {
  generatedDate?: Date | string;
  generatedBy?: string;
  userRole?: string;
  includeSignature?: boolean;
  signatureLeftTitle?: string;
  signatureLeftName?: string;
  signatureLeftNIP?: string;
  signatureLeftSub?: string;
  signatureRightCity?: string;
  signatureRightTitle?: string;
  signatureRightName?: string;
  signatureRightNIP?: string;
  signatureRightSub?: string;
  documentCode?: string;
  notes?: string;
  className?: string;
}

/**
 * Official Logo Emblem for Museum Bait Al-Qur'an & Museum Istiqlal (BQMI)
 */
export const MuseumLogoEmblem: React.FC<{ size?: number; className?: string }> = ({ 
  size = 48, 
  className = '' 
}) => {
  return (
    <div 
      className={`relative flex items-center justify-center rounded-xl bg-[#001e15] text-[#fd8a42] border border-[#003527] shadow-xs print:border-[#001e15] ${className}`}
      style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px` }}
      aria-label="Logo Museum Bait Al-Qur'an TMII"
    >
      {/* 8-Point Star Geometric Vector (Khatam / Rub el Hizb) */}
      <svg 
        viewBox="0 0 100 100" 
        className="absolute inset-1 w-[85%] h-[85%] text-[#fd8a42]/30 print:text-[#001e15]"
        fill="currentColor"
      >
        <polygon points="50,0 65,35 100,50 65,65 50,100 35,65 0,50 35,35" />
        <polygon points="50,10 78,22 90,50 78,78 50,90 22,78 10,50 22,22" opacity="0.4" />
      </svg>

      {/* Center Open Quran Vector Icon */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <BookOpen className="w-6 h-6 text-[#fd8a42] print:text-[#001e15]" strokeWidth={2.2} />
        <span className="text-[7px] font-bold tracking-tighter text-white uppercase print:text-[#001e15] mt-0.5">
          BQMI
        </span>
      </div>
    </div>
  );
};

/**
 * Reusable Print-Only Official Letterhead Header
 */
export const PrintHeader: React.FC<PrintHeaderProps> = ({
  title = "LAPORAN INVENTARISASI DATA KOLEKSI",
  subtitle = "Sistem Informasi Pengelolaan Data Koleksi (SIPDK) • Koleksi Naskah Mushaf & Khazanah Islam",
  documentNumber,
  generatedDate,
  generatedBy = "Administrator Sistem Kurasi",
  userRole = "Kurator Naskah",
  categoryName,
  totalRecords,
  filterInfo,
  classification = "DOKUMEN RESMI KURATORIAL",
  className = ""
}) => {
  const formattedDate = React.useMemo(() => {
    if (!generatedDate) {
      return new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    if (typeof generatedDate === 'string') return generatedDate;
    return generatedDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [generatedDate]);

  const docCode = documentNumber || `BQMI-INV-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <header className={`hidden print:block w-full text-[#001e15] mb-4 avoid-break ${className}`}>
      {/* 1. Top Government & Museum Letterhead (KOP SURAT DINAS) */}
      <div className="flex items-center justify-between pb-3">
        {/* Left: Official Emblem */}
        <div className="flex items-center gap-4">
          <MuseumLogoEmblem size={56} />
          
          <div className="text-left">
            <h3 className="text-[8.5pt] font-semibold tracking-wider uppercase text-[#29322e]">
              Kementerian Agama Republik Indonesia
            </h3>
            <h4 className="text-[9pt] font-medium tracking-wide uppercase text-[#404944]">
              Direktorat Jenderal Bimbingan Masyarakat Islam
            </h4>
            <h1 className="text-[13pt] font-serif font-bold tracking-tight uppercase text-[#001e15] leading-tight">
              Museum Bait Al-Qur’an & Museum Istiqlal (BQMI)
            </h1>
            <p className="text-[7.5pt] text-[#5c6460] leading-snug">
              Kompleks Taman Mini Indonesia Indah (TMII), Jl. Raya TMII Ceger, Cipayung, Jakarta Timur 13810
              <br />
              Telepon: (021) 8779-1144 • Surel: info@baitalquran.id • Laman: baytalquran.kemenag.go.id
            </p>
          </div>
        </div>

        {/* Right: Security Badge & Classification */}
        <div className="text-right flex flex-col items-end justify-center pl-4 border-l border-slate-300">
          <span className="px-2 py-0.5 bg-slate-100 border border-slate-400 text-[#001e15] text-[7pt] font-bold uppercase tracking-wider rounded">
            {classification}
          </span>
          <span className="text-[7.5pt] font-mono text-slate-700 mt-1 font-semibold">
            {docCode}
          </span>
          <div className="flex items-center gap-1 text-[7pt] text-slate-500 mt-0.5">
            <ShieldCheck className="w-3 h-3 text-emerald-800" />
            <span>Terverifikasi Digital</span>
          </div>
        </div>
      </div>

      {/* 2. Official Double Divider Lines (Standard Indonesian Official Letterhead) */}
      <div className="w-full mb-3">
        <div className="w-full border-t-[2.5pt] border-[#001e15]"></div>
        <div className="w-full border-t-[0.75pt] border-[#001e15] mt-[1.5pt]"></div>
      </div>

      {/* 3. Document Title Section */}
      <div className="text-center py-2 px-3 bg-slate-50 border border-slate-300 rounded mb-2">
        <h2 className="text-[12pt] font-serif font-bold uppercase tracking-wide text-[#001e15]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[8pt] text-[#404944] font-medium mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {/* 4. Metadata Strip (Date, User, Scope) */}
      <div className="grid grid-cols-3 gap-2 text-[8pt] bg-white border border-slate-300 px-3 py-1.5 rounded text-[#29322e]">
        <div>
          <span className="text-slate-500 font-medium">Tanggal Pembuatan: </span>
          <span className="font-bold text-[#001e15]">{formattedDate}</span>
        </div>
        <div className="text-center">
          <span className="text-slate-500 font-medium">Dicetak Oleh: </span>
          <span className="font-bold text-[#001e15]">{generatedBy} ({userRole})</span>
        </div>
        <div className="text-right">
          {totalRecords !== undefined ? (
            <>
              <span className="text-slate-500 font-medium">Jumlah Koleksi: </span>
              <span className="font-bold text-[#001e15]">{totalRecords} Spesimen</span>
            </>
          ) : categoryName ? (
            <>
              <span className="text-slate-500 font-medium">Kategori: </span>
              <span className="font-bold text-[#001e15]">{categoryName}</span>
            </>
          ) : (
            <>
              <span className="text-slate-500 font-medium">Status Dokumen: </span>
              <span className="font-bold text-emerald-900">Arsip Sah</span>
            </>
          )}
        </div>
        {filterInfo && (
          <div className="col-span-3 pt-1 border-t border-dashed border-slate-200 text-[7.5pt] text-slate-600">
            <span className="font-semibold text-slate-700">Parameter / Filter: </span>
            <span className="italic">{filterInfo}</span>
          </div>
        )}
      </div>
    </header>
  );
};

/**
 * Reusable Print-Only Official Footer with Signatures & Branding Watermarks
 */
export const PrintFooter: React.FC<PrintFooterProps> = ({
  generatedDate,
  generatedBy = "Administrator Sistem Kurasi",
  userRole = "Kurator Naskah",
  includeSignature = true,
  signatureLeftTitle = "Pemeriksa Konservasi Fisik & Laboratorium,",
  signatureLeftName = "Drs. H. M. Zainuri, M.Ag",
  signatureLeftNIP = "NIP. 19680512 199403 1 003",
  signatureLeftSub = "Kepala Laboratorium Konservasi BQMI TMII",
  signatureRightCity = "Jakarta",
  signatureRightTitle = "Mengetahui,\nKepala Kurator Museum Bait Al-Qur'an TMII",
  signatureRightName = "Dr. H. Muchlis M. Hanafi, M.A.",
  signatureRightNIP = "NIP. 19710818 199803 1 002",
  signatureRightSub = "Pakar Filologi & Mushaf Nusantara",
  documentCode,
  notes,
  className = ""
}) => {
  const formattedDate = React.useMemo(() => {
    if (!generatedDate) {
      return new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    if (typeof generatedDate === 'string') return generatedDate;
    return generatedDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [generatedDate]);

  const printTimestamp = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }) + ' WIB';

  return (
    <footer className={`hidden print:block w-full mt-6 avoid-break ${className}`}>
      {/* 1. Official Curatorial Sign-off Block */}
      {includeSignature && (
        <div className="grid grid-cols-2 gap-8 text-[8.5pt] text-[#001e15] pt-4 mb-6 border-t border-slate-300">
          {/* Left Signer: Conservator */}
          <div className="flex flex-col">
            <p className="font-semibold text-slate-800">{signatureLeftTitle}</p>
            <p className="text-[7.5pt] text-slate-500">{signatureLeftSub}</p>
            <div className="h-16 flex items-center pl-2">
              <span className="text-[7pt] text-slate-400 italic">[ Cap / Tanda Tangan Konservasi ]</span>
            </div>
            <p className="font-bold underline text-[#001e15]">{signatureLeftName}</p>
            <p className="text-[7.5pt] text-slate-600">{signatureLeftNIP}</p>
          </div>

          {/* Right Signer: Chief Curator */}
          <div className="flex flex-col text-right">
            <p className="font-semibold text-slate-800">
              {signatureRightCity}, {formattedDate}
            </p>
            <p className="font-semibold text-slate-800 whitespace-pre-line">
              {signatureRightTitle}
            </p>
            <p className="text-[7.5pt] text-slate-500">{signatureRightSub}</p>
            <div className="h-16 flex items-center justify-end pr-2">
              <span className="text-[7pt] text-slate-400 italic">[ Cap Dinas BQMI TMII ]</span>
            </div>
            <p className="font-bold underline text-[#001e15]">{signatureRightName}</p>
            <p className="text-[7.5pt] text-slate-600">{signatureRightNIP}</p>
          </div>
        </div>
      )}

      {notes && (
        <div className="mb-3 p-2 bg-slate-50 border border-slate-200 rounded text-[7.5pt] text-slate-600">
          <span className="font-semibold text-slate-700">Catatan Kurasi: </span>
          {notes}
        </div>
      )}

      {/* 2. Standardized Document Security Footer */}
      <div className="pt-2 border-t-[1.5pt] border-slate-300 flex items-center justify-between text-[7pt] text-slate-500">
        <div className="flex items-center gap-2">
          <MuseumLogoEmblem size={20} className="rounded" />
          <span>
            <strong>Museum Bait Al-Qur'an TMII</strong> • Sistem Informasi Pengelolaan Data Koleksi (SIPDK)
          </span>
        </div>

        <div className="text-center italic">
          Dokumen cetak ini sah dan resmi diterbitkan untuk keperluan administrasi kurasi BQMI.
        </div>

        <div className="text-right">
          <span>Dicetak: {formattedDate} • {printTimestamp}</span>
        </div>
      </div>
    </footer>
  );
};

/**
 * Wrapper component to inject PrintHeader and PrintFooter around printable content
 */
export const PrintDocumentContainer: React.FC<{
  headerProps?: PrintHeaderProps;
  footerProps?: PrintFooterProps;
  children: React.ReactNode;
  className?: string;
}> = ({
  headerProps,
  footerProps,
  children,
  className = ""
}) => {
  return (
    <div className={`w-full ${className}`}>
      <PrintHeader {...headerProps} />
      <div className="w-full">
        {children}
      </div>
      <PrintFooter {...footerProps} />
    </div>
  );
};
