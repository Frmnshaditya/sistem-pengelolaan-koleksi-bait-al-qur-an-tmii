import React, { useState, useRef } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  QrCode,
  Share2,
  Sparkles,
  Layers,
  MapPin,
  Calendar,
  ExternalLink,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { Collection } from '../../types';
import { MuseumLogoEmblem } from '../common/PrintHeaderFooter';
import { printUtils } from '../../utils/printUtils';

interface VitrineQrModalProps {
  collection: Collection | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VitrineQrModal: React.FC<VitrineQrModalProps> = ({
  collection,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [activeFormat, setActiveFormat] = useState<'stand' | 'mini' | 'qr-only'>('stand');
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !collection) return null;

  // Build the public link that visitors will scan
  const baseUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : 'https://baitalquran.id';
  const scanUrl = `${baseUrl}?koleksi=${collection.inventory_code}&id=${collection.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(scanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQrPng = () => {
    const canvas = qrCanvasRef.current?.querySelector('canvas');
    if (!canvas) return;

    // Create high-res download canvas with quiet zone and caption
    const dlCanvas = document.createElement('canvas');
    const ctx = dlCanvas.getContext('2d');
    const size = 600;
    dlCanvas.width = size;
    dlCanvas.height = size + 120;

    if (ctx) {
      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, dlCanvas.width, dlCanvas.height);

      // Draw QR in center
      ctx.drawImage(canvas, 50, 40, 500, 500);

      // Title & Code Text
      ctx.fillStyle = '#001e15';
      ctx.font = 'bold 20px "Playfair Display", serif, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(collection.name, size / 2, 570);

      ctx.fillStyle = '#717974';
      ctx.font = 'bold 15px monospace';
      ctx.fillText(`No. Vitrin: ${collection.inventory_code} • BQMI TMII`, size / 2, 600);

      const link = document.createElement('a');
      link.download = `QR_Vitrin_${collection.inventory_code}.png`;
      link.href = dlCanvas.toDataURL('image/png');
      link.click();
    }
  };

  const handlePrintCard = () => {
    printUtils.printElement('printable-vitrine-card', `Label_Vitrin_${collection.inventory_code}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#ffffff] rounded-2xl shadow-2xl border border-[#e2e3e0] overflow-hidden my-auto flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#001e15] text-white flex items-center justify-between border-b border-[#003527] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#fd8a42]/20 border border-[#fd8a42]/40 flex items-center justify-center text-[#fd8a42]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Generator Label & QR Vitrin
              </h3>
              <p className="text-xs text-[#a0d1bc]">
                Museum Bait Al-Qur'an & Museum Istiqlal TMII
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Controls Bar */}
        <div className="px-6 py-3 bg-[#f3f4f1] border-b border-[#e2e3e0] flex items-center justify-between flex-wrap gap-2 text-xs">
          {/* Format Selector Tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#e2e3e0]">
            <button
              onClick={() => setActiveFormat('stand')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeFormat === 'stand'
                  ? 'bg-[#001e15] text-white shadow-xs'
                  : 'text-[#404944] hover:bg-[#f3f4f1]'
              }`}
            >
              Stand Akrilik (10×15 cm)
            </button>
            <button
              onClick={() => setActiveFormat('mini')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeFormat === 'mini'
                  ? 'bg-[#001e15] text-white shadow-xs'
                  : 'text-[#404944] hover:bg-[#f3f4f1]'
              }`}
            >
              Label Vitrin Mini
            </button>
            <button
              onClick={() => setActiveFormat('qr-only')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeFormat === 'qr-only'
                  ? 'bg-[#001e15] text-white shadow-xs'
                  : 'text-[#404944] hover:bg-[#f3f4f1]'
              }`}
            >
              QR Code HD
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-[#e2e3e0] text-[#001e15] font-semibold rounded-lg transition-colors"
              title="Salin tautan scan"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin URL'}</span>
            </button>

            <button
              onClick={handleDownloadQrPng}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-[#e2e3e0] text-[#001e15] font-semibold rounded-lg transition-colors"
              title="Unduh QR Code format PNG"
            >
              <Download className="w-3.5 h-3.5 text-[#9b4500]" />
              <span>Unduh PNG</span>
            </button>

            <button
              onClick={handlePrintCard}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#fd8a42] hover:bg-[#ff944d] text-[#001e15] font-bold rounded-lg transition-colors shadow-xs"
              title="Cetak kartu stand akrilik"
            >
              <Printer className="w-3.5 h-3.5 text-[#001e15]" />
              <span>Cetak Label</span>
            </button>
          </div>
        </div>

        {/* Scrollable Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f9faf7] flex items-center justify-center">
          
          {/* 1. STAND AKRILIK FORMAT (10 x 15 cm ratio card) */}
          {activeFormat === 'stand' && (
            <div
              id="printable-vitrine-card"
              className="w-full max-w-[340px] bg-white rounded-2xl border-2 border-[#001e15] p-5 shadow-lg relative flex flex-col justify-between text-center overflow-hidden"
              style={{ minHeight: '480px' }}
            >
              {/* Islamic Pattern Gold Border Accent */}
              <div className="absolute inset-1.5 border border-[#fd8a42]/40 rounded-xl pointer-events-none"></div>

              {/* Card Header with Museum Logo */}
              <div className="relative z-10 pt-1 pb-3 border-b border-[#e2e3e0]">
                <div className="flex justify-center mb-1.5">
                  <MuseumLogoEmblem size={42} />
                </div>
                <h4 className="text-[10px] font-bold tracking-wider uppercase text-[#001e15] font-serif">
                  Museum Bait Al-Qur'an & Museum Istiqlal
                </h4>
                <p className="text-[8px] text-[#717974] tracking-tight">
                  Taman Mini Indonesia Indah (TMII), Jakarta
                </p>
              </div>

              {/* Collection Title & Spec Info */}
              <div className="relative z-10 my-3 text-center">
                <span className="inline-block px-2.5 py-0.5 bg-[#ffdbc9]/60 text-[#9b4500] text-[9px] font-bold uppercase rounded-md mb-1.5">
                  {collection.collection_type_name || 'Naskah Kuno'}
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#001e15] leading-snug line-clamp-2">
                  {collection.name}
                </h3>
                
                {/* Meta Grid */}
                <div className="grid grid-cols-2 gap-1.5 mt-2 text-[9.5px] text-[#404944] bg-[#f9faf7] p-2 rounded-lg border border-[#e2e3e0]">
                  <div>
                    <span className="text-[#717974] block text-[8px]">Asal Daerah:</span>
                    <strong className="text-[#001e15]">{collection.origin_region}</strong>
                  </div>
                  <div>
                    <span className="text-[#717974] block text-[8px]">Tahun / Abad:</span>
                    <strong className="text-[#001e15]">{collection.period_year}</strong>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-dashed border-slate-200">
                    <span className="text-[#717974] text-[8px]">Bahan: </span>
                    <strong className="text-[#001e15]">{collection.material}</strong>
                  </div>
                </div>
              </div>

              {/* Functional Center QR Code Stage */}
              <div className="relative z-10 my-2 flex flex-col items-center justify-center">
                <div
                  ref={qrCanvasRef}
                  className="p-2.5 bg-white rounded-xl border-2 border-[#001e15] shadow-xs"
                >
                  <QRCodeCanvas
                    value={scanUrl}
                    size={140}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <div className="mt-2 flex items-center justify-center gap-1 text-[8.5px] text-[#001e15] font-semibold">
                  <Sparkles className="w-3 h-3 text-[#fd8a42]" />
                  <span>Pindai QR untuk Kajian Filologi & Tafsir</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="relative z-10 pt-2 border-t border-[#e2e3e0] flex items-center justify-between text-[8px] text-[#717974]">
                <span className="font-mono font-bold text-[#9b4500]">
                  Vitrin: {collection.inventory_code}
                </span>
                <span className="italic">
                  Lokasi: {collection.location_name}
                </span>
              </div>
            </div>
          )}

