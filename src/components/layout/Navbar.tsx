import React from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  LogIn, 
  LogOut, 
  Menu, 
  Globe, 
  Shield, 
  BookOpen, 
  FileText,
  Info
} from 'lucide-react';
import { User, RoleType } from '../../types';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
  onOpenMuseumInfo: () => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenLogin,
  onLogout,
  onToggleSidebar,
  onOpenMuseumInfo,
  globalSearchQuery,
  setGlobalSearchQuery
}) => {
  const isAdminOrStaff = currentUser && currentUser.role !== 'pengunjung';

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-72 h-20 bg-[#f9faf7]/95 backdrop-blur-md z-40 px-4 md:px-8 flex items-center justify-between border-b border-[#edeeeb] shadow-[0_1px_8px_rgba(0,0,0,0.02)] transition-all">
      {/* Left section: Mobile menu & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          id="btn-toggle-sidebar"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-[#404944] hover:bg-[#e7e8e6] transition-colors"
          aria-label="Buka Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717974]" />
          <input
            id="input-global-search"
            type="text"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            placeholder="Cari naskah, mushaf kuno, kaligrafi, artefak..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#f3f4f1] text-[#1a1c1b] rounded-full border border-transparent focus:border-[#9b4500] focus:bg-[#ffffff] focus:shadow-sm outline-none transition-all placeholder:text-[#717974]"
          />
          {globalSearchQuery && (
            <button
              onClick={() => setGlobalSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#717974] hover:text-[#1a1c1b] px-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right section: Portal Mode switcher, Museum Info, and User Profile / Login */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Museum Info Button */}
        <button
          id="btn-museum-info"
          onClick={onOpenMuseumInfo}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#001e15] bg-[#bcedd8]/40 hover:bg-[#bcedd8]/70 rounded-full transition-colors"
          title="Tentang Museum Bait Al-Qur'an TMII"
        >
          <Info className="w-3.5 h-3.5 text-[#064e3b]" />
          <span>Info Museum</span>
        </button>

        {/* Quick Portal Switcher */}
        <div className="flex items-center bg-[#edeeeb] p-1 rounded-full text-xs font-medium">
          <button
            id="btn-switch-katalog"
            onClick={() => setActiveTab('katalog')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
              activeTab === 'katalog'
                ? 'bg-[#001e15] text-[#ffffff] shadow-sm font-semibold'
                : 'text-[#404944] hover:text-[#1a1c1b]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Katalog</span> Publik
          </button>
          <button
            id="btn-switch-admin"
            onClick={() => {
              if (isAdminOrStaff) {
                setActiveTab('dashboard');
              } else {
                onOpenLogin();
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
              activeTab !== 'katalog'
                ? 'bg-[#001e15] text-[#ffffff] shadow-sm font-semibold'
                : 'text-[#404944] hover:text-[#1a1c1b]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#fd8a42]" />
            <span className="hidden sm:inline">Panel</span> Pengelola
          </button>
        </div>

        {/* Auth State Button */}
        {currentUser ? (
          <div className="flex items-center gap-2">
            <button
              id="btn-auth-logout"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#ba1a1a] hover:bg-[#ffdad6]/60 rounded-full transition-colors"
              title="Keluar dari Akun"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Keluar</span>
            </button>
          </div>
        ) : (
          <button
            id="btn-auth-login"
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#001e15] hover:bg-[#003527] rounded-full shadow-sm transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Masuk Admin</span>
          </button>
        )}
      </div>
    </header>
  );
};
