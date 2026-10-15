import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { hideConfirm } from '../redux/features/confirmSlice';
import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmBox = () => {
  const dispatch = useDispatch();
  const confirmState = useSelector((state) => state.confirm);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && confirmState.isOpen) {
        dispatch(hideConfirm());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmState.isOpen, dispatch]);

  if (!confirmState.isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15 }}
          className="glass-panel bg-slate-950 border border-indigo-500/30 w-full max-w-sm p-6 shadow-2xl text-center relative"
          style={{ borderRadius: 0 }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />

          <div
            className="w-12 h-12 bg-rose-950/80 border border-rose-700/50 text-rose-400 flex items-center justify-center text-xl mx-auto mb-3"
            style={{ borderRadius: 0 }}
          >
            <FiAlertTriangle />
          </div>

          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white mb-2">
            Confirm Action
          </h3>

          <p className="mb-6 text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">
            {confirmState.message || 'Are you sure you want to proceed?'}
          </p>

          <div className="flex justify-center gap-2.5 font-mono text-xs">
            <button
              type="button"
              onClick={() => dispatch(hideConfirm())}
              className="px-4 py-2 border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold tracking-wider transition cursor-pointer"
              style={{ borderRadius: 0 }}
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof confirmState.onConfirm === 'function') {
                  confirmState.onConfirm();
                }
                dispatch(hideConfirm());
              }}
              style={{
                backgroundColor: confirmState.color || '#e11d48',
                borderRadius: 0,
              }}
              className="px-5 py-2 text-white font-bold tracking-wider uppercase shadow-[0_0_12px_rgba(225,29,72,0.4)] hover:brightness-110 transition cursor-pointer"
            >
              CONFIRM
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmBox;