          {/* 2. MINI SHELF LABEL FORMAT (Compact Shelf Tag) */}
          {activeFormat === 'mini' && (
            <div
              id="printable-vitrine-card"
              className="w-full max-w-[380px] bg-white rounded-xl border-2 border-[#001e15] p-4 shadow-md flex items-center gap-4 text-left"
            >
              <div ref={qrCanvasRef} className="p-1.5 bg-white rounded-lg border border-[#001e15] shrink-0">
                <QRCodeCanvas
                  value={scanUrl}
                  size={105}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-[8px] text-[#717974] uppercase font-bold">
                  <span>BQMI TMII</span>
                  <span>•</span>
                  <span className="text-[#9b4500] font-mono">{collection.inventory_code}</span>
                </div>
                <h4 className="font-serif font-bold text-sm text-[#001e15] mt-0.5 leading-tight line-clamp-2">
                  {collection.name}
                </h4>
                <p className="text-[9px] text-[#404944] mt-1">
                  {collection.origin_region} ({collection.period_year})
                </p>
                <div className="mt-2 pt-1 border-t border-slate-200 text-[8px] text-[#001e15] font-semibold flex items-center gap-1">
                  <QrCode className="w-3 h-3 text-[#fd8a42]" />
                  <span>Pindai untuk Info Lengkap</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. QR CODE ONLY (HD Vector/PNG Preview) */}
          {activeFormat === 'qr-only' && (
            <div id="printable-vitrine-card" className="bg-white rounded-2xl border border-[#e2e3e0] p-6 shadow-md text-center max-w-sm">
              <div ref={qrCanvasRef} className="flex justify-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                <QRCodeCanvas
                  value={scanUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <h4 className="font-serif font-bold text-base text-[#001e15] mt-3">
                {collection.name}
              </h4>
              <p className="font-mono text-xs text-[#9b4500] mt-0.5">
                No. Registrasi: {collection.inventory_code}
              </p>
              <div className="mt-4 p-2 bg-[#f9faf7] rounded-lg border border-[#e2e3e0] text-left text-[11px] text-[#717974] break-all font-mono">
                <span className="text-[#001e15] font-bold block mb-0.5">URL Tujuan Pindai:</span>
                {scanUrl}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Info */}
        <div className="px-6 py-3.5 bg-[#f3f4f1] border-t border-[#e2e3e0] flex items-center justify-between text-xs text-[#717974]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>QR Code diverifikasi resmi oleh Kuratorial BQMI TMII</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#001e15] hover:bg-[#003527] rounded-lg transition-colors"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};
