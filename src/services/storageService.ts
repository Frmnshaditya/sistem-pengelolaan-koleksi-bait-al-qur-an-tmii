import {
  Category,
  Collection,
  CollectionType,
  Condition,
  Location,
  AcquisitionSource,
  User,
  ActivityLog,
  CollectionFilterParams,
  RoleType
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_COLLECTION_TYPES,
  INITIAL_CONDITIONS,
  INITIAL_LOCATIONS,
  INITIAL_ACQUISITION_SOURCES,
  INITIAL_USERS,
  INITIAL_ACTIVITY_LOGS
} from '../data/initialMasterData';
import { INITIAL_COLLECTIONS } from '../data/realCollections';

const STORAGE_KEYS = {
  COLLECTIONS: 'museum_bait_alquran_collections_v2',
  CATEGORIES: 'museum_bait_alquran_categories_v2',
  COLLECTION_TYPES: 'museum_bait_alquran_types_v2',
  CONDITIONS: 'museum_bait_alquran_conditions_v2',
  LOCATIONS: 'museum_bait_alquran_locations_v2',
  ACQUISITION_SOURCES: 'museum_bait_alquran_sources_v2',
  USERS: 'museum_bait_alquran_users_v2',
  ACTIVITY_LOGS: 'museum_bait_alquran_logs_v2',
  CURRENT_USER: 'museum_bait_alquran_current_user_v2'
};

function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

class StorageService {
  // Collections
  getCollections(): Collection[] {
    return getStoredItem<Collection[]>(STORAGE_KEYS.COLLECTIONS, INITIAL_COLLECTIONS);
  }

  getCollectionById(id: number): Collection | undefined {
    const list = this.getCollections();
    return list.find(c => c.id === id);
  }

