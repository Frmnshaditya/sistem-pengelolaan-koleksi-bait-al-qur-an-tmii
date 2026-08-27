import { Category, CollectionType, Condition, Location, AcquisitionSource, User, ActivityLog } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Manuskrip Al-Qur'an",
    code: "manuskrip-al-quran",
    description: "Naskah mushaf Al-Qur'an kuno tulisan tangan dari berbagai kesultanan dan wilayah Nusantara.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 2,
    name: "Mushaf Al-Qur'an",
    code: "mushaf-al-quran",
    description: "Koleksi mushaf Al-Qur'an cetak bersejarah, mushaf standar, dan mushaf berukuran monumental.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 3,
    name: "Seni Kaligrafi",
    code: "seni-kaligrafi",
    description: "Karya seni lukis, pahat, ukir, dan tenun berlafazkan ayat-ayat suci Al-Qur'an.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 4,
    name: "Artefak Islam Bersejarah",
    code: "artefak-islam-bersejarah",
    description: "Benda-benda peninggalan bersejarah Islam seperti mimbar, mustaka, koin dirham, dan peranti ibadah.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 5,
    name: "Koleksi Pendukung & Literatur",
    code: "koleksi-pendukung-literatur",
    description: "Kitab tafsir kuno, kamus bahasa Arab-Melayu klasik, dan literatur kajian kodikologi.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  }
];

