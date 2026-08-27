import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { PublicCatalog } from './components/public/PublicCatalog';
import { CollectionDetailModal } from './components/public/CollectionDetailModal';
import { MuseumInfoModal } from './components/public/MuseumInfoModal';
import { Dashboard } from './components/admin/Dashboard';
import { CollectionList } from './components/admin/CollectionList';
import { CollectionFormModal } from './components/admin/CollectionFormModal';
import { MasterDataManager } from './components/admin/MasterDataManager';
import { UserManager } from './components/admin/UserManager';
import { ActivityLogViewer } from './components/admin/ActivityLogViewer';
import { ReportGenerator } from './components/admin/ReportGenerator';
import { SystemArchitectureDocs } from './components/admin/SystemArchitectureDocs';
import { LoginModal } from './components/auth/LoginModal';
import { storageService } from './services/storageService';
import {
  Collection,
  Category,
  CollectionType,
  Condition,
  Location,
  AcquisitionSource,
  User,
  ActivityLog
} from './types';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  // State Initialization
  const [collections, setCollections] = useState<Collection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collectionTypes, setCollectionTypes] = useState<CollectionType[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [acquisitionSources, setAcquisitionSources] = useState<AcquisitionSource[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Navigation & Search
  const [activeTab, setActiveTab] = useState<string>('katalog');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Modals
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isMuseumInfoOpen, setIsMuseumInfoOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Toast Notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load initial data from storageService on mount
  useEffect(() => {
    refreshAllData();
  }, []);

  const refreshAllData = () => {
    setCollections(storageService.getCollections());
    setCategories(storageService.getCategories());
    setCollectionTypes(storageService.getCollectionTypes());
    setConditions(storageService.getConditions());
    setLocations(storageService.getLocations());
    setAcquisitionSources(storageService.getAcquisitionSources());
    setUsers(storageService.getUsers());
    setCurrentUser(storageService.getCurrentUser());
    setActivityLogs(storageService.getActivityLogs());
  };

  // Handlers for Collection CRUD
  const handleSaveCollection = (data: Partial<Collection>) => {
    const isEdit = !!data.id;
    const saved = storageService.saveCollection(data);
    refreshAllData();
    showToast(
      isEdit ? `Data koleksi "${saved.name}" berhasil diperbarui.` : `Koleksi baru "${saved.name}" berhasil didaftarkan.`,
      'success'
    );
  };

  const handleDeleteCollection = (id: number) => {
    const deleted = storageService.deleteCollection(id);
    if (deleted) {
      refreshAllData();
      showToast('Data koleksi berhasil dihapus dari inventaris.', 'info');
    }
  };

  const handleOpenEditCollection = (col: Collection) => {
    setEditingCollection(col);
    setIsFormModalOpen(true);
  };

  const handleOpenAddCollection = () => {
    setEditingCollection(null);
    setIsFormModalOpen(true);
  };

  const handleSelectCollection = (col: Collection) => {
    setSelectedCollection(col);
    setIsDetailModalOpen(true);
  };

  // Handlers for Auth
  const handleLogin = (user: User) => {
    storageService.setCurrentUser(user);
    setCurrentUser(user);
    refreshAllData();
    showToast(`Selamat datang kembali, ${user.name} (${user.role_title}).`, 'success');
  };

  const handleLogout = () => {
    storageService.logout();
    setCurrentUser(null);
    refreshAllData();
    setActiveTab('katalog');
    showToast('Anda telah beralih ke mode Pengunjung Publik.', 'info');
  };

  // Update Master Data state helpers
  const handleUpdateCategories = (items: Category[]) => {
    storageService.saveCategories(items);
    setCategories(items);
    refreshAllData();
    showToast('Kategori koleksi berhasil diperbarui.');
  };

  const handleUpdateCollectionTypes = (items: CollectionType[]) => {
    storageService.saveCollectionTypes(items);
    setCollectionTypes(items);
    refreshAllData();
    showToast('Jenis koleksi berhasil diperbarui.');
  };

  const handleUpdateConditions = (items: Condition[]) => {
    storageService.saveConditions(items);
    setConditions(items);
    refreshAllData();
    showToast('Parameter kondisi berhasil diperbarui.');
  };

  const handleUpdateLocations = (items: Location[]) => {
    storageService.saveLocations(items);
    setLocations(items);
    refreshAllData();
    showToast('Daftar lokasi ruang pamer berhasil diperbarui.');
  };

  const handleUpdateAcquisitionSources = (items: AcquisitionSource[]) => {
    storageService.saveAcquisitionSources(items);
    setAcquisitionSources(items);
    refreshAllData();
    showToast('Sumber perolehan berhasil diperbarui.');
  };

  const handleUpdateUsers = (items: User[]) => {
    storageService.saveUsers(items);
    setUsers(items);
    refreshAllData();
    showToast('Data akun pengguna berhasil diperbarui.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9faf7] text-[#1a1c1b] font-sans antialiased selection:bg-[#fd8a42] selection:text-[#001e15]">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-60 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold ${
              toastMessage.type === 'success'
                ? 'bg-[#001e15] text-[#bcedd8] border-[#003527]'
                : toastMessage.type === 'error'
                ? 'bg-[#ba1a1a] text-white border-red-800'
                : 'bg-[#064e3b] text-white border-[#003527]'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#fd8a42] shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-white shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onSwitchUser={handleLogin}
        globalSearchQuery={globalSearchQuery}
        setGlobalSearchQuery={setGlobalSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        availableUsers={users}
        onOpenMuseumInfo={() => setIsMuseumInfoOpen(true)}
      />

      {/* Main Layout Container with Fixed Sidebar */}
      <div className="flex-1 flex pt-20">
        
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'tambah-koleksi') {
              handleOpenAddCollection();
            } else {
              setActiveTab(tab);
            }
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentUser={currentUser}
          onOpenLogin={() => setIsLoginModalOpen(true)}
        />

        {/* Content Area */}
        <main className="flex-1 lg:pl-72 flex flex-col min-w-0">
          <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 py-6">
            
            {/* Tab Routing */}
            {activeTab === 'katalog' && (
              <PublicCatalog
                collections={collections}
                categories={categories}
                conditions={conditions}
                locations={locations}
                onSelectCollection={handleSelectCollection}
                onOpenMuseumInfo={() => setIsMuseumInfoOpen(true)}
                globalSearchQuery={globalSearchQuery}
              />
            )}

            {activeTab === 'dashboard' && (
              <Dashboard
                collections={collections}
                categories={categories}
                conditions={conditions}
                locations={locations}
                activityLogs={activityLogs}
                onNavigate={setActiveTab}
                onSelectCollection={handleSelectCollection}
                onOpenAddModal={handleOpenAddCollection}
              />
            )}

            {activeTab === 'koleksi' && (
              <CollectionList
                collections={collections}
                categories={categories}
                collectionTypes={collectionTypes}
                conditions={conditions}
                locations={locations}
                currentUser={currentUser}
                onSelectCollection={handleSelectCollection}
                onEditCollection={handleOpenEditCollection}
                onDeleteCollection={handleDeleteCollection}
                onOpenAddModal={handleOpenAddCollection}
              />
            )}

            {activeTab === 'master-data' && (
              <MasterDataManager
                categories={categories}
                collectionTypes={collectionTypes}
                conditions={conditions}
                locations={locations}
                acquisitionSources={acquisitionSources}
                collections={collections}
                onUpdateCategories={handleUpdateCategories}
                onUpdateCollectionTypes={handleUpdateCollectionTypes}
                onUpdateConditions={handleUpdateConditions}
                onUpdateLocations={handleUpdateLocations}
                onUpdateAcquisitionSources={handleUpdateAcquisitionSources}
              />
            )}

            {activeTab === 'pengguna' && (
              <UserManager
                users={users}
                currentUser={currentUser}
                onUpdateUsers={handleUpdateUsers}
                onSwitchUser={handleLogin}
              />
            )}

            {activeTab === 'log-aktivitas' && (
              <ActivityLogViewer
                activityLogs={activityLogs}
              />
            )}

            {activeTab === 'laporan' && (
              <ReportGenerator
                collections={collections}
                categories={categories}
                conditions={conditions}
                locations={locations}
                currentUser={currentUser}
              />
            )}

            {activeTab === 'arsitektur-sistem' && (
              <SystemArchitectureDocs />
            )}

          </div>

          {/* Footer */}
          <Footer />
        </main>

      </div>

      {/* Collection Detail Modal */}
      <CollectionDetailModal
        collection={selectedCollection}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        isStaff={!!currentUser && ['admin', 'kurator', 'inventaris'].includes(currentUser.role)}
        onEdit={(col) => {
          setIsDetailModalOpen(false);
          handleOpenEditCollection(col);
        }}
      />

      {/* Collection Add/Edit Form Modal */}
      <CollectionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveCollection}
        initialData={editingCollection}
        categories={categories}
        collectionTypes={collectionTypes}
        conditions={conditions}
        locations={locations}
        acquisitionSources={acquisitionSources}
      />

      {/* Museum TMII Info Modal */}
      <MuseumInfoModal
        isOpen={isMuseumInfoOpen}
        onClose={() => setIsMuseumInfoOpen(false)}
      />

      {/* Login / Switch Account Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        availableUsers={users}
      />

    </div>
  );
}
