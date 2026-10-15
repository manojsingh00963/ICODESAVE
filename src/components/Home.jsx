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
        // Try fetching directly from backend
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto px-4 py-6 max-w-5xl"
    >
      {/* Top Header & Metadata Controls */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-6 shadow-xl border border-indigo-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <FiCode className="text-indigo-400" />
              <span>{pasteId ? 'Edit Code Snippet' : 'Create New Snippet'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {pasteId
                ? 'Update your snippet content, language, or tags.'
                : 'Write or paste your code snippet, select the syntax, and store it safely in your vault.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {content && (
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                title="Copy Code"
              >
                {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-rose-950/40 hover:text-rose-300 text-slate-300 transition cursor-pointer"
              title="Clear Editor"
            >
              <FiTrash2 />
              <span className="hidden sm:inline">Clear</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition duration-200 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <PulseLoader color="#ffffff" size={6} />
              ) : (
                <>
                  <FiSave className="text-base" />
                  <span>{pasteId ? 'Update Snippet' : 'Save Snippet'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Inputs Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
          {/* Title Input */}
          <div className="md:col-span-6 relative">
            <input
              type="text"
              placeholder="Snippet title (e.g., QuickSort Implementation, Redis Cache Wrapper)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-white text-sm placeholder:text-slate-500 transition"
              required
            />
          </div>

          {/* Language Selector */}
          <div className="md:col-span-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-white text-sm cursor-pointer transition"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value} className="bg-slate-900 text-white">
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
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-indigo-500/80 text-white text-sm transition cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <FiTag className="text-indigo-400" />
                <span className="truncate">{customTagInput.trim() || tag || 'Select Tag'}</span>
              </div>
              <FiChevronDown
                className={`transition-transform duration-200 ${showTagMenu ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {showTagMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 top-12 z-30 w-64 glass-panel bg-slate-950/95 border border-indigo-500/30 rounded-xl p-3 shadow-2xl flex flex-col gap-2"
                >
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="Custom tag..."
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                    Preset Tags
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                    {PREDEFINED_TAGS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setTag(t);
                          setCustomTagInput('');
                          setShowTagMenu(false);
                        }}
                        className={`px-2.5 py-1 text-xs rounded-lg transition cursor-pointer ${
                          tag === t && !customTagInput
                            ? 'bg-indigo-600 text-white font-medium'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
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

      {/* Code Editor Container */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-indigo-500/20 shadow-2xl bg-slate-950/90">
        {/* Editor Title Bar / Mac Window Dots */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-3 text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <FiFileText />
              <span>{title || 'untitled-snippet'}.{language}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>{lineCount} lines</span>
            <span>{content.length} chars</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 uppercase text-[10px]">
              {language}
            </span>
          </div>
        </div>

        {/* Textarea + Synchronized Line Numbers */}
        <div className="relative flex min-h-[420px] max-h-[650px] overflow-hidden">
          {/* Line Numbers Column */}
          <div
            ref={lineNumbersRef}
            aria-hidden="true"
            className="w-12 sm:w-14 shrink-0 py-4 select-none text-right pr-3 font-mono text-xs text-slate-600 bg-slate-950/60 border-r border-slate-800/60 overflow-hidden"
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
            placeholder="// Paste or write your code here..."
            spellCheck="false"
            className="w-full flex-1 p-4 bg-transparent text-slate-100 font-mono text-xs sm:text-sm leading-6 placeholder:text-slate-600 focus:outline-none resize-none overflow-y-auto"
            required
          />
        </div>

        {/* Keyboard shortcut footnote */}
        <div className="px-4 py-2 bg-slate-900/50 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">S</kbd> to save</span>
          <span className="hidden sm:inline">Automatic cloud persistence</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
