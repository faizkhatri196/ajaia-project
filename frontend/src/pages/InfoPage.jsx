import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  Server,
  Globe,
  Database,
  Users,
  CheckCircle2,
  ArrowLeft,
  ExternalLink,
  Code,
  Lock,
} from 'lucide-react';

const InfoPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">AJAIA DOCS</h1>
              <p className="text-xs text-slate-400">System Architecture & Production Deployment Info</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-600/20 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </button>
        </div>

        {/* Section 1: Live Deployment Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-lg">
            <div className="flex items-center gap-2.5 text-blue-400 font-semibold text-sm">
              <Globe className="w-5 h-5" />
              <span>Frontend Vercel Deployment</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hosted on Vercel with automatic Vite production bundles and responsive SaaS UI.
            </p>
            <a
              href="https://ajaia-project-five.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 font-medium hover:underline inline-flex items-center gap-1"
            >
              <span>https://ajaia-project-five.vercel.app</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-lg">
            <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-sm">
              <Server className="w-5 h-5" />
              <span>Backend Render API & Database</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Express API running on Render connected to MongoDB Atlas cluster with in-memory fallback.
            </p>
            <a
              href="https://github.com/faizkhatri196/ajaia-project"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-400 font-medium hover:underline inline-flex items-center gap-1"
            >
              <span>GitHub Repository (faizkhatri196/ajaia-project)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Section 2: Demo Credentials */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-lg">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Users className="w-5 h-5 text-blue-400" />
            <span>Seeded Demo User Accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">User</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Password</th>
                  <th className="p-3 rounded-r-xl">Role / Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="p-3 font-semibold text-white">Alex</td>
                  <td className="p-3 font-mono text-blue-400">alex@ajaia.demo</td>
                  <td className="p-3 font-mono text-slate-400">demo123</td>
                  <td className="p-3">Document Owner & Creator</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Sarah</td>
                  <td className="p-3 font-mono text-emerald-400">sarah@ajaia.demo</td>
                  <td className="p-3 font-mono text-slate-400">demo123</td>
                  <td className="p-3">Shared Editor</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">John</td>
                  <td className="p-3 font-mono text-indigo-400">john@ajaia.demo</td>
                  <td className="p-3 font-mono text-slate-400">demo123</td>
                  <td className="p-3">Unauthorized User (Tests 403 Forbidden)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Feature & Architecture Breakdown */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-lg">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Core System Capabilities & Architecture</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2.5 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="font-semibold text-blue-400 flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                <span>Security & Authorization</span>
              </div>
              <ul className="space-y-1.5 text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>HttpOnly Cookie & Bearer JWT Session Tokens</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>10-Round bcrypt Password Hashing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Backend 403 Forbidden Authorization Checks</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Code className="w-4 h-4" />
                <span>Editor & File Engine</span>
              </div>
              <ul className="space-y-1.5 text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>TipTap Rich Text (Headings, Bold, Lists, Underline)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Debounced Autosave + Real-time Status Badge</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Import Plain Text (.txt) & Markdown (.md) up to 5MB</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 4: Automated Testing Summary */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Database className="w-5 h-5 text-indigo-400" />
              <span>Automated API Integration Tests (Vitest)</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
              7 / 7 Passed (100%)
            </span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 space-y-1">
            <p className="text-emerald-400">✓ 1. Valid login sets HttpOnly cookie & returns safe user</p>
            <p className="text-emerald-400">✓ 2. Invalid password returns 401 generic error</p>
            <p className="text-emerald-400">✓ 3. Unauthenticated request returns 401 Unauthorized</p>
            <p className="text-emerald-400">✓ 4. Owner creates document & shares with Sarah</p>
            <p className="text-emerald-400">✓ 5. Owner & Sarah access document (200 OK)</p>
            <p className="text-emerald-400">✓ 6. John requests Alex document without permission (403 Forbidden)</p>
            <p className="text-emerald-400">✓ 7. Logout API clears authentication cookie (200 OK)</p>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
          >
            Back to Sign In
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-600/20"
          >
            Open Workspace
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
