import React, { useRef, useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { BsCodeSlash } from "react-icons/bs";
import { FaCameraRetro } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// import html2canvas from 'html2canvas';

const ViewPaste = () => {
  const { pasteId } = useParams();
  const pastes = useSelector((state) => state.pastes.pastes);
  const paste = pastes.find((p) => p.id === pasteId);
  const pasteRef = useRef();
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (paste) {
      setLines(paste.content.split('\n'));
    }
  }, [paste]);

  if (!paste) {
    toast.info('No Paste found!', { autoClose: 3000 });
    return null;
  }


  // const handleSnapshot = async () => {
  //   try {
  //     const canvas = await html2canvas(pasteRef.current, { backgroundColor: "" });
  //     const link = document.createElement('a');
  //     link.href = canvas.toDataURL('image/png');
  //     link.download = 'paste-screenshot.png';
  //     link.click();
  //     toast.success("Screenshot taken!");
  //   } catch (error) {
  //     console.error("Error capturing screenshot:", error);
  //     toast.error("Failed to take screenshot.");
  //   }
  // };

  return (
    <motion.div
    
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-28 flex justify-center px-4"
    >
      <div
        ref={pasteRef}
        className="relative w-full max-w-3xl mx-auto flex flex-col p-4 border rounded-lg shadow-md bg-transparent text-white selection:bg-red-500 selection:text-yellow-400 overflow-x-auto"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-2">{paste.tittle}</h2>
        <div className="border-t border-gray-600 ">

          <BsCodeSlash className='absolute right-4 top-4 text-gray-400' />

          <div className="relative flex">
            <aside className="min-w-[40px] text-right pr-2 pt-4 text-gray-400 border-r border-gray-600">
              {lines.map((_, index) => (
                <div key={index}>{index + 1}</div>
              ))}
            </aside>
            <pre className="whitespace-pre-wrap p-4 flex-1 text-white">{paste.content}</pre>
          </div>
        </div>
      </div>

      <button
  // onClick={handleSnapshot}
  onClick={()=>window.print()}
  className="absolute top-4 right-6 sm:top-60 md:top-10 flex items-center gap-2 px-4 py-2 border rounded bg-indigo-900 text-white hover:bg-indigo-950 cursor-pointer transition"
>
  <FaCameraRetro />
</button>
    </motion.div>
  );
};

export default ViewPaste;
