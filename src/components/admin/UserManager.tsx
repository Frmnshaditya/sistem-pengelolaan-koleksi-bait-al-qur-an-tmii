import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  Edit2,
  Trash2,
  Lock,
  Mail,
  User,
  CheckCircle,
  KeyRound,
  RotateCcw
} from 'lucide-react';
import { User as UserType, UserRole } from '../../types';

interface UserManagerProps {
  users: UserType[];
  currentUser: UserType | null;
  onUpdateUsers: (users: UserType[]) => void;
  onSwitchUser: (user: UserType) => void;
}

export const UserManager: React.FC<UserManagerProps> = ({
  users,
  currentUser,
  onUpdateUsers,
  onSwitchUser
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'kurator' as UserRole,
    role_title: 'Staf Kurasi Kodikologi',
    is_active: true
  });
  const [error, setError] = useState('');

  const handleOpenAdd = () => {
    setEditingUserId(null);
    setFormData({
      name: '',
      email: '',
      role: 'kurator',
      role_title: 'Staf Kurator Naskah',
      is_active: true
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserType) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      role_title: user.role_title,
      is_active: user.is_active
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Nama dan email wajib diisi.');
      return;
    }

    if (editingUserId) {
      onUpdateUsers(
        users.map(u => (u.id === editingUserId ? { ...u, ...formData } : u))
      );
    } else {
      const newUser: UserType = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        role_title: formData.role_title,
        is_active: formData.is_active,
        avatar_url: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=100`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      onUpdateUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (id === currentUser?.id) {
      alert('Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.');
      return;
    }
    if (confirm('Yakin ingin menghapus akun pengguna ini?')) {
      onUpdateUsers(users.filter(u => u.id !== id));
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <span className="px-2.5 py-0.5 bg-[#001e15] text-[#fd8a42] text-[10px] font-bold rounded-full">Super Admin</span>;
      case 'kurator':
        return <span className="px-2.5 py-0.5 bg-[#064e3b] text-[#bcedd8] text-[10px] font-bold rounded-full">Kurator Ahli</span>;
      case 'inventaris':
        return <span className="px-2.5 py-0.5 bg-[#9b4500] text-[#ffdbc9] text-[10px] font-bold rounded-full">Petugas Registrasi</span>;
      default:
        return <span className="px-2.5 py-0.5 bg-[#edeeeb] text-[#404944] text-[10px] font-bold rounded-full">Pengunjung</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#001e15]">
            Manajemen Pengguna & Hak Akses
          </h1>
          <p className="text-xs text-[#717974] mt-0.5">
            Kelola otorisasi peran (Super Administrator, Kurator Ahli, Petugas Inventaris, Pengunjung)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#001e15] hover:bg-[#003527] rounded-xl shadow-xs transition-colors"
        >
          <UserPlus className="w-4 h-4 text-[#fd8a42]" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* Role Privilege Helper Banner */}
      <div className="bg-[#001e15] text-white p-5 rounded-2xl border border-[#003527] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#003527] flex items-center justify-center text-[#fd8a42]">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Simulasi Pergantian Akun Pengguna</h4>
            <p className="text-xs text-[#a0d1bc]">
              Klik tombol "Gunakan Akun Ini" pada daftar tabel di bawah untuk langsung menguji hak akses peran tersebut.
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#e2e3e0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#001e15] text-white">
                <th className="p-3.5 font-bold uppercase tracking-wider">Pengguna</th>
                <th className="p-3.5 font-bold uppercase tracking-wider">Email</th>
                <th className="p-3.5 font-bold uppercase tracking-wider">Peran & Jabatan</th>
                <th className="p-3.5 font-bold uppercase tracking-wider">Status</th>
                <th className="p-3.5 font-bold uppercase tracking-wider">Login Terakhir</th>
                <th className="p-3.5 font-bold uppercase tracking-wider text-center w-36">Aksi & Simulasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edeeeb]">
              {users.map((user) => {
                const isCurrent = user.id === currentUser?.id;

                return (
                  <tr
                    key={user.id}
                    className={`hover:bg-[#f9faf7] transition-colors ${
                      isCurrent ? 'bg-[#bcedd8]/15 font-medium' : ''
                    }`}
                  >
                    {/* Name + Avatar */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80'}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border border-[#e2e3e0]"
                        />
                        <div>
                          <span className="font-bold text-[#001e15] block">{user.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] text-[#16a34a] font-bold">
                              (Sedang Masuk)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-3.5 font-mono text-[#404944]">{user.email}</td>

                    {/* Role */}
                    <td className="p-3.5">
                      <div className="flex flex-col gap-1">
                        <div>{getRoleBadge(user.role)}</div>
                        <span className="text-[11px] text-[#717974]">{user.role_title}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                          user.is_active
                            ? 'bg-[#bcedd8] text-[#064e3b]'
                            : 'bg-[#ffdad6] text-[#ba1a1a]'
                        }`}
                      >
                        {user.is_active ? 'Aktif' : 'Non-Aktif'}
                      </span>
                    </td>

                    {/* Last Login */}
                    <td className="p-3.5 text-[#717974]">
                      {user.last_login_at
                        ? new Date(user.last_login_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'Belum pernah login'}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {!isCurrent && (
                          <button
                            onClick={() => onSwitchUser(user)}
                            className="px-2 py-1 bg-[#001e15] text-white text-[10px] font-bold rounded-lg hover:bg-[#003527]"
                            title="Beralih peran ke pengguna ini"
                          >
                            Masuk
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="p-1.5 text-[#9b4500] hover:bg-[#ffdbc9]/40 rounded-lg"
                          title="Edit Pengguna"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg"
                          title="Hapus Pengguna"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#e2e3e0] space-y-4 animate-in fade-in zoom-in duration-150">
            <h3 className="font-serif text-lg font-bold text-[#001e15]">
              {editingUserId ? 'Ubah Data Pengguna' : 'Tambah Pengguna Baru'}
            </h3>

            {error && (
              <div className="p-3 bg-[#ffdad6] text-[#93000a] text-xs rounded-xl flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#001e15] block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama pegawai..."
                  className="w-full p-2.5 text-xs bg-[#f9faf7] rounded-xl border border-[#e2e3e0] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#001e15] block mb-1">Alamat Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@baitalquran.id"
                  className="w-full p-2.5 text-xs bg-[#f9faf7] rounded-xl border border-[#e2e3e0] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#001e15] block mb-1">Hak Akses / Peran</label>
                <select
                  value={formData.role}
                  onChange={(e) => {
                    const r = e.target.value as UserRole;
                    let title = 'Pengunjung';
                    if (r === 'admin') title = 'Kepala Tata Kelola & TI';
                    if (r === 'kurator') title = 'Kurator Ahli Kodikologi';
                    if (r === 'inventaris') title = 'Petugas Registrasi Koleksi';
                    setFormData({ ...formData, role: r, role_title: title });
                  }}
                  className="w-full p-2.5 text-xs bg-[#f9faf7] rounded-xl border border-[#e2e3e0] outline-none"
                >
                  <option value="admin">Administrator (Akses Penuh)</option>
                  <option value="kurator">Kurator (Kelola Naskah & Deskripsi)</option>
                  <option value="inventaris">Petugas Inventaris (Input Koleksi)</option>
                  <option value="guest">Pengunjung (Hanya Lihat)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#001e15] block mb-1">Jabatan Fungsional</label>
                <input
                  type="text"
                  value={formData.role_title}
                  onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                  placeholder="Contoh: Kurator Ahli Filologi"
                  className="w-full p-2.5 text-xs bg-[#f9faf7] rounded-xl border border-[#e2e3e0] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="user-active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 accent-[#001e15]"
                />
                <label htmlFor="user-active" className="text-xs text-[#001e15] font-semibold cursor-pointer">
                  Akun Aktif (Dapat Login ke Sistem)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold bg-[#f3f4f1] text-[#404944] rounded-xl hover:bg-[#e7e8e6]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold bg-[#001e15] text-white rounded-xl hover:bg-[#003527]"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