  saveCollection(data: Partial<Collection>, currentUser?: User | null): Collection {
    const list = this.getCollections();
    const now = new Date().toISOString();
    const categories = this.getCategories();
    const types = this.getCollectionTypes();
    const conditions = this.getConditions();
    const locations = this.getLocations();
    const sources = this.getAcquisitionSources();

    const category = categories.find(c => c.id === data.category_id);
    const type = types.find(t => t.id === data.collection_type_id);
    const condition = conditions.find(c => c.id === data.condition_id);
    const location = locations.find(l => l.id === data.location_id);
    const source = sources.find(s => s.id === data.acquisition_source_id);

    if (data.id) {
      // Update
      const index = list.findIndex(c => c.id === data.id);
      if (index === -1) throw new Error("Koleksi tidak ditemukan dalam database.");
      
      const updated: Collection = {
        ...list[index],
        ...data,
        id: data.id,
        inventory_code: data.inventory_code || list[index].inventory_code,
        name: data.name || list[index].name,
        category_id: data.category_id || list[index].category_id,
        category_name: category?.name || list[index].category_name,
        collection_type_id: data.collection_type_id || list[index].collection_type_id,
        collection_type_name: type?.name || list[index].collection_type_name,
        condition_id: data.condition_id || list[index].condition_id,
        condition_name: condition?.name || list[index].condition_name,
        condition_badge_color: condition?.badge_color || list[index].condition_badge_color,
        location_id: data.location_id || list[index].location_id,
        location_name: location?.name || list[index].location_name,
        acquisition_source_id: data.acquisition_source_id || list[index].acquisition_source_id,
        acquisition_source_name: source?.name || list[index].acquisition_source_name,
        description: data.description !== undefined ? data.description : list[index].description,
        origin_region: data.origin_region || list[index].origin_region,
        period_year: data.period_year || list[index].period_year,
        material: data.material || list[index].material,
        dimensions: data.dimensions || list[index].dimensions,
        historical_significance: data.historical_significance || list[index].historical_significance,
        acquisition_date: data.acquisition_date || list[index].acquisition_date,
        status: data.status || list[index].status,
        images: data.images || list[index].images,
        updated_at: now
      };

      list[index] = updated;
      setStoredItem(STORAGE_KEYS.COLLECTIONS, list);
      
      this.logActivity({
        user: currentUser,
        action: 'UPDATE_COLLECTION',
        object_type: 'collections',
        object_id: updated.id,
        object_title: updated.name,
        details: `Memperbarui data inventaris koleksi: ${updated.inventory_code} - ${updated.name}`
      });

      return updated;
    } else {
      // Create new
      const maxId = list.reduce((max, item) => Math.max(max, item.id), 0);
      const newCollection: Collection = {
        id: maxId + 1,
        inventory_code: data.inventory_code || `BQ-MN-${new Date().getFullYear()}-${String(maxId + 1).padStart(4, '0')}`,
        name: data.name || 'Koleksi Baru Museum',
        category_id: data.category_id || 1,
        category_name: category?.name || categories[0]?.name || 'Manuskrip Al-Qur\'an',
        collection_type_id: data.collection_type_id || 1,
        collection_type_name: type?.name || types[0]?.name || 'Manuskrip Kertas Daluwang',
        description: data.description || '',
        origin_region: data.origin_region || 'Nusantara',
        period_year: data.period_year || 'Abad ke-19 M',
        material: data.material || 'Kertas Daluwang Alami',
        dimensions: data.dimensions || '30 x 20 x 5 cm',
        condition_id: data.condition_id || 1,
        condition_name: condition?.name || conditions[0]?.name || 'Baik',
        condition_badge_color: condition?.badge_color || conditions[0]?.badge_color || '#16a34a',
        location_id: data.location_id || 1,
        location_name: location?.name || locations[0]?.name || 'Ruang Pamer Utama',
        historical_significance: data.historical_significance || '',
        acquisition_date: data.acquisition_date || new Date().toISOString().split('T')[0],
        acquisition_source_id: data.acquisition_source_id || 1,
        acquisition_source_name: source?.name || sources[0]?.name || 'Hibah Tokoh Nasional',
        status: data.status || 'dipamerkan',
        additional_notes: data.additional_notes || '',
        images: data.images || [],
        created_at: now,
        updated_at: now,
        created_by: currentUser?.name || 'Administrator Sistem TMII'
      };

      list.unshift(newCollection);
      setStoredItem(STORAGE_KEYS.COLLECTIONS, list);

      this.logActivity({
        user: currentUser,
        action: 'CREATE_COLLECTION',
        object_type: 'collections',
        object_id: newCollection.id,
        object_title: newCollection.name,
        details: `Registrasi koleksi baru: ${newCollection.inventory_code} - ${newCollection.name}`
      });

      return newCollection;
    }
  }

  deleteCollection(id: number, currentUser?: User | null): boolean {
    const list = this.getCollections();
    const item = list.find(c => c.id === id);
    if (!item) return false;

    const filtered = list.filter(c => c.id !== id);
    setStoredItem(STORAGE_KEYS.COLLECTIONS, filtered);

    this.logActivity({
      user: currentUser,
      action: 'DELETE_COLLECTION',
      object_type: 'collections',
      object_id: id,
      object_title: item.name,
      details: `Menghapus data koleksi dari inventaris resmi: ${item.inventory_code} - ${item.name}`
    });

    return true;
  }

  // Filter & Query Collections
  queryCollections(params: CollectionFilterParams): { data: Collection[]; total: number } {
    let list = this.getCollections();

    if (params.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase().trim();
      list = list.filter(item => 
        item.name.toLowerCase().includes(q) ||
        item.inventory_code.toLowerCase().includes(q) ||
        item.origin_region.toLowerCase().includes(q) ||
        item.material.toLowerCase().includes(q) ||
        item.period_year.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.historical_significance && item.historical_significance.toLowerCase().includes(q))
      );
    }

    if (params.category_id && params.category_id !== 'all') {
      list = list.filter(item => item.category_id === Number(params.category_id));
    }

    if (params.collection_type_id && params.collection_type_id !== 'all') {
      list = list.filter(item => item.collection_type_id === Number(params.collection_type_id));
    }

