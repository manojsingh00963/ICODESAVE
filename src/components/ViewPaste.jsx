import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiCopy,
  FiCheck,
  FiShare2,
  FiArrowLeft,
  FiDownload,
  FiPrinter,
  FiEdit3,
  FiCalendar,
  FiCode,
  FiUser,
} from 'react-icons/fi';
import { useParams, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getNoteById } from '../redux/features/noteSlice';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';

const ViewPaste = () => {
  const { pasteId } = useParams();
  const dispatch = useDispatch();

  const notes = useSelector((state) => state.notes.notes);
  const currentNote = useSelector((state) => state.notes.currentNote);
  const loadingCurrentNote = useSelector((state) => state.notes.loadingCurrentNote);

  const [copied, setCopied] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Locate note from cache or fetch from backend
  const paste = notes.find((n) => n._id === pasteId) || currentNote;

  useEffect(() => {
    if (!paste && pasteId) {
      dispatch(getNoteById(pasteId))
        .unwrap()
        .catch(() => {
          setNotFound(true);
        });
    }
  }, [paste, pasteId, dispatch]);

  const handleCopy = () => {
    if (paste?.content) {
      navigator.clipboard.writeText(paste.content);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/view/${pasteId}`;
    navigator.clipboard.writeText(url);
    toast.success('Shareable link copied to clipboard! 🔗');
  };

  const handleDownload = () => {
    if (!paste?.content) return;
    const extensions = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      html: 'html',
      json: 'json',
      sql: 'sql',
      cpp: 'cpp',
      java: 'java',
      go: 'go',
      rust: 'rs',
      bash: 'sh',
      markdown: 'md',
    };
    const ext = extensions[paste.language] || 'txt';
    const filename = `${(paste.title || 'snippet').replace(/[^a-z0-9_-]/gi, '_')}.${ext}`;
    const blob = new Blob([paste.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}!`);
  };

  const handlePrint = () => {
    if (!paste?.content) return;
    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (!printWindow) {
      toast.error('Failed to open print preview');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${paste.title || 'Code Snippet'} - ICODESAVE</title>
          <style>
            body {
              font-family: ui-monospace, Menlo, Monaco, Consolas, monospace;
              padding: 30px;
              background: #fff;
              color: #0f172a;
            }
            .header {
              border-bottom: 2px solid #0f172a;
              padding-bottom: 12px;
              margin-bottom: 20px;
            }
            h1 { font-size: 20px; margin: 0 0 6px 0; text-transform: uppercase; }
            .meta { font-size: 11px; color: #475569; text-transform: uppercase; }
            pre {
              white-space: pre-wrap;
              background: #f8fafc;
              border: 1px solid #cbd5e1;
              padding: 16px;
              font-size: 12px;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${paste.title || 'UNTITLED_SNIPPET'}</h1>
            <div class="meta">
              LANGUAGE: ${paste.language || 'text'} | TAG: ${paste.tag || 'CODE'} | ARCHIVED IN ICODESAVE
            </div>
          </div>
          <pre>${paste.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 300);
  };

  if (loadingCurrentNote) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center gap-3">
        <PulseLoader color="#22d3ee" size={8} />
        <p className="text-xs text-slate-400 font-mono uppercase">FETCHING_SNIPPET...</p>
      </div>
    );
  }

  if (notFound || (!paste && !loadingCurrentNote)) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <div className="glass-panel p-8 border border-slate-800 shadow-2xl">
          <div className="w-12 h-12 bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center text-xl mx-auto mb-4">
            <FiCode />
          </div>
          <h2 className="text-lg font-bold font-mono text-white mb-2 uppercase">SNIPPET_NOT_FOUND</h2>
          <p className="text-xs font-mono text-slate-400 mb-6">
            This snippet might have been deleted or the permalink is invalid.
          </p>
          <NavLink
            to="/paste"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/50 shadow-md transition"
          >
            <FiArrowLeft />
            <span>RETURN_TO_VAULT</span>
          </NavLink>
        </div>
      </div>
    );
  }

  const lines = paste?.content ? paste.content.split('\n') : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="container mx-auto px-4 py-6 max-w-5xl"
    >
      {/* Top Header & Actions Bar - Sharp Geometric Brutalist */}
      <div className="glass-panel p-4 sm:p-5 mb-5 shadow-2xl border border-indigo-500/25">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <NavLink
              to="/paste"
              className="p-2.5 border border-slate-800 bg-slate-900 hover:border-slate-600 text-slate-200 transition"
              title="Back to Vault"
            >
              <FiArrowLeft className="text-base" />
            </NavLink>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold font-mono text-white tracking-tight">
                  {paste.title || 'Untitled Snippet'}
                </h1>
                <span className="text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 bg-indigo-950 border border-indigo-700 text-indigo-300 font-bold">
                  {paste.tag || 'CODE'}
                </span>
                {paste.language && (
                  <span className="text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 bg-cyan-950 border border-cyan-700 text-cyan-300 font-bold">
                    {paste.language}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-400 mt-1 font-mono flex-wrap">
                <span className="flex items-center gap-1">
                  <FiCalendar className="text-slate-500" />
                  <span>{new Date(paste.createdAt || Date.now()).toLocaleDateString()}</span>
                </span>
                <span className="text-slate-700">|</span>
                <span>{lines.length} LINES</span>
                {paste.user?.name && (
                  <>
                    <span className="text-slate-700">|</span>
                    <span className="flex items-center gap-1">
                      <FiUser className="text-slate-500" />
                      <span>{paste.user.name}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions - Sharp Buttons */}
          <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto font-mono text-xs">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-800 bg-slate-900 hover:border-slate-600 text-slate-200 transition cursor-pointer"
              title="Copy Code"
            >
              {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
              <span>{copied ? 'COPIED' : 'COPY'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-800 bg-slate-900 hover:border-slate-600 text-slate-200 transition cursor-pointer"
              title="Download Source File"
            >
              <FiDownload />
              <span className="hidden sm:inline">DOWNLOAD</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-800 bg-slate-900 hover:border-slate-600 text-slate-200 transition cursor-pointer"
              title="Print Snippet"
            >
              <FiPrinter />
              <span className="hidden sm:inline">PRINT</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 border border-purple-800/60 bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 transition cursor-pointer"
              title="Copy Share Link"
            >
              <FiShare2 />
              <span>SHARE</span>
            </button>

            <NavLink
              to={`/paste/${paste._id}`}
              className="flex items-center gap-1.5 px-3.5 py-2 font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400 shadow-md transition"
              title="Edit Snippet"
            >
              <FiEdit3 />
              <span>EDIT</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Code Display Area - Sharp Brutalist Terminal */}
      <div className="glass-panel overflow-hidden border border-indigo-500/30 shadow-2xl bg-slate-950">
        {/* Editor Title Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-rose-500 inline-block" />
            <span className="w-2.5 h-2.5 bg-amber-500 inline-block" />
            <span className="w-2.5 h-2.5 bg-emerald-500 inline-block" />
            <span className="ml-3 text-xs font-mono text-slate-400">
              {paste.title || 'snippet'}.{paste.language || 'txt'}
            </span>
          </div>

          <div className="text-xs font-mono text-slate-400">
            <span>READ_ONLY_VIEWER</span>
          </div>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="flex min-h-[400px] overflow-x-auto">
          {/* Line Numbers */}
          <div
            aria-hidden="true"
            className="w-12 sm:w-14 shrink-0 py-4 select-none text-right pr-3 font-mono text-xs text-slate-600 bg-slate-950 border-r border-slate-800"
          >
            {lines.map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Source Code */}
          <pre className="flex-1 p-4 font-mono text-xs sm:text-sm leading-6 text-slate-100 overflow-x-auto whitespace-pre selection:bg-indigo-500/40">
            {paste.content}
          </pre>
        </div>
      </div>
    </motion.div>
  );
};

export default ViewPaste;
