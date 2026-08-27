import React, { useState } from 'react';
import {
  FileCode,
  Database,
  Layers,
  Terminal,
  Copy,
  Check,
  Server,
  Shield,
  Code2,
  FolderTree,
  Cpu,
  BookOpen
} from 'lucide-react';

export const SystemArchitectureDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'erd' | 'sql' | 'laravel' | 'security' | 'deploy'>('erd');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sqlDdlScript = `-- ==========================================================
-- SISTEM INFORMASI MANAJEMEN DATA KOLEKSI
-- MUSEUM BAIT AL-QUR'AN TMII BERBASIS WEB
-- Basis Data Resmi: museum_bait_alquran
-- Target DBMS: MySQL 8.0+ / MariaDB 10.4+ / PostgreSQL kompatibel
-- Charset: utf8mb4 / utf8mb4_unicode_ci
-- Engine: InnoDB
-- ==========================================================

CREATE DATABASE IF NOT EXISTS \`museum_bait_alquran\`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE \`museum_bait_alquran\`;

-- 1. TABEL ROLES (Hak Akses Pengguna)
CREATE TABLE IF NOT EXISTS \`roles\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(50) NOT NULL UNIQUE,
  \`slug\` VARCHAR(50) NOT NULL UNIQUE,
  \`description\` VARCHAR(255) NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. TABEL USERS (Petugas & Pengelola Museum)
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`role_id\` INT UNSIGNED NOT NULL,
  \`name\` VARCHAR(100) NOT NULL,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`phone\` VARCHAR(20) NULL,
  \`avatar_url\` VARCHAR(255) NULL,
  \`status\` ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
  \`last_login_at\` TIMESTAMP NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`role_id\`) REFERENCES \`roles\` (\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 3. TABEL CATEGORIES (Klasifikasi Utama Koleksi)
CREATE TABLE IF NOT EXISTS \`categories\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`slug\` VARCHAR(100) NOT NULL UNIQUE,
  \`description\` TEXT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. TABEL COLLECTION_TYPES (Sub-Jenis Koleksi)
CREATE TABLE IF NOT EXISTS \`collection_types\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`category_id\` INT UNSIGNED NOT NULL,
  \`name\` VARCHAR(100) NOT NULL,
  \`slug\` VARCHAR(100) NOT NULL,
  \`description\` TEXT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`category_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. TABEL CONDITIONS (Status Kondisi Fisik)
