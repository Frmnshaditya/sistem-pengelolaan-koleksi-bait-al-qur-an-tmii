import React from 'react';
import { BookOpen, MapPin, Clock, Phone, Mail, ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#001e15] text-[#e2e3e0] pt-12 pb-8 border-t-4 border-[#fd8a42] mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Col 1: Identity */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#003527] flex items-center justify-center text-[#fd8a42]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-white">Bait Al-Qur’an TMII</h4>
                <p className="text-xs text-[#a0d1bc]">Museum Istiqlal • Jakarta</p>
              </div>
            </div>
            <p className="text-xs text-[#c0c8c3] leading-relaxed mt-2">
              Pusat khazanah pelestarian naskah mushaf Al-Qur'an kuno, seni kaligrafi nusantara, dan peranti peradaban Islam di Indonesia.
            </p>
          </div>

          {/* Col 2: Museum Visit & Contact */}
          <div className="flex flex-col gap-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#fd8a42]">Informasi Kunjungan</h5>
            <div className="flex items-start gap-2 text-xs text-[#c0c8c3]">
              <MapPin className="w-4 h-4 text-[#a0d1bc] shrink-0 mt-0.5" />
              <span>Kompleks Bayt Al-Qur'an & Museum Istiqlal, Taman Mini Indonesia Indah (TMII), Jakarta Timur 13560</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#c0c8c3]">
              <Clock className="w-4 h-4 text-[#a0d1bc] shrink-0" />
              <span>Selasa - Minggu: 08.30 - 15.30 WIB (Senin Tutup)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#c0c8c3]">
              <Mail className="w-4 h-4 text-[#a0d1bc] shrink-0" />
              <span>layanan@baitalquran.id • info@museumistiqlal.or.id</span>
            </div>
          </div>

          {/* Col 3: Disclaimer */}
          <div className="flex flex-col gap-2 bg-[#002a1e] p-4 rounded-xl border border-[#003d2e]">
            <div className="flex items-center gap-2 text-[#fd8a42] text-xs font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>Catatan Data Simulasi</span>
            </div>
            <p className="text-[11px] text-[#a0d1bc] leading-relaxed">
              Sistem ini merupakan purwarupa sistem informasi pengelolaan data koleksi. Data koleksi yang ditampilkan merupakan data contoh (dummy testing) dan bukan representasi data resmi Museum Bait Al-Qur'an TMII.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#003527] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#717974] gap-2">
          <span>© {new Date().getFullYear()} Museum Bait Al-Qur’an & Museum Istiqlal TMII. Hak Cipta Dilindungi.</span>
          <span>Sistem Informasi Koleksi Berbasis Laravel & Modern Web Architecture</span>
        </div>
      </div>
    </footer>
  );
};
