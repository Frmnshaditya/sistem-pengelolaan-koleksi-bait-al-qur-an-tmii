export type RoleType = 'admin' | 'kurator' | 'inventaris' | 'pengunjung' | 'guest';
export type UserRole = RoleType;
export type ActivityAction = string;

export interface User {
  id: number;
  name: string;
  email: string;
  role: RoleType;
  role_title: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  last_login_at?: string;
}

export interface Category {
  id: number;
  name: string;
  code: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface CollectionType {
  id: number;
  category_id: number;
  category_name?: string;
  name: string;
  code?: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface Condition {
  id: number;
  name: string;
  code?: string;
  badge_color: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface Location {
  id: number;
  name: string;
  building: string;
  room?: string;
  floor?: string;
  description: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AcquisitionSource {
  id: number;
  name: string;
  type?: 'hibah' | 'pembelian' | 'wakaf' | 'titipan' | 'lainnya' | string;
  contact_person?: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface CollectionImage {
  id: string;
  url: string;
  thumbnail_url?: string;
  caption?: string;
  is_primary: boolean;
  file_name: string;
  file_size?: number; // bytes
  mime_type?: string;
  uploaded_at: string;
}

export type CollectionStatus = 'dipamerkan' | 'disimpan' | 'restorasi' | 'dipinjam';

export interface Collection {
  id: number;
  inventory_code: string; // e.g. BQ-MS-2024-001
  name: string;
  category_id: number;
  category_name?: string;
  collection_type_id: number;
  collection_type_name?: string;
  description: string;
  origin_region: string; // Asal/Daerah
  period_year: string; // Periode / Abad / Tahun
  material: string; // Bahan / Material
  dimensions: string; // Dimensi (P x L x T cm)
  condition_id: number;
  condition_name?: string;
  condition_badge_color?: string;
  location_id: number;
  location_name?: string;
  historical_significance: string; // Nilai historis/keterangan penting
  acquisition_date: string; // Tanggal perolehan
  acquisition_source_id: number;
  acquisition_source_name?: string;
  status: CollectionStatus;
  additional_notes?: string;
  images: CollectionImage[];
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface ActivityLog {
  id: string;
  user_id: number;
  user_name: string;
  user_role?: string;
  action: string;
  object_type: string;
  object_id?: string | number;
  object_title?: string;
  ip_address?: string;
  timestamp: string;
  details: string;
}

export interface CollectionFilterParams {
  search?: string;
  category_id?: number | 'all';
  collection_type_id?: number | 'all';
  condition_id?: number | 'all';
  location_id?: number | 'all';
  status?: CollectionStatus | 'all';
  origin_region?: string;
  period_year?: string;
  date_start?: string;
  date_end?: string;
  sortBy?: 'name' | 'inventory_code' | 'created_at' | 'period_year' | 'acquisition_date';
  sortOrder?: 'asc' | 'desc';
}
