-- ==========================================================
-- SISTEM INFORMASI MANAJEMEN KOLEKSI MUSEUM BAIT AL-QUR'AN TMII
-- Basis Data Resmi: museum_bait_alquran
-- Target DBMS: MySQL 8.0+ / MariaDB 10.4+ / PostgreSQL kompatibel
-- Charset: utf8mb4 / utf8mb4_unicode_ci
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `museum_bait_alquran`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `museum_bait_alquran`;

-- --------------------------------------------------------
-- 1. TABEL ROLES (Hak Akses Pengguna)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- 2. TABEL USERS (Petugas & Pengelola Museum)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `role_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NULL,
  `avatar_url` VARCHAR(255) NULL,
  `status` ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
  `last_login_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- 3. TABEL CATEGORIES (Klasifikasi Utama Koleksi)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- 4. TABEL COLLECTION_TYPES (Sub-Jenis Koleksi)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `collection_types` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- 5. TABEL CONDITIONS (Status Kondisi Fisik)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `conditions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `badge_color` VARCHAR(20) NOT NULL DEFAULT '#16a34a',
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- 6. TABEL LOCATIONS (Lokasi Penyimpanan / Galeri Pamer)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `locations` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `building` VARCHAR(100) NOT NULL DEFAULT 'Gedung Bait Al-Qur\'an TMII',
  `room` VARCHAR(100) NULL,
  `floor` VARCHAR(50) NULL,
  `description` TEXT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- 7. TABEL ACQUISITION_SOURCES (Sumber Perolehan Koleksi)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `acquisition_sources` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `type` VARCHAR(50) DEFAULT 'hibah',
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- 8. TABEL COLLECTIONS (Entitas Inti Data Koleksi Museum)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `collections` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `inventory_code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `category_id` INT UNSIGNED NOT NULL,
  `collection_type_id` INT UNSIGNED NOT NULL,
  `condition_id` INT UNSIGNED NOT NULL,
  `location_id` INT UNSIGNED NOT NULL,
  `acquisition_source_id` INT UNSIGNED NOT NULL,
  `origin_region` VARCHAR(100) NULL,
  `period_year` VARCHAR(100) NULL,
  `material` VARCHAR(150) NULL,
  `dimensions` VARCHAR(100) NULL,
  `description` TEXT NULL,
  `historical_significance` TEXT NULL,
  `acquisition_date` DATE NULL,
  `status` ENUM('dipamerkan', 'disimpan', 'restorasi', 'dipinjam') DEFAULT 'dipamerkan',
  `created_by` BIGINT UNSIGNED NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`collection_type_id`) REFERENCES `collection_types` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`condition_id`) REFERENCES `conditions` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`acquisition_source_id`) REFERENCES `acquisition_sources` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_inventory_code` (`inventory_code`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- 9. TABEL COLLECTION_IMAGES (Foto & Dokumentasi Visual)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `collection_images` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `collection_id` BIGINT UNSIGNED NOT NULL,
  `image_path` VARCHAR(255) NOT NULL,
  `caption` VARCHAR(255) NULL,
  `is_primary` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- 10. TABEL ACTIVITY_LOGS (Audit Trail Sistem)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NULL,
  `action` VARCHAR(50) NOT NULL,
  `table_name` VARCHAR(50) NOT NULL,
  `record_id` BIGINT UNSIGNED NULL,
  `description` TEXT NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ==========================================================
-- DATA AWAL (SEEDER) RESMI MUSEUM BAIT AL-QUR'AN TMII
-- ==========================================================

INSERT INTO `roles` (`id`, `name`, `slug`, `description`) VALUES
(1, 'Administrator', 'admin', 'Akses penuh ke seluruh sistem manajemen inventaris dan pengguna'),
(2, 'Kurator Museum', 'kurator', 'Mengelola verifikasi data koleksi, deskripsi sejarah, dan status konservasi'),
(3, 'Pengunjung', 'pengunjung', 'Akses publik untuk melihat katalog koleksi dan informasi museum');

INSERT INTO `users` (`id`, `role_id`, `name`, `username`, `email`, `password`, `phone`, `status`) VALUES
(1, 1, 'Administrator Sistem TMII', 'admin', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '081234567890', 'aktif'),
(2, 2, 'Drs. Ahmad Fauzi (Kurator)', 'kurator1', 'kurator@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '081298765432', 'aktif');

INSERT INTO `categories` (`id`, `name`, `slug`, `description`) VALUES
(1, 'Manuskrip Al-Qur\'an', 'manuskrip-al-quran', 'Naskah mushaf Al-Qur\'an kuno tulisan tangan dari berbagai kesultanan dan wilayah Nusantara'),
(2, 'Mushaf Al-Qur\'an', 'mushaf-al-quran', 'Koleksi mushaf Al-Qur\'an cetak bersejarah, mushaf standar, dan mushaf berukuran monumental'),
(3, 'Seni Kaligrafi', 'seni-kaligrafi', 'Karya seni lukis, pahat, ukir, dan tenun berlafazkan ayat-ayat suci Al-Qur\'an'),
(4, 'Artefak Islam Bersejarah', 'artefak-islam-bersejarah', 'Benda-benda peninggalan bersejarah Islam seperti mimbar, mustaka, koin dirham, dan peranti ibadah'),
(5, 'Koleksi Pendukung & Literatur', 'koleksi-pendukung-literatur', 'Kitab tafsir kuno, kamus bahasa Arab-Melayu klasik, dan literatur kajian kodikologi');

INSERT INTO `collection_types` (`id`, `category_id`, `name`, `slug`, `description`) VALUES
(1, 1, 'Manuskrip Kertas Daluwang', 'manuskrip-kertas-daluwang', 'Naskah berbahan serat kulit kayu pohon saeh / daluwang asli Nusantara'),
(2, 1, 'Manuskrip Kertas Eropa', 'manuskrip-kertas-eropa', 'Naskah berbahan rag paper impor Eropa dengan watermark lambang singa mahkota'),
(3, 2, 'Mushaf Cetak Kuno', 'mushaf-cetak-kuno', 'Mushaf cetak litografi dan tipografi awal abad ke-19 hingga pertengahan abad ke-20'),
(4, 2, 'Mushaf Standar & Akbar', 'mushaf-standar-akbar', 'Mushaf ukuran besar dan format standar kenegaraan / braille'),
(5, 3, 'Kaligrafi Ukir Kayu', 'kaligrafi-ukir-kayu', 'Karya ukiran kayu jati dan kayu langka berpahat ayat suci Al-Qur\'an'),
(6, 3, 'Kaligrafi Kain & Tenun', 'kaligrafi-kain-tenun', 'Tekstil sutra berbordir benang emas, potongan kiswah, dan tenun berayat'),
(7, 4, 'Ornamen Masjid Kuno', 'ornamen-masjid-kuno', 'Mustaka kubah, tiang tumpangsari berukir, dan ornamen arsitektur Islam klasik'),
(8, 5, 'Kitab Tafsir Kuno', 'kitab-tafsir-kuno', 'Naskah salinan tafsir Al-Qur\'an dan syarah kitab para ulama Nusantara');

INSERT INTO `conditions` (`id`, `name`, `badge_color`, `description`) VALUES
(1, 'Baik', '#16a34a', 'Kondisi fisik utuh, teks terbaca jelas, tidak ada kerusakan aktif'),
(2, 'Rusak Ringan', '#2563eb', 'Terdapat sedikit noda usia (foxing) atau kerapuhan minor pada pinggiran media'),
(3, 'Rusak Sedang', '#eab308', 'Terdapat robekan pada beberapa lembar atau korosi tinta, memerlukan stabilisasi'),
(4, 'Rusak Berat', '#dc2626', 'Kerusakan struktural signifikan, serangan jamur/serangga berat'),
(5, 'Dalam Restorasi', '#8b5cf6', 'Sedang dalam penanganan laboratorium konservasi dan perbaikan fisik');

INSERT INTO `locations` (`id`, `name`, `building`, `room`, `floor`, `description`) VALUES
(1, 'Ruang Pamer Utama (Mushaf Akbar)', 'Gedung Bait Al-Qur\'an TMII', 'Hall Utama', 'Lantai 1', 'Area pameran utama dengan etalase bersuhu dan kelembapan terkontrol'),
(2, 'Ruang Pamer Manuskrip Nusantara', 'Gedung Bait Al-Qur\'an TMII', 'Galeri Manuskrip', 'Lantai 2', 'Area pameran naskah kuno nusantara bertata cahaya khusus anti-UV'),
(3, 'Ruang Pamer Seni & Kaligrafi', 'Gedung Bait Al-Qur\'an TMII', 'Galeri Kaligrafi', 'Lantai 2', 'Galeri pameran karya kaligrafi seni rupa dan kriya kayu/logam'),
(4, 'Ruang Khusus Penyimpanan (Vault)', 'Gedung Pengelola TMII', 'Storage Vault A', 'Basement', 'Ruang penyimpanan tertutup dengan sistem pendingin dan fire suppression FM-200'),
(5, 'Laboratorium Konservasi & Restorasi', 'Gedung Pengelola TMII', 'Lab Konservasi', 'Lantai 1', 'Fasilitas perawatan naskah kuno, leaf casting, dan stabilisasi kimiawi');

INSERT INTO `acquisition_sources` (`id`, `name`, `description`) VALUES
(1, 'Hibah Tokoh Nasional', 'Penyerahan koleksi secara hibah dari tokoh nasional dan keluarga kebudayaan'),
(2, 'Wakaf Umat / Yayasan', 'Penyerahan benda peninggalan bernilai sejarah Al-Qur\'an secara wakaf kepada museum'),
(3, 'Pembelian Negara (Anggaran TMII)', 'Pengadaan resmi koleksi melalui anggaran negara dan manajemen TMII'),
(4, 'Temuan & Ekskavasi Sejarah', 'Hasil riset, ekskavasi, dan registrasi cagar budaya lapangan'),
(5, 'Titipan Konservasi Keraton', 'Benda pusaka yang dititipkan untuk perawatan, penelitian, dan pameran berkala');

-- 10 Data Koleksi Utama
INSERT INTO `collections` (`id`, `inventory_code`, `name`, `category_id`, `collection_type_id`, `condition_id`, `location_id`, `acquisition_source_id`, `origin_region`, `period_year`, `material`, `dimensions`, `description`, `historical_significance`, `acquisition_date`, `status`, `created_by`) VALUES
(1, 'BQ-MN-2023-0001', 'Mushaf Al-Qur’an Kuno Daluwang Cirebon', 1, 1, 1, 2, 1, 'Cirebon, Jawa Barat', 'Abad ke-18 M (± 1785)', 'Kertas Daluwang Alami (Kulit Kayu Saeh), Tinta Karbon Hitam & Tinta Emas Nabati', '32 cm x 21 cm x 6.5 cm', 'Mushaf kuno tulisan tangan lengkap 30 juz dengan rasm Utsmani dan iluminasi khas motif Mega Mendung Keraton Cirebon.', 'Terdapat catatan kolofon beraksara Pegon yang menyebutkan penyalinan dilakukan di lingkungan Keraton Kasepuhan Cirebon.', '2018-04-12', 'dipamerkan', 1),
(2, 'BQ-MN-2023-0002', 'Naskah Mushaf Al-Qur’an Kesultanan Aceh', 1, 2, 2, 2, 2, 'Banda Aceh, Aceh', 'Awal Abad ke-19 M (± 1810)', 'Kertas Eropa Watermark Singa Mahkota (Pro Patria), Tinta Emas Prada & Mineral Alami', '36 cm x 24 cm x 7.0 cm', 'Mushaf indah bersampul kulit kambing beriluminasi emas murni ragam hias Bungong Jeumpa khas Kesultanan Aceh Darussalam.', 'Mahakarya seni mushaf pesisir barat Nusantara dengan sistem rubrikasi tiga lapis iluminasi ganda.', '2015-11-20', 'dipamerkan', 2),
(3, 'BQ-MS-2023-0003', 'Mushaf Akbar Wonosobo Hand-written Display', 2, 4, 1, 1, 3, 'Wonosobo, Jawa Tengah', '1991 - 1992 M', 'Kertas Manila Tebal Khusus Bebas Asam, Tinta Cina & Pewarna Alami', '200 cm x 150 cm x 25 cm', 'Mushaf Al-Qur’an raksasa tulisan tangan kaligrafer santri Pondok Pesantren Al-Asy\'ariyyah Kalibeber Wonosobo dengan ukuran monumental.', 'Karya ikonik pameran peresmian Bayt Al-Qur\'an & Museum Istiqlal oleh Presiden Republik Indonesia pada 20 April 1997.', '1997-04-20', 'dipamerkan', 1),
(4, 'BQ-MS-2023-0004', 'Mushaf Cetak Litografi Singapura Awal Abad 20', 2, 3, 3, 4, 1, 'Singapura / Riau', 'Tahun 1912 M / 1330 H', 'Kertas Cetak Rag Paper Impor, Tinta Cetak Litografi Minyak', '28 cm x 18 cm x 4.5 cm', 'Mushaf cetak batu (litografi) cetakan Matba\'ah Al-Ahmadiyyah Singapura yang banyak beredar di Nusantara awal abad ke-20.', 'Bukti jalur persebaran Al-Qur’an cetak modern di wilayah Selat Malaka dan Kepulauan Riau.', '2019-08-17', 'disimpan', 2),
(5, 'BQ-KL-2023-0005', 'Panel Kaligrafi Ukir Jati Ayat Kursi Jepara', 3, 5, 1, 3, 1, 'Jepara, Jawa Tengah', 'Tahun 1985 M', 'Kayu Jati Perhutani Pilihan (Tectona grandis), Finishing Plitur Alami', '180 cm x 90 cm x 8 cm', 'Panel ukiran kayu jati utuh berelief tinggi (high relief) memuat surah Al-Baqarah ayat 255 (Ayat Kursi) dengan khat Tsuluts Jali dan ornamen dedaunan sulur Jepara.', 'Karya maestro seni ukir kaligrafi Jepara yang memadukan kehalusan ukiran tradisional Jawa dan seni kaligrafi Timur Tengah.', '2020-02-10', 'dipamerkan', 1),
(6, 'BQ-KL-2023-0006', 'Fragmen Kain Kiswah Pintu Ka’bah', 3, 6, 2, 3, 1, 'Makkah Al-Mukarramah, Arab Saudi', 'Tahun 1994 M / 1415 H', 'Sutra Hitam Asli (Pure Silk), Benang Perak Berlapis Emas Murni (Gold-Plated Silver Wire)', '120 cm x 90 cm (Pigura 140 x 110 cm)', 'Potongan kain kiswah sutra hitam bertuliskan kaligrafi timbul berlapis benang emas dan perak murni dari bagian pintu Ka’bah (Sitara Bab al-Ka\'bah).', 'Cenderamata kenegaraan resmi dari Kerajaan Arab Saudi untuk peresmian Museum Bait Al-Qur\'an TMII.', '1995-10-10', 'dipamerkan', 1),
(7, 'BQ-AR-2023-0007', 'Mustaka Kubah Masjid Kuno Berukir Kaligrafi', 4, 7, 3, 4, 4, 'Kudus / Demak, Jawa Tengah', 'Abad ke-17 M', 'Tanah Liat Bakar Berglasir (Terracotta Glazed)', 'Tinggi 85 cm, Diameter Dasar 45 cm', 'Pucuk kubah (mustaka/memolo) masjid tradisional terbuat dari tembikar tanah liat berglasir dengan ornamen kaligrafi Arab melingkar kalimat Syahadatain.', 'Artefak arsitektur Islam era transisi Hindu-Buddha ke Islam di pesisir utara pulau Jawa.', '2017-10-05', 'disimpan', 2),
(8, 'BQ-MN-2023-0008', 'Manuskrip Al-Qur’an Surakarta (Fragmen Juz \'Amma)', 1, 1, 5, 5, 5, 'Surakarta, Jawa Tengah', 'Akhir Abad ke-18 M (± 1792)', 'Kertas Daluwang Tradisional, Tinta Cina Hitam, Tinta Vermilion Merah', '30 cm x 20 cm x 2 cm', 'Fragmen naskah Al-Qur’an tulisan tangan juz 30 di atas daluwang tebal dengan tanda akhir ayat bundar merah khas tradisi Keraton Kasunanan Surakarta.', 'Peninggalan era Pakubuwana IV yang memuat rincian tajwid beraksara Jawa Pegon.', '2021-06-05', 'restorasi', 2),
(9, 'BQ-KP-2023-0009', 'Kitab Tafsir Jalalain Salinan Tangan Ulama Banjar', 5, 8, 1, 4, 1, 'Martapura, Kalimantan Selatan', 'Tahun 1864 M / 1281 H', 'Kertas Eropa Watermark Bulan Sabit Bintang, Tinta Tahan Air Berbasis Jelaga', '26 cm x 17 cm x 5.0 cm', 'Naskah salinan lengkap Kitab Tafsir Al-Jalalain beranotasi tepi (hasyiyah) bahasa Melayu Banjar beraksara Arab Gundul.', 'Karya literatur keagamaan penting dari murid ulama besar Syekh Muhammad Arsyad al-Banjari.', '2022-09-14', 'disimpan', 1),
(10, 'BQ-MS-2023-0010', 'Mushaf Al-Qur’an Braille Nusantara Generasi Pertama', 2, 4, 1, 1, 2, 'Bandung, Jawa Barat', 'Tahun 1984 M', 'Kertas Karton Tebal Khusus Timbul (Embossed Braille Paper), Penjilidan Spiral Kawat Besi', '34 cm x 26 cm x 4 cm (per jilid)', 'Mushaf Al-Qur’an dengan cetakan huruf Braille khusus tunanetra 30 juz (terbagi dalam 30 jilid besar) terbitan awal Departemen Agama RI / YPAB.', 'Tonggak sejarah layanan inklusif Al-Qur’an bagi penyandang disabilitas netra di Indonesia.', '2023-01-28', 'dipamerkan', 1);

-- Gambar Koleksi
INSERT INTO `collection_images` (`id`, `collection_id`, `image_path`, `caption`, `is_primary`) VALUES
(1, 1, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000', 'Halaman beriluminasi emas Surah Al-Baqarah', 1),
(2, 1, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1000', 'Detail serat kertas daluwang dan penjilidan kulit berembos', 0),
(3, 2, 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=1000', 'Iluminasi ganda gaya Aceh klasik halaman Al-Fatihah', 1),
(4, 3, 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000', 'Tampilan mushaf raksasa Wonosobo di vitrin tengah hall utama', 1),
(5, 4, 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?w=1000', 'Lembaran teks cetak litografi huruf Naskhi klasik', 1),
(6, 5, 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000', 'Detail ukiran relief tinggi Ayat Kursi kayu jati Jepara', 1),
(7, 6, 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1000', 'Detail sulaman timbul kaligrafi emas di atas sutra hitam Kiswah', 1),
(8, 7, 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000', 'Mustaka kubah berukir kaligrafi melingkar', 1),
(9, 8, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1000', 'Naskah dalam proses stabilisasi kelembapan di meja restorasi', 1),
(10, 9, 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=1000', 'Halaman anotasi tafsir tulisan tangan Melayu Banjar', 1),
(11, 10, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1000', 'Tampilan cetakan huruf Braille timbul Mushaf Generasi Pertama', 1);

-- Audit Logs
INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `table_name`, `record_id`, `description`, `ip_address`) VALUES
(1, 1, 'CREATE', 'collections', 1, 'Inisialisasi registrasi inventaris koleksi BQ-MN-2023-0001 ke basis data resmi museum.', '127.0.0.1'),
(2, 2, 'UPDATE', 'collections', 8, 'Memindahkan status koleksi BQ-MN-2023-0008 ke Laboratorium Konservasi untuk restorasi deasidifikasi.', '127.0.0.1');

-- ==========================================================
-- VIEW UNTUK QUERY LAPORAN & INTEGRASI
-- ==========================================================

-- 1. View Detail Koleksi Lengkap
CREATE OR REPLACE VIEW `view_collection_details` AS
SELECT 
  c.id,
  c.inventory_code,
  c.name AS collection_name,
  cat.name AS category_name,
  ct.name AS type_name,
  cond.name AS condition_name,
  loc.name AS location_name,
  loc.building,
  loc.floor,
  acq.name AS source_name,
  c.origin_region,
  c.period_year,
  c.material,
  c.dimensions,
  c.status,
  c.acquisition_date,
  u.name AS registered_by,
  c.created_at
FROM `collections` c
JOIN `categories` cat ON c.category_id = cat.id
JOIN `collection_types` ct ON c.collection_type_id = ct.id
JOIN `conditions` cond ON c.condition_id = cond.id
JOIN `locations` loc ON c.location_id = loc.id
JOIN `acquisition_sources` acq ON c.acquisition_source_id = acq.id
LEFT JOIN `users` u ON c.created_by = u.id;

-- 2. View Ringkasan per Kategori
CREATE OR REPLACE VIEW `view_collection_summary_by_category` AS
SELECT 
  cat.id AS category_id,
  cat.name AS category_name,
  COUNT(c.id) AS total_collections
FROM `categories` cat
LEFT JOIN `collections` c ON cat.id = c.category_id
GROUP BY cat.id, cat.name;

-- 3. View Ringkasan per Kondisi
CREATE OR REPLACE VIEW `view_collection_summary_by_condition` AS
SELECT 
  cond.id AS condition_id,
  cond.name AS condition_name,
  cond.badge_color,
  COUNT(c.id) AS total_collections
FROM `conditions` cond
LEFT JOIN `collections` c ON cond.id = c.condition_id
GROUP BY cond.id, cond.name, cond.badge_color;

-- 4. View Ringkasan per Lokasi
CREATE OR REPLACE VIEW `view_collection_summary_by_location` AS
SELECT 
  loc.id AS location_id,
  loc.name AS location_name,
  loc.building,
  loc.floor,
  COUNT(c.id) AS total_collections
FROM `locations` loc
LEFT JOIN `collections` c ON loc.id = c.location_id
GROUP BY loc.id, loc.name, loc.building, loc.floor;
