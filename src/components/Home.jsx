import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateToPastes, addToPastes } from '../redux/features/pasteSlice';

const Home = () => {
  const [tittle, setTittle] = useState('');
  const [value, setValue] = useState('');
  const { pasteId } = useParams(); // ✅ Corrected useParams() for dynamic routes
  const allPastes = useSelector((state) => state.pastes.pastes);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ Added navigate function

  const createPaste = () => {
    const paste = {
      tittle,
      content: value,
      id: pasteId || Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };

    if (pasteId) {
      // update
      dispatch(updateToPastes(paste));
    } else {
      // create
      dispatch(addToPastes(paste));
    }

    // After creation or updation, redirect to the paste list
    setTittle('');
    setValue('');
    navigate('/paste'); // ✅ Redirects to paste list after saving
  };

  useEffect(() => {
    if (pasteId) {
      const paste = allPastes.find((p) => p.id === pasteId);
      if (paste) {
        setTittle(paste.tittle);
        setValue(paste.content);
      }
    }
  }, [allPastes, pasteId]);

  return (
    <div>
      <div className="flex flex-row gap-7 place-content-between">
        <input
          className="w-[65%] border rounded-md mt-10 pl-4"
          type="text"
          placeholder="Enter title here"
          value={tittle}
          onChange={(e) => setTittle(e.target.value)}
        />
        <button onClick={createPaste} className="p-2 border rounded mt-10">
          {pasteId ? 'Update My Paste' : 'Create My Paste'}
        </button>
      </div>
      <div>
        <textarea
          className="border rounded-md mt-4 min-w-[500px] p-4"
          value={value}
          placeholder="Enter content here"
          onChange={(e) => setValue(e.target.value)}
          rows={20}
        ></textarea>
      </div>
    </div>
  );
};

export default Home;
