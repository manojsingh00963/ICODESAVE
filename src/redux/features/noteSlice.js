import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosinstance';
import { toast } from 'react-toastify';

// Helper to extract clean error message
const getErrorMessage = (error, defaultMsg) => {
  return error.response?.data?.error || error.response?.data?.message || defaultMsg;
};

// Get all notes for the logged in user
export const getNotes = createAsyncThunk('notes/getNotes', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/notes/fetchnotes');
    return response.data;
  } catch (error) {
    const msg = getErrorMessage(error, 'Failed to fetch notes');
    return rejectWithValue(msg);
  }
});

// Get a single note by ID (for viewing / direct links)
export const getNoteById = createAsyncThunk('notes/getNoteById', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/notes/getnote/${id}`);
    const noteData = response.data.note || response.data;
    return noteData;
  } catch (error) {
    const msg = getErrorMessage(error, 'Failed to fetch note');
    return rejectWithValue(msg);
  }
});

// Add a new note
export const addNote = createAsyncThunk(
  'notes/addNote',
  async ({ title, content, tag, language }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/notes/addnote', {
        title,
        content,
        tag: tag || 'Code',
        language: language || 'javascript',
      });
      toast.success('Snippet saved successfully! ✨');
      return response.data;
    } catch (error) {
      const msg = getErrorMessage(error, 'Failed to save snippet');
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Delete a note
export const deleteNote = createAsyncThunk('notes/deleteNote', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/notes/deletenote/${id}`);
    toast.success('Snippet deleted successfully!');
    return id;
  } catch (error) {
    const msg = getErrorMessage(error, 'Failed to delete snippet');
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

// Edit a note
export const editNote = createAsyncThunk(
  'notes/editNote',
  async ({ id, title, content, tag, language }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/notes/updatenote/${id}`, {
        title,
        content,
        tag,
        language,
      });
      toast.success('Snippet updated successfully! 🚀');
      const updatedNote = response.data.note || response.data;
      return updatedNote;
    } catch (error) {
      const msg = getErrorMessage(error, 'Failed to update snippet');
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Initial state
const initialState = {
  notes: [],
  currentNote: null,
  loading: false,
  loadingCurrentNote: false,
  error: null,
};

// Create Slice
export const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    resetNotes: (state) => {
      state.notes = [];
      state.currentNote = null;
    },
    clearCurrentNote: (state) => {
      state.currentNote = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Notes
      .addCase(getNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Single Note by ID
      .addCase(getNoteById.pending, (state) => {
        state.loadingCurrentNote = true;
        state.error = null;
      })
      .addCase(getNoteById.fulfilled, (state, action) => {
        state.loadingCurrentNote = false;
        state.currentNote = action.payload;
        // Also sync into notes array if not already present
        if (action.payload && action.payload._id) {
          const index = state.notes.findIndex((n) => n._id === action.payload._id);
          if (index !== -1) {
            state.notes[index] = action.payload;
          } else {
            state.notes.push(action.payload);
          }
        }
      })
      .addCase(getNoteById.rejected, (state, action) => {
        state.loadingCurrentNote = false;
        state.error = action.payload;
      })

      // Add Note
      .addCase(addNote.fulfilled, (state, action) => {
        if (action.payload) {
          state.notes.unshift(action.payload);
        }
      })

      // Delete Note
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter((note) => note._id !== action.payload);
        if (state.currentNote?._id === action.payload) {
          state.currentNote = null;
        }
      })

      // Edit Note
      .addCase(editNote.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;
        const noteId = updated._id || updated.note?._id;
        const noteData = updated.note || updated;
        const index = state.notes.findIndex((note) => note._id === noteId);
        if (index !== -1) {
          state.notes[index] = noteData;
        }
        if (state.currentNote?._id === noteId) {
          state.currentNote = noteData;
        }
      });
  },
});

export const { resetNotes, clearCurrentNote } = noteSlice.actions;
export default noteSlice.reducer;
