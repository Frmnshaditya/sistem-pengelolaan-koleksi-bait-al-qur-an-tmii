import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Info,
  Layers,
  Calendar,
  MapPin,
  FileCheck
} from 'lucide-react';
import {
  Collection,
  Category,
  CollectionType,
  Condition,
  Location,
  AcquisitionSource,
  CollectionImage,
  CollectionStatus
} from '../../types';

interface CollectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: Collection | null;
  categories: Category[];
  collectionTypes: CollectionType[];
  conditions: Condition[];
  locations: Location[];
  acquisitionSources: AcquisitionSource[];
}

export const CollectionFormModal: React.FC<CollectionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
  collectionTypes,
  conditions,
  locations,
  acquisitionSources
}) => {
  const [formData, setFormData] = useState({
    inventory_code: '',
    name: '',
    category_id: categories[0]?.id || 1,
    collection_type_id: collectionTypes[0]?.id || 1,
    description: '',
    origin_region: '',
    period_year: '',
    material: '',
    dimensions: '',
    condition_id: conditions[0]?.id || 1,
    location_id: locations[0]?.id || 1,
    historical_significance: '',
    acquisition_date: new Date().toISOString().slice(0, 10),
    acquisition_source_id: acquisitionSources[0]?.id || 1,
    status: 'dipamerkan' as CollectionStatus,
    additional_notes: ''
  });

  const [images, setImages] = useState<CollectionImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        inventory_code: initialData.inventory_code,
        name: initialData.name,
        category_id: initialData.category_id,
        collection_type_id: initialData.collection_type_id,
        description: initialData.description,
        origin_region: initialData.origin_region,
        period_year: initialData.period_year,
        material: initialData.material,
        dimensions: initialData.dimensions,
        condition_id: initialData.condition_id,
        location_id: initialData.location_id,
        historical_significance: initialData.historical_significance,
        acquisition_date: initialData.acquisition_date,
        acquisition_source_id: initialData.acquisition_source_id,
        status: initialData.status,
        additional_notes: initialData.additional_notes || ''
      });
      setImages(initialData.images || []);
    } else {
      // Auto-generate inventory code
      const randNum = Math.floor(100 + Math.random() * 900);
      setFormData({
        inventory_code: `BQ-MS-2024-${randNum}`,
        name: '',
        category_id: categories[0]?.id || 1,
        collection_type_id: collectionTypes[0]?.id || 1,
        description: '',
        origin_region: 'Nusantara / Jawa Barat',
        period_year: 'Abad ke-19 Masehi',
        material: 'Kertas Daluwang Alami, Tinta Karbon Hitam',
        dimensions: '30 cm x 20 cm x 5 cm',
        condition_id: conditions[0]?.id || 1,
        location_id: locations[0]?.id || 1,
        historical_significance: '',
        acquisition_date: new Date().toISOString().slice(0, 10),
        acquisition_source_id: acquisitionSources[0]?.id || 1,
        status: 'dipamerkan',
        additional_notes: ''
      });
      setImages([
        {
          id: `img-${Date.now()}`,
          url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800',
          caption: 'Foto Tampak Depan',
          is_primary: true,
          file_name: 'spesimen_utama.jpg',
          uploaded_at: new Date().toISOString()
        }
      ]);
    }
    setErrors({});
  }, [initialData, isOpen, categories, collectionTypes, conditions, locations, acquisitionSources]);

  if (!isOpen) return null;

  // Cascading types
  const filteredTypes = collectionTypes.filter(t => t.category_id === Number(formData.category_id));

  // Add Image URL
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    const isFirst = images.length === 0;
    const newImg: CollectionImage = {
      id: `img-${Date.now()}`,
      url: newImageUrl.trim(),
      caption: newImageCaption.trim() || 'Foto Tambahan Koleksi',
      is_primary: isFirst,
      file_name: `upload_${Date.now()}.jpg`,
      uploaded_at: new Date().toISOString()
    };
    setImages(prev => [...prev, newImg]);
    setNewImageUrl('');
    setNewImageCaption('');
  };

  // Upload file simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validMimes.includes(file.type)) {
      setErrors(prev => ({ ...prev, images: 'Format file harus berupa JPG, JPEG, PNG, atau WebP' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, images: 'Ukuran file foto maksimal 5 MB' }));
      return;
    }

    // Create object URL for instant preview
    const objectUrl = URL.createObjectURL(file);
    const isFirst = images.length === 0;
    const newImg: CollectionImage = {
      id: `img-${Date.now()}`,
      url: objectUrl,
      caption: file.name,
      is_primary: isFirst,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      uploaded_at: new Date().toISOString()
    };

    setImages(prev => [...prev, newImg]);
    setErrors(prev => {
      const copy = { ...prev };
      delete copy.images;
      return copy;
    });
  };

  const setPrimaryImage = (id: string) => {
    setImages(prev => prev.map(img => ({
      ...img,
      is_primary: img.id === id
    })));
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      if (filtered.length > 0 && !filtered.some(i => i.is_primary)) {
        filtered[0].is_primary = true;
      }
      return filtered;
    });
  };

  // Validation Form Request
  const validateForm = () => {
    const err: { [key: string]: string } = {};

    if (!formData.inventory_code.trim()) {
      err.inventory_code = 'Kode inventaris wajib diisi.';
    }
    if (!formData.name.trim()) {
      err.name = 'Nama koleksi tidak boleh kosong.';
    }
    if (!formData.origin_region.trim()) {
      err.origin_region = 'Asal / daerah koleksi wajib diisi.';
    }
    if (!formData.period_year.trim()) {
      err.period_year = 'Periode atau tahun pembuatan wajib diisi.';
    }
    if (!formData.material.trim()) {
      err.material = 'Bahan atau material koleksi wajib diisi.';
    }
    if (!formData.description.trim()) {
      err.description = 'Deskripsi naskah/benda koleksi wajib diisi.';
    }
    if (!formData.historical_significance.trim()) {
      err.historical_significance = 'Nilai historis/filologis naskah wajib diisi.';
    }
    if (images.length === 0) {
      err.images = 'Minimal lampirkan satu foto dokumentasi koleksi.';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSave({
      ...(initialData ? { id: initialData.id } : {}),
      ...formData,
      category_id: Number(formData.category_id),
      collection_type_id: Number(formData.collection_type_id),
      condition_id: Number(formData.condition_id),
      location_id: Number(formData.location_id),
      acquisition_source_id: Number(formData.acquisition_source_id),
      images
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#e2e3e0] overflow-hidden my-6 flex flex-col max-h-[92vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#001e15] text-white flex items-center justify-between border-b border-[#003527] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#fd8a42] text-[#001e15] flex items-center justify-center font-bold">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                {initialData ? 'Ubah Data Koleksi' : 'Tambah Koleksi Baru'}
              </h3>
              <p className="text-[11px] text-[#a0d1bc]">
                Museum Bait Al-Qur'an TMII • Formulir Registrasi Kodikologi & Inventaris
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Identitas & Kodikologi */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#9b4500] mb-3 flex items-center gap-1.5 border-b pb-1">
              <Sparkles className="w-4 h-4" />
              1. Identitas Utama & Klasifikasi
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Kode Inventaris */}
              <div>
                <label className="text-xs font-bold text-[#001e15] block mb-1">
                  Kode Inventaris <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.inventory_code}
                  onChange={(e) => setFormData({ ...formData, inventory_code: e.target.value })}
                  placeholder="Contoh: BQ-MS-2024-001"
                  className={`w-full p-2.5 text-xs bg-[#f9faf7] rounded-xl border font-mono font-bold ${
                    errors.inventory_code ? 'border-[#ba1a1a]' : 'border-[#e2e3e0]'
                  } outline-none focus:border-[#001e15]`}
                />
                {errors.inventory_code && (
                  <span className="text-[11px] text-[#ba1a1a] mt-1 block">{errors.inventory_code}</span>
                )}
              </div>

              {/* Nama Koleksi */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#001e15] block mb-1">
                  Nama Lengkap Koleksi <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Mushaf Kuno Keraton Cirebon Naskah Daluwang"
                  className={`w-full p-2.5 text-xs bg-[#f9faf7] rounded-xl border ${
                    errors.name ? 'border-[#ba1a1a]' : 'border-[#e2e3e0]'
                  } outline-none focus:border-[#001e15]`}
                />
                {errors.name && (
                  <span className="text-[11px] text-[#ba1a1a] mt-1 block">{errors.name}</span>
                )}
              </div>

              {/* Kategori */}
              <div>
                <label className="text-xs font-bold text-[#001e15] block mb-1">
                  Kategori Koleksi <span className="text-[#ba1a1a]">*</span>
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => {
                    const catId = Number(e.target.value);
                    const defaultType = collectionTypes.find(t => t.category_id === catId);
                    setFormData({
                      ...formData,
                      category_id: catId,
                      collection_type_id: defaultType ? defaultType.id : 1
                    });
                  }}
                  className="w-full p-2.5 text-xs bg-[#f9faf7] rounded-xl border border-[#e2e3e0] outline-none focus:border-[#001e15]"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Jenis Koleksi (Cascading) */}
              <div>
                <label className="text-xs font-bold text-[#001e15] block mb-1">
                  Jenis Koleksi (Sub-Kategori)
                </label>
                <select
                  value={formData.collection_type_id}
                  onChange={(e) => setFormData({ ...formData, collection_type_id: Number(e.target.value) })}
                  className="w-full p-2.5 text-xs bg-[#f9faf7] rounded-xl border border-[#e2e3e0] outline-none focus:border-[#001e15]"
                >
                  {filteredTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Asal Daerah */}
              <div>
                <label className="text-xs font-bold text-[#001e15] block mb-1">
                  Asal / Daerah Pembuatan <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.origin_region}
                  onChange={(e) => setFormData({ ...formData, origin_region: e.target.value })}
                  placeholder="Contoh: Cirebon, Jawa Barat"
                  className={`w-full p-2.5 text-xs bg-[#f9faf7] rounded-xl border ${
                    errors.origin_region ? 'border-[#ba1a1a]' : 'border-[#e2e3e0]'
                  } outline-none focus:border-[#001e15]`}
                />
                {errors.origin_region && (
                  <span className="text-[11px] text-[#ba1a1a] mt-1 block">{errors.origin_region}</span>
                )}
              </div>

              {/* Periode / Tahun */}
              <div>
                <label className="text-xs font-bold text-[#001e15] block mb-1">
                  Periode / Abad / Tahun <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.period_year}
                  onChange={(e) => setFormData({ ...formData, period_year: e.target.value })}
                  placeholder="Contoh: Akhir Abad ke-18 (± 1785 M)"
                  className={`w-full p-2.5 text-xs bg-[#f9faf7] rounded-xl border ${
                    errors.period_year ? 'border-[#ba1a1a]' : 'border-[#e2e3e0]'
                  } outline-none focus:border-[#001e15]`}
                />
                {errors.period_year && (
                  <span className="text-[11px] text-[#ba1a1a] mt-1 block">{errors.period_year}</span>
                )}
              </div>

              {/* Bahan / Material */}
              <div>
                <label className="text-xs font-bold text-[#001e15] block mb-1">
                  Bahan / Material Fisik <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="Contoh: Kertas Daluwang, Tinta Karbon"
                  className={`w-full p-2.5 text-xs bg-[#f9faf7] rounded-xl border ${
                    errors.material ? 'border-[#ba1a1a]' : 'border-[#e2e3e0]'
                  } outline-none focus:border-[#001e15]`}
                />
                {errors.material && (
                  <span className="text-[11px] text-[#ba1a1a] mt-1 block">{errors.material}</span>
                )}
              </div>

              {/* Dimensi Fisik */}
              <div>
                <label className="text-xs font-bold text-[#001e15] block mb-1">
                  Dimensi (Panjang x Lebar x Tebal)
                </label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  placeholder="Contoh: 32 cm x 21 cm x 6.5 cm"
                  className="w-full p-2.5 text-xs bg-[#f9faf7] rounded-xl border border-[#e2e3e0] outline-none focus:border-[#001e15]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Kurasi, Deskripsi & Nilai Historis */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#9b4500] mb-3 flex items-center gap-1.5 border-b pb-1">
              <Info className="w-4 h-4" />
              2. Ulasan Deskriptif & Nilai Historis
            </h4>

            <div className="space-y-4">
              {/* Deskripsi */}
              <div>
                <label className="text-xs font-bold text-[#001e15] block mb-1">
                  Deskripsi Fisik & Visual Naskah <span className="text-[#ba1a1a]">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan kondisi teks, rasm, kaligrafi, ornamen iluminasi, jilidan..."
                  className={`w-full p-2.5 text-xs bg-[#f9faf7] rounded-xl border ${
                    errors.description ? 'border-[#ba1a1a]' : 'border-[#e2e3e0]'
                  } outline-none focus:border-[#001e15]`}
                />
                {errors.description && (
                  <span className="text-[11px] text-[#ba1a1a] mt-1 block">{errors.description}</span>
                )}
              </div>

              {/* Nilai Historis */}
              <div>
                <label className="text-xs font-bold text-[#001e15] block mb-1">
                  Nilai Historis / Catatan Kolofon <span className="text-[#ba1a1a]">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.historical_significance}
                  onChange={(e) => setFormData({ ...formData, historical_significance: e.target.value })}
                  placeholder="Catatan penulisan, kepemilikan tokoh ulama/sultan, serta nilai historis penting..."
                  className={`w-full p-2.5 text-xs bg-[#f9faf7] rounded-xl border ${
                    errors.historical_significance ? 'border-[#ba1a1a]' : 'border-[#e2e3e0]'
                  } outline-none focus:border-[#001e15]`}
                />
                {errors.historical_significance && (
                  <span className="text-[11px] text-[#ba1a1a] mt-1 block">{errors.historical_significance}</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Preservasi, Lokasi & Akuisisi */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#9b4500] mb-3 flex items-center gap-1.5 border-b pb-1">
              <MapPin className="w-4 h-4" />
              3. Preservasi, Lokasi Penyimpanan & Sumber
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Kondisi */}
              <div>
                <label className="text-xs font-bold text-[#001e15] block mb-1">
                  Kondisi Fisik
                </label>
                <select
                  value={formData.condition_id}
                  onChange={(e) => setFormData({ ...formData, condition_id: Number(e.target.value) })}
                  className="w-full p-2.5 text-xs bg-[#f9faf7] rounded-xl border border-[#e2e3e0] outline-none"
                >
                  {conditions.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Lokasi Ruang */}
              <div>
                <label className="text-xs font-bold text-[#001e15] block mb-1">
                  Lokasi Simpan / Pamer
                </label>
                <select
                  value={formData.location_id}
                  onChange={(e) => setFormData({ ...formData, location_id: Number(e.target.value) })}
                  className="w-full p-2.5 text-xs bg-[#f9faf7] rounded-xl border border-[#e2e3e0] outline-none"
                >
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

              {/* Sumber Perolehan */}
              <div>
                <label className="text-xs font-bold text-[#001e15] block mb-1">
                  Sumber Perolehan
                </label>
                <select
                  value={formData.acquisition_source_id}
                  onChange={(e) => setFormData({ ...formData, acquisition_source_id: Number(e.target.value) })}
                  className="w-full p-2.5 text-xs bg-[#f9faf7] rounded-xl border border-[#e2e3e0] outline-none"
                >
                  {acquisitionSources.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Status Koleksi */}
              <div>
                <label className="text-xs font-bold text-[#001e15] block mb-1">
                  Status Saat Ini
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full p-2.5 text-xs bg-[#f9faf7] rounded-xl border border-[#e2e3e0] outline-none"
                >
                  <option value="dipamerkan">Dipamerkan (Vitrin Galeri)</option>
                  <option value="disimpan">Disimpan di Depot Vault</option>
                  <option value="restorasi">Dalam Lab Restorasi</option>
                  <option value="dipinjam">Dipinjamkan untuk Pameran Luar</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Upload Foto Koleksi */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#9b4500] mb-3 flex items-center gap-1.5 border-b pb-1">
              <ImageIcon className="w-4 h-4" />
              4. Dokumentasi Foto Resolusi Tinggi (Maks. 5 MB / Format: JPG, PNG, WebP)
            </h4>

            {errors.images && (
              <div className="p-3 bg-[#ffdad6] text-[#93000a] text-xs rounded-xl mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.images}</span>
              </div>
            )}

            {/* Upload Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Manual URL Input */}
              <div className="p-4 bg-[#f9faf7] rounded-xl border border-[#e2e3e0] space-y-2">
                <label className="text-xs font-bold text-[#001e15] block">
                  Tambah Foto via Tautan URL
                </label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2 text-xs bg-white rounded-lg border border-[#e2e3e0] outline-none"
                />
                <input
                  type="text"
                  value={newImageCaption}
                  onChange={(e) => setNewImageCaption(e.target.value)}
                  placeholder="Keterangan foto (misal: Halaman Surat Al-Kahfi)"
                  className="w-full p-2 text-xs bg-white rounded-lg border border-[#e2e3e0] outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-1.5 bg-[#001e15] text-white text-xs font-semibold rounded-lg hover:bg-[#003527]"
                >
                  Tambah Tautan Foto
                </button>
              </div>

              {/* Local File Picker (Simulated / Local ObjectURL) */}
              <div className="p-4 bg-[#f9faf7] rounded-xl border-2 border-dashed border-[#c0c8c3] flex flex-col items-center justify-center text-center">
                <Upload className="w-6 h-6 text-[#717974] mb-2" />
                <span className="text-xs font-bold text-[#001e15]">Unggah dari Komputer / Gawai</span>
                <span className="text-[10px] text-[#717974] mb-2">JPG, PNG, atau WebP (Maks 5MB)</span>
                <label className="cursor-pointer px-3 py-1.5 bg-[#fd8a42] text-[#001e15] text-xs font-bold rounded-lg hover:bg-[#ff914e] transition-colors">
                  Pilih File Foto
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Photos List / Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className={`relative bg-white rounded-xl overflow-hidden border-2 p-1.5 flex flex-col justify-between ${
                    img.is_primary ? 'border-[#001e15] ring-2 ring-[#fd8a42]' : 'border-[#e2e3e0]'
                  }`}
                >
                  <div className="aspect-4/3 rounded-lg overflow-hidden bg-black/5 mb-1.5">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-medium text-[#1a1c1b] truncate px-1 block">
                    {img.caption || img.file_name}
                  </span>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#f3f4f1]">
                    {img.is_primary ? (
                      <span className="text-[10px] font-bold text-[#16a34a] flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> Foto Utama
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(img.id)}
                        className="text-[10px] text-[#001e15] font-semibold hover:underline"
                      >
                        Jadikan Utama
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Hapus foto ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Catatan Tambahan */}
          <div>
            <label className="text-xs font-bold text-[#001e15] block mb-1">
              Catatan Tambahan / Konservasi Khusus (Opsional)
            </label>
            <input
              type="text"
              value={formData.additional_notes}
              onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
              placeholder="Instruksi pencahayaan lux, suhu penyimpanan, atau peminjaman..."
              className="w-full p-2.5 text-xs bg-[#f9faf7] rounded-xl border border-[#e2e3e0] outline-none"
            />
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-[#e2e3e0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#404944] bg-[#f3f4f1] hover:bg-[#e7e8e6] rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-bold text-white bg-[#001e15] hover:bg-[#003527] rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-[#fd8a42]" />
              <span>{initialData ? 'Simpan Perubahan' : 'Simpan Koleksi Baru'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
