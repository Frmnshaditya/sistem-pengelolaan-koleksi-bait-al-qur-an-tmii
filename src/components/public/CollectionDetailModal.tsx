import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  Maximize2,
  Calendar,
  MapPin,
  Tag,
  Layers,
  Sparkles,
  Info,
  QrCode,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Compass,
  FileCheck2,
  Download,
  ExternalLink
} from 'lucide-react';
import { Collection } from '../../types';
import { PrintHeader, PrintFooter } from '../common/PrintHeaderFooter';
import { VitrineQrModal } from './VitrineQrModal';
import { exportService } from '../../services/exportService';
import { printUtils } from '../../utils/printUtils';

interface CollectionDetailModalProps {
  collection: Collection | null;
  isOpen: boolean;
  onClose: () => void;
  isStaff?: boolean;
  onEdit?: (collection: Collection) => void;
}

export const CollectionDetailModal: React.FC<CollectionDetailModalProps> = ({
  collection,
  isOpen,
  onClose,
  isStaff,
  onEdit
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  if (!isOpen || !collection) return null;

  const currentImage = collection.images[selectedImageIndex] || collection.images[0] || {
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800',
    caption: 'Foto Koleksi'
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : 'https://baitalquran.id';
  const scanUrl = `${baseUrl}?koleksi=${collection.inventory_code}&id=${collection.id}`;

  const handlePrintCuratorialSheet = () => {
    printUtils.printElement('collection-curatorial-sheet', `Kajian_Kurasi_${collection.inventory_code}`);
  };

  const handleExportPDF = () => {
    exportService.exportSingleCollectionPDF(collection);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
        <div
          id="collection-curatorial-sheet"
          className="relative w-full max-w-5xl bg-[#ffffff] rounded-2xl shadow-2xl border border-[#e2e3e0] overflow-hidden my-4 flex flex-col max-h-[92vh] animate-in fade-in zoom-in duration-200"
        >
          
          {/* Official Reusable Print Letterhead Header */}
          <div className="p-6 pb-2 hidden print:block">
            <PrintHeader
              title="LEMBAR KAJIAN KURATORIAL & SPESIFIKASI KOLEKSI"
              subtitle={`Dokumen Registrasi Inventaris Khazanah Naskah • ${collection.category_name}`}
              documentNumber={`REG-${collection.inventory_code}`}
              generatedBy={collection.created_by || "Kurator Utama BQMI"}
              userRole="Kodikolog & Filolog"
              categoryName={collection.category_name}
              filterInfo={`Lokasi: ${collection.location_name} | Kondisi: ${collection.condition_name} | Asal: ${collection.origin_region} (${collection.period_year})`}
              classification="LEMBAR REGISTRASI KURATORIAL"
            />
          </div>

          {/* Top Sticky Bar */}
          <div className="px-6 py-4 bg-[#001e15] text-white flex items-center justify-between border-b border-[#003527] shrink-0 print:hidden">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-[#fd8a42] text-[#001e15] font-bold text-xs rounded-md">
                {collection.inventory_code}
              </span>
              <span className="text-xs text-[#a0d1bc] hidden sm:inline">
                {collection.category_name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* QR Vitrin Button */}
              <button
                onClick={() => setShowQrModal(true)}
                className="px-3 py-1.5 rounded-lg bg-[#fd8a42] hover:bg-[#ff944d] text-[#001e15] text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                title="Buka Generator Label & QR Stand Vitrin Akrilik"
              >
                <QrCode className="w-4 h-4 text-[#001e15]" />
                <span>QR Vitrin</span>
              </button>

              {/* Cetak Langsung */}
              <button
                onClick={handlePrintCuratorialSheet}
                className="p-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 transition-colors"
                title="Cetak Lembar Kajian Kurasi"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Cetak</span>
              </button>

              {/* Unduh PDF Resmi */}
              <button
                onClick={handleExportPDF}
                className="p-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 transition-colors"
                title="Unduh Dokumen PDF Resmi"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">PDF</span>
              </button>

              {isStaff && onEdit && (
                <button
                  onClick={() => {
                    onClose();
                    onEdit(collection);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors"
                >
                  Edit Data
                </button>
              )}

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Col: High-Res Media Gallery (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Main Image Stage */}
                <div className="relative rounded-2xl overflow-hidden bg-[#1a1c1b] aspect-4/3 flex items-center justify-center group shadow-md border border-[#edeeeb]">
                  <img
                    src={currentImage.url}
                    alt={currentImage.caption || collection.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Fullscreen Button */}
                  <button
                    onClick={() => setIsFullscreenImage(true)}
                    className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 text-white hover:bg-black/80 backdrop-blur-xs transition-all print:hidden"
                    title="Perbesar Tampilan Foto"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* Status Overlay */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="px-3 py-1 text-xs font-bold rounded-full shadow-sm"
                      style={{
                        backgroundColor: `${collection.condition_badge_color}20`,
                        color: collection.condition_badge_color || '#16a34a',
                        border: `1px solid ${collection.condition_badge_color}`
                      }}
                    >
                      {collection.condition_name}
                    </span>
                  </div>
                </div>

                {/* Caption */}
                {currentImage.caption && (
                  <p className="text-xs text-[#717974] italic text-center px-2">
                    "{currentImage.caption}"
                  </p>
                )}

                {/* Thumbnails list if > 1 images */}
                {collection.images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 print:hidden">
                    {collection.images.map((img, idx) => (
                      <button
                        key={img.id || idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                          selectedImageIndex === idx
                            ? 'border-[#001e15] ring-2 ring-[#fd8a42]'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                        {img.is_primary && (
                          <span className="absolute bottom-0 inset-x-0 bg-[#001e15] text-white text-[9px] text-center font-bold">
                            Utama
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Real Live QR Code Box with Quick Trigger */}
                <div className="p-4 bg-[#f9faf7] rounded-xl border border-[#e2e3e0] flex items-center gap-4">
                  <div className="w-20 h-20 bg-white p-1.5 rounded-lg border-2 border-[#001e15] flex items-center justify-center shrink-0 shadow-xs">
                    <QRCodeSVG
                      value={scanUrl}
                      size={68}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-[#001e15] flex items-center gap-1">
                        <QrCode className="w-3.5 h-3.5 text-[#fd8a42]" />
                        QR Vitrin Naskah
                      </h5>
                    </div>
                    <p className="text-[11px] text-[#717974] mt-0.5 leading-snug">
                      Pindai dengan kamera smartphone di depan vitrin untuk membaca ulasan digital.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => setShowQrModal(true)}
                        className="text-[10px] font-bold text-[#9b4500] hover:text-[#001e15] underline flex items-center gap-1 print:hidden"
                      >
                        Buka Label Akrilik & Cetak QR &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Col: Deep Curatorial Metadata (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Title & Category Header */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs font-bold text-[#9b4500] uppercase tracking-wider">
                      {collection.collection_type_name || 'Naskah Kuno'}
                    </span>
                    <span className="text-xs text-[#717974]">•</span>
                    <span className="text-xs text-[#717974]">
                      {collection.origin_region}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#001e15] leading-snug">
                    {collection.name}
                  </h3>
                </div>

                {/* Quick Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[#f9faf7] rounded-xl border border-[#e2e3e0]">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-[#717974] block">Periode / Tahun</span>
                    <span className="text-xs font-bold text-[#1a1c1b]">{collection.period_year}</span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-[#717974] block">Bahan / Material</span>
                    <span className="text-xs font-bold text-[#1a1c1b]">{collection.material}</span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-[#717974] block">Dimensi Fisik</span>
                    <span className="text-xs font-bold text-[#1a1c1b]">{collection.dimensions}</span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-[#717974] block">Lokasi Pamer / Simpan</span>
                    <span className="text-xs font-bold text-[#1a1c1b]">{collection.location_name}</span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-[#717974] block">Sumber Perolehan</span>
                    <span className="text-xs font-bold text-[#1a1c1b]">{collection.acquisition_source_name}</span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-[#717974] block">Status Pameran</span>
                    <span className="text-xs font-bold capitalize text-[#1a1c1b]">{collection.status}</span>
                  </div>
                </div>

                {/* Deskripsi Lengkap */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#001e15] mb-2 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#fd8a42]" />
                    Deskripsi & Tinjauan Fisik
                  </h4>
                  <p className="text-xs sm:text-sm text-[#404944] leading-relaxed bg-[#ffffff] p-4 rounded-xl border border-[#edeeeb]">
                    {collection.description}
                  </p>
                </div>

                {/* Nilai Historis / Catatan Kurasi */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#001e15] mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#fd8a42]" />
                    Nilai Historis & Makna Filologi
                  </h4>
                  <div className="text-xs sm:text-sm text-[#1a1c1b] leading-relaxed bg-[#bcedd8]/15 p-4 rounded-xl border border-[#bcedd8]/50">
                    {collection.historical_significance}
                  </div>
                </div>

                {/* Catatan Tambahan */}
                {collection.additional_notes && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#717974] mb-1">
                      Keterangan Tambahan / Konservasi
                    </h4>
                    <p className="text-xs text-[#717974] italic">
                      {collection.additional_notes}
                    </p>
                  </div>
                )}

                {/* Provenance & Audit Footer */}
                <div className="pt-4 border-t border-[#edeeeb] flex flex-wrap items-center justify-between text-[11px] text-[#717974] gap-2">
                  <span>Tanggal Terdaftar: {new Date(collection.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span>Pencatat: {collection.created_by || 'Staf Kurasi BQMI'}</span>
                </div>

                {/* Reusable Printable Curatorial Sign-off & Branding Footer */}
                <PrintFooter
                  generatedBy={collection.created_by || "Kurator Pelaksana BQMI"}
                  userRole="Kurator Filologi & Kodikologi"
                  signatureRightCity="Jakarta"
                  signatureRightTitle="Mengetahui,&#10;Kepala Museum Bait Al-Qur'an TMII"
                  signatureRightName="Dr. H. Muchlis M. Hanafi, M.A."
                  signatureRightNIP="NIP. 19710818 199803 1 002"
                  signatureLeftTitle="Pemeriksa Konservasi Fisik,"
                  signatureLeftName="Drs. H. M. Zainuri, M.Ag"
                  signatureLeftNIP="NIP. 19680512 199403 1 003"
                  signatureLeftSub="Laboratorium Konservasi BQMI TMII"
                  notes="Lembar spesifikasi dan kajian kuratorial ini dicetak untuk keperluan arsip vitrin dan dokumentasi kodikologi naskah."
                />

              </div>
            </div>
          </div>

          {/* Modal Bottom Close */}
          <div className="px-6 py-3.5 bg-[#f9faf7] border-t border-[#e2e3e0] flex items-center justify-between shrink-0 print:hidden">
            <span className="text-xs text-[#717974]">
              Museum Bait Al-Qur'an TMII • Sistem Registrasi Koleksi Digital
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQrModal(true)}
                className="px-4 py-2 text-xs font-semibold text-[#001e15] bg-[#fd8a42]/20 hover:bg-[#fd8a42]/30 border border-[#fd8a42]/40 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5 text-[#9b4500]" />
                <span>QR Vitrin</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#001e15] hover:bg-[#003527] rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>

        {/* Fullscreen High-Res Image Overlay */}
        {isFullscreenImage && (
          <div
            onClick={() => setIsFullscreenImage(false)}
            className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 cursor-zoom-out animate-in fade-in"
          >
            <button
              onClick={() => setIsFullscreenImage(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={currentImage.url}
              alt=""
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            <p className="text-white text-sm mt-4 text-center font-medium bg-black/50 px-4 py-2 rounded-full">
              {currentImage.caption || collection.name} (Klik di mana saja untuk menutup)
            </p>
          </div>
        )}
      </div>

      {/* Standalone Vitrine QR and Acrylic Stand Generator Modal */}
      <VitrineQrModal
        collection={collection}
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
      />
    </>
  );
};
