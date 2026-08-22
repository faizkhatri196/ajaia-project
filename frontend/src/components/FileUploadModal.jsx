import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, UploadCloud, FileText, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const FileUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { showSuccess, showError } = useToast();

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    validateAndSetFile(selected);
  };

  const validateAndSetFile = (selectedFile) => {
    setErrorMsg('');
    if (!selectedFile) {
      setFile(null);
      return;
    }

    const fileName = selectedFile.name.toLowerCase();
    const isSupported = fileName.endsWith('.txt') || fileName.endsWith('.md');

    if (!isSupported) {
      const err = 'File type not supported. Only .txt and .md files are allowed.';
      setErrorMsg(err);
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      const err = 'File is too large. Maximum allowed size is 5MB.';
      setErrorMsg(err);
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showSuccess('File imported successfully');
      onClose();
      if (onUploadSuccess) {
        onUploadSuccess(res.data.document);
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to upload document';
      setErrorMsg(msg);
      showError(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Import Document</h3>
              <p className="text-xs text-slate-400">Supported formats: .txt, .md (Max 5MB)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-3 ${
              file
                ? 'border-blue-500/50 bg-blue-500/5'
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/50'
            }`}
          >
            <input
              type="file"
              accept=".txt,.md"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                <FileText className="w-6 h-6" />
              </div>
              {file ? (
                <div>
                  <p className="text-sm font-medium text-blue-400 truncate max-w-[240px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-slate-300">
                    Click to browse or drag & drop file
                  </p>
                  <p className="text-xs text-slate-500 mt-1">.TXT or Markdown (.MD)</p>
                </div>
              )}
            </label>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || uploading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center gap-2"
            >
              {uploading ? 'Importing...' : 'Import Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileUploadModal;
