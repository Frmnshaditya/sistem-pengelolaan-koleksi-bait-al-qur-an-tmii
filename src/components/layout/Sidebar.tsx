import React from 'react';
import {
  LayoutDashboard,
  Building2,
  FolderPlus,
  BarChart3,
  Database,
  Users,
  History,
  BookOpen,
  FileCode,
  Sparkles,
  X,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onOpenLogin: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  currentUser,
  onOpenLogin
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const isStaff = currentUser && ['admin', 'kurator', 'inventaris'].includes(currentUser.role);

  const navItems = [
    {
      id: 'katalog',
      label: 'Katalog Koleksi',
      icon: Compass,
      publicOnly: false,
      badge: 'Publik'
    },
    {
      id: 'dashboard',
      label: 'Dashboard Statistik',
      icon: LayoutDashboard,
      requiresAuth: true
    },
    {
      id: 'koleksi',
      label: 'Data Koleksi',
      icon: Building2,
      requiresAuth: true
    },
    {
      id: 'tambah-koleksi',
      label: 'Tambah Koleksi',
      icon: FolderPlus,
      requiresAuth: true
    },
    {
      id: 'laporan',
      label: 'Laporan & Ekspor',
      icon: BarChart3,
      requiresAuth: true
    },
    {
      id: 'master-data',
      label: 'Master Data',
      icon: Database,
      requiresAuth: true
    },
    {
      id: 'pengguna',
      label: 'Manajemen Pengguna',
      icon: Users,
      requiresAdmin: true
    },
    {
      id: 'log-aktivitas',
      label: 'Log Aktivitas',
      icon: History,
      requiresAuth: true
    },
    {
      id: 'arsitektur-sistem',
      label: 'Dokumentasi & DB',
      icon: FileCode,
      publicOnly: false,
      badge: 'Laravel'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 h-full w-72 bg-[#ffffff] z-50 flex flex-col border-r border-[#edeeeb] shadow-[2px_0_12px_rgba(0,0,0,0.03)] transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="px-6 h-20 flex items-center justify-between border-b border-[#edeeeb]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#001e15] flex items-center justify-center text-white shadow-sm ring-2 ring-[#fd8a42]/30">
              <BookOpen className="w-5 h-5 text-[#fd8a42]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold text-[#001e15] tracking-tight leading-tight">
                Bait Al-Qur’an
              </span>
              <span className="text-[11px] font-medium tracking-wide text-[#717974] uppercase">
                TMII • Museum Istiqlal
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-[#717974] hover:bg-[#f3f4f1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 py-5 flex flex-col gap-1.5 overflow-y-auto scrollbar-none">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#717974]">
            Menu Utama
          </div>

          {navItems.map((item) => {
            if (item.requiresAdmin && !isAdmin) return null;
            if (item.requiresAuth && !isStaff) return null;

            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-[#001e15] text-[#ffffff] shadow-sm font-semibold'
                    : 'text-[#404944] hover:bg-[#f3f4f1] hover:text-[#1a1c1b]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-[#fd8a42]' : 'text-[#717974]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-[#fd8a42] text-white'
                        : 'bg-[#edeeeb] text-[#404944]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card / Login Prompt Footer */}
        <div className="p-4 border-t border-[#edeeeb] bg-[#f9faf7]">
          {currentUser ? (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-[#ffffff] border border-[#e2e3e0] shadow-xs">
              <img
                src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#bcedd8]"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold text-[#1a1c1b] truncate">
                  {currentUser.name}
                </span>
                <span className="text-[11px] text-[#717974] flex items-center gap-1 truncate">
                  <ShieldCheck className="w-3 h-3 text-[#16a34a]" />
                  {currentUser.role_title}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center p-3 rounded-xl bg-[#ffffff] border border-[#e2e3e0]">
              <p className="text-xs text-[#404944] mb-2">Mode Pengunjung Publik</p>
              <button
                onClick={onOpenLogin}
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-[#001e15] hover:bg-[#003527] rounded-lg transition-colors"
              >
                Masuk Administrator
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