    if (params.condition_id && params.condition_id !== 'all') {
      list = list.filter(item => item.condition_id === Number(params.condition_id));
    }

    if (params.location_id && params.location_id !== 'all') {
      list = list.filter(item => item.location_id === Number(params.location_id));
    }

    if (params.status && params.status !== 'all') {
      list = list.filter(item => item.status === params.status);
    }

    if (params.origin_region && params.origin_region.trim() !== '') {
      const reg = params.origin_region.toLowerCase().trim();
      list = list.filter(item => item.origin_region.toLowerCase().includes(reg));
    }

    if (params.period_year && params.period_year.trim() !== '') {
      const p = params.period_year.toLowerCase().trim();
      list = list.filter(item => item.period_year.toLowerCase().includes(p));
    }

    if (params.date_start) {
      list = list.filter(item => item.acquisition_date >= params.date_start!);
    }
    if (params.date_end) {
      list = list.filter(item => item.acquisition_date <= params.date_end!);
    }

    // Sort
    const sortBy = params.sortBy || 'created_at';
    const sortOrder = params.sortOrder || 'desc';

    list.sort((a, b) => {
      let valA: string | number = a[sortBy] || '';
      let valB: string | number = b[sortBy] || '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return {
      data: list,
      total: list.length
    };
  }

