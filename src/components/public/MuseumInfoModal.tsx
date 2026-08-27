import React from 'react';
import { X, BookOpen, Landmark, Compass, Award, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

interface MuseumInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MuseumInfoModal: React.FC<MuseumInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#e2e3e0] overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-[#001e15] text-white p-6 md:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-[#fd8a42] text-[#001e15] font-bold text-xs rounded-full">
              Khazanah Peradaban Islam
            </span>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
            Museum Bait Al-Qur’an & Museum Istiqlal TMII
          </h3>
          <p className="text-xs md:text-sm text-[#a0d1bc] max-w-xl">
            Pusat peradaban, riset filologi naskah suci, dan apresiasi seni kaligrafi mushaf Al-Qur'an terbesar di Asia Tenggara.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6 text-[#1a1c1b] max-h-[70vh] overflow-y-auto">
          {/* Sejarah & Visi */}
          <div>
            <h4 className="font-serif text-lg font-bold text-[#001e15] mb-2 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#fd8a42]" />
              Sejarah & Gambaran Umum
            </h4>
            <p className="text-sm text-[#404944] leading-relaxed">
              Kompleks <strong>Bayt Al-Qur'an dan Museum Istiqlal (BQMI)</strong> diresmikan pada 20 April 1997 dan berlokasi di Taman Mini Indonesia Indah (TMII), Jakarta Timur. Museum ini didirikan untuk menampilkan Al-Qur'an sebagai pedoman hidup serta memperlihatkan bagaimana nilai-nilai keagamaan Islam diekspresikan secara luhur dalam berbagai bentuk budaya, seni kriya, dan naskah manuskrip Nusantara.
            </p>
          </div>

          {/* Zona Khazanah Utama */}
          <div>
            <h4 className="font-serif text-lg font-bold text-[#001e15] mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#fd8a42]" />
              Galeri & Ruang Pamer Utama
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#f9faf7] rounded-xl border border-[#e2e3e0]">
                <h5 className="text-xs font-bold text-[#001e15] mb-1">1. Khazanah Mushaf Nusantara</h5>
                <p className="text-xs text-[#717974]">
                  Koleksi manuskrip Al-Qur'an tulisan tangan kuno dari berbagai kesultanan di Aceh, Minangkabau, Banten, Cirebon, Jawa, Madura, Sasak, hingga Ternate.
                </p>
              </div>
              <div className="p-3.5 bg-[#f9faf7] rounded-xl border border-[#e2e3e0]">
                <h5 className="text-xs font-bold text-[#001e15] mb-1">2. Mushaf Akbar & Kenegaraan</h5>
                <p className="text-xs text-[#717974]">
                  Menampilkan Mushaf Istiqlal, Mushaf Sundawi, Mushaf Wonosobo, serta ragam mushaf monumental berukuran raksasa mahakarya seniman tanah air.
                </p>
              </div>
              <div className="p-3.5 bg-[#f9faf7] rounded-xl border border-[#e2e3e0]">
                <h5 className="text-xs font-bold text-[#001e15] mb-1">3. Seni Kaligrafi Islam Murni</h5>
                <p className="text-xs text-[#717974]">
                  Eksibisi karya kaligrafi khat Arab karya kaligrafer terkemuka Indonesia dalam berbagai media: kanvas, kayu jati berukir, kaca, dan tembaga.
                </p>
              </div>
              <div className="p-3.5 bg-[#f9faf7] rounded-xl border border-[#e2e3e0]">
                <h5 className="text-xs font-bold text-[#001e15] mb-1">4. Laboratorium Konservasi Naskah</h5>
                <p className="text-xs text-[#717974]">
                  Fasilitas preservasi preventif dan kuratif untuk merawat serat kertas daluwang kuno, deasidifikasi, dan digitalisasi arsip beresolusi tinggi.
                </p>
              </div>
            </div>
          </div>

          {/* Jam Kunjungan & Fasilitas */}
          <div className="p-4 bg-[#bcedd8]/20 rounded-xl border border-[#bcedd8] flex flex-col md:flex-row gap-4 items-start justify-between">
            <div>
              <h5 className="text-xs font-bold text-[#001e15] mb-1 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#064e3b]" />
                Jadwal Buka & Tiket Masuk
              </h5>
              <p className="text-xs text-[#404944]">
                Selasa s/d Minggu: 08.30 - 15.30 WIB (Hari Senin & Libur Nasional Tertentu Tutup).
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#717974]">Lokasi:</span>
              <p className="text-xs font-semibold text-[#001e15]">Taman Mini Indonesia Indah, Jakarta</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 md:p-6 bg-[#f9faf7] border-t border-[#e2e3e0] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#001e15] hover:bg-[#003527] rounded-xl shadow-sm transition-colors"
          >
            Tutup Informasi
          </button>
        </div>
      </div>
    </div>
  );
};
