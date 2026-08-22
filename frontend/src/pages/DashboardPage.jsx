import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import UserMenu from '../components/UserMenu';
import FileUploadModal from '../components/FileUploadModal';
import {
  FileText,
  Plus,
  UploadCloud,
  Search,
  Folder,
  Users,
  Clock,
  ChevronRight,
  User,
  Shield,
  Loader2,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'owned', 'shared'
  const [searchQuery, setSearchQuery] = useState('');
  const [ownedDocs, setOwnedDocs] = useState([]);
  const [sharedDocs, setSharedDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingDoc, setCreatingDoc] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/documents');
      setOwnedDocs(res.data.ownedDocuments || []);
      setSharedDocs(res.data.sharedDocuments || []);
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewDocument = async () => {
    setCreatingDoc(true);
    try {
      const res = await api.post('/documents', {
        title: 'Untitled document',
        content: '<p></p>',
      });
      showSuccess('New document created');
      navigate(`/documents/${res.data.document._id}`);
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to create new document');
    } finally {
      setCreatingDoc(false);
    }
  };

  const handleUploadSuccess = (createdDoc) => {
    fetchDocuments();
    navigate(`/documents/${createdDoc._id}`);
  };

  // Filter documents by search query
  const filteredOwned = ownedDocs.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredShared = sharedDocs.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900/90 border-b md:border-b-0 md:border-r border-slate-800 p-4 flex flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 py-3 mb-4 border-b border-slate-800/80">
          <div className="p-2 bg-blue-600/10 text-blue-500 rounded-xl border border-blue-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight tracking-wide text-white">AJAIA DOCS</h2>
            <p className="text-[11px] text-slate-400">Team Workspace</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mb-6">
          <button
            onClick={handleCreateNewDocument}
            disabled={creatingDoc}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {creatingDoc ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>New document</span>
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700/80 transition-colors flex items-center justify-center gap-2"
          >
            <UploadCloud className="w-4 h-4 text-blue-400" />
            <span>Import .txt / .md</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="space-y-1 flex-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>All Documents</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {ownedDocs.length + sharedDocs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('owned')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'owned'
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Documents</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {ownedDocs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('shared')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'shared'
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Shared with me</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {sharedDocs.length}
            </span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Welcome back, {user?.name || 'User'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage your team documents and shared workspace
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Search Bar */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* User Avatar Menu Dropdown */}
            <UserMenu />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm font-medium">Loading documents...</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Section 1: Owned Documents */}
            {(activeTab === 'all' || activeTab === 'owned') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>My Documents</span>
                  </h2>
                  <span className="text-xs text-slate-500">{filteredOwned.length} document(s)</span>
                </div>

                {filteredOwned.length === 0 ? (
                  <div className="p-8 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-300">No documents yet</h3>
                      <p className="text-xs text-slate-400 mt-1">Create your first document to get started.</p>
                    </div>
                    <button
                      onClick={handleCreateNewDocument}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-600/20 inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ New document</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredOwned.map((doc) => (
                      <div
                        key={doc._id}
                        onClick={() => navigate(`/documents/${doc._id}`)}
                        className="p-5 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/40 rounded-2xl transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 group-hover:scale-105 transition-transform">
                              <FileText className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                              Owner
                            </span>
                          </div>

                          <h3 className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors text-base line-clamp-1">
                            {doc.title}
                          </h3>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>{formatDate(doc.updatedAt)}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Section 2: Shared With Me Documents */}
            {(activeTab === 'all' || activeTab === 'shared') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Shared With Me</span>
                  </h2>
                  <span className="text-xs text-slate-500">{filteredShared.length} document(s)</span>
                </div>

                {filteredShared.length === 0 ? (
                  <div className="p-8 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-300">No shared documents</h3>
                    <p className="text-xs text-slate-400">No documents have been shared with you yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredShared.map((doc) => (
                      <div
                        key={doc._id}
                        onClick={() => navigate(`/documents/${doc._id}`)}
                        className="p-5 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 group-hover:scale-105 transition-transform">
                              <FileText className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Editor
                            </span>
                          </div>

                          <div>
                            <h3 className="font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors text-base line-clamp-1">
                              {doc.title}
                            </h3>
                            <p className="text-xs text-emerald-400/90 font-medium mt-1">
                              Shared by {doc.owner?.name || 'Team member'}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>{formatDate(doc.updatedAt)}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default DashboardPage;
