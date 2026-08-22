import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import TipTapEditor from '../editor/TipTapEditor';
import ShareModal from '../components/ShareModal';
import UserMenu from '../components/UserMenu';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Share2,
  Trash2,
  Shield,
  User,
  Loader2,
  Lock,
} from 'lucide-react';

const EditorPage = () => {
  const { id: docId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [document, setDocument] = useState(null);
  const [userAccess, setUserAccess] = useState({ isOwner: false, permission: null });
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error'
  const [errorState, setErrorState] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Reference for debounce timer
  const autosaveTimerRef = useRef(null);

  useEffect(() => {
    fetchDocumentDetails();
  }, [docId]);

  const fetchDocumentDetails = async () => {
    setLoading(true);
    setErrorState(null);
    try {
      const res = await api.get(`/documents/${docId}`);
      setDocument(res.data.document);
      setUserAccess(res.data.userAccess);
      setTitle(res.data.document.title);
      setContent(res.data.document.content);
      setSaveStatus('saved');
    } catch (err) {
      const status = err.response?.status;
      const errorMsg =
        err.response?.data?.error ||
        (status === 403
          ? "You don't have permission to access this document."
          : 'Failed to load document');
      setErrorState({ status, message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  // Perform document update call
  const saveDocument = useCallback(
    async (newTitle, newContent) => {
      setSaveStatus('saving');
      try {
        const res = await api.put(`/documents/${docId}`, {
          title: newTitle,
          content: newContent,
        });
        setDocument(res.data.document);
        setSaveStatus('saved');
      } catch (err) {
        console.error('Save failed:', err);
        setSaveStatus('error');
        showError('Failed to save document changes');
      }
    },
    [docId, showError]
  );

  // Debounced autosave trigger
  const triggerAutosave = useCallback(
    (updatedTitle, updatedContent) => {
      setSaveStatus('saving');
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
      autosaveTimerRef.current = setTimeout(() => {
        saveDocument(updatedTitle, updatedContent);
      }, 1500);
    },
    [saveDocument]
  );

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    triggerAutosave(newTitle, content);
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
    triggerAutosave(title, newContent);
  };

  const handleManualSave = () => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
    saveDocument(title, content);
  };

  const handleDeleteDocument = async () => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }
    setDeleting(true);
    try {
      await api.delete(`/documents/${docId}`);
      showSuccess('Document deleted');
      navigate('/dashboard');
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to delete document');
      setDeleting(false);
    }
  };

  // Render error screen (e.g. 403 Forbidden or 404 Not Found)
  if (errorState) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
            {errorState.status === 403 ? <Lock className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
          <h2 className="text-xl font-bold text-white">
            {errorState.status === 403 ? 'Access Denied (403)' : 'Document Unavailable'}
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">{errorState.message}</p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-blue-600/20 inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-sm font-medium">Opening document...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header Bar */}
      <header className="h-16 bg-slate-900/90 border-b border-slate-800 px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
        {/* Left Section: Back button & Editable Title */}
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 flex items-center gap-2 overflow-hidden">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Untitled document"
              className="bg-transparent text-white font-semibold text-lg hover:bg-slate-800/50 focus:bg-slate-950 border border-transparent focus:border-slate-800 rounded-lg px-2.5 py-1 focus:outline-none transition-all w-full truncate"
            />
          </div>
        </div>

        {/* Right Section: Status Indicator, Action Buttons, User Menu */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Save Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            {saveStatus === 'saving' && (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                <span className="text-blue-400">Saving...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Saved ✓</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-rose-400">Save failed</span>
              </>
            )}
          </div>

          {/* Access Level Badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700">
            {userAccess.isOwner ? (
              <>
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Owned by {document?.owner?.name || 'You'}</span>
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Shared by {document?.owner?.name || 'Owner'}</span>
              </>
            )}
          </div>

          {/* Explicit Save Button */}
          <button
            onClick={handleManualSave}
            className="p-2 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            title="Save changes now"
          >
            <Save className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Share Button (Owner Only) */}
          {userAccess.isOwner && (
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          )}

          {/* Delete Button (Owner Only) */}
          {userAccess.isOwner && (
            <button
              onClick={handleDeleteDocument}
              disabled={deleting}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
              title="Delete document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* User Avatar Menu Dropdown */}
          <UserMenu />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-5xl w-full mx-auto flex flex-col">
        <TipTapEditor
          content={content}
          onChange={handleContentChange}
          readOnly={userAccess.permission !== 'OWNER' && userAccess.permission !== 'EDITOR'}
        />
      </main>

      {/* Share Modal */}
      {userAccess.isOwner && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          documentId={docId}
          documentTitle={title}
        />
      )}
    </div>
  );
};

export default EditorPage;
