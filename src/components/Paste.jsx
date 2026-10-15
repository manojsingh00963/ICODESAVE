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
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'alpha'
  const [copiedId, setCopiedId] = useState(null);

  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes.notes);
  const loading = useSelector((state) => state.notes.loading);

  // Fetch notes on mount
  useEffect(() => {
    dispatch(getNotes());
  }, [dispatch]);

  // Extract unique tags for tag filter pills
  const availableTags = useMemo(() => {
    const tags = new Set(['All']);
    notes.forEach((n) => {
      if (n.tag) tags.add(n.tag);
    });
    return Array.from(tags);
  }, [notes]);

  // Filter and sort notes
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
        // Default: newest first
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [notes, searchTerm, selectedTag, sortBy]);

  // Handle delete with confirmation modal
  const handleDelete = (id, title) => {
    dispatch(
      showConfirm({
        message: `Delete snippet "${title || 'Untitled'}"? This action cannot be undone.`,
        color: '#f43f5e',
        onConfirm: () => dispatch(deleteNote(id)),
      })
    );
  };

  // Handle share URL
  const handleShare = (id) => {
    const url = `${window.location.origin}/view/${id}`;
    navigator.clipboard.writeText(url);
    toast.success('Shareable link copied to clipboard! 🔗');
  };

  // Handle copy code
  const handleCopy = (id, content) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto px-4 py-6 max-w-7xl flex flex-col"
    >
      {/* Header & Controls Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-6 shadow-xl border border-indigo-500/20 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <FiCode className="text-cyan-400" />
              <span>My Snippets</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 font-mono">
                {filteredNotes.length}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Search, filter, edit, and share your cloud code snippets.
            </p>
          </div>

          <NavLink
            to="/"
            className="flex items-center gap-1.5 px-4 py-2 self-start sm:self-auto text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition duration-200"
          >
            <FiPlus className="text-base" />
            <span>New Snippet</span>
          </NavLink>
        </div>

        {/* Search & Sort Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
          {/* Search Box */}
          <div className="md:col-span-8 relative">
            <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-base" />
            <input
              type="text"
              placeholder="Search by title, tag, or code content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-white text-sm placeholder:text-slate-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-4 flex items-center gap-2">
            <FiFilter className="text-slate-400 shrink-0 hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-white text-sm cursor-pointer transition"
            >
              <option value="newest" className="bg-slate-900 text-white">
                Newest First
              </option>
              <option value="oldest" className="bg-slate-900 text-white">
                Oldest First
              </option>
              <option value="alpha" className="bg-slate-900 text-white">
                Title (A-Z)
              </option>
            </select>
          </div>
        </div>

        {/* Tag Filter Pills */}
        {availableTags.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {availableTags.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`px-3 py-1 text-xs rounded-lg transition-all cursor-pointer shrink-0 ${
                  selectedTag === t
                    ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
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
          <PulseLoader color="#6366f1" size={10} />
          <p className="text-xs text-slate-400 font-mono">Loading snippets...</p>
        </div>
      )}

      {/* Snippet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredNotes.map((note) => {
            const previewLines = (note.content || '').split('\n').slice(0, 4).join('\n');
            const totalLines = (note.content || '').split('\n').length;

            return (
              <motion.div
                key={note._id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="glass-card rounded-2xl p-4 flex flex-col justify-between shadow-xl transition-all duration-200 group relative"
              >
                <div>
                  {/* Card Header: Title & Badges */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2
                      className="text-base font-bold text-white tracking-tight line-clamp-1 group-hover:text-indigo-300 transition-colors"
                      title={note.title}
                    >
                      {note.title || 'Untitled Snippet'}
                    </h2>
                    <span className="shrink-0 text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 font-medium">
                      {note.tag || 'Code'}
                    </span>
                  </div>

                  {/* Date & Language Info */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-3 font-mono">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="text-slate-500" />
                      <span>{new Date(note.createdAt || Date.now()).toLocaleDateString()}</span>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span>{totalLines} {totalLines === 1 ? 'line' : 'lines'}</span>
                    {note.language && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="text-cyan-400 capitalize">{note.language}</span>
                      </>
                    )}
                  </div>

                  {/* Code Preview Box */}
                  <div className="rounded-xl p-3 bg-slate-950/80 border border-slate-800/80 mb-4 overflow-hidden relative">
                    <pre className="font-mono text-xs text-slate-300 whitespace-pre overflow-x-auto scrollbar-none leading-5 max-h-24">
                      {previewLines}
                    </pre>
                    {totalLines > 4 && (
                      <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-900 mt-1">
                        + {totalLines - 4} more lines
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <div className="flex items-center gap-1.5">
                    {/* View */}
                    <NavLink
                      to={`/view/${note._id}`}
                      className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/30 rounded-lg transition"
                      title="View Snippet"
                    >
                      <FiEye className="text-base" />
                    </NavLink>

                    {/* Edit */}
                    <NavLink
                      to={`/paste/${note._id}`}
                      className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-950/30 rounded-lg transition"
                      title="Edit Snippet"
                    >
                      <FiEdit3 className="text-base" />
                    </NavLink>

                    {/* Share */}
                    <button
                      type="button"
                      onClick={() => handleShare(note._id)}
                      className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-950/30 rounded-lg transition cursor-pointer"
                      title="Share Link"
                    >
                      <FiShare2 className="text-base" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(note._id, note.title)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition cursor-pointer"
                      title="Delete Snippet"
                    >
                      <FiTrash2 className="text-base" />
                    </button>
                  </div>

                  {/* Quick Copy Snippet */}
                  <button
                    type="button"
                    onClick={() => handleCopy(note._id, note.content)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-lg border border-slate-700/80 bg-slate-800/60 hover:bg-slate-700 hover:text-white text-slate-300 transition cursor-pointer"
                    title="Copy full code"
                  >
                    {copiedId === note._id ? (
                      <>
                        <FiCheck className="text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <FiCopy />
                        <span>Copy</span>
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
        <div className="glass-panel rounded-2xl p-12 text-center my-8 flex flex-col items-center justify-center max-w-lg mx-auto border border-dashed border-slate-700">
          <div className="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-700/40 flex items-center justify-center text-indigo-400 text-2xl mb-4">
            <FiCode />
          </div>
          <h2 className="text-lg font-bold text-white mb-1">
            {searchTerm || selectedTag !== 'All' ? 'No matching snippets found' : 'No snippets saved yet'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-5 max-w-xs">
            {searchTerm || selectedTag !== 'All'
              ? 'Try adjusting your search terms or filter tags to find what you are looking for.'
              : 'Save your first code snippet and access it anytime across all your devices.'}
          </p>
          <NavLink
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition"
          >
            <FiPlus className="text-base" />
            <span>Create a Snippet</span>
          </NavLink>
        </div>
      )}
    </motion.div>
  );
};

export default Paste;
