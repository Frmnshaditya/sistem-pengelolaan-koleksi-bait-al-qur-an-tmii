import React, { useState } from 'react';
import {
  Database,
  Plus,
  Edit2,
  Trash2,
  Layers,
  MapPin,
  HeartHandshake,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import {
  Category,
  CollectionType,
  Condition,
  Location,
  AcquisitionSource,
  Collection
} from '../../types';

interface MasterDataManagerProps {
  categories: Category[];
  collectionTypes: CollectionType[];
  conditions: Condition[];
  locations: Location[];
  acquisitionSources: AcquisitionSource[];
  collections: Collection[];
  onUpdateCategories: (items: Category[]) => void;
  onUpdateCollectionTypes: (items: CollectionType[]) => void;
  onUpdateConditions: (items: Condition[]) => void;
  onUpdateLocations: (items: Location[]) => void;
  onUpdateAcquisitionSources: (items: AcquisitionSource[]) => void;
}

export const MasterDataManager: React.FC<MasterDataManagerProps> = ({
  categories,
  collectionTypes,
  conditions,
  locations,
  acquisitionSources,
  collections,
  onUpdateCategories,
  onUpdateCollectionTypes,
  onUpdateConditions,
  onUpdateLocations,
  onUpdateAcquisitionSources
}) => {
  const [activeTab, setActiveTab] = useState<'category' | 'type' | 'condition' | 'location' | 'source'>('category');
  
  // Inline edit / add modal states
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpenAdd = () => {
    setEditingId(null);
    setErrorMessage('');
    if (activeTab === 'category') {
      setFormData({ name: '', code: '', description: '' });
    } else if (activeTab === 'type') {
      setFormData({ name: '', category_id: categories[0]?.id || 1, description: '' });
    } else if (activeTab === 'condition') {
      setFormData({ name: '', badge_color: '#16a34a', description: '' });
    } else if (activeTab === 'location') {
      setFormData({ name: '', floor: 'Lantai 1', building: 'Gedung Utama', description: '', is_active: true });
    } else if (activeTab === 'source') {
      setFormData({ name: '', description: '' });
    }
    setIsEditing(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    setErrorMessage('');
    setFormData({ ...item });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setErrorMessage('Nama data master wajib diisi');
      return;
    }

    const now = new Date().toISOString();

    if (activeTab === 'category') {
      if (editingId) {
        onUpdateCategories(categories.map(c => c.id === editingId ? { ...c, ...formData, updated_at: now } : c));
      } else {
        const newCat: Category = {
          id: Date.now(),
          name: formData.name,
          code: formData.code || `KAT-${Date.now()}`,
          description: formData.description || '',
          created_at: now,
          updated_at: now
        };
        onUpdateCategories([...categories, newCat]);
      }
    } else if (activeTab === 'type') {
      if (editingId) {
        onUpdateCollectionTypes(collectionTypes.map(t => t.id === editingId ? { ...t, ...formData, updated_at: now } : t));
      } else {
        const newType: CollectionType = {
          id: Date.now(),
          category_id: Number(formData.category_id),
          name: formData.name,
          code: formData.code || `TYP-${Date.now()}`,
          description: formData.description || '',
          created_at: now,
          updated_at: now
        };
        onUpdateCollectionTypes([...collectionTypes, newType]);
      }
    } else if (activeTab === 'condition') {
      if (editingId) {
        onUpdateConditions(conditions.map(c => c.id === editingId ? { ...c, ...formData, updated_at: now } : c));
      } else {
        const newCond: Condition = {
          id: Date.now(),
          name: formData.name,
          code: formData.code || `CND-${Date.now()}`,
          badge_color: formData.badge_color || '#16a34a',
          description: formData.description || '',
          created_at: now,
          updated_at: now
        };
        onUpdateConditions([...conditions, newCond]);
      }
    } else if (activeTab === 'location') {
      if (editingId) {
        onUpdateLocations(locations.map(l => l.id === editingId ? { ...l, ...formData, updated_at: now } : l));
      } else {
        const newLoc: Location = {
          id: Date.now(),
          name: formData.name,
          floor: formData.floor || 'Lantai 1',
          building: formData.building || 'Gedung Utama',
          description: formData.description || '',
          is_active: true,
          created_at: now,
          updated_at: now
        };
        onUpdateLocations([...locations, newLoc]);
      }
    } else if (activeTab === 'source') {
      if (editingId) {
        onUpdateAcquisitionSources(acquisitionSources.map(s => s.id === editingId ? { ...s, ...formData, updated_at: now } : s));
      } else {
        const newSrc: AcquisitionSource = {
          id: Date.now(),
          name: formData.name,
          type: formData.type || 'hibah',
          description: formData.description || '',
          created_at: now,
          updated_at: now
        };
        onUpdateAcquisitionSources([...acquisitionSources, newSrc]);
      }
    }

    setIsEditing(false);
  };

  const handleDelete = (id: number) => {
    // Check usage
    if (activeTab === 'category') {
      const inUse = collections.some(c => c.category_id === id);
      if (inUse) {
        alert('Kategori ini tidak dapat dihapus karena masih digunakan oleh beberapa koleksi.');
        return;
      }
      onUpdateCategories(categories.filter(c => c.id !== id));
    } else if (activeTab === 'type') {
      onUpdateCollectionTypes(collectionTypes.filter(t => t.id !== id));
    } else if (activeTab === 'condition') {
      onUpdateConditions(conditions.filter(c => c.id !== id));
    } else if (activeTab === 'location') {
      onUpdateLocations(locations.filter(l => l.id !== id));
    } else if (activeTab === 'source') {
      onUpdateAcquisitionSources(acquisitionSources.filter(s => s.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#001e15]">
            Master Data Referensi
          </h1>
          <p className="text-xs text-[#717974] mt-0.5">
            Pengaturan parameter kategori naskah, klasifikasi jenis, kondisi fisik, dan lokasi pamer museum
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#001e15] hover:bg-[#003527] rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 text-[#fd8a42]" />
          <span>Tambah Entri Master</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#e2e3e0] pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('category')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'category'
              ? 'bg-[#001e15] text-white shadow-xs'
              : 'text-[#404944] hover:bg-[#f3f4f1]'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-[#fd8a42]" />
          <span>Kategori Koleksi ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('type')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'type'
              ? 'bg-[#001e15] text-white shadow-xs'
              : 'text-[#404944] hover:bg-[#f3f4f1]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#fd8a42]" />
          <span>Jenis / Sub-Kategori ({collectionTypes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('condition')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'condition'
              ? 'bg-[#001e15] text-white shadow-xs'
              : 'text-[#404944] hover:bg-[#f3f4f1]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#fd8a42]" />
          <span>Kondisi Fisik ({conditions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('location')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'location'
              ? 'bg-[#001e15] text-white shadow-xs'
              : 'text-[#404944] hover:bg-[#f3f4f1]'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-[#fd8a42]" />
          <span>Lokasi & Ruang Pamer ({locations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('source')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'source'
              ? 'bg-[#001e15] text-white shadow-xs'
              : 'text-[#404944] hover:bg-[#f3f4f1]'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5 text-[#fd8a42]" />
          <span>Sumber Perolehan ({acquisitionSources.length})</span>
        </button>
      </div>

      {/* Tab Contents: Tables */}
      <div className="bg-white rounded-2xl border border-[#e2e3e0] shadow-xs overflow-hidden">
        
        {/* Table: Kategori */}
        {activeTab === 'category' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#001e15] text-white">
                  <th className="p-3.5 font-bold uppercase tracking-wider">Kode</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider">Nama Kategori</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider">Deskripsi</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider">Koleksi Terkait</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edeeeb]">
                {categories.map((c) => {
                  const count = collections.filter(item => item.category_id === c.id).length;
                  return (
                    <tr key={c.id} className="hover:bg-[#f9faf7]">
                      <td className="p-3.5 font-mono font-bold text-[#001e15]">{c.code}</td>
                      <td className="p-3.5 font-bold text-[#1a1c1b]">{c.name}</td>
                      <td className="p-3.5 text-[#717974]">{c.description || '-'}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 bg-[#f3f4f1] text-[#001e15] font-bold rounded-full">
                          {count} Benda
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="p-1.5 text-[#9b4500] hover:bg-[#ffdbc9]/40 rounded-lg"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="p-1.5 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg"
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
        )}

        {/* Table: Jenis Koleksi */}
        {activeTab === 'type' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#001e15] text-white">
                  <th className="p-3.5 font-bold uppercase tracking-wider">Nama Jenis</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider">Kategori Induk</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider">Deskripsi</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edeeeb]">
                {collectionTypes.map((t) => {
                  const parentCat = categories.find(c => c.id === t.category_id);
                  return (
                    <tr key={t.id} className="hover:bg-[#f9faf7]">
                      <td className="p-3.5 font-bold text-[#001e15]">{t.name}</td>
                      <td className="p-3.5 font-semibold text-[#9b4500]">{parentCat?.name || '-'}</td>
                      <td className="p-3.5 text-[#717974]">{t.description || '-'}</td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(t)}
                            className="p-1.5 text-[#9b4500] hover:bg-[#ffdbc9]/40 rounded-lg"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-1.5 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg"
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
        )}

        {/* Table: Kondisi */}
        {activeTab === 'condition' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#001e15] text-white">
                  <th className="p-3.5 font-bold uppercase tracking-wider">Kondisi</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider">Warna Lencana</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider">Deskripsi Klinis / Preservasi</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edeeeb]">
                {conditions.map((cd) => (
                  <tr key={cd.id} className="hover:bg-[#f9faf7]">
                    <td className="p-3.5">
                      <span
                        className="px-2.5 py-1 text-xs font-bold rounded-full"
                        style={{
                          backgroundColor: `${cd.badge_color}20`,
                          color: cd.badge_color
                        }}
                      >
                        {cd.name}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[#717974]">{cd.badge_color}</td>
                    <td className="p-3.5 text-[#717974]">{cd.description || '-'}</td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(cd)}
                          className="p-1.5 text-[#9b4500] hover:bg-[#ffdbc9]/40 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cd.id)}
                          className="p-1.5 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table: Lokasi */}
        {activeTab === 'location' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#001e15] text-white">
                  <th className="p-3.5 font-bold uppercase tracking-wider">Nama Ruangan / Vitrin</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider">Lantai / Posisi</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider">Gedung</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider">Status</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edeeeb]">
                {locations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-[#f9faf7]">
                    <td className="p-3.5 font-bold text-[#001e15]">{loc.name}</td>
                    <td className="p-3.5 text-[#404944]">{loc.floor}</td>
                    <td className="p-3.5 text-[#404944]">{loc.building}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-[#bcedd8] text-[#064e3b] font-bold rounded-md text-[10px]">
                        Aktif
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(loc)}
                          className="p-1.5 text-[#9b4500] hover:bg-[#ffdbc9]/40 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(loc.id)}
                          className="p-1.5 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table: Sumber Perolehan */}
        {activeTab === 'source' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#001e15] text-white">
                  <th className="p-3.5 font-bold uppercase tracking-wider">Sumber Perolehan</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider">Deskripsi & Prosedur</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edeeeb]">
                {acquisitionSources.map((src) => (
                  <tr key={src.id} className="hover:bg-[#f9faf7]">
                    <td className="p-3.5 font-bold text-[#001e15]">{src.name}</td>
                    <td className="p-3.5 text-[#717974]">{src.description || '-'}</td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(src)}
                          className="p-1.5 text-[#9b4500] hover:bg-[#ffdbc9]/40 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(src.id)}
                          className="p-1.5 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Edit / Add Modal for Master Data */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-[#e2e3e0] space-y-4 animate-in fade-in zoom-in duration-150">
            <h3 className="font-serif text-lg font-bold text-[#001e15]">
              {editingId ? 'Ubah Data Master' : 'Tambah Entri Master Baru'}
            </h3>

            {errorMessage && (
              <div className="p-3 bg-[#ffdad6] text-[#93000a] text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#001e15] block mb-1">Nama</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama entri..."
                  className="w-full p-2 text-xs bg-[#f9faf7] rounded-lg border border-[#e2e3e0] outline-none"
                  required
                />
              </div>

              {activeTab === 'category' && (
                <div>
                  <label className="text-xs font-bold text-[#001e15] block mb-1">Kode Kategori</label>
                  <input
                    type="text"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Contoh: KAT-001"
                    className="w-full p-2 text-xs bg-[#f9faf7] rounded-lg border border-[#e2e3e0] outline-none font-mono"
                  />
                </div>
              )}

              {activeTab === 'type' && (
                <div>
                  <label className="text-xs font-bold text-[#001e15] block mb-1">Kategori Induk</label>
                  <select
                    value={formData.category_id || categories[0]?.id}
                    onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                    className="w-full p-2 text-xs bg-[#f9faf7] rounded-lg border border-[#e2e3e0] outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === 'condition' && (
                <div>
                  <label className="text-xs font-bold text-[#001e15] block mb-1">Warna Badge (Hex)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.badge_color || '#16a34a'}
                      onChange={(e) => setFormData({ ...formData, badge_color: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={formData.badge_color || '#16a34a'}
                      onChange={(e) => setFormData({ ...formData, badge_color: e.target.value })}
                      className="flex-1 p-2 text-xs bg-[#f9faf7] rounded-lg border border-[#e2e3e0] outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'location' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-[#001e15] block mb-1">Lantai</label>
                    <input
                      type="text"
                      value={formData.floor || ''}
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                      placeholder="Lantai 1 / 2"
                      className="w-full p-2 text-xs bg-[#f9faf7] rounded-lg border border-[#e2e3e0] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#001e15] block mb-1">Gedung</label>
                    <input
                      type="text"
                      value={formData.building || ''}
                      onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                      placeholder="Gedung Bayt Al-Qur'an"
                      className="w-full p-2 text-xs bg-[#f9faf7] rounded-lg border border-[#e2e3e0] outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[#001e15] block mb-1">Deskripsi / Catatan</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Keterangan..."
                  className="w-full p-2 text-xs bg-[#f9faf7] rounded-lg border border-[#e2e3e0] outline-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 text-xs font-semibold bg-[#f3f4f1] text-[#404944] rounded-xl hover:bg-[#e7e8e6]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold bg-[#001e15] text-white rounded-xl hover:bg-[#003527]"
                >
                  Simpan Master
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
