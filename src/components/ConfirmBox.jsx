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
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex justify-center items-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.2 }}
          className="glass-panel bg-slate-950/95 border border-indigo-500/30 w-full max-w-sm p-6 rounded-2xl shadow-2xl text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800/50 text-rose-400 flex items-center justify-center text-xl mx-auto mb-3">
            <FiAlertTriangle />
          </div>

          <p className="mb-5 text-sm font-medium text-slate-200 leading-relaxed">
            {confirmState.message || 'Are you sure you want to proceed?'}
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => dispatch(hideConfirm())}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/70 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (typeof confirmState.onConfirm === 'function') {
                  confirmState.onConfirm();
                }
                dispatch(hideConfirm());
              }}
              style={{ backgroundColor: confirmState.color || '#e11d48' }}
              className="px-5 py-2 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-lg hover:opacity-90 transition cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmBox;
