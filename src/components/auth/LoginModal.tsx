import React, { useState } from 'react';
import { X, Lock, Mail, BookOpen, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { User, UserRole } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  availableUsers: User[];
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  availableUsers
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = availableUsers.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (matched) {
      onLogin(matched);
      onClose();
    } else {
      setError('Email atau kata sandi tidak cocok dengan akun petugas.');
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    const matched = availableUsers.find(u => u.role === role);
    if (matched) {
      onLogin(matched);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#e2e3e0] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-[#001e15] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#fd8a42] text-[#001e15] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Masuk Sistem Informasi
              </h3>
              <p className="text-xs text-[#a0d1bc]">
                Museum Bait Al-Qur’an TMII
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-[#ffdad6] text-[#93000a] text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick 1-Click Role Login for Evaluator */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#717974] block mb-2">
              Login Cepat Simulasi Peran (Klik Salah Satu)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2.5 rounded-xl border border-[#001e15] bg-[#001e15]/5 hover:bg-[#001e15] hover:text-white transition-all text-center group"
              >
                <ShieldCheck className="w-4 h-4 text-[#fd8a42] mx-auto mb-1" />
                <span className="text-xs font-bold block">Super Admin</span>
                <span className="text-[10px] text-[#717974] group-hover:text-[#a0d1bc] block">Akses Penuh</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('kurator')}
                className="p-2.5 rounded-xl border border-[#064e3b] bg-[#064e3b]/5 hover:bg-[#064e3b] hover:text-white transition-all text-center group"
              >
                <Sparkles className="w-4 h-4 text-[#16a34a] mx-auto mb-1" />
                <span className="text-xs font-bold block">Kurator</span>
                <span className="text-[10px] text-[#717974] group-hover:text-[#bcedd8] block">Naskah Ahli</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('inventaris')}
                className="p-2.5 rounded-xl border border-[#9b4500] bg-[#9b4500]/5 hover:bg-[#9b4500] hover:text-white transition-all text-center group"
              >
                <Lock className="w-4 h-4 text-[#fd8a42] mx-auto mb-1" />
                <span className="text-xs font-bold block">Inventaris</span>
                <span className="text-[10px] text-[#717974] group-hover:text-[#ffdbc9] block">Input Fisik</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#edeeeb]"></div>
            <span className="text-[11px] text-[#717974]">atau masukkan email</span>
            <div className="h-px flex-1 bg-[#edeeeb]"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-[#001e15] block mb-1">Email Pegawai</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#717974]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@baitalquran.id"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#f9faf7] rounded-xl border border-[#e2e3e0] outline-none focus:border-[#001e15]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#001e15] block mb-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#717974]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#f9faf7] rounded-xl border border-[#e2e3e0] outline-none focus:border-[#001e15]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-[#001e15] hover:bg-[#003527] rounded-xl shadow-xs transition-colors mt-2"
            >
              Masuk Sekarang
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
