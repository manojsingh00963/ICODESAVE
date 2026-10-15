import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiCopy,
  FiCheck,
  FiEdit3,
  FiEye,
  FiShare2,
  FiSearch,
  FiTrash2,
  FiPlus,
  FiFilter,
  FiCode,
  FiCalendar,
} from 'react-icons/fi';
import { deleteNote, getNotes } from '../redux/features/noteSlice';
import { showConfirm } from '../redux/features/confirmSlice';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PulseLoader } from 'react-spinners';

const Paste = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [copiedId, setCopiedId] = useState(null);

  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes.notes);
  const loading = useSelector((state) => state.notes.loading);

  useEffect(() => {
    dispatch(getNotes());
  }, [dispatch]);

  const availableTags = useMemo(() => {
    const tags = new Set(['All']);
    notes.forEach((n) => {
      if (n.tag) tags.add(n.tag);
    });
    return Array.from(tags);
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        const matchesSearch =
          (note.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (note.tag || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (note.content || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTag = selectedTag === 'All' || note.tag === selectedTag;

        return matchesSearch && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') {
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        }
        if (sortBy === 'alpha') {
          return (a.title || '').localeCompare(b.title || '');
        }
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [notes, searchTerm, selectedTag, sortBy]);

  const handleDelete = (id, title) => {
    dispatch(
      showConfirm({
        message: `Delete snippet "${title || 'Untitled'}"? This action cannot be undone.`,
        color: '#f43f5e',
        onConfirm: () => dispatch(deleteNote(id)),
      })
    );
  };

  const handleShare = (id) => {
    const url = `${window.location.origin}/view/${id}`;
    navigator.clipboard.writeText(url);
    toast.success('Shareable link copied to clipboard! 🔗');
  };

  const handleCopy = (id, content) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="container mx-auto px-4 py-6 max-w-7xl flex flex-col"
    >
      {/* Header & Controls Bar - Sharp Brutalist Glass */}
      <div className="glass-panel p-4 sm:p-5 mb-5 shadow-2xl border border-indigo-500/25 flex flex-col gap-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-cyan-400 inline-block shadow-[0_0_8px_#22d3ee]" />
              <span>VAULT_SNIPPETS</span>
              <span className="text-[11px] px-2 py-0.5 bg-slate-900 border border-slate-700 text-cyan-300 font-mono">
                {filteredNotes.length} TOTAL
              </span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Instant search, multi-language filtering, and snippet archives.
            </p>
          </div>

          <NavLink
            to="/"
            className="flex items-center gap-1.5 px-4 py-2 self-start sm:self-auto text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white border border-cyan-400/50 shadow-[0_0_15px_rgba(99,102,241,0.35)] transition"
          >
            <FiPlus className="text-sm" />
            <span>NEW_SNIPPET</span>
          </NavLink>
        </div>

        {/* Search & Sort Controls - Sharp Borders */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 pt-1">
          {/* Search Box */}
          <div className="md:col-span-8 relative">
            <FiSearch className="absolute left-3 top-2.5 text-slate-500 text-sm" />
            <input
              type="text"
              placeholder="Search by title, tag, or code grammar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-14 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-xs sm:text-sm font-mono placeholder:text-slate-600 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2 text-[10px] font-mono text-slate-400 hover:text-white uppercase"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-4 flex items-center gap-2">
            <FiFilter className="text-slate-500 shrink-0 hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-xs sm:text-sm font-mono cursor-pointer transition uppercase"
            >
              <option value="newest" className="bg-slate-950 text-white">
                NEWEST FIRST
              </option>
              <option value="oldest" className="bg-slate-950 text-white">
                OLDEST FIRST
              </option>
              <option value="alpha" className="bg-slate-950 text-white">
                TITLE (A-Z)
              </option>
            </select>
          </div>
        </div>

        {/* Tag Filter Pills - Sharp Blocks */}
        {availableTags.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
            {availableTags.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider transition cursor-pointer shrink-0 border ${
                  selectedTag === t
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.4)] font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {loading && notes.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <PulseLoader color="#22d3ee" size={8} />
          <p className="text-xs text-slate-400 font-mono">LOADING_SNIPPETS...</p>
        </div>
      )}

      {/* Snippet Grid - Sharp Geometric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <AnimatePresence>
          {filteredNotes.map((note) => {
            const previewLines = (note.content || '').split('\n').slice(0, 4).join('\n');
            const totalLines = (note.content || '').split('\n').length;

            return (
              <motion.div
                key={note._id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="glass-card p-4 flex flex-col justify-between shadow-xl border border-slate-800 hover:border-indigo-500/60 transition group relative bg-slate-950/85"
              >
                <div>
                  {/* Card Header: Title & Badges */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2
                      className="text-sm font-bold font-mono text-white tracking-tight line-clamp-1 group-hover:text-cyan-300 transition-colors"
                      title={note.title}
                    >
                      {note.title || 'Untitled Snippet'}
                    </h2>
                    <span className="shrink-0 text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 bg-indigo-950 border border-indigo-700 text-indigo-300 font-bold">
                      {note.tag || 'CODE'}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-2.5 text-[10px] text-slate-400 mb-2.5 font-mono">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="text-slate-500" />
                      <span>{new Date(note.createdAt || Date.now()).toLocaleDateString()}</span>
                    </span>
                    <span className="text-slate-700">|</span>
                    <span>{totalLines} {totalLines === 1 ? 'LINE' : 'LINES'}</span>
                    {note.language && (
                      <>
                        <span className="text-slate-700">|</span>
                        <span className="text-cyan-400 uppercase font-semibold">{note.language}</span>
                      </>
                    )}
                  </div>

                  {/* Code Preview Box - Sharp Terminal */}
                  <div className="p-3 bg-black border border-slate-900 mb-3 overflow-hidden relative">
                    <pre className="font-mono text-xs text-slate-300 whitespace-pre overflow-x-auto scrollbar-none leading-5 max-h-24">
                      {previewLines}
                    </pre>
                    {totalLines > 4 && (
                      <div className="text-[9px] font-mono text-slate-600 pt-1 border-t border-slate-900 mt-1 uppercase">
                        + {totalLines - 4} more lines
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1">
                    {/* View */}
                    <NavLink
                      to={`/view/${note._id}`}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/30 border border-transparent hover:border-cyan-900/40 transition"
                      title="View Snippet"
                    >
                      <FiEye className="text-sm" />
                    </NavLink>

                    {/* Edit */}
                    <NavLink
                      to={`/paste/${note._id}`}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-950/30 border border-transparent hover:border-indigo-900/40 transition"
                      title="Edit Snippet"
                    >
                      <FiEdit3 className="text-sm" />
                    </NavLink>

                    {/* Share */}
                    <button
                      type="button"
                      onClick={() => handleShare(note._id)}
                      className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-purple-950/30 border border-transparent hover:border-purple-900/40 transition cursor-pointer"
                      title="Share Link"
                    >
                      <FiShare2 className="text-sm" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(note._id, note.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/40 transition cursor-pointer"
                      title="Delete Snippet"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>

                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={() => handleCopy(note._id, note.content)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono border border-slate-800 bg-slate-900 hover:border-slate-700 hover:text-white text-slate-300 transition cursor-pointer"
                    title="Copy full code"
                  >
                    {copiedId === note._id ? (
                      <>
                        <FiCheck className="text-emerald-400" />
                        <span className="text-emerald-400">COPIED</span>
                      </>
                    ) : (
                      <>
                        <FiCopy />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {!loading && filteredNotes.length === 0 && (
        <div className="glass-panel p-10 text-center my-8 flex flex-col items-center justify-center max-w-lg mx-auto border border-dashed border-slate-800">
          <div className="w-12 h-12 bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-cyan-400 text-xl mb-3">
            <FiCode />
          </div>
          <h2 className="text-base font-bold font-mono text-white mb-1 uppercase tracking-wider">
            {searchTerm || selectedTag !== 'All' ? 'NO_MATCHING_SNIPPETS' : 'VAULT_IS_EMPTY'}
          </h2>
          <p className="text-xs font-mono text-slate-400 mb-5 max-w-xs">
            {searchTerm || selectedTag !== 'All'
              ? 'Try adjusting query filters or selecting All tags.'
              : 'Save your first code snippet to access it anywhere.'}
          </p>
          <NavLink
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border border-cyan-400/50 shadow-md transition"
          >
            <FiPlus className="text-sm" />
            <span>CREATE_SNIPPET</span>
          </NavLink>
        </div>
      )}
    </motion.div>
  );
};

export default Paste;
