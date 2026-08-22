import React, { useState, useEffect } from 'react';
import { X, UserPlus, Shield, Check, Users } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const ShareModal = ({ isOpen, onClose, documentId, documentTitle }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [accessList, setAccessList] = useState({ owner: null, shares: [] });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (isOpen && documentId) {
      fetchAccessData();
      fetchUsers();
    }
  }, [isOpen, documentId]);

  const fetchAccessData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/documents/${documentId}/shares`);
      setAccessList({
        owner: res.data.owner,
        shares: res.data.shares || [],
      });
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to load document permissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Failed to load user list', err);
    }
  };

  const handleShareSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      showError('Please select a user to share with');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/documents/${documentId}/share`, {
        userId: selectedUserId,
        permission: 'EDITOR',
      });
      showSuccess(res.data.message || 'Document shared successfully');
      setSelectedUserId('');
      fetchAccessData();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to share document');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Share Document</h3>
              <p className="text-xs text-slate-400 truncate max-w-[280px]">"{documentTitle}"</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share Form */}
        <form onSubmit={handleShareSubmit} className="space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Add people
          </label>
          <div className="flex gap-2">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
              disabled={submitting}
            >
              <option value="">Select a team member...</option>
              {users.map((u) => (
                <option key={u._id || u.id} value={u._id || u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 text-slate-400 text-xs px-3 rounded-xl">
              <Shield className="w-3.5 h-3.5" />
              <span>Can edit</span>
            </div>
            <button
              type="submit"
              disabled={submitting || !selectedUserId}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center gap-1.5 shrink-0"
            >
              {submitting ? 'Sharing...' : 'Share'}
            </button>
          </div>
        </form>

        {/* People with access */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            People with access
          </h4>

          {loading ? (
            <div className="py-6 text-center text-sm text-slate-500 animate-pulse">
              Loading access list...
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {/* Owner */}
              {accessList.owner && (
                <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
                      {accessList.owner.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        {accessList.owner.name} <span className="text-xs text-slate-500">(You)</span>
                      </p>
                      <p className="text-xs text-slate-400">{accessList.owner.email}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg">
                    Owner
                  </span>
                </div>
              )}

              {/* Shared Users */}
              {accessList.shares.map((share) => (
                <div
                  key={share.id}
                  className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm border border-slate-700">
                      {share.user.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{share.user.name}</p>
                      <p className="text-xs text-slate-400">{share.user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg flex items-center gap-1">
                    <Shield className="w-3 h-3 text-slate-400" />
                    Editor
                  </span>
                </div>
              ))}

              {accessList.shares.length === 0 && (
                <p className="text-xs text-slate-500 italic py-2">
                  No other team members have access yet.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
