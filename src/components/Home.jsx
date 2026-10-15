import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSave,
  FiCheck,
  FiCopy,
  FiTrash2,
  FiCode,
  FiTag,
  FiChevronDown,
  FiFileText,
} from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editNote, addNote, getNotes, getNoteById } from '../redux/features/noteSlice';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';

const PREDEFINED_TAGS = ['Code', 'React', 'Backend', 'Frontend', 'Algorithm', 'Utility', 'Database', 'Personal'];

const LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'HTML/CSS', value: 'html' },
  { label: 'JSON', value: 'json' },
  { label: 'SQL', value: 'sql' },
  { label: 'C / C++', value: 'cpp' },
  { label: 'Java', value: 'java' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'Bash / Shell', value: 'bash' },
  { label: 'Markdown', value: 'markdown' },
];

const Home = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('Code');
  const [language, setLanguage] = useState('javascript');
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const { pasteId } = useParams();
  const notes = useSelector((state) => state.notes.notes);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Fetch all notes on initial load if empty
  useEffect(() => {
    if (notes.length === 0) {
      dispatch(getNotes());
    }
  }, [dispatch, notes.length]);

  // Handle editing mode when pasteId is present
  useEffect(() => {
    if (pasteId) {
      const existing = notes.find((n) => n._id === pasteId);
      if (existing) {
        setTitle(existing.title || '');
        setContent(existing.content || '');
        setTag(existing.tag || 'Code');
        setLanguage(existing.language || 'javascript');
      } else {
        dispatch(getNoteById(pasteId))
          .unwrap()
          .then((fetched) => {
            if (fetched) {
              setTitle(fetched.title || '');
              setContent(fetched.content || '');
              setTag(fetched.tag || 'Code');
              setLanguage(fetched.language || 'javascript');
            }
          })
          .catch(() => {
            toast.error('Snippet not found!');
            navigate('/paste');
          });
      }
    }
  }, [pasteId, notes, dispatch, navigate]);

  // Synchronize line numbers scroll with textarea scroll
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Keyboard shortcut: Ctrl+S or Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleCopyCode = () => {
    if (!content.trim()) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (!content && !title) return;
    if (window.confirm('Clear current snippet?')) {
      setTitle('');
      setContent('');
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title for your snippet');
      return;
    }
    if (!content.trim()) {
      toast.error('Snippet content cannot be empty');
      return;
    }

    setSubmitting(true);
    const activeTag = (customTagInput.trim() || tag || 'Code').slice(0, 20);

    try {
      if (pasteId) {
        await dispatch(
          editNote({
            id: pasteId,
            title: title.trim(),
            content,
            tag: activeTag,
            language,
          })
        ).unwrap();
      } else {
        await dispatch(
          addNote({
            title: title.trim(),
            content,
            tag: activeTag,
            language,
          })
        ).unwrap();
      }
      navigate('/paste');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const lineCount = Math.max(content.split('\n').length, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="container mx-auto px-4 py-6 max-w-5xl"
    >
      {/* Top Header & Metadata Controls - Sharp Brutalist Glass */}
      <div className="glass-panel p-4 sm:p-5 mb-5 shadow-2xl border border-indigo-500/25">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-cyan-400 inline-block shadow-[0_0_8px_#22d3ee]" />
              <span>{pasteId ? 'EDIT_SNIPPET' : 'CREATE_SNIPPET'}</span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              {pasteId
                ? 'Modify code contents, syntax grammar, and tags.'
                : 'Write code, select syntax grammar, and save to your sharp cloud vault.'}
            </p>
          </div>

          {/* Action Buttons - Sharp Corners */}
          <div className="flex items-center gap-2 self-end md:self-auto font-mono text-xs">
            {content && (
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-700 bg-slate-900 hover:border-slate-500 text-slate-200 transition cursor-pointer"
                title="Copy Code"
              >
                {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-800 bg-slate-900/80 hover:border-rose-700 hover:text-rose-400 text-slate-400 transition cursor-pointer"
              title="Clear Editor"
            >
              <FiTrash2 />
              <span className="hidden sm:inline">CLEAR</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white border border-cyan-400/50 shadow-[0_0_15px_rgba(99,102,241,0.35)] transition cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <PulseLoader color="#ffffff" size={6} />
              ) : (
                <>
                  <FiSave className="text-sm" />
                  <span>{pasteId ? 'UPDATE' : 'SAVE_SNIPPET'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Inputs Bar - Sharp Borders */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 pt-1">
          {/* Title Input */}
          <div className="md:col-span-6 relative">
            <input
              type="text"
              placeholder="Snippet title (e.g. Binary Search, Redis Queue Worker)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-xs sm:text-sm font-mono placeholder:text-slate-600 transition"
              required
            />
          </div>

          {/* Language Selector */}
          <div className="md:col-span-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-xs sm:text-sm font-mono cursor-pointer transition uppercase"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value} className="bg-slate-950 text-white">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Dropdown & Custom Tag */}
          <div className="md:col-span-3 relative">
            <button
              type="button"
              onClick={() => setShowTagMenu(!showTagMenu)}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-white text-xs sm:text-sm font-mono transition cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <FiTag className="text-cyan-400" />
                <span className="truncate uppercase">{customTagInput.trim() || tag || 'TAG'}</span>
              </div>
              <FiChevronDown
                className={`transition-transform duration-200 ${showTagMenu ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {showTagMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 top-11 z-30 w-64 glass-panel bg-slate-950 border border-indigo-500/40 p-3 shadow-2xl flex flex-col gap-2"
                >
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="Custom tag name..."
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest px-0.5">
                    Select Preset
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
                    {PREDEFINED_TAGS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setTag(t);
                          setCustomTagInput('');
                          setShowTagMenu(false);
                        }}
                        className={`px-2 py-1 text-xs font-mono uppercase transition cursor-pointer border ${
                          tag === t && !customTagInput
                            ? 'bg-indigo-600 text-white border-indigo-400 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Code Editor Container - Sharp Brutalist Terminal */}
      <div className="glass-panel overflow-hidden border border-indigo-500/30 shadow-2xl bg-slate-950">
        {/* Editor Title Bar - Sharp Terminal Squares */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-rose-500 inline-block" />
            <span className="w-2.5 h-2.5 bg-amber-500 inline-block" />
            <span className="w-2.5 h-2.5 bg-emerald-500 inline-block" />
            <span className="ml-3 text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <FiFileText />
              <span>{title || 'untitled-snippet'}.{language}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>{lineCount} LINES</span>
            <span>{content.length} CHARS</span>
            <span className="px-2 py-0.5 bg-indigo-950/80 border border-indigo-700/60 text-cyan-300 uppercase text-[10px] font-bold">
              {language}
            </span>
          </div>
        </div>

        {/* Textarea + Synchronized Line Numbers */}
        <div className="relative flex min-h-[440px] max-h-[680px] overflow-hidden">
          {/* Line Numbers Column - Sharp Border */}
          <div
            ref={lineNumbersRef}
            aria-hidden="true"
            className="w-12 sm:w-14 shrink-0 py-4 select-none text-right pr-3 font-mono text-xs text-slate-600 bg-slate-950 border-r border-slate-800 overflow-hidden"
          >
            {Array.from({ length: lineCount }).map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onScroll={handleScroll}
            placeholder="// Paste or write your source code here..."
            spellCheck="false"
            className="w-full flex-1 p-4 bg-transparent text-slate-100 font-mono text-xs sm:text-sm leading-6 placeholder:text-slate-700 focus:outline-none resize-none overflow-y-auto"
            required
          />
        </div>

        {/* Footnote */}
        <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Shortcuts: <kbd className="px-1 py-0.5 bg-slate-800 text-slate-300 border border-slate-700">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-slate-800 text-slate-300 border border-slate-700">S</kbd> to save</span>
          <span>Zero-Lag Cloud Encryption</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