  // Categories CRUD
  getCategories(): Category[] {
    return getStoredItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  saveCategory(data: Partial<Category> & { name: string; code: string; description: string }, currentUser?: User | null): Category {
    const list = this.getCategories();
    const now = new Date().toISOString();

    if (data.id) {
      const idx = list.findIndex(c => c.id === data.id);
      if (idx === -1) throw new Error("Kategori tidak ditemukan");
      list[idx] = { ...list[idx], ...data, updated_at: now };
      setStoredItem(STORAGE_KEYS.CATEGORIES, list);
      this.logActivity({
        user: currentUser,
        action: 'UPDATE_CATEGORY',
        object_type: 'categories',
        object_id: data.id,
        object_title: data.name,
        details: `Memperbarui data kategori master: ${data.name}`
      });
      return list[idx];
    } else {
      const maxId = list.reduce((max, i) => Math.max(max, i.id), 0);
      const newCat: Category = {
        id: maxId + 1,
        name: data.name,
        code: data.code,
        description: data.description,
        created_at: now,
        updated_at: now
      };
      list.push(newCat);
      setStoredItem(STORAGE_KEYS.CATEGORIES, list);
      this.logActivity({
        user: currentUser,
        action: 'CREATE_CATEGORY',
        object_type: 'categories',
        object_id: newCat.id,
        object_title: newCat.name,
        details: `Menambahkan kategori baru: ${newCat.name}`
      });
      return newCat;
    }
  }

  deleteCategory(id: number, currentUser?: User | null): boolean {
    const collections = this.getCollections();
    const inUse = collections.some(c => c.category_id === id);
    if (inUse) {
      throw new Error("Kategori tidak dapat dihapus karena masih digunakan oleh beberapa koleksi aktif.");
    }
    const list = this.getCategories();
    const item = list.find(c => c.id === id);
    if (!item) return false;
    const filtered = list.filter(c => c.id !== id);
    setStoredItem(STORAGE_KEYS.CATEGORIES, filtered);
    this.logActivity({
      user: currentUser,
      action: 'DELETE_CATEGORY',
      object_type: 'categories',
      object_id: id,
      object_title: item.name,
      details: `Menghapus kategori master: ${item.name}`
    });
    return true;
  }

  // Collection Types CRUD
  getCollectionTypes(): CollectionType[] {
    return getStoredItem<CollectionType[]>(STORAGE_KEYS.COLLECTION_TYPES, INITIAL_COLLECTION_TYPES);
  }

  saveCollectionType(data: Partial<CollectionType> & { category_id: number; name: string; code: string; description: string }, currentUser?: User | null): CollectionType {
    const list = this.getCollectionTypes();
    const categories = this.getCategories();
    const cat = categories.find(c => c.id === data.category_id);
    const now = new Date().toISOString();

    if (data.id) {
      const idx = list.findIndex(c => c.id === data.id);
      if (idx === -1) throw new Error("Jenis koleksi tidak ditemukan");
      list[idx] = { ...list[idx], ...data, category_name: cat?.name, updated_at: now };
      setStoredItem(STORAGE_KEYS.COLLECTION_TYPES, list);
      this.logActivity({
        user: currentUser,
        action: 'UPDATE_TYPE',
        object_type: 'collection_types',
        object_id: data.id,
        object_title: data.name,
        details: `Memperbarui jenis koleksi: ${data.name}`
      });
      return list[idx];
    } else {
      const maxId = list.reduce((max, i) => Math.max(max, i.id), 0);
      const newType: CollectionType = {
        id: maxId + 1,
        category_id: data.category_id,
        category_name: cat?.name,
        name: data.name,
        code: data.code,
        description: data.description,
        created_at: now,
        updated_at: now
      };
      list.push(newType);
      setStoredItem(STORAGE_KEYS.COLLECTION_TYPES, list);
      this.logActivity({
        user: currentUser,
        action: 'CREATE_TYPE',
        object_type: 'collection_types',
        object_id: newType.id,
        object_title: newType.name,
        details: `Menambahkan jenis koleksi baru: ${newType.name}`
      });
      return newType;
    }
  }

  deleteCollectionType(id: number, currentUser?: User | null): boolean {
    const collections = this.getCollections();
    const inUse = collections.some(c => c.collection_type_id === id);
    if (inUse) {
      throw new Error("Jenis koleksi tidak dapat dihapus karena masih digunakan oleh koleksi.");
    }
    const list = this.getCollectionTypes();
    const item = list.find(c => c.id === id);
    if (!item) return false;
    const filtered = list.filter(c => c.id !== id);
    setStoredItem(STORAGE_KEYS.COLLECTION_TYPES, filtered);
    this.logActivity({
      user: currentUser,
      action: 'DELETE_TYPE',
      object_type: 'collection_types',
      object_id: id,
      object_title: item.name,
      details: `Menghapus jenis koleksi: ${item.name}`
    });
    return true;
  }

  // Conditions CRUD
  getConditions(): Condition[] {
    return getStoredItem<Condition[]>(STORAGE_KEYS.CONDITIONS, INITIAL_CONDITIONS);
  }

  saveCondition(data: Partial<Condition> & { name: string; code: string; badge_color: string; description: string }, currentUser?: User | null): Condition {
    const list = this.getConditions();
    const now = new Date().toISOString();
    if (data.id) {
      const idx = list.findIndex(c => c.id === data.id);
      if (idx === -1) throw new Error("Kondisi tidak ditemukan");
      list[idx] = { ...list[idx], ...data, updated_at: now };
      setStoredItem(STORAGE_KEYS.CONDITIONS, list);
      return list[idx];
    } else {
      const maxId = list.reduce((max, i) => Math.max(max, i.id), 0);
      const newCond: Condition = {
        id: maxId + 1,
        name: data.name,
        code: data.code,
        badge_color: data.badge_color || '#2563eb',
        description: data.description,
        created_at: now,
        updated_at: now
      };
      list.push(newCond);
      setStoredItem(STORAGE_KEYS.CONDITIONS, list);
      return newCond;
    }
  }

  // Locations CRUD
  getLocations(): Location[] {
    return getStoredItem<Location[]>(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
  }

  saveLocation(data: Partial<Location> & { name: string; building: string; room: string; floor?: string; description: string }, currentUser?: User | null): Location {
    const list = this.getLocations();
    const now = new Date().toISOString();
    if (data.id) {
      const idx = list.findIndex(l => l.id === data.id);
      if (idx === -1) throw new Error("Lokasi tidak ditemukan");
      list[idx] = { ...list[idx], ...data, updated_at: now };
      setStoredItem(STORAGE_KEYS.LOCATIONS, list);
      return list[idx];
    } else {
      const maxId = list.reduce((max, i) => Math.max(max, i.id), 0);
      const newLoc: Location = {
        id: maxId + 1,
        name: data.name,
        building: data.building,
        room: data.room,
        floor: data.floor || 'Lantai 1',
        description: data.description,
        created_at: now,
        updated_at: now
      };
      list.push(newLoc);
      setStoredItem(STORAGE_KEYS.LOCATIONS, list);
      return newLoc;
    }
  }

  // Acquisition Sources CRUD
  getAcquisitionSources(): AcquisitionSource[] {
    return getStoredItem<AcquisitionSource[]>(STORAGE_KEYS.ACQUISITION_SOURCES, INITIAL_ACQUISITION_SOURCES);
  }

  saveAcquisitionSource(data: Partial<AcquisitionSource> & { name: string; type: any; contact_person?: string; description: string }): AcquisitionSource {
    const list = this.getAcquisitionSources();
    const now = new Date().toISOString();
    if (data.id) {
      const idx = list.findIndex(s => s.id === data.id);
      if (idx === -1) throw new Error("Sumber perolehan tidak ditemukan");
      list[idx] = { ...list[idx], ...data, updated_at: now };
      setStoredItem(STORAGE_KEYS.ACQUISITION_SOURCES, list);
      return list[idx];
    } else {
      const maxId = list.reduce((max, i) => Math.max(max, i.id), 0);
      const newSource: AcquisitionSource = {
        id: maxId + 1,
        name: data.name,
        type: data.type || 'hibah',
        contact_person: data.contact_person || '',
        description: data.description,
        created_at: now,
        updated_at: now
      };
      list.push(newSource);
      setStoredItem(STORAGE_KEYS.ACQUISITION_SOURCES, list);
      return newSource;
    }
  }

  // Users Management
  getUsers(): User[] {
    return getStoredItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  saveUser(data: Partial<User> & { name: string; email: string; role: RoleType; role_title: string; is_active?: boolean }, currentUser?: User | null): User {
    const list = this.getUsers();
    const now = new Date().toISOString();

    if (data.id) {
      const idx = list.findIndex(u => u.id === data.id);
      if (idx === -1) throw new Error("Pengguna tidak ditemukan");
      list[idx] = { ...list[idx], ...data, updated_at: now };
      setStoredItem(STORAGE_KEYS.USERS, list);
      this.logActivity({
        user: currentUser,
        action: 'UPDATE_USER',
        object_type: 'users',
        object_id: data.id,
        object_title: data.name,
        details: `Memperbarui akun pengguna: ${data.name} (${data.role})`
      });
      return list[idx];
    } else {
      const maxId = list.reduce((max, i) => Math.max(max, i.id), 0);
      const newUser: User = {
        id: maxId + 1,
        name: data.name,
        email: data.email,
        role: data.role,
        role_title: data.role_title,
        avatar_url: data.avatar_url || `https://images.unsplash.com/photo-${1500000000000 + (maxId * 12345)}?w=150&auto=format&fit=crop&q=80`,
        is_active: data.is_active !== undefined ? data.is_active : true,
        created_at: now,
        updated_at: now
      };
      list.push(newUser);
      setStoredItem(STORAGE_KEYS.USERS, list);
      this.logActivity({
        user: currentUser,
        action: 'CREATE_USER',
        object_type: 'users',
        object_id: newUser.id,
        object_title: newUser.name,
        details: `Menambahkan akun pengelola baru: ${newUser.name} (${newUser.email})`
      });
      return newUser;
    }
  }

  toggleUserStatus(id: number, currentUser?: User | null): User {
    const list = this.getUsers();
    const idx = list.findIndex(u => u.id === id);
    if (idx === -1) throw new Error("Pengguna tidak ditemukan");
    list[idx].is_active = !list[idx].is_active;
    list[idx].updated_at = new Date().toISOString();
    setStoredItem(STORAGE_KEYS.USERS, list);
    this.logActivity({
      user: currentUser,
      action: 'TOGGLE_USER_STATUS',
      object_type: 'users',
      object_id: id,
      object_title: list[idx].name,
      details: `Mengubah status aktif pengguna ${list[idx].name} menjadi: ${list[idx].is_active ? 'Aktif' : 'Non-Aktif'}`
    });
    return list[idx];
  }

  // Activity Logs
  getActivityLogs(): ActivityLog[] {
    return getStoredItem<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);
  }

  logActivity(params: {
    user?: User | null;
    action: string;
    object_type: string;
    object_id?: string | number;
    object_title?: string;
    details?: string;
  }): void {
    const logs = this.getActivityLogs();
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user_id: params.user?.id || 0,
      user_name: params.user?.name || 'Sistem / Administrator',
      user_role: params.user?.role_title || (params.user?.role ? params.user.role.toUpperCase() : 'PENGUNJUNG'),
      action: params.action,
      object_type: params.object_type,
      object_id: params.object_id,
      object_title: params.object_title,
      ip_address: '127.0.0.1',
      timestamp: new Date().toISOString(),
      details: params.details || ''
    };
    logs.unshift(newLog);
    // Keep last 150 logs
    const trimmed = logs.slice(0, 150);
    setStoredItem(STORAGE_KEYS.ACTIVITY_LOGS, trimmed);
  }

  saveCategories(items: Category[]): void {
    setStoredItem(STORAGE_KEYS.CATEGORIES, items);
  }

  saveCollectionTypes(items: CollectionType[]): void {
    setStoredItem(STORAGE_KEYS.COLLECTION_TYPES, items);
  }

  saveConditions(items: Condition[]): void {
    setStoredItem(STORAGE_KEYS.CONDITIONS, items);
  }

  saveLocations(items: Location[]): void {
    setStoredItem(STORAGE_KEYS.LOCATIONS, items);
  }

  saveAcquisitionSources(items: AcquisitionSource[]): void {
    setStoredItem(STORAGE_KEYS.ACQUISITION_SOURCES, items);
  }

  saveUsers(items: User[]): void {
    setStoredItem(STORAGE_KEYS.USERS, items);
  }

  logout(): void {
    const user = this.getCurrentUser();
    if (user) {
      this.logActivity({
        user,
        action: 'LOGOUT',
        object_type: 'auth',
        details: `Pengguna ${user.name} berhasil keluar dari sesi sistem.`
      });
    }
    setStoredItem(STORAGE_KEYS.CURRENT_USER, null);
  }

  // Current Auth User
  getCurrentUser(): User | null {
    return getStoredItem<User | null>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  }

  setCurrentUser(user: User | null): void {
    setStoredItem(STORAGE_KEYS.CURRENT_USER, user);
    if (user) {
      this.logActivity({
        user,
        action: 'AUTH_LOGIN',
        object_type: 'auth',
        details: `Pengguna ${user.name} (${user.role_title}) berhasil login ke sistem.`
      });
    }
  }

  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.COLLECTIONS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.COLLECTION_TYPES);
    localStorage.removeItem(STORAGE_KEYS.CONDITIONS);
    localStorage.removeItem(STORAGE_KEYS.LOCATIONS);
    localStorage.removeItem(STORAGE_KEYS.ACQUISITION_SOURCES);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITY_LOGS);
    setStoredItem(STORAGE_KEYS.COLLECTIONS, INITIAL_COLLECTIONS);
    setStoredItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    setStoredItem(STORAGE_KEYS.COLLECTION_TYPES, INITIAL_COLLECTION_TYPES);
    setStoredItem(STORAGE_KEYS.CONDITIONS, INITIAL_CONDITIONS);
    setStoredItem(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
    setStoredItem(STORAGE_KEYS.ACQUISITION_SOURCES, INITIAL_ACQUISITION_SOURCES);
    setStoredItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    setStoredItem(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);
    setStoredItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  }
}

export const storageService = new StorageService();
