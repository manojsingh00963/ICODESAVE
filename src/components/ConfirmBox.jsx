import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { hideConfirm } from "../redux/features/confirmSlice";

const ConfirmBox = () => {
  const dispatch = useDispatch();
  const confirmState = useSelector((state) => state.confirm);

  if (!confirmState.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 flex justify-center items-center z-50">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white dark:bg-black/60 w-[90%] max-w-[400px] p-6 rounded-lg shadow-xl text-center"
      >
        {/* Message */}
        <p className="mb-4 text-lg font-semibold" style={{ color: confirmState.color }}>
          {confirmState.message}
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => { confirmState.onConfirm(); dispatch(hideConfirm()); }}
            className="px-4 py-2 cursor-pointer rounded text-white font-medium transition duration-200 hover:bg-[#ff0000b2] bg-[#ca4747e1] "
          >
            Confirm
          </button>
          <button 
            onClick={() => dispatch(hideConfirm())} 
            className="px-4 py-2 rounded border cursor-pointer font-medium hover:bg-gray-200 dark:hover:bg-[#9078d7e0] text-white transition duration-200"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmBox;