export const INITIAL_COLLECTION_TYPES: CollectionType[] = [
  {
    id: 1,
    category_id: 1,
    category_name: "Manuskrip Al-Qur'an",
    name: "Manuskrip Kertas Daluwang",
    code: "manuskrip-kertas-daluwang",
    description: "Naskah berbahan serat kulit kayu pohon saeh / daluwang asli Nusantara.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 2,
    category_id: 1,
    category_name: "Manuskrip Al-Qur'an",
    name: "Manuskrip Kertas Eropa",
    code: "manuskrip-kertas-eropa",
    description: "Naskah berbahan rag paper impor Eropa dengan watermark dan countermark resmi.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 3,
    category_id: 2,
    category_name: "Mushaf Al-Qur'an",
    name: "Mushaf Cetak Kuno",
    code: "mushaf-cetak-kuno",
    description: "Mushaf cetak litografi dan tipografi awal abad ke-19 hingga pertengahan abad ke-20.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 4,
    category_id: 2,
    category_name: "Mushaf Al-Qur'an",
    name: "Mushaf Standar & Akbar",
    code: "mushaf-standar-akbar",
    description: "Mushaf ukuran besar dan format standar kenegaraan / braille.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 5,
    category_id: 3,
    category_name: "Seni Kaligrafi",
    name: "Kaligrafi Ukir Kayu",
    code: "kaligrafi-ukir-kayu",
    description: "Karya ukiran kayu jati dan kayu langka berpahat ayat suci.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 6,
    category_id: 3,
    category_name: "Seni Kaligrafi",
    name: "Kaligrafi Kain & Tenun",
    code: "kaligrafi-kain-tenun",
    description: "Tekstil sutra berbordir benang emas, potongan kiswah, dan tenun bertuliskan ayat.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 7,
    category_id: 4,
    category_name: "Artefak Islam Bersejarah",
    name: "Ornamen Masjid Kuno",
    code: "ornamen-masjid-kuno",
    description: "Mustaka kubah, tiang tumpangsari berukir, dan ornamen arsitektur Islam klasik.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 8,
    category_id: 5,
    category_name: "Koleksi Pendukung & Literatur",
    name: "Kitab Tafsir Kuno",
    code: "kitab-tafsir-kuno",
    description: "Naskah salinan tafsir Al-Qur'an dan syarah kitab fiqih para ulama Nusantara.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  }
];

export const INITIAL_CONDITIONS: Condition[] = [
  {
    id: 1,
    name: "Baik",
    code: "baik",
    badge_color: "#16a34a",
    description: "Kondisi fisik utuh, teks terbaca jelas, tidak ada kerusakan aktif.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 2,
    name: "Rusak Ringan",
    code: "rusak-ringan",
    badge_color: "#2563eb",
    description: "Terdapat sedikit noda usia (foxing) atau kerapuhan minor pada pinggiran media.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 3,
    name: "Rusak Sedang",
    code: "rusak-sedang",
    badge_color: "#eab308",
    description: "Terdapat robekan pada beberapa lembar atau korosi tinta, memerlukan stabilisasi.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 4,
    name: "Rusak Berat",
    code: "rusak-berat",
    badge_color: "#dc2626",
    description: "Kerusakan struktural signifikan, serangan jamur/serangga berat.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 5,
    name: "Dalam Restorasi",
    code: "dalam-restorasi",
    badge_color: "#8b5cf6",
    description: "Sedang dalam penanganan laboratorium konservasi dan perbaikan fisik.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  }
];

export const INITIAL_LOCATIONS: Location[] = [
  {
    id: 1,
    name: "Ruang Pamer Utama (Mushaf Akbar)",
    building: "Gedung Bait Al-Qur'an TMII",
    room: "Hall Utama",
    floor: "Lantai 1",
    description: "Area pameran utama dengan etalase bersuhu dan kelembapan terkontrol.",
    is_active: true,
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 2,
    name: "Ruang Pamer Manuskrip Nusantara",
    building: "Gedung Bait Al-Qur'an TMII",
    room: "Galeri Manuskrip",
    floor: "Lantai 2",
    description: "Area pameran naskah kuno nusantara bertata cahaya khusus anti-UV.",
    is_active: true,
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 3,
    name: "Ruang Pamer Seni & Kaligrafi",
    building: "Gedung Bait Al-Qur'an TMII",
    room: "Galeri Kaligrafi",
    floor: "Lantai 2",
    description: "Galeri pameran karya kaligrafi seni rupa dan kriya kayu/logam.",
    is_active: true,
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 4,
    name: "Ruang Khusus Penyimpanan (Vault)",
    building: "Gedung Pengelola TMII",
    room: "Storage Vault A",
    floor: "Basement",
    description: "Ruang penyimpanan tertutup dengan sistem pendingin dan fire suppression FM-200.",
    is_active: true,
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 5,
    name: "Laboratorium Konservasi & Restorasi",
    building: "Gedung Pengelola TMII",
    room: "Lab Konservasi",
    floor: "Lantai 1",
    description: "Fasilitas perawatan naskah kuno, leaf casting, dan stabilisasi kimiawi.",
    is_active: true,
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  }
];

export const INITIAL_ACQUISITION_SOURCES: AcquisitionSource[] = [
  {
    id: 1,
    name: "Hibah Tokoh Nasional",
    type: "hibah",
    contact_person: "Keluarga Tokoh / Yayasan",
    description: "Penyerahan koleksi secara hibah dari tokoh nasional dan keluarga kebudayaan.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 2,
    name: "Wakaf Umat / Yayasan",
    type: "wakaf",
    contact_person: "Lembaga Wakaf",
    description: "Penyerahan benda peninggalan bernilai sejarah Al-Qur'an secara wakaf kepada museum.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 3,
    name: "Pembelian Negara (Anggaran TMII)",
    type: "pembelian",
    contact_person: "Sekretariat Pengadaan Museum",
    description: "Pengadaan resmi koleksi melalui anggaran negara dan manajemen TMII.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 4,
    name: "Temuan & Ekskavasi Sejarah",
    type: "temuan",
    contact_person: "Balai Pelestarian Kebudayaan",
    description: "Hasil riset, ekskavasi, dan registrasi cagar budaya lapangan.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  },
  {
    id: 5,
    name: "Titipan Konservasi Keraton",
    type: "titipan",
    contact_person: "Pengageng Sasana Wilapa Keraton",
    description: "Benda pusaka yang dititipkan untuk perawatan, penelitian, dan pameran berkala.",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z"
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: "Administrator Sistem TMII",
    email: "admin@example.com",
    role: "admin",
    role_title: "Kepala Pengelola & Administrator Sistem",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    is_active: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2024-08-26T18:00:00Z",
    last_login_at: "2024-08-26T18:00:00Z"
  },
  {
    id: 2,
    name: "Drs. Ahmad Fauzi (Kurator)",
    email: "kurator@example.com",
    role: "kurator",
    role_title: "Kurator Utama Kodikologi & Filologi",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    is_active: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2024-08-26T14:20:00Z",
    last_login_at: "2024-08-26T14:20:00Z"
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: "log-1",
    user_id: 1,
    user_name: "Administrator Sistem TMII",
    user_role: "Administrator",
    action: "CREATE_COLLECTION",
    object_type: "collections",
    object_id: 1,
    object_title: "Mushaf Al-Qur’an Kuno Daluwang Cirebon",
    ip_address: "127.0.0.1",
    timestamp: "2023-01-15T09:00:00Z",
    details: "Inisialisasi registrasi inventaris koleksi BQ-MN-2023-0001 ke basis data resmi museum."
  },
  {
    id: "log-2",
    user_id: 2,
    user_name: "Drs. Ahmad Fauzi (Kurator)",
    user_role: "Kurator",
    action: "UPDATE_STATUS",
    object_type: "collections",
    object_id: 8,
    object_title: "Manuskrip Al-Qur’an Surakarta (Fragmen Juz 'Amma)",
    ip_address: "127.0.0.1",
    timestamp: "2023-05-12T14:00:00Z",
    details: "Memindahkan status koleksi BQ-MN-2023-0008 ke Laboratorium Konservasi untuk restorasi deasidifikasi."
  },
  {
    id: "log-3",
    user_id: 1,
    user_name: "Administrator Sistem TMII",
    user_role: "Administrator",
    action: "AUTH_LOGIN",
    object_type: "auth",
    ip_address: "127.0.0.1",
    timestamp: "2024-08-26T18:00:00Z",
    details: "Otentikasi berhasil ke portal pengelola Sistem Informasi Koleksi Bait Al-Qur'an TMII."
  }
];