CREATE TABLE IF NOT EXISTS \`conditions\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(50) NOT NULL UNIQUE,
  \`badge_color\` VARCHAR(20) NOT NULL DEFAULT '#16a34a',
  \`description\` TEXT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. TABEL LOCATIONS (Lokasi Penyimpanan / Galeri Pamer)
CREATE TABLE IF NOT EXISTS \`locations\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`building\` VARCHAR(100) NOT NULL DEFAULT 'Gedung Bait Al-Qur\'an TMII',
  \`room\` VARCHAR(100) NULL,
  \`floor\` VARCHAR(50) NULL,
  \`description\` TEXT NULL,
  \`is_active\` BOOLEAN DEFAULT TRUE,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 7. TABEL ACQUISITION_SOURCES (Sumber Perolehan Koleksi)
CREATE TABLE IF NOT EXISTS \`acquisition_sources\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL UNIQUE,
  \`type\` VARCHAR(50) DEFAULT 'hibah',
  \`description\` TEXT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 8. TABEL COLLECTIONS (Entitas Inti Data Koleksi Museum)
CREATE TABLE IF NOT EXISTS \`collections\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`inventory_code\` VARCHAR(50) NOT NULL UNIQUE,
  \`name\` VARCHAR(255) NOT NULL,
  \`category_id\` INT UNSIGNED NOT NULL,
  \`collection_type_id\` INT UNSIGNED NOT NULL,
  \`condition_id\` INT UNSIGNED NOT NULL,
  \`location_id\` INT UNSIGNED NOT NULL,
  \`acquisition_source_id\` INT UNSIGNED NOT NULL,
  \`origin_region\` VARCHAR(100) NULL,
  \`period_year\` VARCHAR(100) NULL,
  \`material\` VARCHAR(150) NULL,
  \`dimensions\` VARCHAR(100) NULL,
  \`description\` TEXT NULL,
  \`historical_significance\` TEXT NULL,
  \`acquisition_date\` DATE NULL,
  \`status\` ENUM('dipamerkan', 'disimpan', 'restorasi', 'dipinjam') DEFAULT 'dipamerkan',
  \`created_by\` BIGINT UNSIGNED NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`category_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE RESTRICT,
  FOREIGN KEY (\`collection_type_id\`) REFERENCES \`collection_types\` (\`id\`) ON DELETE RESTRICT,
  FOREIGN KEY (\`condition_id\`) REFERENCES \`conditions\` (\`id\`) ON DELETE RESTRICT,
  FOREIGN KEY (\`location_id\`) REFERENCES \`locations\` (\`id\`) ON DELETE RESTRICT,
  FOREIGN KEY (\`acquisition_source_id\`) REFERENCES \`acquisition_sources\` (\`id\`) ON DELETE RESTRICT,
  FOREIGN KEY (\`created_by\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL,
  INDEX \`idx_inventory_code\` (\`inventory_code\`),
  INDEX \`idx_status\` (\`status\`)
) ENGINE=InnoDB;

-- 9. TABEL COLLECTION_IMAGES (Foto & Dokumentasi Visual)
CREATE TABLE IF NOT EXISTS \`collection_images\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`collection_id\` BIGINT UNSIGNED NOT NULL,
  \`image_path\` VARCHAR(255) NOT NULL,
  \`caption\` VARCHAR(255) NULL,
  \`is_primary\` BOOLEAN DEFAULT FALSE,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`collection_id\`) REFERENCES \`collections\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. TABEL ACTIVITY_LOGS (Audit Trail Sistem)
CREATE TABLE IF NOT EXISTS \`activity_logs\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` BIGINT UNSIGNED NULL,
  \`action\` VARCHAR(50) NOT NULL,
  \`table_name\` VARCHAR(50) NOT NULL,
  \`record_id\` BIGINT UNSIGNED NULL,
  \`description\` TEXT NULL,
  \`ip_address\` VARCHAR(45) NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB;`;

  const laravelModelCode = `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Collection extends Model
{
    use HasFactory;

    protected $table = 'collections';

    protected $fillable = [
        'inventory_code',
        'name',
        'category_id',
        'collection_type_id',
        'description',
        'origin_region',
        'period_year',
        'material',
        'dimensions',
        'condition_id',
        'location_id',
        'historical_significance',
        'acquisition_date',
        'acquisition_source_id',
        'status',
        'additional_notes',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'acquisition_date' => 'date',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function collectionType(): BelongsTo
    {
        return $this->belongsTo(CollectionType::class);
    }

    public function condition(): BelongsTo
    {
        return $this->belongsTo(Condition::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function acquisitionSource(): BelongsTo
    {
        return $this->belongsTo(AcquisitionSource::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(CollectionImage::class);
    }

    public function primaryImage()
    {
        return $this->hasOne(CollectionImage::class)->where('is_primary', true);
    }
}`;

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fd8a42]/20 text-[#9b4500] rounded-full text-xs font-bold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Dokumentasi Arsitektur & Rekayasa Perangkat Lunak</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#001e15]">
            Spesifikasi Sistem & Kode Sumber Laravel
          </h1>
          <p className="text-xs text-[#717974] mt-0.5">
            Panduan lengkap perancangan basis data relasional (ERD), skrip SQL DDL, Eloquent Model, Controller, Keamanan, dan Deployment
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#e2e3e0] pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('erd')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'erd'
              ? 'bg-[#001e15] text-white shadow-xs'
              : 'text-[#404944] hover:bg-[#f3f4f1]'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-[#fd8a42]" />
          <span>Diagram Relasi Entitas (ERD)</span>
        </button>

        <button
          onClick={() => setActiveTab('sql')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'sql'
              ? 'bg-[#001e15] text-white shadow-xs'
              : 'text-[#404944] hover:bg-[#f3f4f1]'
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-[#fd8a42]" />
          <span>Skrip SQL DDL Lengkap</span>
        </button>

        <button
          onClick={() => setActiveTab('laravel')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'laravel'
              ? 'bg-[#001e15] text-white shadow-xs'
              : 'text-[#404944] hover:bg-[#f3f4f1]'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-[#fd8a42]" />
          <span>Struktur Arsitektur Laravel</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'security'
              ? 'bg-[#001e15] text-white shadow-xs'
              : 'text-[#404944] hover:bg-[#f3f4f1]'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-[#fd8a42]" />
          <span>Lapisan Keamanan (RBAC, CSRF, XSS)</span>
        </button>

        <button
          onClick={() => setActiveTab('deploy')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'deploy'
              ? 'bg-[#001e15] text-white shadow-xs'
              : 'text-[#404944] hover:bg-[#f3f4f1]'
          }`}
        >
          <Server className="w-3.5 h-3.5 text-[#fd8a42]" />
          <span>Panduan Instalasi & Deploy Server</span>
        </button>
      </div>

      {/* Tab: ERD */}
      {activeTab === 'erd' && (
        <div className="bg-white rounded-2xl border border-[#e2e3e0] p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#001e15]">
                Entity Relationship Diagram (ERD) & Struktur Tabel Relasional
              </h3>
              <p className="text-xs text-[#717974]">
                Arsitektur 9 tabel ternormalisasi (3NF) dengan integritas referensial Foreign Key dan Indexing cepat.
              </p>
            </div>
            <span className="text-xs font-mono text-[#001e15] bg-[#f3f4f1] px-3 py-1 rounded-lg">
              DBMS: MySQL 8.0+ / InnoDB
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Box 1: Collections */}
            <div className="p-4 rounded-xl bg-[#001e15] text-white border border-[#003527] md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-[#fd8a42] font-mono">TABLE: collections (Utama)</span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">1:N with collection_images</span>
              </div>
              <ul className="text-xs space-y-1 font-mono text-[#a0d1bc]">
                <li><strong className="text-white">id (PK):</strong> BIGINT UNSIGNED AUTO_INCREMENT</li>
                <li><strong className="text-white">inventory_code:</strong> VARCHAR(50) UNIQUE NOT NULL</li>
                <li><strong className="text-white">name:</strong> VARCHAR(255) NOT NULL</li>
                <li><strong className="text-white">category_id (FK):</strong> INT UNSIGNED - Ref categories(id)</li>
                <li><strong className="text-white">collection_type_id (FK):</strong> INT UNSIGNED - Ref collection_types(id)</li>
                <li><strong className="text-white">condition_id (FK):</strong> INT UNSIGNED - Ref conditions(id)</li>
                <li><strong className="text-white">location_id (FK):</strong> INT UNSIGNED - Ref locations(id)</li>
                <li><strong className="text-white">acquisition_source_id (FK):</strong> INT UNSIGNED - Ref acquisition_sources(id)</li>
                <li><strong className="text-white">origin_region, period_year, material, dimensions:</strong> VARCHAR</li>
                <li><strong className="text-white">description, historical_significance:</strong> TEXT</li>
                <li><strong className="text-white">status:</strong> ENUM('dipamerkan', 'disimpan', 'restorasi', 'dipinjam')</li>
              </ul>
            </div>

            {/* Box 2: Collection Images */}
            <div className="p-4 rounded-xl bg-[#f9faf7] border border-[#e2e3e0]">
              <span className="font-bold text-xs text-[#001e15] font-mono block mb-2">TABLE: collection_images</span>
              <ul className="text-xs space-y-1 font-mono text-[#404944]">
                <li><strong>id (PK):</strong> BIGINT AUTO_INC</li>
                <li><strong>collection_id (FK):</strong> CASCADE</li>
                <li><strong>file_path:</strong> VARCHAR(255)</li>
                <li><strong>file_name:</strong> VARCHAR(150)</li>
                <li><strong>caption:</strong> VARCHAR(255)</li>
                <li><strong>is_primary:</strong> BOOLEAN</li>
              </ul>
            </div>

            {/* Box 3: Master Tables */}
            <div className="p-4 rounded-xl bg-[#f9faf7] border border-[#e2e3e0]">
              <span className="font-bold text-xs text-[#001e15] font-mono block mb-2">TABLES: Master Referensi</span>
              <ul className="text-xs space-y-2 text-[#404944]">
                <li><strong className="text-[#001e15]">categories:</strong> id, code, name, description</li>
                <li><strong className="text-[#001e15]">collection_types:</strong> id, category_id, name</li>
                <li><strong className="text-[#001e15]">conditions:</strong> id, name, badge_color, description</li>
                <li><strong className="text-[#001e15]">locations:</strong> id, name, floor, building</li>
                <li><strong className="text-[#001e15]">acquisition_sources:</strong> id, name, description</li>
              </ul>
            </div>

            {/* Box 4: Security & Audit */}
            <div className="p-4 rounded-xl bg-[#f9faf7] border border-[#e2e3e0]">
              <span className="font-bold text-xs text-[#001e15] font-mono block mb-2">TABLES: Autentikasi & Audit</span>
              <ul className="text-xs space-y-2 text-[#404944]">
                <li><strong className="text-[#001e15]">users:</strong> id, name, email, password, role, is_active</li>
                <li><strong className="text-[#001e15]">activity_logs:</strong> id, user_id, action, details, ip_address, created_at</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab: SQL Script */}
      {activeTab === 'sql' && (
        <div className="bg-white rounded-2xl border border-[#e2e3e0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#001e15]">
                Script SQL DDL (Database Definition Language) Siap Eksekusi
              </h3>
              <p className="text-xs text-[#717974]">
                Salin skrip ini ke phpMyAdmin, DBeaver, MySQL Workbench, atau jalankan via CLI MySQL.
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(sqlDdlScript, 'sql-script')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#001e15] text-white text-xs font-bold rounded-xl hover:bg-[#003527] transition-colors"
            >
              {copiedSection === 'sql-script' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#16a34a]" />
                  <span>Tersalin ke Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Skrip SQL</span>
                </>
              )}
            </button>
          </div>

          <pre className="bg-[#001e15] text-[#bcedd8] p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[500px] scrollbar-thin">
            <code>{sqlDdlScript}</code>
          </pre>
        </div>
      )}

      {/* Tab: Laravel Blueprint */}
      {activeTab === 'laravel' && (
        <div className="bg-white rounded-2xl border border-[#e2e3e0] p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#001e15]">
              Arsitektur Komponen Laravel 10 / 11
            </h3>
            <p className="text-xs text-[#717974]">
              Struktur folder standar MVC (Model-View-Controller) dengan FormRequest Validation dan Middleware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#f9faf7] rounded-xl border border-[#e2e3e0] md:col-span-1">
              <span className="font-bold text-xs text-[#001e15] block mb-2">Folder Struktur Proyek</span>
              <ul className="text-xs space-y-1 font-mono text-[#717974]">
                <li className="text-[#001e15]">📁 app/</li>
                <li className="pl-3">📁 Http/Controllers/</li>
                <li className="pl-6">📄 CollectionController.php</li>
                <li className="pl-6">📄 MasterDataController.php</li>
                <li className="pl-6">📄 ReportController.php</li>
                <li className="pl-3">📁 Http/Requests/</li>
                <li className="pl-6">📄 StoreCollectionRequest.php</li>
                <li className="pl-3">📁 Models/</li>
                <li className="pl-6">📄 Collection.php</li>
                <li className="pl-6">📄 Category.php</li>
                <li className="pl-6">📄 ActivityLog.php</li>
                <li className="text-[#001e15]">📁 database/migrations/</li>
                <li className="text-[#001e15]">📁 resources/views/</li>
                <li className="pl-3">📁 layouts/ (app.blade.php)</li>
                <li className="pl-3">📁 collections/ (index, create, edit, show)</li>
              </ul>
            </div>

            <div className="p-4 bg-[#001e15] rounded-xl border border-[#003527] md:col-span-2 text-white">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#fd8a42] font-mono">App/Models/Collection.php</span>
                <button
                  onClick={() => copyToClipboard(laravelModelCode, 'laravel-model')}
                  className="text-xs text-[#a0d1bc] hover:text-white"
                >
                  {copiedSection === 'laravel-model' ? 'Tersalin!' : 'Salin Model'}
                </button>
              </div>
              <pre className="text-xs font-mono text-[#bcedd8] overflow-x-auto max-h-[300px]">
                <code>{laravelModelCode}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Security */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl border border-[#e2e3e0] p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#001e15]">
            Arsitektur Keamanan & Proteksi Sistem Informasi
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#f9faf7] rounded-xl border border-[#e2e3e0]">
              <h4 className="text-xs font-bold text-[#001e15] mb-1.5 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#16a34a]" />
                1. Role-Based Access Control (RBAC)
              </h4>
              <p className="text-xs text-[#717974] leading-relaxed">
                Middleware <code className="text-[#001e15] font-mono bg-[#edeeeb] px-1 rounded">CheckRole</code> memeriksa sesi pengguna pada setiap route. Super Admin memiliki wewenang penuh, Kurator mengelola data naskah & deskripsi, Petugas Inventaris meregistrasi fisik benda, dan Pengunjung hanya dapat mengakses katalog publik.
              </p>
            </div>

            <div className="p-4 bg-[#f9faf7] rounded-xl border border-[#e2e3e0]">
              <h4 className="text-xs font-bold text-[#001e15] mb-1.5 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#16a34a]" />
                2. Proteksi SQL Injection & XSS
              </h4>
              <p className="text-xs text-[#717974] leading-relaxed">
                Semua query dieksekusi melalui PDO Prepared Statements milik Eloquent ORM. Output teks pada Blade template di-escape secara otomatis menggunakan kurung ganda <code className="text-[#001e15] font-mono bg-[#edeeeb] px-1 rounded">&#123;&#123; $text &#125;&#125;</code> untuk mencegah injeksi skrip berbahaya.
              </p>
            </div>

            <div className="p-4 bg-[#f9faf7] rounded-xl border border-[#e2e3e0]">
              <h4 className="text-xs font-bold text-[#001e15] mb-1.5 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#16a34a]" />
                3. Proteksi CSRF (Cross-Site Request Forgery)
              </h4>
              <p className="text-xs text-[#717974] leading-relaxed">
                Setiap formulir POST/PUT/DELETE wajib menyertakan token <code className="text-[#001e15] font-mono bg-[#edeeeb] px-1 rounded">@csrf</code> yang divalidasi oleh middleware bawaan Laravel.
              </p>
            </div>

            <div className="p-4 bg-[#f9faf7] rounded-xl border border-[#e2e3e0]">
              <h4 className="text-xs font-bold text-[#001e15] mb-1.5 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#16a34a]" />
                4. Validasi Upload File Foto Ketat
              </h4>
              <p className="text-xs text-[#717974] leading-relaxed">
                Validasi MIME type ketat (<code className="text-[#001e15] font-mono bg-[#edeeeb] px-1 rounded">image/jpeg, image/png, image/webp</code>) dan batas ukuran file maks 5MB dengan enkripsi penamaan acak pada direktori <code className="text-[#001e15] font-mono bg-[#edeeeb] px-1 rounded">storage/app/public/collections</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Deployment */}
      {activeTab === 'deploy' && (
        <div className="bg-white rounded-2xl border border-[#e2e3e0] p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#001e15]">
            Langkah Instalasi & Deployment Produksi (Server Linux / Cloud)
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#f9faf7] rounded-xl border border-[#e2e3e0]">
              <span className="font-bold text-[#001e15] block mb-1">1. Klon Repositori & Instal Dependensi:</span>
              <pre className="bg-[#001e15] text-[#bcedd8] p-2.5 rounded-lg font-mono">
                composer install --optimize-autoloader --no-dev{"\n"}
                npm install && npm run build
              </pre>
            </div>

            <div className="p-3 bg-[#f9faf7] rounded-xl border border-[#e2e3e0]">
              <span className="font-bold text-[#001e15] block mb-1">2. Konfigurasi Lingkungan (.env) & Generate Key:</span>
              <pre className="bg-[#001e15] text-[#bcedd8] p-2.5 rounded-lg font-mono">
                cp .env.example .env{"\n"}
                php artisan key:generate
              </pre>
            </div>

            <div className="p-3 bg-[#f9faf7] rounded-xl border border-[#e2e3e0]">
              <span className="font-bold text-[#001e15] block mb-1">3. Migrasi Basis Data & Seeding Data Awal:</span>
              <pre className="bg-[#001e15] text-[#bcedd8] p-2.5 rounded-lg font-mono">
                php artisan migrate --seed{"\n"}
                php artisan storage:link
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
